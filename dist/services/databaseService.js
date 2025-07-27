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
exports.DatabaseService = void 0;
const rfq_1 = require("../types/rfq");
// Base de datos en memoria (simulada)
const database = {
    rfqs: [],
    notifications: [],
    products: [
        {
            id: 'prod_1',
            name: 'Blusas de manga larga casuales',
            description: '4500 blusas algodón premium de manga larga, diseño casual elegante. Perfectas para distribuidores que buscan prendas versátiles y de calidad. Incluye variedad de tallas y colores populares.',
            supplierId: 'supplier_1',
            supplierName: 'Demo Compradora S.A.',
            containerType: '20GP',
            moq: 1,
            unitPrice: 18000,
            currency: 'USD',
            category: 'Textiles',
            stockContainers: 25,
            imageUrl: '/api/placeholder/400/300'
        },
        {
            id: 'prod_2',
            name: 'Electrónicos Smart TV 55"',
            description: 'Smart TV LED 4K Ultra HD de 55 pulgadas con sistema Android TV integrado.',
            supplierId: 'supplier_2',
            supplierName: 'TechSupply Global Ltd.',
            containerType: '40GP',
            moq: 2,
            unitPrice: 450000,
            currency: 'USD',
            category: 'Electrónicos',
            stockContainers: 15
        },
        {
            id: 'prod_3',
            name: 'Equipos de Construcción',
            description: 'Herramientas y equipos para construcción de alta calidad.',
            supplierId: 'supplier_3',
            supplierName: 'BuildPro Industries',
            containerType: '40HC',
            moq: 1,
            unitPrice: 85000,
            currency: 'USD',
            category: 'Construcción',
            stockContainers: 8
        }
    ],
    suppliers: [
        {
            id: 'supplier_1',
            name: 'Demo Compradora S.A.',
            email: 'ventas@democompradora.com',
            phone: '+57 300 123 4567',
            country: 'Colombia',
            verified: true,
            rating: 4.8,
            totalRFQs: 156,
            averageResponseTime: 18
        },
        {
            id: 'supplier_2',
            name: 'TechSupply Global Ltd.',
            email: 'rfq@techsupply.com',
            phone: '+86 138 0013 8000',
            country: 'China',
            verified: true,
            rating: 4.6,
            totalRFQs: 203,
            averageResponseTime: 24
        },
        {
            id: 'supplier_3',
            name: 'BuildPro Industries',
            email: 'quotes@buildpro.com',
            phone: '+1 555 987 6543',
            country: 'USA',
            verified: true,
            rating: 4.9,
            totalRFQs: 89,
            averageResponseTime: 12
        }
    ]
};
// Contadores para IDs únicos
let nextRFQId = 1;
let nextNotificationId = 1;
class DatabaseService {
    /**
     * Obtener todos los productos (para debugging)
     */
    static getAllProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            return database.products;
        });
    }
    /**
     * Obtener información de producto por ID
     */
    static getProductById(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('🔍 DatabaseService: Buscando producto con ID:', productId);
            console.log('🗄️ DatabaseService: Productos disponibles:', database.products.map(p => ({ id: p.id, name: p.name })));
            const product = database.products.find(product => product.id === productId) || null;
            console.log('📦 DatabaseService: Producto encontrado:', product);
            return product;
        });
    }
    /**
     * Obtener información de proveedor por ID
     */
    static getSupplierById(supplierId) {
        return __awaiter(this, void 0, void 0, function* () {
            return database.suppliers.find(supplier => supplier.id === supplierId) || null;
        });
    }
    /**
     * Crear una nueva RFQ en la base de datos
     */
    static createRFQ(rfqData) {
        return __awaiter(this, void 0, void 0, function* () {
            const rfqId = `RFQ-${Date.now()}-${nextRFQId++}`;
            const newRFQ = Object.assign(Object.assign({}, rfqData), { id: rfqId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
            console.log('💾 DatabaseService.createRFQ: Guardando nueva RFQ:', newRFQ);
            database.rfqs.push(newRFQ);
            console.log('💾 DatabaseService.createRFQ: Total RFQs después de guardar:', database.rfqs.length);
            console.log('💾 DatabaseService.createRFQ: Última RFQ guardada:', database.rfqs[database.rfqs.length - 1]);
            // Actualizar estadísticas del proveedor
            const supplier = yield this.getSupplierById(newRFQ.supplierId);
            if (supplier) {
                supplier.totalRFQs += 1;
            }
            return newRFQ;
        });
    }
    /**
     * Obtener RFQ por ID
     */
    static getRFQById(rfqId) {
        return __awaiter(this, void 0, void 0, function* () {
            return database.rfqs.find(rfq => rfq.id === rfqId) || null;
        });
    }
    /**
     * Obtener todas las RFQs
     */
    static getAllRFQs() {
        return __awaiter(this, void 0, void 0, function* () {
            return [...database.rfqs];
        });
    }
    /**
     * Actualizar RFQ
     */
    static updateRFQ(rfqId, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            const rfqIndex = database.rfqs.findIndex(rfq => rfq.id === rfqId);
            if (rfqIndex === -1) {
                return null;
            }
            const updatedRFQ = Object.assign(Object.assign(Object.assign({}, database.rfqs[rfqIndex]), updates), { updatedAt: new Date().toISOString() });
            database.rfqs[rfqIndex] = updatedRFQ;
            return updatedRFQ;
        });
    }
    /**
     * Eliminar RFQ
     */
    static deleteRFQ(rfqId) {
        return __awaiter(this, void 0, void 0, function* () {
            const initialLength = database.rfqs.length;
            database.rfqs = database.rfqs.filter(rfq => rfq.id !== rfqId);
            return database.rfqs.length < initialLength;
        });
    }
    /**
     * Crear notificación
     */
    static createNotification(notificationData) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = Object.assign(Object.assign({}, notificationData), { id: `NOTIF-${nextNotificationId++}`, createdAt: new Date().toISOString() });
            database.notifications.push(notification);
            return notification;
        });
    }
    /**
     * Obtener notificaciones por usuario
     */
    static getNotificationsByUser(userId, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            return database.notifications
                .filter(notification => notification.recipientId === userId &&
                notification.recipientType === userType)
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        });
    }
    /**
     * Marcar notificación como leída
     */
    static markNotificationAsRead(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = database.notifications.find(n => n.id === notificationId);
            if (notification) {
                notification.isRead = true;
                return true;
            }
            return false;
        });
    }
    /**
     * Obtener estadísticas de la base de datos
     */
    static getDatabaseStats() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                totalRFQs: database.rfqs.length,
                totalProducts: database.products.length,
                totalSuppliers: database.suppliers.length,
                totalNotifications: database.notifications.length,
                pendingRFQs: database.rfqs.filter(rfq => rfq.status === rfq_1.RFQ_STATUS.PENDING).length,
                quotedRFQs: database.rfqs.filter(rfq => rfq.status === rfq_1.RFQ_STATUS.QUOTED).length,
                acceptedRFQs: database.rfqs.filter(rfq => rfq.status === rfq_1.RFQ_STATUS.ACCEPTED).length,
                rejectedRFQs: database.rfqs.filter(rfq => rfq.status === rfq_1.RFQ_STATUS.REJECTED).length,
                expiredRFQs: database.rfqs.filter(rfq => rfq.status === rfq_1.RFQ_STATUS.EXPIRED).length
            };
        });
    }
    /**
     * Buscar RFQs por criterios múltiples
     */
    static searchRFQs(criteria) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('🔍 DatabaseService.searchRFQs: Criterios de búsqueda:', criteria);
            console.log('🔍 DatabaseService.searchRFQs: Total RFQs en base de datos:', database.rfqs.length);
            console.log('🔍 DatabaseService.searchRFQs: RFQs existentes:', database.rfqs.map(rfq => ({ id: rfq.id, requesterId: rfq.requesterId })));
            let results = [...database.rfqs];
            if (criteria.status) {
                console.log('🔍 Filtrando por status:', criteria.status);
                results = results.filter(rfq => criteria.status.includes(rfq.status));
                console.log('🔍 Después de filtrar por status:', results.length);
            }
            if (criteria.supplierId) {
                console.log('🔍 Filtrando por supplierId:', criteria.supplierId);
                results = results.filter(rfq => rfq.supplierId === criteria.supplierId);
                console.log('🔍 Después de filtrar por supplierId:', results.length);
            }
            if (criteria.productId) {
                console.log('🔍 Filtrando por productId:', criteria.productId);
                results = results.filter(rfq => rfq.productId === criteria.productId);
                console.log('🔍 Después de filtrar por productId:', results.length);
            }
            if (criteria.requesterId) {
                console.log('🔍 Filtrando por requesterId:', criteria.requesterId);
                console.log('🔍 RFQs antes del filtro:', results.map(rfq => ({ id: rfq.id, requesterId: rfq.requesterId })));
                results = results.filter(rfq => rfq.requesterId === criteria.requesterId);
                console.log('🔍 Después de filtrar por requesterId:', results.length);
                console.log('🔍 RFQs que pasaron el filtro:', results.map(rfq => ({ id: rfq.id, requesterId: rfq.requesterId })));
            }
            if (criteria.dateFrom) {
                const fromDate = new Date(criteria.dateFrom);
                results = results.filter(rfq => new Date(rfq.requestDate) >= fromDate);
            }
            if (criteria.dateTo) {
                const toDate = new Date(criteria.dateTo);
                results = results.filter(rfq => new Date(rfq.requestDate) <= toDate);
            }
            if (criteria.minValue !== undefined) {
                results = results.filter(rfq => (rfq.estimatedValue || 0) >= criteria.minValue);
            }
            if (criteria.maxValue !== undefined) {
                results = results.filter(rfq => (rfq.estimatedValue || 0) <= criteria.maxValue);
            }
            return results;
        });
    }
    /**
     * Obtener todos los proveedores
     */
    static getAllSuppliers() {
        return __awaiter(this, void 0, void 0, function* () {
            return [...database.suppliers];
        });
    }
    /**
     * Limpiar base de datos (para testing)
     */
    static clearDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            database.rfqs = [];
            database.notifications = [];
            nextRFQId = 1;
            nextNotificationId = 1;
        });
    }
    /**
     * Obtener datos de la base de datos para backup
     */
    static exportDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                rfqs: [...database.rfqs],
                notifications: [...database.notifications],
                products: [...database.products],
                suppliers: [...database.suppliers]
            };
        });
    }
    /**
     * Restaurar base de datos desde backup
     */
    static importDatabase(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.rfqs)
                database.rfqs = [...data.rfqs];
            if (data.notifications)
                database.notifications = [...data.notifications];
            if (data.products)
                database.products = [...data.products];
            if (data.suppliers)
                database.suppliers = [...data.suppliers];
        });
    }
}
exports.DatabaseService = DatabaseService;
