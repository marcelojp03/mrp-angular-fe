import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MovementsResponse } from './movements.interface';

@Injectable({
  providedIn: 'root'
})
export class MovementsService {
  private http = inject(HttpClient);
  private apiURL = environment.backend.host;

  getMovements(): Observable<MovementsResponse> {
    const url = `${this.apiURL}/movements`;
    return this.http.get<MovementsResponse>(url);
  }

  getMovementsByProduct(productId: number): Observable<MovementsResponse> {
    const url = `${this.apiURL}/movements?product_id=${productId}`;
    return this.http.get<MovementsResponse>(url);
  }

  getMovementsByWarehouse(warehouseId: number): Observable<MovementsResponse> {
    const url = `${this.apiURL}/movements?warehouse_id=${warehouseId}`;
    return this.http.get<MovementsResponse>(url);
  }

  getMovementsByDateRange(startDate: string, endDate: string): Observable<MovementsResponse> {
    const url = `${this.apiURL}/movements?start_date=${startDate}&end_date=${endDate}`;
    return this.http.get<MovementsResponse>(url);
  }
}
