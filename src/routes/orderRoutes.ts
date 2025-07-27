import { Router } from 'express';
import { 
  createOrder, 
  getOrders, 
  getOrderById, 
  updateOrderStatus,
  getOrdersByUser,
  cancelOrder 
} from '../controllers/orderPrismaController';

const router = Router();

// ===== RUTAS DE ÓRDENES CON PRISMA =====

// GET /api/orders - Obtener todas las órdenes con filtros
router.get('/', getOrders);

// GET /api/orders/user/:userId - Obtener órdenes de un usuario específico
router.get('/user/:userId', getOrdersByUser);

// GET /api/orders/:id - Obtener orden por ID
router.get('/:id', getOrderById);

// POST /api/orders - Crear nueva orden
router.post('/', createOrder);

// PUT /api/orders/:id/status - Actualizar estado de orden
router.put('/:id/status', updateOrderStatus);

// PUT /api/orders/:id/cancel - Cancelar orden
router.put('/:id/cancel', cancelOrder);

export default router;
