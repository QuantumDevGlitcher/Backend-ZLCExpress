const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Datos realistas para actualizar los productos
const productUpdates = [
  {
    id: 1, // Bloques de Construcción Educativos - 1000 Piezas
    unitsPerContainer: 2400, // 2,400 sets por contenedor 40GP
    moq: 600, // Mínimo 600 sets (1/4 contenedor)
    unitPrice: 8.50, // $8.50 por set
    pricePerContainer: 20400, // $20,400 por contenedor completo
    currency: 'USD',
    grossWeight: 18500, // 18.5 toneladas
    netWeight: 16800, // 16.8 toneladas
    volume: 65, // 65 m³
    packagingType: 'Cajas de cartón individuales',
    stockContainers: 15, // 15 contenedores en stock
    productionTime: 25, // 25 días de producción
    packagingTime: 3, // 3 días de empaque
    containerType: '40GP',
    incoterm: 'FOB ZLC'
  },
  {
    id: 2, // Mochilas Escolares Impermeables - Diseño Ergonómico
    unitsPerContainer: 1800, // 1,800 mochilas por contenedor 40GP
    moq: 450, // Mínimo 450 mochilas
    unitPrice: 12.75, // $12.75 por mochila
    pricePerContainer: 22950, // $22,950 por contenedor
    currency: 'USD',
    grossWeight: 16200, // 16.2 toneladas
    netWeight: 14500, // 14.5 toneladas
    volume: 62, // 62 m³
    packagingType: 'Bolsas individuales de plástico',
    stockContainers: 8, // 8 contenedores en stock
    productionTime: 20, // 20 días
    packagingTime: 2,
    containerType: '40GP',
    incoterm: 'FOB ZLC'
  },
  {
    id: 3, // Set de Brochas de Maquillaje Profesional - 24 Piezas
    unitsPerContainer: 3600, // 3,600 sets por contenedor 40GP
    moq: 900, // Mínimo 900 sets
    unitPrice: 15.80, // $15.80 por set
    pricePerContainer: 56880, // $56,880 por contenedor
    currency: 'USD',
    grossWeight: 12400, // 12.4 toneladas
    netWeight: 10800, // 10.8 toneladas
    volume: 58, // 58 m³
    packagingType: 'Estuches individuales con ventana',
    stockContainers: 12, // 12 contenedores en stock
    productionTime: 18, // 18 días
    packagingTime: 2,
    containerType: '40GP',
    incoterm: 'FOB ZLC'
  },
  {
    id: 4, // Camisetas de Algodón 100% - Colección Básica Unisex
    unitsPerContainer: 4800, // 4,800 camisetas por contenedor 40GP
    moq: 1200, // Mínimo 1,200 camisetas
    unitPrice: 4.25, // $4.25 por camiseta
    pricePerContainer: 20400, // $20,400 por contenedor
    currency: 'USD',
    grossWeight: 14800, // 14.8 toneladas
    netWeight: 13200, // 13.2 toneladas
    volume: 64, // 64 m³
    packagingType: 'Empaque individual en bolsas',
    stockContainers: 25, // 25 contenedores en stock
    productionTime: 15, // 15 días
    packagingTime: 2,
    containerType: '40GP',
    incoterm: 'FOB ZLC'
  },
  {
    id: 5, // Auriculares Bluetooth Inalámbricos - Cancelación de Ruido
    unitsPerContainer: 2000, // 2,000 auriculares por contenedor 40GP
    moq: 500, // Mínimo 500 auriculares
    unitPrice: 28.50, // $28.50 por auricular
    pricePerContainer: 57000, // $57,000 por contenedor
    currency: 'USD',
    grossWeight: 15600, // 15.6 toneladas
    netWeight: 13800, // 13.8 toneladas
    volume: 60, // 60 m³
    packagingType: 'Cajas individuales de cartón premium',
    stockContainers: 6, // 6 contenedores en stock
    productionTime: 30, // 30 días (electrónicos más complejos)
    packagingTime: 3,
    containerType: '40GP',
    incoterm: 'FOB ZLC'
  },
  {
    id: 6, // Sillas de Oficina Ergonómicas - Respaldo Alto con Lumbar
    unitsPerContainer: 240, // 240 sillas por contenedor 40GP
    moq: 60, // Mínimo 60 sillas
    unitPrice: 185.00, // $185.00 por silla
    pricePerContainer: 44400, // $44,400 por contenedor
    currency: 'USD',
    grossWeight: 19200, // 19.2 toneladas
    netWeight: 17600, // 17.6 toneladas
    volume: 66, // 66 m³
    packagingType: 'Embalaje desmontado en cajas',
    stockContainers: 4, // 4 contenedores en stock
    productionTime: 35, // 35 días (muebles requieren más tiempo)
    packagingTime: 4,
    containerType: '40GP',
    incoterm: 'FOB ZLC'
  },
  {
    id: 7, // Smartphone Android 12 - Pantalla AMOLED 6.7"
    unitsPerContainer: 1200, // 1,200 smartphones por contenedor 40GP
    moq: 300, // Mínimo 300 smartphones
    unitPrice: 145.00, // $145.00 por smartphone
    pricePerContainer: 174000, // $174,000 por contenedor
    currency: 'USD',
    grossWeight: 8400, // 8.4 toneladas
    netWeight: 7200, // 7.2 toneladas
    volume: 45, // 45 m³
    packagingType: 'Cajas individuales selladas',
    stockContainers: 3, // 3 contenedores en stock (productos de alto valor)
    productionTime: 45, // 45 días (electrónicos complejos)
    packagingTime: 5,
    containerType: '40GP',
    incoterm: 'FOB ZLC'
  }
];

async function updateProducts() {
  console.log('🔄 Actualizando productos con valores realistas...\n');
  
  try {
    for (const update of productUpdates) {
      const { id, ...updateData } = update;
      
      console.log(`📦 Actualizando producto ID ${id}...`);
      
      const updatedProduct = await prisma.product.update({
        where: { id },
        data: updateData
      });
      
      console.log(`✅ Producto ${id} actualizado:`);
      console.log(`   - Unidades por contenedor: ${updateData.unitsPerContainer.toLocaleString()}`);
      console.log(`   - MOQ: ${updateData.moq.toLocaleString()} unidades`);
      console.log(`   - Precio unitario: $${updateData.unitPrice}`);
      console.log(`   - Precio por contenedor: $${updateData.pricePerContainer.toLocaleString()}`);
      console.log(`   - Stock: ${updateData.stockContainers} contenedores`);
      console.log(`   - Tiempo de producción: ${updateData.productionTime} días`);
      console.log(`   - Peso bruto: ${updateData.grossWeight.toLocaleString()} kg`);
      console.log(`   - Volumen: ${updateData.volume} m³\n`);
    }
    
    console.log('🎉 ¡Todos los productos han sido actualizados exitosamente!');
    
    // Verificar los productos actualizados
    console.log('\n📊 Verificando productos actualizados:');
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        unitsPerContainer: true,
        moq: true,
        unitPrice: true,
        pricePerContainer: true,
        stockContainers: true,
        productionTime: true,
        containerType: true,
        incoterm: true
      },
      orderBy: { id: 'asc' }
    });
    
    products.forEach(product => {
      console.log(`\n🏷️  ${product.name}`);
      console.log(`    ID: ${product.id}`);
      console.log(`    Contenedor: ${product.containerType} - ${product.unitsPerContainer?.toLocaleString() || 0} unidades`);
      console.log(`    MOQ: ${product.moq?.toLocaleString() || 0} unidades`);
      console.log(`    Precio unitario: $${product.unitPrice || 0}`);
      console.log(`    Precio por contenedor: $${product.pricePerContainer?.toLocaleString() || 0}`);
      console.log(`    Stock: ${product.stockContainers || 0} contenedores`);
      console.log(`    Producción: ${product.productionTime || 0} días`);
      console.log(`    Términos: ${product.incoterm}`);
    });
    
  } catch (error) {
    console.error('❌ Error actualizando productos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateProducts();
