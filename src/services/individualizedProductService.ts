// ================================================================
// PRODUCT SERVICE - Servicio Completamente Individualizado
// ================================================================
// Descripción: Servicio que garantiza separación total de datos por usuario
// Sistema tipo Amazon: Cada usuario (supplier) solo ve sus propios productos

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface ProductData {
  title: string;
  description?: string;
  price: number;
  currency: string;
  categoryId: number; // ✅ Cambiado de category a categoryId
  minQuantity: number;
  maxQuantity?: number;
  unit: string;
  incoterm: string;
  originCountry: string;
  images?: string[];
  specifications?: any;
  supplierId: number; // ✅ CRÍTICO: Asignación de propietario
  
  // Campos adicionales opcionales
  containerType?: string;
  unitsPerContainer?: number;
  moq?: number;
  unitPrice?: number;
  pricePerContainer?: number;
  grossWeight?: number;
  netWeight?: number;
  volume?: number;
  packagingType?: string;
  stockContainers?: number;
  isNegotiable?: boolean;
  allowsCustomOrders?: boolean;
  productionTime?: number;
  packagingTime?: number;
}

export interface ProductWithDetails {
  id: number;
  title: string;
  description?: string | null;
  price: number;
  currency: string;
  categoryId: number;
  minQuantity: number;
  maxQuantity?: number | null;
  unit: string;
  incoterm: string;
  originCountry: string;
  images?: string[] | null;
  specifications?: any;
  supplierId: number;
  isActive: boolean;
  
  // Campos adicionales
  containerType: string;
  unitsPerContainer: number;
  moq: number;
  unitPrice: number;
  pricePerContainer: number;
  grossWeight: number;
  netWeight: number;
  volume: number;
  packagingType?: string | null;
  stockContainers: number;
  isNegotiable: boolean;
  allowsCustomOrders: boolean;
  productionTime: number;
  packagingTime: number;
  totalViews: number;
  totalInquiries: number;
  
  createdAt: Date;
  updatedAt: Date;
  supplier: {
    id: number;
    companyName: string;
    contactName: string;
    email: string;
  };
  category: {
    id: number;
    name: string;
    description?: string | null;
  };
}

// Función auxiliar para convertir Decimal a number
function convertProductForResponse(product: any): ProductWithDetails {
  return {
    ...product,
    price: typeof product.price === 'object' ? parseFloat(product.price.toString()) : product.price,
    unitPrice: typeof product.unitPrice === 'object' ? parseFloat(product.unitPrice.toString()) : product.unitPrice,
    pricePerContainer: typeof product.pricePerContainer === 'object' ? parseFloat(product.pricePerContainer.toString()) : product.pricePerContainer,
    volume: typeof product.volume === 'object' ? parseFloat(product.volume.toString()) : product.volume
  };
}

export class ProductService {
  /**
   * 🏪 Crear nuevo producto (solo para el supplier autenticado)
   */
  static async createProduct(productData: ProductData): Promise<ProductWithDetails> {
    try {
      console.log(`🏪 ProductService: Creando producto para supplier ${productData.supplierId}`);

      const product = await prisma.product.create({
        data: {
          title: productData.title,
          description: productData.description,
          price: productData.price,
          currency: productData.currency,
          categoryId: productData.categoryId, // ✅ Corregido
          minQuantity: productData.minQuantity,
          maxQuantity: productData.maxQuantity,
          unit: productData.unit,
          incoterm: productData.incoterm,
          originCountry: productData.originCountry,
          images: productData.images || [],
          specifications: productData.specifications,
          supplierId: productData.supplierId, // ✅ ASIGNACIÓN CRÍTICA
          isActive: true,
          
          // Campos adicionales con valores por defecto
          containerType: productData.containerType || "40GP",
          unitsPerContainer: productData.unitsPerContainer || 0,
          moq: productData.moq || productData.minQuantity,
          unitPrice: productData.unitPrice || productData.price,
          pricePerContainer: productData.pricePerContainer || 0,
          grossWeight: productData.grossWeight || 0,
          netWeight: productData.netWeight || 0,
          volume: productData.volume || 0,
          packagingType: productData.packagingType,
          stockContainers: productData.stockContainers || 0,
          isNegotiable: productData.isNegotiable || false,
          allowsCustomOrders: productData.allowsCustomOrders || false,
          productionTime: productData.productionTime || 0,
          packagingTime: productData.packagingTime || 0
        },
        include: {
          supplier: {
            select: {
              id: true,
              companyName: true,
              contactName: true,
              email: true
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              description: true
            }
          }
        }
      });

      console.log(`✅ ProductService: Producto ${product.title} creado para supplier ${productData.supplierId}`);
      return convertProductForResponse(product);

    } catch (error) {
      console.error('❌ ProductService: Error creando producto:', error);
      throw error;
    }
  }

  /**
   * 🔍 Obtener producto por ID (solo si pertenece al supplier o para buyers - vista pública)
   */
  static async getProductById(productId: number, userId?: number, userType?: string): Promise<ProductWithDetails | null> {
    try {
      console.log(`🏪 ProductService: Obteniendo producto ${productId} para usuario ${userId} (${userType})`);

      let whereClause: any = {
        id: productId,
        isActive: true
      };

      // Si es un SUPPLIER, solo puede ver sus propios productos
      if (userType === 'SUPPLIER' && userId) {
        whereClause.supplierId = userId; // ✅ VALIDACIÓN CRÍTICA
      }

      const product = await prisma.product.findFirst({
        where: whereClause,
        include: {
          supplier: {
            select: {
              id: true,
              companyName: true,
              contactName: true,
              email: true
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              description: true
            }
          }
        }
      });

      if (!product) {
        console.log(`⚠️ ProductService: Producto ${productId} no encontrado o no accesible para usuario ${userId}`);
        return null;
      }

      console.log(`✅ ProductService: Producto obtenido para usuario autorizado`);
      return convertProductForResponse(product);

    } catch (error) {
      console.error('❌ ProductService: Error obteniendo producto:', error);
      throw error;
    }
  }

  /**
   * 📋 Obtener productos del supplier (solo sus propios productos)
   */
  static async getSupplierProducts(supplierId: number): Promise<ProductWithDetails[]> {
    try {
      console.log(`🏪 ProductService: Obteniendo productos del supplier ${supplierId}`);

      const products = await prisma.product.findMany({
        where: {
          supplierId: supplierId, // ✅ FILTRO CRÍTICO
          isActive: true
        },
        include: {
          supplier: {
            select: {
              id: true,
              companyName: true,
              contactName: true,
              email: true
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              description: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      console.log(`✅ ProductService: ${products.length} productos obtenidos para supplier ${supplierId}`);
      return products.map(product => convertProductForResponse(product));

    } catch (error) {
      console.error('❌ ProductService: Error obteniendo productos del supplier:', error);
      throw error;
    }
  }

  /**
   * 🛒 Obtener productos públicos (para buyers - vista del catálogo)
   */
  static async getPublicProducts(page: number = 1, limit: number = 20, category?: string): Promise<{
    products: ProductWithDetails[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      console.log(`🛒 ProductService: Obteniendo productos públicos (página ${page})`);

      const skip = (page - 1) * limit;

      let whereClause: any = {
        isActive: true,
        stockContainers: { gt: 0 } // Solo productos con stock
      };

      if (category) {
        whereClause.categoryId = parseInt(category);
      }

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where: whereClause,
          include: {
            supplier: {
              select: {
                id: true,
                companyName: true,
                contactName: true,
                email: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          skip,
          take: limit
        }),
        prisma.product.count({ where: whereClause })
      ]);

      const totalPages = Math.ceil(total / limit);

      console.log(`✅ ProductService: ${products.length} productos públicos obtenidos`);
      
      return {
        products: products.map(product => convertProductForResponse(product)),
        total,
        totalPages,
        currentPage: page
      };

    } catch (error) {
      console.error('❌ ProductService: Error obteniendo productos públicos:', error);
      throw error;
    }
  }

  /**
   * ✏️ Actualizar producto (solo si pertenece al supplier)
   */
  static async updateProduct(productId: number, supplierId: number, updateData: Partial<ProductData>): Promise<ProductWithDetails> {
    try {
      console.log(`✏️ ProductService: Actualizando producto ${productId} para supplier ${supplierId}`);

      // Verificar que el producto pertenece al supplier
      const existingProduct = await prisma.product.findFirst({
        where: {
          id: productId,
          supplierId: supplierId // ✅ VALIDACIÓN CRÍTICA
        }
      });

      if (!existingProduct) {
        throw new Error('Producto no encontrado o no pertenece al supplier');
      }

      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: {
          ...updateData,
          updatedAt: new Date()
        },
        include: {
          supplier: {
            select: {
              id: true,
              companyName: true,
              contactName: true,
              email: true
            }
          }
        }
      });

      console.log(`✅ ProductService: Producto actualizado`);
      return convertProductForResponse(updatedProduct);

    } catch (error) {
      console.error('❌ ProductService: Error actualizando producto:', error);
      throw error;
    }
  }

  /**
   * 🗑️ Desactivar producto (soft delete - solo si pertenece al supplier)
   */
  static async deactivateProduct(productId: number, supplierId: number): Promise<ProductWithDetails> {
    try {
      console.log(`🗑️ ProductService: Desactivando producto ${productId} para supplier ${supplierId}`);

      // Verificar que el producto pertenece al supplier
      const existingProduct = await prisma.product.findFirst({
        where: {
          id: productId,
          supplierId: supplierId // ✅ VALIDACIÓN CRÍTICA
        }
      });

      if (!existingProduct) {
        throw new Error('Producto no encontrado o no pertenece al supplier');
      }

      const deactivatedProduct = await prisma.product.update({
        where: { id: productId },
        data: {
          isActive: false,
          updatedAt: new Date()
        },
        include: {
          supplier: {
            select: {
              id: true,
              companyName: true,
              contactName: true,
              email: true
            }
          }
        }
      });

      console.log(`✅ ProductService: Producto desactivado`);
      return convertProductForResponse(deactivatedProduct);

    } catch (error) {
      console.error('❌ ProductService: Error desactivando producto:', error);
      throw error;
    }
  }

  /**
   * 📊 Obtener estadísticas de productos del supplier
   */
  static async getSupplierProductStats(supplierId: number): Promise<{
    total: number;
    active: number;
    inactive: number;
    outOfStock: number;
    lowStock: number;
    categories: Array<{ categoryId: number; categoryName: string; count: number }>;
  }> {
    try {
      console.log(`📊 ProductService: Obteniendo estadísticas de productos para supplier ${supplierId}`);

      const whereClause = { supplierId: supplierId }; // ✅ FILTRO CRÍTICO

      const [total, active, inactive, outOfStock, lowStock, categories] = await Promise.all([
        prisma.product.count({ where: whereClause }),
        prisma.product.count({ where: { ...whereClause, isActive: true } }),
        prisma.product.count({ where: { ...whereClause, isActive: false } }),
        prisma.product.count({ where: { ...whereClause, stockContainers: 0 } }),
        prisma.product.count({ where: { ...whereClause, stockContainers: { gt: 0, lte: 10 } } }),
        prisma.product.groupBy({
          by: ['categoryId'],
          where: whereClause,
          _count: {
            categoryId: true
          },
          _max: {
            categoryId: true
          }
        })
      ]);

      // Obtener nombres de categorías
      const categoryIds = categories.map(cat => cat.categoryId);
      const categoryDetails = await prisma.category.findMany({
        where: { id: { in: categoryIds } },
        select: { id: true, name: true }
      });

      const categoryStats = categories.map(cat => {
        const categoryDetail = categoryDetails.find(detail => detail.id === cat.categoryId);
        return {
          categoryId: cat.categoryId,
          categoryName: categoryDetail?.name || 'Sin categoría',
          count: cat._count?.categoryId || 0
        };
      });

      const stats = { total, active, inactive, outOfStock, lowStock, categories: categoryStats };
      console.log(`✅ ProductService: Estadísticas obtenidas:`, stats);
      
      return stats;

    } catch (error) {
      console.error('❌ ProductService: Error obteniendo estadísticas:', error);
      throw error;
    }
  }

  /**
   * 🔍 Buscar productos (públicos para buyers, propios para suppliers)
   */
  static async searchProducts(
    searchTerm: string, 
    userId?: number, 
    userType?: string,
    category?: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    products: ProductWithDetails[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      console.log(`🔍 ProductService: Buscando productos "${searchTerm}" para usuario ${userId} (${userType})`);

      const skip = (page - 1) * limit;

      let whereClause: any = {
        isActive: true,
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
          { category: { contains: searchTerm, mode: 'insensitive' } }
        ]
      };

      // Si es SUPPLIER, solo buscar en sus productos
      if (userType === 'SUPPLIER' && userId) {
        whereClause.supplierId = userId; // ✅ FILTRO CRÍTICO
      }

      // Si es BUYER, solo productos con stock
      if (userType === 'BUYER') {
        whereClause.stockQuantity = { gt: 0 };
      }

      if (category) {
        whereClause.category = category;
      }

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where: whereClause,
          include: {
            supplier: {
              select: {
                id: true,
                companyName: true,
                contactName: true,
                email: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          skip,
          take: limit
        }),
        prisma.product.count({ where: whereClause })
      ]);

      const totalPages = Math.ceil(total / limit);

      console.log(`✅ ProductService: ${products.length} productos encontrados`);
      
      return {
        products: products.map(product => convertProductForResponse(product)),
        total,
        totalPages,
        currentPage: page
      };

    } catch (error) {
      console.error('❌ ProductService: Error buscando productos:', error);
      throw error;
    }
  }
}

export default ProductService;
