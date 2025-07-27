// Tipos para el sistema de RFQ (Request for Quotation)

export interface FreightQuote {
  id: string;
  origin: string;
  destination: string;
  containerType: string;
  estimatedDate: string;
  specialRequirements?: string;
  selectedCarrier?: {
    name: string;
    cost: number;
    currency: string;
    transitTime: number;
    incoterm: string;
    conditions: string[];
    availability: string;
  };
  cost: number;
  currency: string;
  createdAt: string;
}

export interface RFQRequest {
  id?: string;
  productId: string;
  productName: string;
  productDescription: string;
  supplierId: string;
  supplierName: string;
  
  // Información del solicitante
  requesterId?: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone?: string;
  companyName?: string;
  
  // Detalles de la cotización
  containerQuantity: number;
  containerType: '20GP' | '40GP' | '40HC' | '45HC';
  incoterm: 'EXW' | 'FOB' | 'CIF' | 'CFR' | 'DDP' | 'DAP';
  incotermDescription: string;
  
  // Fechas y tiempos
  tentativeDeliveryDate: string;
  requestDate: string;
  responseDeadline: string;
  
  // Comentarios y requisitos
  logisticsComments?: string;
  specialRequirements?: string;
  
  // Estado y seguimiento
  status: 'pending' | 'quoted' | 'accepted' | 'rejected' | 'expired';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Información adicional
  estimatedValue?: number;
  currency?: string;
  
  // Información de flete (nueva)
  freightQuote?: FreightQuote;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  
  // Respuesta del proveedor (opcional)
  supplierResponse?: RFQResponse;
}

export interface RFQResponse {
  rfqId: string;
  supplierId: string;
  
  // Cotización
  unitPrice: number;
  totalPrice: number;
  currency: string;
  
  // Términos de entrega
  deliveryTime: number; // días
  deliveryTerms: string;
  validityPeriod: number; // días
  
  // Condiciones de pago
  paymentTerms: string;
  minimumOrderQuantity: number;
  
  // Comentarios del proveedor
  supplierComments?: string;
  technicalSpecifications?: string;
  
  // Archivos adjuntos (URLs)
  attachments?: string[];
  
  // Estado y seguimiento
  status: 'draft' | 'submitted' | 'accepted' | 'rejected';
  
  // Timestamps
  responseDate: string;
  validUntil: string;
}

export interface RFQCreateRequest {
  productId: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone?: string;
  companyName?: string;
  containerQuantity: number;
  containerType: '20GP' | '40GP' | '40HC' | '45HC';
  incoterm: 'EXW' | 'FOB' | 'CIF' | 'CFR' | 'DDP' | 'DAP';
  tentativeDeliveryDate: string;
  logisticsComments?: string;
  specialRequirements?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  freightQuote?: FreightQuote;
}

export interface RFQUpdateRequest {
  status?: 'pending' | 'quoted' | 'accepted' | 'rejected' | 'expired';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  logisticsComments?: string;
  specialRequirements?: string;
  supplierResponse?: RFQResponse;
  freightQuote?: FreightQuote;
}

export interface RFQFilter {
  status?: string[];
  priority?: string[];
  supplierId?: string;
  requesterId?: string;
  productId?: string;
  containerType?: string[];
  incoterm?: string[];
  dateFrom?: string;
  dateTo?: string;
  minValue?: number;
  maxValue?: number;
}

export interface RFQStats {
  total: number;
  pending: number;
  quoted: number;
  accepted: number;
  rejected: number;
  expired: number;
  averageResponseTime: number; // horas
  totalValue: number;
  currency: string;
}

// Tipos para notificaciones de RFQ
export interface RFQNotification {
  id: string;
  rfqId: string;
  type: 'new_rfq' | 'rfq_response' | 'rfq_accepted' | 'rfq_rejected' | 'rfq_expired';
  recipientId: string;
  recipientType: 'supplier' | 'buyer';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// Constantes para el sistema RFQ
export const RFQ_STATUS = {
  PENDING: 'pending',
  QUOTED: 'quoted',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  EXPIRED: 'expired'
} as const;

export const RFQ_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
} as const;

export const CONTAINER_TYPES = {
  '20GP': '20GP',
  '40GP': '40GP',
  '40HC': '40HC',
  '45HC': '45HC'
} as const;

export const INCOTERMS = {
  EXW: 'EXW',
  FOB: 'FOB',
  CIF: 'CIF',
  CFR: 'CFR',
  DDP: 'DDP',
  DAP: 'DAP'
} as const;

export const INCOTERM_DESCRIPTIONS = {
  EXW: 'Ex Works - El vendedor entrega cuando pone la mercancía a disposición del comprador en sus instalaciones',
  FOB: 'Free on Board - El vendedor entrega la mercancía a bordo del buque designado por el comprador',
  CIF: 'Cost, Insurance & Freight - El vendedor paga flete y seguro hasta el puerto de destino',
  CFR: 'Cost and Freight - El vendedor paga el flete hasta el puerto de destino',
  DDP: 'Delivered Duty Paid - El vendedor entrega la mercancía en el lugar convenido, con todos los gastos pagados',
  DAP: 'Delivered at Place - El vendedor entrega cuando la mercancía se pone a disposición en el lugar convenido'
} as const;
