import { Component, OnInit, signal, inject } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { AIReportsService } from './ai-reports.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { MessageService } from 'primeng/api';
import { AIReportResponse } from './ai-reports.interface';

@Component({
  selector: 'app-ai-reports',
  standalone: true,
  imports: [SharedModule],
  providers: [MessageService],
  templateUrl: './ai-reports.component.html',
  styles: [`
    :host ::ng-deep {
      .query-textarea {
        min-height: 120px;
      }
      .sql-display {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 1rem;
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
      }
    }
  `]
})
export class AIReportsComponent implements OnInit {
  private aiService = inject(AIReportsService);
  private subscriptionService = inject(SubscriptionService);
  private messageService = inject(MessageService);

  // Signals
  query = signal('');
  limit = signal(50);
  loading = signal(false);
  result = signal<AIReportResponse['data'] | null>(null);
  
  // Usage stats
  usageToday = signal(0);
  usageLimit = signal(10);
  usagePercentage = signal(0);

  // Ejemplos de consultas
  exampleQueries = [
    '¿Cuántos productos tengo en stock bajo mínimo?',
    'Muéstrame los 10 productos con menos stock',
    '¿Cuántos movimientos de entrada hubo esta semana?',
    'Lista de proveedores activos con sus productos',
    'Total de usuarios por rol en mi organización',
    'Últimos 20 logs del sistema',
    '¿Cuántos productos tengo en cada almacén?',
    'Proveedores con más de 5 productos asociados'
  ];

  ngOnInit(): void {
    this.loadUsageStats();
  }

  loadUsageStats(): void {
    this.subscriptionService.getSubscription().subscribe({
      next: (response) => {
        if (response.success && response.data.usage) {
          const aiUsage = response.data.usage.ai_reports_today;
          if (aiUsage) {
            this.usageToday.set(aiUsage.current);
            this.usageLimit.set(aiUsage.limit);
            this.usagePercentage.set(
              this.subscriptionService.getUsagePercentage(aiUsage.current, aiUsage.limit)
            );
          }
        }
      },
      error: (err) => {
        console.error('Error loading usage stats:', err);
      }
    });
  }

  generateReport(): void {
    if (!this.query().trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Consulta Vacía',
        detail: 'Por favor ingrese una consulta'
      });
      return;
    }

    this.loading.set(true);
    this.result.set(null);

    this.aiService.generateReport(this.query(), this.limit()).subscribe({
      next: (response) => {
        if (response.success) {
          this.result.set(response.data);
          this.loadUsageStats(); // Actualizar contador
          
          this.messageService.add({
            severity: 'success',
            summary: 'Reporte Generado',
            detail: `${response.data.row_count} resultados en ${response.data.took_ms}ms`
          });
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        
        let errorMessage = 'Error al generar reporte';
        if (err.status === 429) {
          errorMessage = 'Límite de reportes AI alcanzado para hoy. Mejora tu plan para más consultas.';
        } else if (err.error?.message) {
          errorMessage = err.error.message;
        }

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage,
          life: 5000
        });
      }
    });
  }

  exportToCSV(): void {
    if (!this.query().trim()) {
      return;
    }

    this.loading.set(true);

    this.aiService.exportToCSV(this.query(), this.limit()).subscribe({
      next: (blob) => {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        this.aiService.downloadCSV(blob, `reporte-ai-${timestamp}.csv`);
        
        this.messageService.add({
          severity: 'success',
          summary: 'CSV Exportado',
          detail: 'El archivo se ha descargado correctamente'
        });
        
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error al Exportar',
          detail: 'No se pudo generar el archivo CSV'
        });
      }
    });
  }

  useExample(example: string): void {
    this.query.set(example);
  }

  clearResults(): void {
    this.result.set(null);
    this.query.set('');
  }

  getTableData(): any[] {
    if (!this.result()) return [];
    return this.result()!.rows;
  }

  getUsageSeverity(): 'success' | 'info' | 'warn' | 'danger' {
    return this.subscriptionService.getUsageSeverity(this.usagePercentage());
  }
}
