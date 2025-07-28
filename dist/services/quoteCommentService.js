"use strict";
// services/quoteCommentService.ts
// Servicio para manejar comentarios de cotizaciones
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
exports.QuoteCommentService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class QuoteCommentService {
    // Crear un nuevo comentario
    static createComment(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('💬 QuoteCommentService: Creando comentario para cotización', data.quoteId);
                const comment = yield prisma.quoteComment.create({
                    data: {
                        quoteId: data.quoteId,
                        userId: data.userId,
                        userType: data.userType,
                        comment: data.comment,
                        status: data.status
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                companyName: true,
                                contactName: true
                            }
                        }
                    }
                });
                console.log('✅ QuoteCommentService: Comentario creado exitosamente:', comment.id);
                return comment;
            }
            catch (error) {
                console.error('❌ QuoteCommentService: Error creando comentario:', error);
                throw error;
            }
        });
    }
    // Obtener comentarios de una cotización
    static getQuoteComments(quoteId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('💬 QuoteCommentService: Obteniendo comentarios para cotización', quoteId);
                const comments = yield prisma.quoteComment.findMany({
                    where: { quoteId: quoteId },
                    include: {
                        user: {
                            select: {
                                id: true,
                                companyName: true,
                                contactName: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'asc' }
                });
                console.log('✅ QuoteCommentService: Comentarios obtenidos:', comments.length);
                return comments;
            }
            catch (error) {
                console.error('❌ QuoteCommentService: Error obteniendo comentarios:', error);
                throw error;
            }
        });
    }
    // Obtener último comentario de una cotización
    static getLatestComment(quoteId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('💬 QuoteCommentService: Obteniendo último comentario para cotización', quoteId);
                const comment = yield prisma.quoteComment.findFirst({
                    where: { quoteId: quoteId },
                    include: {
                        user: {
                            select: {
                                id: true,
                                companyName: true,
                                contactName: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                });
                console.log('✅ QuoteCommentService: Último comentario obtenido:', comment ? comment.id : 'ninguno');
                return comment;
            }
            catch (error) {
                console.error('❌ QuoteCommentService: Error obteniendo último comentario:', error);
                throw error;
            }
        });
    }
}
exports.QuoteCommentService = QuoteCommentService;
exports.default = QuoteCommentService;
