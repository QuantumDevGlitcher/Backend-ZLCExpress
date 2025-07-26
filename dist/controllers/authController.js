"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSession = exports.logout = exports.getProfile = exports.login = void 0;
const authService_1 = require("../services/authService");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const loginResult = yield authService_1.AuthService.login({ email, password });
        if (!loginResult.success) {
            return res.status(401).json(loginResult);
        }
        // Login exitoso
        res.json(loginResult);
    }
    catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});
exports.login = login;
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const userId = yield authService_1.AuthService.validateToken(token);
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Token inválido o expirado'
            });
        }
        const user = yield authService_1.AuthService.getProfile(userId);
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
    }
    catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});
exports.getProfile = getProfile;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // En una implementación real con JWT, aquí podrías invalidar el token
        // o agregarlo a una blacklist
        res.json({
            success: true,
            message: 'Sesión cerrada exitosamente'
        });
    }
    catch (error) {
        console.error('Error en logout:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});
exports.logout = logout;
// Endpoint adicional para validar si el token es válido
const validateSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const userId = yield authService_1.AuthService.validateToken(token);
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
    }
    catch (error) {
        console.error('Error al validar sesión:', error);
        res.status(500).json({
            success: false,
            valid: false,
            message: 'Error interno del servidor'
        });
    }
});
exports.validateSession = validateSession;
