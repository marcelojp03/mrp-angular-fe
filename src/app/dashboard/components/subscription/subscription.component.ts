import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { SubscriptionService } from './subscription.service';
import { Subscription, UsageStats, Plan, Organization } from './subscription.interface';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TagModule,
    ToastModule,
    ProgressBarModule,
    DividerModule,
    ProgressSpinnerModule
  ],
  providers: [MessageService],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.scss'
})
export class SubscriptionComponent implements OnInit {
  private subscriptionService = inject(SubscriptionService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  // Signals
  organization = signal<Organization | null>(null);
  plan = signal<Plan | null>(null);
  subscription = signal<Subscription | null>(null);
  usage = signal<UsageStats | null>(null);
  loading = signal<boolean>(false);

  ngOnInit(): void {
    this.debugToken(); // Verificar token al iniciar
    this.loadSubscription();
  }

  /**
   * Método de debugging para verificar el token
   */
  debugToken(): void {
    const token = localStorage.getItem('token');
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    
    console.group('[SubscriptionComponent] Debug Token Info');
    console.log('token:', token ? `${token.substring(0, 30)}...` : 'NO ENCONTRADO');
    console.log('access_token:', accessToken ? `${accessToken.substring(0, 30)}...` : 'NO ENCONTRADO');
    console.log('refresh_token:', refreshToken ? `${refreshToken.substring(0, 30)}...` : 'NO ENCONTRADO');
    console.log('localStorage keys:', Object.keys(localStorage));
    console.groupEnd();
  }

  loadSubscription(): void {
    this.loading.set(true);

    this.subscriptionService.getSubscription().subscribe({
      next: (response) => {
        console.log('[SubscriptionComponent] Response completa:', response);
        console.log('[SubscriptionComponent] response.data:', response.data);
        
        // ✅ Estructura correcta del backend
        this.organization.set(response.data.organization);
        this.plan.set(response.data.plan);
        this.subscription.set(response.data.subscription);
        this.usage.set(response.data.usage || null);
        
        console.log('[SubscriptionComponent] Organization:', this.organization());
        console.log('[SubscriptionComponent] Plan:', this.plan());
        console.log('[SubscriptionComponent] Subscription:', this.subscription());
        console.log('[SubscriptionComponent] Usage:', this.usage());
        
        this.loading.set(false);
      },
      error: (error: any) => {
        console.error('[SubscriptionComponent] Error completo:', error);
        console.error('[SubscriptionComponent] Error status:', error.status);
        console.error('[SubscriptionComponent] Error message:', error.message);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar la información de suscripción'
        });
        this.loading.set(false);
      }
    });
  }

  getStatusSeverity(): 'success' | 'info' | 'warn' | 'danger' {
    const status = this.subscription()?.status;
    switch (status) {
      case 'active': return 'success';
      case 'trial': return 'info';
      case 'past_due': return 'warn';
      case 'canceled': return 'danger';
      default: return 'info';
    }
  }

  getStatusLabel(): string {
    const status = this.subscription()?.status;
    switch (status) {
      case 'active': return 'Activa';
      case 'trial': return 'Período de Prueba';
      case 'past_due': return 'Pago Pendiente';
      case 'canceled': return 'Cancelada';
      default: return 'Desconocido';
    }
  }

  getUsagePercentage(current: number, limit: number): number {
    if (limit === 0) return 0;
    if (limit >= 999999) return 0; // Unlimited
    return Math.round((current / limit) * 100);
  }

  getUsageSeverity(current: number, limit: number): 'success' | 'info' | 'warn' | 'danger' {
    if (limit >= 999999) return 'success'; // Unlimited
    const percentage = this.getUsagePercentage(current, limit);
    if (percentage >= 100) return 'danger';
    if (percentage >= 80) return 'warn';
    if (percentage >= 50) return 'info';
    return 'success';
  }

  isUnlimited(limit: number): boolean {
    return limit >= 999999;
  }

  formatLimit(limit: number): string {
    return this.isUnlimited(limit) ? '∞' : limit.toString();
  }

  getDaysUntilBilling(): number | null {
    // El backend no retorna next_billing_date en la nueva estructura
    return null;
  }

  getDaysUntilTrialEnd(): number | null {
    const trialDaysRemaining = this.subscription()?.trial_days_remaining;
    return trialDaysRemaining !== null && trialDaysRemaining !== undefined ? trialDaysRemaining : null;
  }

  goToUpgrade(): void {
    this.router.navigate(['/landing']);
  }

  manageBilling(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Próximamente',
      detail: 'La gestión de facturación estará disponible próximamente'
    });
  }

  cancelSubscription(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Próximamente',
      detail: 'La cancelación de suscripción estará disponible próximamente'
    });
  }
}
