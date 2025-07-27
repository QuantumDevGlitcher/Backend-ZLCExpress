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
exports.ProductService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ProductService {
    static getAllProducts(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 20, search, category, priceMin, priceMax, containerType, incoterm, isNegotiable, allowsCustomOrders, sortBy = 'createdAt', sortOrder = 'desc' } = filters || {};
                // Construir filtros dinámicos
                const where = {};
                if (search) {
                    where.OR = [
                        { title: { contains: search, mode: 'insensitive' } },
                        { description: { contains: search, mode: 'insensitive' } }
                    ];
                }
                if (category) {
                    where.categoryId = parseInt(category);
                }
                if (priceMin !== undefined) {
                    where.pricePerContainer = Object.assign(Object.assign({}, where.pricePerContainer), { gte: priceMin });
                }
                if (priceMax !== undefined) {
                    where.pricePerContainer = Object.assign(Object.assign({}, where.pricePerContainer), { lte: priceMax });
                }
                if (containerType && containerType !== 'all') {
                    where.containerType = containerType;
                }
                if (incoterm && incoterm !== 'all') {
                    where.incoterm = incoterm;
                }
                // Calcular offset para paginación
                const skip = (page - 1) * limit;
                // Ordenamiento
                const orderBy = {};
                if (sortBy === 'pricePerContainer') {
                    orderBy.pricePerContainer = sortOrder;
                }
                else if (sortBy === 'name') {
                    orderBy.title = sortOrder;
                }
                else {
                    orderBy[sortBy] = sortOrder;
                }
                // Ejecutar consultas
                const [products, total] = yield Promise.all([
                    prisma.product.findMany({
                        where,
                        include: {
                            category: true,
                            supplier: {
                                select: {
                                    id: true,
                                    companyName: true,
                                    isVerified: true,
                                    country: true,
                                    city: true
                                }
                            }
                        },
                        orderBy,
                        skip,
                        take: limit
                    }),
                    prisma.product.count({ where })
                ]);
                // Transformar datos para el frontend
                const transformedProducts = products.map((product) => {
                    const specs = product.specifications || {};
                    // FORZAR NOMBRE VÁLIDO - NUNCA UNDEFINED
                    let productName = product.title || '';
                    if (!productName || productName.trim() === '' || productName === 'undefined') {
                        productName = `Producto ID ${product.id}`;
                    }
                    return {
                        id: product.id,
                        name: productName, // GARANTIZADO QUE NO ES UNDEFINED
                        description: product.description || 'Sin descripción disponible',
                        categoryId: product.categoryId,
                        supplierId: product.supplierId,
                        unitPrice: product.unitPrice || product.price,
                        currency: product.currency,
                        minQuantity: product.minQuantity,
                        maxQuantity: product.maxQuantity,
                        unit: product.unit,
                        incoterm: product.incoterm,
                        originCountry: product.originCountry,
                        images: product.images || [],
                        specifications: product.specifications,
                        status: 'active',
                        isPublished: true,
                        createdAt: product.createdAt,
                        updatedAt: product.updatedAt,
                        // Usar campos directos de la tabla en lugar de specifications
                        containerType: product.containerType || '40GP',
                        unitsPerContainer: product.unitsPerContainer || 0,
                        pricePerContainer: product.pricePerContainer || 0,
                        grossWeight: product.grossWeight || 0,
                        netWeight: product.netWeight || 0,
                        volume: product.volume || 0,
                        packagingType: product.packagingType || '',
                        stockContainers: product.stockContainers || 0,
                        productionTime: product.productionTime || 0,
                        packagingTime: product.packagingTime || 0,
                        moq: product.moq || product.minQuantity,
                        colors: specs.colors || [],
                        sizes: specs.sizes || [],
                        materials: specs.materials || [],
                        tags: specs.tags || [],
                        volumeDiscounts: specs.volumeDiscounts || [],
                        // Usar campos directos de la tabla
                        isNegotiable: product.isNegotiable || false,
                        allowsCustomOrders: product.allowsCustomOrders || false,
                        totalViews: product.totalViews || 0,
                        totalInquiries: product.totalInquiries || 0,
                        // Datos del supplier
                        supplier: product.supplier ? {
                            id: product.supplier.id,
                            companyName: product.supplier.companyName,
                            isVerified: product.supplier.isVerified,
                            location: `${product.supplier.city}, ${product.supplier.country}`
                        } : null,
                        // Datos de la categoría
                        category: product.category
                    };
                });
                return {
                    success: true,
                    products: transformedProducts,
                    total
                };
            }
            catch (error) {
                console.error('Error al obtener productos:', error);
                return {
                    success: false,
                    products: [],
                    total: 0
                };
            }
        });
    }
    static getProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productId = parseInt(id);
                const product = yield prisma.product.findUnique({
                    where: { id: productId },
                    include: {
                        category: true,
                        supplier: {
                            select: {
                                id: true,
                                companyName: true,
                                isVerified: true,
                                country: true,
                                city: true,
                                contactName: true,
                                contactPhone: true,
                                contactPosition: true
                            }
                        }
                    }
                });
                if (!product) {
                    return null;
                }
                // Transformar para el frontend
                const specs = product.specifications || {};
                // FORZAR NOMBRE VÁLIDO - NUNCA UNDEFINED
                let productName = product.title || '';
                if (!productName || productName.trim() === '' || productName === 'undefined') {
                    productName = `Producto ID ${product.id}`;
                }
                return {
                    id: product.id,
                    name: productName, // GARANTIZADO QUE NO ES UNDEFINED
                    description: product.description || 'Sin descripción disponible',
                    categoryId: product.categoryId,
                    supplierId: product.supplierId,
                    unitPrice: product.price,
                    currency: product.currency,
                    minQuantity: product.minQuantity,
                    maxQuantity: product.maxQuantity,
                    unit: product.unit,
                    incoterm: product.incoterm,
                    originCountry: product.originCountry,
                    images: product.images || [],
                    specifications: product.specifications,
                    status: 'active',
                    isPublished: true,
                    createdAt: product.createdAt,
                    updatedAt: product.updatedAt,
                    // Datos de specifications con casting seguro
                    containerType: specs.containerType || '40GP',
                    unitsPerContainer: specs.unitsPerContainer || 0,
                    pricePerContainer: specs.pricePerContainer || 0,
                    grossWeight: specs.grossWeight || 0,
                    netWeight: specs.netWeight || 0,
                    volume: specs.volume || 0,
                    packagingType: specs.packagingType || '',
                    stockContainers: specs.stockContainers || 0,
                    productionTime: specs.productionTime || 0,
                    packagingTime: specs.packagingTime || 0,
                    moq: specs.moq || product.minQuantity,
                    colors: specs.colors || [],
                    sizes: specs.sizes || [],
                    materials: specs.materials || [],
                    tags: specs.tags || [],
                    volumeDiscounts: specs.volumeDiscounts || [],
                    // Valores por defecto
                    isNegotiable: false,
                    allowsCustomOrders: false,
                    totalViews: 0,
                    totalInquiries: 0,
                    // Datos del supplier
                    supplier: product.supplier ? {
                        id: product.supplier.id,
                        companyName: product.supplier.companyName,
                        isVerified: product.supplier.isVerified,
                        location: `${product.supplier.city}, ${product.supplier.country}`,
                        contactName: product.supplier.contactName,
                        contactPhone: product.supplier.contactPhone,
                        contactPosition: product.supplier.contactPosition
                    } : null,
                    // Datos de la categoría
                    category: product.category
                };
            }
            catch (error) {
                console.error('Error al obtener producto por ID:', error);
                return null;
            }
        });
    }
    static getProductsByCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield prisma.product.findMany({
                    where: {
                        categoryId: parseInt(categoryId)
                    },
                    include: {
                        category: true,
                        supplier: {
                            select: {
                                id: true,
                                companyName: true,
                                isVerified: true,
                                country: true,
                                city: true
                            }
                        }
                    }
                });
                // Transformar datos para el frontend
                return products.map((product) => {
                    const specs = product.specifications || {};
                    return {
                        id: product.id,
                        name: product.title,
                        description: product.description,
                        categoryId: product.categoryId,
                        supplierId: product.supplierId,
                        unitPrice: product.price,
                        currency: product.currency,
                        minQuantity: product.minQuantity,
                        maxQuantity: product.maxQuantity,
                        unit: product.unit,
                        incoterm: product.incoterm,
                        originCountry: product.originCountry,
                        images: product.images || [],
                        specifications: product.specifications,
                        status: 'active',
                        isPublished: true,
                        createdAt: product.createdAt,
                        updatedAt: product.updatedAt,
                        // Datos de specifications con casting seguro
                        containerType: specs.containerType || '40GP',
                        unitsPerContainer: specs.unitsPerContainer || 0,
                        pricePerContainer: specs.pricePerContainer || 0,
                        grossWeight: specs.grossWeight || 0,
                        netWeight: specs.netWeight || 0,
                        volume: specs.volume || 0,
                        packagingType: specs.packagingType || '',
                        stockContainers: specs.stockContainers || 0,
                        productionTime: specs.productionTime || 0,
                        packagingTime: specs.packagingTime || 0,
                        moq: specs.moq || product.minQuantity,
                        colors: specs.colors || [],
                        sizes: specs.sizes || [],
                        materials: specs.materials || [],
                        tags: specs.tags || [],
                        volumeDiscounts: specs.volumeDiscounts || [],
                        // Valores por defecto
                        isNegotiable: false,
                        allowsCustomOrders: false,
                        totalViews: 0,
                        totalInquiries: 0,
                        // Datos del supplier
                        supplier: product.supplier ? {
                            id: product.supplier.id,
                            companyName: product.supplier.companyName,
                            isVerified: product.supplier.isVerified,
                            location: `${product.supplier.city}, ${product.supplier.country}`
                        } : null,
                        // Datos de la categoría
                        category: product.category
                    };
                });
            }
            catch (error) {
                console.error('Error al obtener productos por categoría:', error);
                return [];
            }
        });
    }
    static updateStock(productId, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(productId);
                yield prisma.product.update({
                    where: { id },
                    data: {
                        specifications: {
                        // Necesitaríamos actualizar stockContainers en specifications
                        // Por ahora dejamos el método como placeholder
                        },
                        updatedAt: new Date()
                    }
                });
            }
            catch (error) {
                console.error('Error al actualizar stock:', error);
            }
        });
    }
}
exports.ProductService = ProductService;
