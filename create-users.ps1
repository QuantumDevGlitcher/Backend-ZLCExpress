# Script PowerShell para crear usuarios en PostgreSQL
# Ejecutar en una terminal separada

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   CREANDO USUARIOS REALES EN POSTGRESQL" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "🔗 Conectando al backend en http://localhost:3000" -ForegroundColor Yellow
Write-Host ""

# Usuario 1: Administrador
Write-Host "📝 Registrando usuario: admin@zlcexpress.com" -ForegroundColor Blue
try {
    $adminData = @{
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
    }
    
    $adminJson = $adminData | ConvertTo-Json
    $response = Invoke-RestMethod -Uri 'http://localhost:3000/api/auth/register' -Method POST -Headers @{'Content-Type'='application/json'} -Body $adminJson
    Write-Host "✅ Admin registrado exitosamente" -ForegroundColor Green
    Write-Host "   Respuesta: $($response.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Error registrando admin: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Usuario 2: Comprador
Write-Host "📝 Registrando usuario: comprador@empresa.com" -ForegroundColor Blue
try {
    $compradorData = @{
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
    }
    
    $compradorJson = $compradorData | ConvertTo-Json
    $response = Invoke-RestMethod -Uri 'http://localhost:3000/api/auth/register' -Method POST -Headers @{'Content-Type'='application/json'} -Body $compradorJson
    Write-Host "✅ Comprador registrado exitosamente" -ForegroundColor Green
    Write-Host "   Respuesta: $($response.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Error registrando comprador: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Usuario 3: Proveedor
Write-Host "📝 Registrando usuario: proveedor@fabrica.com" -ForegroundColor Blue
try {
    $proveedorData = @{
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
    }
    
    $proveedorJson = $proveedorData | ConvertTo-Json
    $response = Invoke-RestMethod -Uri 'http://localhost:3000/api/auth/register' -Method POST -Headers @{'Content-Type'='application/json'} -Body $proveedorJson
    Write-Host "✅ Proveedor registrado exitosamente" -ForegroundColor Green
    Write-Host "   Respuesta: $($response.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Error registrando proveedor: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Usuario 4: Juan
Write-Host "📝 Registrando usuario: juan@empresa.com" -ForegroundColor Blue
try {
    $juanData = @{
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
    }
    
    $juanJson = $juanData | ConvertTo-Json
    $response = Invoke-RestMethod -Uri 'http://localhost:3000/api/auth/register' -Method POST -Headers @{'Content-Type'='application/json'} -Body $juanJson
    Write-Host "✅ Juan registrado exitosamente" -ForegroundColor Green
    Write-Host "   Respuesta: $($response.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Error registrando Juan: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Usuario 5: Pendiente
Write-Host "📝 Registrando usuario: pendiente@empresa.com" -ForegroundColor Blue
try {
    $pendienteData = @{
        email = "pendiente@empresa.com"
        password = "pendiente123"
        companyName = "Nueva Empresa S.A.S"
        taxId = "900456789-4"
        operationCountry = "Colombia"
        industry = "Comercio"
        contactName = "Ana Pendiente"
        contactPosition = "Gerente General"
        contactPhone = "+57 320 555 7890"
        fiscalAddress = "Avenida 68 #25-30"
        country = "Colombia"
        state = "Bogotá DC"
        city = "Bogotá"
        postalCode = "110411"
        userType = "buyer"
    }
    
    $pendienteJson = $pendienteData | ConvertTo-Json
    $response = Invoke-RestMethod -Uri 'http://localhost:3000/api/auth/register' -Method POST -Headers @{'Content-Type'='application/json'} -Body $pendienteJson
    Write-Host "✅ Usuario pendiente registrado exitosamente" -ForegroundColor Green
    Write-Host "   Respuesta: $($response.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Error registrando usuario pendiente: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "         USUARIOS CREADOS EN POSTGRESQL" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Credenciales para login:" -ForegroundColor Yellow
Write-Host "┌─────────────────────────────┬─────────────────┬──────────────┐" -ForegroundColor White
Write-Host "│ Email                       │ Password        │ Tipo         │" -ForegroundColor White
Write-Host "├─────────────────────────────┼─────────────────┼──────────────┤" -ForegroundColor White
Write-Host "│ admin@zlcexpress.com        │ admin123        │ both         │" -ForegroundColor Green
Write-Host "│ comprador@empresa.com       │ comprador123    │ buyer        │" -ForegroundColor Green
Write-Host "│ proveedor@fabrica.com       │ proveedor123    │ supplier     │" -ForegroundColor Green
Write-Host "│ juan@empresa.com            │ password123     │ buyer        │" -ForegroundColor Green
Write-Host "│ pendiente@empresa.com       │ pendiente123    │ buyer        │" -ForegroundColor Green
Write-Host "└─────────────────────────────┴─────────────────┴──────────────┘" -ForegroundColor White
Write-Host ""
Write-Host "🎯 ¡Usuarios creados en PostgreSQL!" -ForegroundColor Green
Write-Host "🗄️ Ahora puedes hacer login con credenciales reales" -ForegroundColor Green
Write-Host ""
Write-Host "Presiona cualquier tecla para continuar..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
