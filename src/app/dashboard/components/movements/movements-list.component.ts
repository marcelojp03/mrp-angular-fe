import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SharedModule } from '../../../shared/shared.module';
import { MovementsService } from './movements.service';
import { Movement } from './movements.interface';
import { StatsCardComponent, StatCardConfig } from '../../../shared/components/stats-card.component';

@Component({
  selector: 'app-movements-list',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedModule, StatsCardComponent],
  providers: [MessageService],
  templateUrl: './movements-list.component.html'
})
export class MovementsListComponent implements OnInit {
  private movementsService = inject(MovementsService);
  private messageService = inject(MessageService);

  movements = signal<Movement[]>([]);
  loading = signal<boolean>(false);

  // Stats cards computadas
  statsCards = computed<StatCardConfig[]>(() => {
    const data = this.movements();
    const totalMovements = data.length;
    const inMovements = data.filter(m => m.movement_type === 'IN').length;
    const outMovements = data.filter(m => m.movement_type === 'OUT').length;
    const totalQuantityIn = data
      .filter(m => m.movement_type === 'IN')
      .reduce((sum, m) => sum + m.quantity, 0);

    return [
      {
        label: 'Total Movimientos',
        value: totalMovements.toString(),
        icon: 'pi-sync',
        color: 'blue',
        footer: 'Historial completo'
      },
      {
        label: 'Entradas (IN)',
        value: inMovements.toString(),
        icon: 'pi-arrow-down',
        color: 'green',
        footer: `${totalQuantityIn.toFixed(0)} unidades`
      },
      {
        label: 'Salidas (OUT)',
        value: outMovements.toString(),
        icon: 'pi-arrow-up',
        color: 'red',
        footer: 'Despachos y transferencias'
      },
      {
        label: 'Últimos 7 días',
        value: this.getRecentMovements().toString(),
        icon: 'pi-calendar',
        color: 'purple',
        footer: 'Actividad reciente'
      }
    ];
  });

  ngOnInit(): void {
    this.loadMovements();
  }

  loadMovements(): void {
    this.loading.set(true);
    this.movementsService.getMovements().subscribe({
      next: (response) => {
        this.movements.set(response.data || []);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading movements:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los movimientos'
        });
        this.loading.set(false);
      }
    });
  }

  onGlobalFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    const table = document.querySelector('p-table') as any;
    if (table && table.filterGlobal) {
      table.filterGlobal(input.value, 'contains');
    }
  }

  getTypeSeverity(type: string): 'success' | 'danger' | 'info' {
    switch (type) {
      case 'IN':
        return 'success';
      case 'OUT':
        return 'danger';
      default:
        return 'info';
    }
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'IN':
        return 'Entrada';
      case 'OUT':
        return 'Salida';
      default:
        return type;
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'IN':
        return 'pi-arrow-down';
      case 'OUT':
        return 'pi-arrow-up';
      default:
        return 'pi-sync';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private getRecentMovements(): number {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    return this.movements().filter(m => {
      const movementDate = new Date(m.created_at);
      return movementDate >= sevenDaysAgo;
    }).length;
  }
}
