# SI2 MRP - Sistema de Planificación de Recursos de Manufactura

## Descripción del Proyecto

Angular Frontend para el sistema MRP (Material Requirements Planning) desarrollado en la materia Sistemas de Información 2. Sistema integral para gestión de producción, inventario, almacenes, proveedores y reportería con IA.

---

## Stack Tecnológico

### Frontend
- **Angular 20**: Framework principal
- **PrimeNG 20**: Biblioteca de componentes UI
- **TypeScript 5.8**: Lenguaje de programación
- **TailwindCSS 3.4**: Framework de estilos
- **Chart.js**: Gráficos y visualizaciones
- **RxJS**: Programación reactiva
- **SweetAlert2**: Alertas y notificaciones

### Arquitectura
- **Standalone Components**: Sin módulos NgModule
- **Angular Signals**: Estado reactivo
- **Lazy Loading**: Carga diferida de módulos
- **HTTP Interceptors**: Manejo automático de tokens
- **Guards**: Protección de rutas

### Patrones de Diseño
- **Patrón A (CRUD)**: Componentes con operaciones completas
  - Stats cards opcionales
  - Toolbar con acciones
  - Dialog para crear/editar
  - Tabla con selección y acciones
  
- **Patrón B (Read-Only)**: Componentes de análisis
  - Stats cards opcionales
  - Sin toolbar (solo refresh en caption)
  - Vista de solo lectura
  - Exportación de datos

---

## Funcionalidades Implementadas

### Autenticación y Seguridad
- Login con OAuth2 + JWT
- Refresh token automático (sesiones de 7 días)
- Cambio de contraseña de usuario
- Reseteo de contraseña por admin
- Guards de protección de rutas
- Interceptors para manejo de tokens

### Gestión de Usuarios
- CRUD de usuarios por organización
- Asignación de roles múltiples
- Estados activo/inactivo
- Gestión de contraseñas
- Avatares personalizados

### Gestión de Roles y Permisos
- CRUD de roles
- Asignación de permisos granulares
- Control de acceso basado en roles (RBAC)
- Permisos por recurso (productos, almacenes, etc.)

### Gestión de Productos
- CRUD de productos
- Categorías y subcategorías
- Unidades de medida
- Precios y costos
- Imágenes de productos
- Stock mínimo y punto de reorden

### Gestión de Almacenes
- CRUD de almacenes
- Ubicaciones y capacidades
- Responsables por almacén
- Control de inventario por almacén

### Control de Inventario
- Vista consolidada de inventario
- Stock por almacén
- Movimientos de inventario (IN/OUT)
- Historial de movimientos
- Trazabilidad completa
- Alertas de stock bajo
- Sugerencias de reorden automáticas

### Gestión de Proveedores
- CRUD de proveedores
- Información de contacto
- Catálogo de productos por proveedor
- Lead time y precios especiales
- Historial de compras

### Módulo de Producción
- **BOMs (Bills of Materials)**
  - Listas de materiales multi-nivel
  - Componentes con cantidades
  - Unidades de medida específicas
  
- **Órdenes de Trabajo**
  - Creación basada en BOMs
  - Estados: Planificada, En Progreso, Finalizada, Cancelada
  - Asignación de responsables
  - Fechas de inicio/fin
  - Almacén de salida
  
- **Ejecución de Producción**
  - Panel operativo para piso de producción
  - Registro de avances
  - Control de recursos
  
- **Reportes de Producción**
  - Estadísticas generales
  - Top BOMs y productos
  - Producción mensual
  - Análisis de tendencias

### Reportería
- Reportes con IA (generación en lenguaje natural)
- Exportación a CSV
- Reportes de producción
- Estadísticas en tiempo real
- Gráficos interactivos

### Sistema
- Backup y restauración
- Logs del sistema
- Gestión de suscripciones
- Límites por plan

---

## Estructura del Proyecto

```
si2-mrp-fe/
├── src/
│   ├── app/
│   │   ├── auth/                    # Módulo de autenticación
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── interfaces/
│   │   │
│   │   ├── core/                    # Servicios core y utilidades
│   │   │   ├── guards/              # Guards de autenticación
│   │   │   ├── http/                # Interceptors HTTP
│   │   │   ├── layouts/             # Layout principal
│   │   │   ├── models/              # Modelos compartidos
│   │   │   └── services/            # Servicios core
│   │   │
│   │   ├── dashboard/               # Módulo principal
│   │   │   ├── components/
│   │   │   │   ├── home/            # Dashboard principal
│   │   │   │   ├── product/         # Gestión de productos
│   │   │   │   ├── inventory/       # Control de inventario
│   │   │   │   ├── warehouses/      # Gestión de almacenes
│   │   │   │   ├── suppliers/       # Gestión de proveedores
│   │   │   │   ├── movements/       # Movimientos de inventario
│   │   │   │   ├── production/      # Módulo de producción
│   │   │   │   │   ├── boms/        # Listas de materiales
│   │   │   │   │   ├── work-orders/ # Órdenes de trabajo
│   │   │   │   │   ├── execution/   # Ejecución de producción
│   │   │   │   │   └── reports/     # Reportes de producción
│   │   │   │   ├── stocks-low/      # Alertas de stock bajo
│   │   │   │   ├── reorder-suggestions/ # Sugerencias de reorden
│   │   │   │   ├── org-users/       # Gestión de usuarios
│   │   │   │   ├── roles/           # Gestión de roles
│   │   │   │   ├── ai-reports/      # Reportes con IA
│   │   │   │   ├── csv-export/      # Exportación CSV
│   │   │   │   ├── system-logs/     # Logs del sistema
│   │   │   │   ├── backup/          # Backup y restauración
│   │   │   │   └── subscription/    # Gestión de suscripción
│   │   │   └── dashboard.routes.ts
│   │   │
│   │   └── shared/                  # Componentes compartidos
│   │       ├── components/          # Componentes reutilizables
│   │       ├── services/            # Servicios compartidos
│   │       └── primeng.module.ts    # Módulo de PrimeNG
│   │
│   ├── assets/                      # Assets estáticos
│   ├── environments/                # Configuración por ambiente
│   └── styles/                      # Estilos globales
│
├── docs/                            # Documentación técnica
│   ├── COMPONENT_STANDARDS.md       # Estándares de componentes
│   ├── AUTENTICACION.md             # Sistema de autenticación
│   ├── REFRESH_TOKEN.md             # Sistema de refresh token
│   ├── ROUTE_MAPPING.md             # Mapeo de rutas
│   ├── IMPLEMENTATION_SUMMARY.md    # Resumen de implementación
│   └── PROJECT_INFO.md              # Este archivo
│
├── deploy/                          # Scripts de despliegue
│   ├── deploy-to-s3.ps1             # Script de deploy a S3
│   ├── DEPLOY_AWS.md                # Guía de despliegue
│   └── bucket-policy.json           # Política del bucket S3
│
├── angular.json                     # Configuración de Angular
├── package.json                     # Dependencias del proyecto
├── tailwind.config.js               # Configuración de Tailwind
├── tsconfig.json                    # Configuración de TypeScript
└── README.md                        # Guía de inicio rápido
```

---

## Integración con Backend

### Base URL
- **Desarrollo**: `http://localhost:4646/api`
- **Producción**: `https://[app-runner-url]/api`

### Endpoints Principales

#### Autenticación
- `POST /auth/login` - Login de usuario
- `POST /auth/refresh` - Renovar access token
- `PUT /auth/change-password` - Cambiar contraseña

#### Usuarios y Roles
- `GET /users` - Listar usuarios
- `POST /users` - Crear usuario
- `PUT /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario
- `PUT /users/:id/password` - Resetear contraseña (admin)
- `GET /roles` - Listar roles
- `POST /roles` - Crear rol

#### Productos
- `GET /products` - Listar productos
- `POST /products` - Crear producto
- `PUT /products/:id` - Actualizar producto
- `DELETE /products/:id` - Eliminar producto

#### Inventario
- `GET /inventory` - Inventario consolidado
- `GET /inventory/movements` - Historial de movimientos
- `POST /inventory/movements` - Registrar movimiento
- `GET /inventory/stocks/low` - Stock bajo
- `GET /inventory/reorder-suggestions` - Sugerencias de reorden

#### Producción
- `GET /production/boms` - Listar BOMs
- `POST /production/boms` - Crear BOM
- `GET /production/work-orders` - Listar órdenes de trabajo
- `POST /production/work-orders` - Crear orden de trabajo
- `PUT /production/work-orders/:id` - Actualizar orden
- `GET /production/reports` - Reportes de producción

---

## Despliegue

### AWS S3 Static Website
- **Bucket**: si2-mrp-fe
- **Región**: us-east-1
- **URL**: http://si2-mrp-fe.s3-website-us-east-1.amazonaws.com
- **Cache Strategy**:
  - Assets estáticos: 1 año
  - HTML/JSON: sin cache

### Comandos de Deploy
```bash
# Deploy completo (build + upload)
npm run deploy

# Deploy rápido (solo upload)
npm run deploy:quick

# Preview antes de deploy
npm run deploy:preview
```

---

## Configuración de Environments

### Development (environment.ts)
```typescript
export const environment = {
  production: false,
  backend: {
    host: 'http://localhost:4646/api'
  },
  oauth: {
    host: 'http://localhost:8585/api',
    // ...
  }
};
```

### Production (environment.prod.ts)
```typescript
export const environment = {
  production: true,
  backend: {
    host: 'https://[app-runner-url]/api'
  },
  oauth: {
    host: 'http://207.244.229.255:8510/api',
    // ...
  }
};
```

---

## Scripts NPM

| Script | Descripción |
|--------|-------------|
| `npm start` | Inicia servidor de desarrollo en puerto 4200 |
| `npm run build` | Build de desarrollo |
| `npm run build:prod` | Build de producción |
| `npm run watch` | Build con watch mode |
| `npm test` | Ejecuta tests unitarios |
| `npm run deploy` | Deploy completo a AWS S3 |
| `npm run deploy:quick` | Deploy rápido (sin build) |
| `npm run deploy:preview` | Preview del deploy |

---

## Equipo de Desarrollo

**Universidad Autónoma Gabriel René Moreno**  
Facultad de Ciencias Exactas y Tecnología  
Carrera de Ingeniería de Sistemas

**Materia**: Sistemas de Información 2  
**Semestre**: 2-2025  
**Proyecto**: Sistema MRP (Material Requirements Planning)

---

## Licencia

Este proyecto es desarrollado para fines académicos en la materia Sistemas de Información 2.

---

## Contacto y Soporte

Para preguntas o soporte relacionado con el proyecto, contactar al equipo de desarrollo a través de los canales oficiales de la materia.
