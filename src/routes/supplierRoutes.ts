import { Router } from 'express';
import { getBatchesBySupplier, createBatch } from '../controllers/supplierBatchController';

const router = Router();

// Obtener todos los lotes de un proveedor
router.get('/:supplierId/batches', getBatchesBySupplier);

// Crear un nuevo lote para un proveedor
router.post('/:supplierId/batches', createBatch);

export default router;
