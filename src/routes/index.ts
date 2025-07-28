import { Router } from 'express';
import productRoutes from './productRoutes';
import cartRoutes from './cartRoutes';
import orderRoutes from './orderRoutes';
import authRoutes from './authRoutes';
import categoryRoutes from './categoryRoutes';
import rfqRoutes from './rfqRoutes';
import freightRoutes from './freightRoutes';
import supplierRoutes from './supplierRoutes';

const router = Router();

// Rutas de la API
router.use('/auth', authRoutes);
router.use('/', categoryRoutes); // Incluye tanto /categories como /products
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/rfq', rfqRoutes);
router.use('/freight', freightRoutes);
router.use('/suppliers', supplierRoutes);

// Ruta de prueba
router.get('/test', (req, res) => {
  res.json({
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

export default router;
