// ================================================================
// CONTROLADOR MY QUOTES - ZLCExpress  
// ================================================================
// Descripción: Controlador para integrar cotizaciones con frontend My Quotes
// Fecha: 2025-07-27

import { Request, Response } from 'express';
import MyQuotesService from '../services/myQuotesService';

/**
 * Obtener todas las cotizaciones para My Quotes
 * GET /api/my-quotes
 */
export const getMyQuotes = async (req: Request, res: Response) => {
  try {
    console.log('📥 MyQuotesController: Obteniendo cotizaciones para My Quotes');
    
    const userId = parseInt(req.headers['user-id'] as string) || 1; // Mock user ID
    
    const quotes = await MyQuotesService.getMyQuotes(userId);
    
    console.log(`✅ MyQuotesController: ${quotes.length} cotizaciones obtenidas`);
    res.json({
      success: true,
      data: quotes,
      message: 'Cotizaciones obtenidas exitosamente'
    });

  } catch (error: any) {
    console.error('❌ MyQuotesController: Error obteniendo cotizaciones:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener cotizaciones'
    });
  }
};

/**
 * Obtener estadísticas para My Quotes
 * GET /api/my-quotes/stats
 */
export const getMyQuotesStats = async (req: Request, res: Response) => {
  try {
    console.log('📥 MyQuotesController: Obteniendo estadísticas para My Quotes');
    
    const userId = parseInt(req.headers['user-id'] as string) || 1;
    
    const stats = await MyQuotesService.getMyQuotesStats(userId);
    
    console.log('✅ MyQuotesController: Estadísticas obtenidas');
    res.json({
      success: true,
      data: stats,
      message: 'Estadísticas obtenidas exitosamente'
    });

  } catch (error: any) {
    console.error('❌ MyQuotesController: Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener estadísticas'
    });
  }
};

/**
 * Aceptar una cotización desde My Quotes
 * POST /api/my-quotes/:id/accept
 */
export const acceptMyQuote = async (req: Request, res: Response) => {
  try {
    console.log('📥 MyQuotesController: Aceptando cotización desde My Quotes');
    
    const quoteId = req.params.id;
    const userId = parseInt(req.headers['user-id'] as string) || 1;
    
    // TODO: Implementar aceptación de cotización
    res.status(501).json({
      success: false,
      message: 'Funcionalidad no implementada aún'
    });

  } catch (error: any) {
    console.error('❌ MyQuotesController: Error aceptando cotización:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error al aceptar cotización'
    });
  }
};

/**
 * Crear nueva cotización desde frontend
 * POST /api/my-quotes
 */
export const createMyQuote = async (req: Request, res: Response) => {
  try {
    console.log('📥 MyQuotesController: Creando cotización desde frontend');
    console.log('📋 Datos recibidos:', req.body);
    
    const userId = parseInt(req.headers['user-id'] as string) || 1;
    
    const quote = await MyQuotesService.createQuoteFromFrontend(userId, req.body);
    
    console.log('✅ MyQuotesController: Cotización creada exitosamente');
    res.status(201).json({
      success: true,
      data: quote,
      message: 'Cotización creada exitosamente'
    });

  } catch (error: any) {
    console.error('❌ MyQuotesController: Error creando cotización:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error al crear cotización'
    });
  }
};

/**
 * Sincronizar RFQs con base de datos
 * POST /api/my-quotes/sync
 */
export const syncRFQsToMyQuotes = async (req: Request, res: Response) => {
  try {
    console.log('📥 MyQuotesController: Sincronizando RFQs con base de datos');
    
    const userId = parseInt(req.headers['user-id'] as string) || 1;
    
    // TODO: Implementar sincronización
    res.status(501).json({
      success: false,
      message: 'Funcionalidad de sincronización no implementada aún'
    });

  } catch (error: any) {
    console.error('❌ MyQuotesController: Error sincronizando RFQs:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error sincronizando RFQs'
    });
  }
};

/**
 * Migrar RFQs específicos a My Quotes
 * POST /api/my-quotes/migrate
 */
export const migrateRFQsToMyQuotes = async (req: Request, res: Response) => {
  try {
    console.log('📥 MyQuotesController: Migrando RFQs específicos a My Quotes');
    
    const userId = parseInt(req.headers['user-id'] as string) || 1;
    const rfqs = req.body.rfqs || [];
    
    // TODO: Implementar migración de RFQs
    res.status(501).json({
      success: false,
      message: 'Funcionalidad de migración no implementada aún'
    });

  } catch (error: any) {
    console.error('❌ MyQuotesController: Error migrando RFQs:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error migrando RFQs'
    });
  }
};

/**
 * Endpoint de prueba para verificar conexión
 * GET /api/my-quotes/test
 */
export const testMyQuotes = async (req: Request, res: Response) => {
  try {
    console.log('📥 MyQuotesController: Endpoint de prueba');
    
    res.json({
      success: true,
      message: 'My Quotes service funcionando correctamente',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });

  } catch (error: any) {
    console.error('❌ MyQuotesController: Error en test:', error);
    res.status(500).json({
      success: false,
      message: 'Error en test de My Quotes'
    });
  }
};

export default {
  getMyQuotes,
  getMyQuotesStats,
  acceptMyQuote,
  createMyQuote,
  syncRFQsToMyQuotes,
  migrateRFQsToMyQuotes,
  testMyQuotes
};
