// ================================================================
// CONTROLADOR DE COTIZACIONES - ZLCExpress (PostgreSQL)
// ================================================================
// Descripción: Controlador HTTP simplificado para gestionar cotizaciones con PostgreSQL
// Fecha: 2025-07-27

import { Request, Response } from 'express';
import QuoteService, { CreateQuoteData } from '../services/quoteService';

/**
 * Crear nueva cotización
 */
export const createQuote = async (req: Request, res: Response) => {
  try {
    console.log('📥 QuoteController: Recibida solicitud para crear cotización');
    console.log('📋 Datos recibidos:', req.body);
    console.log('🔍 PaymentTerms específicamente:', req.body.paymentTerms);
    console.log('🔍 PaymentConditions específicamente:', req.body.paymentConditions);
    console.log('📄 Purchase Order File:', req.body.purchaseOrderFile);
    console.log('📝 Notes:', req.body.notes);
    
    // ✅ USAR USUARIO AUTENTICADO
    const user = (req as any).user;
    if (!user || !user.id) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }
    
    const userId = user.id;
    console.log(`🔒 Usuario autenticado: ${userId} (${user.email})`);
    
    const paymentConditions = req.body.paymentTerms || req.body.paymentConditions;
    console.log('💰 Condiciones de pago finales:', paymentConditions);
    
    const quoteData: CreateQuoteData = {
      totalAmount: req.body.totalAmount || req.body.estimatedValue || 0,
      paymentConditions: paymentConditions,
      freightQuote: req.body.freightQuote,
      freightDetails: req.body.freightDetails,
      notes: req.body.logisticsComments || req.body.specialRequirements || req.body.notes,
      purchaseOrderFile: req.body.purchaseOrderFile,
      items: req.body.items || []
    };

    const quote = await QuoteService.createQuote(userId, quoteData);
    
    console.log('✅ QuoteController: Cotización creada exitosamente');
    res.status(201).json({
      success: true,
      data: quote,
      message: 'Cotización creada exitosamente'
    });

  } catch (error: any) {
    console.error('❌ QuoteController: Error creando cotización:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error al crear cotización'
    });
  }
};

/**
 * Obtener cotizaciones del usuario
 */
export const getUserQuotes = async (req: Request, res: Response) => {
  try {
    console.log('📥 QuoteController: Obteniendo cotizaciones del usuario');
    
    // ✅ USAR USUARIO AUTENTICADO
    const user = (req as any).user;
    if (!user || !user.id) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }
    
    const userId = user.id;
    console.log(`🔒 Obteniendo cotizaciones para usuario: ${userId} (${user.email})`);
    
    const quotes = await QuoteService.getUserQuotes(userId);
    
    console.log(`✅ QuoteController: ${quotes.length} cotizaciones encontradas para usuario ${userId}`);
    res.json({
      success: true,
      data: quotes,
      total: quotes.length,
      message: 'Cotizaciones obtenidas exitosamente'
    });

  } catch (error: any) {
    console.error('❌ QuoteController: Error obteniendo cotizaciones:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener cotizaciones'
    });
  }
};

/**
 * Obtener estadísticas de cotizaciones
 */
export const getQuoteStats = async (req: Request, res: Response) => {
  try {
    console.log('📥 QuoteController: Obteniendo estadísticas');
    
    // ✅ USAR USUARIO AUTENTICADO
    const user = (req as any).user;
    if (!user || !user.id) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }
    
    const userId = user.id;
    console.log(`🔒 Obteniendo estadísticas para usuario: ${userId} (${user.email})`);
    
    const stats = await QuoteService.getQuoteStats(userId);
    
    console.log('✅ QuoteController: Estadísticas obtenidas');
    res.json({
      success: true,
      data: stats,
      message: 'Estadísticas obtenidas exitosamente'
    });

  } catch (error: any) {
    console.error('❌ QuoteController: Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener estadísticas'
    });
  }
};

/**
 * Obtener cotización por ID
 */
export const getQuoteById = async (req: Request, res: Response) => {
  try {
    console.log('📥 QuoteController: Obteniendo cotización por ID');
    
    const quoteId = parseInt(req.params.id);
    
    // ✅ USAR USUARIO AUTENTICADO
    const user = (req as any).user;
    if (!user || !user.id) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }
    
    const userId = user.id;
    console.log(`🔒 Obteniendo cotización ${quoteId} para usuario: ${userId} (${user.email})`);
    
    // Obtener todas las cotizaciones del usuario y buscar la específica
    const quotes = await QuoteService.getUserQuotes(userId);
    const foundQuote = quotes.find((q: any) => q.id === quoteId);
    
    if (!foundQuote) {
      console.log(`❌ Cotización ${quoteId} no encontrada para usuario ${userId}`);
      return res.status(404).json({
        success: false,
        message: 'Cotización no encontrada o no tiene permisos para verla'
      });
    }
    
    console.log('✅ QuoteController: Cotización encontrada');
    res.json({
      success: true,
      data: foundQuote,
      message: 'Cotización obtenida exitosamente'
    });

  } catch (error: any) {
    console.error('❌ QuoteController: Error obteniendo cotización:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener cotización'
    });
  }
};

/**
 * Actualizar estado de cotización
 */
export const updateQuoteStatus = async (req: Request, res: Response) => {
  try {
    console.log('🔄 QuoteController: Actualizando estado de cotización');
    
    const { id: quoteId } = req.params;
    const { status, comment, counterOfferData } = req.body;
    const userId = parseInt(req.headers['user-id'] as string) || 1;
    const userType = req.headers['user-type'] as 'BUYER' | 'SUPPLIER' || 'BUYER';

    if (!quoteId || !status) {
      return res.status(400).json({
        success: false,
        message: 'ID de cotización y estado son requeridos'
      });
    }

    const updatedQuote = await QuoteService.updateQuoteStatus(
      parseInt(quoteId),
      status,
      userId,
      userType,
      comment,
      counterOfferData
    );

    console.log('✅ QuoteController: Estado actualizado exitosamente');
    res.json({
      success: true,
      data: updatedQuote,
      message: 'Estado de cotización actualizado exitosamente'
    });

  } catch (error: any) {
    console.error('❌ QuoteController: Error actualizando estado:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al actualizar estado de cotización'
    });
  }
};

/**
 * Enviar contraoferta
 */
export const sendCounterOffer = async (req: Request, res: Response) => {
  try {
    console.log('🔄 QuoteController: Enviando contraoferta');
    
    const { id: quoteId } = req.params;
    const { newPrice, comment, paymentTerms, deliveryTerms } = req.body;
    const userId = parseInt(req.headers['user-id'] as string) || 1;
    const userType = req.headers['user-type'] as 'BUYER' | 'SUPPLIER' || 'SUPPLIER';

    if (!quoteId || !comment) {
      return res.status(400).json({
        success: false,
        message: 'ID de cotización y comentario son requeridos'
      });
    }

    const updatedQuote = await QuoteService.sendCounterOffer(
      parseInt(quoteId),
      userId,
      userType,
      {
        newPrice,
        comment,
        paymentTerms,
        deliveryTerms
      }
    );

    console.log('✅ QuoteController: Contraoferta enviada exitosamente');
    res.json({
      success: true,
      data: updatedQuote,
      message: 'Contraoferta enviada exitosamente'
    });

  } catch (error: any) {
    console.error('❌ QuoteController: Error enviando contraoferta:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al enviar contraoferta'
    });
  }
};

/**
 * Obtener comentarios de cotización
 */
export const getQuoteComments = async (req: Request, res: Response) => {
  try {
    console.log('💬 QuoteController: Obteniendo comentarios de cotización');
    console.log('🔍 req.params completos:', req.params);
    console.log('🔍 req.url:', req.url);
    console.log('🔍 req.method:', req.method);
    
    const { id } = req.params;
    console.log('🔍 ID extraído de params:', id);

    if (!id) {
      console.error('❌ ID no encontrado en parámetros');
      return res.status(400).json({
        success: false,
        message: 'ID de cotización es requerido'
      });
    }

    const quoteId = parseInt(id);
    console.log('🔍 ID convertido a número:', quoteId);

    if (isNaN(quoteId)) {
      console.error('❌ ID no es un número válido:', id);
      return res.status(400).json({
        success: false,
        message: 'ID de cotización debe ser un número válido'
      });
    }

    console.log('📋 Buscando comentarios para cotización ID:', quoteId);
    const comments = await QuoteService.getQuoteComments(quoteId);

    console.log('✅ QuoteController: Comentarios obtenidos exitosamente, count:', comments.length);
    res.json({
      success: true,
      comments,
      count: comments.length,
      message: 'Comentarios obtenidos exitosamente'
    });

  } catch (error: any) {
    console.error('❌ QuoteController: Error obteniendo comentarios:', error);
    console.error('❌ Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener comentarios'
    });
  }
};

/**
 * Aceptar cotización (comprador o proveedor)
 */
export const acceptQuote = async (req: Request, res: Response) => {
  try {
    console.log('✅ QuoteController: Aceptando cotización');
    
    const { id: quoteId } = req.params;
    const { comment } = req.body;
    const userId = parseInt(req.headers['user-id'] as string) || 1;
    const userType = req.headers['user-type'] as 'BUYER' | 'SUPPLIER' || 'BUYER';

    const updatedQuote = await QuoteService.acceptQuote(
      parseInt(quoteId),
      userId,
      userType,
      comment
    );

    res.json({
      success: true,
      data: updatedQuote,
      message: 'Cotización aceptada exitosamente'
    });

  } catch (error: any) {
    console.error('❌ QuoteController: Error aceptando cotización:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al aceptar cotización'
    });
  }
};

/**
 * Rechazar cotización (comprador o proveedor)
 */
export const rejectQuote = async (req: Request, res: Response) => {
  try {
    console.log('❌ QuoteController: Rechazando cotización');
    
    const { id: quoteId } = req.params;
    const { comment } = req.body;
    const userId = parseInt(req.headers['user-id'] as string) || 1;
    const userType = req.headers['user-type'] as 'BUYER' | 'SUPPLIER' || 'BUYER';

    const updatedQuote = await QuoteService.rejectQuote(
      parseInt(quoteId),
      userId,
      userType,
      comment
    );

    res.json({
      success: true,
      data: updatedQuote,
      message: 'Cotización rechazada exitosamente'
    });

  } catch (error: any) {
    console.error('❌ QuoteController: Error rechazando cotización:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al rechazar cotización'
    });
  }
};

/**
 * Enviar contraoferta desde el comprador
 */
export const sendBuyerCounterOffer = async (req: Request, res: Response) => {
  try {
    console.log('� QuoteController: Enviando contraoferta del comprador');
    
    const { id: quoteId } = req.params;
    const { newPrice, comment, paymentTerms, deliveryTerms } = req.body;
    const userId = parseInt(req.headers['user-id'] as string) || 1;

    console.log('📝 Datos de contraoferta del comprador:', {
      quoteId,
      newPrice,
      comment,
      paymentTerms,
      deliveryTerms,
      userId
    });

    if (!comment?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'El comentario es requerido para enviar una contraoferta'
      });
    }

    const updatedQuote = await QuoteService.sendBuyerCounterOffer(
      parseInt(quoteId),
      userId,
      {
        newPrice: newPrice ? Number(newPrice) : undefined,
        comment: comment.trim(),
        paymentTerms,
        deliveryTerms
      }
    );

    console.log('✅ QuoteController: Contraoferta del comprador enviada exitosamente');
    res.json({
      success: true,
      data: updatedQuote,
      message: 'Contraoferta enviada exitosamente'
    });

  } catch (error: any) {
    console.error('❌ QuoteController: Error enviando contraoferta:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al enviar contraoferta'
    });
  }
};

/**
 * Crear orden de pago desde una cotización aceptada
 */
export const createPaymentOrderFromQuote = async (req: Request, res: Response) => {
  try {
    console.log('💳 QuoteController: Creando orden de pago desde cotización');
    
    const { id: quoteId } = req.params;
    const { buyerId, paymentMethod } = req.body;
    const userId = parseInt(req.headers['user-id'] as string) || buyerId || 1;

    // Obtener la cotización para validar su estado
    const quote = await QuoteService.getQuoteById(parseInt(quoteId));
    
    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Cotización no encontrada'
      });
    }

    if (quote.status !== 'ACCEPTED') {
      return res.status(400).json({
        success: false,
        message: 'Solo se pueden crear órdenes de pago para cotizaciones aceptadas'
      });
    }

    // Importar dinámicamente el servicio de órdenes de pago
    const { PaymentOrderService } = await import('../services/paymentOrderService');

    // Crear la orden de pago
    const paymentOrder = await PaymentOrderService.createPaymentOrder({
      quoteId: parseInt(quoteId),
      buyerId: userId,
      totalAmount: quote.totalPrice,
      currency: 'USD', // Por defecto USD, puede ser dinámico
      paymentMethod: paymentMethod || 'paypal'
    });

    console.log('✅ QuoteController: Orden de pago creada:', paymentOrder.orderNumber);

    res.status(201).json({
      success: true,
      data: paymentOrder,
      message: 'Orden de pago creada exitosamente'
    });

  } catch (error: any) {
    console.error('❌ QuoteController: Error creando orden de pago:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al crear orden de pago'
    });
  }
};

export default {
  createQuote,
  getUserQuotes,
  getQuoteStats,
  getQuoteById,
  updateQuoteStatus,
  sendCounterOffer,
  getQuoteComments,
  acceptQuote,
  rejectQuote,
  sendBuyerCounterOffer,
  createPaymentOrderFromQuote
};
