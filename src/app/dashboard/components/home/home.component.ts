import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../core/services/dashboard.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { MessageService } from 'primeng/api';
import { SharedModule } from '../../../shared/shared.module';
import { StatsWidget } from './components/statswidget';
import { StockAlertsWidget } from './components/stockalertswidget';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DashboardStats, StockAlert } from './home.interface';

interface SubscriptionData {
  plan: {
    name: string;
    code: string;
  };
  subscription: {
    status: string;
    is_trial: boolean;
  };
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    StatsWidget,
    StockAlertsWidget,
    TagModule,
    ProgressSpinnerModule
  ],
  providers: [MessageService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private subscriptionService = inject(SubscriptionService);
  private messageService = inject(MessageService);

  // Signals
  stats = signal<DashboardStats | null>(null);
  stockAlerts = signal<StockAlert[]>([]);
  subscription = signal<SubscriptionData | null>(null);
  loading = signal<boolean>(false);

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading.set(true);

    // Load KPIs
    this.dashboardService.getKPIs().subscribe({
      next: (response) => {
        if (response.success) {
          this.stats.set(response.data);
        }
      },
      error: (err) => {
        console.error('Error loading KPIs:', err);
        // Solo mostrar error si no es 401 (ya manejado por interceptor)
        if (err.status !== 401) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar las estadísticas',
            life: 3000
          });
        }
      }
    });

    // Load Alerts
    this.dashboardService.getAlerts().subscribe({
      next: (response) => {
        if (response.success) {
          this.stockAlerts.set(response.data);
        }
      },
      error: (err) => {
        console.error('Error loading alerts:', err);
        // Solo mostrar error si no es 401 (ya manejado por interceptor)
        if (err.status !== 401) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar las alertas',
            life: 3000
          });
        }
      }
    });

    // Load Subscription (optional - may not be available)
    this.subscriptionService.getSubscription().subscribe({
      next: (response) => {
        if (response.success) {
          this.subscription.set(response.data);
        }
        this.loading.set(false);
      },
      error: (err) => {
        // 404 es esperado si el endpoint no existe aún
        if (err.status === 404) {
          console.warn('Subscription endpoint not available (404)');
          // Set default free plan
          this.subscription.set({
            plan: {
              name: 'Free',
              code: 'free'
            },
            subscription: {
              status: 'trial',
              is_trial: true
            }
          });
        } else if (err.status !== 401) {
          console.error('Error loading subscription:', err);
        }
        this.loading.set(false);
      }
    });
  }
}
