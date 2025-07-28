"use strict";
// controllers/paymentOrderController.ts
// Controlador para manejar órdenes de pago
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
exports.PaymentOrderController = void 0;
const paymentOrderService_1 = require("../services/paymentOrderService");
class PaymentOrderController {
    // Crear nueva orden de pago
    static createPaymentOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('💳 PaymentOrderController: Creando orden de pago');
                const { quoteId, totalAmount, currency, paymentMethod } = req.body;
                const userId = parseInt(req.headers['user-id']);
                const userType = req.headers['user-type'];
                if (!userId) {
                    return res.status(401).json({
                        success: false,
                        message: 'Usuario no autenticado'
                    });
                }
                if (userType !== 'BUYER') {
                    return res.status(403).json({
                        success: false,
                        message: 'Solo los compradores pueden crear órdenes de pago'
                    });
                }
                if (!quoteId || !totalAmount) {
                    return res.status(400).json({
                        success: false,
                        message: 'ID de cotización y monto total son requeridos'
                    });
                }
                // VALIDACIÓN CRÍTICA: Verificar que la cotización pertenece al usuario
                const quote = yield paymentOrderService_1.PaymentOrderService.getQuoteById(parseInt(quoteId));
                if (!quote) {
                    return res.status(404).json({
                        success: false,
                        message: 'Cotización no encontrada'
                    });
                }
                if (quote.buyerId !== userId) {
                    return res.status(403).json({
                        success: false,
                        message: 'No tienes permiso para crear una orden de pago para esta cotización'
                    });
                }
                const paymentOrder = yield paymentOrderService_1.PaymentOrderService.createPaymentOrder({
                    quoteId: parseInt(quoteId),
                    buyerId: userId,
                    totalAmount: parseFloat(totalAmount),
                    currency: currency || 'USD',
                    paymentMethod: paymentMethod || 'paypal'
                });
                console.log('✅ PaymentOrderController: Orden de pago creada:', paymentOrder.orderNumber);
                res.status(201).json({
                    success: true,
                    data: paymentOrder,
                    message: 'Orden de pago creada exitosamente'
                });
            }
            catch (error) {
                console.error('❌ PaymentOrderController: Error creando orden de pago:', error);
                res.status(500).json({
                    success: false,
                    message: error.message || 'Error al crear orden de pago'
                });
            }
        });
    }
    // Obtener orden de pago por ID
    static getPaymentOrderById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('💳 PaymentOrderController: Obteniendo orden de pago por ID');
                const { orderId } = req.params;
                const userId = parseInt(req.headers['user-id']);
                const userType = req.headers['user-type'];
                if (!userId) {
                    return res.status(401).json({
                        success: false,
                        message: 'Usuario no autenticado'
                    });
                }
                const paymentOrder = yield paymentOrderService_1.PaymentOrderService.getPaymentOrderById(parseInt(orderId));
                if (!paymentOrder) {
                    return res.status(404).json({
                        success: false,
                        message: 'Orden de pago no encontrada'
                    });
                }
                // VALIDACIÓN CRÍTICA: Solo el comprador de la orden puede verla
                if (userType === 'BUYER' && paymentOrder.buyerId !== userId) {
                    return res.status(403).json({
                        success: false,
                        message: 'No tienes permiso para ver esta orden de pago'
                    });
                }
                else if (userType === 'SUPPLIER') {
                    // Los proveedores no deberían ver órdenes de pago
                    return res.status(403).json({
                        success: false,
                        message: 'Los proveedores no pueden ver órdenes de pago'
                    });
                }
                res.json({
                    success: true,
                    data: paymentOrder,
                    message: 'Orden de pago obtenida exitosamente'
                });
            }
            catch (error) {
                console.error('❌ PaymentOrderController: Error obteniendo orden de pago:', error);
                res.status(500).json({
                    success: false,
                    message: error.message || 'Error al obtener orden de pago'
                });
            }
        });
    }
    // Obtener orden de pago por número
    static getPaymentOrderByNumber(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('💳 PaymentOrderController: Obteniendo orden de pago por número');
                const { orderNumber } = req.params;
                const userId = parseInt(req.headers['user-id']);
                if (!userId) {
                    return res.status(401).json({
                        success: false,
                        message: 'Usuario no autenticado'
                    });
                }
                const paymentOrder = yield paymentOrderService_1.PaymentOrderService.getPaymentOrderByNumber(orderNumber);
                if (!paymentOrder) {
                    return res.status(404).json({
                        success: false,
                        message: 'Orden de pago no encontrada'
                    });
                }
                // Verificar que el usuario sea el propietario de la orden
                if (paymentOrder.buyerId !== userId) {
                    return res.status(403).json({
                        success: false,
                        message: 'No tienes permisos para ver esta orden de pago'
                    });
                }
                res.json({
                    success: true,
                    data: paymentOrder,
                    message: 'Orden de pago obtenida exitosamente'
                });
            }
            catch (error) {
                console.error('❌ PaymentOrderController: Error obteniendo orden de pago:', error);
                res.status(500).json({
                    success: false,
                    message: error.message || 'Error al obtener orden de pago'
                });
            }
        });
    }
    // Obtener orden de pago por ID de cotización
    static getPaymentOrderByQuoteId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('💳 PaymentOrderController: Obteniendo orden de pago por ID de cotización');
                const { quoteId } = req.params;
                const userId = parseInt(req.headers['user-id']);
                if (!userId) {
                    return res.status(401).json({
                        success: false,
                        message: 'Usuario no autenticado'
                    });
                }
                const paymentOrder = yield paymentOrderService_1.PaymentOrderService.getPaymentOrderByQuoteId(parseInt(quoteId));
                if (!paymentOrder) {
                    return res.status(404).json({
                        success: false,
                        message: 'Orden de pago no encontrada para esta cotización'
                    });
                }
                // Verificar que el usuario sea el propietario de la orden
                if (paymentOrder.buyerId !== userId) {
                    return res.status(403).json({
                        success: false,
                        message: 'No tienes permisos para ver esta orden de pago'
                    });
                }
                res.json({
                    success: true,
                    data: paymentOrder,
                    message: 'Orden de pago obtenida exitosamente'
                });
            }
            catch (error) {
                console.error('❌ PaymentOrderController: Error obteniendo orden de pago:', error);
                res.status(500).json({
                    success: false,
                    message: error.message || 'Error al obtener orden de pago'
                });
            }
        });
    }
    // Actualizar estado de pago
    static updatePaymentStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('💳 PaymentOrderController: Actualizando estado de pago');
                const { orderId } = req.params;
                const { status, paypalPaymentId, paypalPayerId, paypalToken } = req.body;
                const paymentOrder = yield paymentOrderService_1.PaymentOrderService.updatePaymentStatus(parseInt(orderId), status, {
                    paymentId: paypalPaymentId,
                    payerId: paypalPayerId,
                    token: paypalToken
                });
                res.json({
                    success: true,
                    data: paymentOrder,
                    message: 'Estado de pago actualizado exitosamente'
                });
            }
            catch (error) {
                console.error('❌ PaymentOrderController: Error actualizando estado:', error);
                res.status(500).json({
                    success: false,
                    message: error.message || 'Error al actualizar estado de pago'
                });
            }
        });
    }
    // Obtener órdenes de pago de un usuario
    static getUserPaymentOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('💳 PaymentOrderController: Obteniendo órdenes de pago del usuario');
                const { userId } = req.params;
                const authenticatedUserId = parseInt(req.headers['user-id']);
                const userType = req.headers['user-type'];
                if (!authenticatedUserId) {
                    return res.status(401).json({
                        success: false,
                        message: 'Usuario no autenticado'
                    });
                }
                // VALIDACIÓN CRÍTICA: Solo el propio usuario puede ver sus órdenes
                if (parseInt(userId) !== authenticatedUserId) {
                    return res.status(403).json({
                        success: false,
                        message: 'No tienes permiso para ver las órdenes de otro usuario'
                    });
                }
                if (userType !== 'BUYER') {
                    return res.status(403).json({
                        success: false,
                        message: 'Solo los compradores tienen órdenes de pago'
                    });
                }
                const paymentOrders = yield paymentOrderService_1.PaymentOrderService.getUserPaymentOrders(parseInt(userId));
                res.json({
                    success: true,
                    data: paymentOrders,
                    count: paymentOrders.length,
                    message: 'Órdenes de pago obtenidas exitosamente'
                });
            }
            catch (error) {
                console.error('❌ PaymentOrderController: Error obteniendo órdenes:', error);
                res.status(500).json({
                    success: false,
                    message: error.message || 'Error al obtener órdenes de pago'
                });
            }
        });
    }
    // Procesar pago (simulación para PayPal)
    static processPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('💳 PaymentOrderController: Procesando pago');
                const { orderNumber } = req.params;
                const { paymentId, payerId, token } = req.body;
                // Obtener la orden de pago
                const paymentOrder = yield paymentOrderService_1.PaymentOrderService.getPaymentOrderByNumber(orderNumber);
                if (!paymentOrder) {
                    return res.status(404).json({
                        success: false,
                        message: 'Orden de pago no encontrada'
                    });
                }
                // Simular procesamiento de PayPal
                console.log('💰 Simulando procesamiento de pago PayPal...');
                // En un entorno real, aquí se validaría el pago con PayPal
                const isPaymentValid = true; // Simulación
                if (isPaymentValid) {
                    // Actualizar estado de pago
                    const updatedOrder = yield paymentOrderService_1.PaymentOrderService.updatePaymentStatus(paymentOrder.id, 'COMPLETED', { paymentId, payerId, token });
                    res.json({
                        success: true,
                        data: updatedOrder,
                        message: 'Pago procesado exitosamente'
                    });
                }
                else {
                    res.status(400).json({
                        success: false,
                        message: 'Error validando el pago con PayPal'
                    });
                }
            }
            catch (error) {
                console.error('❌ PaymentOrderController: Error procesando pago:', error);
                res.status(500).json({
                    success: false,
                    message: error.message || 'Error al procesar pago'
                });
            }
        });
    }
}
exports.PaymentOrderController = PaymentOrderController;
exports.default = PaymentOrderController;
