import { DatabaseService, ProductInfo } from './databaseService';
import { ProductService } from './productService';

// Tipos para el carrito
export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  productDescription: string;
  supplierName: string;
  supplierId: string;
  containerType: string;
  containerQuantity: number;
  pricePerContainer: number;
  currency: string;
  incoterm: string;
  customPrice?: number;
  notes?: string;
  addedAt: Date;
  updatedAt: Date;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  itemCount: number;
  totalAmount: number;
  currency: string;
  lastUpdated: Date;
}

// Mock database para carrito
const cartDatabase: { [userId: string]: CartItem[] } = {};

export class CartService {
  
  /**
   * Obtener carrito completo del usuario
   */
  static async getCart(userId: string): Promise<Cart> {
    const userCartItems = cartDatabase[userId] || [];
    
    // Calcular totales
    const itemCount = userCartItems.reduce((sum, item) => sum + item.containerQuantity, 0);
    const totalAmount = userCartItems.reduce((sum, item) => {
      const price = item.customPrice || item.pricePerContainer;
      return sum + (price * item.containerQuantity);
    }, 0);

    return {
      userId,
      items: userCartItems,
      itemCount,
      totalAmount,
      currency: userCartItems.length > 0 ? userCartItems[0].currency : 'USD',
      lastUpdated: new Date()
    };
  }

  /**
   * Agregar producto al carrito
   */
  static async addToCart(
    userId: string, 
    productId: string, 
    containerQuantity: number,
    containerType: string = '20GP',
    incoterm: string = 'CIF',
    customPrice?: number,
    notes?: string
  ): Promise<CartItem> {
    
    console.log('🛒 CartService.addToCart called with:', { userId, productId, containerQuantity, containerType, incoterm });
    
    // Obtener información del producto
    const product = await ProductService.getProductById(productId);
    console.log('📦 Product found:', product ? 'YES' : 'NO', product?.id);
    
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    // Verificar stock
    if (product.stockContainers < containerQuantity) {
      throw new Error(`Stock insuficiente. Disponible: ${product.stockContainers} contenedores`);
    }

    // Inicializar carrito del usuario si no existe
    if (!cartDatabase[userId]) {
      cartDatabase[userId] = [];
    }

    // Verificar si el producto ya está en el carrito
    const existingItemIndex = cartDatabase[userId].findIndex(
      item => item.productId === productId && 
               item.supplierId === product.supplierId &&
               item.containerType === containerType &&
               item.incoterm === incoterm
    );

    if (existingItemIndex >= 0) {
      // Actualizar cantidad del item existente
      const existingItem = cartDatabase[userId][existingItemIndex];
      existingItem.containerQuantity += containerQuantity;
      existingItem.updatedAt = new Date();
      
      if (customPrice) {
        existingItem.customPrice = customPrice;
      }
      if (notes) {
        existingItem.notes = notes;
      }
      
      return existingItem;
    }

    // Crear nuevo item del carrito
    const newCartItem: CartItem = {
      id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      productId: product.id,
      productName: product.name,
      productDescription: product.description,
      supplierName: product.supplierName,
      supplierId: product.supplierId,
      containerType,
      containerQuantity,
      pricePerContainer: product.pricePerContainer,
      currency: product.currency,
      incoterm,
      customPrice,
      notes,
      addedAt: new Date(),
      updatedAt: new Date()
    };

    cartDatabase[userId].push(newCartItem);
    return newCartItem;
  }

  /**
   * Actualizar cantidad de un item del carrito
   */
  static async updateCartItem(
    userId: string, 
    itemId: string, 
    containerQuantity: number,
    customPrice?: number,
    notes?: string
  ): Promise<CartItem> {
    
    if (!cartDatabase[userId]) {
      throw new Error('Carrito no encontrado');
    }

    const itemIndex = cartDatabase[userId].findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error('Item no encontrado en el carrito');
    }

    const item = cartDatabase[userId][itemIndex];
    
    // Verificar stock
    const product = await DatabaseService.getProductById(item.productId);
    if (product && product.stockContainers < containerQuantity) {
      throw new Error(`Stock insuficiente. Disponible: ${product.stockContainers} contenedores`);
    }

    // Actualizar item
    item.containerQuantity = containerQuantity;
    item.updatedAt = new Date();
    
    if (customPrice !== undefined) {
      item.customPrice = customPrice;
    }
    if (notes !== undefined) {
      item.notes = notes;
    }

    return item;
  }

  /**
   * Remover item del carrito
   */
  static async removeFromCart(userId: string, itemId: string): Promise<boolean> {
    if (!cartDatabase[userId]) {
      return false;
    }

    const initialLength = cartDatabase[userId].length;
    cartDatabase[userId] = cartDatabase[userId].filter(item => item.id !== itemId);
    
    return cartDatabase[userId].length < initialLength;
  }

  /**
   * Limpiar carrito completo
   */
  static async clearCart(userId: string): Promise<boolean> {
    if (cartDatabase[userId]) {
      cartDatabase[userId] = [];
      return true;
    }
    return false;
  }

  /**
   * Obtener estadísticas del carrito
   */
  static async getCartStats(userId: string): Promise<{
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
