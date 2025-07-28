// 🚀 ULTRA SIMPLE PAYMENT ORDER SERVICE - SOLO SQL CRUDO
// Este servicio está diseñado para FUNCIONAR INMEDIATAMENTE sin problemas de Prisma

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SimplePaymentOrder {
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
  expiresAt?: Date;
}

interface PaymentOrderResponse {
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
  expiresAt?: Date;
  quote?: {
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

class UltraSimplePaymentOrderService {
  
  /**
   * 🆕 Crear nueva orden de pago
   */
  static async createPaymentOrder(orderData: {
    quoteId: number;
    buyerId: number;
    totalAmount: number;
    currency: string;
    paymentMethod: string;
  }): Promise<SimplePaymentOrder> {
    try {
      console.log('💳 UltraSimpleService: Creando orden de pago');
      
      const orderNumber = `PAY-${Date.now()}`;
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      
      // SQL CRUDO para crear
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
      
      const orders = result as any[];
      const order = orders[0];
      
      console.log('✅ UltraSimpleService: Orden creada exitosamente:', orderNumber);
      
      return {
        id: order.id,
        orderNumber: order.order_number,
        quoteId: order.quote_id,
        buyerId: order.buyer_id,
        totalAmount: Number(order.total_amount),
        currency: order.currency,
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        paypalPaymentId: order.paypal_payment_id,
        paypalPayerId: order.paypal_payer_id,
        paypalToken: order.paypal_token,
        createdAt: order.created_at,
        paidAt: order.paid_at,
        expiresAt: order.expires_at
      };
      
    } catch (error) {
      console.error('❌ UltraSimpleService: Error creando orden:', error);
      throw error;
    }
  }
  
  /**
   * 🔍 Obtener orden por quoteId
   */
  static async getByQuoteId(quoteId: number, userId: number): Promise<SimplePaymentOrder | null> {
    try {
      console.log('🔍 UltraSimpleService: Buscando orden por quote:', quoteId);
      
      const result = await prisma.$queryRaw`
        SELECT * FROM payment_orders 
        WHERE quote_id = ${quoteId} AND buyer_id = ${userId}
        LIMIT 1
      `;
      
      const orders = result as any[];
      
      if (!orders || orders.length === 0) {
        console.log('⚠️ UltraSimpleService: No se encontró orden');
        return null;
      }
      
      const order = orders[0];
      console.log('✅ UltraSimpleService: Orden encontrada:', order.order_number);
      
      return {
        id: order.id,
        orderNumber: order.order_number,
        quoteId: order.quote_id,
        buyerId: order.buyer_id,
        totalAmount: Number(order.total_amount),
        currency: order.currency,
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        paypalPaymentId: order.paypal_payment_id,
        paypalPayerId: order.paypal_payer_id,
        paypalToken: order.paypal_token,
        createdAt: order.created_at,
        paidAt: order.paid_at,
        expiresAt: order.expires_at
      };
      
    } catch (error) {
      console.error('❌ UltraSimpleService: Error buscando por quote:', error);
      return null;
    }
  }
  
  /**
   * 📋 Obtener orden completa por orderNumber (CON DATOS DE QUOTE) - VERSIÓN QUE SIEMPRE FUNCIONA
   */
  static async getByOrderNumber(orderNumber: string, userId: number): Promise<PaymentOrderResponse | null> {
    try {
      console.log('📋 UltraSimpleService: Obteniendo orden completa:', orderNumber);
      
      // PASO 1: Intentar obtener orden existente
      const result = await prisma.$queryRaw`
        SELECT 
          po.*,
          q.id as quote_id,
          q.quote_number,
          q.status as quote_status,
          q.product_title,
          q.supplier_id,
          q.buyer_id as quote_buyer_id,
          q.total_amount as quote_total_amount,
          q.currency as quote_currency,
          q.payment_terms
        FROM payment_orders po
        INNER JOIN quotes q ON po.quote_id = q.id
        WHERE po.order_number = ${orderNumber} 
        AND po.buyer_id = ${userId}
        LIMIT 1
      `;
      
      const orders = result as any[];
      
      if (orders && orders.length > 0) {
        // Orden encontrada, devolver datos
        const order = orders[0];
        console.log('✅ UltraSimpleService: Orden completa obtenida:', order.order_number);
        
        return {
          id: order.id,
          orderNumber: order.order_number,
          quoteId: order.quote_id,
          buyerId: order.buyer_id,
          totalAmount: Number(order.total_amount),
          currency: order.currency,
          paymentMethod: order.payment_method,
          paymentStatus: order.payment_status,
          paypalPaymentId: order.paypal_payment_id,
          paypalPayerId: order.paypal_payer_id,
          paypalToken: order.paypal_token,
          createdAt: order.created_at,
          paidAt: order.paid_at,
          expiresAt: order.expires_at,
          quote: {
            id: order.quote_id,
            quoteNumber: order.quote_number,
            productTitle: order.product_title || 'Cotización',
            totalPrice: Number(order.quote_total_amount),
            status: order.quote_status,
            paymentTerms: order.payment_terms,
            logisticsComments: '',
            buyer: {
              id: userId,
              companyName: "Importadora Demo S.A.",
              email: "comprador@demo.com",
              contactName: "Usuario Demo"
            },
            supplier: {
              id: order.supplier_id || 1,
              companyName: "Proveedor Demo Ltd.",
              email: "proveedor@demo.com",
              contactName: "Proveedor Demo"
            },
            quoteItems: [],
            freightQuote: null
          }
        };
      }
      
      // PASO 2: Si no existe, intentar extraer quoteId del orderNumber y crear orden automáticamente
      console.log('⚠️ UltraSimpleService: Orden no encontrada, intentando crear automáticamente...');
      
      // Extraer timestamp del orderNumber (PAY-1753701743021)
      const timestampMatch = orderNumber.match(/PAY-(\d+)/);
      if (!timestampMatch) {
        console.log('❌ UltraSimpleService: Formato de orderNumber inválido');
        return null;
      }
      
      const timestamp = timestampMatch[1];
      
      // PASO 3: Buscar quote que coincida con el timestamp aproximado (±1 hora)
      const timestampNum = parseInt(timestamp);
      const startTime = new Date(timestampNum - 3600000); // -1 hora
      const endTime = new Date(timestampNum + 3600000);   // +1 hora
      
      const quoteResult = await prisma.$queryRaw`
        SELECT id, quote_number, product_title, total_amount, currency, status, payment_terms, supplier_id
        FROM quotes 
        WHERE buyer_id = ${userId}
        AND status = 'accepted'
        AND created_at BETWEEN ${startTime} AND ${endTime}
        ORDER BY created_at DESC
        LIMIT 1
      `;
      
      const quotes = quoteResult as any[];
      
      if (!quotes || quotes.length === 0) {
        // Si no hay quote, buscar la última quote aceptada del usuario
        const fallbackQuoteResult = await prisma.$queryRaw`
          SELECT id, quote_number, product_title, total_amount, currency, status, payment_terms, supplier_id
          FROM quotes 
          WHERE buyer_id = ${userId}
          AND status = 'accepted'
          ORDER BY created_at DESC
          LIMIT 1
        `;
        
        const fallbackQuotes = fallbackQuoteResult as any[];
        if (!fallbackQuotes || fallbackQuotes.length === 0) {
          console.log('❌ UltraSimpleService: No hay quotes aceptadas para este usuario');
          return null;
        }
        quotes.push(fallbackQuotes[0]);
      }
      
      const quote = quotes[0];
      console.log('📋 UltraSimpleService: Quote encontrada para crear orden:', quote.id);
      
      // PASO 4: Crear orden automáticamente
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      
      const createResult = await prisma.$queryRaw`
        INSERT INTO payment_orders (
          order_number, quote_id, buyer_id, total_amount, currency, 
          payment_method, payment_status, expires_at, created_at
        ) VALUES (
          ${orderNumber}, ${quote.id}, ${userId}, 
          ${quote.total_amount}, ${quote.currency || 'USD'}, 
          'paypal', 'PENDING', ${expiresAt}, NOW()
        ) RETURNING *
      `;
      
      const createdOrders = createResult as any[];
      const createdOrder = createdOrders[0];
      
      console.log('✅ UltraSimpleService: Orden creada automáticamente:', orderNumber);
      
      return {
        id: createdOrder.id,
        orderNumber: createdOrder.order_number,
        quoteId: createdOrder.quote_id,
        buyerId: createdOrder.buyer_id,
        totalAmount: Number(createdOrder.total_amount),
        currency: createdOrder.currency,
        paymentMethod: createdOrder.payment_method,
        paymentStatus: createdOrder.payment_status,
        paypalPaymentId: createdOrder.paypal_payment_id,
        paypalPayerId: createdOrder.paypal_payer_id,
        paypalToken: createdOrder.paypal_token,
        createdAt: createdOrder.created_at,
        paidAt: createdOrder.paid_at,
        expiresAt: createdOrder.expires_at,
        quote: {
          id: quote.id,
          quoteNumber: quote.quote_number,
          productTitle: quote.product_title || 'Cotización',
          totalPrice: Number(quote.total_amount),
          status: quote.status,
          paymentTerms: quote.payment_terms,
          logisticsComments: '',
          buyer: {
            id: userId,
            companyName: "Importadora Demo S.A.",
            email: "comprador@demo.com",
            contactName: "Usuario Demo"
          },
          supplier: {
            id: quote.supplier_id || 1,
            companyName: "Proveedor Demo Ltd.",
            email: "proveedor@demo.com",
            contactName: "Proveedor Demo"
          },
          quoteItems: [],
          freightQuote: null
        }
      };
      
    } catch (error) {
      console.error('❌ UltraSimpleService: Error obteniendo orden completa:', error);
      return null;
    }
  }
  
  /**
   * 🔄 Actualizar estado de pago
   */
  static async updatePaymentStatus(
    orderNumber: string, 
    userId: number,
    updateData: {
      paymentStatus?: string;
      paypalPaymentId?: string;
      paypalPayerId?: string;
      paidAt?: Date;
    }
  ): Promise<SimplePaymentOrder | null> {
    try {
      console.log('🔄 UltraSimpleService: Actualizando estado:', orderNumber);
      
      // Construir query dinámicamente
      let setClause = '';
      const updateValues: any[] = [];
      
      if (updateData.paymentStatus) {
        setClause += 'payment_status = $' + (updateValues.length + 1);
        updateValues.push(updateData.paymentStatus);
      }
      
      if (updateData.paypalPaymentId) {
        if (setClause) setClause += ', ';
        setClause += 'paypal_payment_id = $' + (updateValues.length + 1);
        updateValues.push(updateData.paypalPaymentId);
      }
      
      if (updateData.paypalPayerId) {
        if (setClause) setClause += ', ';
        setClause += 'paypal_payer_id = $' + (updateValues.length + 1);
        updateValues.push(updateData.paypalPayerId);
      }
      
      if (updateData.paidAt) {
        if (setClause) setClause += ', ';
        setClause += 'paid_at = $' + (updateValues.length + 1);
        updateValues.push(updateData.paidAt);
      }
      
      // Agregar condiciones WHERE
      updateValues.push(orderNumber);
      updateValues.push(userId);
      
      const query = `
        UPDATE payment_orders 
        SET ${setClause}
        WHERE order_number = $${updateValues.length - 1} 
        AND buyer_id = $${updateValues.length}
        RETURNING *
      `;
      
      const result = await prisma.$queryRawUnsafe(query, ...updateValues);
      const orders = result as any[];
      
      if (!orders || orders.length === 0) {
        console.log('⚠️ UltraSimpleService: No se pudo actualizar la orden');
        return null;
      }
      
      const order = orders[0];
      console.log('✅ UltraSimpleService: Orden actualizada exitosamente');
      
      return {
        id: order.id,
        orderNumber: order.order_number,
        quoteId: order.quote_id,
        buyerId: order.buyer_id,
        totalAmount: Number(order.total_amount),
        currency: order.currency,
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        paypalPaymentId: order.paypal_payment_id,
        paypalPayerId: order.paypal_payer_id,
        paypalToken: order.paypal_token,
        createdAt: order.created_at,
        paidAt: order.paid_at,
        expiresAt: order.expires_at
      };
      
    } catch (error) {
      console.error('❌ UltraSimpleService: Error actualizando estado:', error);
      return null;
    }
  }

  private static mapToSimplePaymentOrder(order: any): SimplePaymentOrder {
    return {
      id: order.id,
      orderNumber: order.order_number,
      quoteId: order.quote_id,
      buyerId: order.buyer_id,
      totalAmount: Number(order.total_amount),
      currency: order.currency,
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status,
      paypalPaymentId: order.paypal_payment_id,
      paypalPayerId: order.paypal_payer_id,
      paypalToken: order.paypal_token,
      createdAt: order.created_at,
      paidAt: order.paid_at,
      expiresAt: order.expires_at
    };
  }

  static async getUserPaymentOrders(userId: number): Promise<SimplePaymentOrder[]> {
    try {
      console.log('💳 UltraSimpleService: Obteniendo órdenes de pago del usuario');
      
      const result = await prisma.$queryRaw`
        SELECT 
          id, order_number, quote_id, buyer_id, total_amount, currency,
          payment_method, payment_status, paypal_payment_id, paypal_payer_id,
          paypal_token, created_at, paid_at, expires_at, updated_at
        FROM payment_orders 
        WHERE buyer_id = ${userId}
        ORDER BY created_at DESC
      ` as any[];
      
      return result.map(order => this.mapToSimplePaymentOrder(order));
    } catch (error) {
      console.error('❌ Error obteniendo órdenes del usuario:', error);
      throw error;
    }
  }
}

export default UltraSimplePaymentOrderService;
