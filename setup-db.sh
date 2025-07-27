#!/bin/bash

echo "================================================================"
echo "CONFIGURACION PRISMA + POSTGRESQL - ZLCExpress"
echo "================================================================"
echo ""

# Cambiar al directorio del proyecto
cd "f:\Documentos\Proyecto uni\Backend-ZLCExpress"

echo "🔧 Paso 1: Generando cliente Prisma..."
npx prisma generate

echo ""
echo "🗄️ Paso 2: Sincronizando esquema con PostgreSQL..."
echo "IMPORTANTE: Asegurate de que PostgreSQL este corriendo"
npx prisma db push

echo ""
echo "🌱 Paso 3: Cargando datos iniciales..."
npm run db:seed

echo ""
echo "✅ CONFIGURACION COMPLETADA!"
echo ""
echo "Para abrir Prisma Studio: npm run db:studio"
echo ""

read -p "Presiona Enter para continuar..."
