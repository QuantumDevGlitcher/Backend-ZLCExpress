"use strict";
// ================================================================
// RUTAS DE AUTENTICACIÓN CON PRISMA - ZLCExpress
// ================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authControllerNew_1 = require("../controllers/authControllerNew");
const router = express_1.default.Router();
// ================================================================
// RUTAS PÚBLICAS (sin autenticación)
// ================================================================
/**
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión de usuario
 * @access  Public
 * @body    { email: string, password: string }
 */
router.post('/login', authControllerNew_1.login);
/**
 * @route   POST /api/auth/register
 * @desc    Registrar nuevo usuario empresarial
 * @access  Public
 * @body    { email, password, companyName, taxId, operationCountry, industry, contactName, contactPosition, contactPhone, fiscalAddress, country, state, city, postalCode, userType? }
 */
router.post('/register', authControllerNew_1.register);
/**
 * @route   GET /api/auth/health
 * @desc    Verificar estado de la base de datos
 * @access  Public
 */
router.get('/health', authControllerNew_1.healthCheck);
// ================================================================
// RUTAS PROTEGIDAS (requieren autenticación)
// ================================================================
/**
 * @route   GET /api/auth/profile
 * @desc    Obtener perfil del usuario actual
 * @access  Private
 * @header  Authorization: Bearer <token>
 */
router.get('/profile', authControllerNew_1.getProfile);
/**
 * @route   POST /api/auth/logout
 * @desc    Cerrar sesión del usuario
 * @access  Private
 * @header  Authorization: Bearer <token>
 */
router.post('/logout', authControllerNew_1.logout);
/**
 * @route   PUT /api/auth/verify
 * @desc    Verificar estado de usuario (solo administradores)
 * @access  Private (Admin)
 * @body    { userId: number, status: 'PENDING' | 'VERIFIED' | 'REJECTED' }
 */
router.put('/verify', authControllerNew_1.verifyUser);
/**
 * @route   GET /api/auth/stats
 * @desc    Obtener estadísticas de usuarios
 * @access  Private (Admin)
 */
router.get('/stats', authControllerNew_1.getUserStats);
/**
 * @route   GET /api/auth/search
 * @desc    Buscar usuarios por criterios
 * @access  Private (Admin)
 * @query   { query: string, verified?: boolean, userType?: string, country?: string }
 */
router.get('/search', authControllerNew_1.searchUsers);
exports.default = router;
