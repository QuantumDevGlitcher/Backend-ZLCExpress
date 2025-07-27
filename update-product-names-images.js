const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Actualizaciones para agregar nombres e imágenes a los productos
const productUpdates = [
  {
    id: 1, // Bloques de Construcción Educativos
    title: 'Bloques de Construcción Educativos - 1000 Piezas',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=500&h=400&fit=crop'
    ]
  },
  {
    id: 2, // Mochilas Escolares Impermeables
    title: 'Mochilas Escolares Impermeables - Diseño Ergonómico',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1581605405669-fcdf81163b05?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500&h=400&fit=crop'
    ]
  },
  {
    id: 3, // Set de Brochas de Maquillaje
    title: 'Set de Brochas de Maquillaje Profesional - 24 Piezas',
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1583241800098-c41c803e1b63?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=400&fit=crop'
    ]
  },
  {
    id: 4, // Camisetas de Algodón
    title: 'Camisetas de Algodón 100% - Colección Básica Unisex',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1583743814966-8936f37f743e?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&h=400&fit=crop'
    ]
  },
  {
    id: 5, // Auriculares Bluetooth
    title: 'Auriculares Bluetooth Inalámbricos - Cancelación de Ruido',
    images: [
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=400&fit=crop'
    ]
  },
  {
    id: 6, // Sillas de Oficina
    title: 'Sillas de Oficina Ergonómicas - Respaldo Alto con Lumbar',
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571624436279-b272aff752b5?w=500&h=400&fit=crop'
    ]
  },
  {
    id: 7, // Smartphone Android
    title: 'Smartphone Android 12 - Pantalla AMOLED 6.7"',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=500&h=400&fit=crop'
    ]
  }
];

async function updateProductNamesAndImages() {
  console.log('🖼️  Actualizando nombres e imágenes de productos...\n');

  try {
    for (const update of productUpdates) {
      const { id, title, images } = update;
      
      console.log(`📦 Actualizando producto ID ${id}...`);
      console.log(`   Nombre: ${title}`);
      console.log(`   Imágenes: ${images.length} imágenes`);
      
      const updatedProduct = await prisma.product.update({
        where: { id },
        data: {
          title,
          images
        }
      });
      
      console.log(`✅ Producto ${id} actualizado exitosamente\n`);
    }
    
    console.log('🎉 ¡Todos los productos han sido actualizados con nombres e imágenes!');
    
    // Verificar los productos actualizados
    console.log('\n📊 Verificando productos actualizados:');
    const products = await prisma.product.findMany({
      select: {
        id: true,
        title: true,
        images: true,
        pricePerContainer: true,
        unitsPerContainer: true,
        moq: true,
        stockContainers: true
      },
      orderBy: { id: 'asc' }
    });
    
    products.forEach(product => {
      console.log(`\n🏷️  ${product.title}`);
      console.log(`    ID: ${product.id}`);
      console.log(`    Imágenes: ${product.images?.length || 0} disponibles`);
      console.log(`    Primera imagen: ${product.images?.[0] || 'Sin imagen'}`);
      console.log(`    Precio por contenedor: $${product.pricePerContainer?.toLocaleString() || 0}`);
      console.log(`    Unidades por contenedor: ${product.unitsPerContainer?.toLocaleString() || 0}`);
      console.log(`    MOQ: ${product.moq?.toLocaleString() || 0}`);
      console.log(`    Stock: ${product.stockContainers || 0} contenedores`);
    });
    
  } catch (error) {
    console.error('❌ Error actualizando productos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateProductNamesAndImages();
