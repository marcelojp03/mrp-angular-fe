import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from 'rxjs/operators';
import { Observable } from "rxjs/internal/Observable";
import { environment } from "../../../../environments/environment";
import { AuthService } from "../../../core/services/auth.service";
import { ProductsResponse, Product, ProductRequest, ProductUpdateRequest } from "./interfaces/product.interface";

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private apiURL = environment.backend.host;
  
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getAuthToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Main method for listing all products
  public listadoCompleto(): Observable<ProductsResponse> {
    const httpOptions = {
      headers: this.getAuthHeaders()
    };
    return this.http.get<ProductsResponse>(`${this.apiURL}/products`, httpOptions);
  }

  // Get specific product by ID
  public buscarProducto(id: number): Observable<any> {
    const httpOptions = {
      headers: this.getAuthHeaders()
    };
    return this.http.get(`${this.apiURL}/products/${id}`, httpOptions);
  }

  // Create new product
  public registrarProducto(registro: ProductRequest): Observable<any> {
    const httpOptions = {
      headers: this.getAuthHeaders()
    };
    return this.http.post(`${this.apiURL}/products`, registro, httpOptions);
  }

  // Update existing product
  public actualizarProducto(registro: ProductUpdateRequest): Observable<any> {
    const httpOptions = {
      headers: this.getAuthHeaders()
    };
    return this.http.put(`${this.apiURL}/products/${registro.id}`, registro, httpOptions);
  }

  // Delete product (soft delete)
  public eliminarProducto(id: number): Observable<any> {
    const httpOptions = {
      headers: this.getAuthHeaders()
    };
    return this.http.delete(`${this.apiURL}/products/${id}`, httpOptions);
  }

  // Reactivate product
  public reactivarProducto(id: number): Observable<any> {
    const httpOptions = {
      headers: this.getAuthHeaders()
    };
    return this.http.patch(`${this.apiURL}/products/${id}/reactivate`, {}, httpOptions);
  }

  // Image-related methods (keeping existing functionality if needed)
  uploadImages(datos: any): Observable<any> {
    const httpOptions = {
      headers: this.getAuthHeaders()
    };
    return this.http.post<any>(`${this.apiURL}/products/images`, datos, httpOptions);
  }

  cargarImagenes(id: number): Observable<any> {
    const httpOptions = {
      headers: this.getAuthHeaders()
    };
    return this.http.get<any>(`${this.apiURL}/products/${id}/images`, httpOptions);
  }

  eliminarImagenes(payload: { producto_id: number; imagenes_ids: number[] }): Observable<any> {
    const httpOptions = {
      headers: this.getAuthHeaders()
    };
    return this.http.post(`${this.apiURL}/products/images/delete`, payload, httpOptions);
  }

}