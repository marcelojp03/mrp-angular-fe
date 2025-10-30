import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { MessageService, ConfirmationService } from 'primeng/api';
import { WorkOrdersService } from '../work-orders/work-orders.service';

@Component({
  selector: 'app-execution',
  standalone: true,
  imports: [CommonModule, SharedModule],
  providers: [MessageService, ConfirmationService],
  template: `
<div class="grid">
  <!-- Órdenes Planificadas -->
  <div class="col-12 lg:col-6">
    <div class="card">
      <h3 class="text-2xl font-bold mb-4">
        <i class="pi pi-clock text-blue-500 mr-2"></i>
        Planificadas
      </h3>
      
      <div *ngFor="let wo of plannedOrders()" class="p-3 border-round-lg border-1 border-surface-200 mb-3">
        <div class="flex justify-content-between align-items-start mb-2">
          <div>
            <div class="font-semibold text-lg">{{ wo.product_name }}</div>
            <div class="text-sm text-surface-600">{{ wo.reference || '#' + wo.id }}</div>
          </div>
          <p-tag value="Planificada" severity="info"></p-tag>
        </div>
        
        <div class="grid mt-3">
          <div class="col-6">
            <div class="text-xs text-surface-500">Cantidad</div>
            <div class="font-semibold">{{ wo.quantity }}</div>
          </div>
          <div class="col-6">
            <div class="text-xs text-surface-500">Almacén</div>
            <div>{{ wo.warehouse_name }}</div>
          </div>
        </div>
        
        <div class="mt-3">
          <p-button 
            label="Iniciar Producción" 
            icon="pi pi-play" 
            (onClick)="startProduction(wo.id)"
            severity="success"
            styleClass="w-full"
            [loading]="starting() === wo.id">
          </p-button>
        </div>
      </div>
      
      <div *ngIf="plannedOrders().length === 0" class="text-center py-6">
        <i class="pi pi-inbox text-surface-300 text-5xl mb-3"></i>
        <p class="text-surface-500">No hay órdenes planificadas</p>
      </div>
    </div>
  </div>

  <!-- Órdenes En Progreso -->
  <div class="col-12 lg:col-6">
    <div class="card">
      <h3 class="text-2xl font-bold mb-4">
        <i class="pi pi-cog text-orange-500 mr-2"></i>
        En Progreso
      </h3>
      
      <div *ngFor="let wo of inProgressOrders()" class="p-3 border-round-lg border-1 border-orange-200 bg-orange-50 dark:bg-orange-900/20 mb-3">
        <div class="flex justify-content-between align-items-start mb-2">
          <div>
            <div class="font-semibold text-lg">{{ wo.product_name }}</div>
            <div class="text-sm text-surface-600">{{ wo.reference || '#' + wo.id }}</div>
          </div>
          <p-tag value="En Progreso" severity="warning"></p-tag>
        </div>
        
        <div class="grid mt-3">
          <div class="col-6">
            <div class="text-xs text-surface-500">Cantidad Planeada</div>
            <div class="font-semibold">{{ wo.quantity }}</div>
          </div>
          <div class="col-6">
            <div class="text-xs text-surface-500">Iniciado</div>
            <div>{{ wo.actual_start | date:'dd/MM HH:mm' }}</div>
          </div>
        </div>
        
        <div class="mt-3 grid formgrid">
          <div class="field col-12">
            <label class="text-sm">Cantidad Producida</label>
            <p-inputNumber
              [(ngModel)]="wo.produced_quantity"
              [min]="0"
              [max]="wo.quantity"
              styleClass="w-full">
            </p-inputNumber>
          </div>
        </div>
        
        <div class="mt-3">
          <p-button 
            label="Finalizar Producción" 
            icon="pi pi-check" 
            (onClick)="finishProduction(wo)"
            severity="success"
            styleClass="w-full"
            [loading]="finishing() === wo.id">
          </p-button>
        </div>
      </div>
      
      <div *ngIf="inProgressOrders().length === 0" class="text-center py-6">
        <i class="pi pi-inbox text-surface-300 text-5xl mb-3"></i>
        <p class="text-surface-500">No hay órdenes en progreso</p>
      </div>
    </div>
  </div>
</div>

<p-toast />
<p-confirmDialog />
  `
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
      message: '¿Iniciar la producción? Se consumirán los materiales necesarios del stock.',
      header: 'Confirmar Inicio',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.starting.set(id);
        this.workOrdersService.startWorkOrder(id).subscribe({
          next: (response) => {
            if (response.success) {
              this.messageService.add({
                severity: 'success',
                summary: 'Producción Iniciada',
                detail: 'Los materiales han sido consumidos del stock'
              });
              this.loadOrders();
            }
            this.starting.set(null);
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error?.message || 'No se pudo iniciar la producción'
            });
            this.starting.set(null);
          }
        });
      }
    });
  }

  finishProduction(wo: any) {
    this.confirmationService.confirm({
      message: `¿Finalizar la producción? Se agregarán ${wo.produced_quantity} unidades al stock.`,
      header: 'Confirmar Finalización',
      icon: 'pi pi-check-circle',
      accept: () => {
        this.finishing.set(wo.id);
        const producedQty = wo.produced_quantity !== wo.quantity ? wo.produced_quantity : undefined;
        
        this.workOrdersService.finishWorkOrder(wo.id, producedQty).subscribe({
          next: (response) => {
            if (response.success) {
              this.messageService.add({
                severity: 'success',
                summary: 'Producción Finalizada',
                detail: `Se agregaron ${wo.produced_quantity} unidades al stock`
              });
              this.loadOrders();
            }
            this.finishing.set(null);
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error?.message || 'No se pudo finalizar la producción'
            });
            this.finishing.set(null);
          }
        });
      }
    });
  }
}
