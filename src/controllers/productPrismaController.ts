import { Request, Response } from 'express';
import { databaseService } from '../services/prismaService';

// ================================================================
// CONTROLADOR DE PRODUCTOS CON PRISMA
// ================================================================

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { 
      categoryId, 
      supplierId, 
      minPrice, 
      maxPrice, 
      status,
      featured,
      page = 1,
      limit = 50
    } = req.query;

    // Construir filtros
    const filters: any = {
      page: parseInt(page as string),
      limit: parseInt(limit as string)
    };
    
    if (categoryId) {
      filters.categoryId = parseInt(categoryId as string);
    }
    
    if (supplierId) {
      filters.supplierId = parseInt(supplierId as string);
    }
    
    if (minPrice) {
      filters.minPrice = parseFloat(minPrice as string);
    }
    
    if (maxPrice) {
      filters.maxPrice = parseFloat(maxPrice as string);
    }
    
    if (status) {
      filters.status = status as string;
    }
    
    if (featured === 'true') {
      filters.featured = true;
    }

    // Obtener productos con filtros
    const result = await databaseService.getProducts(filters);

    res.json({
      success: true,
      products: result.products,
      total: result.pagination.total,
      page: result.pagination.currentPage,
      limit: filters.limit || 50,
      message: 'Productos obtenidos exitosamente'
    });
  } catch (error: any) {
    console.error('❌ Error al obtener productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const product = await databaseService.getProductById(parseInt(id));
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      product: product,
      message: 'Producto obtenido exitosamente'
    });
  } catch (error: any) {
    console.error('❌ Error al obtener producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getFeaturedProducts = async (req: Request, res: Response) => {
  try {
    const { limit = 12 } = req.query;
    
    const products = await databaseService.getFeaturedProducts(parseInt(limit as string));

    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error: any) {
    console.error('❌ Error al obtener productos destacados:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getNewProducts = async (req: Request, res: Response) => {
  try {
    const { limit = 12, days = 30 } = req.query;
    
    const products = await databaseService.getNewProducts(
      parseInt(limit as string),
      parseInt(days as string)
    );

    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error: any) {
    console.error('❌ Error al obtener productos nuevos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const searchProducts = async (req: Request, res: Response) => {
  try {
    const { query } = req.params;
    const { limit = 50 } = req.query;
    
    const products = await databaseService.searchProducts(
      query,
      parseInt(limit as string)
    );

    res.json({
      success: true,
      data: products,
      count: products.length,
      query: query
    });
  } catch (error: any) {
    console.error('❌ Error al buscar productos:', error);
    
    if (error.message.includes('al menos 2 caracteres')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const productData = req.body;
    
    // Validaciones básicas
    if (!productData.name || !productData.price || !productData.categoryId || !productData.supplierId) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, precio, categoría y proveedor son requeridos'
      });
    }

    const newProduct = await databaseService.createProduct(productData);
    
    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: newProduct
    });
  } catch (error: any) {
    console.error('❌ Error al crear producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedProduct = await databaseService.updateProduct(
      parseInt(id), 
      updateData
    );
    
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: updatedProduct
    });
  } catch (error: any) {
    console.error('❌ Error al actualizar producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const deleted = await databaseService.deleteProduct(parseInt(id));
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Producto eliminado exitosamente'
    });
  } catch (error: any) {
    console.error('❌ Error al eliminar producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
