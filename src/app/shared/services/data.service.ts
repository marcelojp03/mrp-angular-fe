import { HttpBackend, HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MenuResponse } from '../../auth/interfaces/auth.interface';
import { AuthService } from '../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  nombreTramite: string = "";

  constructor(
    private handler: HttpBackend,
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.http = new HttpClient(this.handler);
  }

  getMenu(): Observable<MenuResponse> {
    const token = this.authService.getAuthToken();
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.get<MenuResponse>(`${environment.backend.host}/roles/menu`, httpOptions);
  }
}