// core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard para proteger rutas que requieren autenticación
 * Verifica que el usuario tenga tokens válidos (access_token y refresh_token)
 * Si no están presentes, redirige al login
 * 
 * NOTA: No intenta renovar tokens aquí - eso lo hace el interceptor automáticamente
 */
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.getAuthToken();
  const refreshToken = localStorage.getItem('refresh_token');

  // Verificar que existan ambos tokens
  if (!token || !refreshToken) {
    console.warn('[Auth Guard] Tokens no encontrados:', {
      access_token: !!token,
      refresh_token: !!refreshToken
    });
    
    auth.logout(); // Limpiar cualquier dato residual
    return router.createUrlTree(['/auth/login'], { 
      queryParams: { returnUrl: state.url } 
    });
  }

  // Si ambos tokens existen, permitir acceso
  // Si el access_token está expirado, el interceptor lo renovará automáticamente
  console.log('[Auth Guard] ✅ Tokens presentes, acceso permitido');
  return true;
};

/**
 * Guard para lazy loading modules
 * Previene cargar módulos si el usuario no está autenticado
 * Verifica existencia de ambos tokens (access y refresh)
 */
export const authMatchGuard: CanMatchFn = (route, segments) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.getAuthToken();
  const refreshToken = localStorage.getItem('refresh_token');

  if (!token || !refreshToken) {
    console.warn('[Auth Match Guard] Tokens no encontrados, acceso denegado');
    auth.logout();
    return router.createUrlTree(['/auth/login']);
  }

  console.log('[Auth Match Guard] ✅ Tokens presentes, módulo puede cargar');
  return true;
};
