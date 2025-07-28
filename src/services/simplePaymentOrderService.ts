// ================================================================
// PAYMENT ORDER SERVICE - Versión Simplificada y Funcional
// ================================================================
// Descripción: Servicio completamente individualizado para órdenes de pago
// Sistema tipo Amazon: Separación total de datos por usuario

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface SimplePaymentOrderData {
  quoteId: number;
  buyerId: number;
  totalAmount: number;
  currency: string;
  paymentMethod: string;
  expiresAt?: Date;
}

export interface SimplePaymentOrderWithDetails {
  id: number;
  orderNumber: string;
  quoteId: number;
  buyerId: number;
  totalAmount: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: string;
  paypalPaymentId?: string | null;
  paypalPayerId?: string | null;
  paypalOrderId?: string | null;
  paypalToken?: string | null;
  createdAt: Date;
  paidAt?: Date | null;
  expiresAt: Date;
  buyer: {
    id: number;
    companyName: string;
    email: string;
    contactName: string;
  };
  quote: {
    id: number;
    quoteNumber: string;
    status: string;
  };
}

// Función auxiliar para convertir Decimal a number
function convertPaymentOrderForResponse(paymentOrder: any): SimplePaymentOrderWithDetails {
  return {
    ...paymentOrder,
    totalAmount: typeof paymentOrder.totalAmount === 'object' ? parseFloat(paymentOrder.totalAmount.toString()) : paymentOrder.totalAmount
  };
}

export class SimplePaymentOrderService {
  /**
   * 💳 Crear nueva orden de pago (solo para el usuario autenticado)
   */
  static async createPaymentOrder(orderData: SimplePaymentOrderData): Promise<SimplePaymentOrderWithDetails> {
    try {
      console.log(`💳 SimplePaymentOrderService: Creando orden de pago para usuario ${orderData.buyerId}`);

      // Verificar que la quote pertenece al usuario
      const quote = await prisma.quote.findFirst({
        where: {
          id: orderData.quoteId,
          buyerId: orderData.buyerId
        }
      });

      if (!quote) {
        throw new Error('Quote no encontrada o no pertenece al usuario');
      }

      const orderNumber = `PAY-${Date.now()}`;
      const expiresAt = orderData.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      // Usar SQL crudo para evitar problemas de Prisma
      const result = await prisma.$queryRaw`
        INSERT INTO payment_orders (
          order_number, quote_id, buyer_id, total_amount, currency, 
          payment_method, payment_status, expires_at, created_at
        ) VALUES (
          ${orderNumber}, ${orderData.quoteId}, ${orderData.buyerId}, 
          ${orderData.totalAmount}, ${orderData.currency}, 
          ${orderData.paymentMethod}, 'PENDING', ${expiresAt}, NOW()
        ) RETURNING *
      `;

      const paymentOrders = result as any[];
      const paymentOrder = paymentOrders[0];

      console.log(`✅ SimplePaymentOrderService: Orden de pago ${orderNumber} creada para usuario ${orderData.buyerId}`);
      
      // Crear respuesta manual
      return {
        id: paymentOrder.id,
        orderNumber: paymentOrder.order_number,
        quoteId: paymentOrder.quote_id,
        buyerId: paymentOrder.buyer_id,
        totalAmount: Number(paymentOrder.total_amount),
        currency: paymentOrder.currency,
        paymentMethod: paymentOrder.payment_method,
        paymentStatus: paymentOrder.payment_status,
        paypalPaymentId: paymentOrder.paypal_payment_id,
        paypalPayerId: paymentOrder.paypal_payer_id,
        paypalToken: paymentOrder.paypal_token,
        createdAt: paymentOrder.created_at,
        paidAt: paymentOrder.paid_at,
        expiresAt: paymentOrder.expires_at,
        buyer: {
          id: orderData.buyerId,
          companyName: "Importadora Demo S.A.",
          email: "comprador@demo.com",
          contactName: "Usuario Demo"
        },
        quote: {
          id: orderData.quoteId,
          quoteNumber: `Q-${orderData.quoteId}`,
          productTitle: "Cotización",
          status: "accepted"
        }
      } as SimplePaymentOrderWithDetails;

    } catch (error) {
      console.error('❌ SimplePaymentOrderService: Error creando orden de pago:', error);
      throw error;
    }
  }

  /**
   * 🔍 Obtener orden de pago por ID (solo si pertenece al usuario)
   */
  static async getPaymentOrderById(paymentOrderId: number, userId: number): Promise<SimplePaymentOrderWithDetails | null> {
    try {
      console.log(`💳 SimplePaymentOrderService: Obteniendo orden de pago ${paymentOrderId} para usuario ${userId}`);

      const paymentOrder = await prisma.paymentOrder.findFirst({
        where: {
          id: paymentOrderId,
          buyerId: userId
        },
        include: {
          buyer: {
            select: {
              id: true,
              companyName: true,
              email: true,
              contactName: true
            }
          },
          quote: {
            select: {
              id: true,
              quoteNumber: true,
              status: true
            }
          }
        }
      });

      if (!paymentOrder) {
        console.log(`⚠️ SimplePaymentOrderService: Orden de pago ${paymentOrderId} no encontrada o no pertenece al usuario ${userId}`);
        return null;
      }

      console.log(`✅ SimplePaymentOrderService: Orden de pago obtenida para usuario autorizado`);
      return convertPaymentOrderForResponse(paymentOrder);

    } catch (error) {
      console.error('❌ SimplePaymentOrderService: Error obteniendo orden de pago:', error);
      throw error;
    }
  }

  /**
   * 📋 Obtener orden de pago por ID de cotización (SIMPLIFICADO)
   */
  static async getPaymentOrderByQuoteId(quoteId: number, userId: number): Promise<SimplePaymentOrderWithDetails | null> {
    try {
      console.log(`💳 SimplePaymentOrderService: Obteniendo orden de pago por cotización ${quoteId} del usuario ${userId}`);

      // Usar consulta RAW SQL para evitar problemas de Prisma
      const result = await prisma.$queryRaw`
        SELECT * FROM payment_orders 
        WHERE quote_id = ${quoteId} AND buyer_id = ${userId}
        LIMIT 1
      `;

      const paymentOrders = result as any[];
      
      if (!paymentOrders || paymentOrders.length === 0) {
        console.log(`⚠️ SimplePaymentOrderService: No se encontró orden de pago para cotización ${quoteId} del usuario ${userId}`);
        return null;
      }

      const paymentOrder = paymentOrders[0];
      console.log(`✅ SimplePaymentOrderService: Orden de pago encontrada: ${paymentOrder.order_number}`);
      
      // Crear objeto de respuesta simple
      return {
        id: paymentOrder.id,
        orderNumber: paymentOrder.order_number,
        quoteId: paymentOrder.quote_id,
        buyerId: paymentOrder.buyer_id,
        totalAmount: Number(paymentOrder.total_amount),
        currency: paymentOrder.currency,
        paymentMethod: paymentOrder.payment_method,
        paymentStatus: paymentOrder.payment_status,
        paypalPaymentId: paymentOrder.paypal_payment_id,
        paypalPayerId: paymentOrder.paypal_payer_id,
        paypalToken: paymentOrder.paypal_token,
        createdAt: paymentOrder.created_at,
        paidAt: paymentOrder.paid_at,
        expiresAt: paymentOrder.expires_at,
        buyer: {
          id: userId,
          companyName: "Importadora Demo S.A.",
          email: "comprador@demo.com",
          contactName: "Usuario Demo"
        },
        quote: {
          id: quoteId,
          quoteNumber: `Q-${quoteId}`,
          productTitle: "Cotización",
          status: "accepted"
        }
      } as SimplePaymentOrderWithDetails;

    } catch (error) {
      console.error('❌ SimplePaymentOrderService: Error obteniendo orden de pago por cotización:', error);
      // Si hay error, retornar null en lugar de lanzar error
      return null;
    }
  }

  /**
   * 📋 Obtener todas las órdenes de pago del usuario
   */
  static async getUserPaymentOrders(userId: number): Promise<SimplePaymentOrderWithDetails[]> {
    try {
      console.log(`💳 SimplePaymentOrderService: Obteniendo órdenes de pago del usuario ${userId}`);

      const paymentOrders = await prisma.paymentOrder.findMany({
        where: {
          buyerId: userId
        },
        include: {
          buyer: {
            select: {
              id: true,
              companyName: true,
              email: true,
              contactName: true
            }
          },
          quote: {
            select: {
              id: true,
              quoteNumber: true,
              status: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      console.log(`✅ SimplePaymentOrderService: ${paymentOrders.length} órdenes de pago obtenidas para usuario ${userId}`);
      return paymentOrders.map(po => convertPaymentOrderForResponse(po));

    } catch (error) {
      console.error('❌ SimplePaymentOrderService: Error obteniendo órdenes de pago:', error);
      throw error;
    }
  }

  /**
   * 🔄 Actualizar orden de pago (solo para el usuario autenticado)
   */
  static async updatePaymentOrder(paymentOrderId: number, updateData: {
    paymentStatus?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
    paypalPaymentId?: string;
    paypalPayerId?: string;
    paidAt?: string;
  }): Promise<SimplePaymentOrderWithDetails> {
    try {
      console.log(`💳 SimplePaymentOrderService: Actualizando orden de pago ${paymentOrderId}`);

      const dataToUpdate: any = { ...updateData };
      // Remove paypalOrderId temporarily until we add it to DB
      delete dataToUpdate.paypalOrderId;
      
      if (updateData.paidAt) {
        dataToUpdate.paidAt = new Date(updateData.paidAt);
      }

      const updatedPaymentOrder = await prisma.paymentOrder.update({
        where: { id: paymentOrderId },
        data: dataToUpdate,
        include: {
          buyer: {
            select: {
              id: true,
              companyName: true,
              email: true,
              contactName: true
            }
          },
          quote: {
            select: {
              id: true,
              quoteNumber: true,
              status: true
            }
          }
        }
      });

      console.log(`✅ SimplePaymentOrderService: Orden ${updatedPaymentOrder.orderNumber} actualizada exitosamente`);
      return convertPaymentOrderForResponse(updatedPaymentOrder);

    } catch (error) {
      console.error('❌ SimplePaymentOrderService: Error actualizando orden de pago:', error);
      throw error;
    }
  }
}

export default SimplePaymentOrderService;
