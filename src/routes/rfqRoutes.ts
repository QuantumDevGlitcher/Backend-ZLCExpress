import { Router } from 'express';
import { RFQController } from '../controllers/rfqController';
import { RFQValidationMiddleware } from '../middleware/rfqValidation';

const router = Router();

// Aplicar sanitización a todas las rutas
router.use(RFQValidationMiddleware.sanitizeInput);

// Rutas principales de RFQ
router.post('/', 
  RFQValidationMiddleware.validateCreateRFQ,
  RFQController.createRFQ
);                                                                     // Crear nueva RFQ

router.get('/stats', 
  RFQValidationMiddleware.validateQueryFilters,
  RFQController.getRFQStats
);                                                                     // Obtener estadísticas (debe ir antes de /:id)

router.get('/freight', 
  RFQValidationMiddleware.validateQueryFilters,
  RFQController.getRFQsWithFreight
);                                                                     // Obtener RFQs con información de flete

router.get('/', 
  RFQValidationMiddleware.validateQueryFilters,
  RFQController.getAllRFQs
);                                                                     // Obtener todas las RFQs con filtros

router.get('/:id', RFQController.getRFQById);                         // Obtener RFQ por ID
router.put('/:id', RFQController.updateRFQ);                          // Actualizar RFQ
router.delete('/:id', RFQController.deleteRFQ);                       // Eliminar RFQ

// Rutas específicas de RFQ
router.post('/:id/respond', 
  RFQValidationMiddleware.validateRFQResponse,
  RFQController.respondToRFQ
);                                                                     // Responder a una RFQ (proveedor)

router.post('/check-expired', RFQController.checkExpiredRFQs);        // Verificar RFQs expiradas

// Rutas de notificaciones
router.get('/notifications/:userId/:userType', RFQController.getNotifications);                    // Obtener notificaciones
router.put('/notifications/:notificationId/read', RFQController.markNotificationAsRead);          // Marcar notificación como leída

export default router;
