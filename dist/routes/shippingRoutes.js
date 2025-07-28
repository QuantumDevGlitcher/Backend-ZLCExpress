"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shippingController_1 = require("../controllers/shippingController");
const router = (0, express_1.Router)();
// Rutas de cotizaciones de flete
router.post('/quotes', shippingController_1.ShippingController.getShippingQuotes);
router.post('/quotes/select', shippingController_1.ShippingController.selectShippingQuote);
router.get('/quotes/user', shippingController_1.ShippingController.getUserQuotes);
router.get('/quotes/order/:orderId', shippingController_1.ShippingController.getOrderQuotes);
// Rutas de puertos
router.get('/ports', shippingController_1.ShippingController.getAvailablePorts);
// Rutas de órdenes con shipping
router.post('/orders/create', shippingController_1.ShippingController.createOrderWithShipping);
router.post('/orders/confirm', shippingController_1.ShippingController.confirmOrderWithShipping);
exports.default = router;
