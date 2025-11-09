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
        background: #1f2937;
        border-radius: 8px;
        padding: 1rem;
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
        color: #10b981;
        overflow-x: auto;
      }
      .interpretation-box {
        background: #f0f7ff;
        border-left: 4px solid #366092;
        padding: 16px;
        border-radius: 4px;
      }
      .dark .interpretation-box {
        background: #1e3a5f;
        border-left-color: #60a5fa;
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
    '¿Cuántos productos tengo?',
    'Lista de productos activos',
    'Productos con stock bajo del mínimo',
    'Proveedores de la ciudad de Santa Cruz',
    'Productos con su categoría y proveedor',
    'Movimientos de inventario del último mes',
    'Total de stock por almacén',
    '¿Cuántos proveedores tengo activos?'
  ];

  // Reportes rápidos para migración desde "Exportar CSV"
  quickReports = [
    {
      label: 'Exportar Productos',
      query: 'lista completa de productos activos con stock y categoría',
      format: 'excel' as const,
      icon: 'pi-box',
      severity: 'success' as const,
      description: 'Exporta todos los productos a Excel'
    },
    {
      label: 'Exportar Movimientos',
      query: 'movimientos de inventario de los últimos 30 días con producto y almacén',
      format: 'excel' as const,
      icon: 'pi-arrow-right-arrow-left',
      severity: 'info' as const,
      description: 'Exporta movimientos recientes a Excel'
    },
    {
      label: 'Stock Bajo',
      query: 'productos con stock por debajo del mínimo con su almacén',
      format: 'pdf' as const,
      icon: 'pi-exclamation-triangle',
      severity: 'warning' as const,
      description: 'Reporte de productos con stock bajo'
    },
    {
      label: 'Inventario Total',
      query: 'stock total por almacén y categoría',
      format: 'excel' as const,
      icon: 'pi-chart-bar',
      severity: 'help' as const,
      description: 'Resumen completo de inventario'
    }
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
        console.log('Respuesta completa del backend:', JSON.stringify(response, null, 2));
        
        if (response.success && response.data) {
          console.log('✅ Reporte exitoso');
          this.result.set(response.data);
          this.loadUsageStats(); // Actualizar contador
          
          this.messageService.add({
            severity: 'success',
            summary: 'Reporte Generado',
            detail: `${response.data.summary.total_rows} resultados en ${response.data.summary.execution_time_ms}ms`
          });
        } else {
          // El backend respondió 200 pero con success: false
          console.error('❌ Reporte con error:', response);
          const errorMsg = response.message && response.message !== 'OK' 
            ? response.message 
            : 'No se pudo generar el reporte. Verifica la consulta.';
          
          this.messageService.add({
            severity: 'error',
            summary: 'Error en la Consulta',
            detail: errorMsg
          });
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        
        console.error('Error generando reporte:', err);
        
        let errorMessage = 'Error al generar reporte';
        
        if (err.status === 429) {
          errorMessage = 'Límite diario de reportes IA alcanzado para tu plan. Mejora para más consultas.';
        } else if (err.status === 401) {
          errorMessage = 'No autorizado. Por favor inicia sesión nuevamente.';
        } else if (err.status === 400) {
          errorMessage = err.error?.message || 'Query inválido. Intenta reformular tu consulta.';
        } else if (err.status === 500) {
          errorMessage = err.error?.message || 'Error del servidor. OpenAI podría no estar configurado.';
        } else if (err.error?.message && err.error.message !== 'OK') {
          errorMessage = err.error.message;
        } else if (err.message) {
          errorMessage = err.message;
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

  exportReport(format: 'csv' | 'excel' | 'pdf'): void {
    if (!this.query().trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Consulta Vacía',
        detail: 'Por favor ingrese una consulta primero'
      });
      return;
    }

    this.loading.set(true);

    this.aiService.exportReport(this.query(), format, this.limit()).subscribe({
      next: (blob) => {
        this.aiService.downloadFile(blob, format, 'reporte-ia');
        
        const formatNames: Record<string, string> = {
          csv: 'CSV',
          excel: 'Excel',
          pdf: 'PDF'
        };
        
        this.messageService.add({
          severity: 'success',
          summary: `${formatNames[format]} Exportado`,
          detail: 'El archivo se ha descargado correctamente'
        });
        
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        
        console.error('Error exportando reporte:', err);
        
        let errorMessage = `No se pudo generar el archivo ${format.toUpperCase()}`;
        
        if (err.error?.message && err.error.message !== 'OK') {
          errorMessage = err.error.message;
        } else if (err.status === 429) {
          errorMessage = 'Límite de reportes alcanzado. Intenta más tarde.';
        }
        
        this.messageService.add({
          severity: 'error',
          summary: 'Error al Exportar',
          detail: errorMessage
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

  // Ejecutar reporte rápido y exportar directamente
  executeQuickReport(report: typeof this.quickReports[number]): void {
    this.loading.set(true);

    this.aiService.exportReport(report.query, report.format, 1000).subscribe({
      next: (blob) => {
        this.aiService.downloadFile(blob, report.format, report.label.toLowerCase().replace(/\s+/g, '-'));
        
        this.messageService.add({
          severity: 'success',
          summary: 'Reporte Exportado',
          detail: `${report.label} descargado correctamente`
        });
        
        this.loading.set(false);
        this.loadUsageStats(); // Actualizar contador
      },
      error: (err) => {
        this.loading.set(false);
        
        console.error('Error en reporte rápido:', err);
        
        let errorMessage = `No se pudo generar ${report.label}`;
        
        if (err.status === 429) {
          errorMessage = 'Límite de reportes alcanzado. Intenta más tarde.';
        } else if (err.error?.message && err.error.message !== 'OK') {
          errorMessage = err.error.message;
        }
        
        this.messageService.add({
          severity: 'error',
          summary: 'Error al Exportar',
          detail: errorMessage
        });
      }
    });
  }

  getTableData(): any[] {
    if (!this.result()) return [];
    
    const rows = this.result()!.rows;
    
    // El backend ya devuelve objetos, no necesitamos convertir
    return rows;
  }

  getUsageSeverity(): 'success' | 'info' | 'warn' | 'danger' {
    return this.subscriptionService.getUsageSeverity(this.usagePercentage());
  }
}
