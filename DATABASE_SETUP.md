# 🗄️ Migración a PostgreSQL + Prisma ORM

Este proyecto ha sido migrado de MySQL a **PostgreSQL** usando **Prisma ORM** para mayor flexibilidad y mejor soporte TypeScript.

## 📋 Requisitos Previos

1. **PostgreSQL** instalado y corriendo
2. **Node.js** y **npm** instalados
3. Base de datos `zlcexpress_db` creada en PostgreSQL

## 🚀 Configuración Rápida

### 1. Crear la base de datos

Abre **pgAdmin** o **psql** y ejecuta:

```sql
CREATE DATABASE zlcexpress_db;
```

### 2. Configurar variables de entorno

Edita el archivo `.env` con tus credenciales de PostgreSQL:

```env
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/zlcexpress_db?schema=public"
DB_USER=postgres
DB_PASSWORD=TU_PASSWORD
DB_NAME=zlcexpress_db
```

### 3. Ejecutar configuración automática

**Opción A: Script automático**
```bash
# Ejecuta el script de configuración
./setup-database.bat
```

**Opción B: Comandos manuales**
```bash
# Generar cliente Prisma
npx prisma generate

# Sincronizar esquema con la base de datos
npx prisma db push

# Cargar datos iniciales
npm run db:seed
```

## 🎯 Características del Nuevo Sistema

### ✅ Ventajas de PostgreSQL + Prisma

- **🔒 Type Safety**: Tipos TypeScript automáticos
- **🚀 Better Performance**: Consultas optimizadas
- **🔍 Auto-completion**: IntelliSense completo
- **📊 Database Studio**: Interfaz web para administrar datos
- **🔄 Migrations**: Control de versiones de esquema
- **🛡️ Security**: Prepared statements automáticos

### 📊 Esquema de Base de Datos

```
users (Tabla principal de usuarios)
├── id (Primary Key)
├── email (Unique)
├── password (Hashed with bcrypt)
├── companyName
├── taxId
├── operationCountry
├── industry
├── contactName, contactPosition, contactPhone
├── fiscalAddress, country, state, city, postalCode
├── isVerified, verificationStatus, userType
└── createdAt, updatedAt

user_sessions (Control de sesiones JWT)
├── id (Primary Key)
├── userId (Foreign Key → users.id)
├── tokenHash (JWT token hashed)
├── expiresAt, createdAt, lastUsedAt
├── ipAddress, userAgent
└── isActive

auth_logs (Auditoría de autenticación)
├── id (Primary Key)
├── userId (Foreign Key → users.id)
├── action (login, logout, failed_login, etc.)
├── ipAddress, userAgent
├── success, errorMessage
└── createdAt
```

### 🔧 Comandos Disponibles

```bash
# Desarrollo
npm run dev                 # Iniciar servidor con hot reload

# Base de datos
npm run db:generate        # Regenerar cliente Prisma
npm run db:push           # Sincronizar esquema con BD
npm run db:seed           # Cargar datos iniciales
npm run db:studio         # Abrir interfaz web de BD
npm run db:migrate        # Crear nueva migración
npm run db:reset          # Resetear BD completamente
```

## 👥 Datos de Prueba

El sistema incluye 5 usuarios de prueba:

1. **admin@zlcexpress.com** / `admin123` (Administrador)
2. **importadora@empresa.com** / `importadora123` (Comprador)
3. **juanci123z@gmail.com** / `password123` (Comprador)
4. **supplier@textiles.com** / `supplier123` (Proveedor)
5. **demo@pending.com** / `demo123` (Usuario pendiente)

## 🔍 Prisma Studio

Para ver y editar datos en una interfaz web:

```bash
npm run db:studio
```

Esto abrirá `http://localhost:5555` con una interfaz completa para administrar tu base de datos.

## 🛠️ Migración desde Sistema Anterior

El nuevo `prismaService.ts` reemplaza completamente el anterior `databaseService.ts` con:

- ✅ **Autenticación real** con bcrypt y JWT
- ✅ **Gestión de sesiones** completa
- ✅ **Logs de auditoría** automáticos
- ✅ **Validaciones** de tipos TypeScript
- ✅ **Conexiones pooled** para mejor performance
- ✅ **Transacciones** automáticas donde sea necesario

## 🚨 Problemas Comunes

### Error: "Environment variable not found: DATABASE_URL"
- Verifica que el archivo `.env` existe y tiene la variable `DATABASE_URL`

### Error: "database 'zlcexpress_db' does not exist"
- Crea la base de datos en PostgreSQL: `CREATE DATABASE zlcexpress_db;`

### Error: "password authentication failed"
- Verifica las credenciales en el archivo `.env`

### Error: "Can't reach database server"
- Asegúrate de que PostgreSQL esté corriendo en puerto 5432

## 📞 Soporte

Si tienes problemas:

1. Verifica que PostgreSQL esté corriendo
2. Confirma que la base de datos existe
3. Valida las credenciales en `.env`
4. Ejecuta `npm run db:generate` para regenerar el cliente

---

🎉 **¡Listo!** Ahora tienes un sistema de base de datos moderno y escalable con PostgreSQL y Prisma ORM.
