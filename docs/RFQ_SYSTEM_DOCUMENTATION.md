# Sistema RFQ (Request for Quotation) - Documentación Completa

## Resumen del Sistema

El sistema RFQ (Request for Quotation) es una solución completa para gestionar solicitudes de cotización entre compradores y proveedores en la plataforma ZLCExpress. Permite a los usuarios solicitar cotizaciones formales para productos, gestionar respuestas de proveedores, y hacer seguimiento del proceso completo.

## Características Principales

### 🚀 Funcionalidades Implementadas

1. **Creación de RFQ**
   - Formulario completo con validación de datos
   - Cálculo automático de fechas límite de respuesta
   - Estimación automática de valor basada en cantidades
   - Soporte para diferentes tipos de contenedores e Incoterms

2. **Gestión de Respuestas**
   - Interfaz para que proveedores respondan a cotizaciones
   - Validación de precios y términos comerciales
   - Cálculo automático de fechas de validez

3. **Sistema de Notificaciones**
   - Notificaciones en tiempo real para eventos importantes
   - Sistema de emails (simulado, listo para integración)
   - Gestión de estados de lectura

4. **Filtros y Búsqueda Avanzada**
   - Filtrado por estado, prioridad, fechas, valores
   - Búsqueda por proveedor, producto, o comprador
   - Ordenamiento por múltiples criterios

5. **Estadísticas y Reportes**
   - Métricas de rendimiento del sistema
   - Tiempos promedio de respuesta
   - Análisis de valores y volúmenes

6. **Validación y Seguridad**
   - Validación completa de datos de entrada
   - Sanitización de inputs para prevenir ataques
   - Manejo de errores robusto

## Arquitectura del Sistema

### Estructura de Archivos

```
Backend-ZLCExpress/src/
├── types/
│   ├── rfq.ts              # Tipos TypeScript para RFQ
│   └── index.ts            # Re-exports de tipos
├── services/
│   ├── rfqService.ts       # Lógica de negocio principal
│   └── databaseService.ts  # Simulador de base de datos
├── controllers/
│   └── rfqController.ts    # Controladores HTTP
├── middleware/
│   └── rfqValidation.ts    # Validación y sanitización
└── routes/
    └── rfqRoutes.ts        # Definición de rutas
```

### Componentes Principales

#### 1. Tipos y Interfaces (`types/rfq.ts`)
- **RFQRequest**: Estructura principal de una solicitud de cotización
- **RFQResponse**: Respuesta del proveedor a una RFQ
- **RFQCreateRequest**: Datos necesarios para crear una nueva RFQ
- **RFQUpdateRequest**: Campos actualizables de una RFQ
- **RFQFilter**: Criterios de filtrado para búsquedas
- **RFQStats**: Estadísticas del sistema
- **RFQNotification**: Sistema de notificaciones

#### 2. Servicio de Base de Datos (`databaseService.ts`)
- Simulador de base de datos en memoria
- Operaciones CRUD completas
- Búsqueda y filtrado avanzado
- Gestión de datos relacionados (productos, proveedores)

#### 3. Servicio RFQ (`rfqService.ts`)
- Lógica de negocio principal
- Gestión del ciclo de vida de RFQs
- Sistema de notificaciones
- Cálculos automáticos

#### 4. Controlador (`rfqController.ts`)
- Manejo de requests HTTP
- Validación de parámetros
- Respuestas estructuradas
- Manejo de errores

#### 5. Middleware de Validación (`rfqValidation.ts`)
- Validación de datos de entrada
- Sanitización de inputs
- Validación de parámetros de consulta
- Validación de respuestas de proveedores

## API Endpoints

### Rutas Principales

#### POST `/api/rfq`
Crear nueva solicitud de cotización
```json
{
  "productId": "prod_1",
  "requesterName": "Juan Pérez",
  "requesterEmail": "juan@empresa.com",
  "requesterPhone": "+57 300 123 4567",
  "companyName": "Mi Empresa SAS",
  "containerQuantity": 2,
  "containerType": "20GP",
  "incoterm": "CIF",
  "tentativeDeliveryDate": "2025-09-15",
  "logisticsComments": "Requiere contenedor refrigerado",
  "specialRequirements": "Certificaciones específicas",
  "priority": "high"
}
```

#### GET `/api/rfq`
Obtener todas las RFQs con filtros opcionales
- Parámetros de consulta: `status`, `priority`, `supplierId`, `dateFrom`, `dateTo`, etc.

#### GET `/api/rfq/:id`
Obtener RFQ específica por ID

#### PUT `/api/rfq/:id`
Actualizar una RFQ existente

#### POST `/api/rfq/:id/respond`
Responder a una RFQ (proveedores)
```json
{
  "supplierId": "supplier_1",
  "unitPrice": 18500,
  "totalPrice": 37000,
  "currency": "USD",
  "deliveryTime": 30,
  "deliveryTerms": "Entrega en puerto de destino",
  "validityPeriod": 30,
  "paymentTerms": "50% adelanto, 50% contra documentos",
  "minimumOrderQuantity": 1,
  "supplierComments": "Precio especial por volumen",
  "status": "submitted"
}
```

#### DELETE `/api/rfq/:id`
Eliminar una RFQ

#### GET `/api/rfq/stats`
Obtener estadísticas del sistema

#### POST `/api/rfq/check-expired`
Verificar y marcar RFQs expiradas

#### GET `/api/rfq/notifications/:userId/:userType`
Obtener notificaciones para un usuario

#### PUT `/api/rfq/notifications/:notificationId/read`
Marcar notificación como leída

## Estados y Flujo de Trabajo

### Estados de RFQ
- **pending**: Esperando respuesta del proveedor
- **quoted**: Proveedor ha enviado cotización
- **accepted**: Cotización aceptada por el comprador
- **rejected**: Cotización rechazada
- **expired**: RFQ expirada sin respuesta

### Niveles de Prioridad
- **low**: Baja prioridad
- **medium**: Prioridad media (default)
- **high**: Alta prioridad
- **urgent**: Urgente

### Flujo de Trabajo
1. **Comprador crea RFQ** → Estado: `pending`
2. **Sistema notifica al proveedor** → Email + notificación interna
3. **Proveedor responde** → Estado: `quoted`
4. **Sistema notifica al comprador** → Email + notificación interna
5. **Comprador acepta/rechaza** → Estado: `accepted`/`rejected`
6. **Sistema verifica expiración** → Estado: `expired` si no hay respuesta

## Validaciones Implementadas

### Validación de Creación de RFQ
- ✅ ProductId requerido y válido
- ✅ Nombre y email del solicitante requeridos
- ✅ Email con formato válido
- ✅ Cantidad de contenedores > 0
- ✅ Tipo de contenedor válido (20GP, 40GP, 40HC, 45HC)
- ✅ Incoterm válido (EXW, FOB, CIF, CFR, DDP, DAP)
- ✅ Fecha de entrega futura
- ✅ Teléfono con formato válido (opcional)
- ✅ Prioridad válida (opcional)

### Validación de Respuesta del Proveedor
- ✅ Precios unitario y total > 0
- ✅ Moneda requerida
- ✅ Tiempo de entrega > 0
- ✅ Términos de entrega y pago requeridos
- ✅ Período de validez > 0 (opcional)
- ✅ Cantidad mínima de orden > 0 (opcional)

### Validación de Filtros de Consulta
- ✅ Formatos de fecha válidos
- ✅ Valores numéricos válidos
- ✅ Estados y prioridades válidas
- ✅ Sanitización de strings

## Características de Seguridad

### Sanitización de Inputs
- Eliminación de espacios extra
- Filtrado de caracteres peligrosos (`<`, `>`, `"`, `'`)
- Validación de tipos de datos

### Validación de Datos
- Verificación de tipos TypeScript
- Validación de rangos numéricos
- Validación de formatos (email, teléfono, fechas)
- Verificación de valores permitidos (enums)

### Manejo de Errores
- Respuestas estructuradas con códigos de error
- Logging de errores para debugging
- Mensajes de error descriptivos para el usuario
- Separación entre errores de validación y errores del sistema

## Notificaciones y Comunicación

### Sistema de Notificaciones Internas
- **new_rfq**: Nueva solicitud para proveedor
- **rfq_response**: Respuesta recibida para comprador
- **rfq_accepted**: Cotización aceptada
- **rfq_rejected**: Cotización rechazada
- **rfq_expired**: RFQ expirada sin respuesta

### Sistema de Emails (Simulado)
- Configurado para integración fácil con servicios como:
  - SendGrid
  - AWS SES
  - Mailgun
  - SMTP personalizado

## Base de Datos Simulada

### Datos de Prueba Incluidos

#### Productos
- Blusas de manga larga casuales (Textiles)
- Electrónicos Smart TV 55" (Electrónicos)
- Equipos de Construcción (Construcción)

#### Proveedores
- Demo Compradora S.A. (Colombia)
- TechSupply Global Ltd. (China)
- BuildPro Industries (USA)

### Operaciones Soportadas
- CRUD completo para RFQs
- Búsqueda y filtrado avanzado
- Gestión de notificaciones
- Estadísticas y métricas
- Exportación/importación de datos

## Configuración y Deployment

### Dependencias Principales
```json
{
  "express": "^5.1.0",
  "cors": "^2.8.5",
  "dotenv": "^17.2.1",
  "typescript": "^5.8.3"
}
```

### Scripts de NPM
```bash
npm start        # Iniciar servidor de producción
npm run dev      # Iniciar servidor de desarrollo con nodemon
npm run build    # Compilar TypeScript
npm test         # Ejecutar tests (pendiente)
```

### Variables de Entorno
```env
PORT=3000                    # Puerto del servidor
NODE_ENV=development         # Entorno de ejecución
DB_CONNECTION_STRING=...     # Conexión a base de datos (futuro)
EMAIL_SERVICE_API_KEY=...    # API key para servicio de email
```

## Testing y Calidad

### Comandos de Prueba
```bash
# Verificar compilación
npm run build

# Iniciar servidor de desarrollo
npm run dev

# Probar endpoint de salud
curl http://localhost:3000/health

# Probar creación de RFQ
curl -X POST http://localhost:3000/api/rfq \
  -H "Content-Type: application/json" \
  -d '{"productId":"prod_1","requesterName":"Test User","requesterEmail":"test@example.com","containerQuantity":1,"containerType":"20GP","incoterm":"CIF","tentativeDeliveryDate":"2025-12-31"}'
```

### Endpoints de Testing
- `GET /health` - Verificación de estado del servidor
- `GET /api/test` - Endpoint de prueba de la API
- `GET /api/rfq/stats` - Estadísticas para verificar funcionalidad

## Roadmap y Mejoras Futuras

### Integraciones Pendientes
- [ ] Base de datos real (MongoDB/PostgreSQL)
- [ ] Servicio de email real
- [ ] Autenticación y autorización
- [ ] Carga de archivos adjuntos
- [ ] Sistema de rating y reviews

### Características Avanzadas
- [ ] Plantillas de RFQ
- [ ] Negociación automática
- [ ] Integración con sistemas ERP
- [ ] Reportes avanzados y dashboards
- [ ] API webhooks para notificaciones

### Optimizaciones
- [ ] Caché de consultas frecuentes
- [ ] Paginación de resultados
- [ ] Compresión de respuestas
- [ ] Rate limiting
- [ ] Logging estructurado

## Conclusión

El sistema RFQ está completamente implementado y listo para uso en desarrollo. Incluye todas las funcionalidades principales para gestionar solicitudes de cotización, con validación robusta, sistema de notificaciones, y API RESTful completa.

La arquitectura modular permite fácil extensión y mantenimiento, mientras que la simulación de base de datos facilita el desarrollo y testing sin dependencias externas.

El sistema está preparado para integración con servicios reales de base de datos y email cuando se despliegue en producción.
