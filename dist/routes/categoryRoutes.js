"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryController_1 = require("../controllers/categoryController");
const router = (0, express_1.Router)();
// ===== RUTAS DE CATEGORÍAS =====
// GET /api/categories - Obtener todas las categorías con subcategorías
router.get('/categories', categoryController_1.CategoryController.getAllCategories);
// GET /api/categories/:id - Obtener categoría por ID
router.get('/categories/:id', categoryController_1.CategoryController.getCategoryById);
// GET /api/categories/slug/:slug - Obtener categoría por slug
router.get('/categories/slug/:slug', categoryController_1.CategoryController.getCategoryBySlug);
// ===== RUTAS DE PRODUCTOS =====
// GET /api/products - Obtener todos los productos con filtros
router.get('/products', categoryController_1.ProductController.getAllProducts);
// GET /api/products/featured - Obtener productos destacados
router.get('/products/featured', categoryController_1.ProductController.getFeaturedProducts);
// GET /api/products/new - Obtener productos nuevos
router.get('/products/new', categoryController_1.ProductController.getNewProducts);
// GET /api/products/search/:query - Buscar productos
router.get('/products/search/:query', categoryController_1.ProductController.searchProducts);
// GET /api/products/category/:categoryId - Obtener productos por categoría
router.get('/products/category/:categoryId', categoryController_1.ProductController.getProductsByCategory);
// GET /api/products/supplier/:supplierId - Obtener productos por proveedor
router.get('/products/supplier/:supplierId', categoryController_1.ProductController.getProductsBySupplierId);
// GET /api/products/:id - Obtener producto por ID (debe ir al final)
router.get('/products/:id', categoryController_1.ProductController.getProductById);
// PUT /api/products/:id/stock - Actualizar stock de producto
router.put('/products/:id/stock', categoryController_1.ProductController.updateProductStock);
exports.default = router;
