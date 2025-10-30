import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BackupResponse } from './backup.interface';

@Injectable({
  providedIn: 'root'
})
export class BackupService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.backend.host}/backup`;

  /**
   * Genera un backup completo de la base de datos
   */
  generateBackup(): Observable<BackupResponse> {
    return this.http.get<BackupResponse>(this.API_URL);
  }

  /**
   * Descarga el backup como archivo JSON
   */
  downloadBackup(data: any, orgName: string = 'organization'): void {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup-${orgName}-${timestamp}.json`;
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
