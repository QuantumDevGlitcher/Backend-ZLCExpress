import { Request, Response } from 'express';
import { ProductService } from '../services/productService';

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const filters = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
      search: req.query.search as string,
      category: req.query.category as string,
      priceMin: req.query.priceMin ? parseFloat(req.query.priceMin as string) : undefined,
      priceMax: req.query.priceMax ? parseFloat(req.query.priceMax as string) : undefined,
      containerType: req.query.containerType as string,
      incoterm: req.query.incoterm as string,
      isNegotiable: req.query.isNegotiable === 'true',
      allowsCustomOrders: req.query.allowsCustomOrders === 'true',
      sortBy: req.query.sortBy as any,
      sortOrder: req.query.sortOrder as 'asc' | 'desc'
    };

    console.log('🔄 ProductController.getAllProducts called');
    const result = await ProductService.getAllProducts(filters);
    
    // Debug logging
    if (result.success && result.products && result.products.length > 0) {
      const firstProduct = result.products[0];
      console.log(`📦 First product debug:`);
      console.log(`   ID: ${firstProduct.id}`);
      console.log(`   name: "${firstProduct.name}"`);
      console.log(`   name type: ${typeof firstProduct.name}`);
      console.log(`   pricePerContainer: ${firstProduct.pricePerContainer}`);
      
      // Si el nombre sigue siendo undefined, forzar a usar un nombre por defecto
      result.products = result.products.map(product => ({
        ...product,
        name: product.name || `Producto ID ${product.id}` // Fallback temporal
      }));
      
      console.log(`📦 After fallback - name: "${result.products[0].name}"`);
    }
    
    res.json(result);
  } catch (error: any) {
    console.error('❌ ProductController error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      products: [],
      total: 0
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await ProductService.getProductById(id);
    
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const products = await ProductService.getProductsByCategory(category);
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
