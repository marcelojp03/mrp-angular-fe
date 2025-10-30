import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';
import { Role } from './interfaces/role.interface';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = environment.backend.host;

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({ 
      'Authorization': `Bearer ${this.authService.getAuthToken()}` 
    });
  }

  getRoles(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/roles`, { headers: this.getHeaders() });
  }

  createRole(role: Role): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/roles`, role, { headers: this.getHeaders() });
  }

  updateRole(id: number, role: Role): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/roles/${id}`, role, { headers: this.getHeaders() });
  }

  deleteRole(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/roles/${id}`, { headers: this.getHeaders() });
  }
}
