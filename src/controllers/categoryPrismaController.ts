import { Request, Response } from 'express';
import { databaseService } from '../services/prismaService';

// ================================================================
// CONTROLADOR DE CATEGORÍAS CON PRISMA
// ================================================================

export const getCategories = async (req: Request, res: Response) => {
  try {
    const { parentId, includeInactive } = req.query;
    
    const categories = await databaseService.getCategories({
      parentId: parentId ? parseInt(parentId as string) : undefined,
      includeInactive: includeInactive === 'true'
    });

    res.json({
      success: true,
      categories: categories,
      message: 'Categorías obtenidas exitosamente'
    });
  } catch (error: any) {
    console.error('❌ Error al obtener categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const category = await databaseService.getCategoryById(parseInt(id));
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error: any) {
    console.error('❌ Error al obtener categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getCategoryTree = async (req: Request, res: Response) => {
  try {
    const categoryTree = await databaseService.getCategoryTree();

    res.json({
      success: true,
      data: categoryTree
    });
  } catch (error: any) {
    console.error('❌ Error al obtener árbol de categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const categoryData = req.body;
    
    // Validaciones básicas
    if (!categoryData.name) {
      return res.status(400).json({
        success: false,
        message: 'El nombre de la categoría es requerido'
      });
    }

    const newCategory = await databaseService.createCategory(categoryData);
    
    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: newCategory
    });
  } catch (error: any) {
    console.error('❌ Error al crear categoría:', error);
    
    if (error.message.includes('Duplicate')) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe una categoría con ese nombre'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedCategory = await databaseService.updateCategory(
      parseInt(id), 
      updateData
    );
    
    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Categoría actualizada exitosamente',
      data: updatedCategory
    });
  } catch (error: any) {
    console.error('❌ Error al actualizar categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const deleted = await databaseService.deleteCategory(parseInt(id));
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Categoría eliminada exitosamente'
    });
  } catch (error: any) {
    console.error('❌ Error al eliminar categoría:', error);
    
    if (error.message.includes('products')) {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar la categoría porque tiene productos asociados'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
