// ================================================================
// SCRIPT PARA CREAR COTIZACIÓN DE PRUEBA - ZLCExpress
// ================================================================
// Este script crea una cotización de prueba para verificar las estadísticas

import { PrismaClient } from '@prisma/client';
import QuoteService from './src/services/quoteService';

const prisma = new PrismaClient();

async function main() {
  console.log('🧪 Creando cotización de prueba...');

  try {
    // Buscar el usuario comprador
    const buyer = await prisma.user.findUnique({
      where: { email: 'comprador@demo.com' }
    });

    if (!buyer) {
      console.error('❌ Usuario comprador no encontrado');
      return;
    }

    console.log('✅ Usuario encontrado:', buyer.email, 'ID:', buyer.id);

    // Datos de la cotización de prueba
    const testQuoteData = {
      totalAmount: 47100,
      currency: 'USD',
      items: [
        {
          productId: 1,
          productTitle: 'Sillas de Oficina Ergonómicas - Respaldo Alto con Lumbar',
          supplierName: 'Hangzhou Textile Industries',
          quantity: 1,
          containerQuantity: 1,
          pricePerContainer: 44400,
          containerType: '40GP',
          incoterm: 'FOB'
        }
      ],
      freightDetails: {
        origin: 'Puerto de Colón (Panamá)',
        destination: 'Puerto de Cartagena (Colombia)',
        carrier: 'Maersk Line',
        cost: 2450,
        currency: 'USD',
        transitTime: 12,
        estimatedDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString()
      },
      notes: 'Cotización de prueba generada automáticamente para verificar estadísticas'
    };

    // Crear la cotización
    const quote = await QuoteService.createQuote(buyer.id, testQuoteData);
    
    console.log('✅ Cotización creada exitosamente:', quote.quoteNumber);
    console.log('📊 ID de cotización:', quote.id);
    
    // Verificar estadísticas
    const stats = await QuoteService.getQuoteStats(buyer.id);
    console.log('📈 Estadísticas actualizadas:', stats);

  } catch (error) {
    console.error('❌ Error creando cotización de prueba:', error);
  }
}

main()
  .catch((e) => {
    console.error('❌ Error en el script:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('\n🏁 Script completado');
  });
