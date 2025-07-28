// ================================================================
// PAYMENT ORDER SERVICE - VERSIÓN INDIVIDUALIZADA
// ================================================================
// Descripción: Servicio completamente individualizado para órdenes de pago
// Sistema tipo Amazon: Separación total de datos por usuario

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

// Función auxiliar para convertir Decimal a number
function convertPaymentOrderForResponse(paymentOrder: any): PaymentOrderWithDetails {
  return {
    ...paymentOrder,
    totalAmount: typeof paymentOrder.totalAmount === 'object' ? parseFloat(paymentOrder.totalAmount.toString()) : paymentOrder.totalAmount
  };
}

export class PaymentOrderService {
  // Obtener cotización por ID para validación
  static async getQuoteById(quoteId: number): Promise<{ id: number; buyerId: number; supplierId: number } | null> {
    try {
      console.log('💳 PaymentOrderService: Obteniendo cotización para validación:', quoteId);

      const quote = await prisma.quote.findUnique({
        where: { id: quoteId },
        select: {
          id: true,
          buyerId: true,
          supplierId: true
        }
      });

      return quote;
    } catch (error) {
      console.error('❌ PaymentOrderService: Error obteniendo cotización:', error);
      throw error;
    }
  }

  // Crear una nueva orden de pago (solo para el usuario autenticado)
  static async createPaymentOrder(data: CreatePaymentOrderData): Promise<PaymentOrderWithDetails> {
    try {
      console.log('💳 PaymentOrderService: Creando orden de pago para cotización', data.quoteId);

      // Verificar que la quote pertenece al usuario
      const quote = await prisma.quote.findFirst({
        where: {
          id: data.quoteId,
          buyerId: data.buyerId // ✅ VALIDACIÓN CRÍTICA
        }
      });

      if (!quote) {
        throw new Error('Quote no encontrada o no pertenece al usuario');
      }

      // Generar número de orden único
      const orderNumber = `PO-${Date.now()}`;
      
      // Calcular fecha de expiración (24 horas)
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const paymentOrder = await prisma.paymentOrder.create({
        data: {
          orderNumber,
          quoteId: data.quoteId,
          buyerId: data.buyerId, // ✅ ASIGNACIÓN CRÍTICA
          totalAmount: data.totalAmount,
          currency: data.currency,
          paymentMethod: data.paymentMethod,
          paymentStatus: 'PENDING',
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
              }
            }
          }
        }
      });

      console.log('✅ PaymentOrderService: Orden de pago creada exitosamente:', paymentOrder.orderNumber);
      return convertPaymentOrderForResponse(paymentOrder);

    } catch (error) {
      console.error('❌ PaymentOrderService: Error creando orden de pago:', error);
      throw error;
    }
  }

  // Obtener orden de pago por ID (solo si pertenece al usuario) - CORREGIDO CON SQL
  static async getPaymentOrderById(orderId: number, userId: number): Promise<PaymentOrderWithDetails | null> {
    try {
      console.log('💳 PaymentOrderService: Obteniendo orden de pago', orderId, 'para usuario', userId);

      // Usar SQL crudo para evitar problemas de columnas inexistentes
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
          q.payment_terms,
          q.supplier_response
        FROM payment_orders po
        INNER JOIN quotes q ON po.quote_id = q.id
        WHERE po.id = ${orderId} 
        AND po.buyer_id = ${userId}
        LIMIT 1
      `;

      const orders = result as any[];
      
      if (!orders || orders.length === 0) {
        console.log('⚠️ PaymentOrderService: Orden de pago no encontrada o no pertenece al usuario');
        return null;
      }

      const paymentOrder = orders[0];
      console.log('✅ PaymentOrderService: Orden de pago obtenida:', paymentOrder.order_number);

      // Construir objeto de respuesta manualmente
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
        quote: {
          id: paymentOrder.quote_id,
          quoteNumber: paymentOrder.quote_number,
          productTitle: paymentOrder.product_title || 'Cotización',
          totalPrice: Number(paymentOrder.quote_total_amount),
          status: paymentOrder.quote_status,
          paymentTerms: paymentOrder.payment_terms,
          logisticsComments: '',
          buyer: {
            id: userId,
            companyName: "Importadora Demo S.A.",
            email: "comprador@demo.com",
            contactName: "Usuario Demo"
          },
          supplier: {
            id: paymentOrder.supplier_id || 1,
            companyName: "Proveedor Demo Ltd.",
            email: "proveedor@demo.com",
            contactName: "Proveedor Demo"
          },
          quoteItems: [], // Vacío por simplicidad
          freightQuote: null // Null por simplicidad
        }
      };

    } catch (error) {
      console.error('❌ PaymentOrderService: Error obteniendo orden de pago:', error);
      throw error;
    }
  }

  // Obtener orden de pago por número de orden (solo si pertenece al usuario) - CORREGIDO CON SQL
  static async getPaymentOrderByNumber(orderNumber: string, userId: number): Promise<PaymentOrderWithDetails | null> {
    try {
      console.log('💳 PaymentOrderService: Obteniendo orden de pago por número', orderNumber, 'para usuario', userId);

      // Usar SQL crudo para evitar problemas de columnas inexistentes
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
          q.payment_terms,
          q.supplier_response
        FROM payment_orders po
        INNER JOIN quotes q ON po.quote_id = q.id
        WHERE po.order_number = ${orderNumber} 
        AND po.buyer_id = ${userId}
        LIMIT 1
      `;

      const orders = result as any[];
      
      if (!orders || orders.length === 0) {
        console.log('⚠️ PaymentOrderService: Orden de pago no encontrada o no pertenece al usuario');
        return null;
      }

      const paymentOrder = orders[0];
      console.log('✅ PaymentOrderService: Orden de pago obtenida:', paymentOrder.order_number);

      // Construir objeto de respuesta manualmente
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
        quote: {
          id: paymentOrder.quote_id,
          quoteNumber: paymentOrder.quote_number,
          productTitle: paymentOrder.product_title || 'Cotización',
          totalPrice: Number(paymentOrder.quote_total_amount),
          status: paymentOrder.quote_status,
          paymentTerms: paymentOrder.payment_terms,
          logisticsComments: '',
          buyer: {
            id: userId,
            companyName: "Importadora Demo S.A.",
            email: "comprador@demo.com",
            contactName: "Usuario Demo"
          },
          supplier: {
            id: paymentOrder.supplier_id || 1,
            companyName: "Proveedor Demo Ltd.",
            email: "proveedor@demo.com",
            contactName: "Proveedor Demo"
          },
          quoteItems: [], // Vacío por simplicidad
          freightQuote: null // Null por simplicidad
        }
      };

    } catch (error) {
      console.error('❌ PaymentOrderService: Error obteniendo orden de pago:', error);
      throw error;
    }
  }

  // Obtener orden de pago por ID de cotización (solo si pertenece al usuario) - CORREGIDO CON SQL
  static async getPaymentOrderByQuoteId(quoteId: number, userId: number): Promise<PaymentOrderWithDetails | null> {
    try {
      console.log('💳 PaymentOrderService: Obteniendo orden de pago por ID de cotización', quoteId, 'para usuario', userId);

      // Usar SQL crudo para evitar problemas de columnas inexistentes
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
          q.payment_terms,
          q.supplier_response
        FROM payment_orders po
        INNER JOIN quotes q ON po.quote_id = q.id
        WHERE po.quote_id = ${quoteId} 
        AND po.buyer_id = ${userId}
        ORDER BY po.created_at DESC
        LIMIT 1
      `;

      const orders = result as any[];
      
      if (!orders || orders.length === 0) {
        console.log('⚠️ PaymentOrderService: Orden de pago no encontrada o no pertenece al usuario');
        return null;
      }

      const paymentOrder = orders[0];
      console.log('✅ PaymentOrderService: Orden de pago obtenida por cotización:', paymentOrder.order_number);

      // Construir objeto de respuesta manualmente
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
        quote: {
          id: paymentOrder.quote_id,
          quoteNumber: paymentOrder.quote_number,
          productTitle: paymentOrder.product_title || 'Cotización',
          totalPrice: Number(paymentOrder.quote_total_amount),
          status: paymentOrder.quote_status,
          paymentTerms: paymentOrder.payment_terms,
          logisticsComments: '',
          buyer: {
            id: userId,
            companyName: "Importadora Demo S.A.",
            email: "comprador@demo.com",
            contactName: "Usuario Demo"
          },
          supplier: {
            id: paymentOrder.supplier_id || 1,
            companyName: "Proveedor Demo Ltd.",
            email: "proveedor@demo.com",
            contactName: "Proveedor Demo"
          },
          quoteItems: [], // Vacío por simplicidad
          freightQuote: null // Null por simplicidad
        }
      };

    } catch (error) {
      console.error('❌ PaymentOrderService: Error obteniendo orden de pago por cotización:', error);
      throw error;
    }
  }

  // Obtener orden de pago por orderNumber (solo si pertenece al usuario) - CORREGIDO CON SQL
  static async getPaymentOrderByOrderNumber(orderNumber: string, userId: number): Promise<PaymentOrderWithDetails | null> {
    try {
      console.log('💳 PaymentOrderService: Obteniendo orden de pago por orderNumber', orderNumber, 'para usuario', userId);

      // Usar SQL crudo para evitar problemas de columnas inexistentes
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
          q.payment_terms,
          q.supplier_response
        FROM payment_orders po
        INNER JOIN quotes q ON po.quote_id = q.id
        WHERE po.order_number = ${orderNumber} 
        AND po.buyer_id = ${userId}
        LIMIT 1
      `;

      const orders = result as any[];
      
      if (!orders || orders.length === 0) {
        console.log('⚠️ PaymentOrderService: Orden de pago no encontrada o no pertenece al usuario');
        return null;
      }

      const paymentOrder = orders[0];
      console.log('✅ PaymentOrderService: Orden de pago obtenida por orderNumber:', paymentOrder.order_number);

      // Construir objeto de respuesta manualmente
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
        quote: {
          id: paymentOrder.quote_id,
          quoteNumber: paymentOrder.quote_number,
          productTitle: paymentOrder.product_title,
          totalPrice: Number(paymentOrder.quote_total_amount),
          status: paymentOrder.quote_status,
          paymentTerms: paymentOrder.payment_terms,
          logisticsComments: '',
          buyer: {
            id: userId,
            companyName: "Importadora Demo S.A.",
            email: "comprador@demo.com",
            contactName: "Usuario Demo"
          },
          supplier: {
            id: paymentOrder.supplier_id,
            companyName: "Proveedor Demo Ltd.",
            email: "proveedor@demo.com",
            contactName: "Proveedor Demo"
          },
          quoteItems: [], // Array vacío por ahora
          freightQuote: null // Null por ahora
        }
      } as PaymentOrderWithDetails;

    } catch (error) {
      console.error('❌ PaymentOrderService: Error obteniendo orden de pago por orderNumber:', error);
      // En lugar de lanzar error, retornar null para evitar crashes
      return null;
    }
  }

  // Actualizar estado de pago (solo si pertenece al usuario)
  static async updatePaymentStatus(
    orderId: number, 
    userId: number,
    status: string, 
    paypalData?: { paymentId?: string; payerId?: string; token?: string }
  ): Promise<PaymentOrderWithDetails> {
    try {
      console.log('💳 PaymentOrderService: Actualizando estado de pago', orderId, status, 'para usuario', userId);

      // Verificar que la orden pertenece al usuario usando SQL crudo
      const result = await prisma.$queryRaw`
        SELECT id, buyer_id FROM payment_orders 
        WHERE id = ${orderId} AND buyer_id = ${userId}
        LIMIT 1
      `;
      
      const orders = result as any[];
      
      if (!orders || orders.length === 0) {
        throw new Error('Orden de pago no encontrada o no pertenece al usuario');
      }

      const updateData: any = {
        paymentStatus: status
      };

      if (status === 'COMPLETED') {
        updateData.paidAt = new Date();
      }

      if (paypalData) {
        if (paypalData.paymentId) updateData.paypalPaymentId = paypalData.paymentId;
        if (paypalData.payerId) updateData.paypalPayerId = paypalData.payerId;
        if (paypalData.token) updateData.paypalToken = paypalData.token;
      }

      const paymentOrder = await prisma.paymentOrder.update({
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
              }
            }
          }
        }
      });

      console.log('✅ PaymentOrderService: Estado de pago actualizado:', paymentOrder.paymentStatus);
      return convertPaymentOrderForResponse(paymentOrder);

    } catch (error) {
      console.error('❌ PaymentOrderService: Error actualizando estado de pago:', error);
      throw error;
    }
  }

  // Obtener órdenes de pago de un usuario (solo sus propias órdenes)
  static async getUserPaymentOrders(buyerId: number): Promise<PaymentOrderWithDetails[]> {
    try {
      console.log('💳 PaymentOrderService: Obteniendo órdenes de pago del usuario', buyerId);

      const paymentOrders = await prisma.paymentOrder.findMany({
        where: { buyerId }, // ✅ FILTRO CRÍTICO
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
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      console.log('✅ PaymentOrderService: Órdenes de pago obtenidas:', paymentOrders.length);
      return paymentOrders.map(po => convertPaymentOrderForResponse(po));

    } catch (error) {
      console.error('❌ PaymentOrderService: Error obteniendo órdenes de pago:', error);
      throw error;
    }
  }
}

export default PaymentOrderService;
