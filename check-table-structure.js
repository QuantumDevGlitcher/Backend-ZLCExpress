// Verificar estructura de la tabla quotes
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkQuoteTableStructure() {
  try {
    console.log('🔍 Verificando estructura de la tabla quotes...');

    // Usar query raw para ver la estructura de la tabla
    const columns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'quotes' 
      ORDER BY ordinal_position;
    `;

    console.log('📋 Columnas de la tabla quotes:');
    columns.forEach((col, index) => {
      console.log(`${index + 1}. ${col.column_name} (${col.data_type}) - Nullable: ${col.is_nullable}`);
    });

    // Buscar específicamente si existe una columna "existe"
    const existeColumn = columns.find(col => col.column_name === 'existe');
    if (existeColumn) {
      console.log('❌ ENCONTRADA columna "existe":', existeColumn);
    } else {
      console.log('✅ No se encontró columna "existe"');
    }

    return columns;

  } catch (error) {
    console.error('❌ Error verificando estructura:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkQuoteTableStructure();
