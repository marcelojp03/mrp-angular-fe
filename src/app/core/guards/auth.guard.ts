// core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard para proteger rutas que requieren autenticación
 * Verifica que el usuario tenga un token válido
 * Si no está autenticado, redirige al login
 */
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Verificar si el usuario está autenticado
  if (!auth.isLogged()) {
    console.warn('[Auth Guard] Usuario no autenticado, redirigiendo a login');
    return router.createUrlTree(['/auth/login'], { 
      queryParams: { returnUrl: state.url } 
    });
  }

  // Verificar que el token exista
  const token = auth.getAuthToken();
  if (!token) {
    console.warn('[Auth Guard] Token no encontrado, redirigiendo a login');
    auth.logout(); // Limpiar cualquier dato residual
    return router.createUrlTree(['/auth/login'], { 
      queryParams: { returnUrl: state.url } 
    });
  }

  console.log('[Auth Guard] Acceso permitido');
  return true;
};

/**
 * Guard para lazy loading modules
 * Previene cargar módulos si el usuario no está autenticado
 */
export const authMatchGuard: CanMatchFn = (route, segments) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLogged() || !auth.getAuthToken()) {
    console.warn('[Auth Match Guard] Acceso denegado, redirigiendo a login');
    auth.logout();
    return router.createUrlTree(['/auth/login']);
  }

  return true;
};
