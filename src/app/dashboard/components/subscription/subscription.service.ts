import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SubscriptionResponse } from './subscription.interface';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.backend.host}/subscription`;

  /**
   * Obtiene la información de la suscripción actual y uso
   */
  getSubscription(): Observable<SubscriptionResponse> {
    return this.http.get<SubscriptionResponse>(this.API_URL);
  }

  /**
   * Calcula el porcentaje de uso de un límite
   */
  getUsagePercentage(current: number, limit: number): number {
    if (limit >= 999999) return 0; // Ilimitado
    return Math.round((current / limit) * 100);
  }

  /**
   * Determina la severidad del uso (para badges de PrimeNG)
   */
  getUsageSeverity(percentage: number): 'success' | 'info' | 'warn' | 'danger' {
    if (percentage < 50) return 'success';
    if (percentage < 75) return 'info';
    if (percentage < 90) return 'warn';
    return 'danger';
  }
}
