# Backend ZLCExpress

Backend del sistema de e-commerce ZLCExpress desarrollado con Node.js, TypeScript y Express.

## Estructura del Proyecto

```
src/
├── app.ts                 # Punto de entrada de la aplicación
├── types/                 # Definiciones de tipos TypeScript
│   └── index.ts
├── controllers/           # Controladores de las rutas
│   ├── authController.ts
│   ├── cartController.ts
│   ├── orderController.ts
│   └── productController.ts
├── services/              # Lógica de negocio
│   ├── authService.ts
│   ├── cartService.ts
│   ├── orderService.ts
│   └── productService.ts
├── routes/                # Definición de rutas
│   ├── index.ts
│   ├── authRoutes.ts
│   ├── cartRoutes.ts
│   ├── orderRoutes.ts
│   └── productRoutes.ts
└── middleware/            # Middleware personalizado
    └── errorHandler.ts
```

## Funcionalidades Implementadas

### Autenticación de Empresas Verificadas ✅
Sistema completo de login para usuarios empresariales verificados.

**Endpoints:**
- `POST /api/auth/login` - Autenticar empresa verificada
- `GET /api/auth/profile` - Obtener perfil de empresa
- `GET /api/auth/validate` - Validar sesión activa
- `POST /api/auth/logout` - Cerrar sesión

**Características:**
- ✅ Solo empresas verificadas pueden acceder
- ✅ Validación de permisos de comprador
- ✅ Sistema de tokens para sesiones
- ✅ Manejo completo de errores
- ✅ Datos empresariales completos (NIT, dirección fiscal, contacto, etc.)

**Usuarios de Prueba:**
- `admin@zlcexpress.com` / `admin123` (Administrador)
- `importadora@empresa.com` / `importadora123` (Empresa Colombia)
- `juanci123z@gmail.com` / `password123` (Empresa Panamá)

### Productos
- `GET /api/products` - Listar todos los productos
- `GET /api/products/:id` - Obtener producto por ID
- `GET /api/products/category/:category` - Obtener productos por categoría

### Carrito de Compras
- `GET /api/cart` - Obtener carrito del usuario
- `POST /api/cart/add` - Agregar producto al carrito
- `PUT /api/cart/update/:id` - Actualizar cantidad de producto
- `DELETE /api/cart/remove/:id` - Eliminar producto del carrito
- `DELETE /api/cart/clear` - Vaciar carrito

### Pedidos
- `GET /api/orders` - Obtener historial de pedidos
- `GET /api/orders/:id` - Obtener detalles de un pedido
- `POST /api/orders` - Crear nuevo pedido
- `PUT /api/orders/:id/status` - Actualizar estado del pedido

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
```

3. Ejecutar en modo desarrollo:
```bash
npm run dev
```

4. Ejecutar en modo producción:
```bash
npm run build
npm start
```

## Scripts Disponibles

- `npm start` - Ejecutar en modo producción
- `npm run dev` - Ejecutar en modo desarrollo con hot reload
- `npm run build` - Compilar TypeScript a JavaScript

## Documentación Adicional

- 📋 [Sistema de Autenticación](docs/AUTH_SYSTEM.md) - Documentación completa del sistema de login empresarial
- 🧪 [Ejemplos de Uso](docs/AUTH_EXAMPLES.md) - Ejemplos de pruebas con PowerShell y Postman
- 🗄️ [Estructura de Base de Datos](docs/AUTH_SYSTEM.md#query-de-creación-de-tabla-mysql) - Queries MySQL para la tabla de usuarios

## Testing del Sistema de Autenticación

```powershell
# Login con usuario verificado
$body = '{"email":"admin@zlcexpress.com","password":"admin123"}'
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body $body
$response.Content | ConvertFrom-Json

# Obtener perfil con token
$token = "jwt-token-1-1753476205216"
$headers = @{'Authorization' = "Bearer $token"}
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/profile" -Method GET -Headers $headers
$response.Content | ConvertFrom-Json
```
