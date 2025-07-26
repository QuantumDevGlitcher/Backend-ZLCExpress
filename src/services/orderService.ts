import { Order, OrderItem, OrderStatus, CreateOrderData } from '../types';
import { CartService, Cart, CartItem } from './cartService';
import { ProductService } from './productService';

// Mock database
const mockOrders: Order[] = [];
const mockOrderItems: OrderItem[] = [];
let nextOrderId = 1;
let nextOrderItemId = 1;

export class OrderService {
  static async createOrder(userId: string, orderData: CreateOrderData): Promise<Order> {
    // Obtener carrito del usuario
    const cart = await CartService.getCart(userId);
    
    if (cart.items.length === 0) {
      throw new Error('El carrito está vacío');
    }

    // Verificar stock de todos los productos
    for (const item of cart.items) {
      const product = await ProductService.getProductById(item.productId);
      if (!product || product.stockContainers < item.containerQuantity) {
        throw new Error(`Stock insuficiente para el producto: ${product?.name || 'Desconocido'}`);
      }
    }

    // Crear el pedido
    const newOrder: Order = {
      id: nextOrderId++,
      userId: parseInt(userId),
      status: OrderStatus.PENDING,
      total: cart.totalAmount,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      items: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Crear los items del pedido
    const orderItems: OrderItem[] = [];
    for (const cartItem of cart.items) {
      const product = await ProductService.getProductById(cartItem.productId);
      if (product) {
        const orderItem: OrderItem = {
          id: nextOrderItemId++,
          orderId: newOrder.id,
          productId: cartItem.productId,
          product,
          quantity: cartItem.containerQuantity,
          price: product.pricePerContainer
        };
        orderItems.push(orderItem);
        mockOrderItems.push(orderItem);

        // Actualizar stock
        await ProductService.updateStock(cartItem.productId, cartItem.containerQuantity);
      }
    }

    newOrder.items = orderItems;
    mockOrders.push(newOrder);

    // Limpiar carrito
    await CartService.clearCart(userId);

    return newOrder;
  }

  static async getOrdersByUserId(userId: string): Promise<Order[]> {
    const userIdNum = parseInt(userId);
    const userOrders = mockOrders.filter(order => order.userId === userIdNum);
    
    // Obtener items para cada pedido
    return await Promise.all(
      userOrders.map(async (order) => {
        const items = mockOrderItems.filter(item => item.orderId === order.id);
        const itemsWithProducts = await Promise.all(
          items.map(async (item) => {
            const product = await ProductService.getProductById(item.productId);
            return {
              ...item,
              product: product || undefined
            };
          })
        );
        
        return {
          ...order,
          items: itemsWithProducts
        };
      })
    );
  }

  static async getOrderById(orderId: number, userId: string): Promise<Order | null> {
    const userIdNum = parseInt(userId);
    const order = mockOrders.find(o => o.id === orderId && o.userId === userIdNum);
    
    if (!order) {
      return null;
    }

    // Obtener items del pedido
    const items = mockOrderItems.filter(item => item.orderId === orderId);
    const itemsWithProducts = await Promise.all(
      items.map(async (item) => {
        const product = await ProductService.getProductById(item.productId);
        return {
          ...item,
          product: product || undefined
        };
      })
    );

    return {
      ...order,
      items: itemsWithProducts
    };
  }

  static async updateOrderStatus(orderId: number, status: OrderStatus): Promise<Order> {
    const order = mockOrders.find(o => o.id === orderId);
    
    if (!order) {
      throw new Error('Pedido no encontrado');
    }

    order.status = status;
    order.updatedAt = new Date();

    return order;
  }
}
