// ================================================================
// RUTAS DE AUTENTICACIÓN CON PRISMA - ZLCExpress
// ================================================================

import express from 'express';
import {
  login,
  register,
  getProfile,
  logout,
  verifyUser,
  getUserStats,
  searchUsers,
  healthCheck
} from '../controllers/authControllerNew';

const router = express.Router();

// ================================================================
// RUTAS PÚBLICAS (sin autenticación)
// ================================================================

/**
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión de usuario
 * @access  Public
 * @body    { email: string, password: string }
 */
router.post('/login', login);

/**
 * @route   POST /api/auth/register
 * @desc    Registrar nuevo usuario empresarial
 * @access  Public
 * @body    { email, password, companyName, taxId, operationCountry, industry, contactName, contactPosition, contactPhone, fiscalAddress, country, state, city, postalCode, userType? }
 */
router.post('/register', register);

/**
 * @route   GET /api/auth/health
 * @desc    Verificar estado de la base de datos
 * @access  Public
 */
router.get('/health', healthCheck);

// ================================================================
// RUTAS PROTEGIDAS (requieren autenticación)
// ================================================================

/**
 * @route   GET /api/auth/profile
 * @desc    Obtener perfil del usuario actual
 * @access  Private
 * @header  Authorization: Bearer <token>
 */
router.get('/profile', getProfile);

/**
 * @route   POST /api/auth/logout
 * @desc    Cerrar sesión del usuario
 * @access  Private
 * @header  Authorization: Bearer <token>
 */
router.post('/logout', logout);

/**
 * @route   PUT /api/auth/verify
 * @desc    Verificar estado de usuario (solo administradores)
 * @access  Private (Admin)
 * @body    { userId: number, status: 'PENDING' | 'VERIFIED' | 'REJECTED' }
 */
router.put('/verify', verifyUser);

/**
 * @route   GET /api/auth/stats
 * @desc    Obtener estadísticas de usuarios
 * @access  Private (Admin)
 */
router.get('/stats', getUserStats);

/**
 * @route   GET /api/auth/search
 * @desc    Buscar usuarios por criterios
 * @access  Private (Admin)
 * @query   { query: string, verified?: boolean, userType?: string, country?: string }
 */
router.get('/search', searchUsers);

export default router;
