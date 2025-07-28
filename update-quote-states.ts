// Script para actualizar estados de cotizaciones para testing
// Ejecutar con: npx ts-node update-quote-states.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateQuoteStates() {
  try {
    console.log('🔄 Iniciando actualización de estados de cotizaciones para testing...');

    // Obtener todas las cotizaciones existentes
    const quotes = await prisma.quote.findMany({
      include: {
        buyer: true,
        supplier: true,
        quoteItems: true
      },
      orderBy: { id: 'asc' }
    });

    console.log(`📋 Cotizaciones encontradas: ${quotes.length}`);

    if (quotes.length === 0) {
      console.log('❌ No hay cotizaciones en la base de datos');
      return;
    }

    // Actualizar estados de forma variada para testing
    for (let i = 0; i < quotes.length; i++) {
      const quote = quotes[i];
      let newStatus: string;
      let supplierComment: string | null = null;

      // Asignar estados de forma cíclica para tener variedad
      switch (i % 5) {
        case 0:
          newStatus = 'PENDING';
          break;
        case 1:
          newStatus = 'COUNTER_OFFER';
          supplierComment = `Ofrecemos un descuento del 5% por el volumen. Precio final: $${(Number(quote.totalPrice) * 0.95).toFixed(2)}`;
          break;
        case 2:
          newStatus = 'ACCEPTED';
          supplierComment = 'Cotización aprobada. Procedemos con la preparación del pedido.';
          break;
        case 3:
          newStatus = 'REJECTED';
          supplierComment = 'No podemos cumplir con las condiciones de pago solicitadas en este momento.';
          break;
        case 4:
          newStatus = 'QUOTED';
          supplierComment = 'Hemos revisado su solicitud y confirmamos disponibilidad del producto.';
          break;
        default:
          newStatus = 'PENDING';
      }

      // Preparar datos de actualización
      const updateData: any = {
        status: newStatus as any,
        updatedAt: new Date()
      };

      // Si es contraoferta, actualizar precio
      if (newStatus === 'COUNTER_OFFER') {
        updateData.totalPrice = Number(quote.totalPrice) * 0.95; // 5% descuento
        updateData.supplierComments = supplierComment;
      } else if (supplierComment) {
        updateData.supplierComments = supplierComment;
      }

      // Si es aceptada, establecer fecha de aceptación
      if (newStatus === 'ACCEPTED') {
        updateData.acceptedAt = new Date();
      }

      // Ejecutar actualización individual
      await prisma.quote.update({
        where: { id: quote.id },
        data: updateData
      });

      console.log(`📝 Cotización ${quote.quoteNumber} -> ${newStatus}`);

      // Crear comentario en la tabla de comentarios si existe
      if (supplierComment) {
        try {
          await prisma.quoteComment.create({
            data: {
              quoteId: quote.id,
              userId: quote.supplierId,
              userType: 'SUPPLIER',
              comment: supplierComment,
              status: newStatus as any
            }
          });
          console.log(`💬 Comentario agregado para ${quote.quoteNumber}`);
        } catch (commentError) {
          console.warn(`⚠️ Error agregando comentario para ${quote.quoteNumber}:`, commentError);
        }
      }
    }

    console.log('✅ Estados de cotizaciones actualizados exitosamente!');

    // Mostrar resumen final
    const statusCounts = await prisma.quote.groupBy({
      by: ['status'],
      _count: { id: true }
    });

    console.log('\n📊 Resumen de estados:');
    statusCounts.forEach((count: any) => {
      console.log(`   ${count.status}: ${count._count.id} cotizaciones`);
    });

    // Obtener algunas cotizaciones de ejemplo para mostrar
    console.log('\n🔍 Ejemplos de cotizaciones actualizadas:');
    const exampleQuotes = await prisma.quote.findMany({
      take: 3,
      include: {
        buyer: { select: { companyName: true } },
        supplier: { select: { companyName: true } }
      }
    });

    exampleQuotes.forEach((quote: any) => {
      console.log(`   ${quote.quoteNumber} - ${quote.status} - $${quote.totalPrice}`);
      if (quote.supplierComments) {
        console.log(`     💬 "${quote.supplierComments}"`);
      }
    });

  } catch (error) {
    console.error('❌ Error actualizando estados:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Función adicional para crear cotizaciones de prueba si no existen
async function createTestQuotesIfEmpty() {
  try {
    const quotesCount = await prisma.quote.count();
    
    if (quotesCount === 0) {
      console.log('📝 No hay cotizaciones, creando algunas de prueba...');

      // Buscar o crear usuario buyer
      let buyer = await prisma.user.findFirst({
        where: { userType: 'BUYER' }
      });

      if (!buyer) {
        buyer = await prisma.user.create({
          data: {
            email: 'buyer@zlcexpress.com',
            password: 'temp_password',
            companyName: 'Empresa Compradora Test',
            taxId: 'BUY001',
            operationCountry: 'Panama',
            industry: 'Import/Export',
            contactName: 'Juan Comprador',
            contactPosition: 'Gerente de Compras',
            contactPhone: '+507-1234-5678',
            fiscalAddress: 'Zona Libre de Colón, Panamá',
            country: 'Panama',
            state: 'Colón',
            city: 'Colón',
            postalCode: '12345',
            userType: 'BUYER'
          }
        });
      }

      // Buscar o crear usuario supplier
      let supplier = await prisma.user.findFirst({
        where: { userType: 'SUPPLIER' }
      });

      if (!supplier) {
        supplier = await prisma.user.create({
          data: {
            email: 'supplier@zlcexpress.com',
            password: 'temp_password',
            companyName: 'Proveedor ZLC Express',
            taxId: 'SUP001',
            operationCountry: 'Panama',
            industry: 'Manufacturing',
            contactName: 'Maria Proveedora',
            contactPosition: 'Gerente de Ventas',
            contactPhone: '+507-8765-4321',
            fiscalAddress: 'Zona Libre de Colón, Panamá',
            country: 'Panama',
            state: 'Colón',
            city: 'Colón',
            postalCode: '12345',
            userType: 'SUPPLIER'
          }
        });
      }

      // Crear cotizaciones de prueba
      const testQuotes = [
        {
          productTitle: 'Camisetas Premium Algodón',
          totalPrice: 30750,
          containerQuantity: 2
        },
        {
          productTitle: 'Calzado Deportivo Premium',
          totalPrice: 28250,
          containerQuantity: 1
        },
        {
          productTitle: 'Electrónicos para Hogar',
          totalPrice: 135750,
          containerQuantity: 3
        },
        {
          productTitle: 'Productos de Belleza',
          totalPrice: 32250,
          containerQuantity: 1
        },
        {
          productTitle: 'Sillas de Oficina Ergonómicas',
          totalPrice: 47100,
          containerQuantity: 1
        }
      ];

      for (let i = 0; i < testQuotes.length; i++) {
        const testData = testQuotes[i];
        
        const quote = await prisma.quote.create({
          data: {
            quoteNumber: `Q-TEST-${Date.now()}-${i}`,
            buyerId: buyer.id,
            supplierId: supplier.id,
            productTitle: testData.productTitle,
            containerQuantity: testData.containerQuantity,
            containerType: '40GP',
            totalPrice: testData.totalPrice,
            currency: 'USD',
            status: 'PENDING',
            paymentTerms: 'Net 30 days',
            logisticsComments: 'Cotización de prueba generada automáticamente',
            estimatedValue: testData.totalPrice
          }
        });

        // Crear item para la cotización
        await prisma.quoteItem.create({
          data: {
            quoteId: quote.id,
            itemDescription: testData.productTitle,
            quantity: testData.containerQuantity,
            unitPrice: testData.totalPrice / testData.containerQuantity,
            totalPrice: testData.totalPrice,
            currency: 'USD'
          }
        });

        console.log(`✅ Cotización de prueba creada: ${quote.quoteNumber}`);
      }

      console.log(`✅ ${testQuotes.length} cotizaciones de prueba creadas!`);
    }
  } catch (error) {
    console.error('❌ Error creando cotizaciones de prueba:', error);
  }
}

// Ejecutar el script
async function main() {
  console.log('🚀 Script de actualización de estados de cotizaciones');
  console.log('================================================');
  
  await createTestQuotesIfEmpty();
  await updateQuoteStates();
  
  console.log('\n🎉 Proceso completado exitosamente!');
  console.log('Ahora puedes probar las funcionalidades en MyQuotes');
}

main().catch(console.error); 