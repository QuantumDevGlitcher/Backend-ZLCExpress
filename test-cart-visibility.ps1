# Test de login y verificación de carrito para buyer

Write-Host "🛒 PROBANDO CARRITO PARA USUARIO BUYER"
Write-Host "=====================================`n"

# Test login con usuario buyer
$buyerLogin = @{ 
    email = "importadora@empresa.com"
    password = "importadora123" 
} | ConvertTo-Json

Write-Host "1. Haciendo login con usuario BUYER..."
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $buyerLogin -ContentType "application/json"
    Write-Host "✅ Login exitoso!"
    Write-Host "   Usuario: $($response.user.email)"
    Write-Host "   Tipo: $($response.user.userType)"
    Write-Host "   Token: $($response.token.Substring(0,20))..."
    
    # Verificar que es tipo BUYER
    if ($response.user.userType -eq "BUYER") {
        Write-Host "✅ Usuario es BUYER - debería ver el carrito"
    } elseif ($response.user.userType -eq "BOTH") {
        Write-Host "✅ Usuario es BOTH - también debería ver el carrito"
    } else {
        Write-Host "❌ Usuario es $($response.user.userType) - no debería ver carrito"
    }
    
} catch {
    Write-Host "❌ Error en login: $($_.Exception.Message)"
}

Write-Host "`n2. Probando también con usuario ADMIN (BOTH)..."
$adminLogin = @{ 
    email = "admin@zlcexpress.com"
    password = "admin123" 
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $adminLogin -ContentType "application/json"
    Write-Host "✅ Login exitoso!"
    Write-Host "   Usuario: $($response.user.email)"
    Write-Host "   Tipo: $($response.user.userType)"
    
    if ($response.user.userType -eq "BOTH") {
        Write-Host "✅ Usuario es BOTH - debería ver el carrito"
    } else {
        Write-Host "❌ Usuario es $($response.user.userType) - resultado inesperado"
    }
    
} catch {
    Write-Host "❌ Error en login: $($_.Exception.Message)"
}

Write-Host "`n🎯 CONCLUSIÓN:"
Write-Host "- Los cambios en AuthContext.tsx normalizan userType a minúsculas"
Write-Host "- Navigation.tsx ahora muestra carrito para 'buyer' y 'both'"
Write-Host "- Usuarios BUYER y BOTH deberían ver el carrito correctamente"
Write-Host "`n💡 PRÓXIMO PASO: Probar en el frontend navegando a http://localhost:5173"
