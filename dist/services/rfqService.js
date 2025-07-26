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
exports.RFQService = void 0;
const rfq_1 = require("../types/rfq");
const databaseService_1 = require("./databaseService");
class RFQService {
    /**
     * Crear una nueva solicitud de cotización
     */
    static createRFQ(rfqData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Obtener información del producto
                const product = yield databaseService_1.DatabaseService.getProductById(rfqData.productId);
                if (!product) {
                    throw new Error('Producto no encontrado');
                }
                // Calcular fecha límite de respuesta (5 días hábiles por defecto)
                const responseDeadline = new Date();
                responseDeadline.setDate(responseDeadline.getDate() + 5);
                // Crear el objeto RFQ
                const rfqToCreate = {
                    productId: rfqData.productId,
                    productName: product.name,
                    productDescription: product.description,
                    supplierId: product.supplierId,
                    supplierName: product.supplierName,
                    // Información del solicitante
                    requesterName: rfqData.requesterName,
                    requesterEmail: rfqData.requesterEmail,
                    requesterPhone: rfqData.requesterPhone,
                    companyName: rfqData.companyName,
                    // Detalles de la cotización
                    containerQuantity: rfqData.containerQuantity,
                    containerType: rfqData.containerType,
                    incoterm: rfqData.incoterm,
                    incotermDescription: rfq_1.INCOTERM_DESCRIPTIONS[rfqData.incoterm],
                    // Fechas
                    tentativeDeliveryDate: rfqData.tentativeDeliveryDate,
                    requestDate: new Date().toISOString(),
                    responseDeadline: responseDeadline.toISOString(),
                    // Comentarios
                    logisticsComments: rfqData.logisticsComments,
                    specialRequirements: rfqData.specialRequirements,
                    // Estado
                    status: rfq_1.RFQ_STATUS.PENDING,
                    priority: rfqData.priority || 'medium',
                    // Estimación de valor
                    estimatedValue: product.unitPrice * rfqData.containerQuantity,
                    currency: product.currency
                };
                // Guardar en la base de datos
                const newRFQ = yield databaseService_1.DatabaseService.createRFQ(rfqToCreate);
                // Crear notificación para el proveedor
                yield databaseService_1.DatabaseService.createNotification({
                    rfqId: newRFQ.id,
                    type: 'new_rfq',
                    recipientId: product.supplierId,
                    recipientType: 'supplier',
                    title: 'Nueva Solicitud de Cotización',
                    message: `Tiene una nueva solicitud de cotización para ${product.name} de ${rfqData.requesterName}`,
                    isRead: false
                });
                // Enviar email al proveedor (simulado)
                yield this.sendEmailNotification(newRFQ, 'new_rfq');
                return newRFQ;
            }
            catch (error) {
                console.error('Error creando RFQ:', error);
                throw new Error('Error al crear la solicitud de cotización');
            }
        });
    }
    /**
     * Obtener RFQ por ID
     */
    static getRFQById(rfqId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield databaseService_1.DatabaseService.getRFQById(rfqId);
        });
    }
    /**
     * Obtener todas las RFQs con filtros opcionales
     */
    static getAllRFQs(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!filters) {
                return yield databaseService_1.DatabaseService.getAllRFQs();
            }
            // Usar el servicio de búsqueda de la base de datos
            const searchCriteria = {
                status: filters.status,
                supplierId: filters.supplierId,
                productId: filters.productId,
                requesterId: filters.requesterId,
                dateFrom: filters.dateFrom,
                dateTo: filters.dateTo,
                minValue: filters.minValue,
                maxValue: filters.maxValue
            };
            let results = yield databaseService_1.DatabaseService.searchRFQs(searchCriteria);
            // Aplicar filtros adicionales que no están en la búsqueda básica
            if (filters.priority && filters.priority.length > 0) {
                results = results.filter(rfq => filters.priority.includes(rfq.priority));
            }
            if (filters.containerType && filters.containerType.length > 0) {
                results = results.filter(rfq => filters.containerType.includes(rfq.containerType));
            }
            if (filters.incoterm && filters.incoterm.length > 0) {
                results = results.filter(rfq => filters.incoterm.includes(rfq.incoterm));
            }
            // Ordenar por fecha de creación (más recientes primero)
            return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        });
    }
    /**
     * Actualizar una RFQ
     */
    static updateRFQ(rfqId, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentRFQ = yield databaseService_1.DatabaseService.getRFQById(rfqId);
            if (!currentRFQ) {
                return null;
            }
            const updatedRFQ = yield databaseService_1.DatabaseService.updateRFQ(rfqId, updates);
            if (!updatedRFQ) {
                return null;
            }
            // Crear notificación si hay cambio de estado
            if (updates.status && updates.status !== currentRFQ.status) {
                yield databaseService_1.DatabaseService.createNotification({
                    rfqId: rfqId,
                    type: 'rfq_response',
                    recipientId: currentRFQ.requesterId || currentRFQ.requesterEmail,
                    recipientType: 'buyer',
                    title: 'Actualización de Cotización',
                    message: `Su solicitud de cotización ${rfqId} ha sido actualizada a: ${updates.status}`,
                    isRead: false
                });
            }
            return updatedRFQ;
        });
    }
    /**
     * Responder a una RFQ (por parte del proveedor)
     */
    static respondToRFQ(rfqId, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const rfq = yield this.getRFQById(rfqId);
            if (!rfq) {
                return null;
            }
            // Crear la respuesta completa
            const validUntil = new Date();
            validUntil.setDate(validUntil.getDate() + (response.validityPeriod || 30));
            const fullResponse = Object.assign(Object.assign({}, response), { rfqId, responseDate: new Date().toISOString(), validUntil: validUntil.toISOString() });
            // Actualizar la RFQ con la respuesta
            const updatedRFQ = yield this.updateRFQ(rfqId, {
                status: 'quoted',
                supplierResponse: fullResponse
            });
            if (updatedRFQ) {
                // Notificar al comprador
                yield databaseService_1.DatabaseService.createNotification({
                    rfqId: rfqId,
                    type: 'rfq_response',
                    recipientId: updatedRFQ.requesterId || updatedRFQ.requesterEmail,
                    recipientType: 'buyer',
                    title: 'Cotización Recibida',
                    message: `Ha recibido una cotización para ${updatedRFQ.productName} por $${fullResponse.totalPrice} ${fullResponse.currency}`,
                    isRead: false
                });
                // Enviar email de notificación
                yield this.sendEmailNotification(updatedRFQ, 'rfq_response');
            }
            return updatedRFQ;
        });
    }
    /**
     * Eliminar una RFQ
     */
    static deleteRFQ(rfqId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield databaseService_1.DatabaseService.deleteRFQ(rfqId);
        });
    }
    /**
     * Obtener estadísticas de RFQs
     */
    static getRFQStats(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const rfqs = yield this.getAllRFQs(filters);
            const stats = {
                total: rfqs.length,
                pending: rfqs.filter(r => r.status === 'pending').length,
                quoted: rfqs.filter(r => r.status === 'quoted').length,
                accepted: rfqs.filter(r => r.status === 'accepted').length,
                rejected: rfqs.filter(r => r.status === 'rejected').length,
                expired: rfqs.filter(r => r.status === 'expired').length,
                averageResponseTime: this.calculateAverageResponseTime(rfqs),
                totalValue: rfqs.reduce((sum, rfq) => sum + (rfq.estimatedValue || 0), 0),
                currency: 'USD'
            };
            return stats;
        });
    }
    /**
     * Obtener notificaciones por usuario
     */
    static getNotifications(userId, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield databaseService_1.DatabaseService.getNotificationsByUser(userId, userType);
        });
    }
    /**
     * Marcar notificación como leída
     */
    static markNotificationAsRead(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield databaseService_1.DatabaseService.markNotificationAsRead(notificationId);
        });
    }
    /**
     * Calcular tiempo promedio de respuesta
     */
    static calculateAverageResponseTime(rfqs) {
        const respondedRFQs = rfqs.filter(rfq => { var _a; return (_a = rfq.supplierResponse) === null || _a === void 0 ? void 0 : _a.responseDate; });
        if (respondedRFQs.length === 0)
            return 0;
        const totalHours = respondedRFQs.reduce((sum, rfq) => {
            const requestTime = new Date(rfq.createdAt).getTime();
            const responseTime = new Date(rfq.supplierResponse.responseDate).getTime();
            return sum + (responseTime - requestTime) / (1000 * 60 * 60); // convertir a horas
        }, 0);
        return Math.round(totalHours / respondedRFQs.length);
    }
    /**
     * Enviar notificación por email (simulado)
     */
    static sendEmailNotification(rfq, type) {
        return __awaiter(this, void 0, void 0, function* () {
            // En producción, aquí se integraría con un servicio de email como SendGrid, AWS SES, etc.
            console.log(`📧 Email enviado - Tipo: ${type}, RFQ: ${rfq.id}`);
            if (type === 'new_rfq') {
                console.log(`📧 Notificando al proveedor ${rfq.supplierName} sobre nueva RFQ`);
            }
            else if (type === 'rfq_response') {
                console.log(`📧 Notificando al comprador ${rfq.requesterEmail} sobre respuesta de RFQ`);
            }
        });
    }
    /**
     * Verificar y marcar RFQs expiradas
     */
    static checkExpiredRFQs() {
        return __awaiter(this, void 0, void 0, function* () {
            const allRFQs = yield databaseService_1.DatabaseService.getAllRFQs();
            const now = new Date();
            let expiredCount = 0;
            for (const rfq of allRFQs) {
                if (rfq.status === 'pending' && new Date(rfq.responseDeadline) < now) {
                    yield this.updateRFQ(rfq.id, { status: 'expired' });
                    expiredCount++;
                    // Notificar sobre expiración
                    yield databaseService_1.DatabaseService.createNotification({
                        rfqId: rfq.id,
                        type: 'rfq_expired',
                        recipientId: rfq.requesterId || rfq.requesterEmail,
                        recipientType: 'buyer',
                        title: 'Cotización Expirada',
                        message: `Su solicitud de cotización ${rfq.id} ha expirado sin respuesta`,
                        isRead: false
                    });
                }
            }
            return expiredCount;
        });
    }
}
exports.RFQService = RFQService;
