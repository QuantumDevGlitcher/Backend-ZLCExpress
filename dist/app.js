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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const prismaService_1 = require("./services/prismaService");
// Cargar variables de entorno
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Rutas
app.use('/api', routes_1.default);
// Health check
app.get('/health', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Verificar conexión a la base de datos
        const dbHealth = yield prismaService_1.databaseService.healthCheck();
        res.status(200).json({
            status: 'OK',
            message: 'ZLCExpress Backend is running',
            database: dbHealth ? 'Connected' : 'Disconnected',
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(503).json({
            status: 'ERROR',
            message: 'Service unavailable',
            database: 'Error',
            timestamp: new Date().toISOString()
        });
    }
}));
// Database health check específico
app.get('/health/database', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isHealthy = yield prismaService_1.databaseService.healthCheck();
        const stats = yield prismaService_1.databaseService.getUserStats();
        res.status(isHealthy ? 200 : 503).json({
            success: isHealthy,
            message: isHealthy ? 'Database connected' : 'Database disconnected',
            stats: isHealthy ? stats : null,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Database health check failed',
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
        });
    }
}));
// Debug endpoint para estadísticas de usuarios
app.get('/debug/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stats = yield prismaService_1.databaseService.getUserStats();
        const countriesStats = yield prismaService_1.databaseService.getUsersByCountry();
        res.status(200).json({
            success: true,
            message: 'Estadísticas de usuarios',
            data: {
                stats,
                byCountry: countriesStats
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error obteniendo estadísticas de usuarios',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
}));
// Test endpoint para verificar integración del login
app.get('/test/auth', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Probar login con usuario de prueba
        const testLogin = yield prismaService_1.databaseService.authenticateUser({ email: 'admin@zlcexpress.com', password: 'admin123' }, { ipAddress: req.ip, userAgent: req.get('User-Agent') });
        if (testLogin) {
            const _a = testLogin.user, { password: _ } = _a, userWithoutPassword = __rest(_a, ["password"]);
            res.json({
                success: true,
                message: '✅ Sistema de login integrado correctamente con PostgreSQL + Prisma',
                data: {
                    user: userWithoutPassword,
                    hasToken: !!testLogin.token,
                    tokenType: 'JWT'
                }
            });
        }
        else {
            res.status(401).json({
                success: false,
                message: '❌ Error en integración del login'
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: '❌ Error probando integración',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
}));
// Middleware de manejo de errores
app.use(errorHandler_1.errorHandler);
// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check available at http://localhost:${PORT}/health`);
});
exports.default = app;
