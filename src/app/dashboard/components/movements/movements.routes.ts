import { Routes } from '@angular/router';
import { MovementsListComponent } from './movements-list.component';

export const movementsRoutes: Routes = [
  {
    path: '',
    component: MovementsListComponent,
    title: 'Movimientos de Inventario'
  }
];
