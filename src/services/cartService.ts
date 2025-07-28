import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Tipos para el carrito
export interface CartItem {
  id: string;
  userId: number;
  productId: number;
  productTitle: string;
  productDescription: string;
  productImage: string;
  supplierName: string;
  supplierId: number;
  containerType: string;
  containerQuantity: number;
  pricePerContainer: number;
  currency: string;
  incoterm: string;
  customPrice?: number;
  notes?: string;
  moq: number;
  unitsPerContainer: number;
  addedAt: Date;
  updatedAt: Date;
}

export interface Cart {
  userId: number;
  items: CartItem[];
  itemCount: number;
  totalAmount: number;
  currency: string;
  lastUpdated: Date;
}

export class CartService {
  
  /**
   * Obtener carrito completo del usuario
   */
  static async getCart(userId: number): Promise<Cart> {
    console.log('🛒 CartService.getCart called for userId:', userId);
    
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            supplier: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log('📦 Found cart items:', cartItems.length);

    // Transformar los datos para el frontend
    const transformedItems: CartItem[] = cartItems.map((item: any) => ({
      id: item.id,
      userId: item.userId,
      productId: item.productId,
      productTitle: item.product.title,
      productDescription: item.product.description || '',
      productImage: item.product.images?.[0] || '',
      supplierName: item.product.supplier.companyName,
      supplierId: item.product.supplierId,
      containerType: item.containerType,
      containerQuantity: item.containerQuantity,
      pricePerContainer: Number(item.customPrice || item.pricePerContainer),
      currency: item.currency,
      incoterm: item.incoterm,
      customPrice: item.customPrice ? Number(item.customPrice) : undefined,
      notes: item.notes || '',
      moq: item.product.moq,
      unitsPerContainer: item.product.unitsPerContainer,
      addedAt: item.createdAt,
      updatedAt: item.updatedAt
    }));
    
    // Calcular totales
    const itemCount = transformedItems.reduce((sum, item) => sum + item.containerQuantity, 0);
    const totalAmount = transformedItems.reduce((sum, item) => {
      const price = item.customPrice || item.pricePerContainer;
      return sum + (price * item.containerQuantity);
    }, 0);

    const result = {
      userId,
      items: transformedItems,
      itemCount,
      totalAmount,
      currency: transformedItems.length > 0 ? transformedItems[0].currency : 'USD',
      lastUpdated: new Date()
    };

    console.log('📊 Cart summary:', {
      itemCount: result.itemCount,
      totalAmount: result.totalAmount,
      currency: result.currency
    });

    return result;
  }

  /**
   * Agregar producto al carrito
   */
  static async addToCart(
    userId: number, 
    productId: number, 
    containerQuantity: number,
    containerType: string = '40GP',
    incoterm: string = 'FOB',
    customPrice?: number,
    notes?: string
  ): Promise<CartItem> {
    
    console.log('🛒 CartService.addToCart called with:', { 
      userId, 
      productId, 
      containerQuantity, 
      containerType, 
      incoterm 
    });
    
    // Obtener información del producto
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        supplier: true
      }
    });
    
    console.log('📦 Product found:', product ? 'YES' : 'NO', product?.id);
    
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    // Verificar stock
    if (product.stockContainers < containerQuantity) {
      throw new Error(`Stock insuficiente. Disponible: ${product.stockContainers} contenedores`);
    }

    // Verificar si el producto ya está en el carrito con las mismas especificaciones
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userId,
        productId,
        containerType,
        incoterm
      }
    });

    if (existingItem) {
      // Actualizar cantidad del item existente
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          containerQuantity: existingItem.containerQuantity + containerQuantity,
          customPrice: customPrice ? Number(customPrice) : existingItem.customPrice,
          notes: notes || existingItem.notes,
          updatedAt: new Date()
        },
        include: {
          product: {
            include: {
              supplier: true
            }
          }
        }
      });

      return {
        id: updatedItem.id,
        userId: updatedItem.userId,
        productId: updatedItem.productId,
        productTitle: updatedItem.product.title,
        productDescription: updatedItem.product.description || '',
        productImage: updatedItem.product.images?.[0] || '',
        supplierName: updatedItem.product.supplier.companyName,
        supplierId: updatedItem.product.supplierId,
        containerType: updatedItem.containerType,
        containerQuantity: updatedItem.containerQuantity,
        pricePerContainer: Number(updatedItem.customPrice || updatedItem.pricePerContainer),
        currency: updatedItem.currency,
        incoterm: updatedItem.incoterm,
        customPrice: updatedItem.customPrice ? Number(updatedItem.customPrice) : undefined,
        notes: updatedItem.notes || '',
        moq: updatedItem.product.moq,
        unitsPerContainer: updatedItem.product.unitsPerContainer,
        addedAt: updatedItem.createdAt,
        updatedAt: updatedItem.updatedAt
      };
    }

    // Crear nuevo item del carrito
    const newCartItem = await prisma.cartItem.create({
      data: {
        userId,
        productId,
        containerType,
        containerQuantity,
        pricePerContainer: Number(product.pricePerContainer),
        currency: product.currency,
        incoterm,
        customPrice: customPrice ? Number(customPrice) : null,
        notes
      },
      include: {
        product: {
          include: {
            supplier: true
          }
        }
      }
    });

    console.log('✅ New cart item created:', newCartItem.id);

    return {
      id: newCartItem.id,
      userId: newCartItem.userId,
      productId: newCartItem.productId,
      productTitle: newCartItem.product.title,
      productDescription: newCartItem.product.description || '',
      productImage: newCartItem.product.images?.[0] || '',
      supplierName: newCartItem.product.supplier.companyName,
      supplierId: newCartItem.product.supplierId,
      containerType: newCartItem.containerType,
      containerQuantity: newCartItem.containerQuantity,
      pricePerContainer: Number(newCartItem.customPrice || newCartItem.pricePerContainer),
      currency: newCartItem.currency,
      incoterm: newCartItem.incoterm,
      customPrice: newCartItem.customPrice ? Number(newCartItem.customPrice) : undefined,
      notes: newCartItem.notes || '',
      moq: newCartItem.product.moq,
      unitsPerContainer: newCartItem.product.unitsPerContainer,
      addedAt: newCartItem.createdAt,
      updatedAt: newCartItem.updatedAt
    };
  }

  /**
   * Actualizar cantidad de un item del carrito
   */
  static async updateCartItem(
    userId: number, 
    itemId: string, 
    containerQuantity: number,
    customPrice?: number,
    notes?: string
  ): Promise<CartItem> {
    
    console.log('🔄 CartService.updateCartItem called:', { userId, itemId, containerQuantity });
    
    // Verificar que el item pertenezca al usuario
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        userId
      },
      include: {
        product: {
          include: {
            supplier: true
          }
        }
      }
    });

    if (!existingItem) {
      throw new Error('Item no encontrado en el carrito');
    }

    // Verificar stock
    if (existingItem.product.stockContainers < containerQuantity) {
      throw new Error(`Stock insuficiente. Disponible: ${existingItem.product.stockContainers} contenedores`);
    }

    // Actualizar item
    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: {
        containerQuantity,
        customPrice: customPrice ? Number(customPrice) : existingItem.customPrice,
        notes: notes !== undefined ? notes : existingItem.notes,
        updatedAt: new Date()
      },
      include: {
        product: {
          include: {
            supplier: true
          }
        }
      }
    });

    console.log('✅ Cart item updated successfully');

    return {
      id: updatedItem.id,
      userId: updatedItem.userId,
      productId: updatedItem.productId,
      productTitle: updatedItem.product.title,
      productDescription: updatedItem.product.description || '',
      productImage: updatedItem.product.images?.[0] || '',
      supplierName: updatedItem.product.supplier.companyName,
      supplierId: updatedItem.product.supplierId,
      containerType: updatedItem.containerType,
      containerQuantity: updatedItem.containerQuantity,
      pricePerContainer: Number(updatedItem.customPrice || updatedItem.pricePerContainer),
      currency: updatedItem.currency,
      incoterm: updatedItem.incoterm,
      customPrice: updatedItem.customPrice ? Number(updatedItem.customPrice) : undefined,
      notes: updatedItem.notes || '',
      moq: updatedItem.product.moq,
      unitsPerContainer: updatedItem.product.unitsPerContainer,
      addedAt: updatedItem.createdAt,
      updatedAt: updatedItem.updatedAt
    };
  }

  /**
   * Remover item del carrito
   */
  static async removeFromCart(userId: number, itemId: string): Promise<boolean> {
    console.log('🗑️ CartService.removeFromCart called:', { userId, itemId });
    
    try {
      const deletedItem = await prisma.cartItem.deleteMany({
        where: {
          id: itemId,
          userId // Verificar que el item pertenezca al usuario
        }
      });

      console.log('✅ Item removed, count:', deletedItem.count);
      return deletedItem.count > 0;
    } catch (error) {
      console.error('❌ Error removing item:', error);
      return false;
    }
  }

  /**
   * Limpiar carrito completo
   */
  static async clearCart(userId: number): Promise<boolean> {
    console.log('🧹 CartService.clearCart called for userId:', userId);
    
    try {
      const deletedItems = await prisma.cartItem.deleteMany({
        where: { userId }
      });

      console.log('✅ Cart cleared, items removed:', deletedItems.count);
      return true;
    } catch (error) {
      console.error('❌ Error clearing cart:', error);
      return false;
    }
  }

  /**
   * Obtener estadísticas del carrito
   */
  static async getCartStats(userId: number): Promise<{
    itemCount: number;
    totalAmount: number;
    currency: string;
    supplierCount: number;
  }> {
    const cart = await this.getCart(userId);
    const uniqueSuppliers = new Set(cart.items.map(item => item.supplierId));
    
    return {
      itemCount: cart.itemCount,
      totalAmount: cart.totalAmount,
      currency: cart.currency,
      supplierCount: uniqueSuppliers.size
    };
  }
}
