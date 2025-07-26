# Sistema de Autenticación - ZLCExpress Backend

## Descripción General

Sistema de autenticación para usuarios empresariales verificados en la plataforma ZLCExpress. Solo permite el acceso a empresas que han completado el proceso de verificación y tienen permisos de compra.

## Estructura de Usuario Empresa

### Campos del Usuario

| Campo | Tipo | Descripción | Requerido |
|-------|------|-------------|-----------|
| `id` | INTEGER | Identificador único del usuario | ✅ |
| `email` | VARCHAR(255) | Email corporativo de la empresa | ✅ |
| `password` | VARCHAR(255) | Contraseña encriptada | ✅ |
| `companyName` | VARCHAR(255) | Nombre legal de la empresa | ✅ |
| `taxId` | VARCHAR(50) | NIT/RUC de la empresa | ✅ |
| `operationCountry` | VARCHAR(100) | País de operación principal | ✅ |
| `industry` | VARCHAR(100) | Sector o industria de la empresa | ✅ |
| `contactName` | VARCHAR(255) | Nombre del contacto principal | ✅ |
| `contactPosition` | VARCHAR(100) | Cargo del contacto principal | ✅ |
| `contactPhone` | VARCHAR(20) | Teléfono del contacto principal | ✅ |
| `fiscalAddress` | TEXT | Dirección fiscal completa | ✅ |
| `country` | VARCHAR(100) | País de la dirección fiscal | ✅ |
| `state` | VARCHAR(100) | Estado/Provincia de la dirección fiscal | ✅ |
| `city` | VARCHAR(100) | Ciudad de la dirección fiscal | ✅ |
| `postalCode` | VARCHAR(10) | Código postal | ✅ |
| `isVerified` | BOOLEAN | Si la empresa está verificada | ✅ |
| `verificationStatus` | ENUM | Estado de verificación: 'pending', 'verified', 'rejected' | ✅ |
| `userType` | ENUM | Tipo de usuario: 'buyer', 'supplier', 'both' | ✅ |
| `createdAt` | TIMESTAMP | Fecha de creación del registro | ✅ |
| `updatedAt` | TIMESTAMP | Fecha de última actualización | ✅ |

## Query de Creación de Tabla MySQL

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    
    -- Información de la empresa
    company_name VARCHAR(255) NOT NULL,
    tax_id VARCHAR(50) NOT NULL,
    operation_country VARCHAR(100) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    
    -- Contacto principal
    contact_name VARCHAR(255) NOT NULL,
    contact_position VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    
    -- Dirección fiscal
    fiscal_address TEXT NOT NULL,
    country VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    
    -- Estado del usuario
    is_verified BOOLEAN DEFAULT FALSE,
    verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    user_type ENUM('buyer', 'supplier', 'both') DEFAULT 'buyer',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Índices
    INDEX idx_email (email),
    INDEX idx_verification_status (verification_status),
    INDEX idx_is_verified (is_verified),
    INDEX idx_user_type (user_type),
    INDEX idx_tax_id (tax_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## Usuarios Mock Disponibles

### 1. Usuario Administrador
```json
{
  "email": "admin@zlcexpress.com",
  "password": "admin123",
  "companyName": "ZLC Express Admin",
  "userType": "both",
  "isVerified": true
}
```

### 2. Usuario Importadora
```json
{
  "email": "importadora@empresa.com",
  "password": "importadora123",
  "companyName": "Importadora Global S.A.S",
  "userType": "buyer",
  "isVerified": true
}
```

### 3. Usuario del Formulario de Registro
```json
{
  "email": "juanci123z@gmail.com",
  "password": "password123",
  "companyName": "Importadora",
  "taxId": "2342324",
  "userType": "buyer",
  "isVerified": true
}
```

## Endpoints Disponibles

### POST /api/auth/login
Autentica a un usuario empresarial verificado.

**Request Body:**
```json
{
  "email": "admin@zlcexpress.com",
  "password": "admin123"
}
```

**Response Exitosa (200):**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "user": {
    "id": 1,
    "email": "admin@zlcexpress.com",
    "companyName": "ZLC Express Admin",
    "taxId": "ZLC-2024-001",
    "operationCountry": "Colombia",
    "industry": "Logistics",
    "contactName": "Administrador Sistema",
    "contactPosition": "CEO",
    "contactPhone": "+57 300 123 4567",
    "fiscalAddress": "Carrera 7 #123-45, Oficina 301",
    "country": "Colombia",
    "state": "Bogotá D.C.",
    "city": "Bogotá",
    "postalCode": "110111",
    "isVerified": true,
    "verificationStatus": "verified",
    "userType": "both",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2025-07-25T20:30:00.000Z"
  },
  "token": "jwt-token-1-1721937000000"
}
```

**Response de Error (401):**
```json
{
  "success": false,
  "message": "Credenciales inválidas. Verifique su email y contraseña."
}
```

### GET /api/auth/profile
Obtiene el perfil del usuario autenticado.

**Headers:**
```
Authorization: Bearer jwt-token-1-1721937000000
```

**Response Exitosa (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "admin@zlcexpress.com",
    "companyName": "ZLC Express Admin",
    // ... resto de campos del usuario
  }
}
```

### GET /api/auth/validate
Valida si un token de sesión es válido.

**Headers:**
```
Authorization: Bearer jwt-token-1-1721937000000
```

**Response Exitosa (200):**
```json
{
  "success": true,
  "valid": true,
  "message": "Sesión válida"
}
```

### POST /api/auth/logout
Cierra la sesión del usuario.

**Response (200):**
```json
{
  "success": true,
  "message": "Sesión cerrada exitosamente"
}
```

## Validaciones Implementadas

### 1. Validaciones de Login
- ✅ Email y contraseña requeridos
- ✅ Formato de email válido
- ✅ Usuario debe existir en la base de datos
- ✅ Contraseña debe coincidir
- ✅ Usuario debe estar verificado (`isVerified: true`)
- ✅ Estado de verificación debe ser 'verified'
- ✅ Usuario debe tener permisos de compra (`userType: 'buyer'` o `'both'`)

### 2. Validaciones de Token
- ✅ Token debe estar presente en el header Authorization
- ✅ Token debe tener formato válido
- ✅ Usuario asociado al token debe existir
- ✅ Usuario debe estar verificado

## Flujo de Autenticación

1. **Cliente envía credenciales** → `/api/auth/login`
2. **Sistema valida** credenciales y estado de verificación
3. **Si es válido**, genera token y retorna datos del usuario
4. **Cliente incluye token** en requests subsecuentes
5. **Sistema valida token** en cada request protegido

## Estados de Verificación

- **pending**: Empresa registrada pero pendiente de verificación
- **verified**: Empresa verificada y habilitada para operar
- **rejected**: Empresa rechazada por no cumplir requisitos

## Tipos de Usuario

- **buyer**: Solo puede realizar compras
- **supplier**: Solo puede vender productos
- **both**: Puede comprar y vender

## Seguridad Implementada

- ✅ Passwords no se retornan en responses
- ✅ Validación de formato de email
- ✅ Verificación de estado de empresa
- ✅ Sistema de tokens para sesiones
- ✅ Manejo de errores sin exponer información sensible

## Migración a Base de Datos Real

Cuando se conecte a MySQL:

1. Ejecutar el query de creación de tabla
2. Insertar usuarios de prueba
3. Reemplazar `mockUsers` por consultas a BD
4. Implementar encriptación de contraseñas (bcrypt)
5. Implementar JWT real
6. Agregar rate limiting
7. Agregar logs de auditoría

## Testing

### Probar Login con curl:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@zlcexpress.com","password":"admin123"}'
```

### Probar Profile con curl:
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer jwt-token-1-1721937000000"
```
