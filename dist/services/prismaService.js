"use strict";
// ================================================================
// SERVICIO DE BASE DE DATOS CON PRISMA - ZLCExpress
// ================================================================
// Descripción: Servicio moderno para gestión de usuarios con PostgreSQL y Prisma ORM
// Fecha: 2025-07-26
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseService = exports.DatabaseService = void 0;
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
class DatabaseService {
    constructor() {
        this.saltRounds = 12;
        this.prisma = new client_1.PrismaClient({
            log: ['query', 'info', 'warn', 'error'],
        });
        this.jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key';
        // Configurar manejo de errores y desconexión
        this.setupEventHandlers();
    }
    // ================================================================
    // CONFIGURACIÓN Y UTILIDADES
    // ================================================================
    setupEventHandlers() {
        process.on('beforeExit', () => __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.$disconnect();
        }));
        process.on('SIGINT', () => __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.$disconnect();
            process.exit(0);
        }));
    }
    healthCheck() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.prisma.$queryRaw `SELECT 1`;
                return true;
            }
            catch (error) {
                console.error('Database health check failed:', error);
                return false;
            }
        });
    }
    // ================================================================
    // GESTIÓN DE USUARIOS
    // ================================================================
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verificar si el email ya existe
                const existingUser = yield this.prisma.user.findUnique({
                    where: { email: userData.email },
                });
                if (existingUser) {
                    throw new Error('El email ya está registrado');
                }
                // Hash de la contraseña
                const hashedPassword = yield bcrypt.hash(userData.password, this.saltRounds);
                // Crear usuario
                const user = yield this.prisma.user.create({
                    data: Object.assign(Object.assign({}, userData), { password: hashedPassword }),
                });
                // Log de auditoría
                yield this.logAuthAction({
                    userId: user.id,
                    action: 'LOGIN', // Equivalente a registro exitoso
                    success: true,
                });
                return user;
            }
            catch (error) {
                console.error('Error creating user:', error);
                throw error;
            }
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.user.findUnique({
                    where: { id },
                    include: {
                        sessions: {
                            where: { isActive: true },
                            orderBy: { createdAt: 'desc' },
                        },
                    },
                });
            }
            catch (error) {
                console.error('Error getting user by ID:', error);
                return null;
            }
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.user.findUnique({
                    where: { email },
                });
            }
            catch (error) {
                console.error('Error getting user by email:', error);
                return null;
            }
        });
    }
    updateUser(id, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Si se está actualizando la contraseña, hashearla
                if (userData.password) {
                    userData.password = yield bcrypt.hash(userData.password, this.saltRounds);
                }
                const user = yield this.prisma.user.update({
                    where: { id },
                    data: userData,
                });
                // Log de auditoría
                if (userData.password) {
                    yield this.logAuthAction({
                        userId: id,
                        action: 'PASSWORD_CHANGE',
                        success: true,
                    });
                }
                return user;
            }
            catch (error) {
                console.error('Error updating user:', error);
                return null;
            }
        });
    }
    verifyUser(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.user.update({
                    where: { id },
                    data: {
                        verificationStatus: status,
                        isVerified: status === 'VERIFIED',
                    },
                });
            }
            catch (error) {
                console.error('Error verifying user:', error);
                return null;
            }
        });
    }
    // ================================================================
    // AUTENTICACIÓN
    // ================================================================
    authenticateUser(credentials, sessionData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Buscar usuario
                const user = yield this.getUserByEmail(credentials.email);
                if (!user) {
                    yield this.logAuthAction({
                        action: 'FAILED_LOGIN',
                        success: false,
                        ipAddress: sessionData === null || sessionData === void 0 ? void 0 : sessionData.ipAddress,
                        userAgent: sessionData === null || sessionData === void 0 ? void 0 : sessionData.userAgent,
                        errorMessage: 'Usuario no encontrado',
                    });
                    return null;
                }
                // Verificar contraseña
                const isPasswordValid = yield bcrypt.compare(credentials.password, user.password);
                if (!isPasswordValid) {
                    yield this.logAuthAction({
                        userId: user.id,
                        action: 'FAILED_LOGIN',
                        success: false,
                        ipAddress: sessionData === null || sessionData === void 0 ? void 0 : sessionData.ipAddress,
                        userAgent: sessionData === null || sessionData === void 0 ? void 0 : sessionData.userAgent,
                        errorMessage: 'Contraseña incorrecta',
                    });
                    return null;
                }
                // Generar JWT
                const token = jwt.sign({
                    userId: user.id,
                    email: user.email,
                    userType: user.userType,
                    isVerified: user.isVerified,
                }, this.jwtSecret, { expiresIn: '7d' });
                // Crear sesión
                yield this.createSession({
                    userId: user.id,
                    token,
                    ipAddress: (sessionData === null || sessionData === void 0 ? void 0 : sessionData.ipAddress) || null,
                    userAgent: (sessionData === null || sessionData === void 0 ? void 0 : sessionData.userAgent) || null,
                });
                // Log de login exitoso
                yield this.logAuthAction({
                    userId: user.id,
                    action: 'LOGIN',
                    success: true,
                    ipAddress: sessionData === null || sessionData === void 0 ? void 0 : sessionData.ipAddress,
                    userAgent: sessionData === null || sessionData === void 0 ? void 0 : sessionData.userAgent,
                });
                return { user, token };
            }
            catch (error) {
                console.error('Error authenticating user:', error);
                return null;
            }
        });
    }
    verifyToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = jwt.verify(token, this.jwtSecret);
                // Verificar que la sesión siga activa
                const session = yield this.prisma.userSession.findFirst({
                    where: {
                        userId: decoded.userId,
                        isActive: true,
                        expiresAt: { gt: new Date() },
                    },
                    include: { user: true },
                });
                if (!session) {
                    return null;
                }
                // Actualizar último uso
                yield this.prisma.userSession.update({
                    where: { id: session.id },
                    data: { lastUsedAt: new Date() },
                });
                return session.user;
            }
            catch (error) {
                console.error('Error verifying token:', error);
                return null;
            }
        });
    }
    // ================================================================
    // GESTIÓN DE SESIONES
    // ================================================================
    createSession(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenHash = yield bcrypt.hash(data.token, 10);
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días
            return yield this.prisma.userSession.create({
                data: {
                    userId: data.userId,
                    tokenHash,
                    expiresAt,
                    ipAddress: data.ipAddress,
                    userAgent: data.userAgent,
                },
            });
        });
    }
    logoutUser(userId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let whereClause = { userId, isActive: true };
                if (token) {
                    // Logout específico de sesión
                    const tokenHash = yield bcrypt.hash(token, 10);
                    whereClause.tokenHash = tokenHash;
                }
                yield this.prisma.userSession.updateMany({
                    where: whereClause,
                    data: { isActive: false },
                });
                // Log de logout
                yield this.logAuthAction({
                    userId,
                    action: 'LOGOUT',
                    success: true,
                });
                return true;
            }
            catch (error) {
                console.error('Error logging out user:', error);
                return false;
            }
        });
    }
    cleanExpiredSessions() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.prisma.userSession.deleteMany({
                    where: {
                        OR: [
                            { expiresAt: { lt: new Date() } },
                            { isActive: false },
                        ],
                    },
                });
                console.log(`🧹 Cleaned ${result.count} expired sessions`);
                return result.count;
            }
            catch (error) {
                console.error('Error cleaning expired sessions:', error);
                return 0;
            }
        });
    }
    // ================================================================
    // LOGS DE AUDITORÍA
    // ================================================================
    logAuthAction(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                yield this.prisma.authLog.create({
                    data: {
                        userId: data.userId || null,
                        action: data.action,
                        success: (_a = data.success) !== null && _a !== void 0 ? _a : true,
                        ipAddress: data.ipAddress || null,
                        userAgent: data.userAgent || null,
                        errorMessage: data.errorMessage || null,
                    },
                });
            }
            catch (error) {
                console.error('Error logging auth action:', error);
            }
        });
    }
    getAuthLogs(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, limit = 50) {
            try {
                return yield this.prisma.authLog.findMany({
                    where: userId ? { userId } : undefined,
                    orderBy: { createdAt: 'desc' },
                    take: limit,
                    include: {
                        user: {
                            select: {
                                email: true,
                                companyName: true,
                            },
                        },
                    },
                });
            }
            catch (error) {
                console.error('Error getting auth logs:', error);
                return [];
            }
        });
    }
    // ================================================================
    // ESTADÍSTICAS Y REPORTES
    // ================================================================
    getUserStats() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                const [totalUsers, verifiedUsers, pendingUsers, buyers, suppliers, bothTypes, newLast30Days,] = yield Promise.all([
                    this.prisma.user.count(),
                    this.prisma.user.count({ where: { isVerified: true } }),
                    this.prisma.user.count({ where: { verificationStatus: 'PENDING' } }),
                    this.prisma.user.count({ where: { userType: 'BUYER' } }),
                    this.prisma.user.count({ where: { userType: 'SUPPLIER' } }),
                    this.prisma.user.count({ where: { userType: 'BOTH' } }),
                    this.prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
                ]);
                return {
                    totalUsers,
                    verifiedUsers,
                    pendingUsers,
                    buyers,
                    suppliers,
                    bothTypes,
                    newLast30Days,
                };
            }
            catch (error) {
                console.error('Error getting user stats:', error);
                throw error;
            }
        });
    }
    getUsersByCountry() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.user.groupBy({
                    by: ['operationCountry'],
                    _count: {
                        id: true,
                    },
                    orderBy: {
                        _count: {
                            id: 'desc',
                        },
                    },
                });
            }
            catch (error) {
                console.error('Error getting users by country:', error);
                return [];
            }
        });
    }
    // ================================================================
    // BÚSQUEDAS Y FILTROS
    // ================================================================
    searchUsers(query, filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const whereClause = {
                    OR: [
                        { email: { contains: query, mode: 'insensitive' } },
                        { companyName: { contains: query, mode: 'insensitive' } },
                        { contactName: { contains: query, mode: 'insensitive' } },
                        { taxId: { contains: query, mode: 'insensitive' } },
                    ],
                };
                if ((filters === null || filters === void 0 ? void 0 : filters.verified) !== undefined) {
                    whereClause.isVerified = filters.verified;
                }
                if (filters === null || filters === void 0 ? void 0 : filters.userType) {
                    whereClause.userType = filters.userType;
                }
                if (filters === null || filters === void 0 ? void 0 : filters.country) {
                    whereClause.operationCountry = filters.country;
                }
                return yield this.prisma.user.findMany({
                    where: whereClause,
                    orderBy: { createdAt: 'desc' },
                    take: 100,
                });
            }
            catch (error) {
                console.error('Error searching users:', error);
                return [];
            }
        });
    }
    // ================================================================
    // CIERRE
    // ================================================================
    // ================================================================
    // CATEGORÍAS
    // ================================================================
    getCategories(options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const whereClause = {};
                if ((options === null || options === void 0 ? void 0 : options.parentId) !== undefined) {
                    whereClause.parentId = options.parentId;
                }
                if (!(options === null || options === void 0 ? void 0 : options.includeInactive)) {
                    whereClause.isActive = true;
                }
                return yield this.prisma.category.findMany({
                    where: whereClause,
                    include: {
                        children: {
                            where: { isActive: true },
                            orderBy: { sortOrder: 'asc' }
                        },
                        _count: {
                            select: { products: true }
                        }
                    },
                    orderBy: { sortOrder: 'asc' }
                });
            }
            catch (error) {
                console.error('Error getting categories:', error);
                throw error;
            }
        });
    }
    getCategoryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.category.findUnique({
                    where: { id },
                    include: {
                        parent: true,
                        children: {
                            where: { isActive: true },
                            orderBy: { sortOrder: 'asc' }
                        },
                        products: {
                            where: { isActive: true },
                            take: 10,
                            orderBy: { createdAt: 'desc' }
                        },
                        _count: {
                            select: { products: true }
                        }
                    }
                });
            }
            catch (error) {
                console.error('Error getting category by ID:', error);
                throw error;
            }
        });
    }
    createCategory(categoryData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.category.create({
                    data: {
                        name: categoryData.name,
                        description: categoryData.description,
                        image: categoryData.image,
                        parentId: categoryData.parentId,
                        sortOrder: categoryData.sortOrder || 0
                    },
                    include: {
                        parent: true,
                        _count: {
                            select: { products: true }
                        }
                    }
                });
            }
            catch (error) {
                console.error('Error creating category:', error);
                throw error;
            }
        });
    }
    updateCategory(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.category.update({
                    where: { id },
                    data: updateData,
                    include: {
                        parent: true,
                        children: {
                            where: { isActive: true },
                            orderBy: { sortOrder: 'asc' }
                        },
                        _count: {
                            select: { products: true }
                        }
                    }
                });
            }
            catch (error) {
                console.error('Error updating category:', error);
                throw error;
            }
        });
    }
    deleteCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verificar si tiene productos asociados
                const productsCount = yield this.prisma.product.count({
                    where: { categoryId: id }
                });
                if (productsCount > 0) {
                    throw new Error('Cannot delete category with products');
                }
                // Verificar si tiene subcategorías
                const childrenCount = yield this.prisma.category.count({
                    where: { parentId: id }
                });
                if (childrenCount > 0) {
                    throw new Error('Cannot delete category with subcategories');
                }
                yield this.prisma.category.delete({
                    where: { id }
                });
                return true;
            }
            catch (error) {
                console.error('Error deleting category:', error);
                throw error;
            }
        });
    }
    getCategoryTree() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rootCategories = yield this.prisma.category.findMany({
                    where: {
                        parentId: null,
                        isActive: true
                    },
                    include: {
                        children: {
                            where: { isActive: true },
                            include: {
                                children: {
                                    where: { isActive: true },
                                    orderBy: { sortOrder: 'asc' }
                                },
                                _count: {
                                    select: { products: true }
                                }
                            },
                            orderBy: { sortOrder: 'asc' }
                        },
                        _count: {
                            select: { products: true }
                        }
                    },
                    orderBy: { sortOrder: 'asc' }
                });
                return rootCategories;
            }
            catch (error) {
                console.error('Error getting category tree:', error);
                throw error;
            }
        });
    }
    // ================================================================
    // MÉTODOS DE PRODUCTOS
    // ================================================================
    getProducts() {
        return __awaiter(this, arguments, void 0, function* (filters = {}) {
            try {
                const { page = 1, limit = 50 } = filters, whereFilters = __rest(filters, ["page", "limit"]);
                // Construir filtros
                const where = {};
                if (whereFilters.categoryId) {
                    where.categoryId = whereFilters.categoryId;
                }
                if (whereFilters.supplierId) {
                    where.supplierId = whereFilters.supplierId;
                }
                if (whereFilters.minPrice || whereFilters.maxPrice) {
                    where.price = {};
                    if (whereFilters.minPrice)
                        where.price.gte = whereFilters.minPrice;
                    if (whereFilters.maxPrice)
                        where.price.lte = whereFilters.maxPrice;
                }
                if (whereFilters.status) {
                    where.status = whereFilters.status;
                }
                if (whereFilters.featured) {
                    where.featured = whereFilters.featured;
                }
                // Calcular paginación
                const skip = (page - 1) * limit;
                // Obtener productos con filtros
                const [products, total] = yield Promise.all([
                    this.prisma.product.findMany({
                        where,
                        include: {
                            category: true,
                            supplier: {
                                select: {
                                    id: true,
                                    companyName: true,
                                    email: true,
                                    contactPhone: true
                                }
                            }
                        },
                        orderBy: { createdAt: 'desc' },
                        skip,
                        take: limit
                    }),
                    this.prisma.product.count({ where })
                ]);
                return {
                    products,
                    pagination: {
                        currentPage: page,
                        totalPages: Math.ceil(total / limit),
                        total,
                        hasNext: page * limit < total,
                        hasPrev: page > 1
                    }
                };
            }
            catch (error) {
                console.error('❌ Error al obtener productos:', error);
                throw new Error('Error al obtener productos de la base de datos');
            }
        });
    }
    getProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.product.findUnique({
                    where: { id },
                    include: {
                        category: true,
                        supplier: {
                            select: {
                                id: true,
                                companyName: true,
                                email: true,
                                contactPhone: true
                            }
                        }
                    }
                });
            }
            catch (error) {
                console.error('❌ Error al obtener producto por ID:', error);
                throw new Error('Error al obtener producto de la base de datos');
            }
        });
    }
    getFeaturedProducts() {
        return __awaiter(this, arguments, void 0, function* (limit = 12) {
            try {
                return yield this.prisma.product.findMany({
                    where: {
                        isActive: true
                    },
                    include: {
                        category: true,
                        supplier: {
                            select: {
                                id: true,
                                companyName: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' },
                    take: limit
                });
            }
            catch (error) {
                console.error('❌ Error al obtener productos destacados:', error);
                throw new Error('Error al obtener productos destacados de la base de datos');
            }
        });
    }
    getNewProducts() {
        return __awaiter(this, arguments, void 0, function* (limit = 12, days = 30) {
            try {
                const dateThreshold = new Date();
                dateThreshold.setDate(dateThreshold.getDate() - days);
                return yield this.prisma.product.findMany({
                    where: {
                        createdAt: {
                            gte: dateThreshold
                        },
                        isActive: true
                    },
                    include: {
                        category: true,
                        supplier: {
                            select: {
                                id: true,
                                companyName: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' },
                    take: limit
                });
            }
            catch (error) {
                console.error('❌ Error al obtener productos nuevos:', error);
                throw new Error('Error al obtener productos nuevos de la base de datos');
            }
        });
    }
    searchProducts(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, limit = 50) {
            try {
                if (!query || query.trim().length < 2) {
                    throw new Error('La búsqueda debe tener al menos 2 caracteres');
                }
                return yield this.prisma.product.findMany({
                    where: {
                        OR: [
                            {
                                title: {
                                    contains: query,
                                    mode: 'insensitive'
                                }
                            },
                            {
                                description: {
                                    contains: query,
                                    mode: 'insensitive'
                                }
                            }
                        ],
                        isActive: true
                    },
                    include: {
                        category: true,
                        supplier: {
                            select: {
                                id: true,
                                companyName: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' },
                    take: limit
                });
            }
            catch (error) {
                console.error('❌ Error al buscar productos:', error);
                throw new Error('Error al buscar productos en la base de datos');
            }
        });
    }
    createProduct(productData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.product.create({
                    data: Object.assign(Object.assign({}, productData), { price: parseFloat(productData.price), categoryId: parseInt(productData.categoryId), supplierId: parseInt(productData.supplierId) }),
                    include: {
                        category: true,
                        supplier: {
                            select: {
                                id: true,
                                companyName: true,
                                email: true
                            }
                        }
                    }
                });
            }
            catch (error) {
                console.error('❌ Error al crear producto:', error);
                throw new Error('Error al crear producto en la base de datos');
            }
        });
    }
    updateProduct(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Convertir tipos numéricos si están presentes
                if (updateData.price)
                    updateData.price = parseFloat(updateData.price);
                if (updateData.categoryId)
                    updateData.categoryId = parseInt(updateData.categoryId);
                if (updateData.minimumOrderQuantity)
                    updateData.minimumOrderQuantity = parseInt(updateData.minimumOrderQuantity);
                return yield this.prisma.product.update({
                    where: { id },
                    data: updateData,
                    include: {
                        category: true,
                        supplier: {
                            select: {
                                id: true,
                                companyName: true,
                                email: true
                            }
                        }
                    }
                });
            }
            catch (error) {
                console.error('❌ Error al actualizar producto:', error);
                if (error instanceof Error && 'code' in error && error.code === 'P2025') {
                    return null; // Producto no encontrado
                }
                throw new Error('Error al actualizar producto en la base de datos');
            }
        });
    }
    deleteProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.prisma.product.delete({
                    where: { id }
                });
                return true;
            }
            catch (error) {
                console.error('❌ Error al eliminar producto:', error);
                if (error instanceof Error && 'code' in error && error.code === 'P2025') {
                    return false; // Producto no encontrado
                }
                throw new Error('Error al eliminar producto de la base de datos');
            }
        });
    }
    // ================================================================
    // MÉTODOS DE ÓRDENES
    // ================================================================
    getOrders() {
        return __awaiter(this, arguments, void 0, function* (filters = {}) {
            try {
                const { page = 1, limit = 50 } = filters, whereFilters = __rest(filters, ["page", "limit"]);
                // Construir filtros
                const where = {};
                if (whereFilters.buyerId) {
                    where.buyerId = whereFilters.buyerId;
                }
                if (whereFilters.supplierId) {
                    where.orderDetails = {
                        some: {
                            supplierId: whereFilters.supplierId
                        }
                    };
                }
                if (whereFilters.status) {
                    where.status = whereFilters.status;
                }
                // Calcular paginación
                const skip = (page - 1) * limit;
                // Obtener órdenes con filtros
                const [orders, total] = yield Promise.all([
                    this.prisma.order.findMany({
                        where,
                        include: {
                            buyer: {
                                select: {
                                    id: true,
                                    companyName: true,
                                    email: true,
                                    contactPhone: true
                                }
                            },
                            orderDetails: {
                                include: {
                                    product: {
                                        select: {
                                            id: true,
                                            title: true,
                                            images: true,
                                            category: {
                                                select: {
                                                    id: true,
                                                    name: true
                                                }
                                            }
                                        }
                                    },
                                    supplier: {
                                        select: {
                                            id: true,
                                            companyName: true,
                                            email: true
                                        }
                                    }
                                }
                            }
                        },
                        orderBy: { createdAt: 'desc' },
                        skip,
                        take: limit
                    }),
                    this.prisma.order.count({ where })
                ]);
                return {
                    orders,
                    pagination: {
                        currentPage: page,
                        totalPages: Math.ceil(total / limit),
                        total,
                        hasNext: page * limit < total,
                        hasPrev: page > 1
                    }
                };
            }
            catch (error) {
                console.error('❌ Error al obtener órdenes:', error);
                throw new Error('Error al obtener órdenes de la base de datos');
            }
        });
    }
    getOrderById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.order.findUnique({
                    where: { id },
                    include: {
                        buyer: {
                            select: {
                                id: true,
                                companyName: true,
                                email: true,
                                contactPhone: true,
                                fiscalAddress: true,
                                country: true,
                                city: true
                            }
                        },
                        orderDetails: {
                            include: {
                                product: {
                                    select: {
                                        id: true,
                                        title: true,
                                        description: true,
                                        images: true,
                                        specifications: true,
                                        category: {
                                            select: {
                                                id: true,
                                                name: true
                                            }
                                        }
                                    }
                                },
                                supplier: {
                                    select: {
                                        id: true,
                                        companyName: true,
                                        email: true,
                                        contactPhone: true,
                                        fiscalAddress: true,
                                        country: true,
                                        city: true
                                    }
                                }
                            }
                        }
                    }
                });
            }
            catch (error) {
                console.error('❌ Error al obtener orden por ID:', error);
                throw new Error('Error al obtener orden de la base de datos');
            }
        });
    }
    createOrder(orderData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Calcular total de la orden
                let totalAmount = 0;
                for (const detail of orderData.orderDetails) {
                    totalAmount += detail.quantity * detail.unitPrice;
                }
                // Crear orden con detalles
                return yield this.prisma.order.create({
                    data: {
                        orderNumber: `ORD-${Date.now()}`, // Generate a simple order number
                        buyerId: orderData.buyerId,
                        totalAmount: totalAmount,
                        currency: 'USD', // Default currency
                        status: 'PENDING',
                        notes: orderData.notes,
                        orderDetails: {
                            create: orderData.orderDetails.map(detail => ({
                                product: {
                                    connect: { id: detail.productId }
                                },
                                supplier: {
                                    connect: { id: detail.supplierId }
                                },
                                quantity: detail.quantity,
                                unitPrice: detail.unitPrice,
                                totalPrice: detail.quantity * detail.unitPrice,
                                currency: detail.currency || 'USD',
                                specifications: detail.specifications
                            }))
                        }
                    },
                    include: {
                        buyer: {
                            select: {
                                id: true,
                                companyName: true,
                                email: true
                            }
                        },
                        orderDetails: {
                            include: {
                                product: {
                                    select: {
                                        id: true,
                                        title: true,
                                        images: true
                                    }
                                },
                                supplier: {
                                    select: {
                                        id: true,
                                        companyName: true,
                                        email: true
                                    }
                                }
                            }
                        }
                    }
                });
            }
            catch (error) {
                console.error('❌ Error al crear orden:', error);
                throw new Error('Error al crear orden en la base de datos');
            }
        });
    }
    updateOrderStatus(id, status, notes) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.order.update({
                    where: { id },
                    data: {
                        status: status,
                        notes: notes || undefined
                    },
                    include: {
                        buyer: {
                            select: {
                                id: true,
                                companyName: true,
                                email: true
                            }
                        },
                        orderDetails: {
                            include: {
                                product: {
                                    select: {
                                        id: true,
                                        title: true,
                                        images: true
                                    }
                                },
                                supplier: {
                                    select: {
                                        id: true,
                                        companyName: true,
                                        email: true
                                    }
                                }
                            }
                        }
                    }
                });
            }
            catch (error) {
                console.error('❌ Error al actualizar orden:', error);
                if (error instanceof Error && 'code' in error && error.code === 'P2025') {
                    return null; // Orden no encontrada
                }
                throw new Error('Error al actualizar orden en la base de datos');
            }
        });
    }
    getOrdersByUser(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, role = 'buyer', page = 1, limit = 20) {
            try {
                // Calcular paginación
                const skip = (page - 1) * limit;
                let whereClause;
                if (role === 'buyer') {
                    whereClause = { buyerId: userId };
                }
                else {
                    // Para suppliers, buscar en orderDetails
                    whereClause = {
                        orderDetails: {
                            some: {
                                supplierId: userId
                            }
                        }
                    };
                }
                const [orders, total] = yield Promise.all([
                    this.prisma.order.findMany({
                        where: whereClause,
                        include: {
                            buyer: {
                                select: {
                                    id: true,
                                    companyName: true,
                                    email: true
                                }
                            },
                            orderDetails: {
                                include: {
                                    product: {
                                        select: {
                                            id: true,
                                            title: true,
                                            images: true
                                        }
                                    },
                                    supplier: {
                                        select: {
                                            id: true,
                                            companyName: true,
                                            email: true
                                        }
                                    }
                                }
                            }
                        },
                        orderBy: { createdAt: 'desc' },
                        skip,
                        take: limit
                    }),
                    this.prisma.order.count({
                        where: whereClause
                    })
                ]);
                return {
                    orders,
                    pagination: {
                        currentPage: page,
                        totalPages: Math.ceil(total / limit),
                        total,
                        hasNext: page * limit < total,
                        hasPrev: page > 1
                    }
                };
            }
            catch (error) {
                console.error('❌ Error al obtener órdenes del usuario:', error);
                throw new Error('Error al obtener órdenes del usuario de la base de datos');
            }
        });
    }
    cancelOrder(id, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verificar que la orden esté en un estado cancelable
                const existingOrder = yield this.prisma.order.findUnique({
                    where: { id }
                });
                if (!existingOrder) {
                    return null; // Orden no encontrada
                }
                if (!['PENDING', 'CONFIRMED'].includes(existingOrder.status)) {
                    throw new Error('La orden no puede ser cancelada en su estado actual');
                }
                return yield this.prisma.order.update({
                    where: { id },
                    data: {
                        status: 'CANCELLED',
                        notes: reason ? `Cancelada: ${reason}` : 'Orden cancelada'
                    }
                });
            }
            catch (error) {
                console.error('❌ Error al cancelar orden:', error);
                throw error;
            }
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.$disconnect();
        });
    }
}
exports.DatabaseService = DatabaseService;
// Singleton instance
exports.databaseService = new DatabaseService();
