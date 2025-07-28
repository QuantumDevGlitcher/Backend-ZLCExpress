import { Router } from 'express';
import { RFQControllerNew as RFQController } from '../controllers/rfqControllerNew';

const router = Router();

// Ruta de debug (comentada por ahora)
// router.post('/debug', RFQController.debugRFQ);

// Llenar carrito con datos de prueba (comentada por ahora)
// router.post('/test/fill-cart', RFQController.fillTestCart);

// Obtener estadísticas de cotizaciones (debe ir antes de /:id)
router.get('/stats', RFQController.getQuoteStats);

// Obtener todas las cotizaciones del usuario (ruta alternativa)
router.get('/quotes', RFQController.getMyQuotes);

// Obtener estadísticas de cotizaciones (ruta alternativa)
router.get('/quotes/stats', RFQController.getQuoteStats);

// Obtener cotizaciones para MyQuotes (nueva ruta)
router.get('/myquotes', RFQController.getMyQuotes);

// Enviar cotización desde carrito
router.post('/cart/quote', RFQController.sendCartQuote);

// Crear nueva RFQ con PostgreSQL
router.post('/', RFQController.createRFQ);

// Obtener todas las cotizaciones del usuario (ruta por defecto)
router.get('/', RFQController.getMyQuotes);

// Obtener todas las RFQs (admin) - usando getAllQuotes no getRFQ
// router.get('/:id', RFQController.getAllRFQs);

export default router;
