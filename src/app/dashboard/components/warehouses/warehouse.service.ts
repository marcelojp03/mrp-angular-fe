import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';
import { WarehousesResponse, Warehouse, WarehouseRequest, WarehouseUpdateRequest } from './interfaces/warehouse.interface';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
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

  // Main method for listing all warehouses
  obtenerListaAlmacenes(): Observable<WarehousesResponse> {
    const httpOptions = {
      headers: this.getAuthHeaders()
    };
    return this.http.get<WarehousesResponse>(`${this.apiURL}/warehouses`, httpOptions);
  }

  // Get specific warehouse by ID
  buscarAlmacen(id: number): Observable<any> {
    const httpOptions = {
      headers: this.getAuthHeaders()
    };
    return this.http.get(`${this.apiURL}/warehouses/${id}`, httpOptions);
  }

  // Create new warehouse
  registrarAlmacen(warehouse: WarehouseRequest): Observable<any> {
    const httpOptions = {
      headers: this.getAuthHeaders()
    };
    return this.http.post(`${this.apiURL}/warehouses`, warehouse, httpOptions);
  }

  // Update existing warehouse
  actualizarAlmacen(warehouse: WarehouseUpdateRequest): Observable<any> {
    const httpOptions = {
      headers: this.getAuthHeaders()
    };
    return this.http.put(`${this.apiURL}/warehouses/${warehouse.id}`, warehouse, httpOptions);
  }

  // Delete warehouse (soft delete)
  eliminarAlmacen(id: number): Observable<any> {
    const httpOptions = {
      headers: this.getAuthHeaders()
    };
    return this.http.delete(`${this.apiURL}/warehouses/${id}`, httpOptions);
  }

  // Reactivate warehouse
  reactivarAlmacen(id: number): Observable<any> {
    const httpOptions = {
      headers: this.getAuthHeaders()
    };
    return this.http.patch(`${this.apiURL}/warehouses/${id}/reactivate`, {}, httpOptions);
  }
}
