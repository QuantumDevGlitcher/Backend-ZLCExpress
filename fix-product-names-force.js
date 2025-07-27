const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Nombres específicos para cada producto por ID
const productNames = {
  1: 'Bloques de Construcción Educativos - 1000 Piezas',
  2: 'Mochilas Escolares Impermeables - Diseño Ergonómico',
  3: 'Set de Brochas de Maquillaje Profesional - 24 Piezas',
  4: 'Camisetas de Algodón 100% - Colección Básica Unisex',
  5: 'Auriculares Bluetooth Inalámbricos - Cancelación de Ruido',
  6: 'Sillas de Oficina Ergonómicas - Respaldo Alto con Lumbar',
  7: 'Smartphone Android 12 - Pantalla AMOLED 6.7"'
};

async function fixProductNames() {
  try {
    console.log('🔧 Corrigiendo nombres de productos...\n');
    
    // Obtener todos los productos
    const products = await prisma.product.findMany({
      select: { id: true, title: true }
    });
    
    console.log(`📊 Productos encontrados: ${products.length}\n`);
    
    for (const product of products) {
      const currentName = product.title;
      const newName = productNames[product.id] || `Producto Premium ID ${product.id}`;
      
      console.log(`📦 Producto ${product.id}:`);
      console.log(`   Nombre actual: "${currentName}"`);
      console.log(`   Nombre nuevo: "${newName}"`);
      
      // Actualizar el nombre
      await prisma.product.update({
        where: { id: product.id },
        data: { title: newName }
      });
      
      console.log(`   ✅ Actualizado\n`);
    }
    
    console.log('🎉 Todos los nombres de productos han sido corregidos!\n');
    
    // Verificar los cambios
    console.log('📋 Verificando cambios:');
    const updatedProducts = await prisma.product.findMany({
      select: { id: true, title: true },
      orderBy: { id: 'asc' }
    });
    
    updatedProducts.forEach(product => {
      console.log(`   ${product.id}: "${product.title}"`);
    });
    
  } catch (error) {
    console.error('❌ Error corrigiendo nombres:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixProductNames();
