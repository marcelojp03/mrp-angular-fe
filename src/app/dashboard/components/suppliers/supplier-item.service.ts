import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from 'rxjs';
import { environment } from "../../../../environments/environment";
import { SupplierItemsResponse, SupplierItem, SupplierItemRequest, SupplierItemUpdateRequest } from './interfaces/supplier-item.interface';

@Injectable({ providedIn: 'root' })  
export class SupplierItemService {
  private http = inject(HttpClient);
  private apiURL = environment.backend.host;

  // Main method for listing all supplier items
  public listar(): Observable<SupplierItemsResponse> {
    return this.http.get<SupplierItemsResponse>(`${this.apiURL}/supplier-items`);
  }

  // Get supplier items by product ID
  public listarPorProducto(productId: number): Observable<SupplierItemsResponse> {
    return this.http.get<SupplierItemsResponse>(`${this.apiURL}/supplier-items?product_id=${productId}`);
  }

  // Get supplier items by supplier ID
  public listarPorProveedor(supplierId: number): Observable<SupplierItemsResponse> {
    return this.http.get<SupplierItemsResponse>(`${this.apiURL}/supplier-items?supplier_id=${supplierId}`);
  }

  // Get specific supplier item by ID
  public buscarItem(id: number): Observable<any> {
    return this.http.get(`${this.apiURL}/supplier-items/${id}`);
  }

  // Create new supplier item
  public registrarItem(data: SupplierItemRequest): Observable<any> {
    return this.http.post(`${this.apiURL}/supplier-items`, data);
  }

  // Update existing supplier item
  public actualizarItem(data: SupplierItemUpdateRequest): Observable<any> {
    return this.http.put(`${this.apiURL}/supplier-items/${data.id}`, data);
  }

  // Delete supplier item
  public eliminarItem(id: number): Observable<any> {
    return this.http.delete(`${this.apiURL}/supplier-items/${id}`);
  }

  // Toggle active status
  public toggleEstado(id: number): Observable<any> {
    return this.http.patch(`${this.apiURL}/supplier-items/${id}/toggle-active`, {});
  }

  // Set as preferred supplier for a product
  public marcarComoPreferido(id: number): Observable<any> {
    return this.http.patch(`${this.apiURL}/supplier-items/${id}/set-preferred`, {});
  }
}