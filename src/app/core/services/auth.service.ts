import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { HttpApi } from '../http/http-api';
// import { BitacoraService } from 'src/app/dashboard/bitacora/bitacora.service';
import { User, LoginRequest, LoginSuccessResponse, LoginErrorResponse, UserData } from '../../auth/interfaces/auth.interface';
import { SignupRequest, SignupResponse } from '../../auth/interfaces/signup.interface';

const OAUTH_DATA = environment.oauth;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.backend.host;
  private tokenKey = 'authToken'; // Nombre de la clave

  register(userRequest: any): Observable<any> {
    const data = {
      code: userRequest.codigo,
      email: userRequest.email,
      password: userRequest.password
    };

    //return this.http.post(HttpApi.userRegister, data)
    return this.http.post(`${this.apiUrl}/usuarios/registrar`, data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  /**
   * Sprint 2: Registro público de nueva organización
   */
  signup(request: SignupRequest): Observable<SignupResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };

    return this.http.post<SignupResponse>(`${this.apiUrl}/public/signup`, request, httpOptions)
      .pipe(
        map((response: SignupResponse) => {
          if (response.success && response.data.access_token) {
            // Guardar datos de autenticación
            this.saveSignupData(response);
          }
          return response;
        })
      );
  }

  // Guardar datos del signup
  private saveSignupData(response: SignupResponse): void {
    localStorage.setItem('token', response.data.access_token);
    localStorage.setItem('org_id', response.data.org_id.toString());
    localStorage.setItem('user_id', response.data.user_id.toString());
    localStorage.setItem('plan', JSON.stringify(response.data.plan));
  }

  loginWithUserCredentials(email: string, password: string): Observable<LoginSuccessResponse | LoginErrorResponse> {
    const credentials: LoginRequest = {
      email: email,
      password: password
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };

    return this.http.post<LoginSuccessResponse | LoginErrorResponse>(`${this.apiUrl}/auth/login`, credentials, httpOptions);
  }

  /**
   * Renueva el access_token usando el refresh_token
   * Endpoint: POST /auth/refresh
   * Body: { "refresh_token": "..." }
   * Respuesta: { "access_token": "...", "token": "..." }
   */
  refreshAccessToken(): Observable<{ access_token: string; token: string }> {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      console.error('[AuthService] No hay refresh_token disponible');
      return throwError(() => new Error('No refresh token available'));
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshToken}` // Backend acepta refresh_token en header
      })
    };

    return this.http.post<{ access_token: string; token: string }>(
      `${this.apiUrl}/auth/refresh`, 
      { refresh_token: refreshToken }, // También en body por compatibilidad
      httpOptions
    ).pipe(
      map((response) => {
        // Actualizar solo el access_token, mantener refresh_token
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('access_token', response.access_token);
        console.log('[AuthService] Access token renovado exitosamente');
        return response;
      }),
      catchError((error) => {
        console.error('[AuthService] Error al renovar token:', error);
        // Si falla el refresh, limpiar sesión
        this.clearExpiredSession();
        return throwError(() => error);
      })
    );
  }

  loginWithRefreshToken(): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');

    const body = new URLSearchParams();
    body.set('grant_type', 'refresh_token');
    body.set('client_id', OAUTH_DATA.client_id);
    body.set('client_secret', OAUTH_DATA.client_secret);
    body.set('refresh_token', this.refreshToken);
    body.set('scope', OAUTH_DATA.scope);

    return this.http.post(HttpApi.oauthLogin, body.toString(), { headers })
      .pipe(
        map((response: any) => {
          localStorage.setItem('session', JSON.stringify(response));
          return response;
        })
      );
  }

  // Method to save authentication data
  saveAuthData(response: LoginSuccessResponse): void {
    localStorage.setItem('session', JSON.stringify(response));
    localStorage.setItem('token', response.data.access_token || response.data.token); // Priorizar access_token
    localStorage.setItem('access_token', response.data.access_token); // Guardar access_token explícitamente
    localStorage.setItem('refresh_token', response.data.refresh_token); // Guardar refresh_token
    localStorage.setItem('user', JSON.stringify(response.data.user));
    localStorage.setItem('org_id', response.data.org_id.toString());
  }

  // Method to get current user data
  getCurrentUser(): UserData | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Method to get token for API requests
  getAuthToken(): string | null {
    return localStorage.getItem('token');
  }

  // Method to get organization ID
  getOrgId(): number | null {
    const orgId = localStorage.getItem('org_id');
    return orgId ? parseInt(orgId) : null;
  }

  isLogged(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.clear();
  }

  /**
   * Limpia tokens expirados y fuerza un nuevo login
   */
  clearExpiredSession(): void {
    console.warn('[AuthService] Limpiando sesión expirada...');
    localStorage.removeItem('token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('session');
    localStorage.removeItem('user');
  }

  get accessToken() {
    const token = this.getAuthToken();
    if (!token) {
      console.warn('[AuthService] No se encontró access_token en localStorage');
      console.log('[AuthService] Keys en localStorage:', Object.keys(localStorage));
    }
    return token;
  }

  get refreshToken() {
    return localStorage['session'] ? JSON.parse(localStorage['session']).refresh_token : null;
  }


  // Método para iniciar sesión y obtener el token de autenticación
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api-token-auth/`, credentials);
  }

  // Método para cerrar sesión
  logout2(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout/`, {});
  }

  // Método para guardar el token de autenticación en el almacenamiento local
  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    console.log('Token guardado', token);
  }

  // Método para obtener el token de autenticación del almacenamiento local
  getToken(): Observable<string> {
    const token = localStorage.getItem(this.tokenKey);
    return of(token || '');
  }


  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const isAuthenticated = !!this.getToken();
    console.log('¿Usuario autenticado?', isAuthenticated);
    return isAuthenticated;
  }
  // Método para limpiar el token de autenticación del almacenamiento local
  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  /**
   * Cambia la contraseña del usuario autenticado
   * Requiere la contraseña actual por seguridad
   */
  changePassword(currentPassword: string, newPassword: string): Observable<{ success: boolean; message: string }> {
    return this.http.put<{ success: boolean; message: string }>(
      `${this.apiUrl}/auth/change-password`,
      {
        current_password: currentPassword,
        new_password: newPassword
      }
    );
  }
  getidUsuario(): number | null {
    const user = this.getCurrentUser();
    return user ? user.id : null;
  }


}
