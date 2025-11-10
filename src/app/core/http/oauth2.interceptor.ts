import { Injectable, inject } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpHeaders, HttpRequest, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { catchError, finalize, switchMap, filter, take, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { HttpApi } from './http-api';
import { AuthService } from '../services/auth.service';

/**
 * Subject para coordinar múltiples peticiones esperando refresh
 * null = no hay refresh en progreso
 * string = nuevo access_token disponible
 */
let refreshTokenSubject = new BehaviorSubject<string | null>(null);
let isRefreshing = false;

/**
 * Interceptor funcional moderno para Angular 18+
 * Maneja automáticamente la renovación de tokens expirados
 */
export const oauth2Interceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log(`[OAuth2Interceptor] INTERCEPTADO: ${req.url}`);

  // Lista de rutas públicas que no requieren autenticación
  const publicApiList = [
    '/auth/login',
    '/auth/refresh', // No interceptar el refresh mismo
    '/public/signup',
    '/api/health'
  ];

  const isPublicRoute = publicApiList.some(publicUrl => req.url.includes(publicUrl));

  // Agregar token solo a rutas protegidas
  if (!isPublicRoute) {
    const token = authService.accessToken;
    console.log(`[OAuth2Interceptor] URL: ${req.url}, Token presente: ${!!token}`);
    
    if (token) {
      console.log(`[OAuth2Interceptor] Agregando token: Bearer ${token.substring(0, 20)}...`);
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    } else {
      console.warn(`[OAuth2Interceptor] No se encontró token para: ${req.url}`);
    }
  } else {
    console.log(`[OAuth2Interceptor] Ruta pública, sin token: ${req.url}`);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error(`[OAuth2Interceptor] Error en ${req.url}:`, error);
      console.error(`[OAuth2Interceptor] Status: ${error.status}, Message: ${error.message}`);
      
      // 401 Unauthorized - Token expirado o inválido
      if (error.status === 401 && !isPublicRoute) {
        console.warn('[OAuth2Interceptor] 401 Unauthorized - Intentando renovar token...');
        return handle401Error(req, next, authService, router);
      }

      // 404 en subscription - No crítico
      if (error.status === 404 && req.url.includes('/api/subscription')) {
        return throwError(() => ({
          ...error,
          message: 'Servicio de suscripción no disponible'
        }));
      }

      return throwError(() => error);
    })
  );
};

/**
 * Maneja errores 401 intentando renovar el access_token
 * Si falla, redirige al login
 */
function handle401Error(
  req: HttpRequest<any>, 
  next: any, 
  authService: AuthService, 
  router: Router
): Observable<HttpEvent<any>> {
  
  // Si ya hay un refresh en progreso, esperar a que termine
  if (isRefreshing) {
    console.log('[OAuth2Interceptor] Refresh en progreso, esperando...');
    return refreshTokenSubject.pipe(
      filter((token): token is string => token !== null), // Type guard para TypeScript
      take(1),
      switchMap((token: string) => {
        console.log('[OAuth2Interceptor] Nuevo token recibido, reintentando petición original');
        // Reintentar la petición con el nuevo token
        return next(addTokenToRequest(req, token)) as Observable<HttpEvent<any>>;
      })
    );
  }

  // Iniciar proceso de refresh
  isRefreshing = true;
  refreshTokenSubject.next(null);

  console.log('[OAuth2Interceptor] Iniciando refresh token...');
  
  return authService.refreshAccessToken().pipe(
    switchMap((response) => {
      console.log('[OAuth2Interceptor] ✅ Token renovado exitosamente');
      isRefreshing = false;
      
      const newToken = response.access_token;
      refreshTokenSubject.next(newToken); // Notificar a peticiones en espera
      
      // Reintentar la petición original con el nuevo token
      return next(addTokenToRequest(req, newToken)) as Observable<HttpEvent<any>>;
    }),
    catchError((error: HttpErrorResponse) => {
      console.error('[OAuth2Interceptor] ❌ Falló el refresh token:', error);
      isRefreshing = false;
      refreshTokenSubject.next(null);
      
      // Si el refresh falla, limpiar sesión y redirigir al login
      authService.logout();
      router.navigate(['/auth/login'], {
        queryParams: { returnUrl: router.url, reason: 'session_expired' }
      });
      
      return throwError(() => ({
        ...error,
        message: 'Sesión expirada. Por favor, inicia sesión nuevamente.'
      })) as Observable<HttpEvent<any>>;
    }),
    finalize(() => {
      isRefreshing = false;
    })
  );
}

/**
 * Clona la petición agregando el token de autorización
 */
function addTokenToRequest(req: HttpRequest<any>, token: string): HttpRequest<any> {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Interceptor de clase (legacy) - Mantener para compatibilidad
 */
@Injectable()
export class Oauth2Interceptor implements HttpInterceptor {
  refreshTokenInProgress!: boolean;
  refreshTokenSubject: BehaviorSubject<boolean | null> = new BehaviorSubject<boolean | null>(null);
  private router = inject(Router);

  constructor(
    private authService: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(`[OAuth2Interceptor] INTERCEPTADO: ${req.url}`);
    
    return next
    .handle(this.performRequest(req))
    .pipe(
      catchError((err) => this.processRequestError(err, req, next))
    );
  }

  private performRequest(req: HttpRequest<any>): HttpRequest<any> {
    let headers: HttpHeaders = req.headers;

    if (this.isAuthenticationRequired(req.url)) {
        const token = this.authService.accessToken;
        console.log(`[OAuth2Interceptor] URL: ${req.url}, Token presente: ${!!token}`);
        if (token) {
          console.log(`[OAuth2Interceptor] Agregando token: Bearer ${token.substring(0, 20)}...`);
          headers = headers.set('Authorization', `Bearer ${token}`);
        } else {
          console.warn(`[OAuth2Interceptor] No se encontró token para: ${req.url}`);
        }
    } else {
      console.log(`[OAuth2Interceptor] Ruta pública, sin token: ${req.url}`);
    }

    return req.clone({ headers });
  }

  private processRequestError(error: HttpErrorResponse, req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Si es 401, intentar renovar token antes de redirigir al login
    if (error.status === 401 && this.isAuthenticationRequired(req.url)) {
      console.warn('[OAuth2Interceptor Class] 401 Unauthorized - Intentando renovar token...');
      return this.handleTokenRefresh(req, next);
    }

    // Si es 404 en subscription, no mostrar error crítico
    if (error.status === 404 && req.url.includes('/api/subscription')) {
      return throwError(() => ({
        ...error,
        message: 'Servicio de suscripción no disponible'
      }));
    }

    return throwError(() => error);
  }

  /**
   * Maneja la renovación del token cuando se recibe 401
   * Evita múltiples refresh simultáneos usando refreshTokenSubject
   */
  private handleTokenRefresh(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Si ya hay un refresh en progreso, esperar
    if (this.refreshTokenInProgress) {
      console.log('[OAuth2Interceptor Class] Refresh en progreso, esperando...');
      return this.refreshTokenSubject.pipe(
        filter((result): result is boolean => result !== null),
        take(1),
        switchMap(() => {
          console.log('[OAuth2Interceptor Class] Token renovado, reintentando petición');
          return next.handle(this.performRequest(req));
        })
      );
    }

    // Iniciar refresh
    this.refreshTokenInProgress = true;
    this.refreshTokenSubject.next(null);

    console.log('[OAuth2Interceptor Class] Iniciando refresh token...');

    return this.authService.refreshAccessToken().pipe(
      switchMap((response) => {
        console.log('[OAuth2Interceptor Class] ✅ Token renovado exitosamente');
        this.refreshTokenInProgress = false;
        this.refreshTokenSubject.next(true);

        // Reintentar la petición original con el nuevo token
        return next.handle(this.performRequest(req));
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('[OAuth2Interceptor Class] ❌ Falló el refresh token:', error);
        this.refreshTokenInProgress = false;
        this.refreshTokenSubject.next(null);

        // Si falla el refresh, limpiar sesión y redirigir al login
        this.authService.logout();
        this.router.navigate(['/auth/login'], {
          queryParams: { returnUrl: this.router.url, reason: 'session_expired' }
        });

        return throwError(() => ({
          ...error,
          message: 'Sesión expirada. Por favor, inicia sesión nuevamente.'
        }));
      }),
      finalize(() => {
        this.refreshTokenInProgress = false;
      })
    );
  }

  // Helpers and Casuistics
  private isAuthenticationRequired(apiUrl: string): boolean {
    const publicApiList = [
      '/auth/login',
      '/public/signup',
      '/api/health'
    ];
    
    // No agregar token a las rutas públicas
    return !publicApiList.some(publicUrl => apiUrl.includes(publicUrl));
  }


}
