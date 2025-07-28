// ================================================================
// UNIFIED SERVICE LAYER - SISTEMA COMPLETAMENTE INDIVIDUALIZADO
// ================================================================
// Descripción: Capa de servicios unificada con separación total por usuario
// Sistema tipo Amazon: Cada consulta incluye validación de propietario

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ================================================================
// CART SERVICE - CARRITO INDIVIDUALIZADO
// ================================================================
export class IndividualizedCartService {
  /**
   * 🛒 Obtener items del carrito del usuario
   */
  static async getUserCartItems(userId: number) {
    console.log(`🛒 Obteniendo carrito para usuario ${userId}`);
    
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: userId }, // ✅ FILTRO CRÍTICO
      include: {
        product: {
          include: {
            supplier: {
              select: { id: true, companyName: true }
            }
          }
        }
      }
    });
    
    console.log(`✅ ${cartItems.length} items obtenidos para usuario ${userId}`);
    return cartItems;
  }

  /**
   * ➕ Agregar al carrito
   */
  static async addToCart(userId: number, productId: number, containerType: string, containerQuantity: number, pricePerContainer: number, incoterm: string) {
    console.log(`➕ Agregando producto ${productId} al carrito del usuario ${userId}`);
    
    const cartItem = await prisma.cartItem.create({
      data: {
        userId: userId, // ✅ ASIGNACIÓN CRÍTICA
        productId,
        containerType,
        containerQuantity,
        pricePerContainer,
        incoterm
      }
    });
    
    console.log(`✅ Producto agregado al carrito del usuario ${userId}`);
    return cartItem;
  }

  /**
   * 🗑️ Limpiar carrito del usuario
   */
  static async clearUserCart(userId: number) {
    console.log(`🗑️ Limpiando carrito del usuario ${userId}`);
    
    const result = await prisma.cartItem.deleteMany({
      where: { userId: userId } // ✅ FILTRO CRÍTICO
    });
    
    console.log(`✅ ${result.count} items eliminados del carrito del usuario ${userId}`);
    return result;
  }
}

// ================================================================
// QUOTES SERVICE - COTIZACIONES INDIVIDUALIZADAS
// ================================================================
export class IndividualizedQuotesService {
  /**
   * 📋 Obtener cotizaciones del usuario (basado en rol)
   */
  static async getMyQuotes(userId: number, userType: string) {
    console.log(`📋 Obteniendo cotizaciones para usuario ${userId} (${userType})`);
    
    let whereClause: any;
    
    if (userType === 'BUYER') {
      whereClause = { buyerId: userId }; // ✅ BUYER ve solo sus compras
    } else if (userType === 'SUPPLIER') {
      whereClause = { supplierId: userId }; // ✅ SUPPLIER ve solo sus ventas
    } else {
      throw new Error('Tipo de usuario no válido');
    }
    
    const quotes = await prisma.quote.findMany({
      where: whereClause,
      include: {
        buyer: { select: { id: true, companyName: true } },
        supplier: { select: { id: true, companyName: true } },
        product: { select: { id: true, title: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`✅ ${quotes.length} cotizaciones obtenidas para usuario ${userId}`);
    return quotes;
  }

  /**
   * 🔍 Obtener cotización por ID (solo si pertenece al usuario)
   */
  static async getQuoteById(quoteId: number, userId: number, userType: string) {
    console.log(`🔍 Obteniendo cotización ${quoteId} para usuario ${userId} (${userType})`);
    
    let whereClause: any = { id: quoteId };
    
    if (userType === 'BUYER') {
      whereClause.buyerId = userId; // ✅ VALIDACIÓN CRÍTICA
    } else if (userType === 'SUPPLIER') {
      whereClause.supplierId = userId; // ✅ VALIDACIÓN CRÍTICA
    }
    
    const quote = await prisma.quote.findFirst({
      where: whereClause,
      include: {
        buyer: { select: { id: true, companyName: true, email: true } },
        supplier: { select: { id: true, companyName: true, email: true } },
        product: { select: { id: true, title: true } }
      }
    });
    
    if (!quote) {
      console.log(`⚠️ Cotización ${quoteId} no encontrada o no pertenece al usuario ${userId}`);
      return null;
    }
    
    console.log(`✅ Cotización obtenida para usuario autorizado`);
    return quote;
  }
}

// ================================================================
// PAYMENT ORDERS SERVICE - ÓRDENES DE PAGO INDIVIDUALIZADAS
// ================================================================
export class IndividualizedPaymentOrderService {
  /**
   * 💳 Obtener órdenes de pago del usuario
   */
  static async getUserPaymentOrders(userId: number) {
    console.log(`💳 Obteniendo órdenes de pago para usuario ${userId}`);
    
    const paymentOrders = await prisma.paymentOrder.findMany({
      where: { buyerId: userId }, // ✅ FILTRO CRÍTICO
      include: {
        buyer: { select: { id: true, companyName: true } },
        quote: { select: { id: true, productTitle: true, status: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`✅ ${paymentOrders.length} órdenes de pago obtenidas para usuario ${userId}`);
    return paymentOrders;
  }

  /**
   * 🔍 Obtener orden de pago por ID (solo si pertenece al usuario)
   */
  static async getPaymentOrderById(paymentOrderId: number, userId: number) {
    console.log(`🔍 Obteniendo orden de pago ${paymentOrderId} para usuario ${userId}`);
    
    const paymentOrder = await prisma.paymentOrder.findFirst({
      where: {
        id: paymentOrderId,
        buyerId: userId // ✅ VALIDACIÓN CRÍTICA
      },
      include: {
        buyer: { select: { id: true, companyName: true, email: true } },
        quote: { select: { id: true, productTitle: true, status: true } }
      }
    });
    
    if (!paymentOrder) {
      console.log(`⚠️ Orden de pago ${paymentOrderId} no encontrada o no pertenece al usuario ${userId}`);
      return null;
    }
    
    console.log(`✅ Orden de pago obtenida para usuario autorizado`);
    return paymentOrder;
  }
}

// ================================================================
// PRODUCTS SERVICE - PRODUCTOS INDIVIDUALIZADOS
// ================================================================
export class IndividualizedProductService {
  /**
   * 🏪 Obtener productos del supplier
   */
  static async getSupplierProducts(supplierId: number) {
    console.log(`🏪 Obteniendo productos del supplier ${supplierId}`);
    
    const products = await prisma.product.findMany({
      where: {
        supplierId: supplierId, // ✅ FILTRO CRÍTICO
        isActive: true
      },
      include: {
        supplier: { select: { id: true, companyName: true } },
        category: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`✅ ${products.length} productos obtenidos para supplier ${supplierId}`);
    return products;
  }

  /**
   * 🛒 Obtener productos públicos (para buyers)
   */
  static async getPublicProducts(page: number = 1, limit: number = 20) {
    console.log(`🛒 Obteniendo productos públicos (página ${page})`);
    
    const skip = (page - 1) * limit;
    
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true },
        include: {
          supplier: { select: { id: true, companyName: true } },
          category: { select: { id: true, name: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.product.count({ where: { isActive: true } })
    ]);
    
    console.log(`✅ ${products.length} productos públicos obtenidos`);
    return {
      products,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    };
  }

  /**
   * 🔍 Obtener producto por ID (con validación de propietario para suppliers)
   */
  static async getProductById(productId: number, userId?: number, userType?: string) {
    console.log(`🔍 Obteniendo producto ${productId} para usuario ${userId} (${userType})`);
    
    let whereClause: any = {
      id: productId,
      isActive: true
    };
    
    // Si es SUPPLIER, solo puede ver sus propios productos
    if (userType === 'SUPPLIER' && userId) {
      whereClause.supplierId = userId; // ✅ VALIDACIÓN CRÍTICA
    }
    
    const product = await prisma.product.findFirst({
      where: whereClause,
      include: {
        supplier: { select: { id: true, companyName: true } },
        category: { select: { id: true, name: true } }
      }
    });
    
    if (!product) {
      console.log(`⚠️ Producto ${productId} no encontrado o no accesible para usuario ${userId}`);
      return null;
    }
    
    console.log(`✅ Producto obtenido para usuario autorizado`);
    return product;
  }
}

// ================================================================
// UNIFIED SERVICE - SERVICIO PRINCIPAL UNIFICADO
// ================================================================
export class UnifiedIndividualizedService {
  static Cart = IndividualizedCartService;
  static Quotes = IndividualizedQuotesService;
  static PaymentOrders = IndividualizedPaymentOrderService;
  static Products = IndividualizedProductService;
  
  /**
   * 🔒 Verificar propiedad de recurso
   */
  static async verifyResourceOwnership(resourceType: string, resourceId: number, userId: number, userType: string): Promise<boolean> {
    console.log(`🔒 Verificando propiedad de ${resourceType} ${resourceId} para usuario ${userId}`);
    
    try {
      switch (resourceType) {
        case 'quote':
          const quote = await this.Quotes.getQuoteById(resourceId, userId, userType);
          return quote !== null;
          
        case 'paymentOrder':
          const paymentOrder = await this.PaymentOrders.getPaymentOrderById(resourceId, userId);
          return paymentOrder !== null;
          
        case 'product':
          if (userType === 'SUPPLIER') {
            const product = await this.Products.getProductById(resourceId, userId, userType);
            return product !== null;
          }
          return true; // Los buyers pueden ver todos los productos públicos
          
        default:
          console.log(`⚠️ Tipo de recurso no reconocido: ${resourceType}`);
          return false;
      }
    } catch (error) {
      console.error(`❌ Error verificando propiedad:`, error);
      return false;
    }
  }
  
  /**
   * 📊 Obtener estadísticas del usuario
   */
  static async getUserStats(userId: number, userType: string) {
    console.log(`📊 Obteniendo estadísticas para usuario ${userId} (${userType})`);
    
    try {
      const stats: any = {};
      
      if (userType === 'BUYER') {
        stats.cartItems = await this.Cart.getUserCartItems(userId);
        stats.quotes = await this.Quotes.getMyQuotes(userId, userType);
        stats.paymentOrders = await this.PaymentOrders.getUserPaymentOrders(userId);
      } else if (userType === 'SUPPLIER') {
        stats.products = await this.Products.getSupplierProducts(userId);
        stats.quotes = await this.Quotes.getMyQuotes(userId, userType);
      }
      
      console.log(`✅ Estadísticas obtenidas para usuario ${userId}`);
      return stats;
    } catch (error) {
      console.error(`❌ Error obteniendo estadísticas:`, error);
      throw error;
    }
  }
}

export default UnifiedIndividualizedService;
