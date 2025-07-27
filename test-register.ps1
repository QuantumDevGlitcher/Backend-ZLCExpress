# Test de registro de usuario

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
    userType = "buyer"
} | ConvertTo-Json

Write-Host "Enviando datos de usuario:"
Write-Host $testUser

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method POST -Body $testUser -ContentType "application/json"
    Write-Host "Usuario creado exitosamente: $($response.user.email)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errorContent = $reader.ReadToEnd()
        Write-Host "Detalles del error: $errorContent"
    }
}
