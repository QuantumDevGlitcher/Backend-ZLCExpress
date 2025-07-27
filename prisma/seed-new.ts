// ================================================================
// SCRIPT DE SEED - Datos de ejemplo para ZLCExpress
// ================================================================
// Descripción: Script para poblar la base de datos con categorías y productos de ejemplo
// Fecha: 2025-07-27

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando proceso de seed...');

  try {
    // Limpiar datos existentes (opcional)
    console.log('🧹 Limpiando datos existentes...');
    await prisma.orderDetail.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.userSession.deleteMany();
    await prisma.authLog.deleteMany();
    await prisma.user.deleteMany();
    console.log('✅ Datos limpiados');

    // ================================================================
    // CREAR USUARIOS SUPPLIERS
    // ================================================================
    console.log('👥 Creando usuarios suppliers...');
    
    const hashedPassword = await bcrypt.hash('password123', 12);

    const suppliers = await Promise.all([
      prisma.user.create({
        data: {
          email: 'supplier1@chinafactory.com',
          password: hashedPassword,
          companyName: 'Guangzhou Manufacturing Co. Ltd',
          taxId: 'CN91440101MA5CU2XJ',
          operationCountry: 'China',
          industry: 'Electronics',
          contactName: 'Li Wei',
          contactPosition: 'Export Manager',
          contactPhone: '+86-20-8888-9999',
          fiscalAddress: 'Guangzhou Industrial Park, Building A',
          country: 'China',
          state: 'Guangdong',
          city: 'Guangzhou',
          postalCode: '510000',
          isVerified: true,
          verificationStatus: 'VERIFIED',
          userType: 'SUPPLIER'
        }
      }),
      
      prisma.user.create({
        data: {
          email: 'supplier2@textilesupplier.com',
          password: hashedPassword,
          companyName: 'Hangzhou Textile Industries',
          taxId: 'CN91330100MA2G2LK8',
          operationCountry: 'China',
          industry: 'Textiles',
          contactName: 'Zhang Ming',
          contactPosition: 'Sales Director',
          contactPhone: '+86-571-8888-7777',
          fiscalAddress: 'Hangzhou Economic Zone, Block C',
          country: 'China',
          state: 'Zhejiang',
          city: 'Hangzhou',
          postalCode: '310000',
          isVerified: true,
          verificationStatus: 'VERIFIED',
          userType: 'SUPPLIER'
        }
      }),

      prisma.user.create({
        data: {
          email: 'supplier3@homefurniture.com',
          password: hashedPassword,
          companyName: 'Foshan Furniture Exports Ltd',
          taxId: 'CN91440600MA4UW9T2',
          operationCountry: 'China',
          industry: 'Furniture',
          contactName: 'Chen Hui',
          contactPosition: 'International Sales',
          contactPhone: '+86-757-8888-6666',
          fiscalAddress: 'Foshan Furniture City, Building 15',
          country: 'China',
          state: 'Guangdong',
          city: 'Foshan',
          postalCode: '528000',
          isVerified: true,
          verificationStatus: 'VERIFIED',
          userType: 'SUPPLIER'
        }
      }),

      prisma.user.create({
        data: {
          email: 'supplier4@beautyproducts.com',
          password: hashedPassword,
          companyName: 'Shenzhen Beauty Manufacturing',
          taxId: 'CN91440300MA5DR6UY',
          operationCountry: 'China',
          industry: 'Cosmetics',
          contactName: 'Wang Lei',
          contactPosition: 'Export Coordinator',
          contactPhone: '+86-755-8888-5555',
          fiscalAddress: 'Shenzhen High-Tech Park, Tower B',
          country: 'China',
          state: 'Guangdong',
          city: 'Shenzhen',
          postalCode: '518000',
          isVerified: true,
          verificationStatus: 'VERIFIED',
          userType: 'SUPPLIER'
        }
      }),

      // Crear un usuario buyer de ejemplo
      prisma.user.create({
        data: {
          email: 'buyer@importcompany.com',
          password: hashedPassword,
          companyName: 'Global Import Solutions LLC',
          taxId: 'US123456789',
          operationCountry: 'United States',
          industry: 'Import/Export',
          contactName: 'John Smith',
          contactPosition: 'Procurement Manager',
          contactPhone: '+1-555-123-4567',
          fiscalAddress: '123 Business Street, Suite 100',
          country: 'United States',
          state: 'California',
          city: 'Los Angeles',
          postalCode: '90210',
          isVerified: true,
          verificationStatus: 'VERIFIED',
          userType: 'BUYER'
        }
      })
    ]);

    console.log(`✅ Creados ${suppliers.length} usuarios`);

    // ================================================================
    // CREAR CATEGORÍAS
    // ================================================================
    console.log('📂 Creando categorías...');

    // Categorías principales
    const electronicsCategory = await prisma.category.create({
      data: {
        name: 'Electrónicos',
        description: 'Dispositivos electrónicos y gadgets tecnológicos',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
        sortOrder: 1
      }
    });

    const textileCategory = await prisma.category.create({
      data: {
        name: 'Textiles',
        description: 'Ropa, telas y productos textiles',
        image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400',
        sortOrder: 2
      }
    });

    const furnitureCategory = await prisma.category.create({
      data: {
        name: 'Muebles',
        description: 'Muebles para hogar y oficina',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
        sortOrder: 3
      }
    });

    const beautyCategory = await prisma.category.create({
      data: {
        name: 'Belleza y Cuidado Personal',
        description: 'Productos de belleza, cosméticos y cuidado personal',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
        sortOrder: 4
      }
    });

    const toysCategory = await prisma.category.create({
      data: {
        name: 'Juguetes',
        description: 'Juguetes y productos para niños',
        image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400',
        sortOrder: 5
      }
    });

    // Subcategorías de Electrónicos
    const smartphonesSubcat = await prisma.category.create({
      data: {
        name: 'Smartphones',
        description: 'Teléfonos inteligentes y accesorios',
        parentId: electronicsCategory.id,
        sortOrder: 1
      }
    });

    const headphonesSubcat = await prisma.category.create({
      data: {
        name: 'Auriculares',
        description: 'Auriculares y equipos de audio',
        parentId: electronicsCategory.id,
        sortOrder: 2
      }
    });

    // Subcategorías de Textiles
    const clothingSubcat = await prisma.category.create({
      data: {
        name: 'Ropa',
        description: 'Ropa para hombres, mujeres y niños',
        parentId: textileCategory.id,
        sortOrder: 1
      }
    });

    const bagsSubcat = await prisma.category.create({
      data: {
        name: 'Bolsas y Maletas',
        description: 'Bolsas, maletas y accesorios de viaje',
        parentId: textileCategory.id,
        sortOrder: 2
      }
    });

    console.log('✅ Categorías creadas');

    // ================================================================
    // CREAR PRODUCTOS
    // ================================================================
    console.log('📦 Creando productos...');

    const products = await Promise.all([
      // Productos de Electrónicos
      prisma.product.create({
        data: {
          title: 'Smartphone Android 12 - Pantalla AMOLED 6.7"',
          description: 'Smartphone de alta gama con pantalla AMOLED de 6.7 pulgadas, procesador octa-core, 8GB RAM, 256GB almacenamiento, cámara triple 108MP + 12MP + 5MP, batería 5000mAh con carga rápida 65W. Incluye cargador, cable USB-C y protector de pantalla.',
          categoryId: smartphonesSubcat.id,
          supplierId: suppliers[0].id,
          price: 145.50,
          currency: 'USD',
          minQuantity: 50,
          maxQuantity: 10000,
          unit: 'piezas',
          incoterm: 'FOB',
          originCountry: 'China',
          images: [
            'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
            'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
            'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500'
          ],
          specifications: {
            containerType: '40GP',
            unitsPerContainer: 2000,
            moq: 50,
            pricePerContainer: 291000,
            grossWeight: 12000,
            netWeight: 10000,
            volume: 65,
            packagingType: 'Individual retail boxes',
            stockContainers: 15,
            productionTime: 15,
            packagingTime: 5,
            colors: ['Negro', 'Blanco', 'Azul', 'Rosa'],
            sizes: ['6.7 pulgadas'],
            materials: ['Aluminio', 'Vidrio Gorilla Glass'],
            tags: ['smartphone', 'android', 'alta gama', 'cámara'],
            volumeDiscounts: [
              { minQuantity: 100, discount: 2 },
              { minQuantity: 500, discount: 5 },
              { minQuantity: 1000, discount: 8 }
            ]
          }
        }
      }),

      prisma.product.create({
        data: {
          title: 'Auriculares Bluetooth Inalámbricos - Cancelación de Ruido',
          description: 'Auriculares over-ear premium con cancelación activa de ruido, conectividad Bluetooth 5.2, batería de 30 horas, carga rápida USB-C, controles táctiles intuitivos y micrófono integrado para llamadas. Incluye estuche de transporte.',
          categoryId: headphonesSubcat.id,
          supplierId: suppliers[0].id,
          price: 28.75,
          currency: 'USD',
          minQuantity: 100,
          maxQuantity: 20000,
          unit: 'piezas',
          incoterm: 'FOB',
          originCountry: 'China',
          images: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
            'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500',
            'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500'
          ],
          specifications: {
            containerType: '40GP',
            unitsPerContainer: 3500,
            moq: 100,
            pricePerContainer: 100625,
            grossWeight: 8500,
            netWeight: 7000,
            volume: 62,
            packagingType: 'Gift boxes with foam inserts',
            stockContainers: 8,
            productionTime: 12,
            packagingTime: 3,
            colors: ['Negro', 'Blanco', 'Gris', 'Azul Marino'],
            sizes: ['Talla Única'],
            materials: ['Plástico ABS', 'Espuma Memory', 'Cuero PU'],
            tags: ['auriculares', 'bluetooth', 'cancelación ruido', 'wireless'],
            volumeDiscounts: [
              { minQuantity: 200, discount: 3 },
              { minQuantity: 1000, discount: 7 },
              { minQuantity: 2000, discount: 12 }
            ]
          }
        }
      }),

      // Productos de Textiles
      prisma.product.create({
        data: {
          title: 'Camisetas de Algodón 100% - Colección Básica Unisex',
          description: 'Camisetas de algodón 100% premium, corte unisex, cuello redondo, manga corta. Tela pre-encogida de 180gsm, costuras reforzadas, etiquetas personalizables. Disponible en múltiples colores y tallas. Ideal para personalización y reventa.',
          categoryId: clothingSubcat.id,
          supplierId: suppliers[1].id,
          price: 3.25,
          currency: 'USD',
          minQuantity: 500,
          maxQuantity: 50000,
          unit: 'piezas',
          incoterm: 'FOB',
          originCountry: 'China',
          images: [
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
            'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500',
            'https://images.unsplash.com/photo-1583743814966-8936f37f4044?w=500'
          ],
          specifications: {
            containerType: '40GP',
            unitsPerContainer: 8000,
            moq: 500,
            pricePerContainer: 26000,
            grossWeight: 9600,
            netWeight: 8000,
            volume: 60,
            packagingType: 'Polybags with size stickers',
            stockContainers: 25,
            productionTime: 20,
            packagingTime: 5,
            colors: ['Blanco', 'Negro', 'Gris', 'Azul Marino', 'Rojo', 'Verde'],
            sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
            materials: ['Algodón 100%'],
            tags: ['camiseta', 'algodón', 'básica', 'unisex', 'personalizable'],
            volumeDiscounts: [
              { minQuantity: 1000, discount: 5 },
              { minQuantity: 5000, discount: 10 },
              { minQuantity: 10000, discount: 15 }
            ]
          }
        }
      }),

      prisma.product.create({
        data: {
          title: 'Mochilas Escolares Impermeables - Diseño Ergonómico',
          description: 'Mochilas escolares de alta calidad con diseño ergonómico, compartimento principal acolchado para laptop hasta 15.6", bolsillos organizadores, material impermeable Oxford 600D, tirantes acolchados ajustables, respaldo transpirable.',
          categoryId: bagsSubcat.id,
          supplierId: suppliers[1].id,
          price: 12.80,
          currency: 'USD',
          minQuantity: 200,
          maxQuantity: 15000,
          unit: 'piezas',
          incoterm: 'FOB',
          originCountry: 'China',
          images: [
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
            'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=500',
            'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=500'
          ],
          specifications: {
            containerType: '40GP',
            unitsPerContainer: 2000,
            moq: 200,
            pricePerContainer: 25600,
            grossWeight: 11000,
            netWeight: 9000,
            volume: 58,
            packagingType: 'Individual polybags',
            stockContainers: 12,
            productionTime: 18,
            packagingTime: 4,
            colors: ['Negro', 'Azul', 'Gris', 'Rosa', 'Verde'],
            sizes: ['30x45x15 cm'],
            materials: ['Oxford 600D', 'Poliéster', 'Foam acolchado'],
            tags: ['mochila', 'escolar', 'impermeable', 'laptop', 'ergonómica'],
            volumeDiscounts: [
              { minQuantity: 500, discount: 4 },
              { minQuantity: 1000, discount: 8 },
              { minQuantity: 3000, discount: 12 }
            ]
          }
        }
      }),

      // Productos de Muebles
      prisma.product.create({
        data: {
          title: 'Sillas de Oficina Ergonómicas - Respaldo Alto con Lumbar',
          description: 'Sillas ejecutivas de oficina con diseño ergonómico, respaldo alto con soporte lumbar ajustable, asiento acolchado de espuma memory, reposabrazos ajustables, base de 5 ruedas, mecanismo de inclinación, altura regulable 42-52cm.',
          categoryId: furnitureCategory.id,
          supplierId: suppliers[2].id,
          price: 89.50,
          currency: 'USD',
          minQuantity: 50,
          maxQuantity: 2000,
          unit: 'piezas',
          incoterm: 'FOB',
          originCountry: 'China',
          images: [
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
            'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=500',
            'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500'
          ],
          specifications: {
            containerType: '40GP',
            unitsPerContainer: 280,
            moq: 50,
            pricePerContainer: 25060,
            grossWeight: 14000,
            netWeight: 12000,
            volume: 64,
            packagingType: 'KD packing in cartons',
            stockContainers: 6,
            productionTime: 25,
            packagingTime: 7,
            colors: ['Negro', 'Gris', 'Azul Marino', 'Marrón'],
            sizes: ['110-120cm altura total'],
            materials: ['Malla transpirable', 'Espuma Memory', 'Acero', 'Nylon'],
            tags: ['silla oficina', 'ergonómica', 'ejecutiva', 'lumbar', 'ajustable'],
            volumeDiscounts: [
              { minQuantity: 100, discount: 5 },
              { minQuantity: 300, discount: 10 },
              { minQuantity: 500, discount: 15 }
            ]
          }
        }
      }),

      // Productos de Belleza
      prisma.product.create({
        data: {
          title: 'Set de Brochas de Maquillaje Profesional - 24 Piezas',
          description: 'Set profesional de 24 brochas de maquillaje con cerdas sintéticas de alta calidad, mangos ergonómicos de madera, férulas de aluminio. Incluye brochas para base, polvo, colorete, sombras, cejas y labios. Viene con estuche organizador.',
          categoryId: beautyCategory.id,
          supplierId: suppliers[3].id,
          price: 8.90,
          currency: 'USD',
          minQuantity: 300,
          maxQuantity: 25000,
          unit: 'sets',
          incoterm: 'FOB',
          originCountry: 'China',
          images: [
            'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500',
            'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500',
            'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500'
          ],
          specifications: {
            containerType: '40GP',
            unitsPerContainer: 4500,
            moq: 300,
            pricePerContainer: 40050,
            grossWeight: 9000,
            netWeight: 7500,
            volume: 55,
            packagingType: 'Gift boxes with foam inserts',
            stockContainers: 18,
            productionTime: 15,
            packagingTime: 5,
            colors: ['Rosa Gold', 'Negro', 'Plata', 'Marrón Natural'],
            sizes: ['24 piezas por set'],
            materials: ['Cerdas sintéticas', 'Madera', 'Aluminio'],
            tags: ['brochas', 'maquillaje', 'profesional', 'set', 'belleza'],
            volumeDiscounts: [
              { minQuantity: 500, discount: 3 },
              { minQuantity: 2000, discount: 8 },
              { minQuantity: 5000, discount: 15 }
            ]
          }
        }
      }),

      // Productos de Juguetes
      prisma.product.create({
        data: {
          title: 'Bloques de Construcción Educativos - 1000 Piezas',
          description: 'Set de bloques de construcción educativos de 1000 piezas, compatible con LEGO, material ABS no tóxico, colores vibrantes, incluye manual de instrucciones con 50 modelos diferentes, desarrolla creatividad y habilidades motoras.',
          categoryId: toysCategory.id,
          supplierId: suppliers[0].id,
          price: 15.75,
          currency: 'USD',
          minQuantity: 200,
          maxQuantity: 10000,
          unit: 'sets',
          incoterm: 'FOB',
          originCountry: 'China',
          images: [
            'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=500',
            'https://images.unsplash.com/photo-1594736797933-d0e501ba2fe8?w=500',
            'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=500'
          ],
          specifications: {
            containerType: '40GP',
            unitsPerContainer: 1800,
            moq: 200,
            pricePerContainer: 28350,
            grossWeight: 12600,
            netWeight: 10800,
            volume: 61,
            packagingType: 'Color boxes with display window',
            stockContainers: 10,
            productionTime: 20,
            packagingTime: 6,
            colors: ['Multicolor'],
            sizes: ['1000 piezas'],
            materials: ['ABS no tóxico'],
            tags: ['bloques', 'construcción', 'educativo', 'lego compatible', 'niños'],
            volumeDiscounts: [
              { minQuantity: 400, discount: 4 },
              { minQuantity: 1000, discount: 9 },
              { minQuantity: 2500, discount: 14 }
            ]
          }
        }
      })
    ]);

    console.log(`✅ Creados ${products.length} productos`);

    // ================================================================
    // ESTADÍSTICAS FINALES
    // ================================================================
    const categoriesCount = await prisma.category.count();
    const productsCount = await prisma.product.count();
    const usersCount = await prisma.user.count();

    console.log('\n🎉 ¡Seed completado exitosamente!');
    console.log('📊 Estadísticas:');
    console.log(`   👥 Usuarios: ${usersCount}`);
    console.log(`   📂 Categorías: ${categoriesCount}`);
    console.log(`   📦 Productos: ${productsCount}`);
    console.log('\n🔐 Credenciales de acceso:');
    console.log('   Email: supplier1@chinafactory.com');
    console.log('   Email: buyer@importcompany.com');
    console.log('   Password: password123');

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Error ejecutando el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
