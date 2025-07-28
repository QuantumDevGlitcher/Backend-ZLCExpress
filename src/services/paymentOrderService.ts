// services/paymentOrderService.ts
// Servicio para manejar órdenes de pago

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreatePaymentOrderData {
  quoteId: number;
  buyerId: number;
  totalAmount: number;
  currency: string;
  paymentMethod: string;
}

export interface PaymentOrderWithDetails {
  id: number;
  orderNumber: string;
  quoteId: number;
  buyerId: number;
  totalAmount: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: string;
  paypalPaymentId?: string;
  paypalPayerId?: string;
  paypalToken?: string;
  createdAt: Date;
  paidAt?: Date;
  expiresAt: Date;
  quote: {
    id: number;
    quoteNumber: string;
    productTitle: string;
    totalPrice: number;
    status: string;
    paymentTerms?: string;
    logisticsComments?: string;
    buyer: {
      id: number;
      companyName: string;
      email: string;
      contactName: string;
    };
    supplier: {
      id: number;
      companyName: string;
      email: string;
      contactName: string;
    };
    quoteItems: any[];
    freightQuote?: any;
  };
}

export class PaymentOrderService {
  // Crear una nueva orden de pago
  static async createPaymentOrder(data: CreatePaymentOrderData): Promise<PaymentOrderWithDetails> {
    try {
      console.log('💳 PaymentOrderService: Creando orden de pago para cotización', data.quoteId);

      // Generar número de orden único
      const orderNumber = `PO-${Date.now()}`;
      
      // Calcular fecha de expiración (24 horas)
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const paymentOrder = await (prisma as any).paymentOrder.create({
        data: {
          orderNumber,
          quoteId: data.quoteId,
          buyerId: data.buyerId,
          totalAmount: data.totalAmount,
          currency: data.currency,
          paymentMethod: data.paymentMethod,
          paymentStatus: 'PENDING' as any,
          expiresAt
        },
        include: {
          quote: {
            include: {
              buyer: {
                select: { 
                  id: true, 
                  companyName: true, 
                  email: true, 
                  contactName: true 
                }
              },
              supplier: {
                select: { 
                  id: true, 
                  companyName: true, 
                  email: true, 
                  contactName: true 
                }
              },
              quoteItems: true,
              freightQuote: true
            }
          }
        }
      });

      console.log('✅ PaymentOrderService: Orden de pago creada exitosamente:', paymentOrder.orderNumber);
      return paymentOrder as PaymentOrderWithDetails;

    } catch (error) {
      console.error('❌ PaymentOrderService: Error creando orden de pago:', error);
      throw error;
    }
  }

  // Obtener orden de pago por ID
  static async getPaymentOrderById(orderId: number): Promise<PaymentOrderWithDetails | null> {
    try {
      console.log('💳 PaymentOrderService: Obteniendo orden de pago', orderId);

      const paymentOrder = await (prisma as any).paymentOrder.findUnique({
        where: { id: orderId },
        include: {
          quote: {
            include: {
              buyer: {
                select: { 
                  id: true, 
                  companyName: true, 
                  email: true, 
                  contactName: true 
                }
              },
              supplier: {
                select: { 
                  id: true, 
                  companyName: true, 
                  email: true, 
                  contactName: true 
                }
              },
              quoteItems: true,
              freightQuote: true
            }
          }
        }
      });

      console.log('✅ PaymentOrderService: Orden de pago obtenida:', paymentOrder ? paymentOrder.orderNumber : 'no encontrada');
      return paymentOrder as PaymentOrderWithDetails | null;

    } catch (error) {
      console.error('❌ PaymentOrderService: Error obteniendo orden de pago:', error);
      throw error;
    }
  }

  // Obtener orden de pago por número de orden
  static async getPaymentOrderByNumber(orderNumber: string): Promise<PaymentOrderWithDetails | null> {
    try {
      console.log('💳 PaymentOrderService: Obteniendo orden de pago por número', orderNumber);

      const paymentOrder = await (prisma as any).paymentOrder.findUnique({
        where: { orderNumber },
        include: {
          quote: {
            include: {
              buyer: {
                select: { 
                  id: true, 
                  companyName: true, 
                  email: true, 
                  contactName: true 
                }
              },
              supplier: {
                select: { 
                  id: true, 
                  companyName: true, 
                  email: true, 
                  contactName: true 
                }
              },
              quoteItems: true,
              freightQuote: true
            }
          }
        }
      });

      console.log('✅ PaymentOrderService: Orden de pago obtenida:', paymentOrder ? paymentOrder.orderNumber : 'no encontrada');
      return paymentOrder as PaymentOrderWithDetails | null;

    } catch (error) {
      console.error('❌ PaymentOrderService: Error obteniendo orden de pago:', error);
      throw error;
    }
  }

  // Actualizar estado de pago
  static async updatePaymentStatus(
    orderId: number, 
    status: string, 
    paypalData?: { paymentId?: string; payerId?: string; token?: string }
  ): Promise<PaymentOrderWithDetails> {
    try {
      console.log('💳 PaymentOrderService: Actualizando estado de pago', orderId, status);

      const updateData: any = {
        paymentStatus: status,
        updatedAt: new Date()
      };

      if (status === 'COMPLETED') {
        updateData.paidAt = new Date();
      }

      if (paypalData) {
        if (paypalData.paymentId) updateData.paypalPaymentId = paypalData.paymentId;
        if (paypalData.payerId) updateData.paypalPayerId = paypalData.payerId;
        if (paypalData.token) updateData.paypalToken = paypalData.token;
      }

      const paymentOrder = await (prisma as any).paymentOrder.update({
        where: { id: orderId },
        data: updateData,
        include: {
          quote: {
            include: {
              buyer: {
                select: { 
                  id: true, 
                  companyName: true, 
                  email: true, 
                  contactName: true 
                }
              },
              supplier: {
                select: { 
                  id: true, 
                  companyName: true, 
                  email: true, 
                  contactName: true 
                }
              },
              quoteItems: true,
              freightQuote: true
            }
          }
        }
      });

      console.log('✅ PaymentOrderService: Estado de pago actualizado:', paymentOrder.paymentStatus);
      return paymentOrder as PaymentOrderWithDetails;

    } catch (error) {
      console.error('❌ PaymentOrderService: Error actualizando estado de pago:', error);
      throw error;
    }
  }

  // Obtener órdenes de pago de un usuario
  static async getUserPaymentOrders(buyerId: number): Promise<PaymentOrderWithDetails[]> {
    try {
      console.log('💳 PaymentOrderService: Obteniendo órdenes de pago del usuario', buyerId);

      const paymentOrders = await (prisma as any).paymentOrder.findMany({
        where: { buyerId },
        include: {
          quote: {
            include: {
              buyer: {
                select: { 
                  id: true, 
                  companyName: true, 
                  email: true, 
                  contactName: true 
                }
              },
              supplier: {
                select: { 
                  id: true, 
                  companyName: true, 
                  email: true, 
                  contactName: true 
                }
              },
              quoteItems: true,
              freightQuote: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      console.log('✅ PaymentOrderService: Órdenes de pago obtenidas:', paymentOrders.length);
      return paymentOrders as PaymentOrderWithDetails[];

    } catch (error) {
      console.error('❌ PaymentOrderService: Error obteniendo órdenes de pago:', error);
      throw error;
    }
  }
}

export default PaymentOrderService;
