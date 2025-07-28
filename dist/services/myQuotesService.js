"use strict";
// ================================================================
// SERVICIO DE INTEGRACIÓN MY QUOTES SIMPLIFICADO - ZLCExpress
// ================================================================
// Descripción: Servicio simplificado para conectar cotizaciones con frontend My Quotes
// Fecha: 2025-07-27
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyQuotesService = void 0;
const client_1 = require("@prisma/client");
const quoteService_1 = __importDefault(require("./quoteService"));
const prisma = new client_1.PrismaClient();
class MyQuotesService {
    /**
     * Obtener cotizaciones para My Quotes (formato frontend)
     */
    static getMyQuotes(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('🔄 MyQuotesService: Obteniendo cotizaciones para usuario:', userId);
                // Obtener cotizaciones directamente de Prisma con toda la información
                const quotes = yield prisma.quote.findMany({
                    where: {
                        OR: [
                            { buyerId: userId },
                            { supplierId: userId }
                        ]
                    },
                    include: {
                        buyer: {
                            select: { id: true, companyName: true, email: true }
                        },
                        supplier: {
                            select: { id: true, companyName: true, email: true }
                        },
                        product: {
                            select: { title: true, supplier: { select: { companyName: true } } }
                        },
                        quoteItems: true,
                        freightQuote: {
                            select: {
                                cost: true,
                                currency: true,
                                originPort: true,
                                destinationPort: true,
                                carrier: true,
                                transitTime: true,
                                estimatedArrival: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                });
                console.log(`📊 MyQuotesService: ${quotes.length} cotizaciones encontradas en BD`);
                // Convertir formato de BD a formato frontend
                const myQuotes = quotes.map((quote) => {
                    var _a, _b, _c;
                    console.log(`🔍 Procesando cotización ${quote.quoteNumber}:`, {
                        id: quote.id,
                        productTitle: quote.productTitle,
                        supplier: (_a = quote.supplier) === null || _a === void 0 ? void 0 : _a.companyName,
                        totalPrice: quote.totalPrice,
                        paymentTerms: quote.paymentTerms,
                        freightQuote: quote.freightQuote,
                        quoteItems: ((_b = quote.quoteItems) === null || _b === void 0 ? void 0 : _b.length) || 0
                    });
                    // Preparar items con datos reales
                    const items = quote.quoteItems && quote.quoteItems.length > 0
                        ? quote.quoteItems.map((item, index) => {
                            var _a;
                            return ({
                                id: (index + 1).toString(),
                                productTitle: item.itemDescription || quote.productTitle || 'Producto sin nombre',
                                supplier: ((_a = quote.supplier) === null || _a === void 0 ? void 0 : _a.companyName) || 'Proveedor no especificado',
                                quantity: item.quantity || quote.containerQuantity || 1,
                                pricePerContainer: item.unitPrice ? parseFloat(item.unitPrice.toString()) : 0
                            });
                        })
                        : [{
                                id: '1',
                                productTitle: quote.productTitle || 'Producto sin nombre',
                                supplier: ((_c = quote.supplier) === null || _c === void 0 ? void 0 : _c.companyName) || 'Proveedor no especificado',
                                quantity: quote.containerQuantity || 1,
                                pricePerContainer: quote.unitPrice ? parseFloat(quote.unitPrice.toString()) :
                                    (quote.totalPrice ? parseFloat(quote.totalPrice.toString()) / (quote.containerQuantity || 1) : 0)
                            }];
                    // Mapear estados de BD a estados de frontend
                    const statusMap = {
                        'PENDING': 'pending',
                        'DRAFT': 'pending',
                        'SENT': 'pending',
                        'QUOTED': 'counter-offer',
                        'COUNTER_OFFER': 'counter-offer',
                        'ACCEPTED': 'accepted',
                        'REJECTED': 'rejected',
                        'EXPIRED': 'expired',
                        'CANCELLED': 'rejected'
                    };
                    const myQuote = {
                        id: quote.id.toString(),
                        items: items,
                        totalAmount: quote.totalPrice ? parseFloat(quote.totalPrice.toString()) : 0,
                        status: statusMap[quote.status] || 'pending',
                        sentAt: quote.createdAt || new Date(),
                        updatedAt: quote.updatedAt || new Date(),
                        paymentConditions: quote.paymentTerms || 'Condiciones no especificadas',
                        supplierResponse: quote.supplierComments || '',
                        quoteNumber: quote.quoteNumber,
                        containerType: quote.containerType,
                        incoterm: quote.incoterm || undefined,
                        leadTime: quote.leadTime || undefined,
                        validUntil: quote.validUntil || undefined,
                        // Agregar información de flete
                        freightInfo: quote.freightQuote ? {
                            cost: parseFloat(quote.freightQuote.cost.toString()),
                            currency: quote.freightQuote.currency,
                            origin: quote.freightQuote.originPort,
                            destination: quote.freightQuote.destinationPort,
                            carrier: quote.freightQuote.carrier,
                            transitTime: quote.freightQuote.transitTime,
                            estimatedDate: quote.freightQuote.estimatedArrival
                        } : undefined
                    };
                    return myQuote;
                });
                console.log('✅ MyQuotesService: Cotizaciones convertidas al formato frontend');
                return myQuotes;
            }
            catch (error) {
                console.error('❌ MyQuotesService: Error obteniendo cotizaciones:', error);
                throw new Error('Error al obtener cotizaciones para My Quotes');
            }
        });
    }
    /**
     * Obtener estadísticas para My Quotes
     */
    static getMyQuotesStats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('🔄 MyQuotesService: Calculando estadísticas para usuario:', userId);
                const stats = yield quoteService_1.default.getQuoteStats(userId);
                // Convertir a formato esperado por frontend
                const myQuotesStats = {
                    all: stats.total || 0,
                    pending: stats.pending || 0,
                    accepted: stats.approved || 0,
                    'counter-offer': 0, // No implementado aún
                    rejected: stats.rejected || 0,
                    totalValue: 0 // Calcular después
                };
                console.log('✅ MyQuotesService: Estadísticas calculadas:', myQuotesStats);
                return myQuotesStats;
            }
            catch (error) {
                console.error('❌ MyQuotesService: Error calculando estadísticas:', error);
                throw new Error('Error al calcular estadísticas');
            }
        });
    }
    /**
     * Crear cotización directamente desde frontend
     */
    static createQuoteFromFrontend(userId, quoteData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('🔄 MyQuotesService: Creando cotización desde frontend:', quoteData);
                const quote = yield quoteService_1.default.createQuote(userId, {
                    totalAmount: quoteData.totalAmount || 0,
                    notes: quoteData.notes || '',
                    items: quoteData.items || [],
                    freightDetails: quoteData.freightDetails
                });
                console.log('✅ MyQuotesService: Cotización creada desde frontend');
                return quote;
            }
            catch (error) {
                console.error('❌ MyQuotesService: Error creando cotización desde frontend:', error);
                throw new Error('Error creando cotización');
            }
        });
    }
}
exports.MyQuotesService = MyQuotesService;
exports.default = MyQuotesService;
