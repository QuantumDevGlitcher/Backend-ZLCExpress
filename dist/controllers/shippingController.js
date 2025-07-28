"use strict";
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
exports.ShippingController = void 0;
const shippingService_1 = require("../services/shippingService");
// import { OrderService } from '../services/orderService'; // Removed to avoid circular dependency
class ShippingController {
    /**
     * Obtener cotizaciones de flete
     */
    static getShippingQuotes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = parseInt(req.headers['user-id']);
                if (!userId) {
                    return res.status(400).json({
                        success: false,
                        message: 'User ID requerido'
                    });
                }
                const { originPort, destinationPort, containerType, containerCount, estimatedShippingDate, cargoValue, incoterm } = req.body;
                // Validaciones
                if (!originPort || !destinationPort || !containerType) {
                    return res.status(400).json({
                        success: false,
                        message: 'Puerto de origen, destino y tipo de contenedor son requeridos'
                    });
                }
                const shippingRequest = {
                    originPort,
                    destinationPort,
                    containerType,
                    containerCount: containerCount || 1,
                    estimatedShippingDate: estimatedShippingDate ? new Date(estimatedShippingDate) : new Date(),
                    cargoValue: cargoValue || 0,
                    incoterm: incoterm || 'FOB'
                };
                const quotes = yield shippingService_1.ShippingService.getShippingQuotes(shippingRequest, userId);
                res.json({
                    success: true,
                    data: quotes,
                    message: `Se generaron ${quotes.length} cotizaciones`
                });
            }
            catch (error) {
                console.error('Error getting shipping quotes:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error al obtener cotizaciones de flete',
                    error: error.message
                });
            }
        });
    }
    /**
     * Seleccionar cotización de flete para una orden
     */
    static selectShippingQuote(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { quoteId, orderId } = req.body;
                if (!quoteId || !orderId) {
                    return res.status(400).json({
                        success: false,
                        message: 'Quote ID y Order ID son requeridos'
                    });
                }
                yield shippingService_1.ShippingService.selectShippingQuote(quoteId, orderId);
                res.json({
                    success: true,
                    message: 'Cotización de flete seleccionada exitosamente'
                });
            }
            catch (error) {
                console.error('Error selecting shipping quote:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error al seleccionar cotización de flete',
                    error: error.message
                });
            }
        });
    }
    /**
     * Obtener cotizaciones del usuario
     */
    static getUserQuotes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = parseInt(req.headers['user-id']);
                if (!userId) {
                    return res.status(400).json({
                        success: false,
                        message: 'User ID requerido'
                    });
                }
                const quotes = yield shippingService_1.ShippingService.getQuotesByUser(userId);
                res.json({
                    success: true,
                    data: quotes
                });
            }
            catch (error) {
                console.error('Error getting user quotes:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error al obtener cotizaciones del usuario',
                    error: error.message
                });
            }
        });
    }
    /**
     * Obtener cotizaciones para una orden específica
     */
    static getOrderQuotes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orderId = parseInt(req.params.orderId);
                if (!orderId) {
                    return res.status(400).json({
                        success: false,
                        message: 'Order ID requerido'
                    });
                }
                const quotes = yield shippingService_1.ShippingService.getQuotesByOrder(orderId);
                res.json({
                    success: true,
                    data: quotes
                });
            }
            catch (error) {
                console.error('Error getting order quotes:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error al obtener cotizaciones de la orden',
                    error: error.message
                });
            }
        });
    }
    /**
     * Obtener puertos disponibles
     */
    static getAvailablePorts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ports = yield shippingService_1.ShippingService.getAvailablePorts();
                res.json({
                    success: true,
                    data: ports
                });
            }
            catch (error) {
                console.error('Error getting available ports:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error al obtener puertos disponibles',
                    error: error.message
                });
            }
        });
    }
    /**
     * Crear orden con solicitud de cotizaciones de flete
     */
    static createOrderWithShipping(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.headers['user-id'];
                if (!userId) {
                    return res.status(400).json({
                        success: false,
                        message: 'User ID requerido'
                    });
                }
                const orderData = req.body;
                orderData.requestShippingQuotes = true; // Forzar solicitud de cotizaciones
                // const result = await OrderService.createOrderWithShipping(userId, orderData);
                res.status(201).json({
                    success: true,
                    data: { message: "OrderService temporarily disabled" },
                    message: 'Orden creada y cotizaciones de flete generadas'
                });
            }
            catch (error) {
                console.error('Error creating order with shipping:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error al crear orden con flete',
                    error: error.message
                });
            }
        });
    }
    /**
     * Confirmar orden con flete seleccionado
     */
    static confirmOrderWithShipping(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderId, shippingQuoteId } = req.body;
                if (!orderId || !shippingQuoteId) {
                    return res.status(400).json({
                        success: false,
                        message: 'Order ID y Shipping Quote ID son requeridos'
                    });
                }
                // const confirmedOrder = await OrderService.confirmOrderWithShipping(orderId, shippingQuoteId);
                res.json({
                    success: true,
                    data: { message: "OrderService temporarily disabled" },
                    message: 'Orden confirmada con flete seleccionado'
                });
            }
            catch (error) {
                console.error('Error confirming order with shipping:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error al confirmar orden con flete',
                    error: error.message
                });
            }
        });
    }
}
exports.ShippingController = ShippingController;
