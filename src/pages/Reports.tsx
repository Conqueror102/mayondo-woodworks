import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { FileText, Download, TrendingUp, DollarSign, Package, Users, Calendar, BarChart3, PieChart, Activity } from 'lucide-react';
import { mockSales, mockProducts, woodProducts } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { addDays, format } from 'date-fns';
import { DateRange } from 'react-day-picker';

const DatePickerWithRange = ({ date, onDateChange }: { date: DateRange | undefined; onDateChange: (date: DateRange | undefined) => void }) => {
  return (
    <div className="flex gap-2">
      <Input
        type="date"
        value={date?.from ? format(date.from, 'yyyy-MM-dd') : ''}
        onChange={(e) => {
          const newDate = e.target.value ? new Date(e.target.value) : undefined;
          onDateChange({
            from: newDate,
            to: date?.to
          });
        }}
        placeholder="Start date"
      />
      <Input
        type="date"
        value={date?.to ? format(date.to, 'yyyy-MM-dd') : ''}
        onChange={(e) => {
          const newDate = e.target.value ? new Date(e.target.value) : undefined;
          onDateChange({
            from: date?.from,
            to: newDate
          });
        }}
        placeholder="End date"
      />
    </div>
  );
};

const Reports: React.FC = () => {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [reportType, setReportType] = useState<string>('daily');

  const handleExport = (format: 'pdf' | 'excel') => {
    toast({
      title: "Export Started",
      description: `Exporting report as ${format.toUpperCase()}...`,
    });
  };

  // Calculate stats
  const totalRevenue = mockSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalOrders = mockSales.length;
  const avgOrderValue = totalRevenue / totalOrders;
  const totalStockValue = mockProducts.reduce((sum, p) => sum + (p.price * p.stockQuantity), 0) +
                          woodProducts.reduce((sum, p) => sum + (p.sellingPrice * p.stockQuantity), 0);

  // Group sales by date for chart data
  const salesByDate = mockSales.reduce((acc, sale) => {
    const date = sale.date;
    if (!acc[date]) {
      acc[date] = { date, sales: 0, revenue: 0 };
    }
    acc[date].sales += 1;
    acc[date].revenue += sale.total;
    return acc;
  }, {} as Record<string, { date: string; sales: number; revenue: number }>);

  const chartData = Object.values(salesByDate);

  // Top products
  const productSales = mockSales.flatMap(sale => sale.products).reduce((acc, item) => {
    if (!acc[item.productName]) {
      acc[item.productName] = { name: item.productName, quantity: 0, revenue: 0 };
    }
    acc[item.productName].quantity += item.quantity;
    acc[item.productName].revenue += item.total;
    return acc;
  }, {} as Record<string, { name: string; quantity: number; revenue: number }>);

  const topProducts = Object.values(productSales).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold font-poppins text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-2">View comprehensive business insights and reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => handleExport('excel')}>
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Date Range Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Report Period</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <DatePickerWithRange date={dateRange} onDateChange={setDateRange} />
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">UGX {totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-success flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +12.5% from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-success flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +8% from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Average Order
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">UGX {Math.round(avgOrderValue).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Per transaction</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Package className="h-4 w-4" />
              Stock Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">UGX {totalStockValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Current inventory</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Sales Report</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Report</TabsTrigger>
          <TabsTrigger value="products">Product Performance</TabsTrigger>
          <TabsTrigger value="attendants">Attendant Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>Daily sales performance for the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Number of Sales</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Payment Methods</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chartData.map((day) => (
                    <TableRow key={day.date}>
                      <TableCell>{format(new Date(day.date), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>{day.sales}</TableCell>
                      <TableCell>UGX {day.revenue.toLocaleString()}</TableCell>
                      <TableCell>Cash, Cheque</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
              <CardDescription>Current stock levels and values</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Total Value</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell className="capitalize">{product.type}</TableCell>
                      <TableCell>{product.stockQuantity}</TableCell>
                      <TableCell>UGX {product.price.toLocaleString()}</TableCell>
                      <TableCell>UGX {(product.price * product.stockQuantity).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={product.stockQuantity > 5 ? 'default' : product.stockQuantity > 0 ? 'secondary' : 'destructive'}>
                          {product.stockQuantity > 5 ? 'In Stock' : product.stockQuantity > 0 ? 'Low Stock' : 'Out of Stock'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>Best selling products by revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Units Sold</TableHead>
                    <TableHead>Revenue Generated</TableHead>
                    <TableHead>Percentage of Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.map((product) => (
                    <TableRow key={product.name}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>UGX {product.revenue.toLocaleString()}</TableCell>
                      <TableCell>{((product.revenue / totalRevenue) * 100).toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendant Performance</CardTitle>
              <CardDescription>Sales performance by attendant</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Attendant Name</TableHead>
                    <TableHead>Number of Sales</TableHead>
                    <TableHead>Total Revenue</TableHead>
                    <TableHead>Average Sale Value</TableHead>
                    <TableHead>Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Mary Wanjiru</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>UGX 89,250</TableCell>
                    <TableCell>UGX 89,250</TableCell>
                    <TableCell>
                      <Badge variant="default">Excellent</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Peter Ochieng</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>UGX 170,100</TableCell>
                    <TableCell>UGX 170,100</TableCell>
                    <TableCell>
                      <Badge variant="default">Outstanding</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;