// ================================================================
// SCRIPT DE VERIFICACIÓN - Estado de la Base de Datos
// ================================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📊 VERIFICACIÓN DEL ESTADO DE LA BASE DE DATOS');
  console.log('='.repeat(60));

  try {
    // Contar usuarios
    const userStats = await prisma.user.groupBy({
      by: ['userType', 'verificationStatus'],
      _count: true
    });

    console.log('\n👥 USUARIOS:');
    let totalUsers = 0;
    userStats.forEach(stat => {
      console.log(`   ${stat.userType} - ${stat.verificationStatus}: ${stat._count} usuarios`);
      totalUsers += stat._count;
    });
    console.log(`   TOTAL: ${totalUsers} usuarios`);

    // Mostrar usuarios específicos para demo
    console.log('\n🔐 USUARIOS DEMO DISPONIBLES:');
    const demoUsers = await prisma.user.findMany({
      where: {
        email: {
          in: [
            'comprador@demo.com',
            'comprador.pendiente@demo.com',
            'proveedor@demo.com',
            'proveedor.pendiente@demo.com',
            'proveedor.rechazado@demo.com',
            'admin@zlcexpress.com'
          ]
        }
      },
      select: {
        email: true,
        userType: true,
        verificationStatus: true,
        companyName: true
      }
    });

    demoUsers.forEach(user => {
      console.log(`   📧 ${user.email}`);
      console.log(`      Tipo: ${user.userType} | Estado: ${user.verificationStatus}`);
      console.log(`      Empresa: ${user.companyName}`);
      console.log(`      Contraseña: demo123`);
      console.log('');
    });

    // Contar categorías
    const categoryCount = await prisma.category.count();
    const categoriesWithProducts = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });

    console.log(`\n📂 CATEGORÍAS: ${categoryCount} categorías`);
    categoriesWithProducts.forEach(cat => {
      console.log(`   ${cat.name} (${cat._count.products} productos)`);
    });

    // Contar productos
    const productCount = await prisma.product.count();
    const productsByCategory = await prisma.product.groupBy({
      by: ['categoryId'],
      _count: true
    });

    console.log(`\n📦 PRODUCTOS: ${productCount} productos totales`);
    
    // Mostrar algunos productos de ejemplo
    const sampleProducts = await prisma.product.findMany({
      take: 5,
      include: {
        category: { select: { name: true } },
        supplier: { select: { companyName: true } }
      }
    });

    console.log('\n📦 PRODUCTOS DE EJEMPLO:');
    sampleProducts.forEach(product => {
      console.log(`   • ${product.title}`);
      console.log(`     Categoría: ${product.category.name}`);
      console.log(`     Proveedor: ${product.supplier.companyName}`);
      console.log(`     Precio por contenedor: $${product.pricePerContainer?.toLocaleString() || 'N/A'}`);
      console.log(`     MOQ: ${product.moq} | Stock: ${product.stockContainers} contenedores`);
      console.log('');
    });

    // Verificar otras tablas
    const orderCount = await prisma.order.count();
    const cartItemCount = await prisma.cartItem.count();
    const quoteCount = await prisma.quote.count();

    console.log('\n📋 OTRAS TABLAS:');
    console.log(`   Órdenes: ${orderCount}`);
    console.log(`   Items en carrito: ${cartItemCount}`);
    console.log(`   Cotizaciones: ${quoteCount}`);

    console.log('\n✅ BASE DE DATOS CARGADA CORRECTAMENTE');
    console.log('='.repeat(60));

    // URLs de acceso
    console.log('\n🌐 URLS DE ACCESO:');
    console.log('   Backend: http://localhost:3000');
    console.log('   Health Check: http://localhost:3000/health');
    console.log('   Productos: http://localhost:3000/api/products');
    console.log('   Categorías: http://localhost:3000/api/categories');
    console.log('   Auth Login: http://localhost:3000/api/auth/login');

  } catch (error) {
    console.error('❌ Error verificando la base de datos:', error);
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
