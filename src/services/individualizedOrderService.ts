// ================================================================
// ORDER SERVICE - Servicio Completamente Individualizado
// ================================================================
// Descripción: Servicio que garantiza separación total de datos por usuario
// Sistema tipo Amazon: Cada usuario solo ve sus propias órdenes

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface OrderData {
  buyerId: number;
  items: Array<{
    productId: number;
    quantity: number;
    unitPrice: number;
  }>;
  shippingAddress: string;
  paymentMethod: string;
  paymentTerms?: string;
  deliveryTerms?: string;
  notes?: string;
}

export interface OrderWithDetails {
  id: number;
  orderNumber: string;
  buyerId: number;
  status: string;
  totalAmount: number;
  currency: string;
  paymentTerms?: string | null;
  deliveryTerms?: string | null;
  notes?: string | null;
  shippingAddress?: string | null;
  paymentMethod?: string | null;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date | null;
  confirmedAt?: Date | null;
  buyer: {
    id: number;
    companyName: string;
    email: string;
    contactName: string;
  };
  orderDetails: Array<{
    id: number;
    productId: number;
    supplierId: number;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    currency: string;
    product: {
      id: number;
      title: string;
      description?: string | null;
    };
    supplier: {
      id: number;
      companyName: string;
      contactName: string;
    };
  }>;
}

// Función auxiliar para convertir Decimal a number
function convertOrderForResponse(order: any): OrderWithDetails {
  return {
    ...order,
    totalAmount: typeof order.totalAmount === 'object' ? parseFloat(order.totalAmount.toString()) : order.totalAmount,
    orderDetails: order.orderDetails.map((detail: any) => ({
      ...detail,
      unitPrice: typeof detail.unitPrice === 'object' ? parseFloat(detail.unitPrice.toString()) : detail.unitPrice,
      totalPrice: typeof detail.totalPrice === 'object' ? parseFloat(detail.totalPrice.toString()) : detail.totalPrice,
      quantity: typeof detail.quantity === 'object' ? parseFloat(detail.quantity.toString()) : detail.quantity
    }))
  };
}

export class OrderService {
  /**
   * 🔒 Crear nueva orden (solo para el usuario autenticado)
   */
  static async createOrder(orderData: OrderData): Promise<OrderWithDetails> {
    try {
      console.log(`📦 OrderService: Creando orden para usuario ${orderData.buyerId}`);

      // Generar número de orden único
      const orderNumber = `ORD-${Date.now()}`;
      
      // Calcular total
      const totalAmount = orderData.items.reduce((sum, item) => 
        sum + (item.unitPrice * item.quantity), 0
      );

      const order = await prisma.order.create({
        data: {
          orderNumber,
          buyerId: orderData.buyerId, // ✅ ASIGNACIÓN CRÍTICA
          status: 'PENDING',
          totalAmount,
          currency: 'USD',
          paymentTerms: orderData.paymentTerms,
          deliveryTerms: orderData.deliveryTerms,
          notes: orderData.notes,
          shippingAddress: orderData.shippingAddress,
          paymentMethod: orderData.paymentMethod,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días
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
          orderDetails: {
            include: {
              product: {
                select: {
                  id: true,
                  title: true,
                  description: true
                }
              },
              supplier: {
                select: {
                  id: true,
                  companyName: true,
                  contactName: true
                }
              }
            }
          }
        }
      });

      // Crear detalles de la orden
      for (const item of orderData.items) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId }
        });

        if (product) {
          await prisma.orderDetail.create({
            data: {
              orderId: order.id,
              productId: item.productId,
              supplierId: product.supplierId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.unitPrice * item.quantity,
              currency: 'USD'
            }
          });
        }
      }

      // Recargar orden con detalles
      const completeOrder = await this.getOrderById(order.id, orderData.buyerId);
      
      console.log(`✅ OrderService: Orden ${orderNumber} creada para usuario ${orderData.buyerId}`);
      return completeOrder!;

    } catch (error) {
      console.error('❌ OrderService: Error creando orden:', error);
      throw error;
    }
  }

  /**
   * 🔍 Obtener orden por ID (solo si pertenece al usuario)
   */
  static async getOrderById(orderId: number, userId: number): Promise<OrderWithDetails | null> {
    try {
      console.log(`📦 OrderService: Obteniendo orden ${orderId} para usuario ${userId}`);

      const order = await prisma.order.findFirst({
        where: {
          id: orderId,
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
          orderDetails: {
            include: {
              product: {
                select: {
                  id: true,
                  title: true,
                  description: true
                }
              },
              supplier: {
                select: {
                  id: true,
                  companyName: true,
                  contactName: true
                }
              }
            }
          }
        }
      });

      if (!order) {
        console.log(`⚠️ OrderService: Orden ${orderId} no encontrada o no pertenece al usuario ${userId}`);
        return null;
      }

      console.log(`✅ OrderService: Orden obtenida para usuario autorizado`);
      return convertOrderForResponse(order);

    } catch (error) {
      console.error('❌ OrderService: Error obteniendo orden:', error);
      throw error;
    }
  }

  /**
   * 📋 Obtener todas las órdenes del usuario
   */
  static async getUserOrders(userId: number): Promise<OrderWithDetails[]> {
    try {
      console.log(`📦 OrderService: Obteniendo órdenes del usuario ${userId}`);

      const orders = await prisma.order.findMany({
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
          orderDetails: {
            include: {
              product: {
                select: {
                  id: true,
                  title: true,
                  description: true
                }
              },
              supplier: {
                select: {
                  id: true,
                  companyName: true,
                  contactName: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      console.log(`✅ OrderService: ${orders.length} órdenes obtenidas para usuario ${userId}`);
      return orders.map(order => convertOrderForResponse(order));

    } catch (error) {
      console.error('❌ OrderService: Error obteniendo órdenes:', error);
      throw error;
    }
  }

  /**
   * 🔄 Actualizar estado de orden (solo si pertenece al usuario)
   */
  static async updateOrderStatus(orderId: number, userId: number, status: string): Promise<OrderWithDetails> {
    try {
      console.log(`📦 OrderService: Actualizando orden ${orderId} a estado ${status} para usuario ${userId}`);

      // Verificar que la orden pertenece al usuario
      const existingOrder = await prisma.order.findFirst({
        where: {
          id: orderId,
          buyerId: userId // ✅ VALIDACIÓN CRÍTICA
        }
      });

      if (!existingOrder) {
        throw new Error('Orden no encontrada o no pertenece al usuario');
      }

      const updateData: any = {
        status,
        updatedAt: new Date()
      };

      if (status === 'CONFIRMED') {
        updateData.confirmedAt = new Date();
      }

      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
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
          orderDetails: {
            include: {
              product: {
                select: {
                  id: true,
                  title: true,
                  description: true
                }
              },
              supplier: {
                select: {
                  id: true,
                  companyName: true,
                  contactName: true
                }
              }
            }
          }
        }
      });

      console.log(`✅ OrderService: Orden actualizada a estado ${status}`);
      return convertOrderForResponse(updatedOrder);

    } catch (error) {
      console.error('❌ OrderService: Error actualizando orden:', error);
      throw error;
    }
  }

  /**
   * 📊 Obtener estadísticas de órdenes del usuario
   */
  static async getUserOrderStats(userId: number): Promise<{
    total: number;
    pending: number;
    confirmed: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  }> {
    try {
      console.log(`📊 OrderService: Obteniendo estadísticas de órdenes para usuario ${userId}`);

      const whereClause = { buyerId: userId }; // ✅ FILTRO CRÍTICO

      const [total, pending, confirmed, shipped, delivered, cancelled] = await Promise.all([
        prisma.order.count({ where: whereClause }),
        prisma.order.count({ where: { ...whereClause, status: 'PENDING' } }),
        prisma.order.count({ where: { ...whereClause, status: 'CONFIRMED' } }),
        prisma.order.count({ where: { ...whereClause, status: 'SHIPPED' } }),
        prisma.order.count({ where: { ...whereClause, status: 'DELIVERED' } }),
        prisma.order.count({ where: { ...whereClause, status: 'CANCELLED' } })
      ]);

      const stats = { total, pending, confirmed, shipped, delivered, cancelled };
      console.log(`✅ OrderService: Estadísticas obtenidas:`, stats);
      
      return stats;

    } catch (error) {
      console.error('❌ OrderService: Error obteniendo estadísticas:', error);
      throw error;
    }
  }

  /**
   * ❌ Cancelar orden (solo si pertenece al usuario)
   */
  static async cancelOrder(orderId: number, userId: number, reason?: string): Promise<OrderWithDetails> {
    try {
      console.log(`❌ OrderService: Cancelando orden ${orderId} para usuario ${userId}`);

      // Verificar que la orden pertenece al usuario
      const existingOrder = await prisma.order.findFirst({
        where: {
          id: orderId,
          buyerId: userId // ✅ VALIDACIÓN CRÍTICA
        }
      });

      if (!existingOrder) {
        throw new Error('Orden no encontrada o no pertenece al usuario');
      }

      if (existingOrder.status === 'SHIPPED' || existingOrder.status === 'DELIVERED') {
        throw new Error('No se puede cancelar una orden que ya ha sido enviada o entregada');
      }

      const cancelledOrder = await prisma.order.update({
        where: { id: orderId },
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
          orderDetails: {
            include: {
              product: {
                select: {
                  id: true,
                  title: true,
                  description: true
                }
              },
              supplier: {
                select: {
                  id: true,
                  companyName: true,
                  contactName: true
                }
              }
            }
          }
        }
      });

      console.log(`✅ OrderService: Orden cancelada`);
      return convertOrderForResponse(cancelledOrder);

    } catch (error) {
      console.error('❌ OrderService: Error cancelando orden:', error);
      throw error;
    }
  }
}

export default OrderService;
