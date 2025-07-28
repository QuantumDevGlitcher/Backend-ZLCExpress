import { PrismaClient } from '@prisma/client';
import { CartService } from './cartService';
// import { ShippingService } from './shippingService';
import { ShippingQuoteRequest } from '../types/shipping';

const prisma = new PrismaClient();

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderData {
  shippingAddress?: string;
  originPort?: string;
  destinationPort?: string;
  containerType?: string;
  estimatedShippingDate?: Date;
  requestShippingQuotes?: boolean;
}

export class OrderService {
  /**
   * Crear orden desde el carrito (sin shipping)
   */
  static async createOrder(cartId: string, userId: string | number, orderData: OrderData = {}) {
    try {
      const userIdNum = typeof userId === 'string' ? parseInt(userId) : userId;
      console.log('Creating order for user:', userIdNum);
      console.log('Order data:', orderData);

      // Obtener carrito del usuario
      const cart = await CartService.getCart(userIdNum);
      console.log('User cart:', cart);

      if (!cart || cart.items.length === 0) {
        throw new Error('El carrito esta vacio');
      }

      // Calcular items y total
      const orderItems = [];
      let totalAmount = 0;

      for (const cartItem of cart.items) {
        // Obtener informacion actualizada del producto
        const product = await prisma.product.findUnique({
          where: { id: cartItem.productId },
          include: { category: true }
        });

        if (!product) {
          throw new Error(`Producto ${cartItem.productId} no encontrado`);
        }

        console.log(`Checking stock for product ${cartItem.productId}, needed: ${cartItem.containerQuantity}, available: ${product.stockContainers}`);

        if (product.stockContainers < cartItem.containerQuantity) {
          throw new Error(`Stock insuficiente para ${product.name}. Disponible: ${product.stockContainers}, Solicitado: ${cartItem.containerQuantity}`);
        }

        const itemTotal = product.pricePerContainer * cartItem.containerQuantity;
        totalAmount += itemTotal;

        orderItems.push({
          productId: cartItem.productId,
          containerQuantity: cartItem.containerQuantity,
          pricePerContainer: product.pricePerContainer,
          totalPrice: itemTotal
        });
      }

      console.log('Total amount:', totalAmount);

      // Crear orden en base de datos
      const newOrder = await prisma.order.create({
        data: {
          userId: userIdNum,
          status: 'PENDING',
          totalAmount: totalAmount,
          shippingAddress: orderData.shippingAddress || '',
          originPort: orderData.originPort,
          destinationPort: orderData.destinationPort,
          containerType: orderData.containerType,
          estimatedShippingDate: orderData.estimatedShippingDate
        }
      });

      console.log('Order created with ID:', newOrder.id);

      // Crear items de la orden
      const createdOrderItems = await Promise.all(
        orderItems.map(item =>
          prisma.orderItem.create({
            data: {
              orderId: newOrder.id,
              productId: item.productId,
              containerQuantity: item.containerQuantity,
              pricePerContainer: item.pricePerContainer,
              totalPrice: item.totalPrice
            }
          })
        )
      );

      console.log('Created', createdOrderItems.length, 'order items');

      // Limpiar carrito
      await CartService.clearCart(userIdNum);
      console.log('Cart cleared');

      // Actualizar stock de productos
      for (const cartItem of cart.items) {
        await prisma.product.update({
          where: { id: cartItem.productId },
          data: {
            stockContainers: {
              decrement: cartItem.containerQuantity
            }
          }
        });
      }

      console.log('Order created successfully');

      return {
        order: newOrder,
        items: createdOrderItems
      };

    } catch (error: any) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  /**
   * Crear orden con integración de shipping desde carrito
   */
  static async createOrderWithShipping(cartId: string, userId: string | number, orderData: OrderData) {
    try {
      const userIdNum = typeof userId === 'string' ? parseInt(userId) : userId;
      console.log('Creating order with shipping for user:', userIdNum);
      console.log('Order data:', orderData);

      // Obtener carrito del usuario
      const cart = await CartService.getCart(userIdNum);
      console.log('User cart:', cart);

      if (!cart || cart.items.length === 0) {
        throw new Error('El carrito esta vacio');
      }

      // Calcular peso y volumen total para shipping
      let totalWeight = 0;
      let totalVolume = 0;

      for (const cartItem of cart.items) {
        const product = await prisma.product.findUnique({
          where: { id: cartItem.productId }
        });

        if (product) {
          // Estimaciones de peso y volumen por contenedor
          const estimatedWeightPerContainer = 1000; // kg
          const estimatedVolumePerContainer = 50; // m³

          totalWeight += estimatedWeightPerContainer * cartItem.containerQuantity;
          totalVolume += estimatedVolumePerContainer * cartItem.containerQuantity;
        }
      }

      // Generar numero de orden unico
      const orderNumber = `ORD-${Date.now()}-${userIdNum}`;

      // Crear orden basica primero
      const basicOrderResult = await this.createOrder(cartId, userId, {
        ...orderData,
        requestShippingQuotes: true
      });

      // Si se requieren cotizaciones de shipping, generarlas
      if (orderData.requestShippingQuotes) {
        const shippingRequest: ShippingQuoteRequest = {
          originPort: orderData.originPort || 'SHANGHAI',
          destinationPort: orderData.destinationPort || 'MIAMI',
          containerType: orderData.containerType || '20FT',
          containerCount: cart.items.reduce((sum, item) => sum + item.containerQuantity, 0),
          estimatedShippingDate: orderData.estimatedShippingDate || new Date(),
          cargoValue: basicOrderResult.order.totalAmount,
          incoterm: 'FOB'
        };

        // const shippingQuotes = await ShippingService.getShippingQuotes(shippingRequest, userIdNum);
        const shippingQuotes: any[] = []; // Mock for now
        
        return {
          order: basicOrderResult.order,
          items: basicOrderResult.items,
          shippingQuotes: shippingQuotes,
          message: `Orden creada exitosamente. Se generaron ${shippingQuotes.length} cotizaciones de flete.`
        };
      }

      return basicOrderResult;

    } catch (error: any) {
      console.error('Error creating order with shipping:', error);
      throw error;
    }
  }

  /**
   * Confirmar orden con cotización de shipping seleccionada
   */
  static async confirmOrderWithShipping(orderId: number, shippingQuoteId: number) {
    try {
      // Marcar la cotización como seleccionada
      // await ShippingService.selectShippingQuote(shippingQuoteId, orderId);
      console.log('ShippingService temporarily disabled'); // Mock for now

      // Actualizar estado de la orden
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { 
          status: 'CONFIRMED',
          updatedAt: new Date()
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });

      return {
        order: updatedOrder,
        message: 'Orden confirmada con shipping seleccionado'
      };

    } catch (error: any) {
      console.error('Error confirming order with shipping:', error);
      throw error;
    }
  }

  /**
   * Obtener órdenes de un usuario
   */
  static async getOrdersByUserId(userId: string | number) {
    try {
      const userIdNum = typeof userId === 'string' ? parseInt(userId) : userId;
      
      const orders = await prisma.order.findMany({
        where: { userId: userIdNum },
        include: {
          items: {
            include: {
              product: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return orders;
    } catch (error: any) {
      console.error('Error getting orders by user:', error);
      throw error;
    }
  }

  /**
   * Obtener orden por ID
   */
  static async getOrderById(orderId: number) {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });

      if (!order) {
        throw new Error('Orden no encontrada');
      }

      return {
        id: order.id,
        userId: order.userId,
        status: order.status,
        totalAmount: order.totalAmount,
        shippingAddress: order.shippingAddress,
        items: order.items.map((item: any) => ({
          id: item.id,
          containerQuantity: item.containerQuantity,
          pricePerContainer: item.pricePerContainer,
          totalPrice: item.totalPrice,
          product: item.product
        })),
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      };
    } catch (error: any) {
      console.error('Error getting order by ID:', error);
      throw error;
    }
  }

  /**
   * Actualizar estado de una orden
   */
  static async updateOrderStatus(orderId: number, status: OrderStatus) {
    try {
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { 
          status,
          updatedAt: new Date()
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });

      return updatedOrder;
    } catch (error: any) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
}

export default OrderService;
