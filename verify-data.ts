// Script de verificación de datos
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyData() {
  try {
    console.log('🔍 Verificando datos en la base de datos...\n');

    // Contar registros
    const userCount = await prisma.user.count();
    const categoryCount = await prisma.category.count();
    const productCount = await prisma.product.count();

    console.log(`👥 Total usuarios: ${userCount}`);
    console.log(`📂 Total categorías: ${categoryCount}`);
    console.log(`📦 Total productos: ${productCount}\n`);

    // Mostrar algunos usuarios
    const users = await prisma.user.findMany({
      select: {
        email: true,
        userType: true,
        companyName: true,
        isVerified: true
      },
      take: 5
    });

    console.log('👥 USUARIOS CREADOS:');
    users.forEach(user => {
      console.log(`  📧 ${user.email} | ${user.userType} | ${user.companyName}`);
    });

    // Mostrar algunas categorías
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    console.log('\n📂 CATEGORÍAS:');
    categories.forEach(cat => {
      console.log(`  📁 ${cat.name} (${cat._count.products} productos)`);
    });

    // Mostrar algunos productos
    const products = await prisma.product.findMany({
      include: {
        supplier: { select: { companyName: true } },
        category: { select: { name: true } }
      },
      take: 3
    });

    console.log('\n📦 PRODUCTOS (muestra):');
    products.forEach(product => {
      console.log(`  🛍️  ${product.title}`);
      console.log(`     💰 $${product.pricePerContainer} USD`);
      console.log(`     🏢 ${product.supplier.companyName}`);
      console.log(`     📂 ${product.category.name}`);
      console.log(`     🖼️  ${product.images.length} imágenes\n`);
    });

    console.log('✅ Verificación completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyData();
