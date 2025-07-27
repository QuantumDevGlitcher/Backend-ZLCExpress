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
exports.cancelOrder = exports.getOrdersByUser = exports.updateOrderStatus = exports.createOrder = exports.getOrderById = exports.getOrders = void 0;
const prismaService_1 = require("../services/prismaService");
// ================================================================
// CONTROLADOR DE ÓRDENES CON PRISMA
// ================================================================
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { buyerId, supplierId, status, page = 1, limit = 50 } = req.query;
        // Construir filtros
        const filters = {
            page: parseInt(page),
            limit: parseInt(limit)
        };
        if (buyerId) {
            filters.buyerId = parseInt(buyerId);
        }
        if (status) {
            filters.status = status;
        }
        // Para supplierId, necesitamos usar un enfoque diferente ya que está en orderDetails
        if (supplierId) {
            filters.supplierId = parseInt(supplierId);
        }
        // Obtener órdenes con filtros
        const result = yield prismaService_1.databaseService.getOrders(filters);
        res.json({
            success: true,
            data: result.orders,
            pagination: result.pagination
        });
    }
    catch (error) {
        console.error('❌ Error al obtener órdenes:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
exports.getOrders = getOrders;
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const order = yield prismaService_1.databaseService.getOrderById(parseInt(id));
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Orden no encontrada'
            });
        }
        res.json({
            success: true,
            data: order
        });
    }
    catch (error) {
        console.error('❌ Error al obtener orden:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
exports.getOrderById = getOrderById;
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { buyerId, orderDetails, shippingAddress, notes } = req.body;
        // Validaciones básicas
        if (!buyerId || !orderDetails || !Array.isArray(orderDetails) || orderDetails.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'buyerId y orderDetails son requeridos'
            });
        }
        // Validar que cada orderDetail tenga los campos requeridos
        for (const detail of orderDetails) {
            if (!detail.productId || !detail.supplierId || !detail.quantity || !detail.unitPrice) {
                return res.status(400).json({
                    success: false,
                    message: 'Cada orderDetail debe tener productId, supplierId, quantity y unitPrice'
                });
            }
        }
        // Preparar datos de la orden
        const orderData = {
            buyerId: parseInt(buyerId),
            orderDetails: orderDetails.map((detail) => ({
                productId: parseInt(detail.productId),
                supplierId: parseInt(detail.supplierId),
                quantity: parseInt(detail.quantity),
                unitPrice: parseFloat(detail.unitPrice),
                specifications: detail.specifications
            })),
            shippingAddress,
            notes
        };
        const newOrder = yield prismaService_1.databaseService.createOrder(orderData);
        res.status(201).json({
            success: true,
            message: 'Orden creada exitosamente',
            data: newOrder
        });
    }
    catch (error) {
        console.error('❌ Error al crear orden:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
exports.createOrder = createOrder;
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;
        // Validar status
        const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Estado no válido'
            });
        }
        const updatedOrder = yield prismaService_1.databaseService.updateOrderStatus(parseInt(id), status, notes);
        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: 'Orden no encontrada'
            });
        }
        res.json({
            success: true,
            message: 'Estado de orden actualizado exitosamente',
            data: updatedOrder
        });
    }
    catch (error) {
        console.error('❌ Error al actualizar orden:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
exports.updateOrderStatus = updateOrderStatus;
const getOrdersByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { role = 'buyer', page = 1, limit = 20 } = req.query;
        const result = yield prismaService_1.databaseService.getOrdersByUser(parseInt(userId), role, parseInt(page), parseInt(limit));
        res.json({
            success: true,
            data: result.orders,
            pagination: result.pagination
        });
    }
    catch (error) {
        console.error('❌ Error al obtener órdenes del usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
exports.getOrdersByUser = getOrdersByUser;
const cancelOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const cancelledOrder = yield prismaService_1.databaseService.cancelOrder(parseInt(id), reason);
        if (!cancelledOrder) {
            return res.status(404).json({
                success: false,
                message: 'Orden no encontrada'
            });
        }
        res.json({
            success: true,
            message: 'Orden cancelada exitosamente',
            data: cancelledOrder
        });
    }
    catch (error) {
        console.error('❌ Error al cancelar orden:', error);
        if (error.message.includes('no puede ser cancelada')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
exports.cancelOrder = cancelOrder;
