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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryTree = exports.getCategoryById = exports.getCategories = void 0;
const prismaService_1 = require("../services/prismaService");
// ================================================================
// CONTROLADOR DE CATEGORÍAS CON PRISMA
// ================================================================
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { parentId, includeInactive } = req.query;
        const categories = yield prismaService_1.databaseService.getCategories({
            parentId: parentId ? parseInt(parentId) : undefined,
            includeInactive: includeInactive === 'true'
        });
        res.json({
            success: true,
            categories: categories,
            message: 'Categorías obtenidas exitosamente'
        });
    }
    catch (error) {
        console.error('❌ Error al obtener categorías:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
exports.getCategories = getCategories;
const getCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const category = yield prismaService_1.databaseService.getCategoryById(parseInt(id));
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada'
            });
        }
        res.json({
            success: true,
            data: category
        });
    }
    catch (error) {
        console.error('❌ Error al obtener categoría:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
exports.getCategoryById = getCategoryById;
const getCategoryTree = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryTree = yield prismaService_1.databaseService.getCategoryTree();
        res.json({
            success: true,
            data: categoryTree
        });
    }
    catch (error) {
        console.error('❌ Error al obtener árbol de categorías:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
exports.getCategoryTree = getCategoryTree;
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryData = req.body;
        // Validaciones básicas
        if (!categoryData.name) {
            return res.status(400).json({
                success: false,
                message: 'El nombre de la categoría es requerido'
            });
        }
        const newCategory = yield prismaService_1.databaseService.createCategory(categoryData);
        res.status(201).json({
            success: true,
            message: 'Categoría creada exitosamente',
            data: newCategory
        });
    }
    catch (error) {
        console.error('❌ Error al crear categoría:', error);
        if (error.message.includes('Duplicate')) {
            return res.status(409).json({
                success: false,
                message: 'Ya existe una categoría con ese nombre'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
exports.createCategory = createCategory;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedCategory = yield prismaService_1.databaseService.updateCategory(parseInt(id), updateData);
        if (!updatedCategory) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada'
            });
        }
        res.json({
            success: true,
            message: 'Categoría actualizada exitosamente',
            data: updatedCategory
        });
    }
    catch (error) {
        console.error('❌ Error al actualizar categoría:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
exports.updateCategory = updateCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield prismaService_1.databaseService.deleteCategory(parseInt(id));
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada'
            });
        }
        res.json({
            success: true,
            message: 'Categoría eliminada exitosamente'
        });
    }
    catch (error) {
        console.error('❌ Error al eliminar categoría:', error);
        if (error.message.includes('products')) {
            return res.status(400).json({
                success: false,
                message: 'No se puede eliminar la categoría porque tiene productos asociados'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
exports.deleteCategory = deleteCategory;
