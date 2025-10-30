import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { 
  OrgUsersResponse, 
  AddOrgUserRequest, 
  AddOrgUserResponse 
} from './org-users.interface';

@Injectable({
  providedIn: 'root'
})
export class OrgUsersService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.backend.host}/user-org`;

  /**
   * Obtiene la lista de usuarios de la organización
   */
  getOrgUsers(): Observable<OrgUsersResponse> {
    return this.http.get<OrgUsersResponse>(this.API_URL);
  }

  /**
   * Agrega un nuevo usuario a la organización
   */
  addOrgUser(request: AddOrgUserRequest): Observable<AddOrgUserResponse> {
    return this.http.post<AddOrgUserResponse>(this.API_URL, request);
  }
}
