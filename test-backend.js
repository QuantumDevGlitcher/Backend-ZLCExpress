const axios = require('axios');

async function testBackend() {
  try {
    console.log('🔍 Probando conexión con el backend...');
    
    // Probar endpoint de productos
    const response = await axios.get('http://localhost:3000/api/products');
    
    console.log('✅ Backend respondió correctamente!');
    console.log('📊 Datos recibidos:');
    console.log(`- Success: ${response.data.success}`);
    console.log(`- Total productos: ${response.data.total || 'N/A'}`);
    console.log(`- Productos encontrados: ${response.data.products?.length || 0}`);
    
    if (response.data.products && response.data.products.length > 0) {
      console.log('\n📦 Primeros productos:');
      response.data.products.slice(0, 3).forEach(product => {
        console.log(`- ${product.name} (ID: ${product.id})`);
      });
    }
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Backend no está corriendo en puerto 3000');
      console.log('💡 Asegúrate de ejecutar: npm run dev');
    } else {
      console.log('❌ Error:', error.message);
    }
  }
}

// Esperar un poco y luego probar
setTimeout(testBackend, 3000);
