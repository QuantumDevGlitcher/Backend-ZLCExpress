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
exports.ProductController = exports.CategoryController = void 0;
const categoryService_1 = require("../services/categoryService");
class CategoryController {
    // GET /api/categories
    static getAllCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield categoryService_1.CategoryService.getAllCategories();
                res.json({
                    success: true,
                    categories,
                    message: 'Categorías obtenidas exitosamente'
                });
            }
            catch (error) {
                console.error('Error en CategoryController.getAllCategories:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error interno del servidor'
                });
            }
        });
    }
    // GET /api/categories/:id
    static getCategoryById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const category = yield categoryService_1.CategoryService.getCategoryById(id);
                if (!category) {
                    return res.status(404).json({
                        success: false,
                        message: 'Categoría no encontrada'
                    });
                }
                res.json({
                    success: true,
                    category,
                    message: 'Categoría obtenida exitosamente'
                });
            }
            catch (error) {
                console.error('Error en CategoryController.getCategoryById:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error interno del servidor'
                });
            }
        });
    }
    // GET /api/categories/slug/:slug
    static getCategoryBySlug(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { slug } = req.params;
                const category = yield categoryService_1.CategoryService.getCategoryBySlug(slug);
                if (!category) {
                    return res.status(404).json({
                        success: false,
                        message: 'Categoría no encontrada'
                    });
                }
                res.json({
                    success: true,
                    category,
                    message: 'Categoría obtenida exitosamente'
                });
            }
            catch (error) {
                console.error('Error en CategoryController.getCategoryBySlug:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error interno del servidor'
                });
            }
        });
    }
}
exports.CategoryController = CategoryController;
class ProductController {
    // GET /api/products
    static getAllProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filters = {
                    categoryId: req.query.categoryId,
                    searchQuery: req.query.search,
                    containerType: req.query.containerType,
                    priceMin: req.query.priceMin ? Number(req.query.priceMin) : undefined,
                    priceMax: req.query.priceMax ? Number(req.query.priceMax) : undefined,
                    supplierVerified: req.query.supplierVerified === 'true',
                    inStock: req.query.inStock === 'true',
                    page: req.query.page ? Number(req.query.page) : 1,
                    limit: req.query.limit ? Number(req.query.limit) : 20,
                    sortBy: req.query.sortBy,
                    sortOrder: req.query.sortOrder
                };
                const { products, total } = yield categoryService_1.ProductService.getAllProducts(filters);
                res.json({
                    success: true,
                    products,
                    total,
                    page: filters.page || 1,
                    limit: filters.limit || 20,
                    message: 'Productos obtenidos exitosamente'
                });
            }
            catch (error) {
                console.error('Error en ProductController.getAllProducts:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error interno del servidor'
                });
            }
        });
    }
    // GET /api/products/:id
    static getProductById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const product = yield categoryService_1.ProductService.getProductById(id);
                if (!product) {
                    return res.status(404).json({
                        success: false,
                        message: 'Producto no encontrado'
                    });
                }
                res.json({
                    success: true,
                    product,
                    message: 'Producto obtenido exitosamente'
                });
            }
            catch (error) {
                console.error('Error en ProductController.getProductById:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error interno del servidor'
                });
            }
        });
    }
    // GET /api/products/category/:categoryId
    static getProductsByCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId } = req.params;
                const filters = {
                    categoryId,
                    searchQuery: req.query.search,
                    containerType: req.query.containerType,
                    priceMin: req.query.priceMin ? Number(req.query.priceMin) : undefined,
                    priceMax: req.query.priceMax ? Number(req.query.priceMax) : undefined,
                    supplierVerified: req.query.supplierVerified === 'true',
                    inStock: req.query.inStock === 'true',
                    page: req.query.page ? Number(req.query.page) : 1,
                    limit: req.query.limit ? Number(req.query.limit) : 20,
                    sortBy: req.query.sortBy,
                    sortOrder: req.query.sortOrder
                };
                const { products, total } = yield categoryService_1.ProductService.getProductsByCategory(categoryId, filters);
                res.json({
                    success: true,
                    products,
                    total,
                    page: filters.page || 1,
                    limit: filters.limit || 20,
                    message: `Productos de la categoría obtenidos exitosamente`
                });
            }
            catch (error) {
                console.error('Error en ProductController.getProductsByCategory:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error interno del servidor'
                });
            }
        });
    }
    // GET /api/products/search/:query
    static searchProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { query } = req.params;
                const filters = {
                    searchQuery: query,
                    categoryId: req.query.categoryId,
                    containerType: req.query.containerType,
                    priceMin: req.query.priceMin ? Number(req.query.priceMin) : undefined,
                    priceMax: req.query.priceMax ? Number(req.query.priceMax) : undefined,
                    supplierVerified: req.query.supplierVerified === 'true',
                    inStock: req.query.inStock === 'true',
                    page: req.query.page ? Number(req.query.page) : 1,
                    limit: req.query.limit ? Number(req.query.limit) : 20,
                    sortBy: req.query.sortBy,
                    sortOrder: req.query.sortOrder
                };
                const { products, total } = yield categoryService_1.ProductService.searchProducts(query, filters);
                res.json({
                    success: true,
                    products,
                    total,
                    page: filters.page || 1,
                    limit: filters.limit || 20,
                    query,
                    message: `Búsqueda completada: ${total} productos encontrados`
                });
            }
            catch (error) {
                console.error('Error en ProductController.searchProducts:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error interno del servidor'
                });
            }
        });
    }
    // GET /api/products/supplier/:supplierId
    static getProductsBySupplierId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { supplierId } = req.params;
                const products = yield categoryService_1.ProductService.getProductsBySupplierId(supplierId);
                res.json({
                    success: true,
                    products,
                    total: products.length,
                    message: 'Productos del proveedor obtenidos exitosamente'
                });
            }
            catch (error) {
                console.error('Error en ProductController.getProductsBySupplierId:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error interno del servidor'
                });
            }
        });
    }
    // PUT /api/products/:id/stock
    static updateProductStock(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { stockContainers } = req.body;
                if (typeof stockContainers !== 'number' || stockContainers < 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'Stock debe ser un número mayor o igual a 0'
                    });
                }
                const updated = yield categoryService_1.ProductService.updateProductStock(id, stockContainers);
                if (!updated) {
                    return res.status(404).json({
                        success: false,
                        message: 'Producto no encontrado'
                    });
                }
                res.json({
                    success: true,
                    message: 'Stock actualizado exitosamente'
                });
            }
            catch (error) {
                console.error('Error en ProductController.updateProductStock:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error interno del servidor'
                });
            }
        });
    }
    // GET /api/products/featured
    static getFeaturedProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const limit = req.query.limit ? Number(req.query.limit) : 8;
                // Obtener productos destacados (con más vistas/consultas)
                const { products } = yield categoryService_1.ProductService.getAllProducts({
                    sortBy: 'popularity',
                    sortOrder: 'desc',
                    limit,
                    inStock: true
                });
                res.json({
                    success: true,
                    products,
                    message: 'Productos destacados obtenidos exitosamente'
                });
            }
            catch (error) {
                console.error('Error en ProductController.getFeaturedProducts:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error interno del servidor'
                });
            }
        });
    }
    // GET /api/products/new
    static getNewProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const limit = req.query.limit ? Number(req.query.limit) : 8;
                // Obtener productos más recientes
                const { products } = yield categoryService_1.ProductService.getAllProducts({
                    sortBy: 'createdAt',
                    sortOrder: 'desc',
                    limit,
                    inStock: true
                });
                res.json({
                    success: true,
                    products,
                    message: 'Productos nuevos obtenidos exitosamente'
                });
            }
            catch (error) {
                console.error('Error en ProductController.getNewProducts:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error interno del servidor'
                });
            }
        });
    }
}
exports.ProductController = ProductController;
