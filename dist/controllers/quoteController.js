"use strict";
// ================================================================
// CONTROLADOR DE COTIZACIONES - ZLCExpress (PostgreSQL)
// ================================================================
// Descripción: Controlador HTTP simplificado para gestionar cotizaciones con PostgreSQL
// Fecha: 2025-07-27
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.createPaymentOrderFromQuote = exports.sendBuyerCounterOffer = exports.rejectQuote = exports.acceptQuote = exports.getQuoteComments = exports.sendCounterOffer = exports.updateQuoteStatus = exports.getQuoteById = exports.getQuoteStats = exports.getUserQuotes = exports.createQuote = void 0;
const quoteService_1 = __importDefault(require("../services/quoteService"));
/**
 * Crear nueva cotización
 */
const createQuote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('📥 QuoteController: Recibida solicitud para crear cotización');
        console.log('📋 Datos recibidos:', req.body);
        console.log('🔍 PaymentTerms específicamente:', req.body.paymentTerms);
        console.log('🔍 PaymentConditions específicamente:', req.body.paymentConditions);
        console.log('📄 Purchase Order File:', req.body.purchaseOrderFile);
        console.log('📝 Notes:', req.body.notes);
        const userId = parseInt(req.headers['user-id']) || 1; // Mock user ID
        const paymentConditions = req.body.paymentTerms || req.body.paymentConditions;
        console.log('💰 Condiciones de pago finales:', paymentConditions);
        const quoteData = {
            totalAmount: req.body.totalAmount || req.body.estimatedValue || 0,
            paymentConditions: paymentConditions,
            freightQuote: req.body.freightQuote,
            freightDetails: req.body.freightDetails,
            notes: req.body.logisticsComments || req.body.specialRequirements || req.body.notes,
            purchaseOrderFile: req.body.purchaseOrderFile,
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
/**
 * Actualizar estado de cotización
 */
const updateQuoteStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('🔄 QuoteController: Actualizando estado de cotización');
        const { id: quoteId } = req.params;
        const { status, comment, counterOfferData } = req.body;
        const userId = parseInt(req.headers['user-id']) || 1;
        const userType = req.headers['user-type'] || 'BUYER';
        if (!quoteId || !status) {
            return res.status(400).json({
                success: false,
                message: 'ID de cotización y estado son requeridos'
            });
        }
        const updatedQuote = yield quoteService_1.default.updateQuoteStatus(parseInt(quoteId), status, userId, userType, comment, counterOfferData);
        console.log('✅ QuoteController: Estado actualizado exitosamente');
        res.json({
            success: true,
            data: updatedQuote,
            message: 'Estado de cotización actualizado exitosamente'
        });
    }
    catch (error) {
        console.error('❌ QuoteController: Error actualizando estado:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error al actualizar estado de cotización'
        });
    }
});
exports.updateQuoteStatus = updateQuoteStatus;
/**
 * Enviar contraoferta
 */
const sendCounterOffer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('🔄 QuoteController: Enviando contraoferta');
        const { id: quoteId } = req.params;
        const { newPrice, comment, paymentTerms, deliveryTerms } = req.body;
        const userId = parseInt(req.headers['user-id']) || 1;
        const userType = req.headers['user-type'] || 'SUPPLIER';
        if (!quoteId || !comment) {
            return res.status(400).json({
                success: false,
                message: 'ID de cotización y comentario son requeridos'
            });
        }
        const updatedQuote = yield quoteService_1.default.sendCounterOffer(parseInt(quoteId), userId, userType, {
            newPrice,
            comment,
            paymentTerms,
            deliveryTerms
        });
        console.log('✅ QuoteController: Contraoferta enviada exitosamente');
        res.json({
            success: true,
            data: updatedQuote,
            message: 'Contraoferta enviada exitosamente'
        });
    }
    catch (error) {
        console.error('❌ QuoteController: Error enviando contraoferta:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error al enviar contraoferta'
        });
    }
});
exports.sendCounterOffer = sendCounterOffer;
/**
 * Obtener comentarios de cotización
 */
const getQuoteComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('💬 QuoteController: Obteniendo comentarios de cotización');
        console.log('🔍 req.params completos:', req.params);
        console.log('🔍 req.url:', req.url);
        console.log('🔍 req.method:', req.method);
        const { id } = req.params;
        console.log('🔍 ID extraído de params:', id);
        if (!id) {
            console.error('❌ ID no encontrado en parámetros');
            return res.status(400).json({
                success: false,
                message: 'ID de cotización es requerido'
            });
        }
        const quoteId = parseInt(id);
        console.log('🔍 ID convertido a número:', quoteId);
        if (isNaN(quoteId)) {
            console.error('❌ ID no es un número válido:', id);
            return res.status(400).json({
                success: false,
                message: 'ID de cotización debe ser un número válido'
            });
        }
        console.log('📋 Buscando comentarios para cotización ID:', quoteId);
        const comments = yield quoteService_1.default.getQuoteComments(quoteId);
        console.log('✅ QuoteController: Comentarios obtenidos exitosamente, count:', comments.length);
        res.json({
            success: true,
            comments,
            count: comments.length,
            message: 'Comentarios obtenidos exitosamente'
        });
    }
    catch (error) {
        console.error('❌ QuoteController: Error obteniendo comentarios:', error);
        console.error('❌ Stack trace:', error.stack);
        res.status(500).json({
            success: false,
            message: error.message || 'Error al obtener comentarios'
        });
    }
});
exports.getQuoteComments = getQuoteComments;
/**
 * Aceptar cotización (comprador o proveedor)
 */
const acceptQuote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('✅ QuoteController: Aceptando cotización');
        const { id: quoteId } = req.params;
        const { comment } = req.body;
        const userId = parseInt(req.headers['user-id']) || 1;
        const userType = req.headers['user-type'] || 'BUYER';
        const updatedQuote = yield quoteService_1.default.acceptQuote(parseInt(quoteId), userId, userType, comment);
        res.json({
            success: true,
            data: updatedQuote,
            message: 'Cotización aceptada exitosamente'
        });
    }
    catch (error) {
        console.error('❌ QuoteController: Error aceptando cotización:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error al aceptar cotización'
        });
    }
});
exports.acceptQuote = acceptQuote;
/**
 * Rechazar cotización (comprador o proveedor)
 */
const rejectQuote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('❌ QuoteController: Rechazando cotización');
        const { id: quoteId } = req.params;
        const { comment } = req.body;
        const userId = parseInt(req.headers['user-id']) || 1;
        const userType = req.headers['user-type'] || 'BUYER';
        const updatedQuote = yield quoteService_1.default.rejectQuote(parseInt(quoteId), userId, userType, comment);
        res.json({
            success: true,
            data: updatedQuote,
            message: 'Cotización rechazada exitosamente'
        });
    }
    catch (error) {
        console.error('❌ QuoteController: Error rechazando cotización:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error al rechazar cotización'
        });
    }
});
exports.rejectQuote = rejectQuote;
/**
 * Enviar contraoferta desde el comprador
 */
const sendBuyerCounterOffer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('� QuoteController: Enviando contraoferta del comprador');
        const { id: quoteId } = req.params;
        const { newPrice, comment, paymentTerms, deliveryTerms } = req.body;
        const userId = parseInt(req.headers['user-id']) || 1;
        console.log('📝 Datos de contraoferta del comprador:', {
            quoteId,
            newPrice,
            comment,
            paymentTerms,
            deliveryTerms,
            userId
        });
        if (!(comment === null || comment === void 0 ? void 0 : comment.trim())) {
            return res.status(400).json({
                success: false,
                message: 'El comentario es requerido para enviar una contraoferta'
            });
        }
        const updatedQuote = yield quoteService_1.default.sendBuyerCounterOffer(parseInt(quoteId), userId, {
            newPrice: newPrice ? Number(newPrice) : undefined,
            comment: comment.trim(),
            paymentTerms,
            deliveryTerms
        });
        console.log('✅ QuoteController: Contraoferta del comprador enviada exitosamente');
        res.json({
            success: true,
            data: updatedQuote,
            message: 'Contraoferta enviada exitosamente'
        });
    }
    catch (error) {
        console.error('❌ QuoteController: Error enviando contraoferta:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error al enviar contraoferta'
        });
    }
});
exports.sendBuyerCounterOffer = sendBuyerCounterOffer;
/**
 * Crear orden de pago desde una cotización aceptada
 */
const createPaymentOrderFromQuote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('💳 QuoteController: Creando orden de pago desde cotización');
        const { id: quoteId } = req.params;
        const { buyerId, paymentMethod } = req.body;
        const userId = parseInt(req.headers['user-id']) || buyerId || 1;
        // Obtener la cotización para validar su estado
        const quote = yield quoteService_1.default.getQuoteById(parseInt(quoteId));
        if (!quote) {
            return res.status(404).json({
                success: false,
                message: 'Cotización no encontrada'
            });
        }
        if (quote.status !== 'ACCEPTED') {
            return res.status(400).json({
                success: false,
                message: 'Solo se pueden crear órdenes de pago para cotizaciones aceptadas'
            });
        }
        // Importar dinámicamente el servicio de órdenes de pago
        const { PaymentOrderService } = yield Promise.resolve().then(() => __importStar(require('../services/paymentOrderService')));
        // Crear la orden de pago
        const paymentOrder = yield PaymentOrderService.createPaymentOrder({
            quoteId: parseInt(quoteId),
            buyerId: userId,
            totalAmount: quote.totalPrice,
            currency: 'USD', // Por defecto USD, puede ser dinámico
            paymentMethod: paymentMethod || 'paypal'
        });
        console.log('✅ QuoteController: Orden de pago creada:', paymentOrder.orderNumber);
        res.status(201).json({
            success: true,
            data: paymentOrder,
            message: 'Orden de pago creada exitosamente'
        });
    }
    catch (error) {
        console.error('❌ QuoteController: Error creando orden de pago:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error al crear orden de pago'
        });
    }
});
exports.createPaymentOrderFromQuote = createPaymentOrderFromQuote;
exports.default = {
    createQuote: exports.createQuote,
    getUserQuotes: exports.getUserQuotes,
    getQuoteStats: exports.getQuoteStats,
    getQuoteById: exports.getQuoteById,
    updateQuoteStatus: exports.updateQuoteStatus,
    sendCounterOffer: exports.sendCounterOffer,
    getQuoteComments: exports.getQuoteComments,
    acceptQuote: exports.acceptQuote,
    rejectQuote: exports.rejectQuote,
    sendBuyerCounterOffer: exports.sendBuyerCounterOffer,
    createPaymentOrderFromQuote: exports.createPaymentOrderFromQuote
};
