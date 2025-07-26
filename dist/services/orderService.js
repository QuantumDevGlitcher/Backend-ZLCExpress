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
exports.OrderService = void 0;
const types_1 = require("../types");
const cartService_1 = require("./cartService");
const productService_1 = require("./productService");
// Mock database
const mockOrders = [];
const mockOrderItems = [];
let nextOrderId = 1;
let nextOrderItemId = 1;
class OrderService {
    static createOrder(userId, orderData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Obtener carrito del usuario
            const cart = yield cartService_1.CartService.getCart(userId);
            if (cart.items.length === 0) {
                throw new Error('El carrito está vacío');
            }
            // Verificar stock de todos los productos
            for (const item of cart.items) {
                const product = yield productService_1.ProductService.getProductById(item.productId);
                if (!product || product.stockContainers < item.containerQuantity) {
                    throw new Error(`Stock insuficiente para el producto: ${(product === null || product === void 0 ? void 0 : product.name) || 'Desconocido'}`);
                }
            }
            // Crear el pedido
            const newOrder = {
                id: nextOrderId++,
                userId: parseInt(userId),
                status: types_1.OrderStatus.PENDING,
                total: cart.totalAmount,
                shippingAddress: orderData.shippingAddress,
                paymentMethod: orderData.paymentMethod,
                items: [],
                createdAt: new Date(),
                updatedAt: new Date()
            };
            // Crear los items del pedido
            const orderItems = [];
            for (const cartItem of cart.items) {
                const product = yield productService_1.ProductService.getProductById(cartItem.productId);
                if (product) {
                    const orderItem = {
                        id: nextOrderItemId++,
                        orderId: newOrder.id,
                        productId: cartItem.productId,
                        product,
                        quantity: cartItem.containerQuantity,
                        price: product.pricePerContainer
                    };
                    orderItems.push(orderItem);
                    mockOrderItems.push(orderItem);
                    // Actualizar stock
                    yield productService_1.ProductService.updateStock(cartItem.productId, cartItem.containerQuantity);
                }
            }
            newOrder.items = orderItems;
            mockOrders.push(newOrder);
            // Limpiar carrito
            yield cartService_1.CartService.clearCart(userId);
            return newOrder;
        });
    }
    static getOrdersByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userIdNum = parseInt(userId);
            const userOrders = mockOrders.filter(order => order.userId === userIdNum);
            // Obtener items para cada pedido
            return yield Promise.all(userOrders.map((order) => __awaiter(this, void 0, void 0, function* () {
                const items = mockOrderItems.filter(item => item.orderId === order.id);
                const itemsWithProducts = yield Promise.all(items.map((item) => __awaiter(this, void 0, void 0, function* () {
                    const product = yield productService_1.ProductService.getProductById(item.productId);
                    return Object.assign(Object.assign({}, item), { product: product || undefined });
                })));
                return Object.assign(Object.assign({}, order), { items: itemsWithProducts });
            })));
        });
    }
    static getOrderById(orderId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userIdNum = parseInt(userId);
            const order = mockOrders.find(o => o.id === orderId && o.userId === userIdNum);
            if (!order) {
                return null;
            }
            // Obtener items del pedido
            const items = mockOrderItems.filter(item => item.orderId === orderId);
            const itemsWithProducts = yield Promise.all(items.map((item) => __awaiter(this, void 0, void 0, function* () {
                const product = yield productService_1.ProductService.getProductById(item.productId);
                return Object.assign(Object.assign({}, item), { product: product || undefined });
            })));
            return Object.assign(Object.assign({}, order), { items: itemsWithProducts });
        });
    }
    static updateOrderStatus(orderId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = mockOrders.find(o => o.id === orderId);
            if (!order) {
                throw new Error('Pedido no encontrado');
            }
            order.status = status;
            order.updatedAt = new Date();
            return order;
        });
    }
}
exports.OrderService = OrderService;
