// ================================================================
// CART SERVICE - SERVICIO COMPLETAMENTE INDIVIDUALIZADO
// ================================================================
// Descripción: Servicio que garantiza separación total de datos por usuario
// Sistema tipo Amazon: Cada usuario solo ve su propio carrito

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CartItemData {
  userId: number;
  productId: number;
  containerType: string;
  containerQuantity: number;
  pricePerContainer: number;
  incoterm: string;
  customPrice?: number;
  notes?: string;
}

export interface CartItemWithDetails {
  id: string;
  userId: number;
  productId: number;
  containerType: string;
  containerQuantity: number;
  pricePerContainer: number;
  currency: string;
  incoterm: string;
  customPrice?: number | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
  product: {
    id: number;
    title: string;
    price: number;
    currency: string;
    images: string[];
    supplier: {
      id: number;
      companyName: string;
    };
  };
}

// Función auxiliar para convertir Decimal a number
function convertCartItemForResponse(cartItem: any): CartItemWithDetails {
  return {
    ...cartItem,
    pricePerContainer: typeof cartItem.pricePerContainer === 'object' ? parseFloat(cartItem.pricePerContainer.toString()) : cartItem.pricePerContainer,
    customPrice: cartItem.customPrice ? (typeof cartItem.customPrice === 'object' ? parseFloat(cartItem.customPrice.toString()) : cartItem.customPrice) : null,
    product: {
      ...cartItem.product,
      price: typeof cartItem.product.price === 'object' ? parseFloat(cartItem.product.price.toString()) : cartItem.product.price
    }
  };
}

export class CartService {
  /**
   * 🛒 Obtener items del carrito del usuario
   */
  static async getUserCartItems(userId: number): Promise<CartItemWithDetails[]> {
    try {
      console.log(`🛒 CartService: Obteniendo carrito para usuario ${userId}`);

      const cartItems = await prisma.cartItem.findMany({
        where: { userId: userId }, // ✅ FILTRO CRÍTICO
        include: {
          product: {
            include: {
              supplier: {
                select: {
                  id: true,
                  companyName: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      console.log(`✅ CartService: ${cartItems.length} items obtenidos para usuario ${userId}`);
      return cartItems.map(item => convertCartItemForResponse(item));

    } catch (error) {
      console.error('❌ CartService: Error obteniendo carrito:', error);
      throw error;
    }
  }

  /**
   * ➕ Agregar al carrito
   */
  static async addToCart(cartData: CartItemData): Promise<CartItemWithDetails> {
    try {
      console.log(`➕ CartService: Agregando producto ${cartData.productId} al carrito del usuario ${cartData.userId}`);

      // Verificar si el producto ya está en el carrito
      const existingItem = await prisma.cartItem.findFirst({
        where: {
          userId: cartData.userId,
          productId: cartData.productId,
          containerType: cartData.containerType,
          incoterm: cartData.incoterm
        }
      });

      let cartItem;

      if (existingItem) {
        // Actualizar cantidad si ya existe
        cartItem = await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: {
            containerQuantity: existingItem.containerQuantity + cartData.containerQuantity,
            updatedAt: new Date()
          },
          include: {
            product: {
              include: {
                supplier: {
                  select: {
                    id: true,
                    companyName: true
                  }
                }
              }
            }
          }
        });
      } else {
        // Crear nuevo item
        cartItem = await prisma.cartItem.create({
          data: {
            userId: cartData.userId, // ✅ ASIGNACIÓN CRÍTICA
            productId: cartData.productId,
            containerType: cartData.containerType,
            containerQuantity: cartData.containerQuantity,
            pricePerContainer: cartData.pricePerContainer,
            incoterm: cartData.incoterm,
            customPrice: cartData.customPrice,
            notes: cartData.notes
          },
          include: {
            product: {
              include: {
                supplier: {
                  select: {
                    id: true,
                    companyName: true
                  }
                }
              }
            }
          }
        });
      }

      console.log(`✅ CartService: Producto agregado al carrito del usuario ${cartData.userId}`);
      return convertCartItemForResponse(cartItem);

    } catch (error) {
      console.error('❌ CartService: Error agregando al carrito:', error);
      throw error;
    }
  }

  /**
   * 🔄 Actualizar item del carrito (solo si pertenece al usuario)
   */
  static async updateCartItem(cartItemId: string, userId: number, updateData: Partial<CartItemData>): Promise<CartItemWithDetails> {
    try {
      console.log(`🔄 CartService: Actualizando item ${cartItemId} del carrito del usuario ${userId}`);

      // Verificar que el item pertenece al usuario
      const existingItem = await prisma.cartItem.findFirst({
        where: {
          id: cartItemId,
          userId: userId // ✅ VALIDACIÓN CRÍTICA
        }
      });

      if (!existingItem) {
        throw new Error('Item del carrito no encontrado o no pertenece al usuario');
      }

      const cartItem = await prisma.cartItem.update({
        where: { id: cartItemId },
        data: {
          ...updateData,
          updatedAt: new Date()
        },
        include: {
          product: {
            include: {
              supplier: {
                select: {
                  id: true,
                  companyName: true
                }
              }
            }
          }
        }
      });

      console.log(`✅ CartService: Item del carrito actualizado`);
      return convertCartItemForResponse(cartItem);

    } catch (error) {
      console.error('❌ CartService: Error actualizando item del carrito:', error);
      throw error;
    }
  }

  /**
   * 🗑️ Eliminar item del carrito (solo si pertenece al usuario)
   */
  static async removeFromCart(cartItemId: string, userId: number): Promise<boolean> {
    try {
      console.log(`🗑️ CartService: Eliminando item ${cartItemId} del carrito del usuario ${userId}`);

      // Verificar que el item pertenece al usuario
      const existingItem = await prisma.cartItem.findFirst({
        where: {
          id: cartItemId,
          userId: userId // ✅ VALIDACIÓN CRÍTICA
        }
      });

      if (!existingItem) {
        throw new Error('Item del carrito no encontrado o no pertenece al usuario');
      }

      await prisma.cartItem.delete({
        where: { id: cartItemId }
      });

      console.log(`✅ CartService: Item eliminado del carrito del usuario ${userId}`);
      return true;

    } catch (error) {
      console.error('❌ CartService: Error eliminando item del carrito:', error);
      throw error;
    }
  }

  /**
   * 🧹 Limpiar carrito del usuario
   */
  static async clearUserCart(userId: number): Promise<number> {
    try {
      console.log(`🧹 CartService: Limpiando carrito del usuario ${userId}`);

      const result = await prisma.cartItem.deleteMany({
        where: { userId: userId } // ✅ FILTRO CRÍTICO
      });

      console.log(`✅ CartService: ${result.count} items eliminados del carrito del usuario ${userId}`);
      return result.count;

    } catch (error) {
      console.error('❌ CartService: Error limpiando carrito:', error);
      throw error;
    }
  }

  /**
   * 📊 Obtener estadísticas del carrito del usuario
   */
  static async getUserCartStats(userId: number): Promise<{
    totalItems: number;
    totalContainers: number;
    estimatedTotal: number;
  }> {
    try {
      console.log(`📊 CartService: Obteniendo estadísticas del carrito para usuario ${userId}`);

      const cartItems = await this.getUserCartItems(userId);

      const totalItems = cartItems.length;
      const totalContainers = cartItems.reduce((sum, item) => sum + item.containerQuantity, 0);
      const estimatedTotal = cartItems.reduce((sum, item) => 
        sum + (item.customPrice || item.pricePerContainer) * item.containerQuantity, 0
      );

      const stats = { totalItems, totalContainers, estimatedTotal };
      console.log(`✅ CartService: Estadísticas del carrito obtenidas:`, stats);
      
      return stats;

    } catch (error) {
      console.error('❌ CartService: Error obteniendo estadísticas del carrito:', error);
      throw error;
    }
  }
}

export default CartService;