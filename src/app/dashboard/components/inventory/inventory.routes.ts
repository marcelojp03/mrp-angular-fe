// dashboard/components/inventory/inventory.routes.ts
import { Routes } from '@angular/router';
import { InventoryListComponent } from './inventory-list/inventory-list.component';

export const inventoryRoutes: Routes = [
  { path: '', component: InventoryListComponent },
];
