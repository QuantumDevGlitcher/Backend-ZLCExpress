// ================================================================
// RUTAS DE COTIZACIONES - ZLCExpress
// ================================================================
// Descripción: Rutas HTTP para gestionar cotizaciones/RFQs con base de datos
// Fecha: 2025-07-27

import { Router } from 'express';
import quoteController from '../controllers/quoteController';

const router = Router();

console.log('📋 Cargando rutas de quotes...');

// ================================================================
// RUTAS PRINCIPALES DE COTIZACIONES
// ================================================================

/**
 * POST /api/quotes
 * Crear nueva cotización
 */
router.post('/', quoteController.createQuote);

/**
 * GET /api/quotes
 * Obtener cotizaciones del usuario
 * Query params: role (buyer|supplier), status, priority, dateFrom, dateTo, minValue, maxValue, page, limit
 */
router.get('/', quoteController.getUserQuotes);

/**
 * GET /api/quotes/stats
 * Obtener estadísticas de cotizaciones
 * Query params: role (buyer|supplier)
 */
router.get('/stats', quoteController.getQuoteStats);

/**
 * GET /api/quotes/:id
 * Obtener cotización específica por ID
 */
router.get('/:id', quoteController.getQuoteById);

/**
 * PUT /api/quotes/:id/status
 * Actualizar estado de una cotización
 */
router.put('/:id/status', quoteController.updateQuoteStatus);

/**
 * POST /api/quotes/:id/counter-offer
 * Enviar contraoferta para una cotización
 */
router.post('/:id/counter-offer', quoteController.sendCounterOffer);

/**
 * POST /api/quotes/:id/buyer-counter-offer
 * Enviar contraoferta desde el comprador
 */
router.post('/:id/buyer-counter-offer', quoteController.sendBuyerCounterOffer);

/**
 * POST /api/quotes/:id/accept
 * Aceptar cotización
 */
router.post('/:id/accept', quoteController.acceptQuote);

/**
 * POST /api/quotes/:id/reject
 * Rechazar cotización
 */
router.post('/:id/reject', quoteController.rejectQuote);

/**
 * POST /api/quotes/:id/payment-order
 * Crear orden de pago desde cotización aceptada
 */
router.post('/:id/payment-order', quoteController.createPaymentOrderFromQuote);

/**
 * GET /api/quotes/:id/comments
 * Obtener comentarios de una cotización
 */
router.get('/:id/comments', quoteController.getQuoteComments);

/**
 * GET /api/quotes/:id/test
 * Ruta de prueba para verificar parámetros
 */
router.get('/:id/test', (req, res) => {
  console.log('🧪 Ruta de prueba - ID recibido:', req.params.id);
  res.json({
    success: true,
    message: 'Ruta de prueba funcionando',
    receivedId: req.params.id,
    params: req.params
  });
});

/**
 * GET /api/quotes/stats
 * Obtener estadísticas de cotizaciones del usuario
 */
router.get('/stats', quoteController.getQuoteStats);

// ================================================================
// MIDDLEWARE DE VALIDACIÓN (Opcional - puede expandirse)
// ================================================================

// Middleware para validar IDs numéricos
router.param('id', (req, res, next, id) => {
  console.log('🔍 Middleware param: Validando ID:', id);
  if (!/^\d+$/.test(id)) {
    console.error('❌ ID de cotización inválido recibido:', id);
    return res.status(400).json({
      success: false,
      message: 'ID de cotización inválido'
    });
  }
  console.log('✅ ID de cotización válido:', id);
  next();
});

console.log('✅ Rutas de quotes configuradas exitosamente');
export default router;
