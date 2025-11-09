import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { MessageService } from 'primeng/api';
import { ProductionReportsService } from './production-reports.service';
import type { ProductionReportData, TopBom, TopProduct, MonthlyProduction } from './interfaces/production-report.interface';

@Component({
  selector: 'app-production-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedModule],
  providers: [MessageService],
  templateUrl: './production-reports.component.html',
  styles: [`
    :host ::ng-deep {
      .stat-card {
        border-radius: 12px;
        padding: 1.5rem;
        height: 100%;
      }
      .stat-icon {
        width: 56px;
        height: 56px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
      }
      .chart-card {
        min-height: 400px;
      }
    }
  `]
})
export class ProductionReportsComponent implements OnInit {
  private reportsService = inject(ProductionReportsService);
  private messageService = inject(MessageService);

  // Signals
  loading = signal(false);
  reportData = signal<ProductionReportData | null>(null);
  dateFrom = signal<Date>(new Date(new Date().setDate(new Date().getDate() - 30)));
  dateTo = signal<Date>(new Date());

  // Computed
  summary = computed(() => this.reportData()?.summary || null);
  topBoms = computed(() => this.reportData()?.top_boms || []);
  topProducts = computed(() => this.reportData()?.top_products || []);
  monthlyProduction = computed(() => this.reportData()?.monthly_production || []);

  // Chart data
  statusChartData = computed(() => {
    const summary = this.summary();
    if (!summary) return null;

    // El backend devuelve los estados en español
    const byStatus = summary.by_status;
    
    return {
      labels: ['Planificadas', 'En Progreso', 'Finalizadas', 'Canceladas'],
      datasets: [{
        data: [
          byStatus.Planificada || byStatus.PLANNED || 0,
          byStatus['En Progreso'] || byStatus.IN_PROGRESS || 0,
          byStatus.Finalizada || byStatus.FINISHED || 0,
          byStatus.Cancelada || byStatus.CANCELLED || 0
        ],
        backgroundColor: ['#3B82F6', '#F59E0B', '#10B981', '#EF4444'],
        borderWidth: 0
      }]
    };
  });

  monthlyChartData = computed(() => {
    const monthly = this.monthlyProduction();
    if (!monthly.length) return null;

    return {
      labels: monthly.map(m => this.formatMonth(m.month)),
      datasets: [
        {
          label: 'Finalizadas',
          data: monthly.map(m => m.finished),
          backgroundColor: '#10B981',
          borderRadius: 8
        },
        {
          label: 'En Progreso',
          data: monthly.map(m => m.in_progress),
          backgroundColor: '#F59E0B',
          borderRadius: 8
        },
        {
          label: 'Planificadas',
          data: monthly.map(m => m.planned),
          backgroundColor: '#3B82F6',
          borderRadius: 8
        },
        {
          label: 'Canceladas',
          data: monthly.map(m => m.cancelled),
          backgroundColor: '#EF4444',
          borderRadius: 8
        }
      ]
    };
  });

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const
      }
    }
  };

  monthlyChartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const
      }
    },
    scales: {
      x: { stacked: false },
      y: { stacked: false, beginAtZero: true }
    }
  }));

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    this.loading.set(true);
    
    const params = {
      from: this.formatDate(this.dateFrom()),
      to: this.formatDate(this.dateTo())
    };

    this.reportsService.getProductionStats(params).subscribe({
      next: (response) => {
        if (response.success) {
          this.reportData.set(response.data);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.message || 'No se pudo cargar el reporte'
          });
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando reporte:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el reporte de producción'
        });
        this.loading.set(false);
      }
    });
  }

  onDateChange(): void {
    if (this.dateFrom() && this.dateTo()) {
      if (this.dateFrom() > this.dateTo()) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Fechas Inválidas',
          detail: 'La fecha de inicio no puede ser mayor a la fecha fin'
        });
        return;
      }
      this.loadReport();
    }
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  formatMonth(monthStr: string): string {
    const [year, month] = monthStr.split('-');
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${months[parseInt(month) - 1]} ${year}`;
  }

  toNumber(value: number | string): number {
    return typeof value === 'string' ? parseFloat(value) : value;
  }

  getStatusSeverity(status: string): string {
    const severities: Record<string, string> = {
      'PLANNED': 'info',
      'IN_PROGRESS': 'warning',
      'FINISHED': 'success',
      'CANCELLED': 'danger'
    };
    return severities[status] || 'info';
  }
}
