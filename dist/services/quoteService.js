"use strict";
// services/quoteService.ts
// Servicio para manejar cotizaciones con PostgreSQL
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
exports.QuoteService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class QuoteService {
    // Crear una nueva cotización desde el carrito
    static createQuote(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                console.log('📝 QuoteService: Creando cotización para usuario', userId);
                console.log('📦 Datos recibidos:', JSON.stringify(data, null, 2));
                console.log('🚢 FreightDetails recibidos:', data.freightDetails ? 'SÍ' : 'NO', data.freightDetails);
                // 1. Verificar/crear usuario buyer
                console.log('👤 Verificando/creando usuario buyer...');
                let buyer = yield prisma.user.findUnique({
                    where: { id: userId }
                });
                if (!buyer) {
                    console.log('👤 Usuario buyer no encontrado, creando uno nuevo...');
                    buyer = yield prisma.user.create({
                        data: {
                            id: userId,
                            email: `buyer${userId}@zlcexpress.com`,
                            password: 'temp_password',
                            companyName: `Empresa Compradora ${userId}`,
                            taxId: `TAX${userId}`,
                            operationCountry: 'Panama',
                            industry: 'Import/Export',
                            contactName: `Usuario ${userId}`,
                            contactPosition: 'Comprador',
                            contactPhone: '+507-1234-5678',
                            fiscalAddress: 'Zona Libre de Colón, Panamá',
                            country: 'Panama',
                            state: 'Colón',
                            city: 'Colón',
                            postalCode: '12345',
                            userType: 'BUYER'
                        }
                    });
                    console.log('✅ Usuario buyer creado:', buyer.id);
                }
                else {
                    console.log('✅ Usuario buyer encontrado:', buyer.id);
                }
                // 2. Verificar/crear usuario supplier
                console.log('🏭 Verificando/creando usuario supplier...');
                let supplier = yield prisma.user.findFirst({
                    where: { userType: 'SUPPLIER' }
                });
                if (!supplier) {
                    console.log('🏭 Usuario supplier no encontrado, creando uno nuevo...');
                    supplier = yield prisma.user.create({
                        data: {
                            email: 'supplier@zlcexpress.com',
                            password: 'temp_password',
                            companyName: 'Proveedor ZLC Express',
                            taxId: 'SUP001',
                            operationCountry: 'Panama',
                            industry: 'Manufacturing',
                            contactName: 'Proveedor Principal',
                            contactPosition: 'Gerente de Ventas',
                            contactPhone: '+507-8765-4321',
                            fiscalAddress: 'Zona Libre de Colón, Panamá',
                            country: 'Panama',
                            state: 'Colón',
                            city: 'Colón',
                            postalCode: '12345',
                            userType: 'SUPPLIER'
                        }
                    });
                    console.log('✅ Usuario supplier creado:', supplier.id);
                }
                else {
                    console.log('✅ Usuario supplier encontrado:', supplier.id);
                }
                // 3. Generar número de cotización único
                const quoteNumber = `Q-${Date.now()}`;
                console.log('📋 Número de cotización generado:', quoteNumber);
                // 4. Calcular containerQuantity de forma segura
                const containerQuantity = Math.max(1, Math.floor(data.totalAmount / 10000)) || 1;
                console.log('📦 Container quantity calculado:', containerQuantity);
                // 5. Crear la cotización principal
                console.log('💾 Creando cotización en base de datos...');
                console.log('💰 PaymentConditions que se van a guardar:', data.paymentConditions);
                const quote = yield prisma.quote.create({
                    data: {
                        quoteNumber,
                        buyerId: buyer.id,
                        supplierId: supplier.id,
                        productTitle: 'Cotización desde carrito',
                        containerQuantity: containerQuantity,
                        containerType: '40GP',
                        totalPrice: data.totalAmount,
                        currency: 'USD',
                        status: 'PENDING',
                        paymentTerms: data.paymentConditions || 'Net 30 days',
                        logisticsComments: data.notes || 'Cotización generada desde carrito',
                        estimatedValue: data.totalAmount
                        // ✅ Información del archivo de orden de compra - PENDIENTE DE SCHEMA
                        // purchaseOrderFileName: data.purchaseOrderFile?.name,
                        // purchaseOrderFileUrl: data.purchaseOrderFile?.url,
                        // purchaseOrderFileSize: data.purchaseOrderFile?.size,
                        // purchaseOrderFileType: data.purchaseOrderFile?.type
                    },
                    include: {
                        buyer: {
                            select: { id: true, companyName: true, email: true }
                        },
                        supplier: {
                            select: { id: true, companyName: true, email: true }
                        }
                    }
                });
                console.log('✅ Cotización creada exitosamente:', quote.id);
                console.log('🔍 CHECKPOINT 1: Antes de verificar freightDetails');
                // 5.5. Crear ShippingQuote si hay información de flete
                let freightQuoteId = null;
                console.log('🚢 VERIFICANDO freightDetails:', {
                    exists: !!data.freightDetails,
                    data: data.freightDetails
                });
                console.log('🔍 CHECKPOINT 2: Después de verificar freightDetails');
                if (data.freightDetails) {
                    console.log('🚢 Entrando a crear cotización de flete...');
                    console.log('🔍 CHECKPOINT 3: Dentro del if de freightDetails');
                    try {
                        console.log('🚢 Creando ShippingQuote con datos:', {
                            userId: buyer.id,
                            originPort: data.freightDetails.origin,
                            destinationPort: data.freightDetails.destination,
                            cost: data.freightDetails.cost,
                            carrier: data.freightDetails.carrier
                        });
                        console.log('🔍 CHECKPOINT 4: Antes de prisma.shippingQuote.create');
                        const shippingQuote = yield prisma.shippingQuote.create({
                            data: {
                                userId: buyer.id,
                                originPort: data.freightDetails.origin || 'Puerto de origen',
                                destinationPort: data.freightDetails.destination || 'Puerto de destino',
                                containerType: '40GP',
                                containerCount: containerQuantity,
                                carrier: data.freightDetails.carrier || 'Transportista estándar',
                                carrierCode: 'STD',
                                serviceType: 'Standard Service',
                                cost: data.freightDetails.cost || 0, // Usar solo el costo de freightDetails
                                currency: data.freightDetails.currency || 'USD',
                                transitTime: data.freightDetails.transitTime || 30,
                                estimatedDeparture: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días desde ahora
                                estimatedArrival: new Date(Date.now() + (data.freightDetails.transitTime || 30) * 24 * 60 * 60 * 1000),
                                validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días de validez
                                incoterm: 'FOB',
                                isSelected: true,
                                status: 'PENDING'
                            }
                        });
                        console.log('🔍 CHECKPOINT 5: Después de crear ShippingQuote');
                        freightQuoteId = shippingQuote.id;
                        console.log('✅ Cotización de flete creada:', shippingQuote.id);
                        console.log('🔍 CHECKPOINT 6: Antes de actualizar Quote');
                        // Actualizar la cotización principal con el freightQuoteId
                        yield prisma.quote.update({
                            where: { id: quote.id },
                            data: { freightQuoteId: freightQuoteId }
                        });
                        console.log('✅ Cotización actualizada con freightQuoteId:', freightQuoteId);
                        console.log('🔍 CHECKPOINT 7: Después de actualizar Quote');
                    }
                    catch (shippingError) {
                        console.error('❌ ERROR creando ShippingQuote:', shippingError);
                        if (shippingError instanceof Error) {
                            console.error('Stack trace:', shippingError.stack);
                        }
                    }
                }
                else {
                    console.log('⚠️ No hay freightDetails - saltando creación de ShippingQuote');
                    console.log('🔍 CHECKPOINT 8: En el else de freightDetails');
                }
                // 6. Crear items individuales de la cotización desde el carrito
                console.log('📦 Procesando items del carrito:', ((_a = data.items) === null || _a === void 0 ? void 0 : _a.length) || 0);
                console.log('🔍 DEBUG - Datos completos recibidos:', JSON.stringify(data, null, 2));
                let quoteItems = [];
                if (data.items && data.items.length > 0) {
                    // Crear un item por cada producto del carrito
                    for (const item of data.items) {
                        console.log('🔍 DEBUG - Item individual:', JSON.stringify(item, null, 2));
                        // Obtener información completa del producto desde la base de datos
                        let productInfo = null;
                        if (item.productId) {
                            try {
                                productInfo = yield prisma.product.findUnique({
                                    where: { id: parseInt(item.productId.toString()) },
                                    include: {
                                        supplier: true
                                    }
                                });
                                console.log('📋 Producto encontrado en DB:', productInfo === null || productInfo === void 0 ? void 0 : productInfo.title);
                            }
                            catch (error) {
                                console.log('⚠️ Error buscando producto:', error);
                            }
                        }
                        // Usar información real del producto o fallback a datos del item
                        const productTitle = (productInfo === null || productInfo === void 0 ? void 0 : productInfo.title) || item.productTitle || item.productName || 'Producto sin título';
                        const supplierName = ((_b = productInfo === null || productInfo === void 0 ? void 0 : productInfo.supplier) === null || _b === void 0 ? void 0 : _b.companyName) || item.supplier || item.supplierName || 'Proveedor desconocido';
                        const pricePerContainer = item.customPrice || item.pricePerContainer || (productInfo === null || productInfo === void 0 ? void 0 : productInfo.pricePerContainer) || item.unitPrice || 0;
                        console.log('➕ Creando item con datos reales:', {
                            productTitle,
                            supplierName,
                            pricePerContainer
                        });
                        const quoteItem = yield prisma.quoteItem.create({
                            data: {
                                quoteId: quote.id,
                                productId: item.productId ? parseInt(item.productId.toString()) : null,
                                itemDescription: productTitle, // ✅ Usar nombre real del producto en itemDescription
                                quantity: item.quantity || item.containerQuantity || 1,
                                unitPrice: pricePerContainer,
                                totalPrice: (item.quantity || item.containerQuantity || 1) * pricePerContainer,
                                currency: item.currency || 'USD',
                                specifications: JSON.stringify({
                                    productTitle: productTitle, // ✅ Guardar título en specifications
                                    supplierName: supplierName, // ✅ Usar supplier real
                                    supplierId: (productInfo === null || productInfo === void 0 ? void 0 : productInfo.supplierId) || item.supplierId || supplier.id,
                                    containerType: item.containerType || '40GP',
                                    incoterm: item.incoterm || 'FOB',
                                    pricePerContainer: Number(pricePerContainer), // ✅ Usar precio real
                                    originalProductId: item.productId,
                                    customPrice: item.customPrice,
                                    notes: item.notes,
                                    realProductTitle: productTitle
                                })
                            }
                        });
                        quoteItems.push(quoteItem);
                        console.log('✅ Quote item creado:', quoteItem.id, 'para producto real:', productTitle);
                    }
                }
                else {
                    // Fallback: crear un item genérico si no hay items específicos
                    console.log('⚠️ No hay items específicos, creando item genérico');
                    const quoteItem = yield prisma.quoteItem.create({
                        data: {
                            quoteId: quote.id,
                            productId: null,
                            itemDescription: 'Productos desde carrito',
                            quantity: containerQuantity,
                            unitPrice: data.totalAmount / containerQuantity,
                            totalPrice: data.totalAmount,
                            currency: 'USD',
                            specifications: JSON.stringify({
                                productTitle: 'Productos desde carrito',
                                supplierName: supplier.companyName,
                                supplierId: supplier.id,
                                containerType: '40GP',
                                incoterm: 'FOB',
                                pricePerContainer: data.totalAmount / containerQuantity,
                            })
                        }
                    });
                    quoteItems.push(quoteItem);
                }
                console.log(`✅ ${quoteItems.length} Quote items creados exitosamente`);
                // 7. Obtener información de flete si existe
                let freightInfo = null;
                if (freightQuoteId) {
                    try {
                        freightInfo = yield prisma.shippingQuote.findUnique({
                            where: { id: freightQuoteId }
                        });
                        console.log('🚢 Información de flete obtenida:', freightInfo ? 'SÍ' : 'NO');
                    }
                    catch (error) {
                        console.error('⚠️ Error obteniendo info de flete:', error);
                    }
                }
                // 8. Formatear respuesta con información completa
                const formattedQuote = {
                    id: quote.id,
                    quoteNumber: quote.quoteNumber,
                    totalPrice: Number(quote.totalPrice),
                    status: quote.status,
                    createdAt: quote.createdAt,
                    updatedAt: quote.updatedAt,
                    logisticsComments: quote.logisticsComments || '',
                    paymentConditions: quote.paymentTerms || 'Net 30 days',
                    freightEstimate: (freightInfo === null || freightInfo === void 0 ? void 0 : freightInfo.cost) ? Number(freightInfo.cost) : 0, // ✅ Convertir Decimal a number
                    platformCommission: 250, // Comisión estándar de plataforma
                    // ✅ Información del archivo de orden de compra - PENDIENTE DE IMPLEMENTAR
                    purchaseOrderFile: data.purchaseOrderFile || undefined,
                    freightDetails: freightInfo ? {
                        id: freightInfo.id,
                        carrier: freightInfo.carrier,
                        cost: Number(freightInfo.cost), // ✅ Convertir Decimal a number
                        currency: freightInfo.currency,
                        transitTime: freightInfo.transitTime,
                        originPort: freightInfo.originPort,
                        destinationPort: freightInfo.destinationPort,
                        containerType: freightInfo.containerType,
                        containerCount: freightInfo.containerCount,
                        estimatedDeparture: freightInfo.estimatedDeparture,
                        estimatedArrival: freightInfo.estimatedArrival,
                        incoterm: freightInfo.incoterm
                    } : undefined, // ✅ Información completa de flete
                    items: quoteItems.map(item => (Object.assign(Object.assign({}, item), { unitPrice: Number(item.unitPrice), totalPrice: Number(item.totalPrice) }))),
                    buyer: quote.buyer || { id: quote.buyerId, companyName: 'N/A', email: 'N/A' },
                    user: quote.buyer || { id: quote.buyerId, companyName: 'N/A', email: 'N/A' } // Para compatibilidad con frontend
                };
                console.log('🎉 Cotización creada completamente:', {
                    id: formattedQuote.id,
                    itemsCount: formattedQuote.items.length,
                    hasFreight: !!formattedQuote.freightDetails,
                    freightCost: formattedQuote.freightEstimate
                });
                return formattedQuote;
            }
            catch (error) {
                console.error('❌ QuoteService: Error creando cotización:', error);
                throw error;
            }
        });
    }
    // Obtener cotizaciones del usuario
    static getUserQuotes(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('📋 QuoteService: Obteniendo cotizaciones para usuario', userId);
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
                        quoteItems: true,
                        freightQuote: true // ✅ Incluir información de flete
                    },
                    orderBy: { createdAt: 'desc' }
                });
                console.log('✅ QuoteService: Cotizaciones obtenidas:', quotes.length);
                // Transformar para compatibilidad con frontend
                return quotes.map((quote) => {
                    var _a;
                    console.log('🔍 PaymentTerms de la cotización desde DB:', quote.paymentTerms);
                    return {
                        id: quote.id,
                        quoteNumber: quote.quoteNumber,
                        totalPrice: quote.totalPrice ? Number(quote.totalPrice) : 0,
                        status: quote.status,
                        createdAt: quote.createdAt,
                        updatedAt: quote.updatedAt,
                        logisticsComments: quote.logisticsComments || '',
                        paymentConditions: quote.paymentTerms || 'Net 30 days',
                        freightEstimate: quote.freightQuote ? Number(quote.freightQuote.cost) : 0,
                        platformCommission: 0, // Simplificado por ahora
                        // ✅ Agregar campos de contraoferta pendiente
                        pendingCounterOfferPrice: quote.pendingCounterOfferPrice ? Number(quote.pendingCounterOfferPrice) : null,
                        pendingPaymentTerms: quote.pendingPaymentTerms || null,
                        pendingDeliveryTerms: quote.pendingDeliveryTerms || null,
                        // ✅ Incluir comentarios del proveedor
                        supplierResponse: quote.supplierComments || '',
                        supplierComments: quote.supplierComments || '',
                        // ✅ Información del archivo de orden de compra
                        purchaseOrderFile: (quote.purchaseOrderFileName || quote.purchaseOrderFileUrl) ? {
                            name: quote.purchaseOrderFileName,
                            url: quote.purchaseOrderFileUrl,
                            size: quote.purchaseOrderFileSize,
                            type: quote.purchaseOrderFileType
                        } : undefined,
                        // ✅ Incluir información completa de flete
                        freightDetails: quote.freightQuote ? {
                            origin: quote.freightQuote.originPort,
                            destination: quote.freightQuote.destinationPort,
                            carrier: quote.freightQuote.carrier,
                            cost: Number(quote.freightQuote.cost),
                            currency: quote.freightQuote.currency,
                            transitTime: quote.freightQuote.transitTime,
                            estimatedDate: quote.freightQuote.estimatedArrival.toISOString()
                        } : undefined,
                        items: ((_a = quote.quoteItems) === null || _a === void 0 ? void 0 : _a.map((item) => (Object.assign(Object.assign({}, item), { unitPrice: item.unitPrice ? Number(item.unitPrice) : 0, totalPrice: item.totalPrice ? Number(item.totalPrice) : 0, 
                            // ✅ Usar información de las nuevas columnas directamente
                            productTitle: item.productTitle || item.itemDescription || 'Producto sin título', supplier: item.supplierName || 'N/A', supplierId: item.supplierId || quote.supplierId, containerType: item.containerType || '40GP', incoterm: item.incoterm || 'FOB', pricePerContainer: item.pricePerContainer ? Number(item.pricePerContainer) : (item.unitPrice ? Number(item.unitPrice) : 0), currency: item.currency || 'USD', quantity: item.quantity || 1, 
                            // ✅ Mantener backward compatibility con specifications
                            specifications: item.specifications ? JSON.parse(item.specifications) : {} })))) || [],
                        buyer: quote.buyer,
                        user: quote.buyer
                    };
                });
            }
            catch (error) {
                console.error('❌ QuoteService: Error obteniendo cotizaciones:', error);
                throw error;
            }
        });
    }
    // Obtener cotización por ID
    static getQuoteById(quoteId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('📋 QuoteService: Obteniendo cotización por ID', quoteId);
                const quote = yield prisma.quote.findUnique({
                    where: { id: quoteId },
                    include: {
                        buyer: {
                            select: { id: true, companyName: true, email: true, contactName: true }
                        },
                        supplier: {
                            select: { id: true, companyName: true, email: true, contactName: true }
                        },
                        quoteItems: true,
                        freightQuote: true
                    }
                });
                if (!quote) {
                    console.log('❌ QuoteService: Cotización no encontrada');
                    return null;
                }
                console.log('✅ QuoteService: Cotización obtenida:', quote.quoteNumber);
                return this.transformQuoteWithItems(quote);
            }
            catch (error) {
                console.error('❌ QuoteService: Error obteniendo cotización por ID:', error);
                throw error;
            }
        });
    }
    // Obtener estadísticas de cotizaciones del usuario
    static getQuoteStats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('📊 QuoteService: Obteniendo estadísticas para usuario', userId);
                const stats = yield prisma.quote.groupBy({
                    by: ['status'],
                    where: {
                        OR: [
                            { buyerId: userId },
                            { supplierId: userId }
                        ]
                    },
                    _count: { id: true }
                });
                const result = {
                    total: 0,
                    pending: 0,
                    approved: 0,
                    rejected: 0
                };
                stats.forEach((stat) => {
                    result.total += stat._count.id;
                    switch (stat.status) {
                        case 'pending':
                            result.pending = stat._count.id;
                            break;
                        case 'approved':
                            result.approved = stat._count.id;
                            break;
                        case 'rejected':
                            result.rejected = stat._count.id;
                            break;
                    }
                });
                console.log('✅ QuoteService: Estadísticas obtenidas:', result);
                return result;
            }
            catch (error) {
                console.error('❌ QuoteService: Error obteniendo estadísticas:', error);
                throw error;
            }
        });
    }
    // Transformar cotización para el frontend
    static transformQuoteForFrontend(quote) {
        var _a, _b;
        return {
            id: quote.id,
            quoteNumber: quote.quoteNumber || `Q-${quote.id.toString().padStart(6, '0')}`,
            totalAmount: quote.totalPrice || 0,
            status: quote.status,
            createdAt: ((_a = quote.createdAt) === null || _a === void 0 ? void 0 : _a.toISOString()) || new Date().toISOString(),
            updatedAt: ((_b = quote.updatedAt) === null || _b === void 0 ? void 0 : _b.toISOString()) || new Date().toISOString(),
            notes: quote.logisticsComments || '',
            paymentConditions: quote.paymentTerms || 'Net 30 days',
            freightEstimate: 0,
            platformCommission: 0,
            user: quote.buyer || quote.user || {},
            items: (quote.items || quote.quoteItems || []).map((item) => ({
                id: item.id,
                productId: item.productId,
                productName: item.productName,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice,
                supplierName: item.supplierName
            }))
        };
    }
    // ===============================
    // NUEVOS MÉTODOS PARA GESTIÓN DE ESTADOS Y COMENTARIOS
    // ===============================
    // Actualizar estado de una cotización con comentario opcional
    static updateQuoteStatus(quoteId, newStatus, userId, userType, comment, counterOfferData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('🔄 QuoteService: Actualizando estado de cotización', quoteId, 'a', newStatus);
                console.log('🔍 DEBUG: Parámetros recibidos:', { quoteId, newStatus, userId, userType, comment, counterOfferData });
                // Preparar datos de actualización
                const updateData = {
                    status: newStatus,
                    updatedAt: new Date()
                };
                console.log('🔍 DEBUG: updateData inicial:', updateData);
                // ✅ NUEVA LÓGICA: Para contraofertas, guardar en campos pending, NO actualizar precio principal
                if (newStatus === 'PENDING' && (counterOfferData === null || counterOfferData === void 0 ? void 0 : counterOfferData.newPrice)) {
                    // Solo guardar la contraoferta como pendiente, no actualizar precio principal
                    updateData.pendingCounterOfferPrice = counterOfferData.newPrice;
                    updateData.lastCounterOfferBy = userType;
                    updateData.counterOfferCount = { increment: 1 };
                    if (counterOfferData.paymentTerms) {
                        updateData.pendingPaymentTerms = counterOfferData.paymentTerms;
                    }
                    if (counterOfferData.deliveryTerms) {
                        updateData.pendingDeliveryTerms = counterOfferData.deliveryTerms;
                    }
                    console.log('💰 Contraoferta pendiente guardada:', {
                        precio: counterOfferData.newPrice,
                        términos: counterOfferData.paymentTerms,
                        usuario: userType
                    });
                }
                // ✅ Solo actualizar precio principal cuando se acepta la cotización
                if (newStatus === 'ACCEPTED' && (counterOfferData === null || counterOfferData === void 0 ? void 0 : counterOfferData.newPrice)) {
                    updateData.totalPrice = counterOfferData.newPrice;
                    updateData.paymentTerms = counterOfferData.paymentTerms;
                    updateData.deliveryTerms = counterOfferData.deliveryTerms;
                    updateData.acceptedAt = new Date();
                    // Limpiar campos pending al aceptar
                    updateData.pendingCounterOfferPrice = null;
                    updateData.pendingPaymentTerms = null;
                    updateData.pendingDeliveryTerms = null;
                    console.log('✅ Precio principal actualizado al aceptar:', counterOfferData.newPrice);
                }
                console.log('🔍 DEBUG: updateData final antes de la actualización:', updateData);
                // Actualizar el estado de la cotización
                const updatedQuote = yield prisma.quote.update({
                    where: { id: quoteId },
                    data: updateData,
                    include: {
                        buyer: {
                            select: { id: true, companyName: true, email: true, contactName: true }
                        },
                        supplier: {
                            select: { id: true, companyName: true, email: true, contactName: true }
                        },
                        quoteItems: true,
                        freightQuote: true
                    }
                });
                console.log('🔍 DEBUG: Cotización actualizada en BD:', {
                    id: updatedQuote.id,
                    status: updatedQuote.status,
                    totalPrice: updatedQuote.totalPrice,
                    paymentTerms: updatedQuote.paymentTerms
                });
                // Crear comentario si se proporciona
                if (comment) {
                    try {
                        const commentData = {
                            quoteId: quoteId,
                            userId: userId,
                            userType: userType,
                            comment: comment,
                            status: newStatus
                        };
                        // ✅ Agregar datos específicos de contraoferta si existe
                        if (counterOfferData) {
                            commentData.action = newStatus === 'PENDING' ? 'COUNTER_OFFER' : 'ACCEPT';
                            commentData.counterOfferPrice = counterOfferData.newPrice || null;
                            commentData.paymentTerms = counterOfferData.paymentTerms || null;
                            commentData.deliveryTerms = counterOfferData.deliveryTerms || null;
                            commentData.metadata = JSON.stringify(counterOfferData);
                        }
                        yield prisma.quoteComment.create({
                            data: commentData
                        });
                        console.log('💬 Comentario de contraoferta guardado:', {
                            action: commentData.action,
                            precio: commentData.counterOfferPrice,
                            userType: userType
                        });
                    }
                    catch (commentError) {
                        console.warn('⚠️ Error agregando comentario:', commentError);
                    }
                }
                console.log('✅ QuoteService: Estado actualizado exitosamente:', newStatus);
                return this.transformQuoteWithItems(updatedQuote);
            }
            catch (error) {
                console.error('❌ QuoteService: Error actualizando estado:', error);
                throw error;
            }
        });
    }
    // Método específico para enviar contraoferta desde el comprador
    static sendBuyerCounterOffer(quoteId, buyerId, counterOfferData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Cuando un comprador envía contraoferta, el estado debe cambiar a PENDING
            // para que el proveedor pueda revisarla
            return this.updateQuoteStatus(quoteId, 'PENDING', // Cambiar a PENDING en lugar de COUNTER_OFFER
            buyerId, 'BUYER', counterOfferData.comment, counterOfferData);
        });
    }
    // Método para aceptar cotización
    static acceptQuote(quoteId, userId, userType, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.updateQuoteStatus(quoteId, 'ACCEPTED', userId, userType, comment);
        });
    }
    // Método para rechazar cotización
    static rejectQuote(quoteId, userId, userType, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.updateQuoteStatus(quoteId, 'REJECTED', userId, userType, comment);
        });
    }
    // Método legado - mantenido para compatibilidad
    static sendCounterOffer(quoteId, userId, userType, counterOfferData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Redirigir al nuevo método unificado
            return this.updateQuoteStatus(quoteId, 'COUNTER_OFFER', userId, userType, counterOfferData.comment, {
                newPrice: counterOfferData.newPrice,
                paymentTerms: counterOfferData.paymentTerms,
                deliveryTerms: counterOfferData.deliveryTerms
            });
        });
    }
    // Obtener comentarios de una cotización
    static getQuoteComments(quoteId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('💬 QuoteService: Obteniendo comentarios para cotización', quoteId);
                const comments = yield prisma.quoteComment.findMany({
                    where: { quoteId: quoteId },
                    include: {
                        user: {
                            select: {
                                id: true,
                                companyName: true,
                                contactName: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'asc' }
                });
                console.log('✅ QuoteService: Comentarios obtenidos:', comments.length);
                return comments;
            }
            catch (error) {
                console.warn('⚠️ QuoteService: Error obteniendo comentarios (modelo no disponible):', error);
                return []; // Retornar array vacío si el modelo no está disponible
            }
        });
    }
    // Transformar cotización con items para compatibilidad
    static transformQuoteWithItems(quote) {
        var _a;
        return {
            id: quote.id,
            quoteNumber: quote.quoteNumber,
            totalPrice: quote.totalPrice ? Number(quote.totalPrice) : 0,
            status: quote.status,
            createdAt: quote.createdAt,
            updatedAt: quote.updatedAt,
            logisticsComments: quote.logisticsComments || '',
            paymentConditions: quote.paymentTerms || 'Net 30 days',
            freightEstimate: quote.freightQuote ? Number(quote.freightQuote.cost) : 0,
            platformCommission: 0,
            // ✅ Agregar campos de contraoferta pendiente
            pendingCounterOfferPrice: quote.pendingCounterOfferPrice ? Number(quote.pendingCounterOfferPrice) : null,
            pendingPaymentTerms: quote.pendingPaymentTerms || null,
            pendingDeliveryTerms: quote.pendingDeliveryTerms || null,
            purchaseOrderFile: undefined, // Por implementar cuando el schema esté sincronizado
            freightDetails: quote.freightQuote ? {
                id: quote.freightQuote.id,
                carrier: quote.freightQuote.carrier,
                cost: Number(quote.freightQuote.cost),
                currency: quote.freightQuote.currency,
                transitTime: quote.freightQuote.transitTime,
                originPort: quote.freightQuote.originPort,
                destinationPort: quote.freightQuote.destinationPort,
                containerType: quote.freightQuote.containerType,
                containerCount: quote.freightQuote.containerCount,
                estimatedDeparture: quote.freightQuote.estimatedDeparture,
                estimatedArrival: quote.freightQuote.estimatedArrival,
                incoterm: quote.freightQuote.incoterm
            } : undefined,
            items: ((_a = quote.quoteItems) === null || _a === void 0 ? void 0 : _a.map((item) => (Object.assign(Object.assign({}, item), { unitPrice: item.unitPrice ? Number(item.unitPrice) : 0, totalPrice: item.totalPrice ? Number(item.totalPrice) : 0, productTitle: item.productTitle || item.itemDescription || 'Producto sin título', supplier: item.supplierName || 'N/A', supplierId: item.supplierId || quote.supplierId, containerType: item.containerType || '40GP', incoterm: item.incoterm || 'FOB', pricePerContainer: item.pricePerContainer ? Number(item.pricePerContainer) : (item.unitPrice ? Number(item.unitPrice) : 0), currency: item.currency || 'USD', quantity: item.quantity || 1, specifications: item.specifications ? JSON.parse(item.specifications) : {} })))) || [],
            buyer: quote.buyer,
            user: quote.buyer
        };
    }
    // ===============================
    // MÉTODOS ADICIONALES PARA CONTROLADOR
    // ===============================
    // Obtener estadísticas de cotizaciones del usuario
    static getUserQuoteStats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('📊 QuoteService: Obteniendo estadísticas para usuario', userId);
                const [total, pending, approved, rejected] = yield Promise.all([
                    prisma.quote.count({
                        where: { buyerId: userId }
                    }),
                    prisma.quote.count({
                        where: {
                            buyerId: userId,
                            status: { in: ['PENDING', 'SENT'] }
                        }
                    }),
                    prisma.quote.count({
                        where: {
                            buyerId: userId,
                            status: 'ACCEPTED'
                        }
                    }),
                    prisma.quote.count({
                        where: {
                            buyerId: userId,
                            status: 'REJECTED'
                        }
                    })
                ]);
                return {
                    total,
                    pending,
                    approved,
                    rejected
                };
            }
            catch (error) {
                console.error('❌ QuoteService: Error obteniendo estadísticas:', error);
                throw error;
            }
        });
    }
    // Obtener todas las cotizaciones (para administración)
    static getAllQuotes() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('📋 QuoteService: Obteniendo todas las cotizaciones');
                const quotes = yield prisma.quote.findMany({
                    include: {
                        buyer: true,
                        supplier: true,
                        quoteItems: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });
                return quotes.map((quote) => this.transformQuoteForFrontend(quote));
            }
            catch (error) {
                console.error('❌ QuoteService: Error obteniendo todas las cotizaciones:', error);
                throw error;
            }
        });
    }
    // Actualizar cotización
    static updateQuote(quoteId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('✏️ QuoteService: Actualizando cotización', quoteId, updateData);
                const updatedQuote = yield prisma.quote.update({
                    where: { id: quoteId },
                    data: {
                        totalPrice: updateData.totalAmount,
                        logisticsComments: updateData.notes,
                        updatedAt: new Date()
                    },
                    include: {
                        buyer: true,
                        supplier: true,
                        quoteItems: true
                    }
                });
                return this.transformQuoteForFrontend(updatedQuote);
            }
            catch (error) {
                console.error('❌ QuoteService: Error actualizando cotización:', error);
                throw error;
            }
        });
    }
    // Eliminar cotización
    static deleteQuote(quoteId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('🗑️ QuoteService: Eliminando cotización', quoteId);
                // Primero eliminar los items de la cotización
                yield prisma.quoteItem.deleteMany({
                    where: { quoteId: quoteId }
                });
                // Luego eliminar la cotización
                yield prisma.quote.delete({
                    where: { id: quoteId }
                });
                console.log('✅ QuoteService: Cotización eliminada exitosamente');
            }
            catch (error) {
                console.error('❌ QuoteService: Error eliminando cotización:', error);
                throw error;
            }
        });
    }
}
exports.QuoteService = QuoteService;
exports.default = QuoteService;
