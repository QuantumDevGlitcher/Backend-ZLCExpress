"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBatch = exports.getBatchesBySupplier = void 0;
const prismaService_1 = require("../services/prismaService");
// Obtener todos los lotes (productos) de un proveedor
const getBatchesBySupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { supplierId } = req.params;
        const page = parseInt(req.query.page || '1');
        const limit = parseInt(req.query.limit || '50');
        const result = yield prismaService_1.databaseService.getProducts({
            supplierId: parseInt(supplierId),
            page,
            limit
        });
        res.json({
            success: true,
            batches: result.products,
            total: result.pagination.total,
            page: result.pagination.currentPage,
            limit
        });
    }
    catch (error) {
        console.error('Error al obtener lotes por proveedor:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});
exports.getBatchesBySupplier = getBatchesBySupplier;
// Crear un nuevo lote (producto) para un proveedor
const createBatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { supplierId } = req.params;
        const batchData = Object.assign(Object.assign({}, req.body), { supplierId: parseInt(supplierId) });
        // Validaciones básicas
        if (!batchData.title || !batchData.price || !batchData.categoryId) {
            return res.status(400).json({
                success: false,
                message: 'Título, precio y categoría son requeridos'
            });
        }
        const newBatch = yield prismaService_1.databaseService.createProduct(batchData);
        res.status(201).json({
            success: true,
            message: 'Lote creado exitosamente',
            data: newBatch
        });
    }
    catch (error) {
        console.error('Error al crear lote:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});
exports.createBatch = createBatch;
