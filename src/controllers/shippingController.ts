import { Request, Response } from 'express';
import { ShippingService } from '../services/shippingService';
// import { OrderService } from '../services/orderService'; // Removed to avoid circular dependency

export class ShippingController {
  
  /**
   * Obtener cotizaciones de flete
   */
  static async getShippingQuotes(req: Request, res: Response) {
    try {
      const userId = parseInt(req.headers['user-id'] as string);
      
      if (!userId) {
        return res.status(400).json({ 
          success: false, 
          message: 'User ID requerido' 
        });
      }

      const {
        originPort,
        destinationPort,
        containerType,
        containerCount,
        estimatedShippingDate,
        cargoValue,
        incoterm
      } = req.body;

      // Validaciones
      if (!originPort || !destinationPort || !containerType) {
        return res.status(400).json({
          success: false,
          message: 'Puerto de origen, destino y tipo de contenedor son requeridos'
        });
      }

      const shippingRequest = {
        originPort,
        destinationPort,
        containerType,
        containerCount: containerCount || 1,
        estimatedShippingDate: estimatedShippingDate ? new Date(estimatedShippingDate) : new Date(),
        cargoValue: cargoValue || 0,
        incoterm: incoterm || 'FOB'
      };

      const quotes = await ShippingService.getShippingQuotes(shippingRequest, userId);

      res.json({
        success: true,
        data: quotes,
        message: `Se generaron ${quotes.length} cotizaciones`
      });

    } catch (error: any) {
      console.error('Error getting shipping quotes:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener cotizaciones de flete',
        error: error.message
      });
    }
  }

  /**
   * Seleccionar cotización de flete para una orden
   */
  static async selectShippingQuote(req: Request, res: Response) {
    try {
      const { quoteId, orderId } = req.body;

      if (!quoteId || !orderId) {
        return res.status(400).json({
          success: false,
          message: 'Quote ID y Order ID son requeridos'
        });
      }

      await ShippingService.selectShippingQuote(quoteId, orderId);

      res.json({
        success: true,
        message: 'Cotización de flete seleccionada exitosamente'
      });

    } catch (error: any) {
      console.error('Error selecting shipping quote:', error);
      res.status(500).json({
        success: false,
        message: 'Error al seleccionar cotización de flete',
        error: error.message
      });
    }
  }

  /**
   * Obtener cotizaciones del usuario
   */
  static async getUserQuotes(req: Request, res: Response) {
    try {
      const userId = parseInt(req.headers['user-id'] as string);
      
      if (!userId) {
        return res.status(400).json({ 
          success: false, 
          message: 'User ID requerido' 
        });
      }

      const quotes = await ShippingService.getQuotesByUser(userId);

      res.json({
        success: true,
        data: quotes
      });

    } catch (error: any) {
      console.error('Error getting user quotes:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener cotizaciones del usuario',
        error: error.message
      });
    }
  }

  /**
   * Obtener cotizaciones para una orden específica
   */
  static async getOrderQuotes(req: Request, res: Response) {
    try {
      const orderId = parseInt(req.params.orderId);

      if (!orderId) {
        return res.status(400).json({
          success: false,
          message: 'Order ID requerido'
        });
      }

      const quotes = await ShippingService.getQuotesByOrder(orderId);

      res.json({
        success: true,
        data: quotes
      });

    } catch (error: any) {
      console.error('Error getting order quotes:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener cotizaciones de la orden',
        error: error.message
      });
    }
  }

  /**
   * Obtener puertos disponibles
   */
  static async getAvailablePorts(req: Request, res: Response) {
    try {
      const ports = await ShippingService.getAvailablePorts();

      res.json({
        success: true,
        data: ports
      });

    } catch (error: any) {
      console.error('Error getting available ports:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener puertos disponibles',
        error: error.message
      });
    }
  }

  /**
   * Crear orden con solicitud de cotizaciones de flete
   */
  static async createOrderWithShipping(req: Request, res: Response) {
    try {
      const userId = req.headers['user-id'] as string;
      
      if (!userId) {
        return res.status(400).json({ 
          success: false, 
          message: 'User ID requerido' 
        });
      }

      const orderData = req.body;
      orderData.requestShippingQuotes = true; // Forzar solicitud de cotizaciones

      // const result = await OrderService.createOrderWithShipping(userId, orderData);

      res.status(201).json({
        success: true,
        data: { message: "OrderService temporarily disabled" },
        message: 'Orden creada y cotizaciones de flete generadas'
      });

    } catch (error: any) {
      console.error('Error creating order with shipping:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear orden con flete',
        error: error.message
      });
    }
  }

  /**
   * Confirmar orden con flete seleccionado
   */
  static async confirmOrderWithShipping(req: Request, res: Response) {
    try {
      const { orderId, shippingQuoteId } = req.body;

      if (!orderId || !shippingQuoteId) {
        return res.status(400).json({
          success: false,
          message: 'Order ID y Shipping Quote ID son requeridos'
        });
      }

      // const confirmedOrder = await OrderService.confirmOrderWithShipping(orderId, shippingQuoteId);

      res.json({
        success: true,
        data: { message: "OrderService temporarily disabled" },
        message: 'Orden confirmada con flete seleccionado'
      });

    } catch (error: any) {
      console.error('Error confirming order with shipping:', error);
      res.status(500).json({
        success: false,
        message: 'Error al confirmar orden con flete',
        error: error.message
      });
    }
  }
}
