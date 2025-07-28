// ================================================================
// SIMPLE PAYMENT ORDER CONTROLLER - TEMPORAL
// ================================================================

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SimplePaymentOrderController {
  // Crear nueva orden de pago
  static async createPaymentOrder(req: Request, res: Response): Promise<void> {
    try {
      console.log('💳 SimplePaymentOrderController: Creando orden de pago');
      
      const userId = (req as any).user.id;
      const { quoteId, totalAmount, currency, paymentMethod } = req.body;

      if (!quoteId || !totalAmount || !currency || !paymentMethod) {
        res.status(400).json({
          success: false,
          message: 'Faltan campos obligatorios: quoteId, totalAmount, currency, paymentMethod'
        });
        return;
      }

      // Verificar si ya existe una orden de pago para esta cotización
      console.log('🔍 Verificando orden existente para cotización:', quoteId);
      
      const existingOrder = await prisma.$queryRaw`
        SELECT * FROM payment_orders 
        WHERE quote_id = ${parseInt(quoteId)} AND buyer_id = ${userId}
        LIMIT 1
      `;
      
      const existingOrders = existingOrder as any[];
      
      if (existingOrders && existingOrders.length > 0) {
        const order = existingOrders[0];
        console.log('✅ Orden existente encontrada:', order.order_number);
        res.status(200).json({
          success: true,
          data: {
            id: order.id,
            orderNumber: order.order_number,
            quoteId: order.quote_id,
            buyerId: order.buyer_id,
            totalAmount: Number(order.total_amount),
            currency: order.currency,
            paymentMethod: order.payment_method,
            paymentStatus: order.payment_status,
            createdAt: order.created_at,
            expiresAt: order.expires_at
          },
          message: 'Orden de pago ya existe para esta cotización'
        });
        return;
      }

      // Crear nueva orden
      const orderNumber = `PAY-${Date.now()}`;
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      
      console.log('🆕 Creando nueva orden de pago...');
      
      const result = await prisma.$queryRaw`
        INSERT INTO payment_orders (
          order_number, quote_id, buyer_id, total_amount, currency, 
          payment_method, payment_status, expires_at, created_at
        ) VALUES (
          ${orderNumber}, ${parseInt(quoteId)}, ${userId}, 
          ${parseFloat(totalAmount)}, ${currency}, 
          ${paymentMethod}, 'pending', ${expiresAt}, NOW()
        ) RETURNING *
      `;
      
      const createdOrders = result as any[];
      const newOrder = createdOrders[0];
      
      console.log('✅ Orden creada exitosamente:', orderNumber);

      res.status(201).json({
        success: true,
        data: {
          id: newOrder.id,
          orderNumber: newOrder.order_number,
          quoteId: newOrder.quote_id,
          buyerId: newOrder.buyer_id,
          totalAmount: Number(newOrder.total_amount),
          currency: newOrder.currency,
          paymentMethod: newOrder.payment_method,
          paymentStatus: newOrder.payment_status,
          createdAt: newOrder.created_at,
          expiresAt: newOrder.expires_at
        },
        message: 'Orden de pago creada exitosamente'
      });

    } catch (error: any) {
      console.error('❌ SimplePaymentOrderController: Error creando orden de pago:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error interno del servidor'
      });
    }
  }
}

export default SimplePaymentOrderController;
