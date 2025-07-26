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
exports.CartService = void 0;
const databaseService_1 = require("./databaseService");
const productService_1 = require("./productService");
// Mock database para carrito
const cartDatabase = {};
class CartService {
    /**
     * Obtener carrito completo del usuario
     */
    static getCart(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userCartItems = cartDatabase[userId] || [];
            // Calcular totales
            const itemCount = userCartItems.reduce((sum, item) => sum + item.containerQuantity, 0);
            const totalAmount = userCartItems.reduce((sum, item) => {
                const price = item.customPrice || item.pricePerContainer;
                return sum + (price * item.containerQuantity);
            }, 0);
            return {
                userId,
                items: userCartItems,
                itemCount,
                totalAmount,
                currency: userCartItems.length > 0 ? userCartItems[0].currency : 'USD',
                lastUpdated: new Date()
            };
        });
    }
    /**
     * Agregar producto al carrito
     */
    static addToCart(userId_1, productId_1, containerQuantity_1) {
        return __awaiter(this, arguments, void 0, function* (userId, productId, containerQuantity, containerType = '20GP', incoterm = 'CIF', customPrice, notes) {
            console.log('🛒 CartService.addToCart called with:', { userId, productId, containerQuantity, containerType, incoterm });
            // Obtener información del producto
            const product = yield productService_1.ProductService.getProductById(productId);
            console.log('📦 Product found:', product ? 'YES' : 'NO', product === null || product === void 0 ? void 0 : product.id);
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            // Verificar stock
            if (product.stockContainers < containerQuantity) {
                throw new Error(`Stock insuficiente. Disponible: ${product.stockContainers} contenedores`);
            }
            // Inicializar carrito del usuario si no existe
            if (!cartDatabase[userId]) {
                cartDatabase[userId] = [];
            }
            // Verificar si el producto ya está en el carrito
            const existingItemIndex = cartDatabase[userId].findIndex(item => item.productId === productId &&
                item.supplierId === product.supplierId &&
                item.containerType === containerType &&
                item.incoterm === incoterm);
            if (existingItemIndex >= 0) {
                // Actualizar cantidad del item existente
                const existingItem = cartDatabase[userId][existingItemIndex];
                existingItem.containerQuantity += containerQuantity;
                existingItem.updatedAt = new Date();
                if (customPrice) {
                    existingItem.customPrice = customPrice;
                }
                if (notes) {
                    existingItem.notes = notes;
                }
                return existingItem;
            }
            // Crear nuevo item del carrito
            const newCartItem = {
                id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                userId,
                productId: product.id,
                productName: product.name,
                productDescription: product.description,
                supplierName: product.supplierName,
                supplierId: product.supplierId,
                containerType,
                containerQuantity,
                pricePerContainer: product.unitPrice,
                currency: product.currency,
                incoterm,
                customPrice,
                notes,
                addedAt: new Date(),
                updatedAt: new Date()
            };
            cartDatabase[userId].push(newCartItem);
            return newCartItem;
        });
    }
    /**
     * Actualizar cantidad de un item del carrito
     */
    static updateCartItem(userId, itemId, containerQuantity, customPrice, notes) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!cartDatabase[userId]) {
                throw new Error('Carrito no encontrado');
            }
            const itemIndex = cartDatabase[userId].findIndex(item => item.id === itemId);
            if (itemIndex === -1) {
                throw new Error('Item no encontrado en el carrito');
            }
            const item = cartDatabase[userId][itemIndex];
            // Verificar stock
            const product = yield databaseService_1.DatabaseService.getProductById(item.productId);
            if (product && product.stockContainers < containerQuantity) {
                throw new Error(`Stock insuficiente. Disponible: ${product.stockContainers} contenedores`);
            }
            // Actualizar item
            item.containerQuantity = containerQuantity;
            item.updatedAt = new Date();
            if (customPrice !== undefined) {
                item.customPrice = customPrice;
            }
            if (notes !== undefined) {
                item.notes = notes;
            }
            return item;
        });
    }
    /**
     * Remover item del carrito
     */
    static removeFromCart(userId, itemId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!cartDatabase[userId]) {
                return false;
            }
            const initialLength = cartDatabase[userId].length;
            cartDatabase[userId] = cartDatabase[userId].filter(item => item.id !== itemId);
            return cartDatabase[userId].length < initialLength;
        });
    }
    /**
     * Limpiar carrito completo
     */
    static clearCart(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (cartDatabase[userId]) {
                cartDatabase[userId] = [];
                return true;
            }
            return false;
        });
    }
    /**
     * Obtener estadísticas del carrito
     */
    static getCartStats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cart = yield this.getCart(userId);
            const uniqueSuppliers = new Set(cart.items.map(item => item.supplierId));
            return {
                itemCount: cart.itemCount,
                totalAmount: cart.totalAmount,
                currency: cart.currency,
                supplierCount: uniqueSuppliers.size
            };
        });
    }
}
exports.CartService = CartService;
