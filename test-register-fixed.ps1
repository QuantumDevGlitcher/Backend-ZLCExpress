# Test de registro de usuario con valores correctos

$testUser = @{
    email = "test@example.com"
    password = "test123"
    companyName = "Test Company"
    taxId = "12345"
    operationCountry = "Colombia"
    industry = "Test"
    contactName = "Test User"
    contactPosition = "Manager"
    contactPhone = "123456789"
    fiscalAddress = "Test Address"
    country = "Colombia"
    state = "Test State"
    city = "Test City"
    postalCode = "12345"
    userType = "BUYER"
} | ConvertTo-Json

Write-Host "Enviando datos de usuario con userType correcto:"
Write-Host $testUser

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method POST -Body $testUser -ContentType "application/json"
    Write-Host "Usuario creado exitosamente: $($response.user.email)"
    Write-Host "Tipo de usuario: $($response.user.userType)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errorContent = $reader.ReadToEnd()
        Write-Host "Detalles del error: $errorContent"
    }
}
