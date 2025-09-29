import { HttpBackend, HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { environment } from "../../../../environments/environment";
import { AuthService } from '../../../core/services/auth.service';
import { SupplierItemsResponse, SupplierItem, SupplierItemRequest, SupplierItemUpdateRequest } from './interfaces/supplier-item.interface';

@Injectable({ providedIn: 'root' })  
export class SupplierItemService {
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

  // Main method for listing all supplier items
  public listar(): Observable<SupplierItemsResponse> {
    const httpOptions = {
      headers: this.getAuthHeaders()
    };
    return this.http.get<SupplierItemsResponse>(`${this.apiURL}/supplier-items`, httpOptions);
  }

  // Get supplier items by product ID
  public listarPorProducto(productId: number): Observable<SupplierItemsResponse> {
    const httpOptions = {
      headers: this.getAuthHeaders()
    };
    return this.http.get<SupplierItemsResponse>(`${this.apiURL}/supplier-items?product_id=${productId}`, httpOptions);
  }

  // Get supplier items by supplier ID
  public listarPorProveedor(supplierId: number): Observable<SupplierItemsResponse> {
    const httpOptions = {
      headers: this.getAuthHeaders()
    };
    return this.http.get<SupplierItemsResponse>(`${this.apiURL}/supplier-items?supplier_id=${supplierId}`, httpOptions);
  }

  // Get specific supplier item by ID
  public buscarItem(id: number): Observable<any> {
    const httpOptions = {
      headers: this.getAuthHeaders()
    };
    return this.http.get(`${this.apiURL}/supplier-items/${id}`, httpOptions);
  }

  // Create new supplier item
  public registrarItem(data: SupplierItemRequest): Observable<any> {
    const httpOptions = {
      headers: this.getAuthHeaders()
    };
    return this.http.post(`${this.apiURL}/supplier-items`, data, httpOptions);
  }

  // Update existing supplier item
  public actualizarItem(data: SupplierItemUpdateRequest): Observable<any> {
    const httpOptions = {
      headers: this.getAuthHeaders()
    };
    return this.http.put(`${this.apiURL}/supplier-items/${data.id}`, data, httpOptions);
  }

  // Delete supplier item
  public eliminarItem(id: number): Observable<any> {
    const httpOptions = {
      headers: this.getAuthHeaders()
    };
    return this.http.delete(`${this.apiURL}/supplier-items/${id}`, httpOptions);
  }

  // Toggle active status
  public toggleEstado(id: number): Observable<any> {
    const httpOptions = {
      headers: this.getAuthHeaders()
    };
    return this.http.patch(`${this.apiURL}/supplier-items/${id}/toggle-active`, {}, httpOptions);
  }

  // Set as preferred supplier for a product
  public marcarComoPreferido(id: number): Observable<any> {
    const httpOptions = {
      headers: this.getAuthHeaders()
    };
    return this.http.patch(`${this.apiURL}/supplier-items/${id}/set-preferred`, {}, httpOptions);
  }
}