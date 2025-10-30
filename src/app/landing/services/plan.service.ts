import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Plan, PlansResponse } from '../interfaces/plan.interface';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.backend.host}/public/plans`;

  // Signal para almacenar los planes
  plans = signal<Plan[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  /**
   * Obtiene todos los planes disponibles (endpoint público)
   */
  getPlans(): Observable<PlansResponse> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<PlansResponse>(this.API_URL).pipe(
      tap({
        next: (response) => {
          if (response.success) {
            this.plans.set(response.data);
          }
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Error al cargar los planes');
          this.loading.set(false);
          console.error('Error fetching plans:', err);
        }
      })
    );
  }

  /**
   * Obtiene el precio de un plan (esto debería venir del backend eventualmente)
   */
  getPlanPrice(code: string): { amount: number; currency: string; period: string } {
    const prices: Record<string, { amount: number; currency: string; period: string }> = {
      free: { amount: 0, currency: '$', period: 'siempre' },
      starter: { amount: 29, currency: '$', period: 'mes' },
      pro: { amount: 99, currency: '$', period: 'mes' }
    };
    return prices[code.toLowerCase()] || prices['free'];
  }

  /**
   * Verifica si un plan es popular (para destacarlo en la UI)
   */
  isPopularPlan(code: string): boolean {
    return code.toLowerCase() === 'starter';
  }
}
