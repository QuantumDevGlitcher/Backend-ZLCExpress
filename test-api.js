const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log('🔍 Probando endpoint de productos...');
    
    const response = await fetch('http://localhost:3000/api/products');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ API Response:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('❌ Error al conectar con la API:', error.message);
    console.log('💡 Asegúrate de que el backend esté corriendo en puerto 3000');
  }
}

testAPI();
