// Debug API response
fetch('http://localhost:3000/api/products')
  .then(response => response.json())
  .then(data => {
    console.log('🔍 Respuesta completa del API:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.products && data.products.length > 0) {
      console.log('\n📦 Primer producto en detalle:');
      console.log(JSON.stringify(data.products[0], null, 2));
    }
  })
  .catch(error => {
    console.error('❌ Error al conectar con el API:', error);
    console.log('💡 Asegúrate de que el backend esté corriendo en puerto 3000');
  });
