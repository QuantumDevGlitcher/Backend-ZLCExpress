// ================================================================
// CONTROLADOR DE AUTENTICACIÓN CON PRISMA - ZLCExpress
// ================================================================

import { Request, Response } from 'express';
import { databaseService } from '../services/prismaService';

// Interfaces para requests
interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
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
  userType?: 'BUYER' | 'SUPPLIER' | 'BOTH';
}

// ================================================================
// LOGIN
// ================================================================

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginRequest = req.body;
    
    // Validaciones de entrada
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de email inválido'
      });
    }

    // Obtener datos de sesión
    const sessionData = {
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
    };

    // Autenticar usuario
    const authResult = await databaseService.authenticateUser(
      { email, password },
      sessionData
    );

    if (!authResult) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    const { user, token } = authResult;

    // Respuesta exitosa (sin password)
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: userWithoutPassword,
        token,
        expiresIn: '7d'
      }
    });
    
  } catch (error: any) {
    console.error('❌ Error en login:', error);
    
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ================================================================
// REGISTRO
// ================================================================

export const register = async (req: Request, res: Response) => {
  try {
    const userData: RegisterRequest = req.body;
    
    // Validaciones requeridas
    const requiredFields = [
      'email', 'password', 'companyName', 'taxId', 'operationCountry',
      'industry', 'contactName', 'contactPosition', 'contactPhone',
      'fiscalAddress', 'country', 'state', 'city', 'postalCode'
    ];

    const missingFields = requiredFields.filter(field => !userData[field as keyof RegisterRequest]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Campos requeridos faltantes: ${missingFields.join(', ')}`
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de email inválido'
      });
    }

    // Validar longitud de contraseña
    if (userData.password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Crear usuario
    const newUser = await databaseService.createUser(userData);
    
    // Respuesta exitosa (sin password)
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user: userWithoutPassword
      }
    });
    
  } catch (error: any) {
    console.error('❌ Error en registro:', error);
    
    if (error.message === 'El email ya está registrado') {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ================================================================
// PERFIL DE USUARIO
// ================================================================

export const getProfile = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de autorización requerido'
      });
    }

    const token = authHeader.substring(7); // Remover "Bearer "
    
    // Verificar token y obtener usuario
    const user = await databaseService.verifyToken(token);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }

    // Respuesta exitosa (sin password)
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      data: {
        user: userWithoutPassword
      }
    });
    
  } catch (error: any) {
    console.error('❌ Error obteniendo perfil:', error);
    
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// ================================================================
// LOGOUT
// ================================================================

export const logout = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de autorización requerido'
      });
    }

    const token = authHeader.substring(7);
    
    // Verificar token para obtener userId
    const user = await databaseService.verifyToken(token);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    // Hacer logout (desactivar sesión)
    await databaseService.logoutUser(user.id, token);
    
    res.json({
      success: true,
      message: 'Logout exitoso'
    });
    
  } catch (error: any) {
    console.error('❌ Error en logout:', error);
    
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// ================================================================
// VERIFICAR USUARIO
// ================================================================

export const verifyUser = async (req: Request, res: Response) => {
  try {
    const { userId, status } = req.body;
    
    if (!userId || !status) {
      return res.status(400).json({
        success: false,
        message: 'userId y status son requeridos'
      });
    }

    if (!['PENDING', 'VERIFIED', 'REJECTED'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status inválido. Debe ser PENDING, VERIFIED o REJECTED'
      });
    }

    const updatedUser = await databaseService.verifyUser(userId, status);
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Respuesta exitosa (sin password)
    const { password: _, ...userWithoutPassword } = updatedUser;
    
    res.json({
      success: true,
      message: `Usuario ${status.toLowerCase()} exitosamente`,
      data: {
        user: userWithoutPassword
      }
    });
    
  } catch (error: any) {
    console.error('❌ Error verificando usuario:', error);
    
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// ================================================================
// OBTENER ESTADÍSTICAS DE USUARIOS
// ================================================================

export const getUserStats = async (req: Request, res: Response) => {
  try {
    const stats = await databaseService.getUserStats();
    
    res.json({
      success: true,
      data: {
        stats
      }
    });
    
  } catch (error: any) {
    console.error('❌ Error obteniendo estadísticas:', error);
    
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// ================================================================
// BUSCAR USUARIOS
// ================================================================

export const searchUsers = async (req: Request, res: Response) => {
  try {
    const { query, verified, userType, country } = req.query;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Parámetro query es requerido'
      });
    }

    const filters: any = {};
    
    if (verified !== undefined) {
      filters.verified = verified === 'true';
    }
    
    if (userType && typeof userType === 'string') {
      filters.userType = userType.toUpperCase();
    }
    
    if (country && typeof country === 'string') {
      filters.country = country;
    }

    const users = await databaseService.searchUsers(query, filters);
    
    // Remover passwords de la respuesta
    const usersWithoutPasswords = users.map(user => {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.json({
      success: true,
      data: {
        users: usersWithoutPasswords,
        total: usersWithoutPasswords.length
      }
    });
    
  } catch (error: any) {
    console.error('❌ Error buscando usuarios:', error);
    
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// ================================================================
// HEALTH CHECK DE BASE DE DATOS
// ================================================================

export const healthCheck = async (req: Request, res: Response) => {
  try {
    const isHealthy = await databaseService.healthCheck();
    
    if (isHealthy) {
      res.json({
        success: true,
        message: 'Base de datos conectada correctamente',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(503).json({
        success: false,
        message: 'Base de datos no disponible'
      });
    }
    
  } catch (error: any) {
    console.error('❌ Error en health check:', error);
    
    res.status(503).json({ 
      success: false,
      message: 'Error de conexión a base de datos'
    });
  }
};
