// Script para testear el endpoint de cotizaciones y encontrar el error
const testQuoteEndpoint = async () => {
  try {
    console.log('🧪 Iniciando test del endpoint de cotizaciones...');
    
    // 1. Primero hacer login para obtener token
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'buyer@demo.com',
        password: 'demo123'
      })
    });

    if (!loginResponse.ok) {
      throw new Error('Error en login');
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Login exitoso, token obtenido');

    // 2. Preparar datos de prueba para la cotización
    const quoteData = {
      items: [
        {
          id: "test-item-1",
          productId: 1,
          productTitle: "Producto de Prueba",
          quantity: 1,
          pricePerContainer: 15000,
          currency: "USD",
          containerType: "40GP",
          incoterm: "FOB"
        }
      ],
      totalAmount: 15000,
      paymentTerms: "Net 30 days",
      freightDetails: {
        origin: "Puerto de Colón",
        destination: "Puerto de Miami",
        carrier: "Test Carrier",
        cost: 2000,
        currency: "USD",
        transitTime: 15
      },
      platformCommission: 250,
      notes: "Cotización de prueba"
    };

    console.log('📦 Enviando cotización con datos:', quoteData);

    // 3. Enviar cotización
    const quoteResponse = await fetch('http://localhost:3000/api/quotes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(quoteData)
    });

    if (!quoteResponse.ok) {
      const errorData = await quoteResponse.json();
      console.error('❌ Error en cotización:', errorData);
      return;
    }

    const result = await quoteResponse.json();
    console.log('✅ Cotización creada exitosamente:', result);

  } catch (error) {
    console.error('💥 Error general:', error);
  }
};

// Ejecutar test
testQuoteEndpoint();
