import { Request, Response } from 'express';
import { RFQService } from '../services/rfqService';
import { RFQCreateRequest, RFQUpdateRequest, RFQFilter, RFQResponse } from '../types/rfq';

export class RFQController {
  
  /**
   * Crear nueva solicitud de cotización
   * POST /api/rfq
   */
  static async createRFQ(req: Request, res: Response): Promise<void> {
    try {
      const rfqData: RFQCreateRequest = req.body;

      // Validaciones básicas
      if (!rfqData.productId) {
        res.status(400).json({
          success: false,
          message: 'El ID del producto es requerido',
          error: 'PRODUCT_ID_REQUIRED'
        });
        return;
      }

      if (!rfqData.requesterName || !rfqData.requesterEmail) {
        res.status(400).json({
          success: false,
          message: 'El nombre y email del solicitante son requeridos',
          error: 'REQUESTER_INFO_REQUIRED'
        });
        return;
      }

      if (!rfqData.containerQuantity || rfqData.containerQuantity <= 0) {
        res.status(400).json({
          success: false,
          message: 'La cantidad de contenedores debe ser mayor a 0',
          error: 'INVALID_CONTAINER_QUANTITY'
        });
        return;
      }

      if (!rfqData.containerType) {
        res.status(400).json({
          success: false,
          message: 'El tipo de contenedor es requerido',
          error: 'CONTAINER_TYPE_REQUIRED'
        });
        return;
      }

      if (!rfqData.incoterm) {
        res.status(400).json({
          success: false,
          message: 'El incoterm es requerido',
          error: 'INCOTERM_REQUIRED'
        });
        return;
      }

      if (!rfqData.tentativeDeliveryDate) {
        res.status(400).json({
          success: false,
          message: 'La fecha tentativa de entrega es requerida',
          error: 'DELIVERY_DATE_REQUIRED'
        });
        return;
      }

      // Validar que la fecha de entrega sea futura
      const deliveryDate = new Date(rfqData.tentativeDeliveryDate);
      const today = new Date();
      if (deliveryDate <= today) {
        res.status(400).json({
          success: false,
          message: 'La fecha de entrega debe ser en el futuro',
          error: 'INVALID_DELIVERY_DATE'
        });
        return;
      }

      const newRFQ = await RFQService.createRFQ(rfqData);

      res.status(201).json({
        success: true,
        message: 'Solicitud de cotización creada exitosamente',
        data: newRFQ
      });

    } catch (error) {
      console.error('Error en createRFQ:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor al crear la solicitud de cotización',
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Obtener RFQ por ID
   * GET /api/rfq/:id
   */
  static async getRFQById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'ID de RFQ es requerido',
          error: 'RFQ_ID_REQUIRED'
        });
        return;
      }

      const rfq = await RFQService.getRFQById(id);

      if (!rfq) {
        res.status(404).json({
          success: false,
          message: 'Solicitud de cotización no encontrada',
          error: 'RFQ_NOT_FOUND'
        });
        return;
      }

      res.json({
        success: true,
        message: 'RFQ obtenida exitosamente',
        data: rfq
      });

    } catch (error) {
      console.error('Error en getRFQById:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Obtener todas las RFQs con filtros
   * GET /api/rfq
   */
  static async getAllRFQs(req: Request, res: Response): Promise<void> {
    try {
      const filters: RFQFilter = {
        status: req.query.status ? (req.query.status as string).split(',') : undefined,
        priority: req.query.priority ? (req.query.priority as string).split(',') : undefined,
        supplierId: req.query.supplierId as string,
        requesterId: req.query.requesterId as string,
        productId: req.query.productId as string,
        containerType: req.query.containerType ? (req.query.containerType as string).split(',') : undefined,
        incoterm: req.query.incoterm ? (req.query.incoterm as string).split(',') : undefined,
        dateFrom: req.query.dateFrom as string,
        dateTo: req.query.dateTo as string,
        minValue: req.query.minValue ? parseFloat(req.query.minValue as string) : undefined,
        maxValue: req.query.maxValue ? parseFloat(req.query.maxValue as string) : undefined
      };

      // Limpiar filtros undefined
      Object.keys(filters).forEach(key => 
        filters[key as keyof RFQFilter] === undefined && delete filters[key as keyof RFQFilter]
      );

      const rfqs = await RFQService.getAllRFQs(filters);

      res.json({
        success: true,
        message: 'RFQs obtenidas exitosamente',
        data: rfqs,
        total: rfqs.length,
        filters: filters
      });

    } catch (error) {
      console.error('Error en getAllRFQs:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Actualizar RFQ
   * PUT /api/rfq/:id
   */
  static async updateRFQ(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates: RFQUpdateRequest = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'ID de RFQ es requerido',
          error: 'RFQ_ID_REQUIRED'
        });
        return;
      }

      const updatedRFQ = await RFQService.updateRFQ(id, updates);

      if (!updatedRFQ) {
        res.status(404).json({
          success: false,
          message: 'Solicitud de cotización no encontrada',
          error: 'RFQ_NOT_FOUND'
        });
        return;
      }

      res.json({
        success: true,
        message: 'RFQ actualizada exitosamente',
        data: updatedRFQ
      });

    } catch (error) {
      console.error('Error en updateRFQ:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Responder a una RFQ (proveedor)
   * POST /api/rfq/:id/respond
   */
  static async respondToRFQ(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const responseData: Omit<RFQResponse, 'rfqId' | 'responseDate' | 'validUntil'> = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'ID de RFQ es requerido',
          error: 'RFQ_ID_REQUIRED'
        });
        return;
      }

      // Validaciones de la respuesta
      if (!responseData.unitPrice || responseData.unitPrice <= 0) {
        res.status(400).json({
          success: false,
          message: 'El precio unitario debe ser mayor a 0',
          error: 'INVALID_UNIT_PRICE'
        });
        return;
      }

      if (!responseData.totalPrice || responseData.totalPrice <= 0) {
        res.status(400).json({
          success: false,
          message: 'El precio total debe ser mayor a 0',
          error: 'INVALID_TOTAL_PRICE'
        });
        return;
      }

      if (!responseData.currency) {
        res.status(400).json({
          success: false,
          message: 'La moneda es requerida',
          error: 'CURRENCY_REQUIRED'
        });
        return;
      }

      if (!responseData.deliveryTime || responseData.deliveryTime <= 0) {
        res.status(400).json({
          success: false,
          message: 'El tiempo de entrega debe ser mayor a 0',
          error: 'INVALID_DELIVERY_TIME'
        });
        return;
      }

      if (!responseData.paymentTerms) {
        res.status(400).json({
          success: false,
          message: 'Los términos de pago son requeridos',
          error: 'PAYMENT_TERMS_REQUIRED'
        });
        return;
      }

      const updatedRFQ = await RFQService.respondToRFQ(id, responseData);

      if (!updatedRFQ) {
        res.status(404).json({
          success: false,
          message: 'Solicitud de cotización no encontrada',
          error: 'RFQ_NOT_FOUND'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Respuesta a RFQ enviada exitosamente',
        data: updatedRFQ
      });

    } catch (error) {
      console.error('Error en respondToRFQ:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Eliminar RFQ
   * DELETE /api/rfq/:id
   */
  static async deleteRFQ(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'ID de RFQ es requerido',
          error: 'RFQ_ID_REQUIRED'
        });
        return;
      }

      const deleted = await RFQService.deleteRFQ(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Solicitud de cotización no encontrada',
          error: 'RFQ_NOT_FOUND'
        });
        return;
      }

      res.json({
        success: true,
        message: 'RFQ eliminada exitosamente'
      });

    } catch (error) {
      console.error('Error en deleteRFQ:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Obtener estadísticas de RFQs
   * GET /api/rfq/stats
   */
  static async getRFQStats(req: Request, res: Response): Promise<void> {
    try {
      const filters: RFQFilter = {
        status: req.query.status ? (req.query.status as string).split(',') : undefined,
        supplierId: req.query.supplierId as string,
        dateFrom: req.query.dateFrom as string,
        dateTo: req.query.dateTo as string
      };

      // Limpiar filtros undefined
      Object.keys(filters).forEach(key => 
        filters[key as keyof RFQFilter] === undefined && delete filters[key as keyof RFQFilter]
      );

      const stats = await RFQService.getRFQStats(filters);

      res.json({
        success: true,
        message: 'Estadísticas obtenidas exitosamente',
        data: stats
      });

    } catch (error) {
      console.error('Error en getRFQStats:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Obtener notificaciones de RFQ
   * GET /api/rfq/notifications/:userId/:userType
   */
  static async getNotifications(req: Request, res: Response): Promise<void> {
    try {
      const { userId, userType } = req.params;

      if (!userId || !userType) {
        res.status(400).json({
          success: false,
          message: 'User ID y tipo de usuario son requeridos',
          error: 'USER_INFO_REQUIRED'
        });
        return;
      }

      if (userType !== 'supplier' && userType !== 'buyer') {
        res.status(400).json({
          success: false,
          message: 'Tipo de usuario debe ser "supplier" o "buyer"',
          error: 'INVALID_USER_TYPE'
        });
        return;
      }

      const notifications = await RFQService.getNotifications(userId, userType as 'supplier' | 'buyer');

      res.json({
        success: true,
        message: 'Notificaciones obtenidas exitosamente',
        data: notifications
      });

    } catch (error) {
      console.error('Error en getNotifications:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Marcar notificación como leída
   * PUT /api/rfq/notifications/:notificationId/read
   */
  static async markNotificationAsRead(req: Request, res: Response): Promise<void> {
    try {
      const { notificationId } = req.params;

      if (!notificationId) {
        res.status(400).json({
          success: false,
          message: 'ID de notificación es requerido',
          error: 'NOTIFICATION_ID_REQUIRED'
        });
        return;
      }

      const updated = await RFQService.markNotificationAsRead(notificationId);

      if (!updated) {
        res.status(404).json({
          success: false,
          message: 'Notificación no encontrada',
          error: 'NOTIFICATION_NOT_FOUND'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Notificación marcada como leída'
      });

    } catch (error) {
      console.error('Error en markNotificationAsRead:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Verificar RFQs expiradas
   * POST /api/rfq/check-expired
   */
  static async checkExpiredRFQs(req: Request, res: Response): Promise<void> {
    try {
      const expiredCount = await RFQService.checkExpiredRFQs();

      res.json({
        success: true,
        message: 'Verificación de RFQs expiradas completada',
        data: {
          expiredCount
        }
      });

    } catch (error) {
      console.error('Error en checkExpiredRFQs:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }
}
