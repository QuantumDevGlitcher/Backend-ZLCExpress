// ================================================================
// SERVICIO DE BASE DE DATOS CON PRISMA - ZLCExpress
// ================================================================
// Descripción: Servicio moderno para gestión de usuarios con PostgreSQL y Prisma ORM
// Fecha: 2025-07-26

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

// Tipos TypeScript temporales (hasta que se genere el cliente)
export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';
export type UserType = 'BUYER' | 'SUPPLIER' | 'BOTH';
export type AuthAction = 'LOGIN' | 'LOGOUT' | 'FAILED_LOGIN' | 'TOKEN_REFRESH' | 'PASSWORD_CHANGE';

export interface User {
  id: number;
  email: string;
  password: string;
  companyName: string;
  taxId: string;
  operationCountry: string;
  industry: string;
  contactName: string;
  contactPosition: string;
  contactPhone: string;
  fiscalAddress: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  userType: UserType;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSession {
  id: number;
  userId: number;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
  lastUsedAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  isActive: boolean;
}

export interface AuthLog {
  id: number;
  userId: number | null;
  action: AuthAction;
  ipAddress: string | null;
  userAgent: string | null;
  success: boolean;
  errorMessage: string | null;
  createdAt: Date;
}

// Tipos TypeScript
export interface CreateUserData {
  email: string;
  password: string;
  companyName: string;
  taxId: string;
  operationCountry: string;
  industry: string;
  contactName: string;
  contactPosition: string;
  contactPhone: string;
  fiscalAddress: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  userType?: UserType;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SessionData {
  ipAddress?: string;
  userAgent?: string;
}

export interface UserStats {
  totalUsers: number;
  verifiedUsers: number;
  pendingUsers: number;
  buyers: number;
  suppliers: number;
  bothTypes: number;
  newLast30Days: number;
}

export class DatabaseService {
  private prisma: PrismaClient;
  private readonly saltRounds = 12;
  private readonly jwtSecret: string;

  constructor() {
    this.prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
    
    this.jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key';
    
    // Configurar manejo de errores y desconexión
    this.setupEventHandlers();
  }

  // ================================================================
  // CONFIGURACIÓN Y UTILIDADES
  // ================================================================

  private setupEventHandlers(): void {
    process.on('beforeExit', async () => {
      await this.prisma.$disconnect();
    });

    process.on('SIGINT', async () => {
      await this.prisma.$disconnect();
      process.exit(0);
    });
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  // ================================================================
  // GESTIÓN DE USUARIOS
  // ================================================================

  async createUser(userData: CreateUserData): Promise<User> {
    try {
      // Verificar si el email ya existe
      const existingUser = await this.prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        throw new Error('El email ya está registrado');
      }

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(userData.password, this.saltRounds);

      // Crear usuario
      const user = await this.prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
        },
      });

      // Log de auditoría
      await this.logAuthAction({
        userId: user.id,
        action: 'LOGIN', // Equivalente a registro exitoso
        success: true,
      });

      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getUserById(id: number): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { id },
        include: {
          sessions: {
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { email },
      });
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }

  async updateUser(id: number, userData: Partial<CreateUserData>): Promise<User | null> {
    try {
      // Si se está actualizando la contraseña, hashearla
      if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, this.saltRounds);
      }

      const user = await this.prisma.user.update({
        where: { id },
        data: userData,
      });

      // Log de auditoría
      if (userData.password) {
        await this.logAuthAction({
          userId: id,
          action: 'PASSWORD_CHANGE',
          success: true,
        });
      }

      return user;
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }

  async verifyUser(id: number, status: VerificationStatus): Promise<User | null> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: {
          verificationStatus: status,
          isVerified: status === 'VERIFIED',
        },
      });
    } catch (error) {
      console.error('Error verifying user:', error);
      return null;
    }
  }

  // ================================================================
  // AUTENTICACIÓN
  // ================================================================

  async authenticateUser(credentials: LoginCredentials, sessionData?: SessionData): Promise<{ user: User; token: string } | null> {
    try {
      // Buscar usuario
      const user = await this.getUserByEmail(credentials.email);
      if (!user) {
        await this.logAuthAction({
          action: 'FAILED_LOGIN',
          success: false,
          ipAddress: sessionData?.ipAddress,
          userAgent: sessionData?.userAgent,
          errorMessage: 'Usuario no encontrado',
        });
        return null;
      }

      // Verificar contraseña
      const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
      if (!isPasswordValid) {
        await this.logAuthAction({
          userId: user.id,
          action: 'FAILED_LOGIN',
          success: false,
          ipAddress: sessionData?.ipAddress,
          userAgent: sessionData?.userAgent,
          errorMessage: 'Contraseña incorrecta',
        });
        return null;
      }

      // Generar JWT
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          userType: user.userType,
          isVerified: user.isVerified,
        },
        this.jwtSecret,
        { expiresIn: '7d' }
      );

      // Crear sesión
      await this.createSession({
        userId: user.id,
        token,
        ipAddress: sessionData?.ipAddress || null,
        userAgent: sessionData?.userAgent || null,
      });

      // Log de login exitoso
      await this.logAuthAction({
        userId: user.id,
        action: 'LOGIN',
        success: true,
        ipAddress: sessionData?.ipAddress,
        userAgent: sessionData?.userAgent,
      });

      return { user, token };
    } catch (error) {
      console.error('Error authenticating user:', error);
      return null;
    }
  }

  async verifyToken(token: string): Promise<User | null> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as any;
      
      // Verificar que la sesión siga activa
      const session = await this.prisma.userSession.findFirst({
        where: {
          userId: decoded.userId,
          isActive: true,
          expiresAt: { gt: new Date() },
        },
        include: { user: true },
      });

      if (!session) {
        return null;
      }

      // Actualizar último uso
      await this.prisma.userSession.update({
        where: { id: session.id },
        data: { lastUsedAt: new Date() },
      });

      return session.user;
    } catch (error) {
      console.error('Error verifying token:', error);
      return null;
    }
  }

  // ================================================================
  // GESTIÓN DE SESIONES
  // ================================================================

  async createSession(data: {
    userId: number;
    token: string;
    ipAddress: string | null;
    userAgent: string | null;
  }): Promise<UserSession> {
    const tokenHash = await bcrypt.hash(data.token, 10);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días

    return await this.prisma.userSession.create({
      data: {
        userId: data.userId,
        tokenHash,
        expiresAt,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });
  }

  async logoutUser(userId: number, token?: string): Promise<boolean> {
    try {
      let whereClause: any = { userId, isActive: true };
      
      if (token) {
        // Logout específico de sesión
        const tokenHash = await bcrypt.hash(token, 10);
        whereClause.tokenHash = tokenHash;
      }

      await this.prisma.userSession.updateMany({
        where: whereClause,
        data: { isActive: false },
      });

      // Log de logout
      await this.logAuthAction({
        userId,
        action: 'LOGOUT',
        success: true,
      });

      return true;
    } catch (error) {
      console.error('Error logging out user:', error);
      return false;
    }
  }

  async cleanExpiredSessions(): Promise<number> {
    try {
      const result = await this.prisma.userSession.deleteMany({
        where: {
          OR: [
            { expiresAt: { lt: new Date() } },
            { isActive: false },
          ],
        },
      });

      console.log(`🧹 Cleaned ${result.count} expired sessions`);
      return result.count;
    } catch (error) {
      console.error('Error cleaning expired sessions:', error);
      return 0;
    }
  }

  // ================================================================
  // LOGS DE AUDITORÍA
  // ================================================================

  async logAuthAction(data: {
    userId?: number;
    action: AuthAction;
    success?: boolean;
    ipAddress?: string;
    userAgent?: string;
    errorMessage?: string;
  }): Promise<void> {
    try {
      await this.prisma.authLog.create({
        data: {
          userId: data.userId || null,
          action: data.action,
          success: data.success ?? true,
          ipAddress: data.ipAddress || null,
          userAgent: data.userAgent || null,
          errorMessage: data.errorMessage || null,
        },
      });
    } catch (error) {
      console.error('Error logging auth action:', error);
    }
  }

  async getAuthLogs(userId?: number, limit: number = 50): Promise<AuthLog[]> {
    try {
      return await this.prisma.authLog.findMany({
        where: userId ? { userId } : undefined,
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
          user: {
            select: {
              email: true,
              companyName: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error getting auth logs:', error);
      return [];
    }
  }

  // ================================================================
  // ESTADÍSTICAS Y REPORTES
  // ================================================================

  async getUserStats(): Promise<UserStats> {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const [
        totalUsers,
        verifiedUsers,
        pendingUsers,
        buyers,
        suppliers,
        bothTypes,
        newLast30Days,
      ] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.user.count({ where: { isVerified: true } }),
        this.prisma.user.count({ where: { verificationStatus: 'PENDING' } }),
        this.prisma.user.count({ where: { userType: 'BUYER' } }),
        this.prisma.user.count({ where: { userType: 'SUPPLIER' } }),
        this.prisma.user.count({ where: { userType: 'BOTH' } }),
        this.prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      ]);

      return {
        totalUsers,
        verifiedUsers,
        pendingUsers,
        buyers,
        suppliers,
        bothTypes,
        newLast30Days,
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  }

  async getUsersByCountry(): Promise<any[]> {
    try {
      return await this.prisma.user.groupBy({
        by: ['operationCountry'],
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: 'desc' as const,
          },
        },
      } as any);
    } catch (error) {
      console.error('Error getting users by country:', error);
      return [];
    }
  }

  // ================================================================
  // BÚSQUEDAS Y FILTROS
  // ================================================================

  async searchUsers(query: string, filters?: {
    verified?: boolean;
    userType?: UserType;
    country?: string;
  }): Promise<User[]> {
    try {
      const whereClause: any = {
        OR: [
          { email: { contains: query, mode: 'insensitive' } },
          { companyName: { contains: query, mode: 'insensitive' } },
          { contactName: { contains: query, mode: 'insensitive' } },
          { taxId: { contains: query, mode: 'insensitive' } },
        ],
      };

      if (filters?.verified !== undefined) {
        whereClause.isVerified = filters.verified;
      }

      if (filters?.userType) {
        whereClause.userType = filters.userType;
      }

      if (filters?.country) {
        whereClause.operationCountry = filters.country;
      }

      return await this.prisma.user.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        take: 100,
      });
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }

  // ================================================================
  // CIERRE
  // ================================================================

  // ================================================================
  // CATEGORÍAS
  // ================================================================

  async getCategories(options?: {
    parentId?: number;
    includeInactive?: boolean;
  }) {
    try {
      const whereClause: any = {};
      
      if (options?.parentId !== undefined) {
        whereClause.parentId = options.parentId;
      }
      
      if (!options?.includeInactive) {
        whereClause.isActive = true;
      }

      return await this.prisma.category.findMany({
        where: whereClause,
        include: {
          children: {
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' }
          },
          _count: {
            select: { products: true }
          }
        },
        orderBy: { sortOrder: 'asc' }
      });
    } catch (error) {
      console.error('Error getting categories:', error);
      throw error;
    }
  }

  async getCategoryById(id: number) {
    try {
      return await this.prisma.category.findUnique({
        where: { id },
        include: {
          parent: true,
          children: {
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' }
          },
          products: {
            where: { isActive: true },
            take: 10,
            orderBy: { createdAt: 'desc' }
          },
          _count: {
            select: { products: true }
          }
        }
      });
    } catch (error) {
      console.error('Error getting category by ID:', error);
      throw error;
    }
  }

  async createCategory(categoryData: {
    name: string;
    description?: string;
    image?: string;
    parentId?: number;
    sortOrder?: number;
  }) {
    try {
      return await this.prisma.category.create({
        data: {
          name: categoryData.name,
          description: categoryData.description,
          image: categoryData.image,
          parentId: categoryData.parentId,
          sortOrder: categoryData.sortOrder || 0
        },
        include: {
          parent: true,
          _count: {
            select: { products: true }
          }
        }
      });
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  async updateCategory(id: number, updateData: Partial<{
    name: string;
    description: string;
    image: string;
    parentId: number;
    sortOrder: number;
    isActive: boolean;
  }>) {
    try {
      return await this.prisma.category.update({
        where: { id },
        data: updateData,
        include: {
          parent: true,
          children: {
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' }
          },
          _count: {
            select: { products: true }
          }
        }
      });
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  async deleteCategory(id: number) {
    try {
      // Verificar si tiene productos asociados
      const productsCount = await this.prisma.product.count({
        where: { categoryId: id }
      });

      if (productsCount > 0) {
        throw new Error('Cannot delete category with products');
      }

      // Verificar si tiene subcategorías
      const childrenCount = await this.prisma.category.count({
        where: { parentId: id }
      });

      if (childrenCount > 0) {
        throw new Error('Cannot delete category with subcategories');
      }

      await this.prisma.category.delete({
        where: { id }
      });

      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }

  async getCategoryTree() {
    try {
      const rootCategories = await this.prisma.category.findMany({
        where: {
          parentId: null,
          isActive: true
        },
        include: {
          children: {
            where: { isActive: true },
            include: {
              children: {
                where: { isActive: true },
                orderBy: { sortOrder: 'asc' }
              },
              _count: {
                select: { products: true }
              }
            },
            orderBy: { sortOrder: 'asc' }
          },
          _count: {
            select: { products: true }
          }
        },
        orderBy: { sortOrder: 'asc' }
      });

      return rootCategories;
    } catch (error) {
      console.error('Error getting category tree:', error);
      throw error;
    }
  }

  // ================================================================
  // MÉTODOS DE PRODUCTOS
  // ================================================================

  async getProducts(filters: {
    categoryId?: number;
    supplierId?: number;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
    featured?: boolean;
    page?: number;
    limit?: number;
  } = {}) {
    try {
      const { page = 1, limit = 50, ...whereFilters } = filters;
      
      // Construir filtros
      const where: any = {};
      
      if (whereFilters.categoryId) {
        where.categoryId = whereFilters.categoryId;
      }
      
      if (whereFilters.supplierId) {
        where.supplierId = whereFilters.supplierId;
      }
      
      if (whereFilters.minPrice || whereFilters.maxPrice) {
        where.price = {};
        if (whereFilters.minPrice) where.price.gte = whereFilters.minPrice;
        if (whereFilters.maxPrice) where.price.lte = whereFilters.maxPrice;
      }
      
      if (whereFilters.status) {
        where.status = whereFilters.status;
      }
      
      if (whereFilters.featured) {
        where.featured = whereFilters.featured;
      }

      // Calcular paginación
      const skip = (page - 1) * limit;

      // Obtener productos con filtros
      const [products, total] = await Promise.all([
        this.prisma.product.findMany({
          where,
          include: {
            category: true,
            supplier: {
              select: {
                id: true,
                companyName: true,
                email: true,
                contactPhone: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit
        }),
        this.prisma.product.count({ where })
      ]);

      return {
        products,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      console.error('❌ Error al obtener productos:', error);
      throw new Error('Error al obtener productos de la base de datos');
    }
  }

  async getProductById(id: number) {
    try {
      return await this.prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
          supplier: {
            select: {
              id: true,
              companyName: true,
              email: true,
              contactPhone: true
            }
          }
        }
      });
    } catch (error) {
      console.error('❌ Error al obtener producto por ID:', error);
      throw new Error('Error al obtener producto de la base de datos');
    }
  }

  async getFeaturedProducts(limit: number = 12) {
    try {
      return await this.prisma.product.findMany({
        where: { 
          isActive: true
        },
        include: {
          category: true,
          supplier: {
            select: {
              id: true,
              companyName: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit
      });
    } catch (error) {
      console.error('❌ Error al obtener productos destacados:', error);
      throw new Error('Error al obtener productos destacados de la base de datos');
    }
  }

  async getNewProducts(limit: number = 12, days: number = 30) {
    try {
      const dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - days);
      
      return await this.prisma.product.findMany({
        where: { 
          createdAt: {
            gte: dateThreshold
          },
          isActive: true
        },
        include: {
          category: true,
          supplier: {
            select: {
              id: true,
              companyName: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit
      });
    } catch (error) {
      console.error('❌ Error al obtener productos nuevos:', error);
      throw new Error('Error al obtener productos nuevos de la base de datos');
    }
  }

  async searchProducts(query: string, limit: number = 50) {
    try {
      if (!query || query.trim().length < 2) {
        throw new Error('La búsqueda debe tener al menos 2 caracteres');
      }

      return await this.prisma.product.findMany({
        where: {
          OR: [
            {
              title: {
                contains: query,
                mode: 'insensitive'
              }
            },
            {
              description: {
                contains: query,
                mode: 'insensitive'
              }
            }
          ],
          isActive: true
        },
        include: {
          category: true,
          supplier: {
            select: {
              id: true,
              companyName: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit
      });
    } catch (error) {
      console.error('❌ Error al buscar productos:', error);
      throw new Error('Error al buscar productos en la base de datos');
    }
  }

  async createProduct(productData: any) {
    try {
      return await this.prisma.product.create({
        data: {
          ...productData,
          price: parseFloat(productData.price),
          categoryId: parseInt(productData.categoryId),
          supplierId: parseInt(productData.supplierId)
        },
        include: {
          category: true,
          supplier: {
            select: {
              id: true,
              companyName: true,
              email: true
            }
          }
        }
      });
    } catch (error) {
      console.error('❌ Error al crear producto:', error);
      throw new Error('Error al crear producto en la base de datos');
    }
  }

  async updateProduct(id: number, updateData: any) {
    try {
      // Convertir tipos numéricos si están presentes
      if (updateData.price) updateData.price = parseFloat(updateData.price);
      if (updateData.categoryId) updateData.categoryId = parseInt(updateData.categoryId);
      if (updateData.minimumOrderQuantity) updateData.minimumOrderQuantity = parseInt(updateData.minimumOrderQuantity);
      
      return await this.prisma.product.update({
        where: { id },
        data: updateData,
        include: {
          category: true,
          supplier: {
            select: {
              id: true,
              companyName: true,
              email: true
            }
          }
        }
      });
    } catch (error) {
      console.error('❌ Error al actualizar producto:', error);
      if (error instanceof Error && 'code' in error && error.code === 'P2025') {
        return null; // Producto no encontrado
      }
      throw new Error('Error al actualizar producto en la base de datos');
    }
  }

  async deleteProduct(id: number) {
    try {
      await this.prisma.product.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      console.error('❌ Error al eliminar producto:', error);
      if (error instanceof Error && 'code' in error && error.code === 'P2025') {
        return false; // Producto no encontrado
      }
      throw new Error('Error al eliminar producto de la base de datos');
    }
  }

  // ================================================================
  // MÉTODOS DE ÓRDENES
  // ================================================================

  async getOrders(filters: {
    buyerId?: number;
    supplierId?: number;
    status?: string;
    page?: number;
    limit?: number;
  } = {}) {
    try {
      const { page = 1, limit = 50, ...whereFilters } = filters;
      
      // Construir filtros
      const where: any = {};
      
      if (whereFilters.buyerId) {
        where.buyerId = whereFilters.buyerId;
      }
      
      if (whereFilters.supplierId) {
        where.orderDetails = {
          some: {
            supplierId: whereFilters.supplierId
          }
        };
      }
      
      if (whereFilters.status) {
        where.status = whereFilters.status;
      }

      // Calcular paginación
      const skip = (page - 1) * limit;

      // Obtener órdenes con filtros
      const [orders, total] = await Promise.all([
        this.prisma.order.findMany({
          where,
          include: {
            buyer: {
              select: {
                id: true,
                companyName: true,
                email: true,
                contactPhone: true
              }
            },
            orderDetails: {
              include: {
                product: {
                  select: {
                    id: true,
                    title: true,
                    images: true,
                    category: {
                      select: {
                        id: true,
                        name: true
                      }
                    }
                  }
                },
                supplier: {
                  select: {
                    id: true,
                    companyName: true,
                    email: true
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit
        }),
        this.prisma.order.count({ where })
      ]);

      return {
        orders,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      console.error('❌ Error al obtener órdenes:', error);
      throw new Error('Error al obtener órdenes de la base de datos');
    }
  }

  async getOrderById(id: number) {
    try {
      return await this.prisma.order.findUnique({
        where: { id },
        include: {
          buyer: {
            select: {
              id: true,
              companyName: true,
              email: true,
              contactPhone: true,
              fiscalAddress: true,
              country: true,
              city: true
            }
          },
          orderDetails: {
            include: {
              product: {
                select: {
                  id: true,
                  title: true,
                  description: true,
                  images: true,
                  specifications: true,
                  category: {
                    select: {
                      id: true,
                      name: true
                    }
                  }
                }
              },
              supplier: {
                select: {
                  id: true,
                  companyName: true,
                  email: true,
                  contactPhone: true,
                  fiscalAddress: true,
                  country: true,
                  city: true
                }
              }
            }
          }
        }
      });
    } catch (error) {
      console.error('❌ Error al obtener orden por ID:', error);
      throw new Error('Error al obtener orden de la base de datos');
    }
  }

  async createOrder(orderData: {
    buyerId: number;
    orderDetails: Array<{
      productId: number;
      supplierId: number;
      quantity: number;
      unitPrice: number;
      currency?: string;
      specifications?: string;
    }>;
    shippingAddress?: string;
    notes?: string;
  }) {
    try {
      // Calcular total de la orden
      let totalAmount = 0;
      for (const detail of orderData.orderDetails) {
        totalAmount += detail.quantity * detail.unitPrice;
      }

      // Crear orden con detalles
      return await this.prisma.order.create({
        data: {
          orderNumber: `ORD-${Date.now()}`, // Generate a simple order number
          buyerId: orderData.buyerId,
          totalAmount: totalAmount,
          currency: 'USD', // Default currency
          status: 'PENDING' as any,
          notes: orderData.notes,
          orderDetails: {
            create: orderData.orderDetails.map(detail => ({
              product: {
                connect: { id: detail.productId }
              },
              supplier: {
                connect: { id: detail.supplierId }
              },
              quantity: detail.quantity,
              unitPrice: detail.unitPrice,
              totalPrice: detail.quantity * detail.unitPrice,
              currency: detail.currency || 'USD',
              specifications: detail.specifications
            }))
          }
        },
        include: {
          buyer: {
            select: {
              id: true,
              companyName: true,
              email: true
            }
          },
          orderDetails: {
            include: {
              product: {
                select: {
                  id: true,
                  title: true,
                  images: true
                }
              },
              supplier: {
                select: {
                  id: true,
                  companyName: true,
                  email: true
                }
              }
            }
          }
        }
      });
    } catch (error) {
      console.error('❌ Error al crear orden:', error);
      throw new Error('Error al crear orden en la base de datos');
    }
  }

  async updateOrderStatus(id: number, status: string, notes?: string) {
    try {
      return await this.prisma.order.update({
        where: { id },
        data: {
          status: status as any,
          notes: notes || undefined
        },
        include: {
          buyer: {
            select: {
              id: true,
              companyName: true,
              email: true
            }
          },
          orderDetails: {
            include: {
              product: {
                select: {
                  id: true,
                  title: true,
                  images: true
                }
              },
              supplier: {
                select: {
                  id: true,
                  companyName: true,
                  email: true
                }
              }
            }
          }
        }
      });
    } catch (error) {
      console.error('❌ Error al actualizar orden:', error);
      if (error instanceof Error && 'code' in error && error.code === 'P2025') {
        return null; // Orden no encontrada
      }
      throw new Error('Error al actualizar orden en la base de datos');
    }
  }

  async getOrdersByUser(userId: number, role: 'buyer' | 'supplier' = 'buyer', page: number = 1, limit: number = 20) {
    try {
      // Calcular paginación
      const skip = (page - 1) * limit;

      let whereClause: any;
      
      if (role === 'buyer') {
        whereClause = { buyerId: userId };
      } else {
        // Para suppliers, buscar en orderDetails
        whereClause = {
          orderDetails: {
            some: {
              supplierId: userId
            }
          }
        };
      }

      const [orders, total] = await Promise.all([
        this.prisma.order.findMany({
          where: whereClause,
          include: {
            buyer: {
              select: {
                id: true,
                companyName: true,
                email: true
              }
            },
            orderDetails: {
              include: {
                product: {
                  select: {
                    id: true,
                    title: true,
                    images: true
                  }
                },
                supplier: {
                  select: {
                    id: true,
                    companyName: true,
                    email: true
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit
        }),
        this.prisma.order.count({
          where: whereClause
        })
      ]);

      return {
        orders,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      console.error('❌ Error al obtener órdenes del usuario:', error);
      throw new Error('Error al obtener órdenes del usuario de la base de datos');
    }
  }

  async cancelOrder(id: number, reason?: string) {
    try {
      // Verificar que la orden esté en un estado cancelable
      const existingOrder = await this.prisma.order.findUnique({
        where: { id }
      });
      
      if (!existingOrder) {
        return null; // Orden no encontrada
      }
      
      if (!['PENDING', 'CONFIRMED'].includes(existingOrder.status)) {
        throw new Error('La orden no puede ser cancelada en su estado actual');
      }
      
      return await this.prisma.order.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          notes: reason ? `Cancelada: ${reason}` : 'Orden cancelada'
        }
      });
    } catch (error) {
      console.error('❌ Error al cancelar orden:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

// Singleton instance
export const databaseService = new DatabaseService();
