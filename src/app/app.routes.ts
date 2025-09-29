// app.routes.ts
import { Routes } from '@angular/router';
import { AppLayout } from './core/layouts/component/app.layout';
import { Notfound } from './core/layouts/component/notfound';
import { authGuard, authMatchGuard } from './core/guards/auth.guard';
import { loggedResolver } from './core/guards/logged.guard';

export const appRoutes: Routes = [
    // Zona protegida por authGuard
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
        {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full'
        },
        {
            path: 'dashboard',
            // proteger el lazy con canMatch con doble capa
            canMatch: [authMatchGuard],
            loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.dashboardRoutes)
        }
        ]
    },

    // Auth (redirige si ya está logueado)
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes),
        resolve: [loggedResolver]
    },

    { path: 'not-found', component: Notfound },
    { path: '**', redirectTo: 'not-found' }
];
