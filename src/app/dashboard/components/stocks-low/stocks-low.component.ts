import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { StocksLowService } from './stocks-low.service';
import { StockLowItem } from './stocks-low.interface';

@Component({
  selector: 'app-stocks-low',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './stocks-low.component.html'
})
export class StocksLowComponent implements OnInit {
  private stocksService = inject(StocksLowService);
  private messageService = inject(MessageService);

  stocks = signal<StockLowItem[]>([]);
  loading = signal<boolean>(false);

  ngOnInit() {
    this.loadStocks();
  }

  loadStocks() {
    this.loading.set(true);
    this.stocksService.getStocksLow().subscribe({
      next: (response) => {
        if (response.success) {
          this.stocks.set(response.data);
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading stocks:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las alertas de stock'
        });
        this.loading.set(false);
      }
    });
  }

  getSeverity(difference: number, minStock: number): 'danger' | 'warning' | 'info' {
    const percentage = (Math.abs(difference) / minStock) * 100;
    if (percentage >= 50) return 'danger';
    if (percentage >= 25) return 'warning';
    return 'info';
  }

  getSeverityLabel(difference: number, minStock: number): string {
    const percentage = (Math.abs(difference) / minStock) * 100;
    if (percentage >= 50) return 'Crítico';
    if (percentage >= 25) return 'Advertencia';
    return 'Bajo';
  }
}
