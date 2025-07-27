const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugProductTitle() {
  try {
    console.log('🔍 Debuggeando campo title en productos...\n');
    
    // Consulta directa como en ProductService
    const products = await prisma.product.findMany({
      include: {
        category: true,
        supplier: {
          select: {
            id: true,
            companyName: true,
            isVerified: true,
            country: true,
            city: true
          }
        }
      },
      orderBy: { id: 'asc' },
      take: 3 // Solo los primeros 3
    });

    console.log(`📦 Cantidad de productos encontrados: ${products.length}\n`);
    
    products.forEach((product, index) => {
      console.log(`--- PRODUCTO ${index + 1} ---`);
      console.log(`ID: ${product.id}`);
      console.log(`title (valor directo): "${product.title}"`);
      console.log(`title (tipo): ${typeof product.title}`);
      console.log(`title (es undefined): ${product.title === undefined}`);
      console.log(`title (es null): ${product.title === null}`);
      console.log(`title (es string vacío): ${product.title === ''}`);
      console.log(`title (length): ${product.title?.length || 'N/A'}`);
      console.log(`description: "${product.description?.substring(0, 50)}..."`);
      console.log(`images: ${product.images?.length || 0} imágenes`);
      
      // Verificar el objeto completo
      console.log(`Propiedades del objeto product:`);
      console.log(`- Tiene title: ${'title' in product}`);
      console.log(`- Valor de product.title: ${JSON.stringify(product.title)}`);
      
      // Simular el mapeo del ProductService
      const mapped = {
        id: product.id,
        name: product.title,
        description: product.description
      };
      console.log(`Después del mapeo - name: "${mapped.name}"`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugProductTitle();
