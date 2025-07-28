// ================================================================
// RUTAS DE COTIZACIONES - ZLCExpress
// ================================================================
// Descripción: Rutas HTTP para gestionar cotizaciones/RFQs con base de datos
// Fecha: 2025-07-27

import { Router } from 'express';
import quoteController from '../controllers/quoteController';
import { requireAuth, requireBuyer } from '../middleware/authMiddleware';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

console.log('📋 Cargando rutas de quotes...');

// ================================================================
// RUTAS PRINCIPALES DE COTIZACIONES - 🔒 TODAS REQUIEREN AUTENTICACIÓN
// ================================================================

/**
 * POST /api/quotes
 * Crear nueva cotización - Solo compradores
 */
router.post('/', requireBuyer, quoteController.createQuote);

/**
 * GET /api/quotes
 * Obtener cotizaciones del usuario - Requiere autenticación
 * Query params: role (buyer|supplier), status, priority, dateFrom, dateTo, minValue, maxValue, page, limit
 */
router.get('/', requireAuth, quoteController.getUserQuotes);

/**
 * GET /api/quotes/stats
 * Obtener estadísticas de cotizaciones - Requiere autenticación
 * Query params: role (buyer|supplier)
 */
router.get('/stats', requireAuth, quoteController.getQuoteStats);

/**
 * GET /api/quotes/:id
 * Obtener cotización específica por ID - Requiere autenticación
 */
router.get('/:id', requireAuth, quoteController.getQuoteById);

/**
 * PUT /api/quotes/:id/status
 * Actualizar estado de una cotización - Requiere autenticación
 */
router.put('/:id/status', requireAuth, quoteController.updateQuoteStatus);

/**
 * POST /api/quotes/:id/counter-offer
 * Enviar contraoferta para una cotización - Solo proveedores
 */
router.post('/:id/counter-offer', requireAuth, quoteController.sendCounterOffer);

/**
 * POST /api/quotes/:id/buyer-counter-offer
 * Enviar contraoferta desde el comprador - Solo compradores
 */
router.post('/:id/buyer-counter-offer', requireBuyer, quoteController.sendBuyerCounterOffer);

/**
 * POST /api/quotes/:id/accept
 * Aceptar cotización - Requiere autenticación
 */
router.post('/:id/accept', requireAuth, quoteController.acceptQuote);

/**
 * POST /api/quotes/:id/reject
 * Rechazar cotización - Requiere autenticación
 */
router.post('/:id/reject', requireAuth, quoteController.rejectQuote);

/**
 * POST /api/quotes/:id/payment-order
 * Crear orden de pago desde cotización aceptada - Solo compradores
 */
router.post('/:id/payment-order', requireBuyer, quoteController.createPaymentOrderFromQuote);

/**
 * GET /api/quotes/:id/comments
 * Obtener comentarios de una cotización - Requiere autenticación
 */
router.get('/:id/comments', requireAuth, quoteController.getQuoteComments);

/**
 * GET /api/quotes/:id/payment-order-status
 * Verificar si existe una orden de pago para esta cotización - Requiere autenticación
 */
router.get('/:id/payment-order-status', requireAuth, async (req, res) => {
  try {
    console.log('🔍 Verificando estado de orden de pago para cotización:', req.params.id);
    const quoteId = parseInt(req.params.id);
    
    // ✅ VERIFICAR USUARIO AUTENTICADO
    const user = (req as any).user;
    if (!user || !user.id) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }
    
    console.log(`🔒 Usuario autenticado: ${user.id} (${user.email})`);
    
    if (isNaN(quoteId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de cotización inválido'
      });
    }

    // Buscar orden de pago existente para esta cotización Y usuario
    const existingOrder = await prisma.paymentOrder.findFirst({
      where: { 
        quoteId: quoteId,
        buyerId: user.id // ✅ FILTRO CRÍTICO DE SEGURIDAD
      },
      select: {
        id: true,
        orderNumber: true,
        paymentStatus: true,
        totalAmount: true,
        createdAt: true
      }
    });

    if (existingOrder) {
      console.log('✅ Orden de pago encontrada:', existingOrder.orderNumber);
      return res.json({
        success: true,
        data: existingOrder,
        message: 'Orden de pago encontrada'
      });
    } else {
      console.log('❌ No existe orden de pago para esta cotización y usuario');
      return res.json({
        success: false,
        message: 'No existe orden de pago para esta cotización'
      });
    }

  } catch (error) {
    console.error('❌ Error verificando orden de pago:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

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
