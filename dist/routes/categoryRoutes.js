"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryPrismaController_1 = require("../controllers/categoryPrismaController");
const router = (0, express_1.Router)();
// ===== RUTAS DE CATEGORÍAS CON PRISMA =====
// GET /api/categories - Obtener todas las categorías
router.get('/categories', categoryPrismaController_1.getCategories);
// GET /api/categories/tree - Obtener árbol de categorías
router.get('/categories/tree', categoryPrismaController_1.getCategoryTree);
// GET /api/categories/:id - Obtener categoría por ID
router.get('/categories/:id', categoryPrismaController_1.getCategoryById);
// POST /api/categories - Crear nueva categoría
router.post('/categories', categoryPrismaController_1.createCategory);
// PUT /api/categories/:id - Actualizar categoría
router.put('/categories/:id', categoryPrismaController_1.updateCategory);
// DELETE /api/categories/:id - Eliminar categoría
router.delete('/categories/:id', categoryPrismaController_1.deleteCategory);
exports.default = router;
