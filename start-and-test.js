// Iniciar servidor desde JavaScript compilado
const { exec } = require('child_process');

console.log('🚀 Iniciando servidor desde JavaScript compilado...');

const process = exec('node dist/app.js', (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ Error ejecutando servidor: ${error}`);
    return;
  }
  if (stderr) {
    console.error(`⚠️ stderr: ${stderr}`);
  }
  console.log(`✅ stdout: ${stdout}`);
});

process.stdout.on('data', (data) => {
  console.log(data.toString());
});

process.stderr.on('data', (data) => {
  console.error(data.toString());
});

console.log('🔄 Servidor iniciado en background. Esperando 3 segundos...');

setTimeout(() => {
  console.log('✅ Servidor debería estar listo. Probando API...');
  
  // Test de la API
  const testAPI = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/products');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      console.log('\n📡 Respuesta del API después de reiniciar:');
      console.log('- Success:', data.success);
      console.log('- Total productos:', data.total);
      
      if (data.products && data.products.length > 0) {
        console.log('\n📦 Primer producto:');
        const product = data.products[0];
        console.log(`   ID: ${product.id}`);
        console.log(`   Nombre: "${product.name}"`);
        console.log(`   Descripción: "${product.description?.substring(0, 50)}..."`);
        console.log(`   Precio: $${product.pricePerContainer}`);
        console.log(`   Unidades: ${product.unitsPerContainer}`);
        console.log(`   MOQ: ${product.moq}`);
        console.log(`   Stock: ${product.stockContainers} contenedores`);
        
        if (product.name && product.name !== 'undefined') {
          console.log('\n🎉 ¡ÉXITO! Los nombres ahora se muestran correctamente');
        } else {
          console.log('\n❌ PROBLEMA: El nombre sigue siendo undefined');
        }
      }
    } catch (error) {
      console.error('\n❌ Error probando API:', error.message);
    }
  };
  
  testAPI();
}, 3000);
