# ================================================================
# CONFIGURACIÓN POSTGRESQL + PRISMA - ZLCExpress
# ================================================================

Write-Host "🚀 Configurando Base de Datos PostgreSQL con Prisma..." -ForegroundColor Green
Write-Host ""

# Cambiar al directorio del proyecto
Set-Location "f:\Documentos\Proyecto uni\Backend-ZLCExpress"

# Paso 1: Verificar PostgreSQL
Write-Host "📋 Paso 1: Verificando requisitos..." -ForegroundColor Yellow
Write-Host "- PostgreSQL debe estar corriendo en puerto 5432"
Write-Host "- Base de datos 'zlcexpress_db' debe existir"
Write-Host "- Credenciales deben estar correctas en .env"
Write-Host ""
Read-Host "Presiona Enter cuando hayas verificado lo anterior"

# Paso 2: Generar cliente Prisma
Write-Host "🔧 Paso 2: Generando cliente Prisma..." -ForegroundColor Yellow
npx prisma generate

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Cliente Prisma generado exitosamente" -ForegroundColor Green
} else {
    Write-Host "❌ Error generando cliente Prisma" -ForegroundColor Red
    Read-Host "Presiona Enter para continuar de todos modos"
}

Write-Host ""

# Paso 3: Sincronizar esquema
Write-Host "🗄️ Paso 3: Sincronizando esquema con PostgreSQL..." -ForegroundColor Yellow
npx prisma db push

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Esquema sincronizado exitosamente" -ForegroundColor Green
} else {
    Write-Host "❌ Error sincronizando esquema" -ForegroundColor Red
    Read-Host "Presiona Enter para continuar de todos modos"
}

Write-Host ""

# Paso 4: Cargar datos iniciales
Write-Host "🌱 Paso 4: Cargando datos iniciales..." -ForegroundColor Yellow
npm run db:seed

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Datos iniciales cargados exitosamente" -ForegroundColor Green
} else {
    Write-Host "❌ Error cargando datos iniciales" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 CONFIGURACIÓN COMPLETADA!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Comandos útiles:" -ForegroundColor Cyan
Write-Host "- npm run db:studio   : Abrir interfaz web de BD"
Write-Host "- npm run dev         : Iniciar servidor de desarrollo"
Write-Host "- npm run db:reset    : Resetear BD completamente"
Write-Host ""
Write-Host "👥 Usuarios de prueba disponibles:" -ForegroundColor Cyan
Write-Host "- admin@zlcexpress.com / admin123"
Write-Host "- importadora@empresa.com / importadora123"
Write-Host "- juanci123z@gmail.com / password123"
Write-Host ""

Read-Host "Presiona Enter para finalizar"
