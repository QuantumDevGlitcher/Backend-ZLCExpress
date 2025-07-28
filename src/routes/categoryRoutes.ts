import { Router } from 'express';
import {
  getCategories,
  getCategoryById,
  getCategoryTree,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryPrismaController';
import { getProductsByCategory } from '../controllers/productPgController';

const router = Router();

// ===== RUTAS DE CATEGORÍAS CON PRISMA =====

// GET /api/categories - Obtener todas las categorías
router.get('/categories', getCategories);

// GET /api/categories/tree - Obtener árbol de categorías
router.get('/categories/tree', getCategoryTree);

// GET /api/categories/:id - Obtener categoría por ID
router.get('/categories/:id', getCategoryById);

// POST /api/categories - Crear nueva categoría
router.post('/categories', createCategory);

// PUT /api/categories/:id - Actualizar categoría
router.put('/categories/:id', updateCategory);

// DELETE /api/categories/:id - Eliminar categoría
router.delete('/categories/:id', deleteCategory);

// GET /api/categories/:id/products - Listar productos de categoría
router.get('/categories/:id/products', getProductsByCategory);

export default router;
