// ================================================================
// PAYMENT ORDER SERVICE - Servicio Completamente Individualizado
// ================================================================
// Descripción: Servicio que garantiza separación total de datos por usuario
// Sistema tipo Amazon: Cada usuario solo ve sus propias órdenes de pago

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface PaymentOrderData {
  buyerId: number;
  orderId?: number;
  quoteId?: number;
  totalAmount: number;
  currency: string;
  paymentMethod: string;
  paymentTerms: string;
  deliveryTerms?: string;
  notes?: string;
  dueDate?: Date;
}

export interface PaymentOrderWithDetails {
  id: number;
  orderNumber: string;
  buyerId: number;
  orderId?: number | null;
  quoteId?: number | null;
  totalAmount: number;
  currency: string;
  paymentMethod: string;
  paymentTerms: string;
  deliveryTerms?: string | null;
  notes?: string | null;
  status: string;
  dueDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  confirmedAt?: Date | null;
  paidAt?: Date | null;
  buyer: {
    id: number;
    companyName: string;
    email: string;
    contactName: string;
  };
  order?: {
    id: number;
    orderNumber: string;
    status: string;
  } | null;
  quote?: {
    id: number;
    title: string;
    status: string;
  } | null;
}

// Función auxiliar para convertir Decimal a number
function convertPaymentOrderForResponse(paymentOrder: any): PaymentOrderWithDetails {
  return {
    ...paymentOrder,
    totalAmount: typeof paymentOrder.totalAmount === 'object' ? parseFloat(paymentOrder.totalAmount.toString()) : paymentOrder.totalAmount
  };
}

export class PaymentOrderService {
  /**
   * 💳 Crear nueva orden de pago (solo para el usuario autenticado)
   */
  static async createPaymentOrder(orderData: PaymentOrderData): Promise<PaymentOrderWithDetails> {
    try {
      console.log(`💳 PaymentOrderService: Creando orden de pago para usuario ${orderData.buyerId}`);

      // Generar número de orden único
      const orderNumber = `PAY-${Date.now()}`;

      const paymentOrder = await prisma.paymentOrder.create({
        data: {
          orderNumber,
          buyerId: orderData.buyerId, // ✅ ASIGNACIÓN CRÍTICA
          orderId: orderData.orderId,
          quoteId: orderData.quoteId,
          totalAmount: orderData.totalAmount,
          currency: orderData.currency,
          paymentMethod: orderData.paymentMethod,
          paymentTerms: orderData.paymentTerms,
          deliveryTerms: orderData.deliveryTerms,
          notes: orderData.notes,
          status: 'PENDING',
          dueDate: orderData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días por defecto
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
          order: {
            select: {
              id: true,
              orderNumber: true,
              status: true
            }
          },
          quote: {
            select: {
              id: true,
              title: true,
              status: true
            }
          }
        }
      });

      console.log(`✅ PaymentOrderService: Orden de pago ${orderNumber} creada para usuario ${orderData.buyerId}`);
      return convertPaymentOrderForResponse(paymentOrder);

    } catch (error) {
      console.error('❌ PaymentOrderService: Error creando orden de pago:', error);
      throw error;
    }
  }

  /**
   * 🔍 Obtener orden de pago por ID (solo si pertenece al usuario)
   */
  static async getPaymentOrderById(paymentOrderId: number, userId: number): Promise<PaymentOrderWithDetails | null> {
    try {
      console.log(`💳 PaymentOrderService: Obteniendo orden de pago ${paymentOrderId} para usuario ${userId}`);

      const paymentOrder = await prisma.paymentOrder.findFirst({
        where: {
          id: paymentOrderId,
          buyerId: userId // ✅ VALIDACIÓN CRÍTICA
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
          order: {
            select: {
              id: true,
              orderNumber: true,
              status: true
            }
          },
          quote: {
            select: {
              id: true,
              title: true,
              status: true
            }
          }
        }
      });

      if (!paymentOrder) {
        console.log(`⚠️ PaymentOrderService: Orden de pago ${paymentOrderId} no encontrada o no pertenece al usuario ${userId}`);
        return null;
      }

      console.log(`✅ PaymentOrderService: Orden de pago obtenida para usuario autorizado`);
      return convertPaymentOrderForResponse(paymentOrder);

    } catch (error) {
      console.error('❌ PaymentOrderService: Error obteniendo orden de pago:', error);
      throw error;
    }
  }

  /**
   * 📋 Obtener todas las órdenes de pago del usuario
   */
  static async getUserPaymentOrders(userId: number): Promise<PaymentOrderWithDetails[]> {
    try {
      console.log(`💳 PaymentOrderService: Obteniendo órdenes de pago del usuario ${userId}`);

      const paymentOrders = await prisma.paymentOrder.findMany({
        where: {
          buyerId: userId // ✅ FILTRO CRÍTICO
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
          order: {
            select: {
              id: true,
              orderNumber: true,
              status: true
            }
          },
          quote: {
            select: {
              id: true,
              title: true,
              status: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      console.log(`✅ PaymentOrderService: ${paymentOrders.length} órdenes de pago obtenidas para usuario ${userId}`);
      return paymentOrders.map(po => convertPaymentOrderForResponse(po));

    } catch (error) {
      console.error('❌ PaymentOrderService: Error obteniendo órdenes de pago:', error);
      throw error;
    }
  }

  /**
   * 🔄 Actualizar estado de orden de pago (solo si pertenece al usuario)
   */
  static async updatePaymentOrderStatus(paymentOrderId: number, userId: number, status: string): Promise<PaymentOrderWithDetails> {
    try {
      console.log(`💳 PaymentOrderService: Actualizando orden de pago ${paymentOrderId} a estado ${status} para usuario ${userId}`);

      // Verificar que la orden pertenece al usuario
      const existingOrder = await prisma.paymentOrder.findFirst({
        where: {
          id: paymentOrderId,
          buyerId: userId // ✅ VALIDACIÓN CRÍTICA
        }
      });

      if (!existingOrder) {
        throw new Error('Orden de pago no encontrada o no pertenece al usuario');
      }

      const updateData: any = {
        status,
        updatedAt: new Date()
      };

      if (status === 'CONFIRMED') {
        updateData.confirmedAt = new Date();
      } else if (status === 'PAID') {
        updateData.paidAt = new Date();
      }

      const updatedOrder = await prisma.paymentOrder.update({
        where: { id: paymentOrderId },
        data: updateData,
        include: {
          buyer: {
            select: {
              id: true,
              companyName: true,
              email: true,
              contactName: true
            }
          },
          order: {
            select: {
              id: true,
              orderNumber: true,
              status: true
            }
          },
          quote: {
            select: {
              id: true,
              title: true,
              status: true
            }
          }
        }
      });

      console.log(`✅ PaymentOrderService: Orden de pago actualizada a estado ${status}`);
      return convertPaymentOrderForResponse(updatedOrder);

    } catch (error) {
      console.error('❌ PaymentOrderService: Error actualizando orden de pago:', error);
      throw error;
    }
  }

  /**
   * 📊 Obtener estadísticas de órdenes de pago del usuario
   */
  static async getUserPaymentOrderStats(userId: number): Promise<{
    total: number;
    pending: number;
    confirmed: number;
    paid: number;
    cancelled: number;
    totalAmount: number;
    paidAmount: number;
  }> {
    try {
      console.log(`📊 PaymentOrderService: Obteniendo estadísticas de órdenes de pago para usuario ${userId}`);

      const whereClause = { buyerId: userId }; // ✅ FILTRO CRÍTICO

      const [
        total, 
        pending, 
        confirmed, 
        paid, 
        cancelled,
        totalAmountData,
        paidAmountData
      ] = await Promise.all([
        prisma.paymentOrder.count({ where: whereClause }),
        prisma.paymentOrder.count({ where: { ...whereClause, status: 'PENDING' } }),
        prisma.paymentOrder.count({ where: { ...whereClause, status: 'CONFIRMED' } }),
        prisma.paymentOrder.count({ where: { ...whereClause, status: 'PAID' } }),
        prisma.paymentOrder.count({ where: { ...whereClause, status: 'CANCELLED' } }),
        prisma.paymentOrder.aggregate({
          where: whereClause,
          _sum: { totalAmount: true }
        }),
        prisma.paymentOrder.aggregate({
          where: { ...whereClause, status: 'PAID' },
          _sum: { totalAmount: true }
        })
      ]);

      const totalAmount = totalAmountData._sum.totalAmount ? parseFloat(totalAmountData._sum.totalAmount.toString()) : 0;
      const paidAmount = paidAmountData._sum.totalAmount ? parseFloat(paidAmountData._sum.totalAmount.toString()) : 0;

      const stats = { 
        total, 
        pending, 
        confirmed, 
        paid, 
        cancelled, 
        totalAmount, 
        paidAmount 
      };
      
      console.log(`✅ PaymentOrderService: Estadísticas obtenidas:`, stats);
      return stats;

    } catch (error) {
      console.error('❌ PaymentOrderService: Error obteniendo estadísticas:', error);
      throw error;
    }
  }

  /**
   * ❌ Cancelar orden de pago (solo si pertenece al usuario)
   */
  static async cancelPaymentOrder(paymentOrderId: number, userId: number, reason?: string): Promise<PaymentOrderWithDetails> {
    try {
      console.log(`❌ PaymentOrderService: Cancelando orden de pago ${paymentOrderId} para usuario ${userId}`);

      // Verificar que la orden pertenece al usuario
      const existingOrder = await prisma.paymentOrder.findFirst({
        where: {
          id: paymentOrderId,
          buyerId: userId // ✅ VALIDACIÓN CRÍTICA
        }
      });

      if (!existingOrder) {
        throw new Error('Orden de pago no encontrada o no pertenece al usuario');
      }

      if (existingOrder.status === 'PAID') {
        throw new Error('No se puede cancelar una orden de pago que ya ha sido pagada');
      }

      const cancelledOrder = await prisma.paymentOrder.update({
        where: { id: paymentOrderId },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
          cancellationReason: reason,
          updatedAt: new Date()
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
          order: {
            select: {
              id: true,
              orderNumber: true,
              status: true
            }
          },
          quote: {
            select: {
              id: true,
              title: true,
              status: true
            }
          }
        }
      });

      console.log(`✅ PaymentOrderService: Orden de pago cancelada`);
      return convertPaymentOrderForResponse(cancelledOrder);

    } catch (error) {
      console.error('❌ PaymentOrderService: Error cancelando orden de pago:', error);
      throw error;
    }
  }
}

export default PaymentOrderService;
