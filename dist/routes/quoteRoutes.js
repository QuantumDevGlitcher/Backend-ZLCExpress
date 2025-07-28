"use strict";
// ================================================================
// RUTAS DE COTIZACIONES - ZLCExpress
// ================================================================
// Descripción: Rutas HTTP para gestionar cotizaciones/RFQs con base de datos
// Fecha: 2025-07-27
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const quoteController_1 = __importDefault(require("../controllers/quoteController"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
console.log('📋 Cargando rutas de quotes...');
// ================================================================
// RUTAS PRINCIPALES DE COTIZACIONES
// ================================================================
/**
 * POST /api/quotes
 * Crear nueva cotización
 */
router.post('/', quoteController_1.default.createQuote);
/**
 * GET /api/quotes
 * Obtener cotizaciones del usuario
 * Query params: role (buyer|supplier), status, priority, dateFrom, dateTo, minValue, maxValue, page, limit
 */
router.get('/', quoteController_1.default.getUserQuotes);
/**
 * GET /api/quotes/stats
 * Obtener estadísticas de cotizaciones
 * Query params: role (buyer|supplier)
 */
router.get('/stats', quoteController_1.default.getQuoteStats);
/**
 * GET /api/quotes/:id
 * Obtener cotización específica por ID
 */
router.get('/:id', quoteController_1.default.getQuoteById);
/**
 * PUT /api/quotes/:id/status
 * Actualizar estado de una cotización
 */
router.put('/:id/status', quoteController_1.default.updateQuoteStatus);
/**
 * POST /api/quotes/:id/counter-offer
 * Enviar contraoferta para una cotización
 */
router.post('/:id/counter-offer', quoteController_1.default.sendCounterOffer);
/**
 * POST /api/quotes/:id/buyer-counter-offer
 * Enviar contraoferta desde el comprador
 */
router.post('/:id/buyer-counter-offer', quoteController_1.default.sendBuyerCounterOffer);
/**
 * POST /api/quotes/:id/accept
 * Aceptar cotización
 */
router.post('/:id/accept', quoteController_1.default.acceptQuote);
/**
 * POST /api/quotes/:id/reject
 * Rechazar cotización
 */
router.post('/:id/reject', quoteController_1.default.rejectQuote);
/**
 * POST /api/quotes/:id/payment-order
 * Crear orden de pago desde cotización aceptada
 */
router.post('/:id/payment-order', quoteController_1.default.createPaymentOrderFromQuote);
/**
 * GET /api/quotes/:id/comments
 * Obtener comentarios de una cotización
 */
router.get('/:id/comments', quoteController_1.default.getQuoteComments);
/**
 * GET /api/quotes/:id/payment-order-status
 * Verificar si existe una orden de pago para esta cotización
 */
router.get('/:id/payment-order-status', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('🔍 Verificando estado de orden de pago para cotización:', req.params.id);
        const quoteId = parseInt(req.params.id);
        if (isNaN(quoteId)) {
            return res.status(400).json({
                success: false,
                message: 'ID de cotización inválido'
            });
        }
        // Buscar orden de pago existente para esta cotización
        const existingOrder = yield prisma.paymentOrder.findFirst({
            where: { quoteId: quoteId },
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
        }
        else {
            console.log('❌ No existe orden de pago para esta cotización');
            return res.json({
                success: false,
                message: 'No existe orden de pago para esta cotización'
            });
        }
    }
    catch (error) {
        console.error('❌ Error verificando orden de pago:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
}));
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
router.get('/stats', quoteController_1.default.getQuoteStats);
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
exports.default = router;
