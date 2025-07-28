"use strict";
// ================================================================
// RUTAS MY QUOTES - ZLCExpress  
// ================================================================
// Descripción: Rutas para integración de cotizaciones con frontend My Quotes
// Fecha: 2025-07-27
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const myQuotesController_1 = __importDefault(require("../controllers/myQuotesController"));
const router = (0, express_1.Router)();
/**
 * Obtener todas las cotizaciones para My Quotes
 * GET /api/my-quotes
 */
router.get('/', myQuotesController_1.default.getMyQuotes);
/**
 * Obtener estadísticas para My Quotes
 * GET /api/my-quotes/stats
 */
router.get('/stats', myQuotesController_1.default.getMyQuotesStats);
/**
 * Endpoint de prueba
 * GET /api/my-quotes/test
 */
router.get('/test', myQuotesController_1.default.testMyQuotes);
/**
 * Crear nueva cotización desde frontend
 * POST /api/my-quotes
 */
router.post('/', myQuotesController_1.default.createMyQuote);
/**
 * Sincronizar RFQs con base de datos
 * POST /api/my-quotes/sync
 */
router.post('/sync', myQuotesController_1.default.syncRFQsToMyQuotes);
/**
 * Migrar RFQs específicos a My Quotes
 * POST /api/my-quotes/migrate
 */
router.post('/migrate', myQuotesController_1.default.migrateRFQsToMyQuotes);
/**
 * Aceptar una cotización desde My Quotes
 * POST /api/my-quotes/:id/accept
 */
router.post('/:id/accept', myQuotesController_1.default.acceptMyQuote);
console.log('🔗 MyQuotes routes configured:');
console.log('   GET    /api/my-quotes');
console.log('   GET    /api/my-quotes/stats');
console.log('   GET    /api/my-quotes/test');
console.log('   POST   /api/my-quotes');
console.log('   POST   /api/my-quotes/sync');
console.log('   POST   /api/my-quotes/migrate');
console.log('   POST   /api/my-quotes/:id/accept');
exports.default = router;
