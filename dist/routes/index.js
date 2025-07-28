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
const quoteStatusRoutes_1 = __importDefault(require("./quoteStatusRoutes")); // Nuevas rutas para estados de cotización
const paymentOrderRoutes_1 = __importDefault(require("./paymentOrderRoutes"));
const router = (0, express_1.Router)();
// Rutas de la API
console.log('🔗 Configurando rutas principales...');
router.use('/auth', authRoutes_1.default);
router.use('/', categoryRoutes_1.default); // Incluye tanto /categories como /products
router.use('/products', productRoutes_1.default);
router.use('/cart', cartRoutes_1.default);
router.use('/orders', orderRoutes_1.default);
router.use('/rfq', rfqRoutesNew_1.default); // Usar las nuevas rutas con PostgreSQL
console.log('🔗 Configurando rutas de quotes...');
router.use('/quotes', quoteRoutes_1.default); // ✅ REACTIVADO PARA FUNCIONALIDAD REAL
router.use('/my-quotes', myQuotesRoutes_1.default);
router.use('/api', quoteStatusRoutes_1.default); // Rutas para gestión de estados de cotización
router.use('/payment-orders', paymentOrderRoutes_1.default);
router.use('/freight', freightRoutes_1.default);
router.use('/shipping', shippingRoutes_1.default);
console.log('✅ Todas las rutas configuradas');
// Ruta de prueba
router.get('/test', (req, res) => {
    res.json({
        message: 'API funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});
// Ruta de prueba específica para quotes
router.get('/quotes-test/:id', (req, res) => {
    console.log('🧪 Quotes test route - ID:', req.params.id);
    res.json({
        success: true,
        message: 'Quotes test route funcionando',
        id: req.params.id
    });
});
exports.default = router;
