import { Router } from 'express';
import { 
  getProducts, 
  getProductById, 
  getFeaturedProducts,
  getNewProducts,
  searchProducts,
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productPrismaController';

const router = Router();

// ===== RUTAS DE PRODUCTOS CON PRISMA =====

// GET /api/products - Obtener todos los productos con filtros
router.get('/', getProducts);

// GET /api/products/featured - Obtener productos destacados
router.get('/featured', getFeaturedProducts);

// GET /api/products/new - Obtener productos nuevos
router.get('/new', getNewProducts);

// GET /api/products/search/:query - Buscar productos
router.get('/search/:query', searchProducts);

// GET /api/products/:id - Obtener producto por ID (debe ir al final)
router.get('/:id', getProductById);

// POST /api/products - Crear nuevo producto
router.post('/', createProduct);

// PUT /api/products/:id - Actualizar producto
router.put('/:id', updateProduct);

// DELETE /api/products/:id - Eliminar producto
router.delete('/:id', deleteProduct);

export default router;
