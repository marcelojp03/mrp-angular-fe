// dashboard.routes.ts
import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { AIReportsComponent } from './components/ai-reports/ai-reports.component';
import { BackupComponent } from './components/backup/backup.component';
import { SystemLogsComponent } from './components/system-logs/system-logs.component';
import { OrgUsersComponent } from './components/org-users/org-users.component';
import { SubscriptionComponent } from './components/subscription/subscription.component';
import { StocksLowComponent } from './components/stocks-low/stocks-low.component';
import { ReorderSuggestionsComponent } from './components/reorder-suggestions/reorder-suggestions.component';
import { CSVExportComponent } from './components/csv-export/csv-export.component';
import { RolesComponent } from './components/roles/roles.component';
import { BomsComponent } from './components/production/boms/boms.component';
import { WorkOrdersComponent } from './components/production/work-orders/work-orders.component';
import { ExecutionComponent } from './components/production/execution/execution.component';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      // Inicio -> Dashboard
      { path: '', component: HomeComponent },
      { path: 'home', redirectTo: '', pathMatch: 'full' },
      
      // Inventario
      {
        path: 'products',
        loadChildren: () =>
          import('./components/product/product.routes').then(m => m.productRoutes)
      },
      {
        path: 'warehouses',
        loadChildren: () =>
          import('./components/warehouses/warehouses.routes').then(m => m.warehousesRoutes)
      },
      {
        path: 'movements',
        loadChildren: () =>
          import('./components/inventory/inventory.routes').then(m => m.inventoryRoutes)
      },
      { path: 'stocks/low', component: StocksLowComponent },
      { path: 'stocks/reorder-suggestions', component: ReorderSuggestionsComponent },
      
      // Proveedores
      {
        path: 'suppliers',
        loadChildren: () =>
          import('./components/suppliers/suppliers.routes').then(m => m.suppliersRoutes)
      },
      // TODO: { path: 'suppliers/supplier-items', component: SupplierItemsComponent },
      
      // Producción (SPRINT 3)
      { path: 'production/boms', component: BomsComponent },
      { path: 'production/work-orders', component: WorkOrdersComponent },
      { path: 'production/execution', component: ExecutionComponent },
      // TODO: { path: 'production/reports', component: ProductionReportsComponent },
      
      // Planificación (SPRINT 4 - Placeholders)
      // TODO: { path: 'demand', component: DemandComponent },
      // TODO: { path: 'mps', component: MPSComponent },
      // TODO: { path: 'mrp', component: MRPComponent },
      
      // Reportes
      { path: 'reports/ai', component: AIReportsComponent },
      { path: 'reports/csv', component: CSVExportComponent },
      
      // Sistema
      { path: 'system/backup', component: BackupComponent },
      { path: 'system/logs', component: SystemLogsComponent },
      
      // Administración
      { path: 'users', component: OrgUsersComponent },
      { path: 'roles', component: RolesComponent },
      // TODO: { path: 'acl', component: ACLComponent },
      
      // Suscripción (ahora en topbar, pero mantenemos ruta)
      { path: 'subscription', component: SubscriptionComponent },
      
      // Legacy routes (mantener compatibilidad)
      { path: 'ai-reports', redirectTo: 'reports/ai', pathMatch: 'full' },
      { path: 'backup', redirectTo: 'system/backup', pathMatch: 'full' },
      { path: 'system-logs', redirectTo: 'system/logs', pathMatch: 'full' },
      { path: 'org-users', redirectTo: 'users', pathMatch: 'full' },
    ]
  }
];
