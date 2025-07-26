import { Router } from 'express';
import { CategoryController, ProductController } from '../controllers/categoryController';

const router = Router();

// ===== RUTAS DE CATEGORÍAS =====

// GET /api/categories - Obtener todas las categorías con subcategorías
router.get('/categories', CategoryController.getAllCategories);

// GET /api/categories/:id - Obtener categoría por ID
router.get('/categories/:id', CategoryController.getCategoryById);

// GET /api/categories/slug/:slug - Obtener categoría por slug
router.get('/categories/slug/:slug', CategoryController.getCategoryBySlug);

// ===== RUTAS DE PRODUCTOS =====

// GET /api/products - Obtener todos los productos con filtros
router.get('/products', ProductController.getAllProducts);

// GET /api/products/featured - Obtener productos destacados
router.get('/products/featured', ProductController.getFeaturedProducts);

// GET /api/products/new - Obtener productos nuevos
router.get('/products/new', ProductController.getNewProducts);

// GET /api/products/search/:query - Buscar productos
router.get('/products/search/:query', ProductController.searchProducts);

// GET /api/products/category/:categoryId - Obtener productos por categoría
router.get('/products/category/:categoryId', ProductController.getProductsByCategory);

// GET /api/products/supplier/:supplierId - Obtener productos por proveedor
router.get('/products/supplier/:supplierId', ProductController.getProductsBySupplierId);

// GET /api/products/:id - Obtener producto por ID (debe ir al final)
router.get('/products/:id', ProductController.getProductById);

// PUT /api/products/:id/stock - Actualizar stock de producto
router.put('/products/:id/stock', ProductController.updateProductStock);

export default router;
