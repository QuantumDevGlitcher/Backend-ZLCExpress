# Script para limpiar y recrear usuarios
Write-Host "🧹 Limpiando y recreando usuarios..." -ForegroundColor Cyan
Write-Host ""

# Crear usuarios simples uno por uno
$usuarios = @(
    @{
        email = "test1@test.com"
        password = "123456"
        data = '{"email":"test1@test.com","password":"123456","companyName":"Test 1","taxId":"111111111","operationCountry":"Colombia","industry":"Test","contactName":"Test 1","contactPosition":"Test","contactPhone":"1111111111","fiscalAddress":"Test 1","country":"Colombia","state":"Test","city":"Test","postalCode":"11111","userType":"buyer"}'
    },
    @{
        email = "test2@test.com"
        password = "123456"
        data = '{"email":"test2@test.com","password":"123456","companyName":"Test 2","taxId":"222222222","operationCountry":"Colombia","industry":"Test","contactName":"Test 2","contactPosition":"Test","contactPhone":"2222222222","fiscalAddress":"Test 2","country":"Colombia","state":"Test","city":"Test","postalCode":"22222","userType":"supplier"}'
    },
    @{
        email = "test3@test.com"
        password = "123456"
        data = '{"email":"test3@test.com","password":"123456","companyName":"Test 3","taxId":"333333333","operationCountry":"Colombia","industry":"Test","contactName":"Test 3","contactPosition":"Test","contactPhone":"3333333333","fiscalAddress":"Test 3","country":"Colombia","state":"Test","city":"Test","postalCode":"33333","userType":"both"}'
    }
)

foreach ($usuario in $usuarios) {
    Write-Host "📝 Creando: $($usuario.email)" -ForegroundColor Yellow
    
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method POST -Body $usuario.data -ContentType "application/json"
        Write-Host "✅ Creado exitosamente" -ForegroundColor Green
        
        # Probar login inmediatamente
        Start-Sleep -Seconds 1
        $loginData = '{"email":"' + $usuario.email + '","password":"' + $usuario.password + '"}'
        $loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
        
        if ($loginResponse.success) {
            Write-Host "✅ Login funciona - Tipo: $($loginResponse.user.userType)" -ForegroundColor Green
        } else {
            Write-Host "❌ Login falla: $($loginResponse.message)" -ForegroundColor Red
        }
        
    } catch {
        Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

Write-Host "🎯 Proceso completado!" -ForegroundColor Green
