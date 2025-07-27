const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Copia simplificada del ProductService.getAllProducts
async function testProductService() {
  try {
    console.log('🧪 Probando ProductService directamente...\n');
    
    const filters = {
      page: 1,
      limit: 3,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };

    const {
      page = 1,
      limit = 20,
      search,
      category,
      priceMin,
      priceMax,
      containerType,
      incoterm,
      isNegotiable,
      allowsCustomOrders,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filters || {};

    // Construir filtros dinámicos
    const where = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (category) {
      where.categoryId = parseInt(category);
    }

    if (priceMin !== undefined) {
      where.pricePerContainer = { ...where.pricePerContainer, gte: priceMin };
    }

    if (priceMax !== undefined) {
      where.pricePerContainer = { ...where.pricePerContainer, lte: priceMax };
    }

    if (containerType && containerType !== 'all') {
      where.containerType = containerType;
    }

    if (incoterm && incoterm !== 'all') {
      where.incoterm = incoterm;
    }

    // Calcular offset para paginación
    const skip = (page - 1) * limit;

    // Ordenamiento
    const orderBy = {};
    if (sortBy === 'pricePerContainer') {
      orderBy.pricePerContainer = sortOrder;
    } else if (sortBy === 'name') {
      orderBy.title = sortOrder;
    } else {
      orderBy[sortBy] = sortOrder;
    }

    // Ejecutar consultas
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
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
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.product.count({ where })
    ]);

    console.log(`📦 Productos encontrados: ${products.length}`);
    console.log(`📊 Total en DB: ${total}\n`);

    // Transformar datos para el frontend (como en ProductService)
    const transformedProducts = products.map((product) => {
      const specs = product.specifications || {};
      
      return {
        id: product.id,
        name: product.title,
        description: product.description,
        categoryId: product.categoryId,
        supplierId: product.supplierId,
        unitPrice: product.unitPrice || product.price,
        currency: product.currency,
        minQuantity: product.minQuantity,
        maxQuantity: product.maxQuantity,
        unit: product.unit,
        incoterm: product.incoterm,
        originCountry: product.originCountry,
        images: product.images || [],
        specifications: product.specifications,
        status: 'active',
        isPublished: true,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        
        // Usar campos directos de la tabla
        containerType: product.containerType || '40GP',
        unitsPerContainer: product.unitsPerContainer || 0,
        pricePerContainer: product.pricePerContainer || 0,
        grossWeight: product.grossWeight || 0,
        netWeight: product.netWeight || 0,
        volume: product.volume || 0,
        packagingType: product.packagingType || '',
        stockContainers: product.stockContainers || 0,
        productionTime: product.productionTime || 0,
        packagingTime: product.packagingTime || 0,
        moq: product.moq || product.minQuantity,
        colors: specs.colors || [],
        sizes: specs.sizes || [],
        materials: specs.materials || [],
        tags: specs.tags || [],
        volumeDiscounts: specs.volumeDiscounts || [],
        
        // Usar campos directos de la tabla
        isNegotiable: product.isNegotiable || false,
        allowsCustomOrders: product.allowsCustomOrders || false,
        totalViews: product.totalViews || 0,
        totalInquiries: product.totalInquiries || 0,
        
        // Datos del supplier
        supplier: product.supplier ? {
          id: product.supplier.id,
          companyName: product.supplier.companyName,
          isVerified: product.supplier.isVerified,
          location: `${product.supplier.city}, ${product.supplier.country}`
        } : null,
        
        // Datos de la categoría
        category: product.category
      };
    });

    console.log('🔍 RESULTADOS TRANSFORMADOS:');
    transformedProducts.forEach((product, index) => {
      console.log(`\n${index + 1}. ID: ${product.id}`);
      console.log(`   name: "${product.name}"`);
      console.log(`   description: "${product.description?.substring(0, 50)}..."`);
      console.log(`   pricePerContainer: $${product.pricePerContainer}`);
      console.log(`   unitsPerContainer: ${product.unitsPerContainer}`);
      console.log(`   images: ${product.images?.length || 0} imágenes`);
      console.log(`   categoria: ${product.category?.name || 'Sin categoría'}`);
      console.log(`   supplier: ${product.supplier?.companyName || 'Sin proveedor'}`);
    });

    const result = {
      success: true,
      products: transformedProducts,
      total
    };

    console.log('\n🎯 RESULTADO FINAL:');
    console.log(`success: ${result.success}`);
    console.log(`total: ${result.total}`);
    console.log(`products.length: ${result.products.length}`);
    console.log(`Primer producto name: "${result.products[0]?.name}"`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testProductService();
