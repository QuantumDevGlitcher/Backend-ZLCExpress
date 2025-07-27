"use strict";
// ================================================================
// CONTROLADOR DE AUTENTICACIÓN CON PRISMA - ZLCExpress
// ================================================================
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
exports.healthCheck = exports.searchUsers = exports.getUserStats = exports.verifyUser = exports.logout = exports.getProfile = exports.register = exports.login = void 0;
const prismaService_1 = require("../services/prismaService");
// ================================================================
// LOGIN
// ================================================================
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
            data: {
                user: userWithoutPassword,
                token,
                expiresIn: '7d'
            }
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
// ================================================================
// REGISTRO
// ================================================================
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
        // Crear usuario
        const newUser = yield prismaService_1.databaseService.createUser(userData);
        // Respuesta exitosa (sin password)
        const { password: _ } = newUser, userWithoutPassword = __rest(newUser, ["password"]);
        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            data: {
                user: userWithoutPassword
            }
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
// ================================================================
// PERFIL DE USUARIO
// ================================================================
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
        // Verificar token y obtener usuario
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
// ================================================================
// LOGOUT
// ================================================================
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
// ================================================================
// VERIFICAR USUARIO
// ================================================================
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const updatedUser = yield prismaService_1.databaseService.verifyUser(userId, status);
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        // Respuesta exitosa (sin password)
        const { password: _ } = updatedUser, userWithoutPassword = __rest(updatedUser, ["password"]);
        res.json({
            success: true,
            message: `Usuario ${status.toLowerCase()} exitosamente`,
            data: {
                user: userWithoutPassword
            }
        });
    }
    catch (error) {
        console.error('❌ Error verificando usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});
exports.verifyUser = verifyUser;
// ================================================================
// OBTENER ESTADÍSTICAS DE USUARIOS
// ================================================================
const getUserStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stats = yield prismaService_1.databaseService.getUserStats();
        res.json({
            success: true,
            data: {
                stats
            }
        });
    }
    catch (error) {
        console.error('❌ Error obteniendo estadísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});
exports.getUserStats = getUserStats;
// ================================================================
// BUSCAR USUARIOS
// ================================================================
const searchUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query, verified, userType, country } = req.query;
        if (!query || typeof query !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Parámetro query es requerido'
            });
        }
        const filters = {};
        if (verified !== undefined) {
            filters.verified = verified === 'true';
        }
        if (userType && typeof userType === 'string') {
            filters.userType = userType.toUpperCase();
        }
        if (country && typeof country === 'string') {
            filters.country = country;
        }
        const users = yield prismaService_1.databaseService.searchUsers(query, filters);
        // Remover passwords de la respuesta
        const usersWithoutPasswords = users.map(user => {
            const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
            return userWithoutPassword;
        });
        res.json({
            success: true,
            data: {
                users: usersWithoutPasswords,
                total: usersWithoutPasswords.length
            }
        });
    }
    catch (error) {
        console.error('❌ Error buscando usuarios:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});
exports.searchUsers = searchUsers;
// ================================================================
// HEALTH CHECK DE BASE DE DATOS
// ================================================================
const healthCheck = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isHealthy = yield prismaService_1.databaseService.healthCheck();
        if (isHealthy) {
            res.json({
                success: true,
                message: 'Base de datos conectada correctamente',
                timestamp: new Date().toISOString()
            });
        }
        else {
            res.status(503).json({
                success: false,
                message: 'Base de datos no disponible'
            });
        }
    }
    catch (error) {
        console.error('❌ Error en health check:', error);
        res.status(503).json({
            success: false,
            message: 'Error de conexión a base de datos'
        });
    }
});
exports.healthCheck = healthCheck;
