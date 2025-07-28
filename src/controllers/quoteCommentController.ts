// controllers/quoteCommentController.ts
// Controlador para manejar comentarios de cotizaciones

import { Request, Response } from 'express';
import QuoteCommentService, { CreateCommentData } from '../services/quoteCommentService';

export class QuoteCommentController {
  // Crear un nuevo comentario
  static async createComment(req: Request, res: Response) {
    try {
      console.log('💬 QuoteCommentController: Creando comentario');
      console.log('📦 Body recibido:', req.body);

      const { quoteId, userId, userType, comment, status }: CreateCommentData = req.body;

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
      const newComment = await QuoteCommentService.createComment({
        quoteId,
        userId,
        userType: userType as 'BUYER' | 'SUPPLIER',
        comment,
        status
      });

      console.log('✅ QuoteCommentController: Comentario creado exitosamente:', newComment.id);

      res.status(201).json({
        success: true,
        message: 'Comentario creado exitosamente',
        comment: newComment
      });

    } catch (error) {
      console.error('❌ QuoteCommentController: Error creando comentario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor al crear el comentario',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // Obtener comentarios de una cotización
  static async getQuoteComments(req: Request, res: Response) {
    try {
      const { quoteId } = req.params;
      console.log('💬 QuoteCommentController: Obteniendo comentarios para cotización:', quoteId);

      if (!quoteId || isNaN(Number(quoteId))) {
        return res.status(400).json({
          success: false,
          message: 'ID de cotización inválido'
        });
      }

      const comments = await QuoteCommentService.getQuoteComments(Number(quoteId));

      console.log('✅ QuoteCommentController: Comentarios obtenidos:', comments.length);

      res.status(200).json({
        success: true,
        comments,
        count: comments.length
      });

    } catch (error) {
      console.error('❌ QuoteCommentController: Error obteniendo comentarios:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // Obtener último comentario de una cotización
  static async getLatestComment(req: Request, res: Response) {
    try {
      const { quoteId } = req.params;
      console.log('💬 QuoteCommentController: Obteniendo último comentario para cotización:', quoteId);

      if (!quoteId || isNaN(Number(quoteId))) {
        return res.status(400).json({
          success: false,
          message: 'ID de cotización inválido'
        });
      }

      const comment = await QuoteCommentService.getLatestComment(Number(quoteId));

      console.log('✅ QuoteCommentController: Último comentario obtenido:', comment ? comment.id : 'ninguno');

      res.status(200).json({
        success: true,
        comment
      });

    } catch (error) {
      console.error('❌ QuoteCommentController: Error obteniendo último comentario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}

export default QuoteCommentController;
