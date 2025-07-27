@echo off
echo ================================================================
echo CONFIGURACION DE BASE DE DATOS POSTGRESQL - ZLCExpress
echo ================================================================
echo.

cd /d "f:\Documentos\Proyecto uni\Backend-ZLCExpress"

echo 🔧 Paso 1: Generando cliente de Prisma...
npx prisma generate

echo.
echo 🗄️ Paso 2: Empujando esquema a PostgreSQL...
echo IMPORTANTE: Asegurate de que PostgreSQL este corriendo y la base de datos 'zlcexpress_db' exista
npx prisma db push

echo.
echo 🌱 Paso 3: Ejecutando seed (datos iniciales)...
npm run db:seed

echo.
echo ✅ CONFIGURACION COMPLETADA!
echo.
echo 📊 Para abrir Prisma Studio (interfaz web para ver la BD):
echo npm run db:studio
echo.
echo 🔧 Comandos utiles:
echo - npm run db:generate  : Regenerar cliente Prisma
echo - npm run db:push     : Sincronizar esquema con BD
echo - npm run db:seed     : Ejecutar datos iniciales
echo - npm run db:studio   : Abrir interfaz web de BD
echo - npm run db:reset    : Resetear BD completamente
echo.
pause
