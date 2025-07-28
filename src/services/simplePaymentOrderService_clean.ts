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
          buyerId: orderData.buyerId // ✅ VALIDACIÓN CRÍTICA
        }
      });

      if (!quote) {
        throw new Error('Quote no encontrada o no pertenece al usuario');
      }

      // Generar número de orden único
      const orderNumber = `PAY-${Date.now()}`;

      const paymentOrder = await prisma.paymentOrder.create({
        data: {
          orderNumber,
          quoteId: orderData.quoteId,
          buyerId: orderData.buyerId, // ✅ ASIGNACIÓN CRÍTICA
          totalAmount: orderData.totalAmount,
          currency: orderData.currency,
          paymentMethod: orderData.paymentMethod,
          paymentStatus: 'PENDING',
          expiresAt: orderData.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días por defecto
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

      console.log(`✅ SimplePaymentOrderService: Orden de pago ${orderNumber} creada para usuario ${orderData.buyerId}`);
      return convertPaymentOrderForResponse(paymentOrder);

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
   * 📋 Obtener todas las órdenes de pago del usuario
   */
  static async getUserPaymentOrders(userId: number): Promise<SimplePaymentOrderWithDetails[]> {
    try {
      console.log(`💳 SimplePaymentOrderService: Obteniendo órdenes de pago del usuario ${userId}`);

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
   * 🔄 Actualizar estado de orden de pago (solo si pertenece al usuario)
   */
  static async updatePaymentOrderStatus(paymentOrderId: number, userId: number, paymentStatus: string, paypalData?: any): Promise<SimplePaymentOrderWithDetails> {
    try {
      console.log(`💳 SimplePaymentOrderService: Actualizando orden de pago ${paymentOrderId} a estado ${paymentStatus} para usuario ${userId}`);

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
        paymentStatus
      };

      if (paymentStatus === 'COMPLETED') {
        updateData.paidAt = new Date();
      }

      if (paypalData) {
        if (paypalData.paymentId) updateData.paypalPaymentId = paypalData.paymentId;
        if (paypalData.payerId) updateData.paypalPayerId = paypalData.payerId;
        if (paypalData.token) updateData.paypalToken = paypalData.token;
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
          quote: {
            select: {
              id: true,
              quoteNumber: true,
              status: true
            }
          }
        }
      });

      console.log(`✅ SimplePaymentOrderService: Estado de pago actualizado a estado ${paymentStatus}`);
      return convertPaymentOrderForResponse(updatedOrder);

    } catch (error) {
      console.error('❌ SimplePaymentOrderService: Error actualizando orden de pago:', error);
      throw error;
    }
  }

  /**
   * ❌ Cancelar orden de pago (solo si pertenece al usuario)
   */
  static async cancelPaymentOrder(paymentOrderId: number, userId: number): Promise<SimplePaymentOrderWithDetails> {
    try {
      console.log(`❌ SimplePaymentOrderService: Cancelando orden de pago ${paymentOrderId} para usuario ${userId}`);

      // Verificar que la orden pertenece al usuario
      const existingOrder = await prisma.paymentOrder.findFirst({
        where: {
          id: paymentOrderId,
          buyerId: userId
        }
      });

      if (!existingOrder) {
        throw new Error('Orden de pago no encontrada o no pertenece al usuario');
      }

      if (existingOrder.paymentStatus === 'COMPLETED') {
        throw new Error('No se puede cancelar una orden de pago completada');
      }

      const cancelledOrder = await prisma.paymentOrder.update({
        where: { id: paymentOrderId },
        data: {
          paymentStatus: 'CANCELLED'
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

      console.log(`✅ SimplePaymentOrderService: Orden de pago cancelada`);
      return convertPaymentOrderForResponse(cancelledOrder);

    } catch (error) {
      console.error('❌ SimplePaymentOrderService: Error cancelando orden de pago:', error);
      throw error;
    }
  }
}

export default SimplePaymentOrderService;
