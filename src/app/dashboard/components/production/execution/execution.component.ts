import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { MessageService, ConfirmationService } from 'primeng/api';
import { WorkOrdersService } from '../work-orders/work-orders.service';
import type { Movement, InsufficientStockItem } from '../work-orders/interfaces/work-order.interface';

@Component({
  selector: 'app-execution',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './execution.component.html'
})
export class ExecutionComponent implements OnInit {
  private workOrdersService = inject(WorkOrdersService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  
  plannedOrders = signal<any[]>([]);
  inProgressOrders = signal<any[]>([]);
  starting = signal<number | null>(null);
  finishing = signal<number | null>(null);

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    // Cargar planificadas
    this.workOrdersService.getWorkOrders('Planificada').subscribe({
      next: (response) => {
        if (response.success) {
          this.plannedOrders.set(response.data);
        }
      }
    });

    // Cargar en progreso
    this.workOrdersService.getWorkOrders('En Progreso').subscribe({
      next: (response) => {
        if (response.success) {
          // Inicializar produced_quantity con quantity por defecto
          const orders = response.data.map((wo: any) => ({
            ...wo,
            produced_quantity: wo.produced_quantity || wo.quantity
          }));
          this.inProgressOrders.set(orders);
        }
      }
    });
  }

  startProduction(id: number) {
    this.confirmationService.confirm({
      message: '¿Iniciar la producción?\n\n' +
               '✓ Se descontarán los componentes del inventario (según BOM + % scrap)\n' +
               '✓ Se generarán movimientos OUT de consumo\n' +
               '✓ La orden pasará a estado "En Progreso"\n\n' +
               'Esta acción no se puede deshacer.',
      header: 'Confirmar Inicio de Producción',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, iniciar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.starting.set(id);
        this.workOrdersService.startWorkOrder(id).subscribe({
          next: (response) => {
            if (response.success) {
              const movements = response.data.movements;
              const movementsCount = movements.length;
              
              if (movements.length > 0 && movements.length <= 3) {
                // Mostrar un toast por cada componente consumido
                movements.forEach((movement: Movement) => {
                  this.messageService.add({
                    severity: 'info',
                    summary: `Consumido: ${movement.product_name}`,
                    detail: `${movement.quantity} unidades (${movement.product_code})`,
                    life: 6000
                  });
                });
              }
              
              this.messageService.add({
                severity: 'success',
                summary: 'Producción Iniciada',
                detail: movementsCount > 0 
                  ? `${movementsCount} componente${movementsCount > 1 ? 's consumidos' : ' consumido'} del stock`
                  : 'Los materiales han sido consumidos del stock',
                life: 5000
              });
              this.loadOrders();
            }
            this.starting.set(null);
          },
          error: (err) => {
            const errorDetails = err.error?.details?.insufficient_stock as InsufficientStockItem[] | undefined;
            
            if (errorDetails && errorDetails.length > 0) {
              // Mostrar un mensaje por cada componente faltante
              errorDetails.forEach((item: InsufficientStockItem) => {
                this.messageService.add({
                  severity: 'error',
                  summary: `Falta: ${item.product}`,
                  detail: `Requerido: ${item.required.toFixed(2)} | Disponible: ${item.available.toFixed(2)} | Falta: ${item.missing.toFixed(2)}`,
                  life: 10000
                });
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error al Iniciar',
                detail: err.error?.message || 'No se pudo iniciar la producción',
                life: 5000
              });
            }
            this.starting.set(null);
          }
        });
      }
    });
  }

  finishProduction(wo: any) {
    const producedQty = wo.produced_quantity || wo.quantity;
    
    this.confirmationService.confirm({
      message: `¿Finalizar la producción?\n\n` +
               `✓ Se agregarán ${producedQty} unidades de ${wo.product_name} al almacén\n` +
               `✓ Se generará un movimiento IN\n` +
               `✓ La orden pasará a estado "Finalizada"\n\n` +
               `Esta acción no se puede deshacer.`,
      header: 'Confirmar Finalización',
      icon: 'pi pi-check-circle',
      acceptLabel: 'Sí, finalizar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.finishing.set(wo.id);
        const dataToSend = wo.produced_quantity !== wo.quantity 
          ? { produced_quantity: wo.produced_quantity } 
          : {};
        
        this.workOrdersService.finishWorkOrder(wo.id, dataToSend).subscribe({
          next: (response) => {
            if (response.success) {
              const movement = response.data.movement;
              
              if (movement) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Producción Finalizada',
                  detail: `${movement.quantity} unidades de ${movement.product_name} agregadas a ${movement.warehouse_name || 'almacén'}`,
                  life: 6000
                });
              } else {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Producción Finalizada',
                  detail: `${producedQty} unidades de ${wo.product_name} agregadas al stock`,
                  life: 5000
                });
              }
              this.loadOrders();
            }
            this.finishing.set(null);
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error al Finalizar',
              detail: err.error?.message || 'No se pudo finalizar la producción',
              life: 5000
            });
            this.finishing.set(null);
          }
        });
      }
    });
  }
}
