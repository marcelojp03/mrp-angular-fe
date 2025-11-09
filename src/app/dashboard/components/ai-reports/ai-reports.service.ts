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
    const request: AIReportRequest = { 
      query, 
      format: 'json',
      limit 
    };
    return this.http.post<AIReportResponse>(this.API_URL, request);
  }

  /**
   * Exporta el reporte en formato específico (CSV, Excel, PDF)
   */
  exportReport(query: string, format: 'csv' | 'excel' | 'pdf', limit: number = 100): Observable<Blob> {
    const request: AIReportRequest = { 
      query, 
      format,
      limit 
    };
    return this.http.post(this.API_URL, request, {
      responseType: 'blob'
    });
  }

  /**
   * Descarga un archivo (CSV, Excel o PDF)
   */
  downloadFile(blob: Blob, format: 'csv' | 'excel' | 'pdf', baseFilename: string = 'reporte'): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const timestamp = new Date().toISOString().split('T')[0];
    const extension = format === 'excel' ? 'xlsx' : format;
    link.download = `${baseFilename}_${timestamp}.${extension}`;
    
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
