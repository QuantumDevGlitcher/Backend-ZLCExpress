# Script para verificar usuarios en PostgreSQL
Write-Host "🔍 Verificando usuarios en PostgreSQL..." -ForegroundColor Cyan
Write-Host ""

Write-Host "📊 Obteniendo estadísticas..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/debug/users" -Method GET
    Write-Host "✅ Total usuarios: $($response.totalUsers)" -ForegroundColor Green
    Write-Host "✅ Usuarios verificados: $($response.verifiedUsers)" -ForegroundColor Green
    Write-Host "✅ Compradores: $($response.buyers)" -ForegroundColor Blue
    Write-Host "✅ Proveedores: $($response.suppliers)" -ForegroundColor Magenta
} catch {
    Write-Host "❌ Error obteniendo estadísticas" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔐 Probando login admin..." -ForegroundColor Yellow
try {
    $adminLogin = '{"email":"admin@zlcexpress.com","password":"admin123"}'
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $adminLogin -ContentType "application/json"
    if ($response.success) {
        Write-Host "✅ Admin login OK - Tipo: $($response.user.userType)" -ForegroundColor Green
    } else {
        Write-Host "❌ Admin login FALLO: $($response.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Admin login ERROR" -ForegroundColor Red
}

Write-Host ""
Write-Host "� Probando login comprador..." -ForegroundColor Yellow
try {
    $compradorLogin = '{"email":"comprador@empresa.com","password":"comprador123"}'
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $compradorLogin -ContentType "application/json"
    if ($response.success) {
        Write-Host "✅ Comprador login OK - Tipo: $($response.user.userType)" -ForegroundColor Green
    } else {
        Write-Host "❌ Comprador login FALLO: $($response.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Comprador login ERROR" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔐 Probando login juan..." -ForegroundColor Yellow
try {
    $juanLogin = '{"email":"juan@empresa.com","password":"password123"}'
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $juanLogin -ContentType "application/json"
    if ($response.success) {
        Write-Host "✅ Juan login OK - Tipo: $($response.user.userType)" -ForegroundColor Green
    } else {
        Write-Host "❌ Juan login FALLO: $($response.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Juan login ERROR" -ForegroundColor Red
}
