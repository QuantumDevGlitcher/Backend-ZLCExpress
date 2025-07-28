import { Request, Response } from 'express';
import { ProductPgService, NewProduct } from '../services/pg/productPgService';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const createProduct = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const supplierId = req.user!.id;
    const data = req.body as NewProduct;
    const product = await ProductPgService.createProduct(supplierId, data);
    res.status(201).json({ success: true, product });
  } catch (error: any) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, message: 'Error creating product' });
  }
};

export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = parseInt(req.params.id);
    const products = await ProductPgService.getProductsByCategory(categoryId);
    res.json({ success: true, products });
  } catch (error: any) {
    console.error('Error getting products by category:', error);
    res.status(500).json({ success: false, message: 'Error fetching products' });
  }
};
