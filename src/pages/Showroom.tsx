import React, { useState } from 'react';
import { mockProducts } from '@/lib/mockData';
import { Product } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ShoppingCart,
  Eye,
  Edit,
  Search,
  Filter,
  Star,
  Ruler,
  Palette,
  Package
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Showroom: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [showFilters, setShowFilters] = useState(false);

  // Filter products
  React.useEffect(() => {
    let filtered = products;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(p => p.type === selectedType);
    }

    // Price filter
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    setFilteredProducts(filtered);
  }, [searchQuery, selectedType, priceRange, products]);

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'premium': return 'bg-gradient-wood text-primary-foreground';
      case 'standard': return 'bg-secondary text-secondary-foreground';
      case 'economy': return 'bg-muted text-muted-foreground';
      default: return '';
    }
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { text: 'Out of Stock', color: 'destructive' };
    if (quantity < 5) return { text: 'Low Stock', color: 'secondary' };
    return { text: 'In Stock', color: 'default' };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-poppins font-bold text-foreground">Furniture Showroom</h1>
        <p className="text-muted-foreground mt-1">Browse our premium furniture collection</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search furniture..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-full lg:w-[200px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="bed">Beds</SelectItem>
            <SelectItem value="sofa">Sofas</SelectItem>
            <SelectItem value="table">Tables</SelectItem>
            <SelectItem value="cupboard">Cupboards</SelectItem>
            <SelectItem value="chair">Chairs</SelectItem>
            <SelectItem value="wardrobe">Wardrobes</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Price Range Filter (collapsible) */}
      {showFilters && (
        <Card className="p-4">
          <div className="space-y-4">
            <div>
              <Label>Price Range: KSh {priceRange[0].toLocaleString()} - KSh {priceRange[1].toLocaleString()}</Label>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={200000}
                step={5000}
                className="mt-2"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Products Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => {
          const stockStatus = getStockStatus(product.stockQuantity);
          return (
            <Card key={product.id} className="group hover:shadow-hover transition-all duration-300 overflow-hidden">
              <CardHeader className="p-0">
                <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.featured && (
                    <Badge className="absolute top-2 left-2 bg-gradient-forest">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  <Badge
                    className={`absolute top-2 right-2`}
                    variant={stockStatus.color as any}
                  >
                    {stockStatus.text}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-4">
                <h3 className="font-poppins font-semibold text-lg">{product.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mt-3">
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      KSh {product.price.toLocaleString()}
                    </p>
                  </div>
                  <Badge className={getQualityColor(product.quality)}>
                    {product.quality}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Palette className="h-3 w-3" />
                    {product.color}
                  </div>
                  <div className="flex items-center gap-1">
                    <Package className="h-3 w-3" />
                    {product.stockQuantity} units
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setSelectedProduct(product)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                {user?.role === 'attendant' && (
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-forest hover:opacity-90"
                    disabled={product.stockQuantity === 0}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add to Sale
                  </Button>
                )}
                {user?.role === 'manager' && (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-poppins">{selectedProduct?.name}</DialogTitle>
            <DialogDescription>{selectedProduct?.description}</DialogDescription>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="space-y-4">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <img
                  src={selectedProduct.images[0]}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-muted-foreground">Dimensions</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Ruler className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {selectedProduct.measurements.width} × {selectedProduct.measurements.height} × {selectedProduct.measurements.depth}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">Color</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Palette className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{selectedProduct.color}</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">Quality Grade</Label>
                    <Badge className={`mt-1 ${getQualityColor(selectedProduct.quality)}`}>
                      {selectedProduct.quality.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-muted-foreground">Price</Label>
                    <p className="text-3xl font-bold text-primary mt-1">
                      KSh {selectedProduct.price.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">Stock Status</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{selectedProduct.stockQuantity} units available</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">Supplier</Label>
                    <p className="font-medium mt-1">{selectedProduct.supplier}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                {user?.role === 'attendant' && (
                  <Button
                    className="flex-1 bg-gradient-forest hover:opacity-90"
                    disabled={selectedProduct.stockQuantity === 0}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Sale
                  </Button>
                )}
                {user?.role === 'manager' && (
                  <Button variant="secondary" className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Product
                  </Button>
                )}
                <Button variant="outline" onClick={() => setSelectedProduct(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Showroom;