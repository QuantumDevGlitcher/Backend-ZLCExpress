# Script para crear usuarios en PostgreSQL via API
Write-Host "🚀 Creando usuarios reales en PostgreSQL..." -ForegroundColor Cyan
Write-Host ""

# Usuario 1: Admin
Write-Host "📝 Creando admin@zlcexpress.com..." -ForegroundColor Yellow
$adminBody = @{
    email = "admin@zlcexpress.com"
    password = "admin123"
    companyName = "ZLC Express Corp"
    taxId = "900123456-1"
    operationCountry = "Colombia"
    industry = "Logística y Transporte"
    contactName = "Carlos Administrador"
    contactPosition = "CEO"
    contactPhone = "+57 1 234 5678"
    fiscalAddress = "Carrera 7 #12-34, Oficina 501"
    country = "Colombia"
    state = "Bogotá DC"
    city = "Bogotá"
    postalCode = "110111"
    userType = "both"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method POST -Body $adminBody -ContentType "application/json"
    Write-Host "✅ Admin creado exitosamente" -ForegroundColor Green
} catch {
    Write-Host "❌ Error creando admin: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Usuario 2: Comprador
Write-Host "📝 Creando comprador@empresa.com..." -ForegroundColor Yellow
$compradorBody = @{
    email = "comprador@empresa.com"
    password = "comprador123"
    companyName = "Importadora Los Andes S.A.S"
    taxId = "900234567-2"
    operationCountry = "Colombia"
    industry = "Comercio Internacional"
    contactName = "María Compradora"
    contactPosition = "Gerente de Compras"
    contactPhone = "+57 300 123 4567"
    fiscalAddress = "Calle 100 #15-20, Torre A"
    country = "Colombia"
    state = "Bogotá DC"
    city = "Bogotá"
    postalCode = "110221"
    userType = "buyer"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method POST -Body $compradorBody -ContentType "application/json"
    Write-Host "✅ Comprador creado exitosamente" -ForegroundColor Green
} catch {
    Write-Host "❌ Error creando comprador: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Usuario 3: Proveedor
Write-Host "📝 Creando proveedor@fabrica.com..." -ForegroundColor Yellow
$proveedorBody = @{
    email = "proveedor@fabrica.com"
    password = "proveedor123"
    companyName = "Manufactura Global Ltda"
    taxId = "900345678-3"
    operationCountry = "Colombia"
    industry = "Manufactura"
    contactName = "Juan Proveedor"
    contactPosition = "Director Comercial"
    contactPhone = "+57 310 987 6543"
    fiscalAddress = "Zona Industrial Calle 80 #45-67"
    country = "Colombia"
    state = "Cundinamarca"
    city = "Mosquera"
    postalCode = "250040"
    userType = "supplier"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method POST -Body $proveedorBody -ContentType "application/json"
    Write-Host "✅ Proveedor creado exitosamente" -ForegroundColor Green
} catch {
    Write-Host "❌ Error creando proveedor: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Usuario 4: Juan
Write-Host "📝 Creando juan@empresa.com..." -ForegroundColor Yellow
$juanBody = @{
    email = "juan@empresa.com"
    password = "password123"
    companyName = "Juan Mock Enterprises"
    taxId = "900567890-5"
    operationCountry = "Colombia"
    industry = "Tecnología"
    contactName = "Juan Mock Moreno"
    contactPosition = "Founder & CEO"
    contactPhone = "+57 315 444 5555"
    fiscalAddress = "Carrera 15 #93-47"
    country = "Colombia"
    state = "Bogotá DC"
    city = "Bogotá"
    postalCode = "110221"
    userType = "buyer"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method POST -Body $juanBody -ContentType "application/json"
    Write-Host "✅ Juan creado exitosamente" -ForegroundColor Green
} catch {
    Write-Host "❌ Error creando Juan: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 ¡Proceso completado!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Usuarios creados para login:" -ForegroundColor Cyan
Write-Host "- admin@zlcexpress.com / admin123 (both)" -ForegroundColor White
Write-Host "- comprador@empresa.com / comprador123 (buyer)" -ForegroundColor White  
Write-Host "- proveedor@fabrica.com / proveedor123 (supplier)" -ForegroundColor White
Write-Host "- juan@empresa.com / password123 (buyer)" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Backend corriendo en: http://localhost:3000" -ForegroundColor Yellow
Write-Host "🗄️ Base de datos: PostgreSQL con Prisma ORM" -ForegroundColor Yellow
Write-Host ""
