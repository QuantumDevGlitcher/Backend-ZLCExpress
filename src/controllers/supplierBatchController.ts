import { Request, Response } from 'express';
import { databaseService } from '../services/prismaService';

// Obtener todos los lotes (productos) de un proveedor
export const getBatchesBySupplier = async (req: Request, res: Response) => {
  try {
    const { supplierId } = req.params;
    const page = parseInt((req.query.page as string) || '1');
    const limit = parseInt((req.query.limit as string) || '50');

    const result = await databaseService.getProducts({
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
  } catch (error: any) {
    console.error('Error al obtener lotes por proveedor:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Crear un nuevo lote (producto) para un proveedor
export const createBatch = async (req: Request, res: Response) => {
  try {
    const { supplierId } = req.params;
    const batchData = { ...req.body, supplierId: parseInt(supplierId) };

    // Validaciones básicas
    if (!batchData.title || !batchData.price || !batchData.categoryId) {
      return res.status(400).json({
        success: false,
        message: 'Título, precio y categoría son requeridos'
      });
    }

    const newBatch = await databaseService.createProduct(batchData);

    res.status(201).json({
      success: true,
      message: 'Lote creado exitosamente',
      data: newBatch
    });
  } catch (error: any) {
    console.error('Error al crear lote:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
