"use strict";
// routes/quoteRoutes.ts
// Rutas adicionales para manejo de estados de cotizaciones
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
const express_1 = __importDefault(require("express"));
const quoteService_1 = require("../services/quoteService");
// import { QuoteCommentService } from '../services/quoteCommentService';
// import { PaymentOrderService } from '../services/paymentOrderService';
const router = express_1.default.Router();
// ===============================
// RUTAS PARA GESTIÓN DE ESTADOS
// ===============================
// Actualizar estado de cotización
router.put('/quotes/:id/status', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status, userId, userType, comment } = req.body;
        console.log('🔄 API: Actualizando estado de cotización', id, 'a', status);
        if (!status || !userId || !userType) {
            return res.status(400).json({
                success: false,
                message: 'Status, userId y userType son requeridos'
            });
        }
        const updatedQuote = yield quoteService_1.QuoteService.updateQuoteStatus(parseInt(id), status, userId, userType, comment);
        res.json({
            success: true,
            data: updatedQuote,
            message: 'Estado de cotización actualizado exitosamente'
        });
    }
    catch (error) {
        console.error('❌ Error actualizando estado de cotización:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
}));
// Enviar contraoferta
router.put('/quotes/:id/counter-offer', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { userId, userType, newPrice, comment, paymentTerms, deliveryTerms } = req.body;
        console.log('🔄 API: Enviando contraoferta para cotización', id);
        if (!userId || !userType || !comment) {
            return res.status(400).json({
                success: false,
                message: 'userId, userType y comment son requeridos'
            });
        }
        const updatedQuote = yield quoteService_1.QuoteService.sendCounterOffer(parseInt(id), userId, userType, {
            newPrice,
            comment,
            paymentTerms,
            deliveryTerms
        });
        res.json({
            success: true,
            data: updatedQuote,
            message: 'Contraoferta enviada exitosamente'
        });
    }
    catch (error) {
        console.error('❌ Error enviando contraoferta:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
}));
// Obtener comentarios de una cotización
router.get('/quotes/:id/comments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log('💬 API: Obteniendo comentarios para cotización', id);
        const comments = yield quoteService_1.QuoteService.getQuoteComments(parseInt(id));
        res.json({
            success: true,
            data: comments,
            message: 'Comentarios obtenidos exitosamente'
        });
    }
    catch (error) {
        console.error('❌ Error obteniendo comentarios:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
}));
// ===============================
// RUTAS PARA ÓRDENES DE PAGO (SIMULADAS)
// ===============================
// Crear orden de pago
router.post('/quotes/:id/payment-order', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { buyerId, paymentMethod } = req.body;
        console.log('💳 API: Creando orden de pago para cotización', id);
        // Obtener la cotización
        const quotes = yield quoteService_1.QuoteService.getUserQuotes(buyerId);
        const quote = quotes.find(q => q.id === parseInt(id));
        if (!quote) {
            return res.status(404).json({
                success: false,
                message: 'Cotización no encontrada'
            });
        }
        // Simular creación de orden de pago
        const paymentOrder = {
            id: Date.now(),
            orderNumber: `PO-${Date.now()}`,
            quoteId: quote.id,
            buyerId: buyerId,
            totalAmount: quote.totalPrice,
            currency: 'USD',
            paymentMethod: paymentMethod || 'paypal',
            paymentStatus: 'PENDING',
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            quote: quote
        };
        res.json({
            success: true,
            data: paymentOrder,
            message: 'Orden de pago creada exitosamente'
        });
    }
    catch (error) {
        console.error('❌ Error creando orden de pago:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
}));
// Simular procesamiento de pago con PayPal
router.post('/payment-orders/:orderNumber/process', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderNumber } = req.params;
        const { paymentId, payerId, token } = req.body;
        console.log('💳 API: Procesando pago para orden', orderNumber);
        // Simular procesamiento exitoso
        const processedPayment = {
            orderNumber,
            paymentStatus: 'COMPLETED',
            paypalPaymentId: paymentId,
            paypalPayerId: payerId,
            paypalToken: token,
            paidAt: new Date(),
            message: 'Pago procesado exitosamente'
        };
        res.json({
            success: true,
            data: processedPayment,
            message: 'Pago procesado exitosamente'
        });
    }
    catch (error) {
        console.error('❌ Error procesando pago:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
}));
// Obtener orden de pago por número
router.get('/payment-orders/:orderNumber', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderNumber } = req.params;
        console.log('💳 API: Obteniendo orden de pago', orderNumber);
        // Simular obtención de orden
        const paymentOrder = {
            orderNumber,
            paymentStatus: 'PENDING',
            message: 'Orden de pago simulada'
        };
        res.json({
            success: true,
            data: paymentOrder,
            message: 'Orden de pago obtenida exitosamente'
        });
    }
    catch (error) {
        console.error('❌ Error obteniendo orden de pago:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
}));
exports.default = router;
