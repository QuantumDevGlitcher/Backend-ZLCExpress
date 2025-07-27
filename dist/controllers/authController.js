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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSession = exports.logout = exports.getProfile = exports.register = exports.login = void 0;
const prismaService_1 = require("../services/prismaService");
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
        // Obtener datos de sesión
        const sessionData = {
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent'),
        };
        // Autenticar usuario con Prisma
        const authResult = yield prismaService_1.databaseService.authenticateUser({ email, password }, sessionData);
        if (!authResult) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }
        const { user, token } = authResult;
        // Respuesta exitosa (sin password)
        const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
        res.json({
            success: true,
            message: 'Login exitoso',
            user: userWithoutPassword,
            token,
            expiresIn: '7d'
        });
    }
    catch (error) {
        console.error('❌ Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
exports.login = login;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const newUser = yield prismaService_1.databaseService.createUser(userData);
        // Respuesta exitosa (sin password)
        const { password: _ } = newUser, userWithoutPassword = __rest(newUser, ["password"]);
        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            user: userWithoutPassword
        });
    }
    catch (error) {
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
});
exports.register = register;
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const user = yield prismaService_1.databaseService.verifyToken(token);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Token inválido o expirado'
            });
        }
        // Respuesta exitosa (sin password)
        const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
        res.json({
            success: true,
            data: {
                user: userWithoutPassword
            }
        });
    }
    catch (error) {
        console.error('❌ Error obteniendo perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});
exports.getProfile = getProfile;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const user = yield prismaService_1.databaseService.verifyToken(token);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Token inválido'
            });
        }
        // Hacer logout (desactivar sesión)
        yield prismaService_1.databaseService.logoutUser(user.id, token);
        res.json({
            success: true,
            message: 'Logout exitoso'
        });
    }
    catch (error) {
        console.error('❌ Error en logout:', error);
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
        // Verificar token con Prisma
        const user = yield prismaService_1.databaseService.verifyToken(token);
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
    }
    catch (error) {
        console.error('❌ Error al validar sesión:', error);
        res.status(500).json({
            success: false,
            valid: false,
            message: 'Error interno del servidor'
        });
    }
});
exports.validateSession = validateSession;
