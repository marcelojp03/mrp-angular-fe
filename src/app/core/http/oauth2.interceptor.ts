import { Injectable, inject } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpHeaders, HttpRequest, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, finalize, switchMap, filter, take } from 'rxjs/operators';
import { Router } from '@angular/router';

import { HttpApi } from './http-api';
import { AuthService } from '../services/auth.service';

/**
 * Interceptor funcional moderno para Angular 18+
 */
export const oauth2Interceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log(`[OAuth2Interceptor] INTERCEPTADO: ${req.url}`);

  // Lista de rutas públicas que no requieren autenticación
  const publicApiList = [
    '/auth/login',
    '/public/signup',
    '/api/health'
  ];

  const isPublicRoute = publicApiList.some(publicUrl => req.url.includes(publicUrl));

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
      
      if (error.status === 401) {
        console.error('[OAuth2Interceptor] 401 Unauthorized - Redirigiendo al login');
        authService.logout();
        router.navigate(['/auth/login'], {
          queryParams: { returnUrl: router.url }
        });
        return throwError(() => ({
          ...error,
          message: 'Sesión expirada. Por favor, inicia sesión nuevamente.'
        }));
      }

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
    // Si es 401, el token es inválido o expiró
    if (error.status === 401) {
      // Limpiar sesión y redirigir al login
      this.authService.logout();
      
      // Redirigir al login con returnUrl
      const currentUrl = this.router.url;
      this.router.navigate(['/auth/login'], { 
        queryParams: { returnUrl: currentUrl }
      });
      
      return throwError(() => ({
        ...error,
        message: 'Sesión expirada. Por favor, inicia sesión nuevamente.'
      }));
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

  // Método para refrescar token (si el backend lo soporta en el futuro)
  private tryAgainWithRefresToken(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (!this.refreshTokenInProgress) {
        this.refreshTokenSubject.next(null);
        this.refreshTokenInProgress = true;

        return this.authService
            .loginWithRefreshToken()
            .pipe(
                switchMap((result) => {
                    if (result) {
                        this.refreshTokenSubject.next(result);
                        return next.handle(this.performRequest(req));
                    }

                    throw new Error('Acceso denegado.');
                }),
                catchError(error => {
                    this.authService.logout();
                    this.router.navigate(['/auth/login']);
                    return throwError(() => error);
                }),
                finalize(() => {
                    this.refreshTokenInProgress = false;
                })
            );
    } else {
        return this.refreshTokenSubject
            .pipe(
                filter(result => result != null),
                take(1),
                switchMap(() => next.handle(this.performRequest(req)))
            );
    }
  }
}
