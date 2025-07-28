// ================================================================
// PAYMENT ORDER CONTROLLER - Versión Limpia y Funcional
// ================================================================
// Descripción: Controlador para gestión de órdenes de pago
// Integración completa con auth middleware usando JWT

import { Request, Response } from 'express';
import { SimplePaymentOrderService } from '../services/simplePaymentOrderService';

export class PaymentOrderController {
  // Crear nueva orden de pago
  static async createPaymentOrder(req: Request, res: Response): Promise<void> {
    try {
      console.log('💳 PaymentOrderController: Creando orden de pago');
      
      const userId = (req as any).user.id;
      const { quoteId, totalAmount, currency, paymentMethod, expiresAt } = req.body;

      if (!quoteId || !totalAmount || !currency || !paymentMethod) {
        res.status(400).json({
          success: false,
          message: 'Faltan campos obligatorios: quoteId, totalAmount, currency, paymentMethod'
        });
        return;
      }

      const paymentOrder = await SimplePaymentOrderService.createPaymentOrder({
        quoteId: parseInt(quoteId),
        buyerId: userId,
        totalAmount: parseFloat(totalAmount),
        currency,
        paymentMethod,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined
      });

      console.log(`✅ PaymentOrderController: Orden de pago creada exitosamente para usuario ${userId}`);

      res.status(201).json({
        success: true,
        data: paymentOrder,
        message: 'Orden de pago creada exitosamente'
      });

    } catch (error: any) {
      console.error('❌ PaymentOrderController: Error creando orden de pago:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error interno del servidor'
      });
    }
  }

  // Obtener orden de pago por ID de cotización
  static async getPaymentOrderByQuoteId(req: Request, res: Response): Promise<void> {
    try {
      console.log('💳 PaymentOrderController: Obteniendo orden de pago por quoteId');
      
      const userId = (req as any).user.id;
      const { quoteId } = req.params;

      if (!quoteId) {
        res.status(400).json({
          success: false,
          message: 'quoteId es requerido'
        });
        return;
      }

      // TODO: Implementar método en SimplePaymentOrderService
      // const paymentOrder = await SimplePaymentOrderService.getByQuoteId(parseInt(quoteId), userId);

      // Por ahora, respuesta temporal
      res.status(200).json({
        success: true,
        data: null,
        message: 'Método en desarrollo - getPaymentOrderByQuoteId'
      });

    } catch (error: any) {
      console.error('❌ PaymentOrderController: Error obteniendo orden de pago:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error interno del servidor'
      });
    }
  }

  // Obtener órdenes de pago del usuario
  static async getUserPaymentOrders(req: Request, res: Response): Promise<void> {
    try {
      console.log('💳 PaymentOrderController: Obteniendo órdenes de pago del usuario');
      
      const userId = (req as any).user.id;

      // TODO: Implementar método en SimplePaymentOrderService
      // const paymentOrders = await SimplePaymentOrderService.getUserPaymentOrders(userId);

      // Por ahora, respuesta temporal
      res.status(200).json({
        success: true,
        data: [],
        message: 'Método en desarrollo - getUserPaymentOrders'
      });

    } catch (error: any) {
      console.error('❌ PaymentOrderController: Error obteniendo órdenes de pago:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error interno del servidor'
      });
    }
  }

  // Procesar pago (integración con PayPal u otros)
  static async processPayment(req: Request, res: Response): Promise<void> {
    try {
      console.log('💳 PaymentOrderController: Procesando pago');
      
      const userId = (req as any).user.id;
      const { orderNumber, paymentId, payerId, token } = req.body;

      if (!orderNumber || !paymentId) {
        res.status(400).json({
          success: false,
          message: 'orderNumber y paymentId son requeridos'
        });
        return;
      }

      // TODO: Implementar métodos de validación y actualización en SimplePaymentOrderService
      // const isValid = await SimplePaymentOrderService.validatePayment(paymentId, payerId, token);
      // if (isValid) {
      //   const updatedOrder = await SimplePaymentOrderService.updatePaymentStatus(
      //     orderNumber,
      //     'COMPLETED',
      //     { paymentId, payerId, token }
      //   );
      //   res.json({ success: true, data: updatedOrder, message: 'Pago procesado exitosamente' });
      // } else {
      //   res.status(400).json({ success: false, message: 'Error validando el pago' });
      // }

      // Por ahora, respuesta temporal
      res.status(200).json({
        success: true,
        data: { orderNumber, paymentId },
        message: 'Método en desarrollo - processPayment'
      });

    } catch (error: any) {
      console.error('❌ PaymentOrderController: Error procesando pago:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al procesar pago'
      });
    }
  }
}

export default PaymentOrderController;
