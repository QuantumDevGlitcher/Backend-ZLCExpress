@echo off
echo.
echo ================================================================
echo CONFIGURACION RAPIDA - PRISMA + POSTGRESQL
echo ================================================================
echo.
echo IMPORTANTE: Ejecuta este script en una terminal NUEVA
echo (no donde esta corriendo el servidor)
echo.
echo 1. Asegurate de que PostgreSQL este corriendo
echo 2. Crea la base de datos: CREATE DATABASE zlcexpress_db;
echo 3. Verifica credenciales en .env
echo.
pause

cd /d "f:\Documentos\Proyecto uni\Backend-ZLCExpress"

echo.
echo Generando cliente Prisma...
call npx prisma generate
if errorlevel 1 (
    echo ERROR: No se pudo generar el cliente Prisma
    pause
    exit /b 1
)

echo.
echo Sincronizando esquema con PostgreSQL...
call npx prisma db push
if errorlevel 1 (
    echo ERROR: No se pudo sincronizar el esquema
    echo Verifica que PostgreSQL este corriendo y la BD exista
    pause
    exit /b 1
)

echo.
echo Cargando datos iniciales...
call npm run db:seed
if errorlevel 1 (
    echo ERROR: No se pudieron cargar los datos iniciales
    pause
    exit /b 1
)

echo.
echo ================================================================
echo CONFIGURACION COMPLETADA EXITOSAMENTE!
echo ================================================================
echo.
echo Usuarios de prueba disponibles:
echo - admin@zlcexpress.com / admin123
echo - importadora@empresa.com / importadora123
echo - juanci123z@gmail.com / password123
echo.
echo Para abrir la interfaz web de la BD:
echo npm run db:studio
echo.
echo Endpoints disponibles:
echo - POST /api/auth/login
echo - POST /api/auth/register
echo - GET /api/auth/profile
echo - POST /api/auth/logout
echo.
pause
