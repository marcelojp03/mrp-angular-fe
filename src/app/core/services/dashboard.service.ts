import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  DashboardStatsResponse,
  StockAlertsResponse,
  RecentMovementsResponse,
  TopProductsResponse
} from '../../dashboard/components/home/home.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.backend.host}/dashboard`;

  /**
   * Obtiene KPIs del dashboard (productos, stock bajo, movimientos)
   * GET /api/dashboard/kpis
   * Endpoint real según documentación
   */
  getKPIs(): Observable<DashboardStatsResponse> {
    return this.http.get<DashboardStatsResponse>(`${this.apiUrl}/kpis`);
  }

  /**
   * Obtiene alertas de stock bajo
   * GET /api/stocks/low
   * Endpoint correcto según documentación
   */
  getAlerts(): Observable<StockAlertsResponse> {
    return this.http.get<StockAlertsResponse>(`${environment.backend.host}/stocks/low`);
  }
}