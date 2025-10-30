# 📋 LISTA COMPLETA DE ENDPOINTS - SPRINT 1, 2 & 3

## 🔐 AUTENTICACIÓN
**Base:** `/api/auth`

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | Login (retorna access_token, refresh_token y JWT con org_id) | ❌ Público |
| POST | `/api/auth/refresh` | Renovar access_token usando refresh_token | ❌ Público (requiere refresh_token) |

**Login Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Login Response:**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "token": "eyJhbGc...",           // Alias de access_token (compatibilidad)
    "access_token": "eyJhbGc...",   // Token de acceso (1 hora)
    "refresh_token": "eyJhbGc...",  // Token de refresco (7 días)
    "user": {
      "id": 1,
      "name": "Usuario",
      "email": "user@example.com",
      "status": true,
      "roles": [...]
    },
    "org_id": 1
  }
}
```

**Refresh Request (opción 1 - Header):**
```
Authorization: Bearer <refresh_token>
```

**Refresh Request (opción 2 - Body):**
```json
{
  "refresh_token": "eyJhbGc..."
}
```

**Refresh Response:**
```json
{
  "success": true,
  "message": "Token renovado",
  "data": {
    "access_token": "eyJhbGc...",  // Nuevo token de acceso (1 hora)
    "token": "eyJhbGc..."           // Alias (compatibilidad)
  }
}
```

---

## 👥 USUARIOS
**Base:** `/api/users`

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/users` | Listar usuarios | ✅ JWT |
| GET | `/api/users/:id` | Obtener usuario | ✅ JWT |
| POST | `/api/users` | Crear usuario | ✅ JWT |
| PUT | `/api/users/:id` | Actualizar usuario | ✅ JWT |
| DELETE | `/api/users/:id` | Eliminar usuario | ✅ JWT |

---

## 🏢 ORGANIZACIONES
**Base:** `/api/orgs`

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/orgs` | Listar organizaciones | ✅ JWT |
| GET | `/api/orgs/:id` | Obtener organización | ✅ JWT |
| POST | `/api/orgs` | Crear organización | ✅ JWT |

---

## 🔗 USUARIOS-ORGANIZACIONES
**Base:** `/api/user-orgs`

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/user-orgs` | Listar relaciones | ✅ JWT |
| POST | `/api/user-orgs` | Asignar usuario a org | ✅ JWT |
| PUT | `/api/user-orgs/:user_id/:org_id` | Actualizar relación | ✅ JWT |
| DELETE | `/api/user-orgs/:user_id/:org_id` | Eliminar relación | ✅ JWT |

---

## 👤 ROLES
**Base:** `/api/roles`

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/roles` | Listar roles | ✅ JWT |
| GET | `/api/roles/:id` | Obtener rol | ✅ JWT |
| POST | `/api/roles` | Crear rol | ✅ JWT |
| PUT | `/api/roles/:id` | Actualizar rol | ✅ JWT |
| DELETE | `/api/roles/:id` | Eliminar rol | ✅ JWT |

---

## 🔗 USUARIOS-ROLES
**Base:** `/api/user-roles`

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/user-roles` | Listar asignaciones | ✅ JWT |
| POST | `/api/user-roles` | Asignar rol a usuario | ✅ JWT |
| DELETE | `/api/user-roles/:user_id/:role_id` | Quitar rol de usuario | ✅ JWT |

---

## 📁 RECURSOS
**Base:** `/api/resources`

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/resources` | Listar recursos | ✅ JWT |
| GET | `/api/resources/:id` | Obtener recurso | ✅ JWT |
| POST | `/api/resources` | Crear recurso | ✅ JWT |
| PUT | `/api/resources/:id` | Actualizar recurso | ✅ JWT |
| DELETE | `/api/resources/:id` | Eliminar recurso | ✅ JWT |

---

## 📂 SUBRECURSOS
**Base:** `/api/subresources`

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/subresources` | Listar subrecursos | ✅ JWT |
| GET | `/api/subresources/:id` | Obtener subrecurso | ✅ JWT |
| POST | `/api/subresources` | Crear subrecurso | ✅ JWT |
| PUT | `/api/subresources/:id` | Actualizar subrecurso | ✅ JWT |
| DELETE | `/api/subresources/:id` | Eliminar subrecurso | ✅ JWT |

---

## 🔐 ROLES-RECURSOS (ACL)
**Base:** `/api/role-resources`

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/role-resources` | Listar permisos | ✅ JWT |
| POST | `/api/role-resources` | Asignar permiso | ✅ JWT |
| DELETE | `/api/role-resources/:role_id/:resource_id/:subresource_id` | Quitar permiso | ✅ JWT |

---

## 🍔 MENÚ (ACL)
**Base:** `/api/menu`

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/menu` | Obtener menú del usuario (recursos + subrecursos) | ✅ JWT |

---

## 📦 PRODUCTOS
**Base:** `/api/products`

| Método | Endpoint | Descripción | Autenticación | SaasGuard |
|--------|----------|-------------|---------------|-----------|
| GET | `/api/products` | Listar productos (filtrado por org_id) | ✅ JWT | ❌ |
| GET | `/api/products/:id` | Obtener producto | ✅ JWT | ❌ |
| POST | `/api/products` | Crear producto | ✅ JWT | ✅ assert_can_add_product |
| PUT | `/api/products/:id` | Actualizar producto | ✅ JWT | ❌ |
| DELETE | `/api/products/:id` | Eliminar producto (soft delete) | ✅ JWT | ❌ |
| POST | `/api/products/:id/reactivate` | Reactivar producto | ✅ JWT | ❌ |

**Límites por Plan:**
- Free: 50 productos
- Starter: 500 productos
- Pro: Ilimitado

---

## 🏭 ALMACENES (WAREHOUSES)
**Base:** `/api/warehouses`

| Método | Endpoint | Descripción | Autenticación | SaasGuard |
|--------|----------|-------------|---------------|-----------|
| GET | `/api/warehouses` | Listar almacenes (filtrado por org_id) | ✅ JWT | ❌ |
| GET | `/api/warehouses/:id` | Obtener almacén | ✅ JWT | ❌ |
| POST | `/api/warehouses` | Crear almacén | ✅ JWT | ✅ assert_can_add_warehouse |
| PUT | `/api/warehouses/:id` | Actualizar almacén | ✅ JWT | ❌ |
| DELETE | `/api/warehouses/:id` | Eliminar almacén | ✅ JWT | ❌ |

**Límites por Plan:**
- Free: 1 almacén
- Starter: 3 almacenes
- Pro: Ilimitado

---

## 🔄 MOVIMIENTOS
**Base:** `/api/movements`

| Método | Endpoint | Descripción | Autenticación | SaasGuard |
|--------|----------|-------------|---------------|-----------|
| GET | `/api/movements` | Listar movimientos (filtrado por org_id) | ✅ JWT | ❌ |
| POST | `/api/movements` | Registrar movimiento | ✅ JWT | ✅ assert_can_register_movement_today |

**Tipos de Movimiento:** IN, OUT, TRANSFER, ADJUST  
**Límites por Plan:**
- Free: 50 movimientos/día
- Starter: 500 movimientos/día
- Pro: Ilimitado

---

## 📊 STOCKS
**Base:** `/api/stocks`

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/stocks` | Obtener stock (por producto/almacén) | ✅ JWT |
| GET | `/api/stocks/low` | Productos con stock bajo | ✅ JWT |
| GET | `/api/stocks/reorder-suggestions` | Sugerencias de reorden | ✅ JWT |

---

## 📦🏭 PRODUCTOS-ALMACENES
**Base:** `/api/product-warehouses`

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/product-warehouses` | Listar relaciones producto-almacén | ✅ JWT |
| POST | `/api/product-warehouses` | Asignar producto a almacén | ✅ JWT |
| PUT | `/api/product-warehouses/:product_id/:warehouse_id` | Actualizar relación | ✅ JWT |

---

## 🏢 PROVEEDORES
**Base:** `/api/suppliers`

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/suppliers` | Listar proveedores (filtrado por org_id) | ✅ JWT |
| GET | `/api/suppliers/:id` | Obtener proveedor | ✅ JWT |
| POST | `/api/suppliers` | Crear proveedor | ✅ JWT |
| PUT | `/api/suppliers/:id` | Actualizar proveedor | ✅ JWT |
| DELETE | `/api/suppliers/:id` | Eliminar proveedor (soft delete) | ✅ JWT |

---

## 🏢📦 PROVEEDORES-PRODUCTOS
**Base:** `/api/supplier-items`

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/supplier-items` | Listar items de proveedores | ✅ JWT |
| GET | `/api/supplier-items/:id` | Obtener item | ✅ JWT |
| POST | `/api/supplier-items` | Crear item | ✅ JWT |
| PUT | `/api/supplier-items/:id` | Actualizar item | ✅ JWT |
| DELETE | `/api/supplier-items/:id` | Eliminar item | ✅ JWT |

---

## 📏 UNIDADES
**Base:** `/api/units`

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/units` | Listar unidades | ✅ JWT |
| GET | `/api/units/:id` | Obtener unidad | ✅ JWT |
| POST | `/api/units` | Crear unidad | ✅ JWT |
| PUT | `/api/units/:id` | Actualizar unidad | ✅ JWT |
| DELETE | `/api/units/:id` | Eliminar unidad | ✅ JWT |

---

## 📊 DASHBOARD
**Base:** `/api/dashboard`

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/dashboard/kpis` | KPIs generales y de producción | ✅ JWT (@auth_required) |
| GET | `/api/dashboard/alerts` | Alertas del sistema | ✅ JWT (@auth_required) |

### GET `/api/dashboard/kpis`
Obtiene métricas clave del sistema filtradas por organización.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Params:** Ninguno

**Response 200 OK:**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "total_products": 12,
    "low_stock_count": 3,
    "movements_today": 5,
    "work_orders_active": 2,
    "work_orders_finished_today": 1,
    "materials_consumed_today": 45.5,
    "plan_adherence": 0.92
  }
}
```

**Descripción de KPIs:**
- `total_products`: Total de productos activos en la organización
- `low_stock_count`: Productos con stock por debajo de min_stock
- `movements_today`: Total de movimientos registrados hoy
- `work_orders_active`: Órdenes de producción en estado "En Progreso"
- `work_orders_finished_today`: Órdenes finalizadas hoy
- `materials_consumed_today`: Cantidad total de materiales consumidos hoy (movimientos OUT tipo WO)
- `plan_adherence`: Adherencia al plan (mock 0.92, implementar en S4)

**Notas:**
- Si el usuario no tiene rol "Planner", el campo `plan_adherence` no se incluye
- Todos los datos están filtrados por `org_id` del token JWT

---

### GET `/api/dashboard/alerts`
Obtiene alertas del sistema (stock bajo, notificaciones, etc).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Params:** Ninguno

**Response 200 OK:**
```json
{
  "success": true,
  "message": "OK",
  "data": [
    {
      "type": "LOW_STOCK",
      "message": "SKU FG-001 por debajo de min_stock",
      "severity": "warning"
    },
    {
      "type": "INFO",
      "message": "3 movimientos registrados hoy",
      "severity": "info"
    }
  ]
}
```

**Tipos de Alerta:**
- `LOW_STOCK`: Productos con stock crítico
- `INFO`: Información general
- `WARNING`: Advertencias del sistema
- `ERROR`: Errores críticos

**Niveles de Severidad:**
- `info`: Informativa
- `warning`: Advertencia (acción recomendada)
- `error`: Error crítico (acción requerida)

---

## 📄 REPORTES CSV
**Base:** `/api/reports`

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/reports/products.csv` | Exportar productos a CSV | ✅ JWT |
| GET | `/api/reports/movements.csv` | Exportar movimientos a CSV | ✅ JWT |

**Query Params:** `?from=YYYY-MM-DD&to=YYYY-MM-DD`

---

## 🤖 REPORTES IA
**Base:** `/api/reports`

| Método | Endpoint | Descripción | Autenticación | SaasGuard |
|--------|----------|-------------|---------------|-----------|
| POST | `/api/reports/nl` | Generar reporte desde lenguaje natural | ✅ JWT | ✅ assert_can_ai_reports_today |

**Request Body:**
```json
{
  "query": "¿cuántos productos tengo en el almacén principal?",
  "format": "json",  // o "csv"
  "dry_run": false
}
```

**Límites por Plan:**
- Free: 5 reportes/día
- Starter: 50 reportes/día
- Pro: 200 reportes/día

---

## 💾 BACKUP
**Base:** `/api/backup`

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/backup` | Backup completo JSON de todas las tablas | ✅ JWT |

**Tablas incluidas:**
- Con org_id: filtradas por organización
- Sin org_id: datos completos (planes, roles, recursos, unidades)

---

## 📝 LOGS
**Base:** `/api/logs`

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/logs` | Listar logs del sistema | ✅ JWT |

**Query Params:** `?page=1&per_page=25`

---

## 🌍 PÚBLICOS (Sin autenticación)
**Base:** `/api/public`

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/public/plans` | Listar planes SaaS disponibles | ❌ Público |
| POST | `/api/public/signup` | Registro de nueva organización | ❌ Público |

**Signup crea:**
- Organization
- User (primer usuario, Admin)
- OrgSubscription (plan Free con trial 14 días)
- Warehouse (almacén principal)
- UserOrganization (relación user-org)
- UserRole (rol Admin)

---

## 💳 SUSCRIPCIÓN
**Base:** `/api/subscription`

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/subscription` | Información de suscripción, plan y uso | ✅ JWT (@auth_required) |

### GET `/api/subscription`
Obtiene información completa de la suscripción, plan, límites y uso actual de la organización.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Params:** Ninguno

**Response 200 OK:**
```json
{
  "success": true,
  "message": "Información de suscripción",
  "data": {
    "organization": {
      "id": 1,
      "name": "Acme S.A.",
      "code": "ACME"
    },
    "subscription": {
      "id": 2,
      "status": "active",
      "started_at": "2025-10-24T20:51:28.153393",
      "trial_until": "2025-11-07T20:51:28.151310",
      "is_trial": true,
      "trial_days_remaining": 11
    },
    "plan": {
      "id": 1,
      "code": "free",
      "name": "Free",
      "is_active": true,
      "limits": {
        "max_products": 50,
        "max_warehouses": 1,
        "max_users": 3,
        "max_movements_per_day": 50,
        "max_ai_reports_per_day": 10
      },
      "features": {
        "allow_bom": false,
        "allow_work_orders": false,
        "allow_mrp": false,
        "allow_forecast": false
      }
    },
    "usage": {
      "products": {
        "current": 10,
        "limit": 50,
        "percentage": 20.0
      },
      "warehouses": {
        "current": 3,
        "limit": 1,
        "percentage": 300.0
      },
      "movements_today": {
        "current": 0,
        "limit": 50,
        "percentage": 0.0
      }
    }
  }
}
```

**Response 404 Not Found:**
```json
{
  "success": false,
  "message": "No hay suscripción activa",
  "data": null,
  "code": null
}
```

**Descripción de campos:**
- `organization`: Datos básicos de la organización
- `subscription`: Estado de la suscripción y trial
  - `status`: active | canceled | past_due
  - `is_trial`: true si está en periodo de prueba
  - `trial_days_remaining`: Días restantes de trial (null si no aplica)
- `plan`: Detalles del plan contratado
  - `limits`: Límites máximos permitidos
  - `features`: Features habilitadas (BOMs, Work Orders, MRP, Forecast)
- `usage`: Uso actual vs límites
  - `percentage`: Porcentaje de uso (puede exceder 100%)

**Ejemplo de uso en frontend:**
```typescript
// subscription.component.ts
loadSubscription() {
  const token = localStorage.getItem('access_token');
  
  this.http.get('http://localhost:4646/api/subscription', {
    headers: { 'Authorization': `Bearer ${token}` }
  }).subscribe((response: any) => {
    const data = response.data;
    
    this.organization = data.organization;
    this.plan = data.plan;
    this.subscription = data.subscription;
    this.usage = data.usage;
    
    // Mostrar alertas si se exceden límites
    if (data.usage.warehouses.percentage > 100) {
      this.showWarning('Has excedido el límite de almacenes');
    }
    
    // Mostrar días de trial restantes
    if (data.subscription.is_trial) {
      this.trialDays = data.subscription.trial_days_remaining;
    }
  });
}
```

---

## ❤️ HEALTH CHECK
**Base:** `/api/health`

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/health` | Estado del servidor | ❌ Público |

---

## 🏭 PRODUCCIÓN (SPRINT 3)

### 📋 BOMs (Bill of Materials - Lista de Materiales)
**Base:** `/api/boms`

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/boms` | Listar BOMs (filtros: product_id, is_active) | ✅ JWT |
| GET | `/api/boms/:id` | Obtener BOM con componentes | ✅ JWT |
| POST | `/api/boms` | Crear BOM con componentes | ✅ JWT |
| PUT | `/api/boms/:id` | Actualizar BOM (solo si inactiva) | ✅ JWT |
| PUT | `/api/boms/:id/activate` | Activar versión de BOM | ✅ JWT |
| DELETE | `/api/boms/:id` | Eliminar BOM (solo si inactiva y sin OPs) | ✅ JWT |

**Estructura BOM:**
```json
{
  "product_id": 7,
  "version": "1.0",
  "is_active": false,
  "description": "BOM estándar",
  "components": [
    {
      "component_id": 3,
      "quantity": 4.0,
      "scrap_percentage": 5.0,
      "unit_id": 1,
      "sequence": 1,
      "notes": "Tableros principales"
    }
  ]
}
```

**Validaciones:**
- No permite recursividad (producto no puede ser su propio componente)
- Todos los componentes deben existir en la misma organización
- Solo una BOM activa por producto
- No se puede modificar componentes de BOM activa (crear nueva versión)

---

### � WORK ORDERS (Órdenes de Producción)
**Base:** `/api/work-orders`

| Método | Endpoint | Descripción | Autenticación | SaasGuard |
|--------|----------|-------------|---------------|-----------|
| GET | `/api/work-orders` | Listar órdenes (filtros: status, product_id, assigned_to) | ✅ JWT | ❌ |
| GET | `/api/work-orders/:id` | Obtener orden específica | ✅ JWT | ❌ |
| POST | `/api/work-orders` | Crear orden (estado: Planificada) | ✅ JWT | ❌ |
| PUT | `/api/work-orders/:id/start` | Iniciar producción | ✅ JWT | ✅ |
| PUT | `/api/work-orders/:id/finish` | Finalizar producción | ✅ JWT | ✅ |
| PUT | `/api/work-orders/:id/cancel` | Cancelar orden | ✅ JWT | ❌ |

**Estados de Work Order:**
- `Planificada`: Orden creada, pendiente de inicio
- `En Progreso`: Materiales consumidos, en producción
- `Finalizada`: Producción completada, stock actualizado
- `Cancelada`: Orden cancelada (solo si está Planificada)

**Flujo Completo:**
1. **Crear OP:** Requiere BOM activa del producto
   ```json
   {
     "product_id": 7,
     "quantity": 10,
     "warehouse_id": 1,
     "assigned_to": 4,
     "reference": "OP-2025-001",
     "notes": "Orden urgente",
     "planned_start": "2025-10-28",
     "planned_end": "2025-10-30"
   }
   ```

2. **Iniciar (/start):**
   - Valida stock suficiente de TODOS los componentes
   - Calcula cantidades incluyendo scrap: `qty_needed = qty_base * (1 + scrap%/100)`
   - Genera movimientos OUT automáticos de cada componente
   - Actualiza stock en product_warehouse
   - Cambia estado a "En Progreso"
   - Registra actual_start

3. **Finalizar (/finish):**
   - Genera movimiento IN del producto terminado
   - Actualiza stock del producto final
   - Cambia estado a "Finalizada"
   - Registra actual_end
   - Permite override de cantidad producida:
   ```json
   {
     "produced_quantity": 9.5
   }
   ```

**Trazabilidad:**
- Todos los movimientos llevan `reference_type="WO"` y `reference_id=<work_order_id>`
- CSV de movimientos incluye columnas de referencia
- Dashboard muestra KPIs de producción

---

## 📊 DASHBOARD (ACTUALIZADO S3)
**Base:** `/api/dashboard`

Los endpoints de dashboard incluyen ahora métricas de producción del Sprint 3.

Ver sección [📊 DASHBOARD](#-dashboard) arriba para documentación completa.

**KPIs Nuevos en S3:**
- `work_orders_active`: Órdenes de producción activas (estado "En Progreso")
- `work_orders_finished_today`: Órdenes finalizadas hoy
- `materials_consumed_today`: Total de materiales consumidos (movimientos OUT tipo WO)

**Ejemplo de uso en frontend:**
```typescript
this.http.get('http://localhost:4646/api/dashboard/kpis', {
  headers: { 'Authorization': `Bearer ${token}` }
}).subscribe((response: any) => {
  const kpis = response.data;
  console.log('Productos:', kpis.total_products);
  console.log('Stock bajo:', kpis.low_stock_count);
  console.log('OPs activas:', kpis.work_orders_active);
  console.log('Materiales consumidos:', kpis.materials_consumed_today);
});
```

---

## 📄 REPORTES CSV (ACTUALIZADO S3)
**Base:** `/api/reports`

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/reports/products.csv` | Exportar productos a CSV | ✅ JWT |
| GET | `/api/reports/movements.csv` | Exportar movimientos a CSV (incluye ref WO) | ✅ JWT |

**Columnas Nuevas en movements.csv:**
- `Tipo Referencia`: WO, PO, SO, ADJ, TRANSFER, RETURN
- `ID Referencia`: ID de la orden/documento relacionado

**Query Params:** `?from=YYYY-MM-DD&to=YYYY-MM-DD`

---

## �📈 RESUMEN

### SPRINT 1 - Core MRP (20 blueprints)
- Autenticación (login, refresh)
- Usuarios, Roles, Organizaciones
- ACL (Recursos, Subrecursos, Permisos)
- Productos, Almacenes, Movimientos, Stocks
- Proveedores, Unidades
- Dashboard

### SPRINT 2 - SaaS Multi-Tenant (7 blueprints)
- Público (signup, planes)
- Menú dinámico (ACL)
- Reportes (CSV, IA con OpenAI)
- Backup (JSON completo)
- Logs del sistema
- Health check

### SPRINT 3 - Producción (2 blueprints) ✨ NUEVO
- **BOMs** - Lista de Materiales con componentes y scrap
- **Work Orders** - Órdenes de producción con ciclo completo:
  - Creación → Validación de stock → Consumo de materiales → Producción → Stock final
- **Trazabilidad** - Movimientos referenciados a OPs
- **Dashboard** - KPIs de producción en tiempo real
- **Exportación** - CSV con referencias de producción

### SEGURIDAD IMPLEMENTADA
- ✅ 30+ endpoints con JWT (2 nuevos en S3)
- ✅ org_id en JWT payload (no manipulable)
- ✅ Filtrado por organización en todos los endpoints
- ✅ SaasGuard en Work Orders (start/finish)
- ✅ ACL por subrecursos (4 nuevos en S3)

### ESTRUCTURA DE MENÚ (S1-S3)
| Recurso | Subrecursos Sprint 3 |
|---------|----------------------|
| **Producción** | Lista de Materiales, Órdenes de Producción, Ejecución, Reportes Producción |
| **Inicio** | Dashboard (con KPIs producción) |
| **Inventario** | Movimientos (con ref WO) |

### PERMISOS POR ROL (S3)
| Rol | Acceso Producción |
|-----|-------------------|
| **Admin** | Todos los subrecursos |
| **Planner** | Lista de Materiales, Órdenes de Producción, Reportes Producción |
| **Supervisor** | Órdenes de Producción, Reportes Producción |
| **Operator** | Ejecución (iniciar/finalizar OPs) |

### SAAS LIMITS
| Feature | Free | Starter | Pro |
|---------|------|---------|-----|
| Productos | 50 | 500 | ∞ |
| Almacenes | 1 | 3 | ∞ |
| Movimientos/día | 50 | 500 | ∞ |
| Reportes IA/día | 5 | 50 | 200 |
| Usuarios | 3 | 10 | 50 |

---

**TOTAL ENDPOINTS:** 78+ (6 nuevos en S3)  
**BLUEPRINTS:** 29 (2 nuevos: bom_controller, work_order_controller)  
**AUTENTICACIÓN:** JWT (Flask-JWT-Extended)  
**BASE URL:** `http://localhost:4646`

---

## 🎯 PRÓXIMOS SPRINTS

### SPRINT 4 - Planificación Avanzada (Pendiente)
- Gestión de Demanda
- MPS (Master Production Schedule)
- MRP (Material Requirements Planning)
- Propuestas de compra/producción
- Comparación Plan vs Ejecución

### SPRINT 5 - Analytics & Mobile (Pendiente)
- Forecasting con IA
- Sistema de Alertas avanzado
- Dashboard analítico
- App Móvil (PWA)
