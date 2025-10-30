import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from 'rxjs';
import { environment } from "../../../../environments/environment";
import { SuppliersResponse, Supplier, SupplierRequest, SupplierUpdateRequest } from './interfaces/supplier.interface';

@Injectable({ providedIn: 'root' })  
export class SupplierService {
  private http = inject(HttpClient);
  private apiURL = environment.backend.host;

  // Main method for listing all suppliers
  public listar(): Observable<SuppliersResponse> {
    return this.http.get<SuppliersResponse>(`${this.apiURL}/suppliers`);
  }

  // Get specific supplier by ID
  public buscarProveedor(id: number): Observable<any> {
    return this.http.get(`${this.apiURL}/suppliers/${id}`);
  }

  // Create new supplier
  public registrarProveedor(data: SupplierRequest): Observable<any> {
    return this.http.post(`${this.apiURL}/suppliers`, data);
  }

  // Update existing supplier
  public actualizarProveedor(data: SupplierUpdateRequest): Observable<any> {
    return this.http.put(`${this.apiURL}/suppliers/${data.id}`, data);
  }

  // Delete supplier (soft delete)
  public eliminarProveedor(id: number): Observable<any> {
    return this.http.delete(`${this.apiURL}/suppliers/${id}`);
  }

  // Reactivate supplier
  public reactivarProveedor(id: number): Observable<any> {
    return this.http.patch(`${this.apiURL}/suppliers/${id}/reactivate`, {});
  }
}
