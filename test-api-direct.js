// Test directo de la API para ver qué devuelve
async function testAPIDirectly() {
  try {
    console.log('🧪 Probando API directamente...');
    
    const response = await fetch('http://localhost:3000/api/products?limit=3');
    const data = await response.json();
    
    console.log('📡 Respuesta completa de la API:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.products && data.products.length > 0) {
      console.log('\n📦 Primer producto detallado:');
      const product = data.products[0];
      console.log(`   ID: ${product.id}`);
      console.log(`   name: "${product.name}"`);
      console.log(`   name es undefined: ${product.name === undefined}`);
      console.log(`   name es "undefined": ${product.name === "undefined"}`);
      console.log(`   description: "${product.description}"`);
      console.log(`   pricePerContainer: ${product.pricePerContainer}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testAPIDirectly();
