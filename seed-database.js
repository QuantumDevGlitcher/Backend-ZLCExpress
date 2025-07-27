const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Iniciando seed de la base de datos...\n');

  // 1. Crear usuarios (incluyendo proveedores y compradores)
  console.log('👥 Creando usuarios...');
  const users = [
    {
      email: 'admin@zlcexpress.com',
      password: await bcrypt.hash('admin123', 12),
      companyName: 'ZLC Express',
      taxId: 'ZLC-001',
      operationCountry: 'China',
      industry: 'Logística',
      contactName: 'Admin ZLC',
      contactPosition: 'Administrator',
      contactPhone: '+86-123-456-7890',
      fiscalAddress: '123 Main St',
      country: 'China',
      state: 'Guangdong',
      city: 'Guangzhou',
      postalCode: '510000',
      isVerified: true,
      verificationStatus: 'VERIFIED',
      userType: 'BOTH'
    },
    {
      email: 'supplier@textiles.com',
      password: await bcrypt.hash('supplier123', 12),
      companyName: 'Guangzhou Manufacturing Co. Ltd',
      taxId: 'GMC-001',
      operationCountry: 'China',
      industry: 'Textiles',
      contactName: 'Li Wei',
      contactPosition: 'Export Manager',
      contactPhone: '+86-123-456-7891',
      fiscalAddress: '456 Factory Ave',
      country: 'China',
      state: 'Guangdong',
      city: 'Guangzhou',
      postalCode: '510001',
      isVerified: true,
      verificationStatus: 'VERIFIED',
      userType: 'SUPPLIER'
    },
    {
      email: 'electronics@techsupplier.com',
      password: await bcrypt.hash('tech123', 12),
      companyName: 'Shenzhen Electronics Ltd',
      taxId: 'SEL-001',
      operationCountry: 'China',
      industry: 'Electronics',
      contactName: 'Wang Ming',
      contactPosition: 'Sales Director',
      contactPhone: '+86-123-456-7892',
      fiscalAddress: '789 Tech Park',
      country: 'China',
      state: 'Guangdong',
      city: 'Shenzhen',
      postalCode: '518000',
      isVerified: true,
      verificationStatus: 'VERIFIED',
      userType: 'SUPPLIER'
    },
    {
      email: 'furniture@officechina.com',
      password: await bcrypt.hash('furniture123', 12),
      companyName: 'Foshan Furniture Exports',
      taxId: 'FFE-001',
      operationCountry: 'China',
      industry: 'Furniture',
      contactName: 'Chen Lu',
      contactPosition: 'Export Manager',
      contactPhone: '+86-123-456-7893',
      fiscalAddress: '321 Furniture Blvd',
      country: 'China',
      state: 'Guangdong',
      city: 'Foshan',
      postalCode: '528000',
      isVerified: true,
      verificationStatus: 'VERIFIED',
      userType: 'SUPPLIER'
    },
    {
      email: 'importadora@empresa.com',
      password: await bcrypt.hash('importadora123', 12),
      companyName: 'Importadora Global S.A.',
      taxId: 'IG-001',
      operationCountry: 'Colombia',
      industry: 'Importación',
      contactName: 'Carlos Rodriguez',
      contactPosition: 'Gerente General',
      contactPhone: '+57-1-234-5678',
      fiscalAddress: 'Calle 72 # 10-34',
      country: 'Colombia',
      state: 'Cundinamarca',
      city: 'Bogotá',
      postalCode: '110111',
      isVerified: true,
      verificationStatus: 'VERIFIED',
      userType: 'BUYER'
    }
  ];

  const createdUsers = [];
  for (const userData of users) {
    try {
      const user = await prisma.user.create({ data: userData });
      createdUsers.push(user);
      console.log(`✅ Usuario creado: ${user.email} (${user.userType})`);
    } catch (error) {
      console.log(`⚠️  Usuario ya existe: ${userData.email}`);
    }
  }

  // 2. Crear categorías
  console.log('\n📂 Creando categorías...');
  const categories = [
    { name: 'Electrónicos', description: 'Dispositivos electrónicos y componentes', isActive: true, sortOrder: 1 },
    { name: 'Textiles y Ropa', description: 'Productos textiles y prendas de vestir', isActive: true, sortOrder: 2 },
    { name: 'Muebles y Decoración', description: 'Mobiliario y artículos decorativos', isActive: true, sortOrder: 3 },
    { name: 'Belleza y Cuidado Personal', description: 'Productos de belleza y cuidado', isActive: true, sortOrder: 4 },
    { name: 'Juguetes y Entretenimiento', description: 'Juguetes educativos y de entretenimiento', isActive: true, sortOrder: 5 },
    { name: 'Tecnología', description: 'Productos tecnológicos avanzados', isActive: true, sortOrder: 6 },
    { name: 'Audio y Video', description: 'Equipos de audio y video', isActive: true, sortOrder: 7 },
    { name: 'Accesorios y Complementos', description: 'Accesorios varios', isActive: true, sortOrder: 8 },
    { name: 'Deportes y Tiempo Libre', description: 'Artículos deportivos y recreativos', isActive: true, sortOrder: 9 }
  ];

  const createdCategories = [];
  for (const categoryData of categories) {
    try {
      const category = await prisma.category.create({ data: categoryData });
      createdCategories.push(category);
      console.log(`✅ Categoría creada: ${category.name}`);
    } catch (error) {
      console.log(`⚠️  Categoría ya existe: ${categoryData.name}`);
    }
  }

  // 3. Crear productos con valores realistas
  console.log('\n📦 Creando productos con valores completos...');
  
  // Encontrar usuarios proveedores
  const suppliers = await prisma.user.findMany({
    where: { userType: { in: ['SUPPLIER', 'BOTH'] } }
  });

  // Encontrar categorías
  const allCategories = await prisma.category.findMany();

  const products = [
    {
      title: 'Bloques de Construcción Educativos - 1000 Piezas',
      description: 'Set de bloques de construcción educativos compatible con LEGO, ideal para desarrollo cognitivo y creatividad. Incluye 1000 piezas de diferentes formas y colores.',
      categoryId: allCategories.find(c => c.name === 'Juguetes y Entretenimiento')?.id || 1,
      supplierId: suppliers.find(s => s.companyName.includes('Guangzhou'))?.id || 1,
      price: 8.50,
      currency: 'USD',
      minQuantity: 600,
      maxQuantity: 10000,
      unit: 'Set',
      incoterm: 'FOB ZLC',
      originCountry: 'China',
      images: ['/api/placeholder/400/300'],
      specifications: {
        piezas: 1000,
        material: 'ABS plástico',
        edad_recomendada: '3+ años',
        certificaciones: ['CE', 'EN71', 'CPSIA']
      },
      // Nuevos campos específicos
      containerType: '40GP',
      unitsPerContainer: 2400,
      moq: 600,
      unitPrice: 8.50,
      pricePerContainer: 20400,
      grossWeight: 18500, // 18.5 toneladas
      netWeight: 16800,   // 16.8 toneladas
      volume: 65.0,       // 65 m³
      packagingType: 'Cajas de cartón individuales',
      stockContainers: 15,
      isNegotiable: true,
      allowsCustomOrders: true,
      productionTime: 25,
      packagingTime: 3,
      totalViews: 156,
      totalInquiries: 23
    },
    {
      title: 'Mochilas Escolares Impermeables - Diseño Ergonómico',
      description: 'Mochilas escolares de alta calidad con diseño ergonómico y materiales impermeables. Perfectas para estudiantes de todas las edades.',
      categoryId: allCategories.find(c => c.name === 'Deportes y Tiempo Libre')?.id || 2,
      supplierId: suppliers.find(s => s.companyName.includes('Guangzhou'))?.id || 1,
      price: 12.75,
      currency: 'USD',
      minQuantity: 450,
      maxQuantity: 8000,
      unit: 'Pieza',
      incoterm: 'FOB ZLC',
      originCountry: 'China',
      images: ['/api/placeholder/400/300'],
      specifications: {
        material: 'Nylon 600D',
        capacidad: '30L',
        caracteristicas: ['Impermeable', 'Ergonómico', 'Compartimentos múltiples']
      },
      containerType: '40GP',
      unitsPerContainer: 1800,
      moq: 450,
      unitPrice: 12.75,
      pricePerContainer: 22950,
      grossWeight: 16200,
      netWeight: 14500,
      volume: 62.0,
      packagingType: 'Bolsas individuales de plástico',
      stockContainers: 8,
      isNegotiable: false,
      allowsCustomOrders: true,
      productionTime: 20,
      packagingTime: 2,
      totalViews: 203,
      totalInquiries: 34
    },
    {
      title: 'Set de Brochas de Maquillaje Profesional - 24 Piezas',
      description: 'Set profesional de 24 brochas de maquillaje con cerdas sintéticas de alta calidad y mango ergonómico.',
      categoryId: allCategories.find(c => c.name === 'Belleza y Cuidado Personal')?.id || 3,
      supplierId: suppliers.find(s => s.companyName.includes('Shenzhen'))?.id || 2,
      price: 15.80,
      currency: 'USD',
      minQuantity: 900,
      maxQuantity: 15000,
      unit: 'Set',
      incoterm: 'FOB ZLC',
      originCountry: 'China',
      images: ['/api/placeholder/400/300'],
      specifications: {
        piezas: 24,
        material_cerdas: 'Sintético premium',
        material_mango: 'Madera de bambú',
        incluye: 'Estuche portátil'
      },
      containerType: '40GP',
      unitsPerContainer: 3600,
      moq: 900,
      unitPrice: 15.80,
      pricePerContainer: 56880,
      grossWeight: 12400,
      netWeight: 10800,
      volume: 58.0,
      packagingType: 'Estuches individuales con ventana',
      stockContainers: 12,
      isNegotiable: true,
      allowsCustomOrders: false,
      productionTime: 18,
      packagingTime: 2,
      totalViews: 342,
      totalInquiries: 67
    },
    {
      title: 'Camisetas de Algodón 100% - Colección Básica Unisex',
      description: 'Camisetas básicas unisex de algodón 100%, perfectas para personalización y uso diario. Disponibles en múltiples colores y tallas.',
      categoryId: allCategories.find(c => c.name === 'Textiles y Ropa')?.id || 4,
      supplierId: suppliers.find(s => s.companyName.includes('Guangzhou'))?.id || 1,
      price: 4.25,
      currency: 'USD',
      minQuantity: 1200,
      maxQuantity: 20000,
      unit: 'Pieza',
      incoterm: 'FOB ZLC',
      originCountry: 'China',
      images: ['/api/placeholder/400/300'],
      specifications: {
        material: '100% Algodón',
        peso: '180 GSM',
        colores: ['Blanco', 'Negro', 'Gris', 'Azul marino', 'Rojo'],
        tallas: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
      },
      containerType: '40GP',
      unitsPerContainer: 4800,
      moq: 1200,
      unitPrice: 4.25,
      pricePerContainer: 20400,
      grossWeight: 14800,
      netWeight: 13200,
      volume: 64.0,
      packagingType: 'Empaque individual en bolsas',
      stockContainers: 25,
      isNegotiable: false,
      allowsCustomOrders: true,
      productionTime: 15,
      packagingTime: 2,
      totalViews: 189,
      totalInquiries: 45
    },
    {
      title: 'Auriculares Bluetooth Inalámbricos - Cancelación de Ruido',
      description: 'Auriculares over-ear premium con cancelación activa de ruido, conectividad Bluetooth 5.0 y batería de larga duración.',
      categoryId: allCategories.find(c => c.name === 'Audio y Video')?.id || 5,
      supplierId: suppliers.find(s => s.companyName.includes('Shenzhen'))?.id || 2,
      price: 28.50,
      currency: 'USD',
      minQuantity: 500,
      maxQuantity: 8000,
      unit: 'Pieza',
      incoterm: 'FOB ZLC',
      originCountry: 'China',
      images: ['/api/placeholder/400/300'],
      specifications: {
        conectividad: 'Bluetooth 5.0',
        bateria: '30 horas',
        caracteristicas: ['Cancelación activa de ruido', 'Carga rápida', 'Micrófono integrado'],
        colores: ['Negro', 'Blanco', 'Azul']
      },
      containerType: '40GP',
      unitsPerContainer: 2000,
      moq: 500,
      unitPrice: 28.50,
      pricePerContainer: 57000,
      grossWeight: 15600,
      netWeight: 13800,
      volume: 60.0,
      packagingType: 'Cajas individuales de cartón premium',
      stockContainers: 6,
      isNegotiable: true,
      allowsCustomOrders: false,
      productionTime: 30,
      packagingTime: 3,
      totalViews: 567,
      totalInquiries: 89
    },
    {
      title: 'Sillas de Oficina Ergonómicas - Respaldo Alto con Lumbar',
      description: 'Sillas ejecutivas de oficina con diseño ergonómico, respaldo alto con soporte lumbar y materiales de alta calidad.',
      categoryId: allCategories.find(c => c.name === 'Muebles y Decoración')?.id || 6,
      supplierId: suppliers.find(s => s.companyName.includes('Foshan'))?.id || 3,
      price: 185.00,
      currency: 'USD',
      minQuantity: 60,
      maxQuantity: 1000,
      unit: 'Pieza',
      incoterm: 'FOB ZLC',
      originCountry: 'China',
      images: ['/api/placeholder/400/300'],
      specifications: {
        material_tapiceria: 'Cuero PU premium',
        base: 'Aluminio con ruedas',
        caracteristicas: ['Soporte lumbar', 'Reposabrazos ajustables', 'Reclinación 135°'],
        peso_maximo: '150 kg'
      },
      containerType: '40GP',
      unitsPerContainer: 240,
      moq: 60,
      unitPrice: 185.00,
      pricePerContainer: 44400,
      grossWeight: 19200,
      netWeight: 17600,
      volume: 66.0,
      packagingType: 'Embalaje desmontado en cajas',
      stockContainers: 4,
      isNegotiable: true,
      allowsCustomOrders: true,
      productionTime: 35,
      packagingTime: 4,
      totalViews: 234,
      totalInquiries: 56
    },
    {
      title: 'Smartphone Android 12 - Pantalla AMOLED 6.7"',
      description: 'Smartphone de alta gama con pantalla AMOLED de 6.7 pulgadas, procesador octa-core y cámara principal de 48MP.',
      categoryId: allCategories.find(c => c.name === 'Tecnología')?.id || 7,
      supplierId: suppliers.find(s => s.companyName.includes('Shenzhen'))?.id || 2,
      price: 145.00,
      currency: 'USD',
      minQuantity: 300,
      maxQuantity: 5000,
      unit: 'Pieza',
      incoterm: 'FOB ZLC',
      originCountry: 'China',
      images: ['/api/placeholder/400/300'],
      specifications: {
        pantalla: '6.7" AMOLED',
        procesador: 'Octa-core 2.4GHz',
        memoria: '8GB RAM + 256GB',
        camara: '48MP + 12MP + 5MP',
        bateria: '5000mAh',
        os: 'Android 12'
      },
      containerType: '40GP',
      unitsPerContainer: 1200,
      moq: 300,
      unitPrice: 145.00,
      pricePerContainer: 174000,
      grossWeight: 8400,
      netWeight: 7200,
      volume: 45.0,
      packagingType: 'Cajas individuales selladas',
      stockContainers: 3,
      isNegotiable: false,
      allowsCustomOrders: false,
      productionTime: 45,
      packagingTime: 5,
      totalViews: 891,
      totalInquiries: 134
    }
  ];

  const createdProducts = [];
  for (const productData of products) {
    try {
      const product = await prisma.product.create({ data: productData });
      createdProducts.push(product);
      console.log(`✅ Producto creado: ${product.title}`);
      console.log(`   - Precio por contenedor: $${product.pricePerContainer.toLocaleString()}`);
      console.log(`   - Unidades por contenedor: ${product.unitsPerContainer.toLocaleString()}`);
      console.log(`   - MOQ: ${product.moq.toLocaleString()}`);
      console.log(`   - Stock: ${product.stockContainers} contenedores`);
    } catch (error) {
      console.log(`⚠️  Error creando producto: ${productData.title}`, error.message);
    }
  }

  console.log('\n📊 Resumen del seed:');
  console.log(`✅ Usuarios creados: ${createdUsers.length}`);
  console.log(`✅ Categorías creadas: ${createdCategories.length}`);
  console.log(`✅ Productos creados: ${createdProducts.length}`);
  
  console.log('\n🎉 ¡Seed completado exitosamente!');
  console.log('\n📋 Datos de prueba disponibles:');
  console.log('👤 Usuarios para login:');
  console.log('   - admin@zlcexpress.com / admin123 (BOTH)');
  console.log('   - supplier@textiles.com / supplier123 (SUPPLIER)');
  console.log('   - importadora@empresa.com / importadora123 (BUYER)');
  console.log('\n📦 Productos con precios reales por contenedor:');
  
  for (const product of createdProducts) {
    console.log(`   - ${product.title}`);
    console.log(`     💰 $${product.pricePerContainer.toLocaleString()} por contenedor (${product.unitsPerContainer.toLocaleString()} unidades)`);
    console.log(`     📦 MOQ: ${product.moq.toLocaleString()} | Stock: ${product.stockContainers} contenedores`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
