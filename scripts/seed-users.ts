// scripts/seed-users.ts
// Script para crear usuarios de prueba en PostgreSQL

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedUsers() {
  console.log('🌱 Iniciando seeding de usuarios...');

  try {
    // Limpiar usuarios existentes (opcional)
    console.log('🧹 Limpiando usuarios existentes...');
    await prisma.authLog.deleteMany();
    await prisma.userSession.deleteMany();
    await prisma.user.deleteMany();

    // Crear usuarios de prueba
    const users = [
      {
        email: 'admin@zlcexpress.com',
        password: 'admin123',
        companyName: 'ZLC Express Corp',
        taxId: '900123456-1',
        operationCountry: 'Colombia',
        industry: 'Logística y Transporte',
        contactName: 'Carlos Administrador',
        contactPosition: 'CEO',
        contactPhone: '+57 1 234 5678',
        fiscalAddress: 'Carrera 7 #12-34, Oficina 501',
        country: 'Colombia',
        state: 'Bogotá DC',
        city: 'Bogotá',
        postalCode: '110111',
        userType: 'both' as const,
        verificationStatus: 'verified' as const,
      },
      {
        email: 'comprador@empresa.com',
        password: 'comprador123',
        companyName: 'Importadora Los Andes S.A.S',
        taxId: '900234567-2',
        operationCountry: 'Colombia',
        industry: 'Comercio Internacional',
        contactName: 'María Compradora',
        contactPosition: 'Gerente de Compras',
        contactPhone: '+57 300 123 4567',
        fiscalAddress: 'Calle 100 #15-20, Torre A',
        country: 'Colombia',
        state: 'Bogotá DC',
        city: 'Bogotá',
        postalCode: '110221',
        userType: 'buyer' as const,
        verificationStatus: 'verified' as const,
      },
      {
        email: 'proveedor@fabrica.com',
        password: 'proveedor123',
        companyName: 'Manufactura Global Ltda',
        taxId: '900345678-3',
        operationCountry: 'Colombia',
        industry: 'Manufactura',
        contactName: 'Juan Proveedor',
        contactPosition: 'Director Comercial',
        contactPhone: '+57 310 987 6543',
        fiscalAddress: 'Zona Industrial Calle 80 #45-67',
        country: 'Colombia',
        state: 'Cundinamarca',
        city: 'Mosquera',
        postalCode: '250040',
        userType: 'supplier' as const,
        verificationStatus: 'verified' as const,
      },
      {
        email: 'pendiente@empresa.com',
        password: 'pendiente123',
        companyName: 'Nueva Empresa S.A.S',
        taxId: '900456789-4',
        operationCountry: 'Colombia',
        industry: 'Comercio',
        contactName: 'Ana Pendiente',
        contactPosition: 'Gerente General',
        contactPhone: '+57 320 555 7890',
        fiscalAddress: 'Avenida 68 #25-30',
        country: 'Colombia',
        state: 'Bogotá DC',
        city: 'Bogotá',
        postalCode: '110411',
        userType: 'buyer' as const,
        verificationStatus: 'pending' as const,
      },
      {
        email: 'juanci123z@gmail.com',
        password: 'password123',
        companyName: 'Juan Mock Enterprises',
        taxId: '900567890-5',
        operationCountry: 'Colombia',
        industry: 'Tecnología',
        contactName: 'Juan Mock Moreno',
        contactPosition: 'Founder & CEO',
        contactPhone: '+57 315 444 5555',
        fiscalAddress: 'Carrera 15 #93-47',
        country: 'Colombia',
        state: 'Bogotá DC',
        city: 'Bogotá',
        postalCode: '110221',
        userType: 'buyer' as const,
        verificationStatus: 'verified' as const,
      }
    ];

    for (const userData of users) {
      console.log(`📝 Creando usuario: ${userData.email}`);
      
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      const user = await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
        }
      });

      console.log(`✅ Usuario creado: ${user.email} (ID: ${user.id})`);
    }

    console.log('\n🎉 ¡Seeding completado exitosamente!');
    console.log('\n📋 Usuarios creados:');
    console.log('┌─────────────────────────────┬─────────────────┬──────────────┬─────────────────┐');
    console.log('│ Email                       │ Password        │ Tipo         │ Estado          │');
    console.log('├─────────────────────────────┼─────────────────┼──────────────┼─────────────────┤');
    console.log('│ admin@zlcexpress.com        │ admin123        │ both         │ verified        │');
    console.log('│ comprador@empresa.com       │ comprador123    │ buyer        │ verified        │');
    console.log('│ proveedor@fabrica.com       │ proveedor123    │ supplier     │ verified        │');
    console.log('│ pendiente@empresa.com       │ pendiente123    │ buyer        │ pending         │');
    console.log('│ juanci123z@gmail.com        │ password123     │ buyer        │ verified        │');
    console.log('└─────────────────────────────┴─────────────────┴──────────────┴─────────────────┘');
    
  } catch (error) {
    console.error('❌ Error durante el seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el seeding
seedUsers().catch((error) => {
  console.error('❌ Error crítico:', error);
  process.exit(1);
});
