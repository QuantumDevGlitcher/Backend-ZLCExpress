"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rfqControllerNew_1 = require("../controllers/rfqControllerNew");
const router = (0, express_1.Router)();
// Ruta de debug (comentada por ahora)
// router.post('/debug', RFQController.debugRFQ);
// Llenar carrito con datos de prueba (comentada por ahora)
// router.post('/test/fill-cart', RFQController.fillTestCart);
// Obtener estadísticas de cotizaciones (debe ir antes de /:id)
router.get('/stats', rfqControllerNew_1.RFQControllerNew.getQuoteStats);
// Obtener todas las cotizaciones del usuario (ruta alternativa)
router.get('/quotes', rfqControllerNew_1.RFQControllerNew.getMyQuotes);
// Obtener estadísticas de cotizaciones (ruta alternativa)
router.get('/quotes/stats', rfqControllerNew_1.RFQControllerNew.getQuoteStats);
// Obtener cotizaciones para MyQuotes (nueva ruta)
router.get('/myquotes', rfqControllerNew_1.RFQControllerNew.getMyQuotes);
// Enviar cotización desde carrito
router.post('/cart/quote', rfqControllerNew_1.RFQControllerNew.sendCartQuote);
// Crear nueva RFQ con PostgreSQL
router.post('/', rfqControllerNew_1.RFQControllerNew.createRFQ);
// Obtener todas las cotizaciones del usuario (ruta por defecto)
router.get('/', rfqControllerNew_1.RFQControllerNew.getMyQuotes);
// Obtener todas las RFQs (admin) - usando getAllQuotes no getRFQ
// router.get('/:id', RFQController.getAllRFQs);
exports.default = router;
