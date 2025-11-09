import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { BOMsResponse, ProductsResponse, UnitsResponse, BOM } from './interfaces/bom.interface';

@Injectable({
  providedIn: 'root'
})
export class BomsService {
  private http = inject(HttpClient);
  private apiUrl = environment.backend.host;

  getBOMs(): Observable<BOMsResponse> {
    return this.http.get<BOMsResponse>(`${this.apiUrl}/boms`);
  }

  getBOM(id: number): Observable<{ data: BOM; success: boolean; message: string }> {
    return this.http.get<{ data: BOM; success: boolean; message: string }>(`${this.apiUrl}/boms/${id}`);
  }

  // Obtener TODOS los productos (para seleccionar componentes en la BOM)
  getProducts(): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(`${this.apiUrl}/products`);
  }

  // Obtener solo productos con BOM activa (para el selector principal de la BOM)
  getProductsWithBOM(): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(`${this.apiUrl}/boms/products-with-active-bom`);
  }

  getUnits(): Observable<UnitsResponse> {
    return this.http.get<UnitsResponse>(`${this.apiUrl}/units`);
  }

  createBOM(bom: Partial<BOM>): Observable<{ data: BOM; success: boolean; message: string }> {
    return this.http.post<{ data: BOM; success: boolean; message: string }>(`${this.apiUrl}/boms`, bom);
  }

  updateBOM(id: number, bom: Partial<BOM>): Observable<{ data: BOM; success: boolean; message: string }> {
    return this.http.put<{ data: BOM; success: boolean; message: string }>(`${this.apiUrl}/boms/${id}`, bom);
  }

  activateBOM(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.put<{ success: boolean; message: string }>(`${this.apiUrl}/boms/${id}/activate`, {});
  }

  deleteBOM(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/boms/${id}`);
  }
}
