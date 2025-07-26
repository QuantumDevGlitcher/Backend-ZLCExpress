"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
// Rutas de autenticación
router.post('/login', authController_1.login);
router.post('/logout', authController_1.logout);
router.get('/profile', authController_1.getProfile);
router.get('/validate', authController_1.validateSession);
exports.default = router;
