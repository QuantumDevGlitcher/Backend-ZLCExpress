// services/quoteCommentService.ts
// Servicio para manejar comentarios de cotizaciones

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateCommentData {
  quoteId: number;
  userId: number;
  userType: 'BUYER' | 'SUPPLIER';
  comment: string;
  status: string;
}

export interface QuoteCommentWithUser {
  id: number;
  quoteId: number;
  userId: number;
  userType: string;
  comment: string;
  status: string;
  createdAt: Date;
  user: {
    id: number;
    companyName: string;
    contactName: string;
  };
}

export class QuoteCommentService {
  // Crear un nuevo comentario
  static async createComment(data: CreateCommentData): Promise<QuoteCommentWithUser> {
    try {
      console.log('💬 QuoteCommentService: Creando comentario para cotización', data.quoteId);

      const comment = await (prisma as any).quoteComment.create({
        data: {
          quoteId: data.quoteId,
          userId: data.userId,
          userType: data.userType,
          comment: data.comment,
          status: data.status as any
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
      return comment as QuoteCommentWithUser;

    } catch (error) {
      console.error('❌ QuoteCommentService: Error creando comentario:', error);
      throw error;
    }
  }

  // Obtener comentarios de una cotización
  static async getQuoteComments(quoteId: number): Promise<QuoteCommentWithUser[]> {
    try {
      console.log('💬 QuoteCommentService: Obteniendo comentarios para cotización', quoteId);

      const comments = await (prisma as any).quoteComment.findMany({
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
      return comments as QuoteCommentWithUser[];

    } catch (error) {
      console.error('❌ QuoteCommentService: Error obteniendo comentarios:', error);
      throw error;
    }
  }

  // Obtener último comentario de una cotización
  static async getLatestComment(quoteId: number): Promise<QuoteCommentWithUser | null> {
    try {
      console.log('💬 QuoteCommentService: Obteniendo último comentario para cotización', quoteId);

      const comment = await (prisma as any).quoteComment.findFirst({
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
      return comment as QuoteCommentWithUser | null;

    } catch (error) {
      console.error('❌ QuoteCommentService: Error obteniendo último comentario:', error);
      throw error;
    }
  }
}

export default QuoteCommentService;
