export interface OrderFilters {
  status?: string;
  supplierId?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  orderType?: 'quote' | 'purchase_order';
  search?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  quoteId?: string;
  supplierId: string;
  supplierName: string;
  companyId: string;
  status:
    | "pending"
    | "confirmed"
    | "in_production"
    | "shipped"
    | "in_transit"
    | "customs"
    | "delivered"
    | "completed"
    | "cancelled";
  orderType: "quote" | "purchase_order";
  containers: OrderContainer[];
  totalAmount: number;
  currency: string;
  incoterm: "FOB" | "CIF" | "CFR" | "EXW";
  paymentConditions: string;
  createdAt: Date;
  updatedAt: Date;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  shippingData?: {
    shippingLine: string;
    containerNumber: string;
    blNumber: string;
    vesselName: string;
    etd: Date;
    eta: Date;
    trackingUrl?: string;
  };
  keyDates: {
    proformaIssued?: Date;
    paymentConfirmed?: Date;
    productionStarted?: Date;
    departed?: Date;
    arrived?: Date;
    delivered?: Date;
  };
  documents: OrderDocument[];
  payments: PaymentRecord[];
}

export interface OrderContainer {
  id: string;
  orderId: string;
  productId: string;
  productTitle: string;
  containerType: "20'" | "40'";
  quantity: number;
  unitPrice: number;
  subtotal: number;
  specifications: Record<string, string>;
}

export interface OrderDocument {
  id: string;
  orderId: string;
  type:
    | "commercial_invoice"
    | "packing_list"
    | "bill_of_lading"
    | "certificate"
    | "customs_declaration"
    | "payment_receipt";
  title: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface PaymentRecord {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  method: "bank_transfer" | "letter_of_credit" | "cash" | "check";
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  reference: string;
  paidAt?: Date;
  notes?: string;
}