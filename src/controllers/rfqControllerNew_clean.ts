import { Request, Response } from 'express';
import { QuoteService, CreateQuoteData } from '../services/quoteService';
import { CartService } from '../services/cartService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface RFQCreateRequest {
  productId: string | number;
  productName: string;
  requesterName: string;
  requesterEmail: string;
  companyName: string;
  containerQuantity: number;
  containerType: '20GP' | '40GP' | '40HQ' | '45HQ';
  incoterm: 'EXW' | 'FOB' | 'CIF' | 'DDP';
  tentativeDeliveryDate: string;
  logisticsComments: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedValue: number;
  currency: string;
  items?: any[];
}

interface FreightQuote {
  origin?: string;
  destination?: string;
  carrier?: string;
  transitTime?: number;
}

export class RFQControllerNew {
  
  // ===============================
  // MÉTODO PRINCIPAL: ENVÍO DE COTIZACIÓN DESDE CARRITO
  // ===============================
  
  static async sendCartQuote(req: Request, res: Response): Promise<void> {
    try {
      console.log('🛒 [sendCartQuote] Iniciando proceso...');
      console.log('📦 [sendCartQuote] Headers:', JSON.stringify(req.headers, null, 2));
      console.log('📦 [sendCartQuote] Body data:', JSON.stringify(req.body, null, 2));
      
      const {
        items,                    // ✅ Items del carrito del frontend
        totalAmount,
        paymentConditions,
        freightEstimate,
        freightQuote,
        platformCommission,
        notes
      } = req.body;

      // Obtener userId del header
      const userIdHeader = req.headers['user-id'];
      const userId = userIdHeader ? parseInt(userIdHeader as string) : 1;
      
      console.log('👤 [sendCartQuote] Using userId:', userId);
      console.log('📦 [sendCartQuote] Items recibidos del frontend:', items?.length || 0);
      
      // Verificar que tengamos items (del frontend o del carrito)
      let cartItems = items;
      
      if (!cartItems || cartItems.length === 0) {
        // Fallback: obtener del carrito en base de datos
        console.log('🔍 [sendCartQuote] No hay items en request, obteniendo del carrito...');
        
        if (!CartService) {
          throw new Error('CartService no está disponible');
        }
        
        const cart = await CartService.getCart(userId);
        cartItems = cart.items;
        
        if (!cartItems || cartItems.length === 0) {
          console.log('⚠️ [sendCartQuote] Carrito vacío');
          res.status(400).json({
            success: false,
            message: 'El carrito está vacío y no se enviaron items'
          });
          return;
        }
      }

      console.log(`🛒 [sendCartQuote] Procesando ${cartItems.length} items`);
      console.log('📦 [sendCartQuote] Items details:', JSON.stringify(cartItems, null, 2));

      // Crear la cotización con TODOS los datos del carrito
      const quoteData: CreateQuoteData = {
        totalAmount: totalAmount,
        currency: 'USD',
        status: 'pending',
        paymentConditions: paymentConditions || 'Net 30 days',
        notes: notes || `Cotización de ${cartItems.length} productos del carrito`,
        items: cartItems,              // ✅ Pasar todos los items al QuoteService
        freightDetails: freightQuote ? {
          origin: freightQuote.origin || 'Puerto de origen',
          destination: freightQuote.destination || 'Puerto de destino',
          carrier: freightQuote.carrier || 'Transportista estándar',
          cost: freightEstimate || 0,
          currency: 'USD',
          transitTime: freightQuote.transitTime || 30,
          estimatedDate: new Date(Date.now() + (freightQuote.transitTime || 30) * 24 * 60 * 60 * 1000).toISOString()
        } : undefined
      };

      console.log('💾 [sendCartQuote] Creando cotización con datos completos:', JSON.stringify(quoteData, null, 2));
      
      // Verificar QuoteService
      if (!QuoteService) {
        throw new Error('QuoteService no está disponible');
      }
      
      const quote = await QuoteService.createQuote(userId, quoteData);
      console.log('✅ [sendCartQuote] Cotización creada con items:', quote.id);

      // Limpiar el carrito después de enviar la cotización
      console.log('🧹 [sendCartQuote] Limpiando carrito...');
      if (CartService) {
        await CartService.clearCart(userId);
        console.log('✅ [sendCartQuote] Carrito limpiado');
      }

      console.log('🎉 [sendCartQuote] Proceso completado exitosamente');

      res.status(201).json({
        success: true,
        message: 'Cotización enviada exitosamente con todos los items',
        data: {
          quote: {
            id: quote.id,
            quoteNumber: quote.quoteNumber || `Q-${quote.id}`,
            status: quote.status || 'pending',
            itemsCount: cartItems.length
          },
          cartItemsProcessed: cartItems.length
        }
      });

    } catch (error) {
      console.error('❌ [sendCartQuote] Error completo:', error);
      console.error('❌ [sendCartQuote] Stack trace:', (error as any).stack);
      
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: (error as any).message,
        details: process.env.NODE_ENV === 'development' ? (error as any).stack : undefined
      });
    }
  }

  // ===============================
  // OBTENER COTIZACIONES DEL USUARIO
  // ===============================
  
  static async getMyQuotes(req: Request, res: Response): Promise<void> {
    try {
      console.log('📋 [getMyQuotes] Obteniendo cotizaciones...');
      
      const userIdHeader = req.headers['user-id'];
      const userId = userIdHeader ? parseInt(userIdHeader as string) : 1;
      
      console.log('👤 [getMyQuotes] Using userId:', userId);
      
      const quotes = await QuoteService.getUserQuotes(userId);
      
      console.log(`📋 [getMyQuotes] Encontradas ${quotes.length} cotizaciones`);
      
      res.status(200).json({
        success: true,
        data: quotes
      });
      
    } catch (error) {
      console.error('❌ [getMyQuotes] Error:', error);
      res.status(500).json({
        success: false,
        message: 'Error obteniendo cotizaciones',
        error: (error as any).message
      });
    }
  }

  // ===============================
  // OBTENER ESTADÍSTICAS DE COTIZACIONES
  // ===============================
  
  static async getQuoteStats(req: Request, res: Response): Promise<void> {
    try {
      console.log('📊 [getQuoteStats] Obteniendo estadísticas...');
      
      const userIdHeader = req.headers['user-id'];
      const userId = userIdHeader ? parseInt(userIdHeader as string) : 1;
      
      console.log('👤 [getQuoteStats] Using userId:', userId);
      
      const stats = await QuoteService.getUserQuoteStats(userId);
      
      console.log('📊 [getQuoteStats] Estadísticas:', stats);
      
      res.status(200).json({
        success: true,
        data: stats
      });
      
    } catch (error) {
      console.error('❌ [getQuoteStats] Error:', error);
      res.status(500).json({
        success: false,
        message: 'Error obteniendo estadísticas',
        error: (error as any).message
      });
    }
  }

  // ===============================
  // MÉTODOS LEGACY (COMPATIBILIDAD)
  // ===============================
  
  static async createRFQ(req: Request, res: Response): Promise<void> {
    try {
      console.log('📝 [createRFQ] Datos recibidos:', JSON.stringify(req.body, null, 2));
      
      const {
        productId,
        productName,
        requesterName,
        requesterEmail,
        companyName,
        containerQuantity,
        containerType,
        incoterm,
        tentativeDeliveryDate,
        logisticsComments,
        priority,
        estimatedValue,
        currency
      } = req.body as RFQCreateRequest;

      // Validaciones básicas
      if (!productId || !productName || !requesterEmail) {
        res.status(400).json({
          success: false,
          message: 'Faltan campos requeridos: productId, productName, requesterEmail'
        });
        return;
      }

      // Crear cotización usando el QuoteService
      const quoteData: CreateQuoteData = {
        totalAmount: estimatedValue || 0,
        currency: currency || 'USD',
        status: 'pending',
        paymentConditions: 'Net 30 days',
        notes: logisticsComments || `RFQ para ${productName}`,
        items: [{
          productId: productId.toString(),
          productTitle: productName,
          quantity: containerQuantity || 1,
          pricePerContainer: estimatedValue || 0,
          currency: currency || 'USD',
          supplier: 'Proveedor estándar',
          containerType: containerType || '40GP',
          incoterm: incoterm || 'FOB'
        }]
      };

      const userId = 1; // Usuario por defecto para RFQs legacy
      const quote = await QuoteService.createQuote(userId, quoteData);

      console.log('✅ [createRFQ] RFQ creada exitosamente:', quote.id);

      res.status(201).json({
        success: true,
        message: 'RFQ creada exitosamente',
        data: {
          rfqId: quote.id,
          quoteNumber: quote.quoteNumber,
          status: quote.status
        }
      });

    } catch (error) {
      console.error('❌ [createRFQ] Error:', error);
      res.status(500).json({
        success: false,
        message: 'Error creando RFQ',
        error: (error as any).message
      });
    }
  }

  static async getAllRFQs(req: Request, res: Response): Promise<void> {
    try {
      const quotes = await QuoteService.getAllQuotes();
      
      res.status(200).json({
        success: true,
        data: quotes
      });
      
    } catch (error) {
      console.error('❌ [getAllRFQs] Error:', error);
      res.status(500).json({
        success: false,
        message: 'Error obteniendo RFQs',
        error: (error as any).message
      });
    }
  }

  static async updateRFQ(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const quote = await QuoteService.updateQuote(parseInt(id), updateData);
      
      res.status(200).json({
        success: true,
        message: 'RFQ actualizada exitosamente',
        data: quote
      });
      
    } catch (error) {
      console.error('❌ [updateRFQ] Error:', error);
      res.status(500).json({
        success: false,
        message: 'Error actualizando RFQ',
        error: (error as any).message
      });
    }
  }

  static async deleteRFQ(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      await QuoteService.deleteQuote(parseInt(id));
      
      res.status(200).json({
        success: true,
        message: 'RFQ eliminada exitosamente'
      });
      
    } catch (error) {
      console.error('❌ [deleteRFQ] Error:', error);
      res.status(500).json({
        success: false,
        message: 'Error eliminando RFQ',
        error: (error as any).message
      });
    }
  }
}
