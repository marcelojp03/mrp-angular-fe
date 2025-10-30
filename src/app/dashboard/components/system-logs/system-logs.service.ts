import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LogsResponse, LogsParams } from './system-logs.interface';

@Injectable({
  providedIn: 'root'
})
export class SystemLogsService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.backend.host}/logs`;

  /**
   * Obtiene los logs del sistema con filtros opcionales
   */
  getLogs(params?: LogsParams): Observable<LogsResponse> {
    let httpParams = new HttpParams();
    
    if (params) {
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.per_page) httpParams = httpParams.set('per_page', params.per_page.toString());
      if (params.user_id) httpParams = httpParams.set('user_id', params.user_id.toString());
      if (params.method) httpParams = httpParams.set('method', params.method);
      if (params.path) httpParams = httpParams.set('path', params.path);
    }

    return this.http.get<LogsResponse>(this.API_URL, { params: httpParams });
  }
}
