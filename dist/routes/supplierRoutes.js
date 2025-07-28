"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supplierBatchController_1 = require("../controllers/supplierBatchController");
const router = (0, express_1.Router)();
// Obtener todos los lotes de un proveedor
router.get('/:supplierId/batches', supplierBatchController_1.getBatchesBySupplier);
// Crear un nuevo lote para un proveedor
router.post('/:supplierId/batches', supplierBatchController_1.createBatch);
exports.default = router;
