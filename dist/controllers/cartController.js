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
exports.CartController = void 0;
const cartService_1 = require("../services/cartService");
class CartController {
    /**
     * Obtener carrito del usuario
     * GET /api/cart
     */
    static getCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // En producción, extraerías el userId del token JWT
                const userId = req.headers['user-id'] || 'demo_user';
                const cart = yield cartService_1.CartService.getCart(userId);
                res.status(200).json({
                    success: true,
                    data: cart
                });
            }
            catch (error) {
                console.error('Error getting cart:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error al obtener el carrito',
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
    /**
     * Agregar producto al carrito
     * POST /api/cart/add
     */
    static addToCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.headers['user-id'] || 'demo_user';
                const { productId, containerQuantity, containerType, incoterm, customPrice, notes } = req.body;
                // Validación básica
                if (!productId) {
                    res.status(400).json({
                        success: false,
                        message: 'El ID del producto es requerido'
                    });
                    return;
                }
                if (!containerQuantity || containerQuantity < 1) {
                    res.status(400).json({
                        success: false,
                        message: 'La cantidad de contenedores debe ser mayor a 0'
                    });
                    return;
                }
                const cartItem = yield cartService_1.CartService.addToCart(userId, productId, parseInt(containerQuantity), containerType || '20GP', incoterm || 'CIF', customPrice ? parseFloat(customPrice) : undefined, notes);
                res.status(201).json({
                    success: true,
                    message: 'Producto agregado al carrito exitosamente',
                    data: cartItem
                });
            }
            catch (error) {
                console.error('Error adding to cart:', error);
                res.status(400).json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Error al agregar al carrito'
                });
            }
        });
    }
    /**
     * Actualizar item del carrito
     * PUT /api/cart/update/:itemId
     */
    static updateCartItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.headers['user-id'] || 'demo_user';
                const { itemId } = req.params;
                const { containerQuantity, customPrice, notes } = req.body;
                if (!containerQuantity || containerQuantity < 1) {
                    res.status(400).json({
                        success: false,
                        message: 'La cantidad de contenedores debe ser mayor a 0'
                    });
                    return;
                }
                const updatedItem = yield cartService_1.CartService.updateCartItem(userId, itemId, parseInt(containerQuantity), customPrice ? parseFloat(customPrice) : undefined, notes);
                res.status(200).json({
                    success: true,
                    message: 'Item actualizado exitosamente',
                    data: updatedItem
                });
            }
            catch (error) {
                console.error('Error updating cart item:', error);
                res.status(400).json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Error al actualizar item del carrito'
                });
            }
        });
    }
    /**
     * Remover item del carrito
     * DELETE /api/cart/remove/:itemId
     */
    static removeFromCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.headers['user-id'] || 'demo_user';
                const { itemId } = req.params;
                const removed = yield cartService_1.CartService.removeFromCart(userId, itemId);
                if (removed) {
                    res.status(200).json({
                        success: true,
                        message: 'Item removido del carrito exitosamente'
                    });
                }
                else {
                    res.status(404).json({
                        success: false,
                        message: 'Item no encontrado en el carrito'
                    });
                }
            }
            catch (error) {
                console.error('Error removing from cart:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error al remover item del carrito'
                });
            }
        });
    }
    /**
     * Limpiar carrito completo
     * DELETE /api/cart/clear
     */
    static clearCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.headers['user-id'] || 'demo_user';
                const cleared = yield cartService_1.CartService.clearCart(userId);
                res.status(200).json({
                    success: true,
                    message: cleared ? 'Carrito limpiado exitosamente' : 'El carrito ya estaba vacío'
                });
            }
            catch (error) {
                console.error('Error clearing cart:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error al limpiar el carrito'
                });
            }
        });
    }
    /**
     * Obtener estadísticas del carrito
     * GET /api/cart/stats
     */
    static getCartStats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.headers['user-id'] || 'demo_user';
                const stats = yield cartService_1.CartService.getCartStats(userId);
                res.status(200).json({
                    success: true,
                    data: stats
                });
            }
            catch (error) {
                console.error('Error getting cart stats:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error al obtener estadísticas del carrito'
                });
            }
        });
    }
}
exports.CartController = CartController;
