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
exports.getProductsByCategory = exports.getProductById = exports.getAllProducts = void 0;
const productService_1 = require("../services/productService");
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 20,
            search: req.query.search,
            category: req.query.category,
            priceMin: req.query.priceMin ? parseFloat(req.query.priceMin) : undefined,
            priceMax: req.query.priceMax ? parseFloat(req.query.priceMax) : undefined,
            containerType: req.query.containerType,
            incoterm: req.query.incoterm,
            isNegotiable: req.query.isNegotiable === 'true',
            allowsCustomOrders: req.query.allowsCustomOrders === 'true',
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder
        };
        console.log('🔄 ProductController.getAllProducts called');
        const result = yield productService_1.ProductService.getAllProducts(filters);
        // Debug logging
        if (result.success && result.products && result.products.length > 0) {
            const firstProduct = result.products[0];
            console.log(`📦 First product debug:`);
            console.log(`   ID: ${firstProduct.id}`);
            console.log(`   name: "${firstProduct.name}"`);
            console.log(`   name type: ${typeof firstProduct.name}`);
            console.log(`   pricePerContainer: ${firstProduct.pricePerContainer}`);
            // Si el nombre sigue siendo undefined, forzar a usar un nombre por defecto
            result.products = result.products.map(product => (Object.assign(Object.assign({}, product), { name: product.name || `Producto ID ${product.id}` // Fallback temporal
             })));
            console.log(`📦 After fallback - name: "${result.products[0].name}"`);
        }
        res.json(result);
    }
    catch (error) {
        console.error('❌ ProductController error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            products: [],
            total: 0
        });
    }
});
exports.getAllProducts = getAllProducts;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield productService_1.ProductService.getProductById(id);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getProductById = getProductById;
const getProductsByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category } = req.params;
        const products = yield productService_1.ProductService.getProductsByCategory(category);
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getProductsByCategory = getProductsByCategory;
