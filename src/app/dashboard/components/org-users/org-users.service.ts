import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { 
  UsersResponse,
  UserResponse,
  CreateUserRequest,
  UpdateUserRequest
} from './org-users.interface';

@Injectable({
  providedIn: 'root'
})
export class OrgUsersService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.backend.host}/users`;

  /**
   * Obtiene la lista de usuarios de la organización (filtrado automático por org_id del JWT)
   */
  getUsers(): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(this.API_URL);
  }

  /**
   * Obtiene un usuario por ID
   */
  getUserById(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.API_URL}/${id}`);
  }

  /**
   * Crea un nuevo usuario con roles
   */
  createUser(request: CreateUserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.API_URL, request);
  }

  /**
   * Actualiza un usuario existente (puede incluir role_ids para actualizar roles)
   */
  updateUser(id: number, request: UpdateUserRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.API_URL}/${id}`, request);
  }

  /**
   * Elimina un usuario
   */
  deleteUser(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.API_URL}/${id}`);
  }
}
