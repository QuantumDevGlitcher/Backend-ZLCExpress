import { PrismaClient } from '@prisma/client';
import { ShippingQuoteRequest, ShippingCarrier } from '../types/shipping';

const prisma = new PrismaClient();

// Datos mock de transportistas y rutas (en producción vendrían de APIs externas)
const MOCK_CARRIERS: ShippingCarrier[] = [
  {
    code: 'MAERSK',
    name: 'Maersk Line',
    serviceTypes: ['Standard', 'Express', 'Eco'],
    rating: 4.8,
    logo: '/carriers/maersk.png'
  },
  {
    code: 'MSC',
    name: 'MSC Logistics',
    serviceTypes: ['Standard', 'Premium'],
    rating: 4.5,
    logo: '/carriers/msc.png'
  },
  {
    code: 'CMA',
    name: 'CMA CGM',
    serviceTypes: ['Standard', 'Express'],
    rating: 4.6,
    logo: '/carriers/cma.png'
  }
];

const MOCK_PORTS = [
  { code: 'PACLP', name: 'Puerto de Colón, Panamá', country: 'Panamá' },
  { code: 'USLAX', name: 'Puerto de Los Angeles (EEUU)', country: 'Estados Unidos' },
  { code: 'USMIA', name: 'Puerto de Miami (EEUU)', country: 'Estados Unidos' },
  { code: 'CRCAL', name: 'Puerto Caldera (Costa Rica)', country: 'Costa Rica' },
  { code: 'GTQUE', name: 'Puerto Quetzal (Guatemala)', country: 'Guatemala' },
  { code: 'COCAR', name: 'Puerto de Cartagena (Colombia)', country: 'Colombia' },
  { code: 'ECGYE', name: 'Puerto de Guayaquil (Ecuador)', country: 'Ecuador' },
  { code: 'VELGU', name: 'Puerto de La Guaira (Venezuela)', country: 'Venezuela' }
];

export class ShippingService {
  
  /**
   * Obtener cotizaciones de flete para una orden
   */
  static async getShippingQuotes(request: ShippingQuoteRequest, userId: number): Promise<any[]> {
    console.log('🚢 ShippingService.getShippingQuotes called:', request);

    const quotes: any[] = [];
    const baseDate = request.estimatedShippingDate || new Date();

    // Generar cotizaciones para cada transportista
    for (const carrier of MOCK_CARRIERS) {
      for (const serviceType of carrier.serviceTypes) {
        const quote = this.generateMockQuote(
          request,
          carrier,
          serviceType,
          userId,
          baseDate
        );
        quotes.push(quote);
      }
    }

    // Guardar cotizaciones en la base de datos
    const savedQuotes = await Promise.all(
      quotes.map(quote => 
        prisma.shippingQuote.create({
          data: {
            userId: quote.userId,
            originPort: quote.originPort,
            destinationPort: quote.destinationPort,
            containerType: quote.containerType,
            containerCount: quote.containerCount,
            carrier: quote.carrier,
            carrierCode: quote.carrierCode,
            serviceType: quote.serviceType,
            cost: quote.cost,
            currency: quote.currency,
            transitTime: quote.transitTime,
            estimatedDeparture: quote.estimatedDeparture,
            estimatedArrival: quote.estimatedArrival,
            validUntil: quote.validUntil,
            incoterm: quote.incoterm,
            conditions: quote.conditions
          }
        })
      )
    );

    console.log('✅ Generated', savedQuotes.length, 'shipping quotes');
    return savedQuotes as any[];
  }

  /**
   * Seleccionar una cotización de flete para una orden
   */
  static async selectShippingQuote(quoteId: number, orderId: number): Promise<void> {
    console.log('🚢 Selecting shipping quote:', quoteId, 'for order:', orderId);

    // Desmarcar otras cotizaciones del mismo pedido
    await prisma.shippingQuote.updateMany({
      where: { orderId },
      data: { isSelected: false }
    });

    // Marcar la cotización seleccionada
    const selectedQuote = await prisma.shippingQuote.update({
      where: { id: quoteId },
      data: { 
        isSelected: true,
        orderId,
        status: 'SELECTED'
      }
    });

    // Actualizar la orden con la información de shipping
    await prisma.order.update({
      where: { id: orderId },
      data: {
        shippingCost: selectedQuote.cost,
        shippingCarrier: selectedQuote.carrier,
        transitTime: selectedQuote.transitTime,
        estimatedShippingDate: selectedQuote.estimatedDeparture,
        incoterm: selectedQuote.incoterm,
        originPort: selectedQuote.originPort,
        destinationPort: selectedQuote.destinationPort,
        containerType: selectedQuote.containerType
      }
    });

    console.log('✅ Shipping quote selected and order updated');
  }

  /**
   * Obtener cotizaciones de flete para un usuario
   */
  static async getQuotesByUser(userId: number): Promise<any[]> {
    return await prisma.shippingQuote.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Obtener cotizaciones de flete para una orden específica
   */
  static async getQuotesByOrder(orderId: number): Promise<any[]> {
    return await prisma.shippingQuote.findMany({
      where: { orderId },
      orderBy: { cost: 'asc' }
    });
  }

  /**
   * Obtener puertos disponibles
   */
  static async getAvailablePorts(): Promise<typeof MOCK_PORTS> {
    return MOCK_PORTS;
  }

  /**
   * Calcular costo de flete estimado
   */
  static calculateEstimatedCost(
    distance: number, 
    containerType: string, 
    serviceType: string = 'Standard'
  ): number {
    let baseCost = distance * 2.5; // $2.5 por milla náutica

    // Ajuste por tipo de contenedor
    if (containerType === '40GP' || containerType === '40HC') {
      baseCost *= 1.6;
    } else if (containerType === '20GP') {
      baseCost *= 1.0;
    }

    // Ajuste por tipo de servicio
    switch (serviceType) {
      case 'Express':
        baseCost *= 1.4;
        break;
      case 'Premium':
        baseCost *= 1.3;
        break;
      case 'Eco':
        baseCost *= 0.85;
        break;
      default: // Standard
        baseCost *= 1.0;
    }

    return Math.round(baseCost);
  }

  /**
   * Generar cotización mock
   */
  private static generateMockQuote(
    request: ShippingQuoteRequest,
    carrier: ShippingCarrier,
    serviceType: string,
    userId: number,
    baseDate: Date
  ): any {
    // Calcular distancia mock (en producción vendría de un servicio de rutas)
    const distance = this.getMockDistance(request.originPort, request.destinationPort);
    const baseCost = this.calculateEstimatedCost(distance, request.containerType, serviceType);
    
    // Ajustar costo por transportista
    let finalCost = baseCost;
    if (carrier.code === 'MAERSK') finalCost *= 1.1; // Premium carrier
    if (carrier.code === 'MSC') finalCost *= 0.95;   // Competitive pricing
    
    // Calcular tiempos de tránsito
    let transitTime = Math.ceil(distance / 500); // 500 millas por día promedio
    if (serviceType === 'Express') transitTime = Math.ceil(transitTime * 0.8);
    if (serviceType === 'Eco') transitTime = Math.ceil(transitTime * 1.3);

    const departureDate = new Date(baseDate);
    departureDate.setDate(departureDate.getDate() + 7); // 7 días para preparación
    
    const arrivalDate = new Date(departureDate);
    arrivalDate.setDate(arrivalDate.getDate() + transitTime);

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 7); // Válido por 7 días

    return {
      id: 0, // Se asignará al guardar en DB
      userId,
      originPort: request.originPort,
      destinationPort: request.destinationPort,
      containerType: request.containerType,
      containerCount: request.containerCount,
      carrier: carrier.name,
      carrierCode: carrier.code,
      serviceType,
      cost: finalCost * request.containerCount,
      currency: 'USD',
      transitTime,
      estimatedDeparture: departureDate,
      estimatedArrival: arrivalDate,
      validUntil,
      incoterm: request.incoterm,
      conditions: this.generateConditions(serviceType),
      isSelected: false,
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Obtener distancia mock entre puertos
   */
  private static getMockDistance(origin: string, destination: string): number {
    // Distances en millas náuticas (mock data)
    const distances: { [key: string]: number } = {
      'PACLP-USLAX': 2800,
      'PACLP-USMIA': 1200,
      'PACLP-CRCAL': 400,
      'PACLP-GTQUE': 800,
      'PACLP-COCAR': 600,
      'PACLP-ECGYE': 900,
      'PACLP-VELGU': 800,
      'USLAX-USMIA': 3200,
      'USMIA-CRCAL': 1100,
      // Agregar más rutas según sea necesario
    };

    const key = `${origin}-${destination}`;
    const reverseKey = `${destination}-${origin}`;
    
    return distances[key] || distances[reverseKey] || 2000; // Default 2000 nm
  }

  /**
   * Generar condiciones de envío
   */
  private static generateConditions(serviceType: string): string {
    const baseConditions = [
      'Seguro incluido',
      'Documentación completa requerida',
      'Cumplimiento de regulaciones aduaneras'
    ];

    if (serviceType === 'Express') {
      baseConditions.push('Servicio prioritario', 'Tracking en tiempo real');
    } else if (serviceType === 'Premium') {
      baseConditions.push('Handling especial', 'Soporte 24/7');
    } else if (serviceType === 'Eco') {
      baseConditions.push('Ruta optimizada', 'Menor huella de carbono');
    }

    return baseConditions.join(', ');
  }
}
