import { Router } from 'express';
import { RFQController } from '../controllers/rfqControllerSimple';

const router = Router();

// Rutas simplificadas para RFQ
router.post('/test', RFQController.debugRFQ);                        // Test endpoint
router.post('/', RFQController.createRFQ);                           // Crear RFQ
router.get('/', RFQController.getAllRFQs);                           // Obtener RFQs del usuario
router.get('/:id', RFQController.getRFQById);                        // Obtener RFQ por ID

export default router;
