import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AIReportRequest, AIReportResponse } from './ai-reports.interface';

@Injectable({
  providedIn: 'root'
})
export class AIReportsService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.backend.host}/reports/nl`;

  /**
   * Genera un reporte usando IA a partir de lenguaje natural
   */
  generateReport(query: string, limit: number = 50): Observable<AIReportResponse> {
    const request: AIReportRequest = { query, limit };
    return this.http.post<AIReportResponse>(this.API_URL, request);
  }

  /**
   * Exporta el reporte a CSV
   */
  exportToCSV(query: string, limit: number = 100): Observable<Blob> {
    const request: AIReportRequest = { query, limit };
    return this.http.post(`${this.API_URL}/csv`, request, {
      responseType: 'blob'
    });
  }

  /**
   * Descarga el archivo CSV
   */
  downloadCSV(blob: Blob, filename: string = 'reporte.csv'): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
