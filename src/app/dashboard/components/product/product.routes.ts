// dashboard/components/product/product.routes.ts
import { Routes } from '@angular/router';

export const productRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./product-list/product-list.component').then(c => c.ProductListComponent)
  }
];
