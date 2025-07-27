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
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.searchProducts = exports.getNewProducts = exports.getFeaturedProducts = exports.getProductById = exports.getProducts = void 0;
const prismaService_1 = require("../services/prismaService");
// ================================================================
// CONTROLADOR DE PRODUCTOS CON PRISMA
// ================================================================
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryId, supplierId, minPrice, maxPrice, status, featured, page = 1, limit = 50 } = req.query;
        // Construir filtros
        const filters = {
            page: parseInt(page),
            limit: parseInt(limit)
        };
        if (categoryId) {
            filters.categoryId = parseInt(categoryId);
        }
        if (supplierId) {
            filters.supplierId = parseInt(supplierId);
        }
        if (minPrice) {
            filters.minPrice = parseFloat(minPrice);
        }
        if (maxPrice) {
            filters.maxPrice = parseFloat(maxPrice);
        }
        if (status) {
            filters.status = status;
        }
        if (featured === 'true') {
            filters.featured = true;
        }
        // Obtener productos con filtros
        const result = yield prismaService_1.databaseService.getProducts(filters);
        res.json({
            success: true,
            products: result.products,
            total: result.pagination.total,
            page: result.pagination.currentPage,
            limit: filters.limit || 50,
            message: 'Productos obtenidos exitosamente'
        });
    }
    catch (error) {
        console.error('❌ Error al obtener productos:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
exports.getProducts = getProducts;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield prismaService_1.databaseService.getProductById(parseInt(id));
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }
        res.json({
            success: true,
            product: product,
            message: 'Producto obtenido exitosamente'
        });
    }
    catch (error) {
        console.error('❌ Error al obtener producto:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
exports.getProductById = getProductById;
const getFeaturedProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { limit = 12 } = req.query;
        const products = yield prismaService_1.databaseService.getFeaturedProducts(parseInt(limit));
        res.json({
            success: true,
            data: products,
            count: products.length
        });
    }
    catch (error) {
        console.error('❌ Error al obtener productos destacados:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
exports.getFeaturedProducts = getFeaturedProducts;
const getNewProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { limit = 12, days = 30 } = req.query;
        const products = yield prismaService_1.databaseService.getNewProducts(parseInt(limit), parseInt(days));
        res.json({
            success: true,
            data: products,
            count: products.length
        });
    }
    catch (error) {
        console.error('❌ Error al obtener productos nuevos:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
exports.getNewProducts = getNewProducts;
const searchProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query } = req.params;
        const { limit = 50 } = req.query;
        const products = yield prismaService_1.databaseService.searchProducts(query, parseInt(limit));
        res.json({
            success: true,
            data: products,
            count: products.length,
            query: query
        });
    }
    catch (error) {
        console.error('❌ Error al buscar productos:', error);
        if (error.message.includes('al menos 2 caracteres')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
exports.searchProducts = searchProducts;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productData = req.body;
        // Validaciones básicas
        if (!productData.name || !productData.price || !productData.categoryId || !productData.supplierId) {
            return res.status(400).json({
                success: false,
                message: 'Nombre, precio, categoría y proveedor son requeridos'
            });
        }
        const newProduct = yield prismaService_1.databaseService.createProduct(productData);
        res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente',
            data: newProduct
        });
    }
    catch (error) {
        console.error('❌ Error al crear producto:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
exports.createProduct = createProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedProduct = yield prismaService_1.databaseService.updateProduct(parseInt(id), updateData);
        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }
        res.json({
            success: true,
            message: 'Producto actualizado exitosamente',
            data: updatedProduct
        });
    }
    catch (error) {
        console.error('❌ Error al actualizar producto:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield prismaService_1.databaseService.deleteProduct(parseInt(id));
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }
        res.json({
            success: true,
            message: 'Producto eliminado exitosamente'
        });
    }
    catch (error) {
        console.error('❌ Error al eliminar producto:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
exports.deleteProduct = deleteProduct;
