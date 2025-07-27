const { PrismaClient } = require('@prisma/client');

async function checkData() {
  const prisma = new PrismaClient();
  
  try {
    const categoryCount = await prisma.category.count();
    const productCount = await prisma.product.count();
    const userCount = await prisma.user.count();
    
    console.log('📊 Datos en la base de datos:');
    console.log(`   Categorías: ${categoryCount}`);
    console.log(`   Productos: ${productCount}`);
    console.log(`   Usuarios: ${userCount}`);
    
    if (categoryCount > 0) {
      const categories = await prisma.category.findMany({
        include: {
          _count: {
            select: { products: true }
          }
        }
      });
      
      console.log('\n📂 Categorías encontradas:');
      categories.forEach(cat => {
        console.log(`   - ${cat.name} (${cat._count.products} productos)`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
