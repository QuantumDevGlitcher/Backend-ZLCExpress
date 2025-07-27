"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const freightController_1 = require("../controllers/freightController");
const freightValidation_1 = require("../middleware/freightValidation");
const router = (0, express_1.Router)();
// Aplicar middlewares a todas las rutas
router.use(freightValidation_1.FreightValidationMiddleware.sanitizeInput);
router.use(freightValidation_1.FreightValidationMiddleware.logFreightOperation);
// Rutas principales de Freight
router.post('/calculate', freightValidation_1.FreightValidationMiddleware.rateLimitFreightCalculations, freightValidation_1.FreightValidationMiddleware.validateFreightCalculation, freightController_1.FreightController.calculateFreight); // Calcular cotización de flete
router.get('/:id', freightValidation_1.FreightValidationMiddleware.validateQueryParams, freightController_1.FreightController.getFreightQuoteById); // Obtener cotización por ID
router.get('/user/:userId', freightValidation_1.FreightValidationMiddleware.validateQueryParams, freightController_1.FreightController.getFreightQuotesByUser); // Obtener cotizaciones por usuario
// Rutas de gestión
router.put('/:id/confirm', freightValidation_1.FreightValidationMiddleware.validateQueryParams, freightValidation_1.FreightValidationMiddleware.validateConfirmation, freightController_1.FreightController.confirmFreightQuote); // Confirmar cotización
router.put('/:id/status', freightValidation_1.FreightValidationMiddleware.validateQueryParams, freightValidation_1.FreightValidationMiddleware.validateStatusUpdate, freightController_1.FreightController.updateFreightQuoteStatus); // Actualizar estado
router.delete('/cleanup', freightController_1.FreightController.cleanupExpiredQuotes); // Limpiar expiradas
exports.default = router;
