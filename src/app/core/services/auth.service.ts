import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders, JsonpClientBackend } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { HttpApi } from '../http/http-api';
// import { BitacoraService } from 'src/app/dashboard/bitacora/bitacora.service';
import { User, LoginRequest, LoginSuccessResponse, LoginErrorResponse, UserData } from '../../auth/interfaces/auth.interface';

const OAUTH_DATA = environment.oauth;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.backend.host;
  private tokenKey = 'authToken'; // Nombre de la clave
  constructor(
    private handler: HttpBackend,
    private http: HttpClient,
    // private bitacoraService:BitacoraService
    ) {
      this.http = new HttpClient(this.handler);
    }

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
    localStorage.setItem('token', response.data.token);
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

  get accessToken() {
    return this.getAuthToken();
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
  getidUsuario(): number | null {
    const user = this.getCurrentUser();
    return user ? user.id : null;
  }


}
