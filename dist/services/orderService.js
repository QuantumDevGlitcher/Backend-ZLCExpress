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
const client_1 = require("@prisma/client");
const cartService_1 = require("./cartService");
const prisma = new client_1.PrismaClient();
class OrderService {
    /**
     * Crear orden desde el carrito (sin shipping)
     */
    static createOrder(cartId_1, userId_1) {
        return __awaiter(this, arguments, void 0, function* (cartId, userId, orderData = {}) {
            try {
                const userIdNum = typeof userId === 'string' ? parseInt(userId) : userId;
                console.log('Creating order for user:', userIdNum);
                console.log('Order data:', orderData);
                // Obtener carrito del usuario
                const cart = yield cartService_1.CartService.getCart(userIdNum);
                console.log('User cart:', cart);
                if (!cart || cart.items.length === 0) {
                    throw new Error('El carrito esta vacio');
                }
                // Calcular items y total
                const orderItems = [];
                let totalAmount = 0;
                for (const cartItem of cart.items) {
                    // Obtener informacion actualizada del producto
                    const product = yield prisma.product.findUnique({
                        where: { id: cartItem.productId },
                        include: { category: true }
                    });
                    if (!product) {
                        throw new Error(`Producto ${cartItem.productId} no encontrado`);
                    }
                    console.log(`Checking stock for product ${cartItem.productId}, needed: ${cartItem.containerQuantity}, available: ${product.stockContainers}`);
                    if (product.stockContainers < cartItem.containerQuantity) {
                        throw new Error(`Stock insuficiente para ${product.name}. Disponible: ${product.stockContainers}, Solicitado: ${cartItem.containerQuantity}`);
                    }
                    const itemTotal = product.pricePerContainer * cartItem.containerQuantity;
                    totalAmount += itemTotal;
                    orderItems.push({
                        productId: cartItem.productId,
                        containerQuantity: cartItem.containerQuantity,
                        pricePerContainer: product.pricePerContainer,
                        totalPrice: itemTotal
                    });
                }
                console.log('Total amount:', totalAmount);
                // Crear orden en base de datos
                const newOrder = yield prisma.order.create({
                    data: {
                        userId: userIdNum,
                        status: 'PENDING',
                        totalAmount: totalAmount,
                        shippingAddress: orderData.shippingAddress || '',
                        originPort: orderData.originPort,
                        destinationPort: orderData.destinationPort,
                        containerType: orderData.containerType,
                        estimatedShippingDate: orderData.estimatedShippingDate
                    }
                });
                console.log('Order created with ID:', newOrder.id);
                // Crear items de la orden
                const createdOrderItems = yield Promise.all(orderItems.map(item => prisma.orderItem.create({
                    data: {
                        orderId: newOrder.id,
                        productId: item.productId,
                        containerQuantity: item.containerQuantity,
                        pricePerContainer: item.pricePerContainer,
                        totalPrice: item.totalPrice
                    }
                })));
                console.log('Created', createdOrderItems.length, 'order items');
                // Limpiar carrito
                yield cartService_1.CartService.clearCart(userIdNum);
                console.log('Cart cleared');
                // Actualizar stock de productos
                for (const cartItem of cart.items) {
                    yield prisma.product.update({
                        where: { id: cartItem.productId },
                        data: {
                            stockContainers: {
                                decrement: cartItem.containerQuantity
                            }
                        }
                    });
                }
                console.log('Order created successfully');
                return {
                    order: newOrder,
                    items: createdOrderItems
                };
            }
            catch (error) {
                console.error('Error creating order:', error);
                throw error;
            }
        });
    }
    /**
     * Crear orden con integración de shipping desde carrito
     */
    static createOrderWithShipping(cartId, userId, orderData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userIdNum = typeof userId === 'string' ? parseInt(userId) : userId;
                console.log('Creating order with shipping for user:', userIdNum);
                console.log('Order data:', orderData);
                // Obtener carrito del usuario
                const cart = yield cartService_1.CartService.getCart(userIdNum);
                console.log('User cart:', cart);
                if (!cart || cart.items.length === 0) {
                    throw new Error('El carrito esta vacio');
                }
                // Calcular peso y volumen total para shipping
                let totalWeight = 0;
                let totalVolume = 0;
                for (const cartItem of cart.items) {
                    const product = yield prisma.product.findUnique({
                        where: { id: cartItem.productId }
                    });
                    if (product) {
                        // Estimaciones de peso y volumen por contenedor
                        const estimatedWeightPerContainer = 1000; // kg
                        const estimatedVolumePerContainer = 50; // m³
                        totalWeight += estimatedWeightPerContainer * cartItem.containerQuantity;
                        totalVolume += estimatedVolumePerContainer * cartItem.containerQuantity;
                    }
                }
                // Generar numero de orden unico
                const orderNumber = `ORD-${Date.now()}-${userIdNum}`;
                // Crear orden basica primero
                const basicOrderResult = yield this.createOrder(cartId, userId, Object.assign(Object.assign({}, orderData), { requestShippingQuotes: true }));
                // Si se requieren cotizaciones de shipping, generarlas
                if (orderData.requestShippingQuotes) {
                    const shippingRequest = {
                        originPort: orderData.originPort || 'SHANGHAI',
                        destinationPort: orderData.destinationPort || 'MIAMI',
                        containerType: orderData.containerType || '20FT',
                        containerCount: cart.items.reduce((sum, item) => sum + item.containerQuantity, 0),
                        estimatedShippingDate: orderData.estimatedShippingDate || new Date(),
                        cargoValue: basicOrderResult.order.totalAmount,
                        incoterm: 'FOB'
                    };
                    // const shippingQuotes = await ShippingService.getShippingQuotes(shippingRequest, userIdNum);
                    const shippingQuotes = []; // Mock for now
                    return {
                        order: basicOrderResult.order,
                        items: basicOrderResult.items,
                        shippingQuotes: shippingQuotes,
                        message: `Orden creada exitosamente. Se generaron ${shippingQuotes.length} cotizaciones de flete.`
                    };
                }
                return basicOrderResult;
            }
            catch (error) {
                console.error('Error creating order with shipping:', error);
                throw error;
            }
        });
    }
    /**
     * Confirmar orden con cotización de shipping seleccionada
     */
    static confirmOrderWithShipping(orderId, shippingQuoteId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Marcar la cotización como seleccionada
                // await ShippingService.selectShippingQuote(shippingQuoteId, orderId);
                console.log('ShippingService temporarily disabled'); // Mock for now
                // Actualizar estado de la orden
                const updatedOrder = yield prisma.order.update({
                    where: { id: orderId },
                    data: {
                        status: 'CONFIRMED',
                        updatedAt: new Date()
                    },
                    include: {
                        items: {
                            include: {
                                product: true
                            }
                        }
                    }
                });
                return {
                    order: updatedOrder,
                    message: 'Orden confirmada con shipping seleccionado'
                };
            }
            catch (error) {
                console.error('Error confirming order with shipping:', error);
                throw error;
            }
        });
    }
    /**
     * Obtener órdenes de un usuario
     */
    static getOrdersByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userIdNum = typeof userId === 'string' ? parseInt(userId) : userId;
                const orders = yield prisma.order.findMany({
                    where: { userId: userIdNum },
                    include: {
                        items: {
                            include: {
                                product: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                });
                return orders;
            }
            catch (error) {
                console.error('Error getting orders by user:', error);
                throw error;
            }
        });
    }
    /**
     * Obtener orden por ID
     */
    static getOrderById(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield prisma.order.findUnique({
                    where: { id: orderId },
                    include: {
                        items: {
                            include: {
                                product: true
                            }
                        }
                    }
                });
                if (!order) {
                    throw new Error('Orden no encontrada');
                }
                return {
                    id: order.id,
                    userId: order.userId,
                    status: order.status,
                    totalAmount: order.totalAmount,
                    shippingAddress: order.shippingAddress,
                    items: order.items.map((item) => ({
                        id: item.id,
                        containerQuantity: item.containerQuantity,
                        pricePerContainer: item.pricePerContainer,
                        totalPrice: item.totalPrice,
                        product: item.product
                    })),
                    createdAt: order.createdAt,
                    updatedAt: order.updatedAt
                };
            }
            catch (error) {
                console.error('Error getting order by ID:', error);
                throw error;
            }
        });
    }
    /**
     * Actualizar estado de una orden
     */
    static updateOrderStatus(orderId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedOrder = yield prisma.order.update({
                    where: { id: orderId },
                    data: {
                        status,
                        updatedAt: new Date()
                    },
                    include: {
                        items: {
                            include: {
                                product: true
                            }
                        }
                    }
                });
                return updatedOrder;
            }
            catch (error) {
                console.error('Error updating order status:', error);
                throw error;
            }
        });
    }
}
exports.OrderService = OrderService;
exports.default = OrderService;
