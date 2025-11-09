import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import type { ProductionReportResponse, ProductionReportParams } from './interfaces/production-report.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductionReportsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.backend.host}/work-orders/reports`;

  getProductionStats(params?: ProductionReportParams): Observable<ProductionReportResponse> {
    let httpParams = new HttpParams();
    
    if (params?.from) {
      httpParams = httpParams.set('from', params.from);
    }
    if (params?.to) {
      httpParams = httpParams.set('to', params.to);
    }

    return this.http.get<ProductionReportResponse>(`${this.apiUrl}/stats`, { params: httpParams });
  }
}
