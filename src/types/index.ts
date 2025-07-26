// Re-export tipos de categorías y productos
export * from './categories';
export * from './rfq';

// Usuario Empresa
export interface User {
  id: number;
  email: string;
  password?: string;
  
  // Información de la empresa
  companyName: string;
  taxId: string; // NIT/RUC
  operationCountry: string;
  industry: string;
  
  // Contacto principal
  contactName: string;
  contactPosition: string;
  contactPhone: string;
  
  // Dirección fiscal
  fiscalAddress: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  
  // Estado del usuario
  isVerified: boolean;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  userType: 'buyer' | 'supplier' | 'both';
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: Omit<User, 'password'>;
  token?: string;
}

// Producto
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Carrito
export interface CartItem {
  id: number;
  userId: number;
  productId: string;
  product?: Product;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Cart {
  userId: number;
  items: CartItem[];
  total: number;
}

// Pedido
export interface Order {
  id: number;
  userId: number;
  status: OrderStatus;
  total: number;
  shippingAddress: string;
  paymentMethod: string;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export interface CreateOrderData {
  shippingAddress: string;
  paymentMethod: string;
}

// Respuestas API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}
