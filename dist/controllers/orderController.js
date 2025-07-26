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
exports.updateOrderStatus = exports.createOrder = exports.getOrderById = exports.getOrders = void 0;
const orderService_1 = require("../services/orderService");
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = "1"; // Mock
        const orders = yield orderService_1.OrderService.getOrdersByUserId(userId);
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getOrders = getOrders;
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userId = "1"; // Mock
        const order = yield orderService_1.OrderService.getOrderById(parseInt(id), userId);
        if (!order) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getOrderById = getOrderById;
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = "1"; // Mock
        const { shippingAddress, paymentMethod } = req.body;
        if (!shippingAddress || !paymentMethod) {
            return res.status(400).json({
                error: 'Dirección de envío y método de pago son requeridos'
            });
        }
        const order = yield orderService_1.OrderService.createOrder(userId, { shippingAddress, paymentMethod });
        res.status(201).json(order);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.createOrder = createOrder;
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({
                error: 'Status es requerido'
            });
        }
        const order = yield orderService_1.OrderService.updateOrderStatus(parseInt(id), status);
        res.json(order);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.updateOrderStatus = updateOrderStatus;
