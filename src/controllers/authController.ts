import { Request, Response } from 'express';
import { databaseService } from '../services/prismaService';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Validaciones de entrada
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    // Validar formato de email básico
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

    // Autenticar usuario con Prisma
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
      user: userWithoutPassword,
      token,
      expiresIn: '7d'
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

export const register = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    
    // Validaciones requeridas
    const requiredFields = [
      'email', 'password', 'companyName', 'taxId', 'operationCountry',
      'industry', 'contactName', 'contactPosition', 'contactPhone',
      'fiscalAddress', 'country', 'state', 'city', 'postalCode'
    ];

    const missingFields = requiredFields.filter(field => !userData[field]);
    
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

    // Crear usuario con Prisma
    const newUser = await databaseService.createUser(userData);
    
    // Respuesta exitosa (sin password)
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user: userWithoutPassword
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
    
    // Verificar token y obtener usuario con Prisma
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

// Endpoint adicional para validar si el token es válido
export const validateSession = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        valid: false,
        message: 'Token de autorización requerido'
      });
    }

    const token = authHeader.substring(7);
    
    // Verificar token con Prisma
    const user = await databaseService.verifyToken(token);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        valid: false,
        message: 'Token inválido o expirado'
      });
    }

    res.json({
      success: true,
      valid: true,
      message: 'Sesión válida',
      data: {
        userId: user.id,
        email: user.email
      }
    });
    
  } catch (error: any) {
    console.error('❌ Error al validar sesión:', error);
    res.status(500).json({ 
      success: false,
      valid: false,
      message: 'Error interno del servidor' 
    });
  }
};
