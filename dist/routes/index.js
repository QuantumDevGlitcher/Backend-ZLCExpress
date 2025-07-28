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
const rfqRoutesNew_1 = __importDefault(require("./rfqRoutesNew")); // Nuevas rutas con PostgreSQL
const freightRoutes_1 = __importDefault(require("./freightRoutes"));
const shippingRoutes_1 = __importDefault(require("./shippingRoutes"));
const quoteRoutes_1 = __importDefault(require("./quoteRoutes"));
const myQuotesRoutes_1 = __importDefault(require("./myQuotesRoutes"));
const router = (0, express_1.Router)();
// Rutas de la API
router.use('/auth', authRoutes_1.default);
router.use('/', categoryRoutes_1.default); // Incluye tanto /categories como /products
router.use('/products', productRoutes_1.default);
router.use('/cart', cartRoutes_1.default);
router.use('/orders', orderRoutes_1.default);
router.use('/rfq', rfqRoutesNew_1.default); // Usar las nuevas rutas con PostgreSQL
router.use('/quotes', quoteRoutes_1.default);
router.use('/my-quotes', myQuotesRoutes_1.default);
router.use('/freight', freightRoutes_1.default);
router.use('/shipping', shippingRoutes_1.default);
// Ruta de prueba
router.get('/test', (req, res) => {
    res.json({
        message: 'API funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});
exports.default = router;
