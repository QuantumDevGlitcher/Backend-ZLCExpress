"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productRoutes_1 = __importDefault(require("./productRoutes"));
const cartRoutes_1 = __importDefault(require("./cartRoutes"));
const orderRoutes_1 = __importDefault(require("./orderRoutes"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const categoryRoutes_1 = __importDefault(require("./categoryRoutes"));
const rfqRoutes_1 = __importDefault(require("./rfqRoutes"));
const router = (0, express_1.Router)();
// Rutas de la API
router.use('/auth', authRoutes_1.default);
router.use('/', categoryRoutes_1.default); // Incluye tanto /categories como /products
router.use('/products', productRoutes_1.default);
router.use('/cart', cartRoutes_1.default);
router.use('/orders', orderRoutes_1.default);
router.use('/rfq', rfqRoutes_1.default);
// Ruta de prueba
router.get('/test', (req, res) => {
    res.json({
        message: 'API funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});
exports.default = router;
