# Test de login con todos los usuarios del seed

Write-Host "=== PROBANDO LOGINS CON USUARIOS EXISTENTES ==="

# Admin
Write-Host "`n1. Probando admin@zlcexpress.com"
$adminLogin = @{ email = "admin@zlcexpress.com"; password = "admin123" } | ConvertTo-Json
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $adminLogin -ContentType "application/json"
    Write-Host "✅ Admin login exitoso - Tipo: $($response.user.userType)"
} catch {
    Write-Host "❌ Admin login falló: $($_.Exception.Message)"
}

# Importadora
Write-Host "`n2. Probando importadora@empresa.com"
$importadoraLogin = @{ email = "importadora@empresa.com"; password = "importadora123" } | ConvertTo-Json
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $importadoraLogin -ContentType "application/json"
    Write-Host "✅ Importadora login exitoso - Tipo: $($response.user.userType)"
} catch {
    Write-Host "❌ Importadora login falló: $($_.Exception.Message)"
}

# Juan Carlos
Write-Host "`n3. Probando juanci123z@gmail.com"
$juanLogin = @{ email = "juanci123z@gmail.com"; password = "password123" } | ConvertTo-Json
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $juanLogin -ContentType "application/json"
    Write-Host "✅ Juan login exitoso - Tipo: $($response.user.userType)"
} catch {
    Write-Host "❌ Juan login falló: $($_.Exception.Message)"
}

# Supplier
Write-Host "`n4. Probando supplier@textiles.com"
$supplierLogin = @{ email = "supplier@textiles.com"; password = "supplier123" } | ConvertTo-Json
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $supplierLogin -ContentType "application/json"
    Write-Host "✅ Supplier login exitoso - Tipo: $($response.user.userType)"
} catch {
    Write-Host "❌ Supplier login falló: $($_.Exception.Message)"
}

Write-Host "`n=== RESUMEN DE PRUEBAS ==="
