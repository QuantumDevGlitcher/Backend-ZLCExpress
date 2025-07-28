// ================================================================
// SCRIPT PARA CREAR USUARIOS DEMO - ZLCExpress
// ================================================================
// Este script crea los usuarios específicos que necesita el frontend

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🔨 Creando usuarios demo específicos...');

  const hashedPassword = await bcrypt.hash('demo123', 12);

  // Usuarios que espera el frontend (Login.tsx)
  const demoUsers = [
    // Compradores
    {
      email: 'comprador@demo.com',
      password: hashedPassword,
      companyName: 'Importadora Demo S.A.',
      taxId: 'IMP-2024-001',
      operationCountry: 'Guatemala',
      industry: 'Import/Export',
      contactName: 'María Rodríguez',
      contactPosition: 'Gerente de Compras',
      contactPhone: '+502 2234 5678',
      fiscalAddress: 'Zona 10, Ciudad de Guatemala',
      country: 'Guatemala',
      state: 'Guatemala',
      city: 'Ciudad de Guatemala',
      postalCode: '01010',
      isVerified: true,
      verificationStatus: 'VERIFIED' as const,
      userType: 'BUYER' as const
    },
    {
      email: 'comprador.pendiente@demo.com',
      password: hashedPassword,
      companyName: 'Importadora Pendiente Ltda.',
      taxId: 'IPL-2024-002',
      operationCountry: 'Guatemala',
      industry: 'Import/Export',
      contactName: 'Carlos López',
      contactPosition: 'Director de Compras',
      contactPhone: '+502 2345 6789',
      fiscalAddress: 'Zona 9, Ciudad de Guatemala',
      country: 'Guatemala',
      state: 'Guatemala',
      city: 'Ciudad de Guatemala',
      postalCode: '01009',
      isVerified: false,
      verificationStatus: 'PENDING' as const,
      userType: 'BUYER' as const
    },
    // Proveedores
    {
      email: 'proveedor@demo.com',
      password: hashedPassword,
      companyName: 'ZLC Supplier Demo Corp.',
      taxId: 'ZLC-SUP-001',
      operationCountry: 'Panamá',
      industry: 'Manufacturing',
      contactName: 'Juan Chen',
      contactPosition: 'Sales Manager',
      contactPhone: '+507 234 5678',
      fiscalAddress: 'Zona Libre de Colón, Edificio 123',
      country: 'Panamá',
      state: 'Colón',
      city: 'Colón',
      postalCode: '24000',
      isVerified: true,
      verificationStatus: 'VERIFIED' as const,
      userType: 'SUPPLIER' as const
    },
    {
      email: 'proveedor.pendiente@demo.com',
      password: hashedPassword,
      companyName: 'ZLC Pending Supplier S.A.',
      taxId: 'ZLC-PEN-002',
      operationCountry: 'Panamá',
      industry: 'Manufacturing',
      contactName: 'Li Wei',
      contactPosition: 'Export Manager',
      contactPhone: '+507 345 6789',
      fiscalAddress: 'Zona Libre de Colón, Edificio 456',
      country: 'Panamá',
      state: 'Colón',
      city: 'Colón',
      postalCode: '24000',
      isVerified: false,
      verificationStatus: 'PENDING' as const,
      userType: 'SUPPLIER' as const
    },
    {
      email: 'proveedor.rechazado@demo.com',
      password: hashedPassword,
      companyName: 'Rejected Supplier Inc.',
      taxId: 'REJ-SUP-003',
      operationCountry: 'China',
      industry: 'Manufacturing',
      contactName: 'Wang Ming',
      contactPosition: 'Sales Representative',
      contactPhone: '+86 138 0013 8000',
      fiscalAddress: 'Guangzhou, China',
      country: 'China',
      state: 'Guangdong',
      city: 'Guangzhou',
      postalCode: '510000',
      isVerified: false,
      verificationStatus: 'REJECTED' as const,
      userType: 'SUPPLIER' as const
    },
    // Usuario administrador
    {
      email: 'admin@zlcexpress.com',
      password: hashedPassword,
      companyName: 'ZLC Express Administration',
      taxId: 'ZLC-ADMIN-000',
      operationCountry: 'Panamá',
      industry: 'Logistics',
      contactName: 'Admin System',
      contactPosition: 'System Administrator',
      contactPhone: '+507 123 4567',
      fiscalAddress: 'Zona Libre de Colón, Oficina Principal',
      country: 'Panamá',
      state: 'Colón',
      city: 'Colón',
      postalCode: '24000',
      isVerified: true,
      verificationStatus: 'VERIFIED' as const,
      userType: 'BOTH' as const
    }
  ];

  let createdCount = 0;
  let skippedCount = 0;

  for (const userData of demoUsers) {
    try {
      // Verificar si el usuario ya existe
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (existingUser) {
        console.log(`⚠️  Usuario ya existe: ${userData.email}`);
        skippedCount++;
        continue;
      }

      // Crear el usuario
      const user = await prisma.user.create({
        data: userData
      });

      console.log(`✅ Usuario creado: ${user.email} (${user.userType}) - ${user.verificationStatus}`);
      createdCount++;
    } catch (error) {
      console.error(`❌ Error creando usuario ${userData.email}:`, error);
    }
  }

  console.log('\n📊 Resumen:');
  console.log(`✅ Usuarios creados: ${createdCount}`);
  console.log(`⚠️  Usuarios omitidos (ya existían): ${skippedCount}`);
  
  console.log('\n🔐 Credenciales para pruebas:');
  console.log('Email: comprador@demo.com | Password: demo123 (Verificado)');
  console.log('Email: comprador.pendiente@demo.com | Password: demo123 (Pendiente)');
  console.log('Email: proveedor@demo.com | Password: demo123 (Verificado)');
  console.log('Email: proveedor.pendiente@demo.com | Password: demo123 (Pendiente)');
  console.log('Email: proveedor.rechazado@demo.com | Password: demo123 (Rechazado)');
  console.log('Email: admin@zlcexpress.com | Password: demo123 (Admin)');
}

main()
  .catch((e) => {
    console.error('❌ Error en el script:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('\n🏁 Script completado');
  });
