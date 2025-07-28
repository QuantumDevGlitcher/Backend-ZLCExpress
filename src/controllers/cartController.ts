import { Request, Response } from 'express';
import { CartService } from '../services/cartService';

export class CartController {
  
  /**
   * Obtener carrito del usuario
   * GET /api/cart
   */
  static async getCart(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      
      console.log(`🛒 CartController: Obteniendo carrito para usuario ${userId}`);
      
      const cartItems = await CartService.getUserCartItems(userId);
      
      res.status(200).json({
        success: true,
        data: { items: cartItems }
      });
    } catch (error) {
      console.error('❌ Error getting cart:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener el carrito',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Obtener estadísticas del carrito
   * GET /api/cart/stats
   */
  static async getCartStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      
      console.log(`📊 CartController: Obteniendo estadísticas del carrito para usuario ${userId}`);
      
      const stats = await CartService.getUserCartStats(userId);
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('❌ Error getting cart stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener estadísticas del carrito',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Agregar producto al carrito
   * POST /api/cart/add
   */
  static async addToCart(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      
      const { 
        productId, 
        containerQuantity, 
        containerType, 
        pricePerContainer,
        incoterm, 
        customPrice, 
        notes 
      } = req.body;
      
      console.log('🛒 CartController: Agregando al carrito:', {
        userId,
        productId,
        containerQuantity,
        containerType,
        pricePerContainer,
        incoterm,
        customPrice,
        notes
      });
      
      // Validación básica
      if (!productId || !containerQuantity || !containerType || !pricePerContainer || !incoterm) {
        res.status(400).json({
          success: false,
          message: 'Datos requeridos: productId, containerQuantity, containerType, pricePerContainer, incoterm'
        });
        return;
      }

      const cartItem = await CartService.addToCart({
        userId,
        productId: parseInt(productId),
        containerQuantity: parseInt(containerQuantity),
        containerType,
        pricePerContainer: parseFloat(pricePerContainer),
        incoterm,
        customPrice: customPrice ? parseFloat(customPrice) : undefined,
        notes
      });

      res.status(201).json({
        success: true,
        message: 'Producto agregado al carrito',
        data: cartItem
      });
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      res.status(500).json({
        success: false,
        message: 'Error al agregar al carrito',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Actualizar item del carrito
   * PUT /api/cart/update/:itemId
   */
  static async updateCartItem(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const { itemId } = req.params;
      const { containerQuantity, customPrice, notes } = req.body;
      
      console.log(`🔄 CartController: Actualizando item ${itemId} para usuario ${userId}`);
      
      if (!containerQuantity || containerQuantity < 1) {
        res.status(400).json({
          success: false,
          message: 'La cantidad de contenedores debe ser mayor a 0'
        });
        return;
      }

      const updatedItem = await CartService.updateCartItem(itemId, userId, {
        containerQuantity: parseInt(containerQuantity),
        customPrice: customPrice ? parseFloat(customPrice) : undefined,
        notes
      });
      
      res.status(200).json({
        success: true,
        message: 'Item del carrito actualizado',
        data: updatedItem
      });
    } catch (error) {
      console.error('❌ Error updating cart item:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar item del carrito',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Eliminar item del carrito
   * DELETE /api/cart/remove/:itemId
   */
  static async removeFromCart(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const { itemId } = req.params;
      
      console.log(`🗑️ CartController: Eliminando item ${itemId} para usuario ${userId}`);
      
      await CartService.removeFromCart(itemId, userId);
      
      res.status(200).json({
        success: true,
        message: 'Item eliminado del carrito'
      });
    } catch (error) {
      console.error('❌ Error removing from cart:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar item del carrito',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Limpiar carrito
   * DELETE /api/cart/clear
   */
  static async clearCart(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      
      console.log(`🧹 CartController: Limpiando carrito para usuario ${userId}`);
      
      const deletedCount = await CartService.clearUserCart(userId);
      
      res.status(200).json({
        success: true,
        message: `${deletedCount} items eliminados del carrito`
      });
    } catch (error) {
      console.error('❌ Error clearing cart:', error);
      res.status(500).json({
        success: false,
        message: 'Error al limpiar carrito',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
