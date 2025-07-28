// ================================================================
// MY QUOTES SERVICE - Servicio Completamente Individualizado
// ================================================================
// Descripción: Servicio que garantiza separación total de datos por usuario
// Sistema tipo Amazon: Cada usuario solo ve sus propios datos

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface MyQuote {
  id: string;
  quoteNumber: string;
  productTitle: string;
  supplierName: string;
  buyerName: string;
  containerType: string;
  quantity: number;
  totalAmount: number;
  currency: string;
  status: string;
  priority: string;
  paymentConditions: string;
  deliveryTerms?: string;
  supplierResponse: string;
  sentAt: string;
  updatedAt: string;
  validUntil?: string;
  items: Array<{
    id: string;
    productTitle: string;
    supplier: string;
    quantity: number;
    pricePerContainer: number;
  }>;
  freightInfo?: {
    cost: number;
    currency: string;
    origin: string;
    destination: string;
    carrier: string;
    transitTime: number;
    estimatedDate: string;
  };
}

export class MyQuotesService {
  /**
   * 🔒 MÉTODO PRINCIPAL: Obtener cotizaciones según tipo de usuario
   * Buyers: Solo ven cotizaciones donde ellos son el comprador
   * Suppliers: Solo ven cotizaciones dirigidas a ellos como proveedores
   */
  static async getMyQuotes(userId: number, userType: 'BUYER' | 'SUPPLIER' | 'BOTH' = 'BUYER'): Promise<MyQuote[]> {
    try {
      console.log(`🔄 MyQuotesService: Obteniendo cotizaciones para usuario ${userId} tipo ${userType}`);

      // 🛡️ FILTRO CRÍTICO: Determinar consulta según tipo de usuario
      let whereClause: any;
      
      if (userType === 'BUYER') {
        // ✅ COMPRADORES: Solo ven cotizaciones que ELLOS crearon
        whereClause = { buyerId: userId };
      } else if (userType === 'SUPPLIER') {
        // ✅ PROVEEDORES: Solo ven cotizaciones dirigidas A ELLOS
        whereClause = { supplierId: userId };
      } else if (userType === 'BOTH') {
        // ✅ USUARIOS HÍBRIDOS: Ven ambas (raro, pero permitido)
        whereClause = {
          OR: [
            { buyerId: userId },
            { supplierId: userId }
          ]
        };
      } else {
        throw new Error(`Tipo de usuario no válido: ${userType}`);
      }

      // 📊 Ejecutar consulta con filtro de seguridad
      const quotes = await prisma.quote.findMany({
        where: whereClause, // 🔐 SEGURIDAD CRÍTICA
        include: {
          buyer: {
            select: { 
              id: true, 
              companyName: true, 
              email: true,
              contactName: true 
            }
          },
          supplier: {
            select: { 
              id: true, 
              companyName: true, 
              email: true,
              contactName: true 
            }
          },
          product: {
            select: { 
              title: true, 
              supplier: { 
                select: { companyName: true } 
              } 
            }
          },
          quoteItems: {
            select: {
              id: true,
              itemDescription: true,
              productTitle: true,
              quantity: true,
              unitPrice: true,
              totalPrice: true,
              currency: true,
              specifications: true
            }
          },
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
        orderBy: {
          createdAt: 'desc'
        }
      });

      // 🔄 Transformar datos para frontend
      const transformedQuotes: MyQuote[] = quotes.map((quote: any) => ({
        id: quote.id.toString(),
        quoteNumber: quote.quoteNumber,
        productTitle: quote.productTitle || quote.product?.title || 'Producto sin título',
        supplierName: quote.supplier?.companyName || 'Proveedor desconocido',
        buyerName: quote.buyer?.companyName || 'Comprador desconocido',
        containerType: quote.containerType || '40GP',
        quantity: quote.containerQuantity || 1,
        totalAmount: Number(quote.totalPrice || 0),
        currency: quote.currency || 'USD',
        status: this.mapQuoteStatus(quote.status),
        priority: quote.priority || 'medium',
        paymentConditions: quote.paymentTerms || 'Sin condiciones',
        deliveryTerms: quote.deliveryTerms || undefined,
        supplierResponse: quote.supplierComments || '',
        sentAt: quote.requestDate?.toISOString() || quote.createdAt.toISOString(),
        updatedAt: quote.updatedAt.toISOString(),
        validUntil: quote.validUntil?.toISOString(),
        items: quote.quoteItems?.map((item: any) => ({
          id: item.id.toString(),
          productTitle: item.productTitle || item.itemDescription || 'Item sin título',
          supplier: quote.supplier?.companyName || 'Proveedor desconocido',
          quantity: item.quantity || 1,
          pricePerContainer: Number(item.unitPrice || 0)
        })) || [],
        freightInfo: quote.freightQuote ? {
          cost: Number(quote.freightQuote.cost || 0),
          currency: quote.freightQuote.currency || 'USD',
          origin: quote.freightQuote.originPort || 'Puerto origen',
          destination: quote.freightQuote.destinationPort || 'Puerto destino',
          carrier: quote.freightQuote.carrier || 'Transportista',
          transitTime: quote.freightQuote.transitTime || 0,
          estimatedDate: quote.freightQuote.estimatedArrival?.toISOString() || ''
        } : undefined
      }));

      console.log(`✅ MyQuotesService: ${transformedQuotes.length} cotizaciones obtenidas para usuario ${userId} (${userType})`);
      
      // 🔍 Log de auditoría de seguridad
      console.log(`🔐 AUDITORIA: Usuario ${userId} (${userType}) accedió a ${transformedQuotes.length} cotizaciones`);
      
      return transformedQuotes;

    } catch (error: any) {
      console.error('❌ MyQuotesService: Error obteniendo cotizaciones:', error);
      throw new Error(`Error al obtener cotizaciones: ${error.message}`);
    }
  }

  /**
   * 📊 Obtener estadísticas del usuario (solo sus datos)
   */
  static async getMyQuotesStats(userId: number, userType: 'BUYER' | 'SUPPLIER' | 'BOTH'): Promise<{
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
    expired: number;
  }> {
    try {
      console.log(`📊 MyQuotesService: Obteniendo estadísticas para usuario ${userId} tipo ${userType}`);

      // 🛡️ Mismo filtro de seguridad que en getMyQuotes
      let whereClause: any;
      
      if (userType === 'BUYER') {
        whereClause = { buyerId: userId };
      } else if (userType === 'SUPPLIER') {
        whereClause = { supplierId: userId };
      } else if (userType === 'BOTH') {
        whereClause = {
          OR: [
            { buyerId: userId },
            { supplierId: userId }
          ]
        };
      }

      // 📈 Contar por estados
      const [total, pending, accepted, rejected, expired] = await Promise.all([
        prisma.quote.count({ where: whereClause }),
        prisma.quote.count({ where: { ...whereClause, status: 'PENDING' } }),
        prisma.quote.count({ where: { ...whereClause, status: 'ACCEPTED' } }),
        prisma.quote.count({ where: { ...whereClause, status: 'REJECTED' } }),
        prisma.quote.count({ where: { ...whereClause, status: 'EXPIRED' } })
      ]);

      const stats = { total, pending, accepted, rejected, expired };
      console.log(`✅ MyQuotesService: Estadísticas obtenidas:`, stats);
      
      return stats;

    } catch (error: any) {
      console.error('❌ MyQuotesService: Error obteniendo estadísticas:', error);
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }

  /**
   * 🔄 Mapear estados de cotización
   */
  private static mapQuoteStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'PENDING': 'pending',
      'SENT': 'pending',
      'QUOTED': 'pending',
      'COUNTER_OFFER': 'counter-offer',
      'ACCEPTED': 'accepted',
      'REJECTED': 'rejected',
      'EXPIRED': 'expired',
      'CANCELLED': 'cancelled'
    };
    
    return statusMap[status] || 'pending';
  }
}

export default MyQuotesService;
