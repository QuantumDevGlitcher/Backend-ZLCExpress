"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productPrismaController_1 = require("../controllers/productPrismaController");
const router = (0, express_1.Router)();
// ===== RUTAS DE PRODUCTOS CON PRISMA =====
// GET /api/products - Obtener todos los productos con filtros
router.get('/', productPrismaController_1.getProducts);
// GET /api/products/featured - Obtener productos destacados
router.get('/featured', productPrismaController_1.getFeaturedProducts);
// GET /api/products/new - Obtener productos nuevos
router.get('/new', productPrismaController_1.getNewProducts);
// GET /api/products/search/:query - Buscar productos
router.get('/search/:query', productPrismaController_1.searchProducts);
// GET /api/products/:id - Obtener producto por ID (debe ir al final)
router.get('/:id', productPrismaController_1.getProductById);
// POST /api/products - Crear nuevo producto
router.post('/', productPrismaController_1.createProduct);
// PUT /api/products/:id - Actualizar producto
router.put('/:id', productPrismaController_1.updateProduct);
// DELETE /api/products/:id - Eliminar producto
router.delete('/:id', productPrismaController_1.deleteProduct);
exports.default = router;
