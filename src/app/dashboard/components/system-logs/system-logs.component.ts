import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';

import { SystemLogsService } from './system-logs.service';
import { SystemLog, LogsParams } from './system-logs.interface';

@Component({
  selector: 'app-system-logs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    TableModule,
    InputTextModule,
    DatePickerModule,
    SelectModule,
    TagModule,
    ToastModule,
    ProgressSpinnerModule,
    DialogModule
  ],
  providers: [MessageService],
  templateUrl: './system-logs.component.html',
  styleUrl: './system-logs.component.scss'
})
export class SystemLogsComponent implements OnInit {
  private logsService = inject(SystemLogsService);
  private messageService = inject(MessageService);

  // Signals
  logs = signal<SystemLog[]>([]);
  loading = signal<boolean>(false);
  totalRecords = signal<number>(0);
  selectedLog = signal<SystemLog | null>(null);
  showDialog = signal<boolean>(false);

  // Filters
  page = signal<number>(1);
  limit = signal<number>(25);
  startDate = signal<Date | null>(null);
  endDate = signal<Date | null>(null);
  selectedUser = signal<string | null>(null);
  selectedMethod = signal<string | null>(null);
  searchPath = signal<string>('');

  // Filter options
  methodOptions = [
    { label: 'Todos', value: null },
    { label: 'GET', value: 'GET' },
    { label: 'POST', value: 'POST' },
    { label: 'PUT', value: 'PUT' },
    { label: 'PATCH', value: 'PATCH' },
    { label: 'DELETE', value: 'DELETE' }
  ];

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.loading.set(true);

    const params: LogsParams = {
      page: this.page(),
      per_page: this.limit()
    };

    if (this.selectedUser()) {
      params.user_id = parseInt(this.selectedUser()!);
    }
    if (this.selectedMethod()) {
      params.method = this.selectedMethod()!;
    }
    if (this.searchPath().trim()) {
      params.path = this.searchPath();
    }

    this.logsService.getLogs(params).subscribe({
      next: (response) => {
        this.logs.set(response.data.logs);
        this.totalRecords.set(response.data.total);
        this.loading.set(false);
      },
      error: (error: any) => {
        console.error('Error loading logs:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los logs del sistema'
        });
        this.loading.set(false);
      }
    });
  }

  onPageChange(event: any): void {
    this.page.set(event.page + 1);
    this.limit.set(event.rows);
    this.loadLogs();
  }

  applyFilters(): void {
    this.page.set(1);
    this.loadLogs();
  }

  clearFilters(): void {
    this.startDate.set(null);
    this.endDate.set(null);
    this.selectedUser.set(null);
    this.selectedMethod.set(null);
    this.searchPath.set('');
    this.page.set(1);
    this.loadLogs();
  }

  viewLogDetails(log: SystemLog): void {
    this.selectedLog.set(log);
    this.showDialog.set(true);
  }

  getStatusSeverity(statusCode: number): string {
    if (statusCode >= 200 && statusCode < 300) return 'success';
    if (statusCode >= 300 && statusCode < 400) return 'info';
    if (statusCode >= 400 && statusCode < 500) return 'warn';
    return 'danger';
  }

  getMethodSeverity(method: string): string {
    switch (method) {
      case 'GET': return 'info';
      case 'POST': return 'success';
      case 'PUT': return 'warn';
      case 'PATCH': return 'warn';
      case 'DELETE': return 'danger';
      default: return 'secondary';
    }
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  exportLogs(): void {
    if (this.logs().length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Sin Datos',
        detail: 'No hay logs para exportar'
      });
      return;
    }

    try {
      const csvHeader = 'ID,Usuario ID,Método,Path,Status,IP,Fecha\n';
      const csvRows = this.logs().map(log => 
        `${log.id},${log.user_id},"${log.method}","${log.path}",${log.status_code},"${log.ip}","${log.ts}"`
      ).join('\n');
      
      const csvContent = csvHeader + csvRows;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      link.download = `system_logs_${timestamp}.csv`;
      
      link.click();
      window.URL.revokeObjectURL(url);

      this.messageService.add({
        severity: 'success',
        summary: 'Exportación Exitosa',
        detail: 'Los logs se exportaron correctamente'
      });
    } catch (error) {
      console.error('Error exporting logs:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al exportar los logs'
      });
    }
  }
}
