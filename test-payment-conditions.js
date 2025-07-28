// Test para verificar que las condiciones de pago se están persistiendo correctamente

const testQuoteWithPaymentConditions = async () => {
  console.log('🧪 Probando cotización con condiciones de pago específicas...');
  
  const quoteData = {
    items: [
      {
        id: "item-1",
        productId: 21, // Cambiar a número
        productTitle: "Producto de Prueba",
        quantity: 1,
        pricePerContainer: 15000,
        currency: "USD"
      }
    ],
    totalAmount: 15000,
    paymentTerms: "Pago Total Anticipado", // ESTA ES LA CONDICIÓN QUE DEBE PERSISTIR
    freightDetails: {
      origin: "Puerto de Colón",
      destination: "Puerto de Cartagena",
      carrier: "Test Carrier",
      cost: 2000,
      currency: "USD",
      transitTime: 15
    },
    platformCommission: 250,
    notes: "Cotización de prueba para verificar condiciones de pago"
  };

  try {
    const response = await fetch('http://localhost:3000/api/quotes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user-id': '1'
      },
      body: JSON.stringify(quoteData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en el test');
    }

    const result = await response.json();
    console.log('✅ Cotización creada:', result);

    // Ahora obtener las cotizaciones para verificar la persistencia
    console.log('🔍 Obteniendo cotizaciones para verificar persistencia...');
    const getResponse = await fetch('http://localhost:3000/api/quotes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'user-id': '1'
      }
    });

    if (!getResponse.ok) {
      throw new Error('Error obteniendo cotizaciones');
    }

    const quotes = await getResponse.json();
    console.log('📋 Cotizaciones obtenidas:', quotes);

    // Verificar si la condición de pago se persistió correctamente
    const latestQuote = quotes.data?.[0];
    if (latestQuote) {
      console.log('💰 Condición de pago en la cotización:', latestQuote.paymentConditions);
      
      if (latestQuote.paymentConditions === "Pago Total Anticipado") {
        console.log('✅ ¡ÉXITO! Las condiciones de pago se persistieron correctamente');
      } else {
        console.log('❌ FALLO: Las condiciones de pago no se persistieron correctamente');
        console.log('   Esperado: "Pago Total Anticipado"');
        console.log('   Obtenido:', latestQuote.paymentConditions);
      }
    }

  } catch (error) {
    console.error('❌ Error en el test:', error);
  }
};

// Ejecutar el test
testQuoteWithPaymentConditions();
