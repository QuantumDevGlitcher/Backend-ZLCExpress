import { Router } from 'express';
import { FreightController } from '../controllers/freightController';
import { FreightValidationMiddleware } from '../middleware/freightValidation';

const router = Router();

// Aplicar middlewares a todas las rutas
router.use(FreightValidationMiddleware.sanitizeInput);
router.use(FreightValidationMiddleware.logFreightOperation);

// Rutas principales de Freight
router.post('/calculate', 
  FreightValidationMiddleware.rateLimitFreightCalculations,
  FreightValidationMiddleware.validateFreightCalculation,
  FreightController.calculateFreight
); // Calcular cotización de flete

router.get('/:id', 
  FreightValidationMiddleware.validateQueryParams,
  FreightController.getFreightQuoteById
); // Obtener cotización por ID

router.get('/user/:userId', 
  FreightValidationMiddleware.validateQueryParams,
  FreightController.getFreightQuotesByUser
); // Obtener cotizaciones por usuario

// Rutas de gestión
router.put('/:id/confirm', 
  FreightValidationMiddleware.validateQueryParams,
  FreightValidationMiddleware.validateConfirmation,
  FreightController.confirmFreightQuote
); // Confirmar cotización

router.put('/:id/status', 
  FreightValidationMiddleware.validateQueryParams,
  FreightValidationMiddleware.validateStatusUpdate,
  FreightController.updateFreightQuoteStatus
); // Actualizar estado

router.delete('/cleanup', 
  FreightController.cleanupExpiredQuotes
); // Limpiar expiradas

export default router;
