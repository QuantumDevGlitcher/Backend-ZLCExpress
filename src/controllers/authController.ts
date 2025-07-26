import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

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

    const loginResult = await AuthService.login({ email, password });
    
    if (!loginResult.success) {
      return res.status(401).json(loginResult);
    }

    // Login exitoso
    res.json(loginResult);
    
  } catch (error: any) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor' 
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    // En una implementación real, extraerías el userId del token JWT del header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de autorización requerido'
      });
    }

    const token = authHeader.substring(7); // Remover 'Bearer '
    const userId = await AuthService.validateToken(token);
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }

    const user = await AuthService.getProfile(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      user
    });
    
  } catch (error: any) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor' 
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    // En una implementación real con JWT, aquí podrías invalidar el token
    // o agregarlo a una blacklist
    res.json({ 
      success: true,
      message: 'Sesión cerrada exitosamente' 
    });
  } catch (error: any) {
    console.error('Error en logout:', error);
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
    const userId = await AuthService.validateToken(token);
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        valid: false,
        message: 'Token inválido o expirado'
      });
    }

    res.json({
      success: true,
      valid: true,
      message: 'Sesión válida'
    });
    
  } catch (error: any) {
    console.error('Error al validar sesión:', error);
    res.status(500).json({ 
      success: false,
      valid: false,
      message: 'Error interno del servidor' 
    });
  }
};
