"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rfqControllerSimple_1 = require("../controllers/rfqControllerSimple");
const router = (0, express_1.Router)();
// Rutas simplificadas para RFQ
router.post('/test', rfqControllerSimple_1.RFQController.debugRFQ); // Test endpoint
router.post('/', rfqControllerSimple_1.RFQController.createRFQ); // Crear RFQ
router.get('/', rfqControllerSimple_1.RFQController.getAllRFQs); // Obtener RFQs del usuario
router.get('/:id', rfqControllerSimple_1.RFQController.getRFQById); // Obtener RFQ por ID
exports.default = router;
