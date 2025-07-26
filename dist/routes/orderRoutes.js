"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const router = (0, express_1.Router)();
// Rutas de pedidos
router.get('/', orderController_1.getOrders);
router.get('/:id', orderController_1.getOrderById);
router.post('/', orderController_1.createOrder);
router.put('/:id/status', orderController_1.updateOrderStatus);
exports.default = router;
