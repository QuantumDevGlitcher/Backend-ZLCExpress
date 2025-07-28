// Test simple para crear una cotización mínima
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testSimpleQuote() {
  try {
    console.log('🧪 Creando cotización mínima...');

    // Datos mínimos para una cotización
    const quoteData = {
      quoteNumber: `TEST-${Date.now()}`,
      buyerId: 2, // Asumiendo que existe
      supplierId: 1, // Asumiendo que existe
      productTitle: 'Test Product',
      containerQuantity: 1,
      containerType: '40GP',
      totalPrice: 1000,
      currency: 'USD',
      status: 'PENDING',
      paymentTerms: 'Net 30',
      logisticsComments: 'Test quote',
      estimatedValue: 1000
    };

    console.log('📋 Datos para crear:', JSON.stringify(quoteData, null, 2));

    const quote = await prisma.quote.create({
      data: quoteData
    });

    console.log('✅ Cotización creada exitosamente:', quote.id);
    return quote;

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('📋 Error completo:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testSimpleQuote();
