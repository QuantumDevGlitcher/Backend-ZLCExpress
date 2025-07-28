import { Router } from 'express';
import productRoutes from './productRoutes';
import cartRoutes from './cartRoutes';
import orderRoutes from './orderRoutes';
import authRoutes from './authRoutes';
import categoryRoutes from './categoryRoutes';
import rfqRoutes from './rfqRoutesSimple'; // Rutas RFQ simplificadas
import rfqRoutesNew from './rfqRoutesNew'; // Nuevas rutas con PostgreSQL
import freightRoutes from './freightRoutes';
import shippingRoutes from './shippingRoutes';
import quoteRoutes from './quoteRoutes';
import myQuotesRoutes from './myQuotesRoutes';
import quoteStatusRoutes from './quoteStatusRoutes'; // Nuevas rutas para estados de cotización
import paymentOrderRoutes from './paymentOrderRoutes';

const router = Router();

// Rutas de la API
console.log('🔗 Configurando rutas principales...');
router.use('/auth', authRoutes);
router.use('/', categoryRoutes); // Incluye tanto /categories como /products
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/rfq', rfqRoutesNew); // Usar las nuevas rutas con PostgreSQL
console.log('🔗 Configurando rutas de quotes...');
router.use('/quotes', quoteRoutes); // ✅ REACTIVADO PARA FUNCIONALIDAD REAL
router.use('/my-quotes', myQuotesRoutes);
router.use('/api', quoteStatusRoutes); // Rutas para gestión de estados de cotización
router.use('/payment-orders', paymentOrderRoutes);
router.use('/freight', freightRoutes);
router.use('/shipping', shippingRoutes);
console.log('✅ Todas las rutas configuradas');

// Ruta de prueba
router.get('/test', (req, res) => {
  res.json({ 
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Ruta de prueba específica para quotes
router.get('/quotes-test/:id', (req, res) => {
  console.log('🧪 Quotes test route - ID:', req.params.id);
  res.json({
    success: true,
    message: 'Quotes test route funcionando',
    id: req.params.id
  });
});

export default router;