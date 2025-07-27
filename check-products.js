const { PrismaClient } = require('@prisma/client');

async function checkProducts() {
  const prisma = new PrismaClient();
  
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        title: true,
        isActive: true,
        categoryId: true
      }
    });
    
    console.log('📦 Productos en la base de datos:');
    console.log(`Total: ${products.length}`);
    
    products.forEach(product => {
      console.log(`- ${product.id}: ${product.title} (Active: ${product.isActive}, Category: ${product.categoryId})`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProducts();
