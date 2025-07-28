"use strict";
// ================================================================
// CONTROLADOR RFQ SIMPLIFICADO - ZLCExpress
// ================================================================
// Descripción: Controlador RFQ que redirige al nuevo sistema PostgreSQL
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RFQController = void 0;
class RFQController {
    /**
     * Debug endpoint para ver qué datos llegan
     */
    static debugRFQ(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('🐛 DEBUG RFQ - Method:', req.method);
            console.log('🐛 DEBUG RFQ - Headers:', JSON.stringify(req.headers, null, 2));
            console.log('🐛 DEBUG RFQ - Body:', JSON.stringify(req.body, null, 2));
            res.json({
                success: true,
                message: 'Debug info logged - Redirigir a PostgreSQL',
                received: {
                    method: req.method,
                    headers: req.headers,
                    body: req.body
                }
            });
        });
    }
    /**
     * Crear nueva solicitud de cotización (redirige a PostgreSQL)
     */
    static createRFQ(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('🔄 RFQController: Redirigiendo a sistema PostgreSQL');
                res.status(200).json({
                    success: true,
                    message: 'RFQ debe ser creado usando /api/rfq/cart/quote para PostgreSQL',
                    redirect: '/api/rfq/cart/quote'
                });
            }
            catch (error) {
                console.error('🚨 Error en createRFQ:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error interno del servidor',
                    error: 'INTERNAL_SERVER_ERROR'
                });
            }
        });
    }
    /**
     * Obtener RFQ por ID (placeholder)
     */
    static getRFQById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                res.json({
                    success: true,
                    message: 'Usar /api/rfq/quotes para obtener cotizaciones desde PostgreSQL',
                    id: id
                });
            }
            catch (error) {
                console.error('Error en getRFQById:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error interno del servidor'
                });
            }
        });
    }
    // Métodos placeholder para mantener compatibilidad
    static getRFQsWithFreight(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.json({ success: true, message: 'Usar endpoints PostgreSQL', data: [] });
        });
    }
    static getAllRFQs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.json({ success: true, message: 'Usar endpoints PostgreSQL', data: [] });
        });
    }
    static updateRFQ(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.json({ success: true, message: 'Usar endpoints PostgreSQL' });
        });
    }
    static respondToRFQ(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.json({ success: true, message: 'Usar endpoints PostgreSQL' });
        });
    }
    static deleteRFQ(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.json({ success: true, message: 'Usar endpoints PostgreSQL' });
        });
    }
    static getRFQStats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.json({ success: true, message: 'Usar endpoints PostgreSQL', data: {} });
        });
    }
    static getNotifications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.json({ success: true, message: 'Usar endpoints PostgreSQL', data: [] });
        });
    }
    static markNotificationAsRead(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.json({ success: true, message: 'Usar endpoints PostgreSQL' });
        });
    }
    static checkExpiredRFQs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.json({ success: true, message: 'Usar endpoints PostgreSQL', data: { expired: 0 } });
        });
    }
}
exports.RFQController = RFQController;
