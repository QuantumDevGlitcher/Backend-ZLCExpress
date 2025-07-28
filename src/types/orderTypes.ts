export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  containerType: string;
  quantity: number;
  unitsPerContainer: number;
  price: number;
  product?: any; // Para incluir los datos del producto cuando se necesiten
}

export interface Order {
  id: number;
  userId: number;
  status: OrderStatus;
  total: number;
  shippingAddress: string;
  paymentMethod: string;
  notes?: string;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderData {
  shippingAddress: string;
  paymentMethod: string;
  notes?: string;
}
