const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createBuyerUser() {
  try {
    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Crear el usuario buyer
    const newUser = await prisma.user.create({
      data: {
        email: 'admin@zlc.com',
        password: hashedPassword,
        companyName: 'ZLC Express Admin',
        taxId: 'ZLC-001',
        operationCountry: 'China',
        industry: 'Trading',
        contactName: 'Admin User',
        contactPosition: 'Administrator',
        contactPhone: '+86 138 0000 0000',
        fiscalAddress: 'Shanghai Business District, Building A',
        country: 'China',
        state: 'Shanghai',
        city: 'Shanghai',
        postalCode: '200000',
        isVerified: true,
        verificationStatus: 'VERIFIED',
        userType: 'BUYER'
      }
    });

    console.log('✅ Usuario buyer creado exitosamente:');
    console.log('📧 Email:', newUser.email);
    console.log('🏢 Empresa:', newUser.companyName);
    console.log('👤 Tipo de usuario:', newUser.userType);
    console.log('🆔 ID:', newUser.id);

  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️ El usuario con email admin@zlc.com ya existe');
    } else {
      console.error('❌ Error creando usuario:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createBuyerUser();
