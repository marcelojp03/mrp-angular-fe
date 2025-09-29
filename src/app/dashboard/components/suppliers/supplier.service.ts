import { HttpBackend, HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { environment } from "../../../../environments/environment";
import { AuthService } from '../../../core/services/auth.service';
import { SuppliersResponse, Supplier, SupplierRequest, SupplierUpdateRequest } from './interfaces/supplier.interface';

@Injectable({ providedIn: 'root' })  
export class SupplierService {
  private apiURL = environment.backend.host;
  
  constructor(
    private handler: HttpBackend, 
    private http: HttpClient,
    private authService: AuthService
  ) { 
    this.http = new HttpClient(handler);
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getAuthToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Main method for listing all suppliers
  public listar(): Observable<SuppliersResponse> {
    const httpOptions = {
      headers: this.getAuthHeaders()
    };
    return this.http.get<SuppliersResponse>(`${this.apiURL}/suppliers`, httpOptions);
  }

  // Get specific supplier by ID
  public buscarProveedor(id: number): Observable<any> {
    const httpOptions = {
      headers: this.getAuthHeaders()
    };
    return this.http.get(`${this.apiURL}/suppliers/${id}`, httpOptions);
  }

  // Create new supplier
  public registrarProveedor(data: SupplierRequest): Observable<any> {
    const httpOptions = {
      headers: this.getAuthHeaders()
    };
    return this.http.post(`${this.apiURL}/suppliers`, data, httpOptions);
  }

  // Update existing supplier
  public actualizarProveedor(data: SupplierUpdateRequest): Observable<any> {
    const httpOptions = {
      headers: this.getAuthHeaders()
    };
    return this.http.put(`${this.apiURL}/suppliers/${data.id}`, data, httpOptions);
  }

  // Delete supplier (soft delete)
  public eliminarProveedor(id: number): Observable<any> {
    const httpOptions = {
      headers: this.getAuthHeaders()
    };
    return this.http.delete(`${this.apiURL}/suppliers/${id}`, httpOptions);
  }

  // Reactivate supplier
  public reactivarProveedor(id: number): Observable<any> {
    const httpOptions = {
      headers: this.getAuthHeaders()
    };
    return this.http.patch(`${this.apiURL}/suppliers/${id}/reactivate`, {}, httpOptions);
  }
}
