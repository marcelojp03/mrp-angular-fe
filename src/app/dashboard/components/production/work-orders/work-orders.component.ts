import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { MessageService, ConfirmationService } from 'primeng/api';
import { WorkOrdersService } from './work-orders.service';
import { WorkOrder, WorkOrderStatus } from './interfaces/work-order.interface';

@Component({
  selector: 'app-work-orders',
  standalone: true,
  imports: [CommonModule, SharedModule],
  providers: [MessageService, ConfirmationService],
  template: `
<div class="card">
  <div class="flex justify-content-between align-items-center mb-4">
    <h2 class="text-3xl font-bold text-surface-900 dark:text-surface-0 m-0">
      <i class="pi pi-calendar mr-2 text-primary-500"></i>
      Órdenes de Producción
    </h2>
    <p-button 
      label="Nueva Orden" 
      icon="pi pi-plus" 
      (onClick)="showDialog()"
      severity="success">
    </p-button>
  </div>

  <!-- Filtros -->
  <div class="grid mb-3">
    <div class="col-12 md:col-3">
      <p-select
        [options]="statusOptions"
        [(ngModel)]="selectedStatus"
        (onChange)="loadWorkOrders()"
        optionLabel="label"
        optionValue="value"
        placeholder="Todos los estados"
        styleClass="w-full">
      </p-select>
    </div>
  </div>

  <!-- Tabla -->
  <p-table 
    [value]="workOrders()" 
    [paginator]="true" 
    [rows]="10"
    [loading]="loading()"
    styleClass="p-datatable-sm">
    
    <ng-template pTemplate="header">
      <tr>
        <th>Referencia</th>
        <th>Producto</th>
        <th>Cantidad</th>
        <th>Almacén</th>
        <th>Estado</th>
        <th>Asignado a</th>
        <th>Fechas</th>
        <th>Acciones</th>
      </tr>
    </ng-template>

    <ng-template pTemplate="body" let-wo>
      <tr>
        <td>
          <span class="font-semibold">{{ wo.reference || '#' + wo.id }}</span>
        </td>
        <td>{{ wo.product_name }}</td>
        <td>
          <span class="font-semibold">{{ wo.quantity }}</span>
          <span *ngIf="wo.produced_quantity" class="text-sm text-surface-500">
            / {{ wo.produced_quantity }} producidos
          </span>
        </td>
        <td>{{ wo.warehouse_name }}</td>
        <td>
          <p-tag 
            [value]="wo.status" 
            [severity]="getStatusSeverity(wo.status)">
          </p-tag>
        </td>
        <td>{{ wo.assigned_to_name || '-' }}</td>
        <td>
          <div class="text-sm">
            <div *ngIf="wo.planned_start">Plan: {{ wo.planned_start | date:'dd/MM/yyyy' }}</div>
            <div *ngIf="wo.actual_start">Real: {{ wo.actual_start | date:'dd/MM/yyyy HH:mm' }}</div>
          </div>
        </td>
        <td>
          <div class="flex gap-2">
            <p-button 
              icon="pi pi-eye" 
              (onClick)="viewWorkOrder(wo)" 
              [text]="true"
              [rounded]="true"
              severity="info"
              pTooltip="Ver detalles">
            </p-button>
            <p-button 
              *ngIf="wo.status === 'Planificada'"
              icon="pi pi-trash" 
              (onClick)="cancelWorkOrder(wo.id)" 
              [text]="true"
              [rounded]="true"
              severity="danger"
              pTooltip="Cancelar">
            </p-button>
          </div>
        </td>
      </tr>
    </ng-template>
  </p-table>
</div>

<!-- Dialog Crear -->
<p-dialog 
  [(visible)]="displayDialog" 
  header="Nueva Orden de Producción" 
  [modal]="true"
  [style]="{width: '50vw'}">
  
  <div class="grid formgrid p-fluid">
    <div class="field col-12 md:col-6">
      <label>Producto *</label>
      <p-select
        [options]="products()"
        [(ngModel)]="currentWO.product_id"
        optionLabel="name"
        optionValue="id"
        placeholder="Seleccione"
        [filter]="true">
      </p-select>
    </div>
    <div class="field col-12 md:col-6">
      <label>Cantidad *</label>
      <p-inputNumber
        [(ngModel)]="currentWO.quantity"
        [min]="1">
      </p-inputNumber>
    </div>
    <div class="field col-12 md:col-6">
      <label>Almacén *</label>
      <p-select
        [options]="warehouses()"
        [(ngModel)]="currentWO.warehouse_id"
        optionLabel="name"
        optionValue="id">
      </p-select>
    </div>
    <div class="field col-12 md:col-6">
      <label>Asignado a</label>
      <p-select
        [options]="users()"
        [(ngModel)]="currentWO.assigned_to"
        optionLabel="name"
        optionValue="id"
        [showClear]="true">
      </p-select>
    </div>
    <div class="field col-12">
      <label>Referencia</label>
      <input pInputText [(ngModel)]="currentWO.reference" />
    </div>
    <div class="field col-12">
      <label>Notas</label>
      <textarea pInputTextarea [(ngModel)]="currentWO.notes" rows="3"></textarea>
    </div>
  </div>

  <ng-template pTemplate="footer">
    <p-button label="Cancelar" icon="pi pi-times" (onClick)="displayDialog = false" [text]="true"></p-button>
    <p-button label="Crear" icon="pi pi-check" (onClick)="saveWorkOrder()" [loading]="saving()"></p-button>
  </ng-template>
</p-dialog>

<p-toast />
<p-confirmDialog />
  `
})
export class WorkOrdersComponent implements OnInit {
  private workOrdersService = inject(WorkOrdersService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  
  workOrders = signal<WorkOrder[]>([]);
  products = signal<any[]>([]);
  warehouses = signal<any[]>([]);
  users = signal<any[]>([]);
  loading = signal(false);
  saving = signal(false);
  
  displayDialog = false;
  selectedStatus: WorkOrderStatus | null = null;
  
  statusOptions = [
    { label: 'Todos', value: null },
    { label: 'Planificada', value: 'Planificada' as WorkOrderStatus },
    { label: 'En Progreso', value: 'En Progreso' as WorkOrderStatus },
    { label: 'Finalizada', value: 'Finalizada' as WorkOrderStatus },
    { label: 'Cancelada', value: 'Cancelada' as WorkOrderStatus }
  ];
  
  currentWO: any = {};

  ngOnInit() {
    this.loadWorkOrders();
    this.loadProducts();
    this.loadWarehouses();
    this.loadUsers();
  }

  loadWorkOrders() {
    this.loading.set(true);
    this.workOrdersService.getWorkOrders(this.selectedStatus).subscribe({
      next: (response) => {
        if (response.success) {
          this.workOrders.set(response.data);
        }
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }

  loadProducts() {
    this.workOrdersService.getProducts().subscribe({
      next: (response) => {
        if (response.success) {
          this.products.set(response.data);
        }
      }
    });
  }

  loadWarehouses() {
    this.workOrdersService.getWarehouses().subscribe({
      next: (response) => {
        if (response.success) {
          this.warehouses.set(response.data);
        }
      }
    });
  }

  loadUsers() {
    this.workOrdersService.getUsers().subscribe({
      next: (response) => {
        if (response.success) {
          this.users.set(response.data);
        }
      }
    });
  }

  showDialog() {
    this.currentWO = {
      product_id: null,
      quantity: 1,
      warehouse_id: null,
      assigned_to: null,
      reference: '',
      notes: ''
    };
    this.displayDialog = true;
  }

  saveWorkOrder() {
    this.saving.set(true);
    this.workOrdersService.createWorkOrder(this.currentWO).subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Orden creada correctamente'
          });
          this.displayDialog = false;
          this.loadWorkOrders();
        }
        this.saving.set(false);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'No se pudo crear la orden'
        });
        this.saving.set(false);
      }
    });
  }

  cancelWorkOrder(id: number) {
    this.confirmationService.confirm({
      message: '¿Desea cancelar esta orden de producción?',
      accept: () => {
        this.workOrdersService.cancelWorkOrder(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Orden cancelada'
            });
            this.loadWorkOrders();
          }
        });
      }
    });
  }

  viewWorkOrder(wo: WorkOrder) {
    // Implementar vista detallada
  }

  getStatusSeverity(status: string): string {
    const severities: any = {
      'Planificada': 'info',
      'En Progreso': 'warning',
      'Finalizada': 'success',
      'Cancelada': 'danger'
    };
    return severities[status] || 'secondary';
  }
}
