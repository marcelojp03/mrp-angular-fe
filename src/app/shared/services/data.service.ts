import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MenuResponse } from '../../auth/interfaces/auth.interface';
import { AuthService } from '../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  nombreTramite: string = "";

  getMenu(): Observable<MenuResponse> {
    // El interceptor agregará automáticamente el token
    return this.http.get<MenuResponse>(`${environment.backend.host}/menu`);
  }
}