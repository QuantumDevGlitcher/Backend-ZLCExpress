"use strict";
// ================================================================
// CONTROLADOR MY QUOTES - ZLCExpress  
// ================================================================
// Descripción: Controlador para integrar cotizaciones con frontend My Quotes
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
exports.testMyQuotes = exports.migrateRFQsToMyQuotes = exports.syncRFQsToMyQuotes = exports.createMyQuote = exports.acceptMyQuote = exports.getMyQuotesStats = exports.getMyQuotes = void 0;
const myQuotesService_1 = __importDefault(require("../services/myQuotesService"));
/**
 * Obtener todas las cotizaciones para My Quotes
 * GET /api/my-quotes
 */
const getMyQuotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('📥 MyQuotesController: Obteniendo cotizaciones para My Quotes');
        const userId = parseInt(req.headers['user-id']);
        const userType = req.headers['user-type'];
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no autenticado'
            });
        }
        if (!userType || !['BUYER', 'SUPPLIER', 'BOTH'].includes(userType)) {
            return res.status(400).json({
                success: false,
                message: 'Tipo de usuario no válido'
            });
        }
        const quotes = yield myQuotesService_1.default.getMyQuotes(userId, userType);
        console.log(`✅ MyQuotesController: ${quotes.length} cotizaciones obtenidas para usuario ${userId} (${userType})`);
        res.json({
            success: true,
            data: quotes,
            message: 'Cotizaciones obtenidas exitosamente'
        });
    }
    catch (error) {
        console.error('❌ MyQuotesController: Error obteniendo cotizaciones:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error al obtener cotizaciones'
        });
    }
});
exports.getMyQuotes = getMyQuotes;
/**
 * Obtener estadísticas para My Quotes
 * GET /api/my-quotes/stats
 */
const getMyQuotesStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('📥 MyQuotesController: Obteniendo estadísticas para My Quotes');
        const userId = parseInt(req.headers['user-id']);
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no autenticado'
            });
        }
        const stats = yield myQuotesService_1.default.getMyQuotesStats(userId);
        console.log(`✅ MyQuotesController: Estadísticas obtenidas para usuario ${userId}`);
        res.json({
            success: true,
            data: stats,
            message: 'Estadísticas obtenidas exitosamente'
        });
    }
    catch (error) {
        console.error('❌ MyQuotesController: Error obteniendo estadísticas:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error al obtener estadísticas'
        });
    }
});
exports.getMyQuotesStats = getMyQuotesStats;
/**
 * Aceptar una cotización desde My Quotes
 * POST /api/my-quotes/:id/accept
 */
const acceptMyQuote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('📥 MyQuotesController: Aceptando cotización desde My Quotes');
        const quoteId = req.params.id;
        const userId = parseInt(req.headers['user-id']) || 1;
        // TODO: Implementar aceptación de cotización
        res.status(501).json({
            success: false,
            message: 'Funcionalidad no implementada aún'
        });
    }
    catch (error) {
        console.error('❌ MyQuotesController: Error aceptando cotización:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Error al aceptar cotización'
        });
    }
});
exports.acceptMyQuote = acceptMyQuote;
/**
 * Crear nueva cotización desde frontend
 * POST /api/my-quotes
 */
const createMyQuote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('📥 MyQuotesController: Creando cotización desde frontend');
        console.log('📋 Datos recibidos:', req.body);
        const userId = parseInt(req.headers['user-id']) || 1;
        const quote = yield myQuotesService_1.default.createQuoteFromFrontend(userId, req.body);
        console.log('✅ MyQuotesController: Cotización creada exitosamente');
        res.status(201).json({
            success: true,
            data: quote,
            message: 'Cotización creada exitosamente'
        });
    }
    catch (error) {
        console.error('❌ MyQuotesController: Error creando cotización:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Error al crear cotización'
        });
    }
});
exports.createMyQuote = createMyQuote;
/**
 * Sincronizar RFQs con base de datos
 * POST /api/my-quotes/sync
 */
const syncRFQsToMyQuotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('📥 MyQuotesController: Sincronizando RFQs con base de datos');
        const userId = parseInt(req.headers['user-id']) || 1;
        // TODO: Implementar sincronización
        res.status(501).json({
            success: false,
            message: 'Funcionalidad de sincronización no implementada aún'
        });
    }
    catch (error) {
        console.error('❌ MyQuotesController: Error sincronizando RFQs:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error sincronizando RFQs'
        });
    }
});
exports.syncRFQsToMyQuotes = syncRFQsToMyQuotes;
/**
 * Migrar RFQs específicos a My Quotes
 * POST /api/my-quotes/migrate
 */
const migrateRFQsToMyQuotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('📥 MyQuotesController: Migrando RFQs específicos a My Quotes');
        const userId = parseInt(req.headers['user-id']) || 1;
        const rfqs = req.body.rfqs || [];
        // TODO: Implementar migración de RFQs
        res.status(501).json({
            success: false,
            message: 'Funcionalidad de migración no implementada aún'
        });
    }
    catch (error) {
        console.error('❌ MyQuotesController: Error migrando RFQs:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error migrando RFQs'
        });
    }
});
exports.migrateRFQsToMyQuotes = migrateRFQsToMyQuotes;
/**
 * Endpoint de prueba para verificar conexión
 * GET /api/my-quotes/test
 */
const testMyQuotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('📥 MyQuotesController: Endpoint de prueba');
        res.json({
            success: true,
            message: 'My Quotes service funcionando correctamente',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development'
        });
    }
    catch (error) {
        console.error('❌ MyQuotesController: Error en test:', error);
        res.status(500).json({
            success: false,
            message: 'Error en test de My Quotes'
        });
    }
});
exports.testMyQuotes = testMyQuotes;
exports.default = {
    getMyQuotes: exports.getMyQuotes,
    getMyQuotesStats: exports.getMyQuotesStats,
    acceptMyQuote: exports.acceptMyQuote,
    createMyQuote: exports.createMyQuote,
    syncRFQsToMyQuotes: exports.syncRFQsToMyQuotes,
    migrateRFQsToMyQuotes: exports.migrateRFQsToMyQuotes,
    testMyQuotes: exports.testMyQuotes
};
