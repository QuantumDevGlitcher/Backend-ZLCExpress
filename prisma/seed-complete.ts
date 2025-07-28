// ================================================================
// SEED COMPLETO - Base de datos ZLCExpress
// ================================================================
// Script para llenar la base de datos con usuarios y productos de prueba
// Ejecutar con: npx ts-node prisma/seed-complete.ts

import { PrismaClient, UserType, VerificationStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Función para hashear contraseñas
async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

// Usuarios de prueba
const testUsers = [
  // COMPRADORES (BUYERS)
  {
    email: 'buyer@demo.com',
    password: 'demo123',
    userType: UserType.BUYER,
    companyName: 'Distribuidora Central CA',
    taxId: 'CR-3101234567',
    operationCountry: 'Costa Rica',
    industry: 'Distribución y Comercio',
    contactName: 'María José González',
    contactPosition: 'Gerente de Compras',
    contactPhone: '+506-2234-5678',
    fiscalAddress: 'San José, Escazú, Centro Empresarial Plaza Roble',
    country: 'Costa Rica',
    state: 'San José',
    city: 'Escazú',
    postalCode: '10203',
    isVerified: true,
    verificationStatus: VerificationStatus.VERIFIED
  },
  {
    email: 'comprador@guatemala.com',
    password: 'guatemala123',
    userType: UserType.BUYER,
    companyName: 'Importaciones del Norte S.A.',
    taxId: 'GT-12345678',
    operationCountry: 'Guatemala',
    industry: 'Importación y Distribución',
    contactName: 'Carlos Alberto Mendoza',
    contactPosition: 'Director Comercial',
    contactPhone: '+502-2345-6789',
    fiscalAddress: 'Guatemala City, Zona 10, Edificio Centroamérica',
    country: 'Guatemala',
    state: 'Guatemala',
    city: 'Guatemala City',
    postalCode: '01010',
    isVerified: true,
    verificationStatus: VerificationStatus.VERIFIED
  },
  {
    email: 'buyer@colombia.com',
    password: 'colombia123',
    userType: UserType.BUYER,
    companyName: 'Comercial Andina Ltda.',
    taxId: 'CO-900123456',
    operationCountry: 'Colombia',
    industry: 'Comercio al por Mayor',
    contactName: 'Ana Patricia Silva',
    contactPosition: 'Jefe de Compras',
    contactPhone: '+57-1-234-5678',
    fiscalAddress: 'Bogotá, Chapinero, Carrera 13 #85-32',
    country: 'Colombia',
    state: 'Cundinamarca',
    city: 'Bogotá',
    postalCode: '110221',
    isVerified: true,
    verificationStatus: VerificationStatus.VERIFIED
  },

  // PROVEEDORES (SUPPLIERS)
  {
    email: 'supplier@textiles.com',
    password: 'textiles123',
    userType: UserType.SUPPLIER,
    companyName: 'ZLC Textiles International',
    taxId: 'PA-8-123456-789',
    operationCountry: 'Panamá',
    industry: 'Textiles y Confección',
    contactName: 'Roberto Chen',
    contactPosition: 'Gerente de Ventas',
    contactPhone: '+507-430-1234',
    fiscalAddress: 'Zona Libre de Colón, Edificio 125, Oficina 201',
    country: 'Panamá',
    state: 'Colón',
    city: 'Colón',
    postalCode: '1001',
    isVerified: true,
    verificationStatus: VerificationStatus.VERIFIED
  },
  {
    email: 'supplier@electronics.com',
    password: 'electronics123',
    userType: UserType.SUPPLIER,
    companyName: 'Electronics ZLC Corp',
    taxId: 'PA-8-987654-321',
    operationCountry: 'Panamá',
    industry: 'Electrónicos y Tecnología',
    contactName: 'Linda Wu',
    contactPosition: 'Directora Comercial',
    contactPhone: '+507-430-5678',
    fiscalAddress: 'Zona Libre de Colón, Edificio 200, Piso 3',
    country: 'Panamá',
    state: 'Colón',
    city: 'Colón',
    postalCode: '1001',
    isVerified: true,
    verificationStatus: VerificationStatus.VERIFIED
  },
  {
    email: 'supplier@footwear.com',
    password: 'footwear123',
    userType: UserType.SUPPLIER,
    companyName: 'Calzado Premium ZLC',
    taxId: 'PA-8-555666-777',
    operationCountry: 'Panamá',
    industry: 'Calzado y Accesorios',
    contactName: 'Miguel Santos',
    contactPosition: 'Gerente de Exportaciones',
    contactPhone: '+507-430-9999',
    fiscalAddress: 'Zona Libre de Colón, Edificio 150, Local 105',
    country: 'Panamá',
    state: 'Colón',
    city: 'Colón',
    postalCode: '1001',
    isVerified: true,
    verificationStatus: VerificationStatus.VERIFIED
  }
];

// Categorías de productos
const categories = [
  {
    name: 'Textiles y Confección',
    description: 'Ropa, telas y productos textiles para distribución mayorista',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    isActive: true
  },
  {
    name: 'Calzado',
    description: 'Calzado deportivo, formal y casual para todas las edades',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop',
    isActive: true
  },
  {
    name: 'Electrónicos',
    description: 'Dispositivos electrónicos y accesorios tecnológicos',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
    isActive: true
  },
  {
    name: 'Hogar y Decoración',
    description: 'Artículos para el hogar, decoración y muebles',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    isActive: true
  },
  {
    name: 'Belleza y Cuidado Personal',
    description: 'Productos de belleza, cuidado personal y cosméticos',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop',
    isActive: true
  },
  {
    name: 'Deportes y Recreación',
    description: 'Equipos deportivos, fitness y recreación al aire libre',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    isActive: true
  }
];

// Productos de prueba con imágenes
const products = [
  // TEXTILES Y CONFECCIÓN
  {
    title: 'Camisetas Polo Premium - Contenedor Completo',
    description: 'Camisetas polo de algodón 100% de alta calidad. Disponibles en múltiples colores y tallas. Perfectas para distribución retail.',
    categoryName: 'Textiles y Confección',
    supplierEmail: 'supplier@textiles.com',
    price: 12500.00,
    currency: 'USD',
    minQuantity: 1,
    maxQuantity: 5,
    unit: 'Contenedor',
    incoterm: 'FOB',
    originCountry: 'Panamá',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500&h=400&fit=crop'
    ],
    containerType: '40GP',
    unitsPerContainer: 2400,
    moq: 1,
    unitPrice: 5.21,
    pricePerContainer: 12500.00,
    grossWeight: 1200,
    netWeight: 960,
    volume: 65.5,
    packagingType: 'Cajas de cartón con bolsas individuales',
    stockContainers: 15,
    isNegotiable: true,
    allowsCustomOrders: true,
    productionTime: 15,
    packagingTime: 3,
    specifications: {
      'Material': '100% Algodón',
      'Tallas': 'XS, S, M, L, XL, XXL',
      'Colores': 'Blanco, Negro, Azul Marino, Gris, Rojo',
      'Peso por unidad': '180g',
      'Certificaciones': 'OEKO-TEX Standard 100'
    }
  },
  {
    title: 'Jeans Denim Premium - Lote Mayorista',
    description: 'Jeans de denim de alta calidad para hombre y mujer. Cortes modernos y clásicos. Ideal para tiendas de ropa.',
    categoryName: 'Textiles y Confección',
    supplierEmail: 'supplier@textiles.com',
    price: 18750.00,
    currency: 'USD',
    minQuantity: 1,
    maxQuantity: 3,
    unit: 'Contenedor',
    incoterm: 'FOB',
    originCountry: 'Panamá',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=500&h=400&fit=crop'
    ],
    containerType: '40GP',
    unitsPerContainer: 1200,
    moq: 1,
    unitPrice: 15.62,
    pricePerContainer: 18750.00,
    grossWeight: 1800,
    netWeight: 1440,
    volume: 58.3,
    packagingType: 'Cajas individuales con etiquetas',
    stockContainers: 8,
    isNegotiable: true,
    allowsCustomOrders: false,
    productionTime: 20,
    packagingTime: 5,
    specifications: {
      'Material': '98% Algodón, 2% Elastano',
      'Tallas': '28-38 (Hombre), 24-34 (Mujer)',
      'Colores': 'Azul clásico, Negro, Gris oscuro',
      'Cortes': 'Slim fit, Regular fit, Bootcut',
      'Lavado': 'Stone wash, Dark wash'
    }
  },

  // CALZADO
  {
    title: 'Zapatillas Deportivas Multimarca - Contenedor',
    description: 'Zapatillas deportivas de alta calidad para running y lifestyle. Diseños modernos y cómodos para todas las edades.',
    categoryName: 'Calzado',
    supplierEmail: 'supplier@footwear.com',
    price: 22400.00,
    currency: 'USD',
    minQuantity: 1,
    maxQuantity: 4,
    unit: 'Contenedor',
    incoterm: 'FOB',
    originCountry: 'Panamá',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=400&fit=crop'
    ],
    containerType: '40GP',
    unitsPerContainer: 1600,
    moq: 1,
    unitPrice: 14.00,
    pricePerContainer: 22400.00,
    grossWeight: 2200,
    netWeight: 1920,
    volume: 72.0,
    packagingType: 'Cajas individuales con papel de seda',
    stockContainers: 12,
    isNegotiable: true,
    allowsCustomOrders: true,
    productionTime: 25,
    packagingTime: 4,
    specifications: {
      'Material': 'Mesh sintético y EVA',
      'Tallas': '35-46 (Europeo)',
      'Colores': 'Blanco, Negro, Azul, Gris, Rojo',
      'Suela': 'Goma antideslizante',
      'Uso': 'Running, Casual, Fitness'
    }
  },
  {
    title: 'Zapatos Formales Ejecutivos - Lote Premium',
    description: 'Zapatos formales de cuero genuino para ejecutivos. Diseño elegante y durabilidad garantizada.',
    categoryName: 'Calzado',
    supplierEmail: 'supplier@footwear.com',
    price: 28800.00,
    currency: 'USD',
    minQuantity: 1,
    maxQuantity: 2,
    unit: 'Contenedor',
    incoterm: 'FOB',
    originCountry: 'Panamá',
    images: [
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1582897085656-c636d006a246?w=500&h=400&fit=crop'
    ],
    containerType: '20GP',
    unitsPerContainer: 800,
    moq: 1,
    unitPrice: 36.00,
    pricePerContainer: 28800.00,
    grossWeight: 1600,
    netWeight: 1280,
    volume: 28.5,
    packagingType: 'Cajas de lujo con bolsas de tela',
    stockContainers: 6,
    isNegotiable: false,
    allowsCustomOrders: true,
    productionTime: 30,
    packagingTime: 7,
    specifications: {
      'Material': '100% Cuero genuino',
      'Tallas': '38-45 (Europeo)',
      'Colores': 'Negro, Marrón oscuro, Marrón claro',
      'Suela': 'Cuero con goma antideslizante',
      'Acabado': 'Pulido brillante'
    }
  },

  // ELECTRÓNICOS
  {
    title: 'Auriculares Bluetooth Premium - Lote Mayorista',
    description: 'Auriculares inalámbricos con cancelación de ruido y alta calidad de sonido. Batería de larga duración.',
    categoryName: 'Electrónicos',
    supplierEmail: 'supplier@electronics.com',
    price: 19200.00,
    currency: 'USD',
    minQuantity: 1,
    maxQuantity: 6,
    unit: 'Contenedor',
    incoterm: 'FOB',
    originCountry: 'Panamá',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=400&fit=crop'
    ],
    containerType: '20GP',
    unitsPerContainer: 1200,
    moq: 1,
    unitPrice: 16.00,
    pricePerContainer: 19200.00,
    grossWeight: 800,
    netWeight: 720,
    volume: 24.0,
    packagingType: 'Cajas retail con accesorios',
    stockContainers: 20,
    isNegotiable: true,
    allowsCustomOrders: false,
    productionTime: 10,
    packagingTime: 2,
    specifications: {
      'Conectividad': 'Bluetooth 5.0',
      'Batería': '30 horas con estuche',
      'Cancelación de ruido': 'Activa (ANC)',
      'Resistencia': 'IPX4',
      'Colores': 'Negro, Blanco, Azul'
    }
  },
  {
    title: 'Smartwatches Fitness - Contenedor Completo',
    description: 'Relojes inteligentes con monitoreo de salud, GPS y resistencia al agua. Compatibles con iOS y Android.',
    categoryName: 'Electrónicos',
    supplierEmail: 'supplier@electronics.com',
    price: 36000.00,
    currency: 'USD',
    minQuantity: 1,
    maxQuantity: 3,
    unit: 'Contenedor',
    incoterm: 'FOB',
    originCountry: 'Panamá',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=500&h=400&fit=crop'
    ],
    containerType: '20GP',
    unitsPerContainer: 900,
    moq: 1,
    unitPrice: 40.00,
    pricePerContainer: 36000.00,
    grossWeight: 450,
    netWeight: 360,
    volume: 18.0,
    packagingType: 'Cajas premium con cargadores',
    stockContainers: 15,
    isNegotiable: true,
    allowsCustomOrders: true,
    productionTime: 15,
    packagingTime: 3,
    specifications: {
      'Pantalla': '1.4" AMOLED Touch',
      'Batería': '7-10 días',
      'Sensores': 'Cardíaco, SpO2, Acelerómetro',
      'GPS': 'Integrado',
      'Resistencia': '5ATM'
    }
  },

  // HOGAR Y DECORACIÓN
  {
    title: 'Set de Vajillas Premium - Lote Completo',
    description: 'Vajillas de porcelana de alta calidad para 8 personas. Diseño elegante y resistente para uso diario.',
    categoryName: 'Hogar y Decoración',
    supplierEmail: 'supplier@textiles.com',
    price: 24000.00,
    currency: 'USD',
    minQuantity: 1,
    maxQuantity: 4,
    unit: 'Contenedor',
    incoterm: 'FOB',
    originCountry: 'Panamá',
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=400&fit=crop'
    ],
    containerType: '40GP',
    unitsPerContainer: 400,
    moq: 1,
    unitPrice: 60.00,
    pricePerContainer: 24000.00,
    grossWeight: 3200,
    netWeight: 2800,
    volume: 68.0,
    packagingType: 'Cajas acolchadas con separadores',
    stockContainers: 10,
    isNegotiable: true,
    allowsCustomOrders: true,
    productionTime: 20,
    packagingTime: 5,
    specifications: {
      'Material': 'Porcelana reforzada',
      'Piezas por set': '32 piezas (servicio para 8)',
      'Incluye': 'Platos, tazas, platillos, bowls',
      'Diseños': 'Clásico, Moderno, Floral',
      'Apto lavavajillas': 'Sí'
    }
  },

  // BELLEZA Y CUIDADO PERSONAL
  {
    title: 'Kit de Cuidado Facial Completo - Lote Premium',
    description: 'Kits completos de cuidado facial con productos de alta calidad. Incluye limpiador, tónico, crema y protector solar.',
    categoryName: 'Belleza y Cuidado Personal',
    supplierEmail: 'supplier@electronics.com',
    price: 21600.00,
    currency: 'USD',
    minQuantity: 1,
    maxQuantity: 5,
    unit: 'Contenedor',
    incoterm: 'FOB',
    originCountry: 'Panamá',
    images: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&h=400&fit=crop'
    ],
    containerType: '20GP',
    unitsPerContainer: 1800,
    moq: 1,
    unitPrice: 12.00,
    pricePerContainer: 21600.00,
    grossWeight: 900,
    netWeight: 720,
    volume: 22.5,
    packagingType: 'Cajas gift con bolsas de lujo',
    stockContainers: 18,
    isNegotiable: true,
    allowsCustomOrders: false,
    productionTime: 12,
    packagingTime: 3,
    specifications: {
      'Productos incluidos': '4 productos por kit',
      'Tipos de piel': 'Grasa, Seca, Mixta, Sensible',
      'Certificaciones': 'Dermatológicamente testado',
      'Tamaños': '50ml cada producto',
      'Libre de': 'Parabenos, sulfatos'
    }
  },

  // DEPORTES Y RECREACIÓN
  {
    title: 'Equipos de Fitness Completos - Lote Gimnasio',
    description: 'Set completo de equipos de fitness para gimnasios caseros. Incluye mancuernas, bandas elásticas y accesorios.',
    categoryName: 'Deportes y Recreación',
    supplierEmail: 'supplier@footwear.com',
    price: 32000.00,
    currency: 'USD',
    minQuantity: 1,
    maxQuantity: 2,
    unit: 'Contenedor',
    incoterm: 'FOB',
    originCountry: 'Panamá',
    images: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&h=400&fit=crop'
    ],
    containerType: '40GP',
    unitsPerContainer: 200,
    moq: 1,
    unitPrice: 160.00,
    pricePerContainer: 32000.00,
    grossWeight: 4000,
    netWeight: 3600,
    volume: 75.0,
    packagingType: 'Cajas reforzadas con foam protector',
    stockContainers: 5,
    isNegotiable: false,
    allowsCustomOrders: true,
    productionTime: 35,
    packagingTime: 7,
    specifications: {
      'Incluye': 'Mancuernas ajustables, bandas, mat, kettlebell',
      'Peso máximo': '50kg por set de mancuernas',
      'Materiales': 'Acero recubierto, goma antideslizante',
      'Certificaciones': 'ISO 9001',
      'Garantía': '2 años'
    }
  }
];

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  try {
    // 1. Limpiar datos existentes
    console.log('🧹 Limpiando datos existentes...');
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    // 2. Crear usuarios de prueba
    console.log('👥 Creando usuarios de prueba...');
    const createdUsers = [];
    
    for (const userData of testUsers) {
      const hashedPassword = await hashPassword(userData.password);
      const user = await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword
        }
      });
      createdUsers.push(user);
      console.log(`✅ Usuario creado: ${user.email} (${user.userType})`);
    }

    // 3. Crear categorías
    console.log('📂 Creando categorías...');
    const createdCategories = [];
    
    for (const categoryData of categories) {
      const category = await prisma.category.create({
        data: categoryData
      });
      createdCategories.push(category);
      console.log(`✅ Categoría creada: ${category.name}`);
    }

    // 4. Crear productos con imágenes
    console.log('📦 Creando productos con imágenes...');
    
    for (const productData of products) {
      // Encontrar la categoría correspondiente
      const category = createdCategories.find(c => c.name === productData.categoryName);
      if (!category) {
        console.log(`❌ Categoría no encontrada: ${productData.categoryName}`);
        continue;
      }

      // Encontrar el proveedor correspondiente
      const supplier = createdUsers.find(u => u.email === productData.supplierEmail);
      if (!supplier) {
        console.log(`❌ Proveedor no encontrado: ${productData.supplierEmail}`);
        continue;
      }

      const product = await prisma.product.create({
        data: {
          title: productData.title,
          description: productData.description,
          categoryId: category.id,
          supplierId: supplier.id,
          price: productData.price,
          currency: productData.currency,
          minQuantity: productData.minQuantity,
          maxQuantity: productData.maxQuantity,
          unit: productData.unit,
          incoterm: productData.incoterm,
          originCountry: productData.originCountry,
          images: productData.images,
          containerType: productData.containerType,
          unitsPerContainer: productData.unitsPerContainer,
          moq: productData.moq,
          unitPrice: productData.unitPrice,
          pricePerContainer: productData.pricePerContainer,
          grossWeight: productData.grossWeight,
          netWeight: productData.netWeight,
          volume: productData.volume,
          packagingType: productData.packagingType,
          stockContainers: productData.stockContainers,
          isNegotiable: productData.isNegotiable,
          allowsCustomOrders: productData.allowsCustomOrders,
          productionTime: productData.productionTime,
          packagingTime: productData.packagingTime,
          specifications: productData.specifications,
          isActive: true
        }
      });

      console.log(`✅ Producto creado: ${product.title} (ID: ${product.id})`);
    }

    console.log('\n🎉 ¡Seed completado exitosamente!');
    console.log('\n📋 USUARIOS DE PRUEBA CREADOS:');
    console.log('\n🛒 COMPRADORES (BUYERS):');
    console.log('📧 buyer@demo.com | 🔑 demo123 | 🏢 Distribuidora Central CA (Costa Rica)');
    console.log('📧 comprador@guatemala.com | 🔑 guatemala123 | 🏢 Importaciones del Norte S.A. (Guatemala)');
    console.log('📧 buyer@colombia.com | 🔑 colombia123 | 🏢 Comercial Andina Ltda. (Colombia)');
    
    console.log('\n🏭 PROVEEDORES (SUPPLIERS):');
    console.log('📧 supplier@textiles.com | 🔑 textiles123 | 🏢 ZLC Textiles International');
    console.log('📧 supplier@electronics.com | 🔑 electronics123 | 🏢 Electronics ZLC Corp');
    console.log('📧 supplier@footwear.com | 🔑 footwear123 | 🏢 Calzado Premium ZLC');

    console.log('\n📊 ESTADÍSTICAS:');
    console.log(`👥 Usuarios creados: ${createdUsers.length}`);
    console.log(`📂 Categorías creadas: ${createdCategories.length}`);
    console.log(`📦 Productos creados: ${products.length}`);
    console.log(`🖼️  Total de imágenes: ${products.reduce((total, p) => total + p.images.length, 0)}`);

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('❌ Error fatal:', e);
    process.exit(1);
  });
