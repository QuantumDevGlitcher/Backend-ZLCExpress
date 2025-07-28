// controllers/paymentOrderController.ts
// Controlador para manejar órdenes de pago

import { Request, Response } from 'express';
import { PaymentOrderService } from '../services/paymentOrderService';

export class PaymentOrderController {
  // Crear nueva orden de pago
  static async createPaymentOrder(req: Request, res: Response) {
    try {
      console.log('💳 PaymentOrderController: Creando orden de pago');
      
      const { quoteId, buyerId, totalAmount, currency, paymentMethod } = req.body;
      const userId = parseInt(req.headers['user-id'] as string) || buyerId || 1;

      if (!quoteId || !totalAmount) {
        return res.status(400).json({
          success: false,
          message: 'ID de cotización y monto total son requeridos'
        });
      }

      const paymentOrder = await PaymentOrderService.createPaymentOrder({
        quoteId: parseInt(quoteId),
        buyerId: userId,
        totalAmount: parseFloat(totalAmount),
        currency: currency || 'USD',
        paymentMethod: paymentMethod || 'paypal'
      });

      console.log('✅ PaymentOrderController: Orden de pago creada:', paymentOrder.orderNumber);
      res.status(201).json({
        success: true,
        data: paymentOrder,
        message: 'Orden de pago creada exitosamente'
      });

    } catch (error: any) {
      console.error('❌ PaymentOrderController: Error creando orden de pago:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al crear orden de pago'
      });
    }
  }

  // Obtener orden de pago por ID
  static async getPaymentOrderById(req: Request, res: Response) {
    try {
      console.log('💳 PaymentOrderController: Obteniendo orden de pago por ID');
      
      const { orderId } = req.params;

      const paymentOrder = await PaymentOrderService.getPaymentOrderById(parseInt(orderId));

      if (!paymentOrder) {
        return res.status(404).json({
          success: false,
          message: 'Orden de pago no encontrada'
        });
      }

      res.json({
        success: true,
        data: paymentOrder,
        message: 'Orden de pago obtenida exitosamente'
      });

    } catch (error: any) {
      console.error('❌ PaymentOrderController: Error obteniendo orden de pago:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener orden de pago'
      });
    }
  }

  // Obtener orden de pago por número
  static async getPaymentOrderByNumber(req: Request, res: Response) {
    try {
      console.log('💳 PaymentOrderController: Obteniendo orden de pago por número');
      
      const { orderNumber } = req.params;

      const paymentOrder = await PaymentOrderService.getPaymentOrderByNumber(orderNumber);

      if (!paymentOrder) {
        return res.status(404).json({
          success: false,
          message: 'Orden de pago no encontrada'
        });
      }

      res.json({
        success: true,
        data: paymentOrder,
        message: 'Orden de pago obtenida exitosamente'
      });

    } catch (error: any) {
      console.error('❌ PaymentOrderController: Error obteniendo orden de pago:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener orden de pago'
      });
    }
  }

  // Actualizar estado de pago
  static async updatePaymentStatus(req: Request, res: Response) {
    try {
      console.log('💳 PaymentOrderController: Actualizando estado de pago');
      
      const { orderId } = req.params;
      const { status, paypalPaymentId, paypalPayerId, paypalToken } = req.body;

      const paymentOrder = await PaymentOrderService.updatePaymentStatus(
        parseInt(orderId),
        status,
        {
          paymentId: paypalPaymentId,
          payerId: paypalPayerId,
          token: paypalToken
        }
      );

      res.json({
        success: true,
        data: paymentOrder,
        message: 'Estado de pago actualizado exitosamente'
      });

    } catch (error: any) {
      console.error('❌ PaymentOrderController: Error actualizando estado:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al actualizar estado de pago'
      });
    }
  }

  // Obtener órdenes de pago de un usuario
  static async getUserPaymentOrders(req: Request, res: Response) {
    try {
      console.log('💳 PaymentOrderController: Obteniendo órdenes de pago del usuario');
      
      const { userId } = req.params;

      const paymentOrders = await PaymentOrderService.getUserPaymentOrders(parseInt(userId));

      res.json({
        success: true,
        data: paymentOrders,
        count: paymentOrders.length,
        message: 'Órdenes de pago obtenidas exitosamente'
      });

    } catch (error: any) {
      console.error('❌ PaymentOrderController: Error obteniendo órdenes:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener órdenes de pago'
      });
    }
  }

  // Procesar pago (simulación para PayPal)
  static async processPayment(req: Request, res: Response) {
    try {
      console.log('💳 PaymentOrderController: Procesando pago');
      
      const { orderNumber } = req.params;
      const { paymentId, payerId, token } = req.body;

      // Obtener la orden de pago
      const paymentOrder = await PaymentOrderService.getPaymentOrderByNumber(orderNumber);

      if (!paymentOrder) {
        return res.status(404).json({
          success: false,
          message: 'Orden de pago no encontrada'
        });
      }

      // Simular procesamiento de PayPal
      console.log('💰 Simulando procesamiento de pago PayPal...');
      
      // En un entorno real, aquí se validaría el pago con PayPal
      const isPaymentValid = true; // Simulación
      
      if (isPaymentValid) {
        // Actualizar estado de pago
        const updatedOrder = await PaymentOrderService.updatePaymentStatus(
          paymentOrder.id,
          'COMPLETED',
          { paymentId, payerId, token }
        );

        res.json({
          success: true,
          data: updatedOrder,
          message: 'Pago procesado exitosamente'
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Error validando el pago con PayPal'
        });
      }

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
