const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugProductMapping() {
  try {
    console.log('🔍 Debuggeando mapeo de productos...\n');
    
    // Obtener producto directo de base de datos
    const rawProduct = await prisma.product.findFirst({
      where: { id: 7 },
      include: {
        category: true,
        supplier: {
          select: {
            id: true,
            companyName: true,
            isVerified: true,
            country: true,
            city: true
          }
        }
      }
    });

    console.log('📦 Producto RAW desde base de datos:');
    console.log(`   ID: ${rawProduct.id}`);
    console.log(`   title: "${rawProduct.title}"`);
    console.log(`   title type: ${typeof rawProduct.title}`);
    console.log(`   description: "${rawProduct.description?.substring(0, 50)}..."`);
    console.log(`   pricePerContainer: ${rawProduct.pricePerContainer}`);
    console.log(`   unitsPerContainer: ${rawProduct.unitsPerContainer}`);
    console.log(`   moq: ${rawProduct.moq}`);
    console.log(`   stockContainers: ${rawProduct.stockContainers}`);
    console.log(`   images: ${rawProduct.images?.length || 0} imágenes`);

    // Simular exactamente el mapeo del ProductService
    const specs = rawProduct.specifications || {};
    
    const transformedProduct = {
      id: rawProduct.id,
      name: rawProduct.title,
      description: rawProduct.description,
      categoryId: rawProduct.categoryId,
      supplierId: rawProduct.supplierId,
      unitPrice: rawProduct.unitPrice || rawProduct.price,
      currency: rawProduct.currency,
      minQuantity: rawProduct.minQuantity,
      maxQuantity: rawProduct.maxQuantity,
      unit: rawProduct.unit,
      incoterm: rawProduct.incoterm,
      originCountry: rawProduct.originCountry,
      images: rawProduct.images || [],
      specifications: rawProduct.specifications,
      status: 'active',
      isPublished: true,
      createdAt: rawProduct.createdAt,
      updatedAt: rawProduct.updatedAt,
      
      // Usar campos directos de la tabla
      containerType: rawProduct.containerType || '40GP',
      unitsPerContainer: rawProduct.unitsPerContainer || 0,
      pricePerContainer: rawProduct.pricePerContainer || 0,
      grossWeight: rawProduct.grossWeight || 0,
      netWeight: rawProduct.netWeight || 0,
      volume: rawProduct.volume || 0,
      packagingType: rawProduct.packagingType || '',
      stockContainers: rawProduct.stockContainers || 0,
      productionTime: rawProduct.productionTime || 0,
      packagingTime: rawProduct.packagingTime || 0,
      moq: rawProduct.moq || rawProduct.minQuantity,
      colors: specs.colors || [],
      sizes: specs.sizes || [],
      materials: specs.materials || [],
      tags: specs.tags || [],
      volumeDiscounts: specs.volumeDiscounts || [],
      
      // Usar campos directos de la tabla
      isNegotiable: rawProduct.isNegotiable || false,
      allowsCustomOrders: rawProduct.allowsCustomOrders || false,
      totalViews: rawProduct.totalViews || 0,
      totalInquiries: rawProduct.totalInquiries || 0,
      
      // Datos del supplier
      supplier: rawProduct.supplier ? {
        id: rawProduct.supplier.id,
        companyName: rawProduct.supplier.companyName,
        isVerified: rawProduct.supplier.isVerified,
        location: `${rawProduct.supplier.city}, ${rawProduct.supplier.country}`
      } : null,
      
      // Datos de la categoría
      category: rawProduct.category
    };

    console.log('\n🔄 Producto TRANSFORMADO:');
    console.log(`   ID: ${transformedProduct.id}`);
    console.log(`   name: "${transformedProduct.name}"`);
    console.log(`   name type: ${typeof transformedProduct.name}`);
    console.log(`   description: "${transformedProduct.description?.substring(0, 50)}..."`);
    console.log(`   pricePerContainer: ${transformedProduct.pricePerContainer}`);
    console.log(`   unitsPerContainer: ${transformedProduct.unitsPerContainer}`);
    console.log(`   moq: ${transformedProduct.moq}`);
    console.log(`   stockContainers: ${transformedProduct.stockContainers}`);
    console.log(`   images: ${transformedProduct.images?.length || 0} imágenes`);

    console.log('\n📊 COMPARACIÓN:');
    console.log(`   rawProduct.title: "${rawProduct.title}"`);
    console.log(`   transformedProduct.name: "${transformedProduct.name}"`);
    console.log(`   Son iguales: ${rawProduct.title === transformedProduct.name}`);

    // Verificar formato de precio
    console.log('\n💰 FORMATO DE PRECIO:');
    console.log(`   pricePerContainer RAW: ${rawProduct.pricePerContainer} (tipo: ${typeof rawProduct.pricePerContainer})`);
    console.log(`   pricePerContainer TRANSFORMADO: ${transformedProduct.pricePerContainer} (tipo: ${typeof transformedProduct.pricePerContainer})`);
    
    // Si es Decimal de Prisma, convertir a número
    const priceAsNumber = Number(transformedProduct.pricePerContainer);
    const priceFormatted = priceAsNumber.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    
    console.log(`   pricePerContainer como número: ${priceAsNumber}`);
    console.log(`   pricePerContainer formateado: ${priceFormatted}`);

    console.log('\n🎯 RESULTADO ESPERADO PARA FRONTEND:');
    console.log(JSON.stringify({
      id: transformedProduct.id,
      name: transformedProduct.name,
      pricePerContainer: priceAsNumber,
      priceFormatted: priceFormatted,
      unitsPerContainer: transformedProduct.unitsPerContainer,
      moq: transformedProduct.moq
    }, null, 2));

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugProductMapping();
