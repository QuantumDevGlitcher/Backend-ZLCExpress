"use strict";
// controllers/quoteCommentController.ts
// Controlador para manejar comentarios de cotizaciones
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuoteCommentController = void 0;
const quoteCommentService_1 = __importDefault(require("../services/quoteCommentService"));
class QuoteCommentController {
    // Crear un nuevo comentario
    static createComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('💬 QuoteCommentController: Creando comentario');
                console.log('📦 Body recibido:', req.body);
                const { quoteId, userId, userType, comment, status } = req.body;
                // Validar datos requeridos
                if (!quoteId || !userId || !userType || !comment || !status) {
                    return res.status(400).json({
                        success: false,
                        message: 'Faltan datos requeridos para crear el comentario',
                        required: ['quoteId', 'userId', 'userType', 'comment', 'status']
                    });
                }
                // Validar userType
                if (!['BUYER', 'SUPPLIER'].includes(userType)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Tipo de usuario inválido. Debe ser BUYER o SUPPLIER'
                    });
                }
                // Crear el comentario
                const newComment = yield quoteCommentService_1.default.createComment({
                    quoteId,
                    userId,
                    userType: userType,
                    comment,
                    status
                });
                console.log('✅ QuoteCommentController: Comentario creado exitosamente:', newComment.id);
                res.status(201).json({
                    success: true,
                    message: 'Comentario creado exitosamente',
                    comment: newComment
                });
            }
            catch (error) {
                console.error('❌ QuoteCommentController: Error creando comentario:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error interno del servidor al crear el comentario',
                    error: error instanceof Error ? error.message : 'Error desconocido'
                });
            }
        });
    }
    // Obtener comentarios de una cotización
    static getQuoteComments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { quoteId } = req.params;
                console.log('💬 QuoteCommentController: Obteniendo comentarios para cotización:', quoteId);
                if (!quoteId || isNaN(Number(quoteId))) {
                    return res.status(400).json({
                        success: false,
                        message: 'ID de cotización inválido'
                    });
                }
                const comments = yield quoteCommentService_1.default.getQuoteComments(Number(quoteId));
                console.log('✅ QuoteCommentController: Comentarios obtenidos:', comments.length);
                res.status(200).json({
                    success: true,
                    comments,
                    count: comments.length
                });
            }
            catch (error) {
                console.error('❌ QuoteCommentController: Error obteniendo comentarios:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error interno del servidor',
                    error: error instanceof Error ? error.message : 'Error desconocido'
                });
            }
        });
    }
    // Obtener último comentario de una cotización
    static getLatestComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { quoteId } = req.params;
                console.log('💬 QuoteCommentController: Obteniendo último comentario para cotización:', quoteId);
                if (!quoteId || isNaN(Number(quoteId))) {
                    return res.status(400).json({
                        success: false,
                        message: 'ID de cotización inválido'
                    });
                }
                const comment = yield quoteCommentService_1.default.getLatestComment(Number(quoteId));
                console.log('✅ QuoteCommentController: Último comentario obtenido:', comment ? comment.id : 'ninguno');
                res.status(200).json({
                    success: true,
                    comment
                });
            }
            catch (error) {
                console.error('❌ QuoteCommentController: Error obteniendo último comentario:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error interno del servidor',
                    error: error instanceof Error ? error.message : 'Error desconocido'
                });
            }
        });
    }
}
exports.QuoteCommentController = QuoteCommentController;
exports.default = QuoteCommentController;
