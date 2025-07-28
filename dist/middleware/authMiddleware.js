"use strict";
// middleware/authMiddleware.ts
// Middleware de autenticación para validar usuarios
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireSupplier = exports.requireBuyer = exports.requireAuth = void 0;
const requireAuth = (req, res, next) => {
    try {
        const userId = parseInt(req.headers['user-id']);
        if (!userId || isNaN(userId)) {
            return res.status(401).json({
                success: false,
                message: 'Debes iniciar sesión para acceder a este recurso',
                error: 'AUTHENTICATION_REQUIRED'
            });
        }
        // Añadir userId al request para uso posterior
        req.userId = userId;
        req.userType = req.headers['user-type'];
        next();
    }
    catch (error) {
        console.error('❌ Error en middleware de autenticación:', error);
        return res.status(401).json({
            success: false,
            message: 'Token de autenticación inválido',
            error: 'INVALID_AUTH'
        });
    }
};
exports.requireAuth = requireAuth;
const requireBuyer = (req, res, next) => {
    (0, exports.requireAuth)(req, res, () => {
        const userType = req.headers['user-type'];
        if (!userType || (userType !== 'BUYER' && userType !== 'BOTH')) {
            return res.status(403).json({
                success: false,
                message: 'Solo los compradores pueden acceder a este recurso',
                error: 'BUYER_REQUIRED'
            });
        }
        next();
    });
};
exports.requireBuyer = requireBuyer;
const requireSupplier = (req, res, next) => {
    (0, exports.requireAuth)(req, res, () => {
        const userType = req.headers['user-type'];
        if (!userType || (userType !== 'SUPPLIER' && userType !== 'BOTH')) {
            return res.status(403).json({
                success: false,
                message: 'Solo los proveedores pueden acceder a este recurso',
                error: 'SUPPLIER_REQUIRED'
            });
        }
        next();
    });
};
exports.requireSupplier = requireSupplier;
