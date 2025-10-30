# 📐 Estándares de Componentes - MRP Angular

> **Versión 2.0** - Patrones unificados con StatsCard reutilizable

---

## 🎨 **COMPONENTE UNIFICADO: `<app-stats-card>`**

### ✅ Diseño Basado en el Dashboard Principal (Home)

**Ubicación:** `src/app/shared/components/stats-card.component.ts`

**Por qué usar este componente:**
- 🎨 **Diseño elegante** con icono circular y fondo de color
- 🌙 **Excelente dark mode** (`bg-{color}-100 dark:bg-{color}-400/10`)
- 🔄 **Reutilizable** en ambos patrones (A y B)
- 📊 **8 colores predefinidos** para diferentes contextos
- ✅ **Mejor que cards inline** (más consistente y mantenible)

### 📝 Uso del Componente

```typescript
// 1. Importar en el componente
import { StatsCardComponent, type StatCardConfig } from '../../../shared/components/stats-card.component';

@Component({
  imports: [CommonModule, StatsCardComponent, /* otros */],
})
export class MiComponente {
  // 2. Crear computed signal con las stats
  statsCards = computed<StatCardConfig[]>(() => {
    const data = this.items();
    return [
      {
        label: 'Total Items',      // Título de la card
        value: data.length,         // Valor numérico o string
        icon: 'pi-box',             // Icono de PrimeIcons (sin 'pi')
        color: 'blue',              // Color: blue, green, red, orange, purple, cyan, pink, yellow
        footer: 'Registrados',      // Texto inferior (opcional)
        footerClass: 'text-primary font-medium' // Clases del footer (opcional)
      },
      {
        label: 'Activos',
        value: data.filter(i => i.status).length,
        icon: 'pi-check-circle',
        color: 'green',
        footer: 'Disponibles',
        footerClass: 'text-green-500 font-medium'
      }
    ];
  });
}
```

```html
<!-- 3. Usar en el template -->
<div class="grid grid-cols-12 gap-6">
  @for (stat of statsCards(); track stat.label) {
    <div class="col-span-12 md:col-span-6 lg:col-span-3">
      <app-stats-card [config]="stat" />
    </div>
  }
</div>
```

### 🎨 Colores Disponibles

| Color | Light Mode | Dark Mode | Uso Recomendado |
|-------|-----------|-----------|-----------------|
| `blue` | `bg-blue-100` | `bg-blue-400/10` | Totales, contadores generales |
| `green` | `bg-green-100` | `bg-green-400/10` | Activos, éxitos, disponibles |
| `red` | `bg-red-100` | `bg-red-400/10` | Alertas, urgentes, críticos |
| `orange` | `bg-orange-100` | `bg-orange-400/10` | Advertencias, cantidades |
| `purple` | `bg-purple-100` | `bg-purple-400/10` | Categorías especiales |
| `cyan` | `bg-cyan-100` | `bg-cyan-400/10` | Información, datos |
| `pink` | `bg-pink-100` | `bg-pink-400/10` | Destacados |
| `yellow` | `bg-yellow-100` | `bg-yellow-400/10` | Pendientes |

### ✅ Ventajas vs Cards Inline

| Aspecto | StatsCard Component | Cards Inline (antiguo) |
|---------|---------------------|------------------------|
| **Diseño** | ✅ Icono circular elegante | ❌ Borde lateral simple |
| **Dark Mode** | ✅ `bg-blue-400/10` (mejor contraste) | ❌ `bg-blue-900/20` (muy oscuro) |
| **Mantenibilidad** | ✅ Cambio en 1 archivo = todos actualizados | ❌ Cambio en cada componente |
| **Consistencia** | ✅ Mismo diseño que dashboard | ❌ Diseños divergentes |
| **Código** | ✅ Menos HTML repetido | ❌ Mucho HTML duplicado |

---

## 🔍 Dos Patrones Fundamentales

### �️ **Patrón A: CRUD Completo** 
**Casos de uso:** Productos, Almacenes, Proveedores, Roles, Usuarios
- ✅ Crear, Editar, Eliminar
- ✅ Toolbar con acciones
- ✅ Dialog formulario
- ✅ Selección múltiple
- ⚠️ Stats cards opcionales

**Ejemplos:** `product-list`, `warehouses`, `suppliers`

### 🅱️ **Patrón B: Solo Lectura + Análisis**
**Casos de uso:** Sugerencias, Stock Bajo, Reportes, Logs
- ✅ Solo lectura
- ✅ Stats cards (4 KPIs)
- ✅ Botón refresh/actualizar
- ❌ Sin Dialog CRUD
- ❌ Sin selección múltiple

**Ejemplos:** `reorder-suggestions`, `stocks-low`, `system-logs`

---

## 🎨 Patrón A: CRUD Completo

---

## 🎨 Patrón A: CRUD Completo

### Layout HTML

```html
<div class="grid grid-cols-12 gap-6">
  <!-- Header Card -->
  <div class="col-span-12">
    <div class="card">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-3xl font-bold text-surface-900 dark:text-surface-0 m-0">
            <i class="pi pi-box mr-2 text-primary"></i>
            Gestión de Productos
          </h2>
          <p class="text-muted-color mt-2">Administra el catálogo de productos</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Stats Cards (OPCIONAL - usar <app-stats-card>) -->
  @for (stat of statsCards(); track stat.label) {
    <div class="col-span-12 md:col-span-6 lg:col-span-3">
      <app-stats-card [config]="stat" />
    </div>
  }
  <div class="col-span-12 md:col-span-6 lg:col-span-3">
    <div class="card bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-muted-color text-sm mb-1">Total Productos</p>
          <p class="text-3xl font-bold text-blue-600">{{ items().length }}</p>
        </div>
        <i class="pi pi-box text-4xl text-blue-500 opacity-50"></i>
      </div>
    </div>
  </div>

  <!-- Toolbar + Table Card -->
  <div class="col-span-12">
    <div class="card">
      <!-- Toolbar -->
      <p-toolbar styleClass="mb-6">
        <ng-template #start>
          <p-button label="Nuevo" icon="pi pi-plus" (onClick)="openNew()" />
          <p-button label="Eliminar" icon="pi pi-trash" severity="danger" 
                    outlined (onClick)="deleteSelected()" 
                    [disabled]="!selectedItems?.length" />
        </ng-template>
        <ng-template #end>
          <p-button label="Exportar" icon="pi pi-upload" (onClick)="exportCSV()" />
        </ng-template>
      </p-toolbar>

      <!-- Table -->
      <p-table
        #dt
        [value]="items()"
        [rows]="10"
        [paginator]="true"
        [rowsPerPageOptions]="[10, 25, 50]"
        [showCurrentPageReport]="true"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords}"
        [globalFilterFields]="['code', 'name']"
        [(selection)]="selectedItems"
        [rowHover]="true"
        dataKey="id"
      >
        <ng-template #caption>
          <div class="flex items-center justify-between">
            <h5 class="m-0">Lista de Items</h5>
            <p-iconfield>
              <p-inputicon styleClass="pi pi-search" />
              <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" 
                     placeholder="Buscar..." />
            </p-iconfield>
          </div>
        </ng-template>
        
        <ng-template #header>
          <tr>
            <th style="width: 3rem"><p-tableHeaderCheckbox /></th>
            <th pSortableColumn="code">Código <p-sortIcon field="code" /></th>
            <th pSortableColumn="name">Nombre <p-sortIcon field="name" /></th>
            <th class="text-center">Estado</th>
            <th class="text-center" style="min-width: 12rem">Acciones</th>
          </tr>
        </ng-template>
        
        <ng-template #body let-item>
          <tr>
            <td><p-tableCheckbox [value]="item" /></td>
            <td><span class="font-medium">{{ item.code }}</span></td>
            <td>{{ item.name }}</td>
            <td class="text-center">
              <p-tag [value]="item.status ? 'Activo' : 'Inactivo'" 
                     [severity]="item.status ? 'success' : 'danger'" />
            </td>
            <td class="text-center">
              <div class="flex gap-2 justify-center">
                <p-button icon="pi pi-pencil" [rounded]="true" [outlined]="true" 
                          (click)="edit(item)" pTooltip="Editar" />
                <p-button icon="pi pi-trash" severity="danger" [rounded]="true" 
                          [outlined]="true" (click)="delete(item)" pTooltip="Eliminar" />
              </div>
            </td>
          </tr>
        </ng-template>
        
        <ng-template #emptymessage>
          <tr>
            <td colspan="5" class="text-center py-8">
              <i class="pi pi-inbox text-4xl text-muted-color mb-3 block"></i>
              <p class="text-muted-color">No hay productos disponibles</p>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  </div>
</div>

<!-- Dialog CRUD -->
<p-dialog [(visible)]="itemDialog" [style]="{width: '650px'}" 
          [header]="currentItem()?.id ? 'Editar Item' : 'Nuevo Item'" [modal]="true">
  <ng-template #content>
    <div class="flex flex-col gap-6">
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12 md:col-span-6">
          <label for="code" class="block font-bold mb-3">Código</label>
          <input type="text" pInputText id="code" [(ngModel)]="currentItem().code" 
                 required autofocus fluid />
          <small class="text-red-500" *ngIf="submitted && !currentItem().code">
            El código es requerido
          </small>
        </div>
        <div class="col-span-12 md:col-span-6">
          <label for="name" class="block font-bold mb-3">Nombre</label>
          <input type="text" pInputText id="name" [(ngModel)]="currentItem().name" 
                 required fluid />
        </div>
      </div>
    </div>
  </ng-template>
  <ng-template #footer>
    <p-button label="Cancelar" icon="pi pi-times" text (click)="hideDialog()" />
    <p-button label="Guardar" icon="pi pi-check" (click)="save()" />
  </ng-template>
</p-dialog>

<!-- Confirm Dialog -->
<p-confirmdialog [style]="{width: '450px'}" />
<p-toast />
```

---

## 🎨 Patrón B: Solo Lectura + Análisis

### Layout HTML

```html
<p-toast />

<div class="grid grid-cols-12 gap-6">
  <!-- Header Card -->
  <div class="col-span-12">
    <div class="card">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-3xl font-bold text-surface-900 dark:text-surface-0 m-0">
            <i class="pi pi-chart-line mr-2 text-blue-500"></i>
            Sugerencias de Reposición
          </h2>
          <p class="text-muted-color mt-2">
            Recomendaciones automáticas basadas en stock mínimo
          </p>
        </div>
        <button pButton icon="pi pi-refresh" label="Actualizar" 
                class="p-button-outlined" (click)="loadData()" [loading]="loading()" />
      </div>
    </div>
  </div>

  <!-- Stats Cards (OBLIGATORIAS - usar <app-stats-card>) -->
  @for (stat of statsCards(); track stat.label) {
    <div class="col-span-12 md:col-span-6 lg:col-span-3">
      <app-stats-card [config]="stat" />
    </div>
  }

  <!-- Table Card -->
    <div class="card bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-muted-color text-sm mb-1">Urgentes</p>
          <p class="text-3xl font-bold text-red-600">{{ getUrgentCount() }}</p>
        </div>
        <i class="pi pi-exclamation-triangle text-4xl text-red-500 opacity-50"></i>
      </div>
    </div>
  </div>

  <!-- Table Card -->
  <div class="col-span-12">
    <div class="card">
      @if (loading()) {
        <div class="text-center py-8">
          <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
          <p class="text-muted-color mt-4">Cargando datos...</p>
        </div>
      } @else if (items() && items().length > 0) {
        <p-table
          [value]="items()"
          [rows]="10"
          [paginator]="true"
          [rowsPerPageOptions]="[10, 25, 50]"
          [showCurrentPageReport]="true"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords}"
          [globalFilterFields]="['code', 'name']"
        >
          <ng-template #header>
            <tr>
              <th pSortableColumn="code">Código <p-sortIcon field="code" /></th>
              <th pSortableColumn="name">Nombre <p-sortIcon field="name" /></th>
              <th class="text-right">Cantidad</th>
              <th class="text-center">Estado</th>
            </tr>
          </ng-template>
          <ng-template #body let-item>
            <tr>
              <td><span class="font-medium">{{ item.code }}</span></td>
              <td>{{ item.name }}</td>
              <td class="text-right">{{ item.quantity }}</td>
              <td class="text-center">
                <p-tag [value]="item.status" [severity]="getSeverity(item.status)" />
              </td>
            </tr>
          </ng-template>
          <ng-template #emptymessage>
            <tr>
              <td colspan="4" class="text-center py-8">
                <i class="pi pi-check-circle text-4xl text-green-500 mb-3 block"></i>
                <p class="text-muted-color">No hay datos disponibles</p>
              </td>
            </tr>
          </ng-template>
        </p-table>
      } @else {
        <div class="text-center py-8">
          <i class="pi pi-check-circle text-6xl text-green-500 mb-4 block"></i>
          <h3 class="text-xl font-semibold text-surface-900 dark:text-surface-0 mb-2">
            ¡Todo está bien!
          </h3>
          <p class="text-muted-color">No hay alertas en este momento</p>
        </div>
      }
    </div>
  </div>
</div>
```

---

## 📋 Tabla Comparativa de Patrones

| Característica | Patrón A (CRUD) | Patrón B (Read-Only) |
|----------------|----------------|----------------------|
| **Grid cols-12** | ✅ Sí | ✅ Sí |
| **Header card** | ✅ Sí | ✅ Sí |
| **Stats cards** | ⚠️ Opcionales | ✅ Obligatorias (4) |
| **Toolbar** | ✅ Con acciones CRUD | ❌ No |
| **Table selección** | ✅ Checkbox múltiple | ❌ Solo lectura |
| **Dialog CRUD** | ✅ Formulario | ❌ No |
| **ConfirmDialog** | ✅ Para eliminar | ❌ No |
| **Export CSV** | ✅ Sí | ⚠️ Opcional |
| **Botón refresh** | ⚠️ Opcional | ✅ En header card |
| **Loading state** | ⚠️ Opcional | ✅ Con spinner |
| **Empty state** | ✅ Simple | ✅ Elaborado con ícono |

---

## 🧩 TypeScript: Patrón A (CRUD)
  <!-- 1. Header Card -->
  <div class="col-span-12">
    <div class="card">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-3xl font-bold text-surface-900 dark:text-surface-0 m-0">
            <i class="pi pi-icon mr-2 text-primary"></i>
            Título del Módulo
          </h2>
          <p class="text-muted-color mt-2">Descripción breve</p>
        </div>
        <div class="flex gap-2">
          <button pButton icon="pi pi-plus" label="Nuevo" (click)="openNew()" />
          <button pButton icon="pi pi-refresh" (click)="refresh()" />
        </div>
      </div>
    </div>
  </div>

  <!-- 2. Stats Cards (opcional, si hay KPIs) -->
  @if (showStats) {
    <div class="col-span-12 md:col-span-6 lg:col-span-3">
      <div class="card bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-muted-color text-sm mb-1">Métrica</p>
            <p class="text-3xl font-bold text-blue-600">{{ value }}</p>
          </div>
          <i class="pi pi-icon text-4xl text-blue-500 opacity-50"></i>
        </div>
      </div>
    </div>
  }

  <!-- 3. Toolbar + Table Card -->
  <div class="col-span-12">
    <div class="card">
      <!-- Toolbar -->
      <p-toolbar styleClass="mb-6">
        <ng-template #start>
          <p-button label="Nuevo" icon="pi pi-plus" (onClick)="openNew()" />
          <p-button label="Eliminar" icon="pi pi-trash" (onClick)="deleteSelected()" 
                    [disabled]="!selectedItems?.length" />
        </ng-template>
        <ng-template #end>
          <p-button label="Exportar" icon="pi pi-upload" (onClick)="exportCSV()" />
        </ng-template>
      </p-toolbar>

      <!-- Table -->
      <p-table
        #dt
        [value]="items()"
        [rows]="10"
        [paginator]="true"
        [rowsPerPageOptions]="[10, 25, 50]"
        [showCurrentPageReport]="true"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords}"
        [globalFilterFields]="['code', 'name']"
        [(selection)]="selectedItems"
        dataKey="id"
      >
        <ng-template #caption>
          <div class="flex items-center justify-between">
            <h5 class="m-0">Gestión de Items</h5>
            <p-iconfield>
              <p-inputicon styleClass="pi pi-search" />
              <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" 
                     placeholder="Buscar..." />
            </p-iconfield>
          </div>
        </ng-template>
        
        <ng-template #header>
          <tr>
            <th style="width: 3rem"><p-tableHeaderCheckbox /></th>
            <th pSortableColumn="code">Código <p-sortIcon field="code" /></th>
            <th pSortableColumn="name">Nombre <p-sortIcon field="name" /></th>
            <th class="text-center">Estado</th>
            <th class="text-center" style="min-width: 12rem">Acciones</th>
          </tr>
        </ng-template>
        
        <ng-template #body let-item>
          <tr>
            <td><p-tableCheckbox [value]="item" /></td>
            <td><span class="font-medium">{{ item.code }}</span></td>
            <td>{{ item.name }}</td>
            <td class="text-center">
              <p-tag [value]="item.status" [severity]="getSeverity(item.status)" />
            </td>
            <td class="text-center">
              <p-button icon="pi pi-pencil" [rounded]="true" [outlined]="true" 
                        (click)="edit(item)" />
              <p-button icon="pi pi-trash" severity="danger" [rounded]="true" 
                        [outlined]="true" (click)="delete(item)" />
            </td>
          </tr>
        </ng-template>
        
        <ng-template #emptymessage>
          <tr>
            <td colspan="5" class="text-center py-8">
              <i class="pi pi-inbox text-4xl text-muted-color mb-3 block"></i>
              <p class="text-muted-color">No hay datos disponibles</p>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  </div>
</div>

<!-- Dialog para Crear/Editar -->
<p-dialog [(visible)]="itemDialog" [style]="{width: '450px'}" header="Detalles" [modal]="true">
  <ng-template #content>
    <div class="flex flex-col gap-6">
      <!-- Formulario -->
    </div>
  </ng-template>
  <ng-template #footer>
    <p-button label="Cancelar" icon="pi pi-times" text (click)="hideDialog()" />
    <p-button label="Guardar" icon="pi pi-check" (click)="save()" />
  </ng-template>
</p-dialog>

<!-- Confirmación de Eliminación -->
<p-confirmdialog [style]="{width: '450px'}" />
```

---

## 📁 Estructura de Archivos

```
component-name/
├── component-name.component.ts      ← Lógica
├── component-name.component.html    ← Template (NO inline)
├── component-name.component.scss    ← Estilos (opcional)
├── component-name.interface.ts      ← Interfaces TypeScript
└── component-name.service.ts        ← Servicio HTTP (opcional)
```

---

---

## 🧩 TypeScript: Patrón A (CRUD)

```typescript
import { Component, OnInit, signal, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ItemService } from './item.service';
import { Item } from './item.interface';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TableModule, ButtonModule, DialogModule,
    ToolbarModule, ToastModule, TagModule, InputTextModule, ConfirmDialogModule,
    IconFieldModule, InputIconModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './items.component.html'
})
export class ItemsComponent implements OnInit {
  // Services
  private service = inject(ItemService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  // Signals
  items = signal<Item[]>([]);
  loading = signal<boolean>(false);
  itemDialog = signal<boolean>(false);
  submitted = signal<boolean>(false);
  currentItem = signal<Item>({} as Item);
  selectedItems = signal<Item[]>([]);

  // ViewChild
  @ViewChild('dt') table!: Table;

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loading.set(true);
    this.service.getAll().subscribe({
      next: (response) => {
        if (response.success) this.items.set(response.data);
        this.loading.set(false);
      },
      error: () => {
        this.showError('Error al cargar');
        this.loading.set(false);
      }
    });
  }

  openNew(): void {
    this.currentItem.set({} as Item);
    this.submitted.set(false);
    this.itemDialog.set(true);
  }

  edit(item: Item): void {
    this.currentItem.set({ ...item });
    this.itemDialog.set(true);
  }

  delete(item: Item): void {
    this.confirmationService.confirm({
      message: `¿Eliminar ${item.name}?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.service.delete(item.id!).subscribe({
          next: () => {
            this.items.update(items => items.filter(i => i.id !== item.id));
            this.showSuccess('Eliminado');
          },
          error: () => this.showError('Error al eliminar')
        });
      }
    });
  }

  save(): void {
    this.submitted.set(true);
    const item = this.currentItem();
    
    if (!item?.name?.trim()) return;

    if (item.id) {
      this.service.update(item.id, item).subscribe({
        next: () => {
          this.items.update(items => {
            const index = items.findIndex(i => i.id === item.id);
            items[index] = item;
            return [...items];
          });
          this.showSuccess('Actualizado');
          this.hideDialog();
        }
      });
    } else {
      this.service.create(item).subscribe({
        next: (response) => {
          this.items.update(items => [...items, response.data]);
          this.showSuccess('Creado');
          this.hideDialog();
        }
      });
    }
  }

  hideDialog(): void {
    this.itemDialog.set(false);
    this.submitted.set(false);
  }

  onGlobalFilter(table: Table, event: Event): void {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  exportCSV(): void {
    this.table.exportCSV();
  }

  private showSuccess(detail: string): void {
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail, life: 3000 });
  }

  private showError(detail: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail, life: 3000 });
  }
}
```

---

## 🧩 TypeScript: Patrón B (Read-Only)

```typescript
import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ItemService } from './item.service';
import { Item } from './item.interface';

@Component({
  selector: 'app-suggestions',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './suggestions.component.html'
})
export class SuggestionsComponent implements OnInit {
  // Services
  private service = inject(ItemService);
  private messageService = inject(MessageService);

  // Signals
  items = signal<Item[]>([]);
  loading = signal<boolean>(false);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.service.getSuggestions().subscribe({
      next: (response) => {
        if (response.success) {
          this.items.set(response.data);
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los datos'
        });
        this.loading.set(false);
      }
    });
  }

  // Métodos para Stats Cards
  getUrgentCount(): number {
    return this.items().filter(i => i.priority === 'urgent').length;
  }

  getHighCount(): number {
    return this.items().filter(i => i.priority === 'high').length;
  }

  getTotalQty(): number {
    return this.items().reduce((sum, i) => sum + (i.quantity || 0), 0);
  }

  getSeverity(status: string): 'success' | 'warn' | 'danger' | 'info' {
    const severities: Record<string, any> = {
      'active': 'success',
      'urgent': 'danger',
      'high': 'warn',
      'normal': 'info'
    };
    return severities[status] || 'info';
  }
}
```

---

## 📁 Estructura de Archivos (Ambos Patrones)

```typescript
import { Component, OnInit, signal, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ItemService } from './item.service';
import { Item, ItemResponse } from './item.interface';

@Component({
  selector: 'app-component-name',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    ToolbarModule,
    ToastModule,
    TagModule,
    InputTextModule,
    ConfirmDialogModule,
    IconFieldModule,
    InputIconModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './component-name.component.html',
  styleUrl: './component-name.component.scss' // opcional
})
export class ComponentNameComponent implements OnInit {
  // Services
  private service = inject(ItemService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  // Signals (preferir sobre variables normales)
  items = signal<Item[]>([]);
  loading = signal<boolean>(false);
  
  // State
  itemDialog = signal<boolean>(false);
  submitted = signal<boolean>(false);
  currentItem = signal<Item | null>(null);
  selectedItems = signal<Item[]>([]);

  // ViewChild para tabla
  @ViewChild('dt') table!: Table;

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loading.set(true);
    this.service.getAll().subscribe({
      next: (response) => {
        if (response.success) {
          this.items.set(response.data);
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.showError('Error al cargar datos');
        this.loading.set(false);
      }
    });
  }

  openNew(): void {
    this.currentItem.set({} as Item);
    this.submitted.set(false);
    this.itemDialog.set(true);
  }

  edit(item: Item): void {
    this.currentItem.set({ ...item });
    this.itemDialog.set(true);
  }

  delete(item: Item): void {
    this.confirmationService.confirm({
      message: `¿Eliminar ${item.name}?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.service.delete(item.id!).subscribe({
          next: () => {
            this.items.update(items => items.filter(i => i.id !== item.id));
            this.showSuccess('Eliminado correctamente');
          },
          error: () => this.showError('Error al eliminar')
        });
      }
    });
  }

  save(): void {
    this.submitted.set(true);
    const item = this.currentItem();
    
    if (!item?.name?.trim()) return;

    if (item.id) {
      // Update
      this.service.update(item.id, item).subscribe({
        next: () => {
          this.items.update(items => {
            const index = items.findIndex(i => i.id === item.id);
            items[index] = item;
            return [...items];
          });
          this.showSuccess('Actualizado correctamente');
          this.hideDialog();
        },
        error: () => this.showError('Error al actualizar')
      });
    } else {
      // Create
      this.service.create(item).subscribe({
        next: (response) => {
          this.items.update(items => [...items, response.data]);
          this.showSuccess('Creado correctamente');
          this.hideDialog();
        },
        error: () => this.showError('Error al crear')
      });
    }
  }

  hideDialog(): void {
    this.itemDialog.set(false);
    this.submitted.set(false);
  }

  onGlobalFilter(table: Table, event: Event): void {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  exportCSV(): void {
    this.table.exportCSV();
  }

  getSeverity(status: string): 'success' | 'warn' | 'danger' | 'info' {
    const severities: Record<string, any> = {
      'active': 'success',
      'inactive': 'danger',
      'pending': 'warn'
    };
    return severities[status] || 'info';
  }

  private showSuccess(detail: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail,
      life: 3000
    });
  }

  private showError(detail: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail,
      life: 3000
    });
  }
}
```

---

## 🎨 Colores de Stats Cards

```typescript
// Patrón de colores para stats cards
const statsCardStyles = {
  blue: 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500',
  red: 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500',
  green: 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500',
  orange: 'bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500',
  purple: 'bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500',
  cyan: 'bg-cyan-50 dark:bg-cyan-900/20 border-l-4 border-cyan-500'
};
```

---

## 📋 Checklist de Implementación

### ✅ Estructura
- [ ] Archivo `.component.ts` con lógica
- [ ] Archivo `.component.html` separado (NO inline template)
- [ ] Archivo `.interface.ts` con tipos
- [ ] Archivo `.service.ts` si requiere HTTP
- [ ] Grid cols-12 como wrapper principal

### ✅ Componentes PrimeNG
- [ ] `p-toast` para notificaciones
- [ ] `p-table` con paginación
- [ ] `p-toolbar` si tiene acciones CRUD
- [ ] `p-dialog` para crear/editar
- [ ] `p-confirmdialog` para confirmaciones
- [ ] `p-tag` para estados
- [ ] Botones con `[rounded]="true" [outlined]="true"`

### ✅ Funcionalidad
- [ ] Signals en lugar de variables normales
- [ ] `inject()` en lugar de constructor DI
- [ ] Búsqueda global en tabla
- [ ] Export CSV (si aplica)
- [ ] Selección múltiple con checkbox
- [ ] Loading states
- [ ] Empty states con iconos
- [ ] Confirmación antes de eliminar
- [ ] Toast notifications para éxito/error

### ✅ Accesibilidad & UX
- [ ] Labels en formularios
- [ ] Placeholders descriptivos
- [ ] Mensajes de error claros
- [ ] Loading spinners
- [ ] Responsive (grid cols ajustables)
- [ ] Dark mode compatible

---

---

## 🎯 Clasificación de Componentes del Sistema

### 🅰️ **Patrón A - CRUD Completo**

| Componente | Estado | Prioridad | Acción |
|------------|--------|-----------|--------|
| ✅ `product-list` | **Cumple** | - | Referencia |
| ⚠️ `warehouses` | Actualizar | � Alta | Grid + Stats opcionales |
| ⚠️ `suppliers` | Actualizar | 🔴 Alta | Grid + Toolbar |
| ⚠️ `roles` | Actualizar | 🟡 Media | Aplicar patrón |
| ⚠️ `org-users` | Actualizar | 🟡 Media | Aplicar patrón |
| ⚠️ `inventory` | Actualizar | 🟡 Media | Aplicar patrón |

**Características obligatorias:**
- Grid cols-12 wrapper
- Header card con título
- Toolbar con acciones CRUD
- Table con selección múltiple
- Dialog formulario
- ConfirmDialog para eliminar
- Export CSV

---

### 🅱️ **Patrón B - Solo Lectura + Análisis**

| Componente | Estado | Prioridad | Acción |
|------------|--------|-----------|--------|
| ✅ `reorder-suggestions` | **Cumple** | - | Referencia |
| ⚠️ `stocks-low` | Actualizar | 🔴 Alta | Mejorar stats cards |
| ⚠️ `system-logs` | Actualizar | 🟡 Media | Aplicar patrón |
| ✅ `home` | Cumple | - | Dashboard especial |

**Características obligatorias:**
- Grid cols-12 wrapper
- Header card con botón refresh
- **4 Stats cards** con métricas
- Table sin selección
- Loading state elegante
- Empty state con mensaje positivo
- NO Dialog, NO ConfirmDialog

---

### 🔵 **Componentes Especiales** (No siguen patrones estándar)

| Componente | Tipo | Justificación |
|------------|------|---------------|
| `subscription` | Info Display | Solo muestra datos de suscripción |
| `ai-reports` | AI Interface | Tiene prompt + resultados dinámicos |
| `backup` | Utility | Operaciones de backup/restore |
| `csv-export` | Utility | Herramienta de exportación |
| `production` | Workflow | Proceso de fabricación complejo |

---

## 📊 Resumen: Products vs Suggestions

| Aspecto | Products (Patrón A) | Suggestions (Patrón B) |
|---------|---------------------|------------------------|
| **Propósito** | CRUD maestro productos | Análisis de reposición |
| **Layout** | Grid + Toolbar + Table | Grid + Stats + Table |
| **Stats Cards** | ❌ No tiene | ✅ 4 KPIs superiores |
| **Toolbar** | ✅ Nuevo/Eliminar/Export | ❌ Solo refresh en header |
| **Selección** | ✅ Múltiple con checkbox | ❌ Solo lectura |
| **Dialog** | ✅ Formulario CRUD | ❌ No necesita |
| **ConfirmDialog** | ✅ Para eliminar | ❌ No necesita |
| **Empty State** | Simple "No hay datos" | Elaborado "¡Todo bien!" |
| **Service** | product.service.ts | Directo en component |

**Conclusión:** ❌ **NO fusionar** - Son patrones complementarios para casos de uso diferentes

---

## 🚀 Plan de Implementación

### Fase 1: Alta Prioridad (Esta semana)
1. ✅ Documentar patrones (completado)
2. ⚠️ `warehouses` → Patrón A
3. ⚠️ `suppliers` → Patrón A
4. ⚠️ `stocks-low` → Patrón B (mejorar stats)

### Fase 2: Media Prioridad (Próxima semana)
5. ⚠️ `roles` → Patrón A
6. ⚠️ `org-users` → Patrón A
7. ⚠️ `inventory` → Patrón A
8. ⚠️ `system-logs` → Patrón B

### Fase 3: Componentes Especiales
9. Revisar si necesitan ajustes menores
10. Documentar excepciones específicas

---

## ✅ Checklist de Implementación

### Para Patrón A (CRUD):
- [ ] Grid cols-12 como wrapper principal
- [ ] Header card con icono + título + descripción
- [ ] Stats cards opcionales si hay KPIs relevantes
- [ ] Toolbar con botones: Nuevo, Eliminar (deshabilitado), Exportar
- [ ] Table con selección múltiple (checkbox)
- [ ] Búsqueda global con iconfield
- [ ] Dialog formulario con grid interno
- [ ] ConfirmDialog para confirmaciones
- [ ] Toast notifications
- [ ] Signals para estado
- [ ] inject() para servicios
- [ ] ViewChild para tabla (export)
- [ ] Empty state básico

### Para Patrón B (Read-Only):
- [ ] Grid cols-12 como wrapper principal
- [ ] Header card con icono + título + descripción + botón refresh
- [ ] **4 Stats cards obligatorias** con colores diferentes
- [ ] Table sin selección, solo lectura
- [ ] Loading state con spinner central
- [ ] Empty state elaborado con ícono grande y mensaje positivo
- [ ] Signals para estado
- [ ] inject() para servicios
- [ ] Métodos de cálculo para stats (getUrgentCount, etc.)
- [ ] Toast notifications
- [ ] NO Dialog, NO ConfirmDialog, NO Toolbar

---

## 📦 Imports Mínimos por Patrón

### Patrón A (CRUD)
- ✅ Dashboards
- ✅ Vistas de análisis
- ✅ Reportes con KPIs
- ✅ Módulos de monitoreo

### Sin Stats Cards (products style)
- ✅ CRUDs estándar
- ✅ Gestión de maestros
- ✅ Listados simples
- ✅ Configuraciones

---

## 📦 Imports Estándar

```typescript
// Angular Core
import { Component, OnInit, signal, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';

// Services & Interfaces
import { YourService } from './your.service';
import { YourInterface } from './your.interface';
```

---

## 🎯 Próximos Pasos

1. Revisar componentes existentes
2. Aplicar estándar a cada uno
3. Documentar excepciones si las hay
4. Crear componente base/template si es necesario
