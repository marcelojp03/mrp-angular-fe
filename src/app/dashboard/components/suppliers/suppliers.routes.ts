// dashboard/components/suppliers/suppliers.routes.ts
import { Routes } from '@angular/router';

export const suppliersRoutes: Routes = [
  {
    path: '',
    redirectTo: 'supplier-list',
    pathMatch: 'full'
  },
  {
    path: 'supplier-list',
    loadComponent: () => import('./supplier-list/supplier-list.component').then(c => c.SupplierListComponent)
  },
  {
    path: 'supplier-items',
    loadComponent: () => import('./supplier-items/supplier-items.component').then(c => c.SupplierItemsComponent)
  }
];
