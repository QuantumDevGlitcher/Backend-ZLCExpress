"use strict";
// ================================================================
// RUTAS DE COTIZACIONES - ZLCExpress
// ================================================================
// Descripción: Rutas HTTP para gestionar cotizaciones/RFQs con base de datos
// Fecha: 2025-07-27
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const quoteController_1 = __importDefault(require("../controllers/quoteController"));
const router = (0, express_1.Router)();
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
 * GET /api/quotes/stats
 * Obtener estadísticas de cotizaciones del usuario
 */
router.get('/stats', quoteController_1.default.getQuoteStats);
// ================================================================
// MIDDLEWARE DE VALIDACIÓN (Opcional - puede expandirse)
// ================================================================
// Middleware para validar IDs numéricos
router.param('id', (req, res, next, id) => {
    if (!/^\d+$/.test(id)) {
        return res.status(400).json({
            success: false,
            message: 'ID de cotización inválido'
        });
    }
    next();
});
exports.default = router;
