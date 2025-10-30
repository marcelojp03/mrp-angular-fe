import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../core/services/auth.service';
import { BOM, Product, Unit } from './interfaces/bom.interface';

@Injectable({
  providedIn: 'root'
})
export class BomsService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = environment.backend.host;

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({ 
      'Authorization': `Bearer ${this.authService.getAuthToken()}` 
    });
  }

  getBOMs(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/boms`, { headers: this.getHeaders() });
  }

  getProducts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/products`, { headers: this.getHeaders() });
  }

  getUnits(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/units`, { headers: this.getHeaders() });
  }

  createBOM(bom: BOM): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/boms`, bom, { headers: this.getHeaders() });
  }

  updateBOM(id: number, bom: BOM): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/boms/${id}`, bom, { headers: this.getHeaders() });
  }

  activateBOM(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/boms/${id}/activate`, {}, { headers: this.getHeaders() });
  }

  deleteBOM(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/boms/${id}`, { headers: this.getHeaders() });
  }
}
