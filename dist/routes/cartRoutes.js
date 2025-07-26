"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cartController_1 = require("../controllers/cartController");
const router = (0, express_1.Router)();
// Rutas del carrito
router.get('/', cartController_1.CartController.getCart);
router.get('/stats', cartController_1.CartController.getCartStats);
router.post('/add', cartController_1.CartController.addToCart);
router.put('/update/:itemId', cartController_1.CartController.updateCartItem);
router.delete('/remove/:itemId', cartController_1.CartController.removeFromCart);
router.delete('/clear', cartController_1.CartController.clearCart);
exports.default = router;
