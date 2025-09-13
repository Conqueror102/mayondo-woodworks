import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  DollarSign,
  Users,
  ShoppingCart,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { mockSales, mockProducts, woodProducts } from '@/lib/mockData';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Calculate stats
  const todaySales = mockSales.filter(s => s.date === new Date().toISOString().split('T')[0]);
  const totalSalesAmount = mockSales.reduce((sum, sale) => sum + sale.total, 0);
  const lowStockProducts = [...mockProducts, ...woodProducts].filter(p => p.stockQuantity < 5);
  
  const topProducts = [
    { name: 'Royal Oak King Bed', sales: 12, trend: 'up' },
    { name: 'Modern L-Shape Sofa', sales: 8, trend: 'up' },
    { name: 'Mahogany Dining Table', sales: 6, trend: 'down' },
    { name: 'Executive Office Chair', sales: 15, trend: 'up' },
  ];

  const statsCards = [
    {
      title: 'Total Sales',
      value: `KSh ${totalSalesAmount.toLocaleString()}`,
      description: 'This month',
      icon: DollarSign,
      trend: '+12.5%',
      trendUp: true,
    },
    {
      title: "Today's Sales",
      value: todaySales.length.toString(),
      description: 'Transactions today',
      icon: ShoppingCart,
      trend: '+3 from yesterday',
      trendUp: true,
    },
    {
      title: 'Total Products',
      value: (mockProducts.length + woodProducts.length).toString(),
      description: 'In inventory',
      icon: Package,
      trend: 'Stable',
      trendUp: null,
    },
    {
      title: 'Low Stock Items',
      value: lowStockProducts.length.toString(),
      description: 'Need restocking',
      icon: AlertTriangle,
      trend: '2 critical',
      trendUp: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-poppins font-bold text-foreground">
          Welcome back, {user?.name}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening at Mayondo Wood & Furniture today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => (
          <Card key={index} className="shadow-card hover:shadow-hover transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              {stat.trend && (
                <div className="flex items-center mt-2">
                  {stat.trendUp !== null && (
                    stat.trendUp ? (
                      <ArrowUpRight className="h-4 w-4 text-secondary mr-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-destructive mr-1" />
                    )
                  )}
                  <span className={`text-xs ${
                    stat.trendUp === true ? 'text-secondary' : 
                    stat.trendUp === false ? 'text-destructive' : 
                    'text-muted-foreground'
                  }`}>
                    {stat.trend}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Products */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Best performers this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-forest rounded-lg flex items-center justify-center text-secondary-foreground font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
                  </div>
                </div>
                {product.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-secondary" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-destructive" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Low Stock Alert</CardTitle>
            <CardDescription>Items that need immediate attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {lowStockProducts.slice(0, 4).map((product, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{product.name}</p>
                  <Badge variant={product.stockQuantity < 3 ? 'destructive' : 'secondary'}>
                    {product.stockQuantity} left
                  </Badge>
                </div>
                <Progress 
                  value={(product.stockQuantity / 20) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Sales */}
      {user?.role === 'manager' && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>Latest transactions in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockSales.slice(0, 5).map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-wood rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{sale.customerName}</p>
                      <p className="text-sm text-muted-foreground">
                        {sale.products.map(p => p.productName).join(', ')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        by {sale.attendantName} • {new Date(sale.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">KSh {sale.total.toLocaleString()}</p>
                    <Badge variant="outline" className="mt-1">
                      {sale.paymentType}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions for Attendant */}
      {user?.role === 'attendant' && (
        <Card className="shadow-card bg-gradient-warm">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <button className="p-6 bg-card rounded-lg hover:shadow-hover transition-all text-center group">
                <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
                <p className="font-medium">New Sale</p>
                <p className="text-sm text-muted-foreground">Create a new sale</p>
              </button>
              <button className="p-6 bg-card rounded-lg hover:shadow-hover transition-all text-center group">
                <Package className="h-8 w-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
                <p className="font-medium">Check Stock</p>
                <p className="text-sm text-muted-foreground">View inventory</p>
              </button>
              <button className="p-6 bg-card rounded-lg hover:shadow-hover transition-all text-center group">
                <Activity className="h-8 w-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
                <p className="font-medium">View Sales</p>
                <p className="text-sm text-muted-foreground">Today's transactions</p>
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;