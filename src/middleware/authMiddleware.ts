// middleware/authMiddleware.ts
// Middleware de autenticación JWT para validar usuarios

import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    userType: string;
    isVerified: boolean;
  };
}

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Debes iniciar sesión para acceder a este recurso',
        error: 'AUTHENTICATION_REQUIRED'
      });
    }

    const token = authHeader.substring(7); // Remover "Bearer "
    
    // Verificar JWT
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Obtener todas las sesiones activas del usuario
    const activeSessions = await prisma.userSession.findMany({
      where: {
        userId: decoded.userId,
        isActive: true,
        expiresAt: {
          gt: new Date()
        }
      }
    });

    // Verificar si alguna sesión coincide con el token
    let validSession = null;
    for (const session of activeSessions) {
      const isValidToken = session.tokenHash === token; // Comparación directa en lugar de bcrypt
      if (isValidToken) {
        validSession = session;
        break;
      }
    }

    if (!validSession) {
      return res.status(401).json({
        success: false,
        message: 'Sesión expirada o inválida',
        error: 'SESSION_INVALID'
      });
    }

    // Obtener datos del usuario
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado',
        error: 'USER_NOT_FOUND'
      });
    }

    // Añadir datos del usuario al request
    req.user = {
      id: user.id,
      email: user.email,
      userType: user.userType,
      isVerified: user.isVerified,
    };
    
    next();
  } catch (error) {
    console.error('❌ Error en middleware de autenticación:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticación inválido',
        error: 'INVALID_TOKEN'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: 'INTERNAL_ERROR'
    });
  }
};

export const requireBuyer = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  await requireAuth(req, res, () => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Información de usuario no disponible',
        error: 'USER_INFO_MISSING'
      });
    }

    const userType = req.user.userType;
    
    if (!userType || (userType !== 'BUYER' && userType !== 'BOTH')) {
      return res.status(403).json({
        success: false,
        message: 'Solo los compradores pueden acceder a este recurso',
        error: 'BUYER_REQUIRED',
        userType: userType,
        userId: req.user.id
      });
    }
    
    next();
  });
};

export const requireSupplier = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  await requireAuth(req, res, () => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Información de usuario no disponible',
        error: 'USER_INFO_MISSING'
      });
    }

    const userType = req.user.userType;
    
    if (!userType || (userType !== 'SUPPLIER' && userType !== 'BOTH')) {
      return res.status(403).json({
        success: false,
        message: 'Solo los proveedores pueden acceder a este recurso',
        error: 'SUPPLIER_REQUIRED',
        userType: userType,
        userId: req.user.id
      });
    }
    
    next();
  });
};

export const checkRole = (role: string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    await requireAuth(req, res, () => {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Información de usuario no disponible' });
      }
      const userType = (req.user.userType || '').toLowerCase();
      if (userType !== role.toLowerCase()) {
        return res.status(403).json({ success: false, message: 'Acceso restringido para rol ' + role });
      }
      next();
    });
  };
};
