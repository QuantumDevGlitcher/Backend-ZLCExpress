import { Request, Response } from 'express';
import { FreightService, FreightCalculationRequest } from '../services/freightService';

export class FreightController {
  
  /**
   * Calcular cotización de flete
   * POST /api/freight/calculate
   */
  static async calculateFreight(req: Request, res: Response): Promise<void> {
    try {
      const freightRequest: FreightCalculationRequest = req.body;

      // Validaciones básicas
      if (!freightRequest.origin) {
        res.status(400).json({
          success: false,
          message: 'El puerto de origen es requerido',
          error: 'ORIGIN_REQUIRED'
        });
        return;
      }

      if (!freightRequest.destination) {
        res.status(400).json({
          success: false,
          message: 'El puerto de destino es requerido',
          error: 'DESTINATION_REQUIRED'
        });
        return;
      }

      if (!freightRequest.containerType) {
        res.status(400).json({
          success: false,
          message: 'El tipo de contenedor es requerido',
          error: 'CONTAINER_TYPE_REQUIRED'
        });
        return;
      }

      if (!freightRequest.containerQuantity || freightRequest.containerQuantity <= 0) {
        res.status(400).json({
          success: false,
          message: 'La cantidad de contenedores debe ser mayor a 0',
          error: 'INVALID_CONTAINER_QUANTITY'
        });
        return;
      }

      if (!freightRequest.estimatedDate) {
        res.status(400).json({
          success: false,
          message: 'La fecha estimada es requerida',
          error: 'ESTIMATED_DATE_REQUIRED'
        });
        return;
      }

      // Validar que la fecha sea futura
      const estimatedDate = new Date(freightRequest.estimatedDate);
      const today = new Date();
      if (estimatedDate <= today) {
        res.status(400).json({
          success: false,
          message: 'La fecha estimada debe ser en el futuro',
          error: 'INVALID_ESTIMATED_DATE'
        });
        return;
      }

      const freightQuote = await FreightService.calculateFreight(freightRequest);

      res.status(201).json({
        success: true,
        message: 'Cotización de flete calculada exitosamente',
        data: freightQuote
      });

    } catch (error) {
      console.error('Error en calculateFreight:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor al calcular la cotización de flete',
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Obtener cotización de flete por ID
   * GET /api/freight/:id
   */
  static async getFreightQuoteById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'ID de cotización de flete es requerido',
          error: 'FREIGHT_ID_REQUIRED'
        });
        return;
      }

      const freightQuote = await FreightService.getFreightQuoteById(id);

      if (!freightQuote) {
        res.status(404).json({
          success: false,
          message: 'Cotización de flete no encontrada',
          error: 'FREIGHT_QUOTE_NOT_FOUND'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Cotización de flete obtenida exitosamente',
        data: freightQuote
      });

    } catch (error) {
      console.error('Error en getFreightQuoteById:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Obtener cotizaciones de flete por usuario
   * GET /api/freight/user/:userId
   */
  static async getFreightQuotesByUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      if (!userId) {
        res.status(400).json({
          success: false,
          message: 'ID de usuario es requerido',
          error: 'USER_ID_REQUIRED'
        });
        return;
      }

      const freightQuotes = await FreightService.getFreightQuotesByUser(userId);

      res.json({
        success: true,
        message: 'Cotizaciones de flete obtenidas exitosamente',
        data: freightQuotes,
        total: freightQuotes.length
      });

    } catch (error) {
      console.error('Error en getFreightQuotesByUser:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Confirmar cotización de flete
   * PUT /api/freight/:id/confirm
   */
  static async confirmFreightQuote(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { rfqId } = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'ID de cotización de flete es requerido',
          error: 'FREIGHT_ID_REQUIRED'
        });
        return;
      }

      if (!rfqId) {
        res.status(400).json({
          success: false,
          message: 'ID de RFQ es requerido',
          error: 'RFQ_ID_REQUIRED'
        });
        return;
      }

      const confirmedQuote = await FreightService.confirmFreightQuote(id, rfqId);

      if (!confirmedQuote) {
        res.status(404).json({
          success: false,
          message: 'Cotización de flete no encontrada',
          error: 'FREIGHT_QUOTE_NOT_FOUND'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Cotización de flete confirmada exitosamente',
        data: confirmedQuote
      });

    } catch (error) {
      console.error('Error en confirmFreightQuote:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Actualizar estado de cotización de flete
   * PUT /api/freight/:id/status
   */
  static async updateFreightQuoteStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'ID de cotización de flete es requerido',
          error: 'FREIGHT_ID_REQUIRED'
        });
        return;
      }

      const validStatuses = ['draft', 'calculated', 'confirmed', 'expired'];
      if (!status || !validStatuses.includes(status)) {
        res.status(400).json({
          success: false,
          message: 'Estado inválido. Valores permitidos: ' + validStatuses.join(', '),
          error: 'INVALID_STATUS'
        });
        return;
      }

      const updatedQuote = await FreightService.updateFreightQuoteStatus(id, status);

      if (!updatedQuote) {
        res.status(404).json({
          success: false,
          message: 'Cotización de flete no encontrada',
          error: 'FREIGHT_QUOTE_NOT_FOUND'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Estado de cotización de flete actualizado exitosamente',
        data: updatedQuote
      });

    } catch (error) {
      console.error('Error en updateFreightQuoteStatus:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Limpiar cotizaciones expiradas
   * DELETE /api/freight/cleanup
   */
  static async cleanupExpiredQuotes(req: Request, res: Response): Promise<void> {
    try {
      const deletedCount = await FreightService.cleanupExpiredQuotes();

      res.json({
        success: true,
        message: `${deletedCount} cotizaciones de flete expiradas eliminadas`,
        data: { deletedCount }
      });

    } catch (error) {
      console.error('Error en cleanupExpiredQuotes:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }
}
