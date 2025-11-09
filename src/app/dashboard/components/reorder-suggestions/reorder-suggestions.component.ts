import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ReorderSuggestion } from './reorder-suggestions.interface';
import { ReorderSuggestionsService } from './reorder-suggestions.service';
import { StatsCardComponent, type StatCardConfig } from '../../../shared/components/stats-card.component';

@Component({
  selector: 'app-reorder-suggestions',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    CardModule,
    TagModule,
    ToastModule,
    StatsCardComponent
  ],
  providers: [MessageService],
  templateUrl: './reorder-suggestions.component.html'
})
export class ReorderSuggestionsComponent implements OnInit {
  private suggestionsService = inject(ReorderSuggestionsService);
  private messageService = inject(MessageService);

  suggestions = signal<ReorderSuggestion[]>([]);
  loading = signal<boolean>(false);

  // Computed stats para las cards
  statsCards = computed<StatCardConfig[]>(() => {
    const data = this.suggestions();
    return [
      {
        label: 'Total Sugerencias',
        value: data.length,
        icon: 'pi-list',
        color: 'blue',
        footer: 'Productos a reponer',
        footerClass: 'text-blue-500 font-medium'
      },
      {
        label: 'Urgentes',
        value: data.filter(s => {
          const percentage = (s.current_stock / s.min_stock) * 100;
          return percentage <= 25;
        }).length,
        icon: 'pi-exclamation-triangle',
        color: 'red',
        footer: 'Requieren atención',
        footerClass: 'text-red-500 font-medium'
      },
      {
        label: 'Con Proveedor',
        value: data.filter(s => s.supplier_id !== null).length,
        icon: 'pi-check-circle',
        color: 'green',
        footer: 'Listos para ordenar',
        footerClass: 'text-green-500 font-medium'
      },
      {
        label: 'Total a Ordenar',
        value: data.reduce((sum, s) => sum + s.suggested_qty, 0),
        icon: 'pi-shopping-cart',
        color: 'orange',
        footer: 'Unidades totales',
        footerClass: 'text-orange-500 font-medium'
      }
    ];
  });

  ngOnInit() {
    this.loadSuggestions();
  }

  loadSuggestions() {
    this.loading.set(true);
    this.suggestionsService.getSuggestions().subscribe({
      next: (response) => {
        if (response.success) {
          this.suggestions.set(response.data);
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading suggestions:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las sugerencias de reposición'
        });
        this.loading.set(false);
      }
    });
  }

  getPrioritySeverity(currentStock: number, minStock: number): 'danger' | 'warning' | 'success' {
    const percentage = (currentStock / minStock) * 100;
    if (percentage <= 25) return 'danger';
    if (percentage <= 50) return 'warning';
    return 'success';
  }

  getPriorityLabel(currentStock: number, minStock: number): string {
    const percentage = (currentStock / minStock) * 100;
    if (percentage <= 25) return 'URGENTE';
    if (percentage <= 50) return 'ALTA';
    return 'MEDIA';
  }

  createPurchaseOrder(item: ReorderSuggestion) {
    this.messageService.add({
      severity: 'info',
      summary: 'Orden de Compra',
      detail: `Creando orden para ${item.suggested_qty} unidades de ${item.name}`,
      life: 5000
    });
    // TODO: Implementar creación de orden de compra
  }
}
