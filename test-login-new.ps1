# Test de login con usuario recién creado

$loginData = @{
    email = "test@example.com"
    password = "test123"
} | ConvertTo-Json

Write-Host "Intentando login con usuario recién creado:"
Write-Host $loginData

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    Write-Host "Login exitoso!"
    Write-Host "Usuario: $($response.user.email)"
    Write-Host "Tipo: $($response.user.userType)"
    Write-Host "Token recibido: $($response.token.Substring(0,20))..."
} catch {
    Write-Host "Error en login: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errorContent = $reader.ReadToEnd()
        Write-Host "Detalles del error: $errorContent"
    }
}
