async function testProductsAPI() {
  try {
    console.log('🧪 Probando API de productos...');
    
    const response = await fetch('http://localhost:3000/api/products');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log('📡 Respuesta del API:');
    console.log('- Success:', data.success);
    console.log('- Total productos:', data.total);
    console.log('- Cantidad de productos devueltos:', data.products?.length);
    
    if (data.products && data.products.length > 0) {
      console.log('\n📦 Primeros 3 productos con sus nombres:');
      data.products.slice(0, 3).forEach((product, index) => {
        console.log(`\n${index + 1}. ID: ${product.id}`);
        console.log(`   Nombre: "${product.name}"`);
        console.log(`   Descripción: "${product.description?.substring(0, 50)}..."`);
        console.log(`   Precio: $${product.pricePerContainer}`);
        console.log(`   Imágenes: ${product.images?.length || 0} imágenes`);
        if (product.images && product.images.length > 0) {
          console.log(`   Primera imagen: ${product.images[0]}`);
        }
      });
    } else {
      console.log('❌ No se encontraron productos');
    }
    
  } catch (error) {
    console.error('❌ Error probando API:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Asegúrate de que el backend esté corriendo en puerto 3000');
      console.log('   Ejecuta: npm run dev en Backend-ZLCExpress');
    }
  }
}

testProductsAPI();
