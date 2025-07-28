"use strict";
// ================================================================
// CONTROLADOR DE COTIZACIONES - ZLCExpress (PostgreSQL)
// ================================================================
// Descripción: Controlador HTTP simplificado para gestionar cotizaciones con PostgreSQL
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
exports.getQuoteById = exports.getQuoteStats = exports.getUserQuotes = exports.createQuote = void 0;
const quoteService_1 = __importDefault(require("../services/quoteService"));
/**
 * Crear nueva cotización
 */
const createQuote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('📥 QuoteController: Recibida solicitud para crear cotización');
        console.log('📋 Datos recibidos:', req.body);
        const userId = parseInt(req.headers['user-id']) || 1; // Mock user ID
        const quoteData = {
            totalAmount: req.body.totalAmount || req.body.estimatedValue || 0,
            freightQuote: req.body.freightQuote,
            freightDetails: req.body.freightDetails,
            notes: req.body.logisticsComments || req.body.specialRequirements,
            items: req.body.items || []
        };
        const quote = yield quoteService_1.default.createQuote(userId, quoteData);
        console.log('✅ QuoteController: Cotización creada exitosamente');
        res.status(201).json({
            success: true,
            data: quote,
            message: 'Cotización creada exitosamente'
        });
    }
    catch (error) {
        console.error('❌ QuoteController: Error creando cotización:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Error al crear cotización'
        });
    }
});
exports.createQuote = createQuote;
/**
 * Obtener cotizaciones del usuario
 */
const getUserQuotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('📥 QuoteController: Obteniendo cotizaciones del usuario');
        const userId = parseInt(req.headers['user-id']) || 1;
        const quotes = yield quoteService_1.default.getUserQuotes(userId);
        console.log(`✅ QuoteController: ${quotes.length} cotizaciones encontradas`);
        res.json({
            success: true,
            data: quotes,
            total: quotes.length,
            message: 'Cotizaciones obtenidas exitosamente'
        });
    }
    catch (error) {
        console.error('❌ QuoteController: Error obteniendo cotizaciones:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error al obtener cotizaciones'
        });
    }
});
exports.getUserQuotes = getUserQuotes;
/**
 * Obtener estadísticas de cotizaciones
 */
const getQuoteStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('📥 QuoteController: Obteniendo estadísticas');
        const userId = parseInt(req.headers['user-id']) || 1;
        const stats = yield quoteService_1.default.getQuoteStats(userId);
        console.log('✅ QuoteController: Estadísticas obtenidas');
        res.json({
            success: true,
            data: stats,
            message: 'Estadísticas obtenidas exitosamente'
        });
    }
    catch (error) {
        console.error('❌ QuoteController: Error obteniendo estadísticas:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error al obtener estadísticas'
        });
    }
});
exports.getQuoteStats = getQuoteStats;
/**
 * Obtener cotización por ID
 */
const getQuoteById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('📥 QuoteController: Obteniendo cotización por ID');
        const quoteId = parseInt(req.params.id);
        const userId = parseInt(req.headers['user-id']) || 1;
        // Obtener todas las cotizaciones y buscar la específica
        const quotes = yield quoteService_1.default.getUserQuotes(userId);
        const foundQuote = quotes.find((q) => q.id === quoteId);
        if (!foundQuote) {
            return res.status(404).json({
                success: false,
                message: 'Cotización no encontrada'
            });
        }
        console.log('✅ QuoteController: Cotización encontrada');
        res.json({
            success: true,
            data: foundQuote,
            message: 'Cotización obtenida exitosamente'
        });
    }
    catch (error) {
        console.error('❌ QuoteController: Error obteniendo cotización:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error al obtener cotización'
        });
    }
});
exports.getQuoteById = getQuoteById;
exports.default = {
    createQuote: exports.createQuote,
    getUserQuotes: exports.getUserQuotes,
    getQuoteStats: exports.getQuoteStats,
    getQuoteById: exports.getQuoteById
};
