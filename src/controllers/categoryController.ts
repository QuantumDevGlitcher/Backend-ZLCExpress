import { Request, Response } from 'express';
import { CategoryService, ProductService } from '../services/categoryService';
import { ProductFilters } from '../types/categories';

export class CategoryController {
  // GET /api/categories
  static async getAllCategories(req: Request, res: Response) {
    try {
      const categories = await CategoryService.getAllCategories();

      res.json({
        success: true,
        categories,
        message: 'Categorías obtenidas exitosamente'
      });
    } catch (error: any) {
      console.error('Error en CategoryController.getAllCategories:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // GET /api/categories/:id
  static async getCategoryById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const category = await CategoryService.getCategoryById(id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Categoría no encontrada'
        });
      }

      res.json({
        success: true,
        category,
        message: 'Categoría obtenida exitosamente'
      });
    } catch (error: any) {
      console.error('Error en CategoryController.getCategoryById:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // GET /api/categories/slug/:slug
  static async getCategoryBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const category = await CategoryService.getCategoryBySlug(slug);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Categoría no encontrada'
        });
      }

      res.json({
        success: true,
        category,
        message: 'Categoría obtenida exitosamente'
      });
    } catch (error: any) {
      console.error('Error en CategoryController.getCategoryBySlug:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}

export class ProductController {
  // GET /api/products
  static async getAllProducts(req: Request, res: Response) {
    try {
      const filters: ProductFilters = {
        categoryId: req.query.categoryId as string,
        searchQuery: req.query.search as string,
        containerType: req.query.containerType as string,
        priceMin: req.query.priceMin ? Number(req.query.priceMin) : undefined,
        priceMax: req.query.priceMax ? Number(req.query.priceMax) : undefined,
        supplierVerified: req.query.supplierVerified === 'true',
        inStock: req.query.inStock === 'true',
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 20,
        sortBy: req.query.sortBy as any,
        sortOrder: req.query.sortOrder as 'asc' | 'desc'
      };

      const { products, total } = await ProductService.getAllProducts(filters);

      res.json({
        success: true,
        products,
        total,
        page: filters.page || 1,
        limit: filters.limit || 20,
        message: 'Productos obtenidos exitosamente'
      });
    } catch (error: any) {
      console.error('Error en ProductController.getAllProducts:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // GET /api/products/:id
  static async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await ProductService.getProductById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Producto no encontrado'
        });
      }

      res.json({
        success: true,
        product,
        message: 'Producto obtenido exitosamente'
      });
    } catch (error: any) {
      console.error('Error en ProductController.getProductById:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // GET /api/products/category/:categoryId
  static async getProductsByCategory(req: Request, res: Response) {
    try {
      const { categoryId } = req.params;
      
      const filters: ProductFilters = {
        categoryId,
        searchQuery: req.query.search as string,
        containerType: req.query.containerType as string,
        priceMin: req.query.priceMin ? Number(req.query.priceMin) : undefined,
        priceMax: req.query.priceMax ? Number(req.query.priceMax) : undefined,
        supplierVerified: req.query.supplierVerified === 'true',
        inStock: req.query.inStock === 'true',
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 20,
        sortBy: req.query.sortBy as any,
        sortOrder: req.query.sortOrder as 'asc' | 'desc'
      };

      const { products, total } = await ProductService.getProductsByCategory(categoryId, filters);

      res.json({
        success: true,
        products,
        total,
        page: filters.page || 1,
        limit: filters.limit || 20,
        message: `Productos de la categoría obtenidos exitosamente`
      });
    } catch (error: any) {
      console.error('Error en ProductController.getProductsByCategory:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // GET /api/products/search/:query
  static async searchProducts(req: Request, res: Response) {
    try {
      const { query } = req.params;
      
      const filters: ProductFilters = {
        searchQuery: query,
        categoryId: req.query.categoryId as string,
        containerType: req.query.containerType as string,
        priceMin: req.query.priceMin ? Number(req.query.priceMin) : undefined,
        priceMax: req.query.priceMax ? Number(req.query.priceMax) : undefined,
        supplierVerified: req.query.supplierVerified === 'true',
        inStock: req.query.inStock === 'true',
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 20,
        sortBy: req.query.sortBy as any,
        sortOrder: req.query.sortOrder as 'asc' | 'desc'
      };

      const { products, total } = await ProductService.searchProducts(query, filters);

      res.json({
        success: true,
        products,
        total,
        page: filters.page || 1,
        limit: filters.limit || 20,
        query,
        message: `Búsqueda completada: ${total} productos encontrados`
      });
    } catch (error: any) {
      console.error('Error en ProductController.searchProducts:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // GET /api/products/supplier/:supplierId
  static async getProductsBySupplierId(req: Request, res: Response) {
    try {
      const { supplierId } = req.params;
      const products = await ProductService.getProductsBySupplierId(supplierId);

      res.json({
        success: true,
        products,
        total: products.length,
        message: 'Productos del proveedor obtenidos exitosamente'
      });
    } catch (error: any) {
      console.error('Error en ProductController.getProductsBySupplierId:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // PUT /api/products/:id/stock
  static async updateProductStock(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { stockContainers } = req.body;

      if (typeof stockContainers !== 'number' || stockContainers < 0) {
        return res.status(400).json({
          success: false,
          message: 'Stock debe ser un número mayor o igual a 0'
        });
      }

      const updated = await ProductService.updateProductStock(id, stockContainers);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Producto no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Stock actualizado exitosamente'
      });
    } catch (error: any) {
      console.error('Error en ProductController.updateProductStock:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // GET /api/products/featured
  static async getFeaturedProducts(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 8;
      
      // Obtener productos destacados (con más vistas/consultas)
      const { products } = await ProductService.getAllProducts({
        sortBy: 'popularity',
        sortOrder: 'desc',
        limit,
        inStock: true
      });

      res.json({
        success: true,
        products,
        message: 'Productos destacados obtenidos exitosamente'
      });
    } catch (error: any) {
      console.error('Error en ProductController.getFeaturedProducts:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // GET /api/products/new
  static async getNewProducts(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 8;
      
      // Obtener productos más recientes
      const { products } = await ProductService.getAllProducts({
        sortBy: 'createdAt',
        sortOrder: 'desc',
        limit,
        inStock: true
      });

      res.json({
        success: true,
        products,
        message: 'Productos nuevos obtenidos exitosamente'
      });
    } catch (error: any) {
      console.error('Error en ProductController.getNewProducts:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}
