const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateImages() {
  console.log('🖼️ Actualizando URLs de imágenes...');
  
  try {
    // Obtener productos por título para conseguir sus IDs
    console.log('📦 Obteniendo productos...');
    const products = await prisma.product.findMany({
      select: { id: true, title: true }
    });
    
    const categories = await prisma.category.findMany({
      select: { id: true, name: true }
    });
    
    console.log('Productos encontrados:', products);
    console.log('Categorías encontradas:', categories);
    
    // Actualizar imágenes de productos usando updateMany
    console.log('📦 Actualizando imágenes de productos...');
    
    await prisma.product.updateMany({
      where: { title: { contains: 'iPhone 15' } },
      data: { images: ['/images/products/iphone15-pro-max.svg'] }
    });
    
    await prisma.product.updateMany({
      where: { title: { contains: 'Samsung Galaxy' } },
      data: { images: ['/images/products/samsung-s24-ultra.svg'] }
    });
    
    await prisma.product.updateMany({
      where: { title: { contains: 'MacBook' } },
      data: { images: ['/images/products/macbook-pro-16.svg'] }
    });
    
    await prisma.product.updateMany({
      where: { title: { contains: 'Camisas' } },
      data: { images: ['/images/products/cotton-shirts.svg'] }
    });
    
    // Actualizar imágenes de categorías
    console.log('📂 Actualizando imágenes de categorías...');
    
    await prisma.category.updateMany({
      where: { name: 'Electrónicos' },
      data: { image: '/images/categories/electronics.svg' }
    });
    
    await prisma.category.updateMany({
      where: { name: 'Smartphones' },
      data: { image: '/images/categories/smartphones.svg' }
    });
    
    console.log('✅ Imágenes actualizadas exitosamente');
    
  } catch (error) {
    console.error('❌ Error actualizando imágenes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateImages();
