// get-token.js
const axios = require('axios');

async function getToken() {
  try {
    console.log('🔐 Obteniendo token de autenticación...');
    
    const response = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'buyer@demo.com',
      password: 'demo123'
    });

    if (response.data.success) {
      console.log('✅ Login exitoso');
      console.log('Token:', response.data.token);
      return response.data.token;
    }

  } catch (error) {
    console.error('❌ Error de login:', error.response?.data || error.message);
  }
}

getToken();
