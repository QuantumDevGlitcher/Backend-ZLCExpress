// ================================================================
// SERVICIO DE INTEGRACIÓN MY QUOTES SIMPLIFICADO - ZLCExpress
// ================================================================
// Descripción: Servicio simplificado para conectar cotizaciones con frontend My Quotes
// Fecha: 2025-07-27

import { PrismaClient } from '@prisma/client';
import QuoteService from './quoteService';

const prisma = new PrismaClient();

// Interfaces para compatibilidad con frontend
export interface MyQuoteItem {
  id: string;
  productTitle: string;
  supplier: string;
  quantity: number;
  pricePerContainer: number;
}

export interface MyQuote {
  id: string;
  items: MyQuoteItem[];
  totalAmount: number;
  status: 'pending' | 'accepted' | 'counter-offer' | 'rejected' | 'expired';
  sentAt: Date;
  updatedAt: Date;
  paymentConditions: string;
  supplierResponse: string;
  quoteNumber?: string;
  containerType?: string;
  incoterm?: string;
  leadTime?: number;
  validUntil?: Date;
  freightInfo?: {
    cost: number;
    currency: string;
    origin: string;
    destination: string;
    carrier: string;
    transitTime: number;
    estimatedDate: Date;
  };
}

export class MyQuotesService {

  /**
   * Obtener cotizaciones para My Quotes (formato frontend)
   */
  static async getMyQuotes(userId: number): Promise<MyQuote[]> {
    try {
      console.log('🔄 MyQuotesService: Obteniendo cotizaciones para usuario:', userId);

      // Obtener cotizaciones directamente de Prisma con toda la información
      const quotes = await prisma.quote.findMany({
        where: { 
          OR: [
            { buyerId: userId },
            { supplierId: userId }
          ]
        },
        include: {
          buyer: {
            select: { id: true, companyName: true, email: true }
          },
          supplier: {
            select: { id: true, companyName: true, email: true }
          },
          product: {
            select: { title: true, supplier: { select: { companyName: true } } }
          },
          quoteItems: true,
          freightQuote: {
            select: {
              cost: true,
              currency: true,
              originPort: true,
              destinationPort: true,
              carrier: true,
              transitTime: true,
              estimatedArrival: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      console.log(`📊 MyQuotesService: ${quotes.length} cotizaciones encontradas en BD`);

      // Convertir formato de BD a formato frontend
      const myQuotes: MyQuote[] = quotes.map((quote: any) => {
        console.log(`🔍 Procesando cotización ${quote.quoteNumber}:`, {
          id: quote.id,
          productTitle: quote.productTitle,
          supplier: quote.supplier?.companyName,
          totalPrice: quote.totalPrice,
          paymentTerms: quote.paymentTerms,
          freightQuote: quote.freightQuote,
          quoteItems: quote.quoteItems?.length || 0
        });

        // Preparar items con datos reales
        const items: MyQuoteItem[] = quote.quoteItems && quote.quoteItems.length > 0 
          ? quote.quoteItems.map((item: any, index: number) => ({
              id: (index + 1).toString(),
              productTitle: item.itemDescription || quote.productTitle || 'Producto sin nombre',
              supplier: quote.supplier?.companyName || 'Proveedor no especificado',
              quantity: item.quantity || quote.containerQuantity || 1,
              pricePerContainer: item.unitPrice ? parseFloat(item.unitPrice.toString()) : 0
            }))
          : [{
              id: '1',
              productTitle: quote.productTitle || 'Producto sin nombre',
              supplier: quote.supplier?.companyName || 'Proveedor no especificado',
              quantity: quote.containerQuantity || 1,
              pricePerContainer: quote.unitPrice ? parseFloat(quote.unitPrice.toString()) : 
                               (quote.totalPrice ? parseFloat(quote.totalPrice.toString()) / (quote.containerQuantity || 1) : 0)
            }];

        // Mapear estados de BD a estados de frontend
        const statusMap: any = {
          'PENDING': 'pending',
          'DRAFT': 'pending',
          'SENT': 'pending',
          'QUOTED': 'counter-offer',
          'COUNTER_OFFER': 'counter-offer',
          'ACCEPTED': 'accepted',
          'REJECTED': 'rejected',
          'EXPIRED': 'expired',
          'CANCELLED': 'rejected'
        };

        const myQuote: MyQuote = {
          id: quote.id.toString(),
          items: items,
          totalAmount: quote.totalPrice ? parseFloat(quote.totalPrice.toString()) : 0,
          status: statusMap[quote.status] || 'pending',
          sentAt: quote.createdAt || new Date(),
          updatedAt: quote.updatedAt || new Date(),
          paymentConditions: quote.paymentTerms || 'Condiciones no especificadas',
          supplierResponse: quote.supplierComments || '',
          quoteNumber: quote.quoteNumber,
          containerType: quote.containerType,
          incoterm: quote.incoterm || undefined,
          leadTime: quote.leadTime || undefined,
          validUntil: quote.validUntil || undefined,
          // Agregar información de flete
          freightInfo: quote.freightQuote ? {
            cost: parseFloat(quote.freightQuote.cost.toString()),
            currency: quote.freightQuote.currency,
            origin: quote.freightQuote.originPort,
            destination: quote.freightQuote.destinationPort,
            carrier: quote.freightQuote.carrier,
            transitTime: quote.freightQuote.transitTime,
            estimatedDate: quote.freightQuote.estimatedArrival
          } : undefined
        };

        return myQuote;
      });

      console.log('✅ MyQuotesService: Cotizaciones convertidas al formato frontend');
      return myQuotes;

    } catch (error) {
      console.error('❌ MyQuotesService: Error obteniendo cotizaciones:', error);
      throw new Error('Error al obtener cotizaciones para My Quotes');
    }
  }

  /**
   * Obtener estadísticas para My Quotes
   */
  static async getMyQuotesStats(userId: number) {
    try {
      console.log('🔄 MyQuotesService: Calculando estadísticas para usuario:', userId);

      const stats = await QuoteService.getQuoteStats(userId);
      
      // Convertir a formato esperado por frontend
      const myQuotesStats = {
        all: stats.total || 0,
        pending: stats.pending || 0,
        accepted: stats.approved || 0,
        'counter-offer': 0, // No implementado aún
        rejected: stats.rejected || 0,
        totalValue: 0 // Calcular después
      };

      console.log('✅ MyQuotesService: Estadísticas calculadas:', myQuotesStats);
      return myQuotesStats;

    } catch (error) {
      console.error('❌ MyQuotesService: Error calculando estadísticas:', error);
      throw new Error('Error al calcular estadísticas');
    }
  }

  /**
   * Crear cotización directamente desde frontend
   */
  static async createQuoteFromFrontend(userId: number, quoteData: any) {
    try {
      console.log('🔄 MyQuotesService: Creando cotización desde frontend:', quoteData);

      const quote = await QuoteService.createQuote(userId, {
        totalAmount: quoteData.totalAmount || 0,
        notes: quoteData.notes || '',
        items: quoteData.items || [],
        freightDetails: quoteData.freightDetails
      });

      console.log('✅ MyQuotesService: Cotización creada desde frontend');
      return quote;

    } catch (error) {
      console.error('❌ MyQuotesService: Error creando cotización desde frontend:', error);
      throw new Error('Error creando cotización');
    }
  }
}

export default MyQuotesService;
