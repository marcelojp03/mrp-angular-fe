# 🗺️ Mapeo de Rutas del Menú API vs Componentes Frontend

## ✅ Estado de Implementación

### 📊 Dashboard (Inicio)
| Subrecurso | URL del Menú | Componente | Estado | Endpoint |
|------------|--------------|------------|--------|----------|
| Dashboard | `/dashboard` | `HomeComponent` | ✅ **IMPLEMENTADO** | GET `/api/dashboard/kpis`, GET `/api/dashboard/alerts` |

**Widgets:**
- ✅ StatsWidget (4 cards: Productos, Almacenes, Proveedores, Movimientos Hoy)
- ✅ StockAlertsWidget (Tabla de alertas de stock bajo con paginación)

---

### 📦 Inventario
| Subrecurso | URL del Menú | Componente | Estado | Endpoint |
|------------|--------------|------------|--------|----------|
| Productos | `/dashboard/products` | `ProductComponent` (lazy) | ✅ **IMPLEMENTADO** | GET/POST/PUT/DELETE `/api/products` |
| Almacenes | `/dashboard/warehouses` | `WarehousesComponent` (lazy) | ✅ **IMPLEMENTADO** | GET/POST/PUT/DELETE `/api/warehouses` |
| Movimientos | `/dashboard/movements` | `InventoryComponent` (lazy) | ✅ **IMPLEMENTADO** | GET/POST `/api/movements` |
| Stock Bajo | `/dashboard/stocks/low` | - | ❌ **FALTA CREAR** | GET `/api/stocks/low` |
| Sugerencias | `/dashboard/stocks/reorder-suggestions` | - | ❌ **FALTA CREAR** | GET `/api/stocks/reorder-suggestions` |

---

### 🏢 Proveedores
| Subrecurso | URL del Menú | Componente | Estado | Endpoint |
|------------|--------------|------------|--------|----------|
| Proveedores | `/dashboard/suppliers` | `SuppliersComponent` (lazy) | ✅ **IMPLEMENTADO** | GET/POST/PUT/DELETE `/api/suppliers` |
| Catálogo Proveedor | `/dashboard/suppliers/supplier-items` | - | ❌ **FALTA CREAR** | GET/POST/PUT/DELETE `/api/supplier-items` |

---

### 🏭 Producción
| Subrecurso | URL del Menú | Componente | Estado | Endpoint |
|------------|--------------|------------|--------|----------|
| Órdenes (demo) | `/dashboard/work-orders` | - | ❌ **FALTA CREAR** | Demo (sin endpoint backend) |

---

### 📈 Planificación
| Subrecurso | URL del Menú | Componente | Estado | Endpoint |
|------------|--------------|------------|--------|----------|
| Demanda | `/dashboard/demand` | - | ❌ **FALTA CREAR** | Sprint 3 |
| MPS | `/dashboard/mps` | - | ❌ **FALTA CREAR** | Sprint 3 |
| MRP | `/dashboard/mrp` | - | ❌ **FALTA CREAR** | Sprint 3 |

---

### 📊 Reportes
| Subrecurso | URL del Menú | Componente | Estado | Endpoint |
|------------|--------------|------------|--------|----------|
| Reportes IA | `/dashboard/reports/ai` | `AIReportsComponent` | ✅ **IMPLEMENTADO** | POST `/api/reports/nl` |
| Exportar CSV | `/dashboard/reports/csv` | - | ❌ **FALTA CREAR** | GET `/api/reports/products.csv`, `/api/reports/movements.csv` |

---

### ⚙️ Sistema
| Subrecurso | URL del Menú | Componente | Estado | Endpoint |
|------------|--------------|------------|--------|----------|
| Logs | `/dashboard/system/logs` | `SystemLogsComponent` | ✅ **IMPLEMENTADO** | GET `/api/logs?page=1&per_page=25` |
| Backup | `/dashboard/system/backup` | `BackupComponent` | ✅ **IMPLEMENTADO** | GET `/api/backup` |

---

### 👥 Administración
| Subrecurso | URL del Menú | Componente | Estado | Endpoint |
|------------|--------------|------------|--------|----------|
| Usuarios | `/dashboard/users` | `OrgUsersComponent` | ✅ **IMPLEMENTADO** | GET/POST/PUT/DELETE `/api/user-orgs` |
| Roles | `/dashboard/roles` | - | ❌ **FALTA CREAR** | GET/POST/PUT/DELETE `/api/roles` |
| Recursos/ACL | `/dashboard/acl` | - | ❌ **FALTA CREAR** | GET/POST/DELETE `/api/role-resources` |

---

## 📋 Resumen de Estado

### ✅ Componentes Implementados (9)
1. HomeComponent (Dashboard) - 2 widgets
2. ProductComponent (Productos)
3. WarehousesComponent (Almacenes)
4. InventoryComponent (Movimientos)
5. SuppliersComponent (Proveedores)
6. AIReportsComponent (Reportes IA)
7. SystemLogsComponent (Logs)
8. BackupComponent (Backup)
9. OrgUsersComponent (Usuarios)

### ❌ Componentes Faltantes (9)
1. StocksLowComponent - Stock bajo
2. ReorderSuggestionsComponent - Sugerencias de reposición
3. SupplierItemsComponent - Catálogo Proveedor
4. WorkOrdersComponent - Órdenes de producción (demo)
5. DemandComponent - Demanda (Sprint 3)
6. MPSComponent - Plan Maestro de Producción (Sprint 3)
7. MRPComponent - Requerimientos de Materiales (Sprint 3)
8. CSVExportComponent - Exportar CSV
9. RolesComponent - ABM Roles
10. ACLComponent - Recursos/ACL

---

## 🎯 Prioridades de Implementación

### 🔴 Alta Prioridad (Sprint 1 Core)
1. **StocksLowComponent** - Endpoint existe, es funcionalidad core
2. **ReorderSuggestionsComponent** - Endpoint existe, es funcionalidad core
3. **CSVExportComponent** - Endpoints existen (`/api/reports/products.csv`, `/api/reports/movements.csv`)

### 🟡 Media Prioridad (Administración)
4. **RolesComponent** - CRUD completo, endpoint existe
5. **ACLComponent** - Gestión de permisos, endpoint existe
6. **SupplierItemsComponent** - Relación proveedor-producto

### 🟢 Baja Prioridad (Demo/Sprint 3)
7. **WorkOrdersComponent** - Demo, puede ser placeholder
8. **DemandComponent** - Sprint 3
9. **MPSComponent** - Sprint 3
10. **MRPComponent** - Sprint 3

---

## 🔧 Tareas Pendientes

### Actualizar Rutas
```typescript
// dashboard.routes.ts
{ path: 'stocks/low', component: StocksLowComponent },
{ path: 'stocks/reorder-suggestions', component: ReorderSuggestionsComponent },
{ path: 'suppliers/supplier-items', component: SupplierItemsComponent },
{ path: 'work-orders', component: WorkOrdersComponent },
{ path: 'reports/csv', component: CSVExportComponent },
{ path: 'roles', component: RolesComponent },
{ path: 'acl', component: ACLComponent },
{ path: 'demand', component: DemandComponent },  // Sprint 3
{ path: 'mps', component: MPSComponent },  // Sprint 3
{ path: 'mrp', component: MRPComponent },  // Sprint 3
```

### Servicios Necesarios
```typescript
// stocks.service.ts (crear)
getStocksLow(): Observable<StocksLowResponse>
getReorderSuggestions(): Observable<ReorderSuggestionsResponse>

// reports.service.ts (actualizar)
exportProductsCSV(from?: string, to?: string): Observable<Blob>
exportMovementsCSV(from?: string, to?: string): Observable<Blob>

// roles.service.ts (crear)
getRoles(): Observable<RolesResponse>
createRole(role: Role): Observable<RoleResponse>
updateRole(id: number, role: Role): Observable<RoleResponse>
deleteRole(id: number): Observable<DeleteResponse>

// acl.service.ts (crear)
getRoleResources(): Observable<RoleResourcesResponse>
assignPermission(roleId: number, resourceId: number, subresourceId: number): Observable<Response>
revokePermission(roleId: number, resourceId: number, subresourceId: number): Observable<Response>
```

---

## 🚀 Recomendaciones

### Inmediato (Sesión actual)
1. Crear **StocksLowComponent** - Es parte del menú principal de inventario
2. Crear **ReorderSuggestionsComponent** - Funcionalidad crítica de MRP
3. Crear **CSVExportComponent** - Reportes básicos

### Corto Plazo
4. Crear **RolesComponent** - Administración básica
5. Crear **ACLComponent** - Control de acceso
6. Crear **SupplierItemsComponent** - Completar módulo proveedores

### Mediano Plazo (Sprint 3)
7. Módulo de Planificación completo (Demanda, MPS, MRP)
8. Órdenes de producción funcionales

---

## 📱 Suscripción en Topbar

Según tu solicitud, la suscripción se moverá al menú del topbar (junto a perfil y cerrar sesión).

**Tareas:**
1. Actualizar `app.topbar.ts` para agregar menú de usuario
2. Agregar opción "Mi Suscripción" con badge del plan actual
3. Mantener la ruta `/dashboard/subscription` funcional
4. El componente `SubscriptionComponent` ya está creado ✅

**Estructura del menú topbar:**
```typescript
userMenu = [
  { label: 'Mi Perfil', icon: 'pi pi-user', routerLink: '/dashboard/profile' },
  { label: 'Mi Suscripción', icon: 'pi pi-crown', routerLink: '/dashboard/subscription', badge: 'Pro' },
  { separator: true },
  { label: 'Cerrar Sesión', icon: 'pi pi-sign-out', command: () => this.logout() }
];
```

---

**Última actualización:** 25 de octubre de 2025
**Componentes Implementados:** 9/18 (50%)
**Endpoints Cubiertos:** ~60% del total
