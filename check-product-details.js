const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkProductDetails() {
  console.log('🔍 Verificando productos con detalles completos...\n');

  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        supplier: true
      },
      orderBy: { id: 'asc' }
    });

    console.log(`📊 Total de productos encontrados: ${products.length}\n`);

    products.forEach((product, index) => {
      console.log(`🏷️  PRODUCTO ${index + 1}: ${product.title}`);
      console.log(`   📂 Categoría: ${product.category?.name || 'Sin categoría'}`);
      console.log(`   🏭 Proveedor: ${product.supplier?.companyName || 'Sin proveedor'}`);
      console.log(`   📦 Contenedor: ${product.containerType} - ${product.unitsPerContainer?.toLocaleString() || 0} unidades`);
      console.log(`   💰 Precio por contenedor: $${product.pricePerContainer?.toLocaleString() || 0}`);
      console.log(`   💵 Precio unitario: $${product.unitPrice || 0}`);
      console.log(`   📝 MOQ: ${product.moq?.toLocaleString() || 0} unidades`);
      console.log(`   📦 Stock: ${product.stockContainers || 0} contenedores`);
      console.log(`   ⚖️  Peso bruto: ${product.grossWeight?.toLocaleString() || 0} kg`);
      console.log(`   📐 Volumen: ${product.volume || 0} m³`);
      console.log(`   🚛 Incoterm: ${product.incoterm}`);
      console.log(`   ⏱️  Tiempo producción: ${product.productionTime || 0} días`);
      console.log(`   📋 Empaque: ${product.packagingType || 'No especificado'}`);
      console.log(`   💸 Negociable: ${product.isNegotiable ? 'Sí' : 'No'}`);
      console.log(`   🎨 Personalizable: ${product.allowsCustomOrders ? 'Sí' : 'No'}`);
      console.log(`   👁️  Vistas: ${product.totalViews || 0} | Consultas: ${product.totalInquiries || 0}`);
      console.log(`   🆔 ID: ${product.id} | Estado: ${product.isActive ? 'Activo' : 'Inactivo'}`);
      console.log('');
    });

    // Resumen por categorías
    console.log('📊 RESUMEN POR CATEGORÍAS:');
    const categoryStats = {};
    products.forEach(product => {
      const categoryName = product.category?.name || 'Sin categoría';
      if (!categoryStats[categoryName]) {
        categoryStats[categoryName] = {
          count: 0,
          totalValue: 0,
          totalStock: 0
        };
      }
      categoryStats[categoryName].count++;
      categoryStats[categoryName].totalValue += Number(product.pricePerContainer || 0);
      categoryStats[categoryName].totalStock += product.stockContainers || 0;
    });

    Object.entries(categoryStats).forEach(([category, stats]) => {
      console.log(`   ${category}: ${stats.count} productos, ${stats.totalStock} contenedores, $${stats.totalValue.toLocaleString()} valor total`);
    });

    // Resumen de precios
    console.log('\n💰 RESUMEN DE PRECIOS:');
    const prices = products.map(p => Number(p.pricePerContainer || 0)).filter(p => p > 0);
    if (prices.length > 0) {
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
      console.log(`   Precio mínimo por contenedor: $${minPrice.toLocaleString()}`);
      console.log(`   Precio máximo por contenedor: $${maxPrice.toLocaleString()}`);
      console.log(`   Precio promedio por contenedor: $${avgPrice.toLocaleString()}`);
    }

    // Resumen de stock
    console.log('\n📦 RESUMEN DE STOCK:');
    const totalContainers = products.reduce((sum, p) => sum + (p.stockContainers || 0), 0);
    const totalUnits = products.reduce((sum, p) => sum + ((p.stockContainers || 0) * (p.unitsPerContainer || 0)), 0);
    const totalValue = products.reduce((sum, p) => sum + ((p.stockContainers || 0) * Number(p.pricePerContainer || 0)), 0);
    
    console.log(`   Total contenedores en stock: ${totalContainers.toLocaleString()}`);
    console.log(`   Total unidades disponibles: ${totalUnits.toLocaleString()}`);
    console.log(`   Valor total del inventario: $${totalValue.toLocaleString()}`);

    console.log('\n✅ Verificación completada exitosamente!');

  } catch (error) {
    console.error('❌ Error verificando productos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProductDetails();
