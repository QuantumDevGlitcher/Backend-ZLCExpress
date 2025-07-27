const fetch = require('node-fetch');

async function testProductsAPI() {
  console.log('🌐 Probando API de productos...\n');

  try {
    // Probar el endpoint de productos
    const response = await fetch('http://localhost:3000/api/products');
    
    if (!response.ok) {
      console.log(`❌ Error HTTP: ${response.status} ${response.statusText}`);
      return;
    }

    const data = await response.json();
    
    console.log('📊 Respuesta de la API:');
    console.log(`Success: ${data.success}`);
    console.log(`Total productos: ${data.total}`);
    console.log(`Productos en respuesta: ${data.products?.length || 0}\n`);

    if (data.products && data.products.length > 0) {
      console.log('📦 Productos encontrados:');
      
      data.products.forEach((product, index) => {
        console.log(`\n${index + 1}. ${product.name || 'Sin nombre'}`);
        console.log(`   ID: ${product.id}`);
        console.log(`   Descripción: ${product.description || 'Sin descripción'}`);
        console.log(`   Precio contenedor: $${product.pricePerContainer?.toLocaleString() || 0}`);
        console.log(`   Precio unitario: $${product.unitPrice || 0}`);
        console.log(`   Unidades/contenedor: ${product.unitsPerContainer?.toLocaleString() || 0}`);
        console.log(`   MOQ: ${product.moq?.toLocaleString() || 0}`);
        console.log(`   Stock: ${product.stockContainers || 0} contenedores`);
        console.log(`   Imágenes: ${product.images?.length || 0} disponibles`);
        if (product.images && product.images.length > 0) {
          console.log(`   Primera imagen: ${product.images[0]}`);
        }
        console.log(`   Proveedor: ${product.supplier?.companyName || 'Sin proveedor'}`);
        console.log(`   Categoría: ${product.category?.name || 'Sin categoría'}`);
        console.log(`   Estado: ${product.status || 'Sin estado'}`);
      });
    } else {
      console.log('⚠️  No se encontraron productos en la respuesta');
    }

  } catch (error) {
    console.error('❌ Error probando la API:', error.message);
    console.log('\n💡 Posibles causas:');
    console.log('   - El servidor backend no está ejecutándose en puerto 3000');
    console.log('   - Problema de conectividad');
    console.log('   - Error en el endpoint');
    
    console.log('\n🔧 Para solucionarlo:');
    console.log('   1. Ejecuta: npm run dev (en Backend-ZLCExpress)');
    console.log('   2. Verifica que el puerto 3000 esté libre');
    console.log('   3. Revisa los logs del servidor');
  }
}

testProductsAPI();
