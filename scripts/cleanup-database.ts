// scripts/cleanup-database.ts
// Script para limpiar datos inconsistentes y garantizar separación por usuario

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupDatabase() {
  console.log('🧹 Iniciando limpieza de base de datos...');

  try {
    // 1. Eliminar órdenes de pago inconsistentes
    console.log('📝 Eliminando órdenes de pago inconsistentes...');
    const inconsistentPaymentOrders = await prisma.$executeRaw`
      DELETE FROM payment_orders 
      WHERE buyer_id != (
        SELECT buyer_id 
        FROM quotes 
        WHERE quotes.id = payment_orders.quote_id
      )
    `;
    console.log(`✅ Eliminadas ${inconsistentPaymentOrders} órdenes de pago inconsistentes`);

    // 2. Mostrar estadísticas de usuarios y sus datos
    console.log('� Estadísticas de usuarios:');
    const userStats = await prisma.user.groupBy({
      by: ['userType'],
      _count: {
        _all: true
      }
    });
    userStats.forEach(stat => {
      console.log(`   ${stat.userType}: ${stat._count._all} usuarios`);
    });

    // 3. Mostrar estadísticas de cotizaciones por usuario
    console.log('💬 Estadísticas de cotizaciones:');
    const quotesPerUser = await prisma.quote.groupBy({
      by: ['buyerId'],
      _count: {
        _all: true
      }
    });
    console.log(`📊 Compradores con cotizaciones: ${quotesPerUser.length}`);
    quotesPerUser.forEach(stat => {
      console.log(`   Usuario ${stat.buyerId}: ${stat._count._all} cotizaciones`);
    });

    // 4. Mostrar estadísticas de órdenes de pago
    console.log('� Estadísticas de órdenes de pago:');
    const paymentOrdersPerUser = await prisma.paymentOrder.groupBy({
      by: ['buyerId'],
      _count: {
        _all: true
      }
    });
    console.log(`📊 Compradores con órdenes de pago: ${paymentOrdersPerUser.length}`);
    paymentOrdersPerUser.forEach(stat => {
      console.log(`   Usuario ${stat.buyerId}: ${stat._count._all} órdenes de pago`);
    });

    console.log('✅ Limpieza de base de datos completada');

  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupDatabase();
