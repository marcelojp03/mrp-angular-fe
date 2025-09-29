// dashboard/components/warehouses/warehouses.routes.ts
import { Routes } from '@angular/router';
import { WarehouseListComponent } from './warehouse-list/warehouse-list.component';

export const warehousesRoutes: Routes = [
  { path: '', component: WarehouseListComponent },
];
