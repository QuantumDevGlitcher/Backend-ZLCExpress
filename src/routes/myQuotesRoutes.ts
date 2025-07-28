// ================================================================
// RUTAS MY QUOTES - ZLCExpress  
// ================================================================
// Descripción: Rutas para integración de cotizaciones con frontend My Quotes
// Fecha: 2025-07-27

import { Router } from 'express';
import MyQuotesController from '../controllers/myQuotesController';

const router = Router();

/**
 * Obtener todas las cotizaciones para My Quotes
 * GET /api/my-quotes
 */
router.get('/', MyQuotesController.getMyQuotes);

/**
 * Obtener estadísticas para My Quotes
 * GET /api/my-quotes/stats
 */
router.get('/stats', MyQuotesController.getMyQuotesStats);

/**
 * Endpoint de prueba
 * GET /api/my-quotes/test
 */
router.get('/test', MyQuotesController.testMyQuotes);

/**
 * Crear nueva cotización desde frontend
 * POST /api/my-quotes
 */
router.post('/', MyQuotesController.createMyQuote);

/**
 * Sincronizar RFQs con base de datos
 * POST /api/my-quotes/sync
 */
router.post('/sync', MyQuotesController.syncRFQsToMyQuotes);

/**
 * Migrar RFQs específicos a My Quotes
 * POST /api/my-quotes/migrate
 */
router.post('/migrate', MyQuotesController.migrateRFQsToMyQuotes);

/**
 * Aceptar una cotización desde My Quotes
 * POST /api/my-quotes/:id/accept
 */
router.post('/:id/accept', MyQuotesController.acceptMyQuote);

console.log('🔗 MyQuotes routes configured:');
console.log('   GET    /api/my-quotes');
console.log('   GET    /api/my-quotes/stats');
console.log('   GET    /api/my-quotes/test');
console.log('   POST   /api/my-quotes');
console.log('   POST   /api/my-quotes/sync');
console.log('   POST   /api/my-quotes/migrate');
console.log('   POST   /api/my-quotes/:id/accept');

export default router;
