"use strict";
// services/paymentOrderService.ts
// Servicio para manejar órdenes de pago
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
exports.PaymentOrderService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class PaymentOrderService {
    // Obtener cotización por ID para validación
    static getQuoteById(quoteId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('💳 PaymentOrderService: Obteniendo cotización para validación:', quoteId);
                const quote = yield prisma.quote.findUnique({
                    where: { id: quoteId },
                    select: {
                        id: true,
                        buyerId: true,
                        supplierId: true
                    }
                });
                return quote;
            }
            catch (error) {
                console.error('❌ PaymentOrderService: Error obteniendo cotización:', error);
                throw error;
            }
        });
    }
    // Crear una nueva orden de pago
    static createPaymentOrder(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('💳 PaymentOrderService: Creando orden de pago para cotización', data.quoteId);
                // Generar número de orden único
                const orderNumber = `PO-${Date.now()}`;
                // Calcular fecha de expiración (24 horas)
                const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
                const paymentOrder = yield prisma.paymentOrder.create({
                    data: {
                        orderNumber,
                        quoteId: data.quoteId,
                        buyerId: data.buyerId,
                        totalAmount: data.totalAmount,
                        currency: data.currency,
                        paymentMethod: data.paymentMethod,
                        paymentStatus: 'PENDING',
                        expiresAt
                    },
                    include: {
                        quote: {
                            include: {
                                buyer: {
                                    select: {
                                        id: true,
                                        companyName: true,
                                        email: true,
                                        contactName: true
                                    }
                                },
                                supplier: {
                                    select: {
                                        id: true,
                                        companyName: true,
                                        email: true,
                                        contactName: true
                                    }
                                },
                                quoteItems: true,
                                freightQuote: true
                            }
                        }
                    }
                });
                console.log('✅ PaymentOrderService: Orden de pago creada exitosamente:', paymentOrder.orderNumber);
                return paymentOrder;
            }
            catch (error) {
                console.error('❌ PaymentOrderService: Error creando orden de pago:', error);
                throw error;
            }
        });
    }
    // Obtener orden de pago por ID
    static getPaymentOrderById(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('💳 PaymentOrderService: Obteniendo orden de pago', orderId);
                const paymentOrder = yield prisma.paymentOrder.findUnique({
                    where: { id: orderId },
                    include: {
                        quote: {
                            include: {
                                buyer: {
                                    select: {
                                        id: true,
                                        companyName: true,
                                        email: true,
                                        contactName: true
                                    }
                                },
                                supplier: {
                                    select: {
                                        id: true,
                                        companyName: true,
                                        email: true,
                                        contactName: true
                                    }
                                },
                                quoteItems: true,
                                freightQuote: true
                            }
                        }
                    }
                });
                console.log('✅ PaymentOrderService: Orden de pago obtenida:', paymentOrder ? paymentOrder.orderNumber : 'no encontrada');
                return paymentOrder;
            }
            catch (error) {
                console.error('❌ PaymentOrderService: Error obteniendo orden de pago:', error);
                throw error;
            }
        });
    }
    // Obtener orden de pago por número de orden
    static getPaymentOrderByNumber(orderNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('💳 PaymentOrderService: Obteniendo orden de pago por número', orderNumber);
                const paymentOrder = yield prisma.paymentOrder.findUnique({
                    where: { orderNumber },
                    include: {
                        quote: {
                            include: {
                                buyer: {
                                    select: {
                                        id: true,
                                        companyName: true,
                                        email: true,
                                        contactName: true
                                    }
                                },
                                supplier: {
                                    select: {
                                        id: true,
                                        companyName: true,
                                        email: true,
                                        contactName: true
                                    }
                                },
                                quoteItems: true,
                                freightQuote: true
                            }
                        }
                    }
                });
                console.log('✅ PaymentOrderService: Orden de pago obtenida:', paymentOrder ? paymentOrder.orderNumber : 'no encontrada');
                return paymentOrder;
            }
            catch (error) {
                console.error('❌ PaymentOrderService: Error obteniendo orden de pago:', error);
                throw error;
            }
        });
    }
    // Obtener orden de pago por ID de cotización
    static getPaymentOrderByQuoteId(quoteId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('💳 PaymentOrderService: Obteniendo orden de pago por ID de cotización', quoteId);
                const paymentOrder = yield prisma.paymentOrder.findFirst({
                    where: { quoteId },
                    include: {
                        quote: {
                            include: {
                                buyer: {
                                    select: {
                                        id: true,
                                        companyName: true,
                                        email: true,
                                        contactName: true
                                    }
                                },
                                supplier: {
                                    select: {
                                        id: true,
                                        companyName: true,
                                        email: true,
                                        contactName: true
                                    }
                                },
                                quoteItems: true,
                                freightQuote: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' } // Tomar la más reciente si hay múltiples
                });
                console.log('✅ PaymentOrderService: Orden de pago obtenida por cotización:', paymentOrder ? paymentOrder.orderNumber : 'no encontrada');
                return paymentOrder;
            }
            catch (error) {
                console.error('❌ PaymentOrderService: Error obteniendo orden de pago por cotización:', error);
                throw error;
            }
        });
    }
    // Actualizar estado de pago
    static updatePaymentStatus(orderId, status, paypalData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('💳 PaymentOrderService: Actualizando estado de pago', orderId, status);
                const updateData = {
                    paymentStatus: status,
                    updatedAt: new Date()
                };
                if (status === 'COMPLETED') {
                    updateData.paidAt = new Date();
                }
                if (paypalData) {
                    if (paypalData.paymentId)
                        updateData.paypalPaymentId = paypalData.paymentId;
                    if (paypalData.payerId)
                        updateData.paypalPayerId = paypalData.payerId;
                    if (paypalData.token)
                        updateData.paypalToken = paypalData.token;
                }
                const paymentOrder = yield prisma.paymentOrder.update({
                    where: { id: orderId },
                    data: updateData,
                    include: {
                        quote: {
                            include: {
                                buyer: {
                                    select: {
                                        id: true,
                                        companyName: true,
                                        email: true,
                                        contactName: true
                                    }
                                },
                                supplier: {
                                    select: {
                                        id: true,
                                        companyName: true,
                                        email: true,
                                        contactName: true
                                    }
                                },
                                quoteItems: true,
                                freightQuote: true
                            }
                        }
                    }
                });
                console.log('✅ PaymentOrderService: Estado de pago actualizado:', paymentOrder.paymentStatus);
                return paymentOrder;
            }
            catch (error) {
                console.error('❌ PaymentOrderService: Error actualizando estado de pago:', error);
                throw error;
            }
        });
    }
    // Obtener órdenes de pago de un usuario
    static getUserPaymentOrders(buyerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('💳 PaymentOrderService: Obteniendo órdenes de pago del usuario', buyerId);
                const paymentOrders = yield prisma.paymentOrder.findMany({
                    where: { buyerId },
                    include: {
                        quote: {
                            include: {
                                buyer: {
                                    select: {
                                        id: true,
                                        companyName: true,
                                        email: true,
                                        contactName: true
                                    }
                                },
                                supplier: {
                                    select: {
                                        id: true,
                                        companyName: true,
                                        email: true,
                                        contactName: true
                                    }
                                },
                                quoteItems: true,
                                freightQuote: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                });
                console.log('✅ PaymentOrderService: Órdenes de pago obtenidas:', paymentOrders.length);
                return paymentOrders;
            }
            catch (error) {
                console.error('❌ PaymentOrderService: Error obteniendo órdenes de pago:', error);
                throw error;
            }
        });
    }
}
exports.PaymentOrderService = PaymentOrderService;
exports.default = PaymentOrderService;
