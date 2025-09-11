import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, Filter, Package, AlertTriangle, Plus, Edit2, TrendingUp, TrendingDown } from 'lucide-react';
import { woodProducts } from '@/lib/mockData';
import { WoodProduct } from '@/types';
import { useToast } from '@/hooks/use-toast';

const Warehouse: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [supplierFilter, setSupplierFilter] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<WoodProduct | null>(null);
  const [updateQuantity, setUpdateQuantity] = useState<number>(0);
  const { toast } = useToast();

  const filteredProducts = woodProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || product.type === typeFilter;
    const matchesSupplier = supplierFilter === 'all' || product.supplier === supplierFilter;
    const matchesAvailability = availabilityFilter === 'all' ||
      (availabilityFilter === 'available' && product.quantity > 0) ||
      (availabilityFilter === 'lowStock' && product.quantity > 0 && product.quantity <= 10) ||
      (availabilityFilter === 'outOfStock' && product.quantity === 0);

    return matchesSearch && matchesType && matchesSupplier && matchesAvailability;
  });

  const uniqueSuppliers = Array.from(new Set(woodProducts.map(p => p.supplier)));

  const handleUpdateStock = () => {
    if (selectedProduct && updateQuantity > 0) {
      toast({
        title: "Stock Updated",
        description: `${selectedProduct.name} stock updated to ${updateQuantity} ${selectedProduct.unit}`,
      });
      setSelectedProduct(null);
      setUpdateQuantity(0);
    }
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: 'Out of Stock', variant: 'destructive' as const };
    if (quantity <= 10) return { label: 'Low Stock', variant: 'warning' as const };
    return { label: 'In Stock', variant: 'success' as const };
  };

  const totalValue = filteredProducts.reduce((sum, product) => sum + (product.sellingPrice * product.quantity), 0);
  const lowStockItems = woodProducts.filter(p => p.quantity > 0 && p.quantity <= 10).length;
  const outOfStockItems = woodProducts.filter(p => p.quantity === 0).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold font-poppins text-foreground">Warehouse Management</h1>
        <p className="text-muted-foreground">Manage your wood inventory and track stock levels</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{woodProducts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">UGX {totalValue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-warning">{lowStockItems}</span>
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-destructive">{outOfStockItems}</span>
              <TrendingDown className="h-5 w-5 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products or suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Product Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="timber">Timber</SelectItem>
                <SelectItem value="poles">Poles</SelectItem>
                <SelectItem value="hardwood">Hardwood</SelectItem>
                <SelectItem value="softwood">Softwood</SelectItem>
              </SelectContent>
            </Select>
            <Select value={supplierFilter} onValueChange={setSupplierFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Supplier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Suppliers</SelectItem>
                {uniqueSuppliers.map(supplier => (
                  <SelectItem key={supplier} value={supplier}>{supplier}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="available">In Stock</SelectItem>
                <SelectItem value="lowStock">Low Stock</SelectItem>
                <SelectItem value="outOfStock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => {
          const stockStatus = getStockStatus(product.quantity);
          return (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription className="mt-1">
                      <span className="text-xs">Supplier: {product.supplier}</span>
                    </CardDescription>
                  </div>
                  <Badge className={
                    stockStatus.variant === 'destructive' ? 'bg-destructive text-destructive-foreground' :
                    stockStatus.variant === 'warning' ? 'bg-warning text-warning-foreground' :
                    'bg-success text-success-foreground'
                  }>{stockStatus.label}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <p className="font-medium capitalize">{product.type}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Quantity:</span>
                    <p className="font-medium">{product.quantity} {product.unit}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Cost Price:</span>
                    <p className="font-medium">UGX {product.costPrice.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Selling Price:</span>
                    <p className="font-medium">UGX {product.sellingPrice.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Received: {new Date(product.dateReceived).toLocaleDateString()}
                </div>

                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          setSelectedProduct(product);
                          setUpdateQuantity(product.quantity);
                        }}
                      >
                        <Edit2 className="h-4 w-4 mr-1" />
                        Update Stock
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update Stock - {product.name}</DialogTitle>
                        <DialogDescription>
                          Update the quantity for this product
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div>
                          <Label htmlFor="quantity">New Quantity ({product.unit})</Label>
                          <Input
                            id="quantity"
                            type="number"
                            value={updateQuantity}
                            onChange={(e) => setUpdateQuantity(Number(e.target.value))}
                            min="0"
                          />
                        </div>
                        <Button onClick={handleUpdateStock} className="w-full">
                          Update Stock
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="default" size="sm" className="flex-1">
                    <Plus className="h-4 w-4 mr-1" />
                    Order More
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <Alert>
          <Package className="h-4 w-4" />
          <AlertDescription>
            No products found matching your filters.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default Warehouse;