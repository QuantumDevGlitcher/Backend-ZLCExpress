// ================================================================
// CONTROLADOR RFQ SIMPLIFICADO - ZLCExpress
// ================================================================
// Descripción: Controlador RFQ que redirige al nuevo sistema PostgreSQL
// Fecha: 2025-07-27

import { Request, Response } from 'express';

export class RFQController {
  
  /**
   * Debug endpoint para ver qué datos llegan
   */
  static async debugRFQ(req: Request, res: Response): Promise<void> {
    console.log('🐛 DEBUG RFQ - Method:', req.method);
    console.log('🐛 DEBUG RFQ - Headers:', JSON.stringify(req.headers, null, 2));
    console.log('🐛 DEBUG RFQ - Body:', JSON.stringify(req.body, null, 2));
    
    res.json({
      success: true,
      message: 'Debug info logged - Redirigir a PostgreSQL',
      received: {
        method: req.method,
        headers: req.headers,
        body: req.body
      }
    });
  }

  /**
   * Crear nueva solicitud de cotización (redirige a PostgreSQL)
   */
  static async createRFQ(req: Request, res: Response): Promise<void> {
    try {
      console.log('🔄 RFQController: Redirigiendo a sistema PostgreSQL');
      
      res.status(200).json({
        success: true,
        message: 'RFQ debe ser creado usando /api/rfq/cart/quote para PostgreSQL',
        redirect: '/api/rfq/cart/quote'
      });

    } catch (error) {
      console.error('🚨 Error en createRFQ:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Obtener RFQ por ID (placeholder)
   */
  static async getRFQById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      res.json({
        success: true,
        message: 'Usar /api/rfq/quotes para obtener cotizaciones desde PostgreSQL',
        id: id
      });

    } catch (error) {
      console.error('Error en getRFQById:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Métodos placeholder para mantener compatibilidad
  static async getRFQsWithFreight(req: Request, res: Response): Promise<void> {
    res.json({ success: true, message: 'Usar endpoints PostgreSQL', data: [] });
  }

  static async getAllRFQs(req: Request, res: Response): Promise<void> {
    res.json({ success: true, message: 'Usar endpoints PostgreSQL', data: [] });
  }

  static async updateRFQ(req: Request, res: Response): Promise<void> {
    res.json({ success: true, message: 'Usar endpoints PostgreSQL' });
  }

  static async respondToRFQ(req: Request, res: Response): Promise<void> {
    res.json({ success: true, message: 'Usar endpoints PostgreSQL' });
  }

  static async deleteRFQ(req: Request, res: Response): Promise<void> {
    res.json({ success: true, message: 'Usar endpoints PostgreSQL' });
  }

  static async getRFQStats(req: Request, res: Response): Promise<void> {
    res.json({ success: true, message: 'Usar endpoints PostgreSQL', data: {} });
  }

  static async getNotifications(req: Request, res: Response): Promise<void> {
    res.json({ success: true, message: 'Usar endpoints PostgreSQL', data: [] });
  }

  static async markNotificationAsRead(req: Request, res: Response): Promise<void> {
    res.json({ success: true, message: 'Usar endpoints PostgreSQL' });
  }

  static async checkExpiredRFQs(req: Request, res: Response): Promise<void> {
    res.json({ success: true, message: 'Usar endpoints PostgreSQL', data: { expired: 0 } });
  }
}
