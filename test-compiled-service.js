// Probando ProductService directamente desde el archivo compilado
const { ProductService } = require('./dist/services/productService');

async function testCompiledProductService() {
  try {
    console.log('🧪 Probando ProductService compilado...\n');
    
    const result = await ProductService.getAllProducts({
      page: 1,
      limit: 3,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    
    console.log('📊 Resultado del ProductService:');
    console.log(`   success: ${result.success}`);
    console.log(`   total: ${result.total}`);
    console.log(`   products length: ${result.products?.length || 0}`);
    
    if (result.success && result.products && result.products.length > 0) {
      console.log('\n📦 Primer producto:');
      const product = result.products[0];
      console.log(`   ID: ${product.id}`);
      console.log(`   name: "${product.name}"`);
      console.log(`   name type: ${typeof product.name}`);
      console.log(`   description: "${product.description?.substring(0, 50)}..."`);
      console.log(`   pricePerContainer: ${product.pricePerContainer}`);
      console.log(`   unitsPerContainer: ${product.unitsPerContainer}`);
      console.log(`   moq: ${product.moq}`);
      console.log(`   stockContainers: ${product.stockContainers}`);
      console.log(`   isNegotiable: ${product.isNegotiable}`);
      console.log(`   totalViews: ${product.totalViews}`);
      console.log(`   images: ${product.images?.length || 0} imágenes`);
      console.log(`   category: ${product.category?.name || 'Sin categoría'}`);
      console.log(`   supplier: ${product.supplier?.companyName || 'Sin proveedor'}`);
      
      // Verificar formato del precio
      const priceAsNumber = Number(product.pricePerContainer);
      const priceFormatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(priceAsNumber);
      
      console.log(`\n💰 Formato de precio:`);
      console.log(`   Original: ${product.pricePerContainer}`);
      console.log(`   Como número: ${priceAsNumber}`);
      console.log(`   Formateado: ${priceFormatted}`);
      
      if (product.name && product.name !== 'undefined' && product.name.trim() !== '') {
        console.log('\n🎉 ¡ÉXITO! El ProductService devuelve nombres correctos');
        console.log('✅ El problema podría estar en el servidor o en el frontend');
      } else {
        console.log('\n❌ PROBLEMA: ProductService aún devuelve nombre undefined');
      }
      
      // Mostrar estructura completa del primer producto
      console.log('\n📋 Estructura completa del producto:');
      console.log(JSON.stringify(product, null, 2));
      
    } else {
      console.log('❌ No se obtuvieron productos o error en ProductService');
      console.log(result);
    }
    
  } catch (error) {
    console.error('❌ Error probando ProductService:', error);
  }
}

testCompiledProductService();
