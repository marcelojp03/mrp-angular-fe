// dashboard.routes.ts
import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './components/home/home.component';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      {
        path: 'products',
        loadChildren: () =>
          import('./components/product/product.routes').then(m => m.productRoutes)
      },
      {
        path: 'suppliers',
        loadChildren: () =>
          import('./components/suppliers/suppliers.routes').then(m => m.suppliersRoutes)
      },
      {
        path: 'warehouses',
        loadChildren: () =>
          import('./components/warehouses/warehouses.routes').then(m => m.warehousesRoutes)
      },
      {
        path: 'inventory',
        loadChildren: () =>
          import('./components/inventory/inventory.routes').then(m => m.inventoryRoutes)
      },
      // {
      //   path: 'purchases',
      //   loadChildren: () =>
      //     import('./components/purchases/purchases.routes').then(m => m.purchasesRoutes)
      // }
    ]
  }
];
