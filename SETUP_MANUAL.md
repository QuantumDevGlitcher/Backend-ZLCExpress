# ================================================================
# MANUAL DE CONFIGURACIÓN PRISMA + POSTGRESQL
# ================================================================

## PASO 1: Verificar PostgreSQL
Asegúrate de que PostgreSQL esté corriendo y:
1. Crea la base de datos: CREATE DATABASE zlcexpress_db;
2. Verifica las credenciales en .env

## PASO 2: Ejecutar comandos (en una terminal NUEVA, no donde corre el server)

```bash
# Navegar al directorio del proyecto
cd "f:\Documentos\Proyecto uni\Backend-ZLCExpress"

# Generar cliente Prisma
npx prisma generate

# Sincronizar esquema con la base de datos
npx prisma db push

# Cargar datos iniciales
npm run db:seed
```

## PASO 3: Verificar instalación
```bash
# Abrir Prisma Studio para ver los datos
npm run db:studio
```

## PASO 4: Probar endpoints
Con el servidor corriendo, puedes probar:

### Registro de usuario:
POST http://localhost:3000/api/auth/register
```json
{
  "email": "test@example.com",
  "password": "password123",
  "companyName": "Mi Empresa",
  "taxId": "12345678",
  "operationCountry": "Colombia",
  "industry": "Comercio",
  "contactName": "Juan Pérez",
  "contactPosition": "CEO",
  "contactPhone": "+57 300 123 4567",
  "fiscalAddress": "Calle 123 #45-67",
  "country": "Colombia",
  "state": "Bogotá",
  "city": "Bogotá",
  "postalCode": "110111",
  "userType": "BUYER"
}
```

### Login:
POST http://localhost:3000/api/auth/login
```json
{
  "email": "admin@zlcexpress.com",
  "password": "admin123"
}
```

### Obtener perfil:
GET http://localhost:3000/api/auth/profile
Headers: Authorization: Bearer <token_del_login>

## PASO 5: Usuarios de prueba disponibles
- admin@zlcexpress.com / admin123
- importadora@empresa.com / importadora123
- juanci123z@gmail.com / password123
- supplier@textiles.com / supplier123
- demo@pending.com / demo123

## ERRORES COMUNES:

### Error: "Environment variable not found: DATABASE_URL"
Solución: Verifica que el archivo .env tenga DATABASE_URL configurado

### Error: "database 'zlcexpress_db' does not exist"
Solución: Crear la base de datos en PostgreSQL

### Error: "Can't reach database server"
Solución: Verificar que PostgreSQL esté corriendo en puerto 5432

### Error en tipos TypeScript
Solución: Ejecutar `npx prisma generate` para regenerar los tipos

## COMANDOS ÚTILES:
- `npm run db:studio` - Interfaz web para administrar la BD
- `npm run db:reset` - Resetear completamente la BD
- `npx prisma migrate dev` - Crear nueva migración
- `npx prisma db pull` - Sincronizar esquema desde BD existente
