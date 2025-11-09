import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Role, RoleResponse } from './interfaces/role.interface';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.backend.host}/roles`;

  getRoles(): Observable<RoleResponse> {
    return this.http.get<RoleResponse>(this.apiUrl);
  }

  getRoleById(id: number): Observable<RoleResponse> {
    return this.http.get<RoleResponse>(`${this.apiUrl}/${id}`);
  }

  createRole(role: Role): Observable<RoleResponse> {
    return this.http.post<RoleResponse>(this.apiUrl, role);
  }

  updateRole(id: number, role: Role): Observable<RoleResponse> {
    return this.http.put<RoleResponse>(`${this.apiUrl}/${id}`, role);
  }

  deleteRole(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }
}
