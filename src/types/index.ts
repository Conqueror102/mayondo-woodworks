export type UserRole = 'manager' | 'attendant';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  type: 'bed' | 'sofa' | 'table' | 'cupboard' | 'chair' | 'wardrobe';
  price: number;
  costPrice?: number;
  images: string[];
  measurements: {
    width: string;
    height: string;
    depth: string;
  };
  color: string;
  quality: 'premium' | 'standard' | 'economy';
  stockQuantity: number;
  supplier?: string;
  description?: string;
  featured?: boolean;
}

export interface WoodProduct {
  id: string;
  name: string;
  type: 'timber' | 'poles' | 'hardwood' | 'softwood';
  supplier: string;
  costPrice: number;
  sellingPrice: number;
  stockQuantity: number;
  unit: string;
  dateReceived: string;
  description?: string;
}

export interface Sale {
  id: string;
  customerId: string;
  customerName: string;
  products: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  transportSurcharge: number;
  total: number;
  paymentType: 'cash' | 'cheque' | 'overdraft';
  date: string;
  attendantId: string;
  attendantName: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  totalPurchases: number;
  lastPurchase?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email?: string;
  address: string;
  products: string[];
  rating: number;
}

export interface DashboardStats {
  totalSales: number;
  todaySales: number;
  totalProducts: number;
  lowStockItems: number;
  topProducts: {
    name: string;
    sales: number;
  }[];
  recentSales: Sale[];
}