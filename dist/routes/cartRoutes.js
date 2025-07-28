"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cartController_1 = require("../controllers/cartController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// 🔒 TODAS LAS RUTAS DEL CARRITO REQUIEREN AUTENTICACIÓN DE COMPRADOR
router.get('/', authMiddleware_1.requireBuyer, cartController_1.CartController.getCart);
router.get('/stats', authMiddleware_1.requireBuyer, cartController_1.CartController.getCartStats);
router.post('/add', authMiddleware_1.requireBuyer, cartController_1.CartController.addToCart);
router.put('/update/:itemId', authMiddleware_1.requireBuyer, cartController_1.CartController.updateCartItem);
router.delete('/remove/:itemId', authMiddleware_1.requireBuyer, cartController_1.CartController.removeFromCart);
router.delete('/clear', authMiddleware_1.requireBuyer, cartController_1.CartController.clearCart);
exports.default = router;
