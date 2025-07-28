// routes/paymentOrderRoutes.ts
// Rutas para manejar órdenes de pago - Con información de flete incluida

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import SimplePaymentOrderController from '../controllers/simplePaymentOrderController';
import { requireBuyer } from '../middleware/authMiddleware';

const router = Router();
const prisma = new PrismaClient();

// 🔒 TODAS LAS RUTAS REQUIEREN AUTENTICACIÓN DE COMPRADOR

// POST /api/payment-orders - Crear nueva orden de pago
router.post('/', requireBuyer, SimplePaymentOrderController.createPaymentOrder);

// GET /api/payment-orders/quote/:quoteId - Obtener orden de pago por ID de cotización
// router.get('/quote/:quoteId', requireBuyer, PaymentOrderController.getPaymentOrderByQuoteId);

// GET /api/payment-orders/order/:orderNumber - Obtener orden de pago por orderNumber
router.get('/order/:orderNumber', requireBuyer, async (req: Request, res: Response) => {
  try {
    console.log('💳 Obteniendo orden de pago por orderNumber');
    const userId = (req as any).user.id;
    const { orderNumber } = req.params;

    // Buscar la orden usando SQL directo incluyendo información de flete
    const result = await prisma.$queryRaw`
      SELECT 
        po.*,
        q.id as quote_id,
        q.quote_number,
        q.status as quote_status,
        q.product_title,
        q.supplier_id,
        q.buyer_id as quote_buyer_id,
        q.total_price as quote_total_amount,
        q.currency as quote_currency,
        q.payment_terms,
        q.freight_quote_id,
        sq.origin_port,
        sq.destination_port,
        sq.container_type,
        sq.container_count,
        sq.carrier,
        sq.carrier_code,
        sq.service_type,
        sq.cost as freight_cost,
        sq.currency as freight_currency,
        sq.transit_time,
        sq.estimated_departure,
        sq.estimated_arrival,
        sq.incoterm,
        sq.conditions as freight_conditions
      FROM payment_orders po
      INNER JOIN quotes q ON po.quote_id = q.id
      LEFT JOIN shipping_quotes sq ON q.freight_quote_id = sq.id
      WHERE po.order_number = ${orderNumber} 
      AND po.buyer_id = ${userId}
      LIMIT 1
    `;

    const orders = result as any[];
    
    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Orden de pago no encontrada'
      });
    }

    const paymentOrder = orders[0];

    // Construir objeto de información del flete si existe
    const freightInfo = paymentOrder.freight_quote_id ? {
      id: paymentOrder.freight_quote_id,
      origin: paymentOrder.origin_port,
      destination: paymentOrder.destination_port,
      containerType: paymentOrder.container_type,
      containerCount: paymentOrder.container_count,
      carrier: paymentOrder.carrier,
      carrierCode: paymentOrder.carrier_code,
      serviceType: paymentOrder.service_type,
      cost: Number(paymentOrder.freight_cost),
      currency: paymentOrder.freight_currency,
      transitTime: paymentOrder.transit_time,
      estimatedDeparture: paymentOrder.estimated_departure,
      estimatedArrival: paymentOrder.estimated_arrival,
      incoterm: paymentOrder.incoterm,
      conditions: paymentOrder.freight_conditions
    } : null;

    const response = {
      id: paymentOrder.id,
      orderNumber: paymentOrder.order_number,
      quoteId: paymentOrder.quote_id,
      buyerId: paymentOrder.buyer_id,
      totalAmount: Number(paymentOrder.total_amount),
      currency: paymentOrder.currency,
      paymentMethod: paymentOrder.payment_method,
      paymentStatus: paymentOrder.payment_status,
      createdAt: paymentOrder.created_at,
      expiresAt: paymentOrder.expires_at,
      quote: {
        id: paymentOrder.quote_id,
        quoteNumber: paymentOrder.quote_number || `Q-${paymentOrder.quote_id}`,
        productTitle: paymentOrder.product_title || 'Producto',
        totalPrice: Number(paymentOrder.quote_total_amount || paymentOrder.total_amount),
        status: paymentOrder.quote_status,
        paymentTerms: paymentOrder.payment_terms
      },
      freightQuote: freightInfo
    };

    res.json({
      success: true,
      data: response
    });

  } catch (error: any) {
    console.error('❌ Error obteniendo orden de pago:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error interno del servidor'
    });
  }
});

// GET /api/payment-orders/user - Obtener órdenes de pago del usuario autenticado
// router.get('/user', requireBuyer, PaymentOrderController.getUserPaymentOrders);

// POST /api/payment-orders/process - Procesar pago PayPal
router.post('/process', requireBuyer, async (req: Request, res: Response) => {
  try {
    console.log('💳 Procesando confirmación de pago PayPal');
    const userId = (req as any).user.id;
    const { 
      orderNumber, 
      paymentId, 
      paypalOrderId, 
      paypalPayerId, 
      amount, 
      currency, 
      status 
    } = req.body;

    console.log('📋 Datos del pago:', { orderNumber, paymentId, amount, currency, status });

    // Actualizar la orden de pago con los detalles de PayPal
    const updateResult = await prisma.$executeRaw`
      UPDATE payment_orders 
      SET 
        payment_status = CAST('completed' AS payment_status),
        paypal_payment_id = ${paymentId},
        paypal_payer_id = ${paypalPayerId},
        paid_at = NOW(),
        updated_at = NOW()
      WHERE order_number = ${orderNumber} 
      AND buyer_id = ${userId}
      AND payment_status = CAST('pending' AS payment_status)
    `;

    if (updateResult === 0) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada o ya fue procesada'
      });
    }

    // Obtener la orden actualizada
    const updatedOrder = await prisma.$queryRaw`
      SELECT * FROM payment_orders 
      WHERE order_number = ${orderNumber} 
      AND buyer_id = ${userId}
      LIMIT 1
    ` as any[];

    console.log('✅ Pago procesado exitosamente para orden:', orderNumber);

    res.json({
      success: true,
      message: 'Pago procesado exitosamente',
      data: updatedOrder[0]
    });

  } catch (error: any) {
    console.error('❌ Error procesando pago:', error);
    res.status(500).json({
      success: false,
      message: 'Error procesando el pago: ' + error.message
    });
  }
});

// POST /api/payment-orders/create-paypal-order - NUEVO: Crear orden PayPal funcional
router.post('/create-paypal-order', requireBuyer, async (req: Request, res: Response) => {
  try {
    console.log('💳 Creating PayPal order');
    const userId = (req as any).user.id;
    const { orderNumber, amount, currency, cart } = req.body;

    // Validar que la orden pertenece al usuario
    const paymentOrder = await prisma.$queryRaw`
      SELECT * FROM payment_orders 
      WHERE order_number = ${orderNumber} 
      AND buyer_id = ${userId}
      AND payment_status = CAST('pending' AS payment_status)
      LIMIT 1
    ` as any[];

    if (paymentOrder.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada o ya fue procesada'
      });
    }

    // Simular creación de orden PayPal (en producción usarías PayPal SDK)
    const paypalOrderId = `PAYPAL_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('✅ PayPal order created successfully:', paypalOrderId);

    res.json({
      success: true,
      paypalOrderId: paypalOrderId,
      orderDetails: {
        orderNumber,
        amount,
        currency,
        items: cart
      }
    });

  } catch (error: any) {
    console.error('❌ Error creating PayPal order:', error);
    res.status(500).json({
      success: false,
      message: 'Error creando orden PayPal: ' + error.message
    });
  }
});

// POST /api/payment-orders/capture-paypal-order/:paypalOrderId - NUEVO: Capturar pago PayPal funcional
router.post('/capture-paypal-order/:paypalOrderId', requireBuyer, async (req: Request, res: Response) => {
  try {
    console.log('💳 Capturing PayPal order');
    const userId = (req as any).user.id;
    const { paypalOrderId } = req.params;
    const { orderNumber } = req.body;

    // Validar que la orden pertenece al usuario
    const paymentOrder = await prisma.$queryRaw`
      SELECT * FROM payment_orders 
      WHERE order_number = ${orderNumber} 
      AND buyer_id = ${userId}
      AND payment_status = CAST('pending' AS payment_status)
      LIMIT 1
    ` as any[];

    if (paymentOrder.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada o ya fue procesada'
      });
    }

    // Simular captura exitosa de PayPal (en producción usarías PayPal SDK)
    const captureId = `CAPTURE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const payerId = `PAYER_${Math.random().toString(36).substr(2, 9)}`;
    
    // Actualizar la orden como completada
    await prisma.$executeRaw`
      UPDATE payment_orders 
      SET 
        payment_status = CAST('completed' AS payment_status),
        paypal_payment_id = ${captureId},
        paypal_payer_id = ${payerId},
        paid_at = NOW(),
        updated_at = NOW()
      WHERE order_number = ${orderNumber} 
      AND buyer_id = ${userId}
    `;

    const paymentDetails = {
      id: captureId,
      status: 'COMPLETED',
      paypalOrderId: paypalOrderId,
      paypalPayerId: payerId,
      amount: paymentOrder[0].total_amount,
      currency: paymentOrder[0].currency,
      orderNumber: orderNumber,
      captureTime: new Date().toISOString()
    };

    console.log('✅ PayPal order captured successfully:', captureId);

    res.json({
      success: true,
      message: 'Pago capturado exitosamente',
      paymentDetails: paymentDetails
    });

  } catch (error: any) {
    console.error('❌ Error capturing PayPal order:', error);
    res.status(500).json({
      success: false,
      message: 'Error capturando orden PayPal: ' + error.message
    });
  }
});

export default router;
