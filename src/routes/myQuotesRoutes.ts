// ================================================================
// RUTAS MY QUOTES - ZLCExpress  
// ================================================================
// Descripción: Rutas para integración de cotizaciones con frontend My Quotes
// Fecha: 2025-07-27

import { Router } from 'express';
import MyQuotesController from '../controllers/myQuotesController';
import { requireAuth, requireBuyer } from '../middleware/authMiddleware';

const router = Router();

// 🔒 TODAS LAS RUTAS REQUIEREN AUTENTICACIÓN

/**
 * Obtener todas las cotizaciones para My Quotes
 * GET /api/my-quotes
 */
router.get('/', requireAuth, MyQuotesController.getMyQuotes);

/**
 * Obtener estadísticas para My Quotes
 * GET /api/my-quotes/stats
 */
router.get('/stats', requireAuth, MyQuotesController.getMyQuotesStats);

/**
 * Endpoint de prueba
 * GET /api/my-quotes/test
 */
router.get('/test', requireAuth, MyQuotesController.testMyQuotes);

/**
 * Crear nueva cotización desde frontend
 * POST /api/my-quotes
 */
router.post('/', requireBuyer, MyQuotesController.createMyQuote);

/**
 * Sincronizar RFQs con base de datos
 * POST /api/my-quotes/sync
 */
router.post('/sync', requireBuyer, MyQuotesController.syncRFQsToMyQuotes);

/**
 * Migrar RFQs específicos a My Quotes
 * POST /api/my-quotes/migrate
 */
router.post('/migrate', requireBuyer, MyQuotesController.migrateRFQsToMyQuotes);

/**
 * Aceptar una cotización desde My Quotes
 * POST /api/my-quotes/:id/accept
 */
router.post('/:id/accept', requireBuyer, MyQuotesController.acceptMyQuote);

console.log('🔗 MyQuotes routes configured:');
console.log('   GET    /api/my-quotes');
console.log('   GET    /api/my-quotes/stats');
console.log('   GET    /api/my-quotes/test');
console.log('   POST   /api/my-quotes');
console.log('   POST   /api/my-quotes/sync');
console.log('   POST   /api/my-quotes/migrate');
console.log('   POST   /api/my-quotes/:id/accept');

export default router;
