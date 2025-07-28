// ================================================================
// PRODUCT SERVICE - VERSIÓN SIMPLIFICADA Y FUNCIONAL
// ================================================================
// Descripción: Servicio completamente individualizado para productos
// Sistema tipo Amazon: Separación total de datos por usuario

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface SimpleProductData {
  title: string;
  description?: string;
  price: number;
  categoryId: number;
  minQuantity: number;
  unit: string;
  incoterm: string;
  originCountry: string;
  supplierId: number; // ✅ CRÍTICO: Asignación de propietario
}

export interface SimpleProductWithDetails {
  id: number;
  title: string;
  description?: string | null;
  price: number;
  currency: string;
  categoryId: number;
  minQuantity: number;
  unit: string;
  incoterm: string;
  originCountry: string;
  supplierId: number;
  isActive: boolean;
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
  };
}

// Función auxiliar para convertir Decimal a number
function convertProductForResponse(product: any): SimpleProductWithDetails {
  return {
    ...product,
    price: typeof product.price === 'object' ? parseFloat(product.price.toString()) : product.price
  };
}

export class SimpleProductService {
  /**
   * 🏪 Crear nuevo producto (solo para el supplier autenticado)
   */
  static async createProduct(productData: SimpleProductData): Promise<SimpleProductWithDetails> {
    try {
      console.log(`🏪 SimpleProductService: Creando producto para supplier ${productData.supplierId}`);

      const product = await prisma.product.create({
        data: {
          title: productData.title,
          description: productData.description,
          price: productData.price,
          currency: "USD",
          categoryId: productData.categoryId,
          minQuantity: productData.minQuantity,
          unit: productData.unit,
          incoterm: productData.incoterm,
          originCountry: productData.originCountry,
          supplierId: productData.supplierId, // ✅ ASIGNACIÓN CRÍTICA
          isActive: true,
          images: []
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
              name: true
            }
          }
        }
      });

      console.log(`✅ SimpleProductService: Producto ${product.title} creado para supplier ${productData.supplierId}`);
      return convertProductForResponse(product);

    } catch (error) {
      console.error('❌ SimpleProductService: Error creando producto:', error);
      throw error;
    }
  }

  /**
   * 📋 Obtener productos del supplier (solo sus propios productos)
   */
  static async getSupplierProducts(supplierId: number): Promise<SimpleProductWithDetails[]> {
    try {
      console.log(`🏪 SimpleProductService: Obteniendo productos del supplier ${supplierId}`);

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
              name: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      console.log(`✅ SimpleProductService: ${products.length} productos obtenidos para supplier ${supplierId}`);
      return products.map(product => convertProductForResponse(product));

    } catch (error) {
      console.error('❌ SimpleProductService: Error obteniendo productos del supplier:', error);
      throw error;
    }
  }

  /**
   * 🔍 Obtener producto por ID (solo si pertenece al supplier o para buyers - vista pública)
   */
  static async getProductById(productId: number, userId?: number, userType?: string): Promise<SimpleProductWithDetails | null> {
    try {
      console.log(`🏪 SimpleProductService: Obteniendo producto ${productId} para usuario ${userId} (${userType})`);

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
              name: true
            }
          }
        }
      });

      if (!product) {
        console.log(`⚠️ SimpleProductService: Producto ${productId} no encontrado o no accesible para usuario ${userId}`);
        return null;
      }

      console.log(`✅ SimpleProductService: Producto obtenido para usuario autorizado`);
      return convertProductForResponse(product);

    } catch (error) {
      console.error('❌ SimpleProductService: Error obteniendo producto:', error);
      throw error;
    }
  }

  /**
   * 🛒 Obtener productos públicos (para buyers - vista del catálogo)
   */
  static async getPublicProducts(page: number = 1, limit: number = 20): Promise<{
    products: SimpleProductWithDetails[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      console.log(`🛒 SimpleProductService: Obteniendo productos públicos (página ${page})`);

      const skip = (page - 1) * limit;

      const whereClause: any = {
        isActive: true
      };

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
            },
            category: {
              select: {
                id: true,
                name: true
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

      console.log(`✅ SimpleProductService: ${products.length} productos públicos obtenidos`);
      
      return {
        products: products.map(product => convertProductForResponse(product)),
        total,
        totalPages,
        currentPage: page
      };

    } catch (error) {
      console.error('❌ SimpleProductService: Error obteniendo productos públicos:', error);
      throw error;
    }
  }

  /**
   * ✏️ Actualizar producto (solo si pertenece al supplier)
   */
  static async updateProduct(productId: number, supplierId: number, updateData: Partial<SimpleProductData>): Promise<SimpleProductWithDetails> {
    try {
      console.log(`✏️ SimpleProductService: Actualizando producto ${productId} para supplier ${supplierId}`);

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

      // Crear objeto de actualización sin supplierId
      const { supplierId: _, ...updateFields } = updateData;

      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: {
          ...updateFields,
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
          },
          category: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      console.log(`✅ SimpleProductService: Producto actualizado`);
      return convertProductForResponse(updatedProduct);

    } catch (error) {
      console.error('❌ SimpleProductService: Error actualizando producto:', error);
      throw error;
    }
  }

  /**
   * 🗑️ Desactivar producto (soft delete - solo si pertenece al supplier)
   */
  static async deactivateProduct(productId: number, supplierId: number): Promise<SimpleProductWithDetails> {
    try {
      console.log(`🗑️ SimpleProductService: Desactivando producto ${productId} para supplier ${supplierId}`);

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
          },
          category: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      console.log(`✅ SimpleProductService: Producto desactivado`);
      return convertProductForResponse(deactivatedProduct);

    } catch (error) {
      console.error('❌ SimpleProductService: Error desactivando producto:', error);
      throw error;
    }
  }

  /**
   * 📊 Obtener estadísticas simples del supplier
   */
  static async getSupplierProductStats(supplierId: number): Promise<{
    total: number;
    active: number;
    inactive: number;
  }> {
    try {
      console.log(`📊 SimpleProductService: Obteniendo estadísticas para supplier ${supplierId}`);

      const whereClause = { supplierId: supplierId }; // ✅ FILTRO CRÍTICO

      const [total, active, inactive] = await Promise.all([
        prisma.product.count({ where: whereClause }),
        prisma.product.count({ where: { ...whereClause, isActive: true } }),
        prisma.product.count({ where: { ...whereClause, isActive: false } })
      ]);

      const stats = { total, active, inactive };
      console.log(`✅ SimpleProductService: Estadísticas obtenidas:`, stats);
      
      return stats;

    } catch (error) {
      console.error('❌ SimpleProductService: Error obteniendo estadísticas:', error);
      throw error;
    }
  }
}

export default SimpleProductService;
