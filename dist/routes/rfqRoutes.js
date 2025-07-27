"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rfqController_1 = require("../controllers/rfqController");
const rfqValidation_1 = require("../middleware/rfqValidation");
const router = (0, express_1.Router)();
// Aplicar sanitización a todas las rutas
router.use(rfqValidation_1.RFQValidationMiddleware.sanitizeInput);
// Rutas principales de RFQ
router.post('/', rfqValidation_1.RFQValidationMiddleware.validateCreateRFQ, rfqController_1.RFQController.createRFQ); // Crear nueva RFQ
router.get('/stats', rfqValidation_1.RFQValidationMiddleware.validateQueryFilters, rfqController_1.RFQController.getRFQStats); // Obtener estadísticas (debe ir antes de /:id)
router.get('/freight', rfqValidation_1.RFQValidationMiddleware.validateQueryFilters, rfqController_1.RFQController.getRFQsWithFreight); // Obtener RFQs con información de flete
router.get('/', rfqValidation_1.RFQValidationMiddleware.validateQueryFilters, rfqController_1.RFQController.getAllRFQs); // Obtener todas las RFQs con filtros
router.get('/:id', rfqController_1.RFQController.getRFQById); // Obtener RFQ por ID
router.put('/:id', rfqController_1.RFQController.updateRFQ); // Actualizar RFQ
router.delete('/:id', rfqController_1.RFQController.deleteRFQ); // Eliminar RFQ
// Rutas específicas de RFQ
router.post('/:id/respond', rfqValidation_1.RFQValidationMiddleware.validateRFQResponse, rfqController_1.RFQController.respondToRFQ); // Responder a una RFQ (proveedor)
router.post('/check-expired', rfqController_1.RFQController.checkExpiredRFQs); // Verificar RFQs expiradas
// Rutas de notificaciones
router.get('/notifications/:userId/:userType', rfqController_1.RFQController.getNotifications); // Obtener notificaciones
router.put('/notifications/:notificationId/read', rfqController_1.RFQController.markNotificationAsRead); // Marcar notificación como leída
exports.default = router;
