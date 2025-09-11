import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShoppingCart, Plus, Receipt, Calendar, DollarSign, TrendingUp, User } from 'lucide-react';
import { mockProducts, mockCustomers, mockSales } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Sales: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [cart, setCart] = useState<Array<{ productId: string; quantity: number; }>>([]);
  const [paymentType, setPaymentType] = useState<string>('cash');
  const [needsDelivery, setNeedsDelivery] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  const addToCart = (productId: string) => {
    const existingItem = cart.find(item => item.productId === productId);
    if (existingItem) {
      setCart(cart.map(item => 
        item.productId === productId 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { productId, quantity: 1 }]);
    }
    toast({
      title: "Added to cart",
      description: "Product added to the sale cart",
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      setCart(cart.filter(item => item.productId !== productId));
    } else {
      setCart(cart.map(item => 
        item.productId === productId 
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => {
      const product = mockProducts.find(p => p.id === item.productId);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);
    const transportSurcharge = needsDelivery ? subtotal * 0.05 : 0;
    return { subtotal, transportSurcharge, total: subtotal + transportSurcharge };
  };

  const completeSale = () => {
    if (!customerName || !customerPhone) {
      toast({
        title: "Missing Information",
        description: "Please fill in customer details",
        variant: "destructive",
      });
      return;
    }

    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add products to the cart",
        variant: "destructive",
      });
      return;
    }

    const { total } = calculateTotal();
    toast({
      title: "Sale Completed",
      description: `Sale of UGX ${total.toLocaleString()} completed successfully`,
    });

    // Reset form
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
    setSelectedCustomer('');
    setNeedsDelivery(false);
  };

  const { subtotal, transportSurcharge, total } = calculateTotal();

  // Stats
  const todaysSales = mockSales.filter(sale => sale.date === new Date().toISOString().split('T')[0]);
  const todaysRevenue = todaysSales.reduce((sum, sale) => sum + sale.total, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold font-poppins text-foreground">Sales Management</h1>
        <p className="text-muted-foreground">Create and manage sales transactions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaysSales.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">UGX {todaysRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Sale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              UGX {todaysSales.length > 0 ? Math.round(todaysRevenue / todaysSales.length).toLocaleString() : '0'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="new-sale" className="space-y-4">
        <TabsList>
          <TabsTrigger value="new-sale">New Sale</TabsTrigger>
          <TabsTrigger value="history">Sales History</TabsTrigger>
        </TabsList>

        <TabsContent value="new-sale" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Product Selection */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Select Products</CardTitle>
                  <CardDescription>Add products to the sale</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mockProducts.map((product) => (
                        <Card key={product.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-semibold">{product.name}</h4>
                                <p className="text-sm text-muted-foreground capitalize">{product.type}</p>
                              </div>
                              <Badge variant={product.stockQuantity > 0 ? "default" : "destructive"}>
                                {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of Stock'}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-bold">UGX {product.price.toLocaleString()}</span>
                              <Button
                                size="sm"
                                onClick={() => addToCart(product.id)}
                                disabled={product.stockQuantity === 0}
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Add
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Cart & Customer Info */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Cart
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cart.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No items in cart</p>
                  ) : (
                    <div className="space-y-2">
                      {cart.map((item) => {
                        const product = mockProducts.find(p => p.id === item.productId);
                        if (!product) return null;
                        return (
                          <div key={item.productId} className="flex justify-between items-center">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{product.name}</p>
                              <p className="text-xs text-muted-foreground">
                                UGX {product.price.toLocaleString()} × {item.quantity}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 0)}
                                className="w-16"
                                min="0"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>UGX {subtotal.toLocaleString()}</span>
                    </div>
                    {needsDelivery && (
                      <div className="flex justify-between text-sm">
                        <span>Transport (5%):</span>
                        <span>UGX {transportSurcharge.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>UGX {total.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="existing-customer">Existing Customer</Label>
                    <Select value={selectedCustomer} onValueChange={(value) => {
                      setSelectedCustomer(value);
                      const customer = mockCustomers.find(c => c.id === value);
                      if (customer) {
                        setCustomerName(customer.name);
                        setCustomerPhone(customer.phone);
                        setCustomerAddress(customer.address || '');
                      }
                    }}>
                      <SelectTrigger id="existing-customer">
                        <SelectValue placeholder="Select customer or add new" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New Customer</SelectItem>
                        {mockCustomers.map(customer => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Customer name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+256 7XX XXX XXX"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Delivery address (optional)"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="delivery"
                      checked={needsDelivery}
                      onCheckedChange={(checked) => setNeedsDelivery(!!checked)}
                    />
                    <Label htmlFor="delivery">Needs Delivery (5% surcharge)</Label>
                  </div>

                  <div>
                    <Label htmlFor="payment">Payment Method</Label>
                    <Select value={paymentType} onValueChange={setPaymentType}>
                      <SelectTrigger id="payment">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="cheque">Cheque</SelectItem>
                        <SelectItem value="overdraft">Overdraft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={completeSale} className="w-full" size="lg">
                    <Receipt className="h-4 w-4 mr-2" />
                    Complete Sale
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>View and manage recent sales transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Attendant</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
                      <TableCell>{sale.customerName}</TableCell>
                      <TableCell>{sale.products.length} items</TableCell>
                      <TableCell>UGX {sale.total.toLocaleString()}</TableCell>
                      <TableCell className="capitalize">{sale.paymentType}</TableCell>
                      <TableCell>{sale.attendantName}</TableCell>
                      <TableCell>
                        <Badge variant={sale.status === 'completed' ? 'default' : 'secondary'}>
                          {sale.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sales;