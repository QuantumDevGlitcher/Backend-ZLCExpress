// ================================================================
// PAYMENT ORDER CONTROLLER - Versión Limpia y Funcional
// ================================================================
// Descripción: Controlador para gestión de órdenes de pago
// Integración completa con auth middleware usando JWT

import { Request, Response } from 'express';
import PaymentOrderService from '../services/paymentOrderService';

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

      // Verificar si ya existe una orden de pago para esta cotización
      console.log('🔍 Verificando orden existente para cotización:', quoteId);
      const existingOrder = await PaymentOrderService.getPaymentOrderByQuoteId(parseInt(quoteId), userId);
      
      if (existingOrder) {
        console.log('✅ Orden existente encontrada:', existingOrder.orderNumber);
        res.status(200).json({
          success: true,
          data: existingOrder,
          message: 'Orden de pago ya existe para esta cotización'
        });
        return;
      }

      const paymentOrder = await PaymentOrderService.createPaymentOrder({
        quoteId: parseInt(quoteId),
        buyerId: userId,
        totalAmount: parseFloat(totalAmount),
        currency,
        paymentMethod
      });

      console.log(`✅ PaymentOrderController: Orden de pago creada exitosamente para usuario ${userId}`);

      res.status(201).json({
        success: true,
        data: paymentOrder,
        message: 'Orden de pago creada exitosamente'
      });

    } catch (error: any) {
      console.error('❌ PaymentOrderController: Error creando orden de pago:', error);
      
      // Manejo específico para errores de constrains únicos
      if (error.code === 'P2002' || error.message.includes('Unique constraint failed')) {
        console.log('🔄 Constraint único violado, intentando obtener orden existente...');
        try {
          const { quoteId } = req.body;
          const userId = (req as any).user.id;
          const existingOrder = await PaymentOrderService.getPaymentOrderByQuoteId(parseInt(quoteId), userId);
          
          if (existingOrder) {
            res.status(200).json({
              success: true,
              data: existingOrder,
              message: 'Orden de pago ya existe para esta cotización'
            });
            return;
          }
        } catch (retryError) {
          console.error('❌ Error al obtener orden existente:', retryError);
        }
      }
      
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

      // Usar PaymentOrderService
      const paymentOrder = await PaymentOrderService.getPaymentOrderByQuoteId(parseInt(quoteId), userId);

      if (!paymentOrder) {
        res.status(404).json({
          success: false,
          message: 'Orden de pago no encontrada',
          data: null
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: paymentOrder,
        message: 'Orden de pago obtenida exitosamente'
      });

    } catch (error: any) {
      console.error('❌ PaymentOrderController: Error obteniendo orden de pago:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error interno del servidor'
      });
    }
  }

  // Obtener orden de pago por orderNumber
  static async getPaymentOrderByOrderNumber(req: Request, res: Response): Promise<void> {
    try {
      console.log('💳 PaymentOrderController: Obteniendo orden de pago por orderNumber');
      
      const userId = (req as any).user.id;
      const { orderNumber } = req.params;

      if (!orderNumber) {
        res.status(400).json({
          success: false,
          message: 'orderNumber es requerido'
        });
        return;
      }

      const paymentOrder = await PaymentOrderService.getPaymentOrderByOrderNumber(orderNumber, userId);

      res.status(200).json({
        success: true,
        data: paymentOrder,
        message: 'Orden de pago obtenida exitosamente'
      });

    } catch (error: any) {
      console.error('❌ PaymentOrderController: Error obteniendo orden de pago por orderNumber:', error);
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

      const paymentOrders = await PaymentOrderService.getUserPaymentOrders(userId);

      res.status(200).json({
        success: true,
        data: paymentOrders,
        message: 'Órdenes de pago obtenidas exitosamente'
      });

    } catch (error: any) {
      console.error('❌ PaymentOrderController: Error obteniendo órdenes de pago:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error interno del servidor'
      });
    }
  }

  // Procesar pago (integración con PayPal)
  static async processPayment(req: Request, res: Response): Promise<void> {
    try {
      console.log('💳 PaymentOrderController: Procesando pago PayPal');
      
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

      if (!orderNumber || !paymentId || !paypalOrderId) {
        res.status(400).json({
          success: false,
          message: 'orderNumber, paymentId y paypalOrderId son requeridos'
        });
        return;
      }

      console.log('📊 Datos de pago recibidos:', {
        orderNumber,
        paymentId,
        paypalOrderId,
        paypalPayerId,
        amount,
        currency,
        status,
        userId
      });

      // Buscar la orden de pago en la base de datos
      const paymentOrder = await PaymentOrderService.getPaymentOrderByOrderNumber(orderNumber, userId);
      
      if (!paymentOrder) {
        res.status(404).json({
          success: false,
          message: 'Orden de pago no encontrada'
        });
        return;
      }

      // Verificar que el monto coincida
      if (paymentOrder.totalAmount !== parseFloat(amount)) {
        console.error('❌ Monto no coincide:', {
          esperado: paymentOrder.totalAmount,
          recibido: parseFloat(amount)
        });
        
        res.status(400).json({
          success: false,
          message: 'El monto del pago no coincide con la orden'
        });
        return;
      }

      // Actualizar la orden con los datos de PayPal
      const updatedOrder = await PaymentOrderService.updatePaymentStatus(
        paymentOrder.id, 
        userId, 
        'COMPLETED',
        {
          paymentId: paymentId,
          payerId: paypalPayerId
        }
      );

      if (!updatedOrder) {
        res.status(500).json({
          success: false,
          message: 'Error al actualizar la orden de pago'
        });
        return;
      }

      console.log('✅ Orden de pago actualizada exitosamente:', updatedOrder.orderNumber);

      res.status(200).json({
        success: true,
        data: {
          orderNumber: updatedOrder.orderNumber,
          paymentStatus: updatedOrder.paymentStatus,
          paymentId: updatedOrder.paypalPaymentId,
          paypalOrderId: paypalOrderId, // Keep in response even if not saved to DB yet
          paypalPayerId: updatedOrder.paypalPayerId,
          paidAt: updatedOrder.paidAt
        },
        message: 'Pago procesado y confirmado exitosamente'
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
