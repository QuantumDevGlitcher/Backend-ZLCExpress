# Ejemplos de Uso - Sistema de Autenticación

## Pruebas con PowerShell

### 1. Login Exitoso - Usuario Administrador
```powershell
$body = '{"email":"admin@zlcexpress.com","password":"admin123"}'
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body $body
$response.Content | ConvertFrom-Json
```

### 2. Login Exitoso - Usuario Empresa
```powershell
$body = '{"email":"juanci123z@gmail.com","password":"password123"}'
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body $body
$token = ($response.Content | ConvertFrom-Json).token
Write-Host "Token obtenido: $token"
```

### 3. Obtener Perfil con Token
```powershell
$headers = @{'Authorization' = 'Bearer jwt-token-3-1753476217325'}
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/profile" -Method GET -Headers $headers
$response.Content | ConvertFrom-Json
```

### 4. Validar Sesión
```powershell
$headers = @{'Authorization' = 'Bearer jwt-token-3-1753476217325'}
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/validate" -Method GET -Headers $headers
$response.Content | ConvertFrom-Json
```

### 5. Logout
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/logout" -Method POST
$response.Content | ConvertFrom-Json
```

## Casos de Error

### Login con Credenciales Incorrectas
```powershell
$body = '{"email":"admin@zlcexpress.com","password":"wrongpassword"}'
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body $body
} catch {
    $error = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($error)
    $reader.ReadToEnd() | ConvertFrom-Json
}
```

### Acceso sin Token
```powershell
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/profile" -Method GET
} catch {
    Write-Host "Error: $_"
}
```

### Token Inválido
```powershell
$headers = @{'Authorization' = 'Bearer token-invalido'}
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/profile" -Method GET -Headers $headers
} catch {
    Write-Host "Error: $_"
}
```

## Pruebas con Postman

### Collection JSON para importar en Postman:

```json
{
  "info": {
    "name": "ZLCExpress Auth API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Login Admin",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"admin@zlcexpress.com\",\n  \"password\": \"admin123\"\n}"
        },
        "url": {
          "raw": "http://localhost:3000/api/auth/login",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["api", "auth", "login"]
        }
      }
    },
    {
      "name": "Login Empresa",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"juanci123z@gmail.com\",\n  \"password\": \"password123\"\n}"
        },
        "url": {
          "raw": "http://localhost:3000/api/auth/login",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["api", "auth", "login"]
        }
      }
    },
    {
      "name": "Get Profile",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": {
          "raw": "http://localhost:3000/api/auth/profile",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["api", "auth", "profile"]
        }
      }
    },
    {
      "name": "Validate Session",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": {
          "raw": "http://localhost:3000/api/auth/validate",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["api", "auth", "validate"]
        }
      }
    },
    {
      "name": "Logout",
      "request": {
        "method": "POST",
        "url": {
          "raw": "http://localhost:3000/api/auth/logout",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["api", "auth", "logout"]
        }
      }
    }
  ]
}
```

## Respuestas Esperadas

### Login Exitoso
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "user": {
    "id": 3,
    "email": "juanci123z@gmail.com",
    "companyName": "Importadora",
    "taxId": "2342324",
    "operationCountry": "Brasil",
    "industry": "Automotriz",
    "contactName": "Juan Mock Moreno",
    "contactPosition": "Gerente",
    "contactPhone": "+50763952673",
    "fiscalAddress": "Villa grecia sector 4",
    "country": "Panamá",
    "state": "Panamá",
    "city": "Ciudad de Panamá",
    "postalCode": "507",
    "isVerified": true,
    "verificationStatus": "verified",
    "userType": "buyer",
    "createdAt": "2024-03-10T00:00:00.000Z",
    "updatedAt": "2025-07-25T20:43:13.497Z"
  },
  "token": "jwt-token-3-1753476217325"
}
```

### Credenciales Incorrectas
```json
{
  "success": false,
  "message": "Credenciales inválidas. Verifique su email y contraseña."
}
```

### Token Inválido
```json
{
  "success": false,
  "message": "Token inválido o expirado"
}
```
