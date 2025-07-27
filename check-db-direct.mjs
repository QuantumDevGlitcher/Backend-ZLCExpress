import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

console.log('🔍 Verificando productos en base de datos...\n');

try {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      pricePerContainer: true,
      unitsPerContainer: true,
      moq: true,
      stockContainers: true,
      images: true
    },
    orderBy: { id: 'asc' },
    take: 3
  });

  console.log(`📊 Productos encontrados: ${products.length}\n`);

  products.forEach((product, index) => {
    console.log(`--- PRODUCTO ${index + 1} ---`);
    console.log(`ID: ${product.id}`);
    console.log(`title: "${product.title}"`);
    console.log(`title es undefined: ${product.title === undefined}`);
    console.log(`title es null: ${product.title === null}`);
    console.log(`title es string vacío: ${product.title === ''}`);
    console.log(`title tipo: ${typeof product.title}`);
    console.log(`description: "${product.description?.substring(0, 50)}..."`);
    console.log(`pricePerContainer: ${product.pricePerContainer}`);
    console.log(`unitsPerContainer: ${product.unitsPerContainer}`);
    console.log(`moq: ${product.moq}`);
    console.log(`stockContainers: ${product.stockContainers}`);
    console.log(`images: ${product.images?.length || 0} imágenes`);
    console.log('');
  });

  console.log('✅ Verificación completada');

} catch (error) {
  console.error('❌ Error:', error);
} finally {
  await prisma.$disconnect();
}
