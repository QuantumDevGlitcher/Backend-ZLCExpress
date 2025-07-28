export interface ShippingQuoteRequest {
  originPort: string;
  destinationPort: string;
  containerType: string;
  containerCount: number;
  estimatedShippingDate: Date;
  cargoValue: number;
  incoterm: string;
}

export interface ShippingQuote {
  id: number;
  orderId?: number | null;
  userId: number;
  originPort: string;
  destinationPort: string;
  containerType: string;
  containerCount: number;
  carrier: string;
  carrierCode: string;
  serviceType: string;
  cost: number;
  currency: string;
  transitTime: number; // días
  estimatedDeparture: Date;
  estimatedArrival: Date;
  validUntil: Date;
  incoterm: string;
  conditions?: string;
  isSelected: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShippingCarrier {
  code: string;
  name: string;
  serviceTypes: string[];
  rating: number;
  logo?: string;
}

export interface ShippingRoute {
  originPort: string;
  destinationPort: string;
  distance: number;
  averageTransitTime: number;
}

export interface OrderWithShipping {
  id: number;
  orderNumber: string;
  buyerId: number;
  status: string;
  totalAmount: number;
  currency: string;
  
  // Información de shipping
  shippingAddress?: string;
  paymentMethod?: string;
  originPort?: string;
  destinationPort?: string;
  containerType?: string;
  estimatedShippingDate?: Date;
  shippingCost?: number;
  shippingCarrier?: string;
  transitTime?: number;
  incoterm?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // Relaciones
  orderDetails?: any[];
  shippingQuotes?: ShippingQuote[];
}
