import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { WarehousesResponse, Warehouse, WarehouseRequest, WarehouseUpdateRequest } from './interfaces/warehouse.interface';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  private http = inject(HttpClient);
  private apiURL = environment.backend.host;

  // Main method for listing all warehouses
  obtenerListaAlmacenes(): Observable<WarehousesResponse> {
    return this.http.get<WarehousesResponse>(`${this.apiURL}/warehouses`);
  }

  // Get specific warehouse by ID
  buscarAlmacen(id: number): Observable<any> {
    return this.http.get(`${this.apiURL}/warehouses/${id}`);
  }

  // Create new warehouse
  registrarAlmacen(warehouse: WarehouseRequest): Observable<any> {
    return this.http.post(`${this.apiURL}/warehouses`, warehouse);
  }

  // Update existing warehouse
  actualizarAlmacen(warehouse: WarehouseUpdateRequest): Observable<any> {
    return this.http.put(`${this.apiURL}/warehouses/${warehouse.id}`, warehouse);
  }

  // Delete warehouse (soft delete)
  eliminarAlmacen(id: number): Observable<any> {
    return this.http.delete(`${this.apiURL}/warehouses/${id}`);
  }

  // Reactivate warehouse
  reactivarAlmacen(id: number): Observable<any> {
    return this.http.patch(`${this.apiURL}/warehouses/${id}/reactivate`, {});
  }
}
