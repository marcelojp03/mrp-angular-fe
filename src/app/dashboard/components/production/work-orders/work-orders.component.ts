import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { MessageService, ConfirmationService } from 'primeng/api';
import { WorkOrdersService } from './work-orders.service';
import { WorkOrder, WorkOrderStatus } from './interfaces/work-order.interface';

@Component({
  selector: 'app-work-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './work-orders.component.html'
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
  displayViewDialog = false;
  selectedStatus: WorkOrderStatus | null = null;
  selectedWO: WorkOrder | null = null;
  submitted = false;
  
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
          console.log('📦 Productos con BOM activa cargados:', response.data);
          
          if (response.data.length === 0) {
            this.messageService.add({
              severity: 'warn',
              summary: 'Sin Productos Disponibles',
              detail: 'No hay productos con BOM activa. Cree una BOM primero.',
              life: 6000
            });
          }
        }
      },
      error: (err) => {
        console.error('Error cargando productos:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los productos con BOM activa'
        });
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
    this.submitted = false;
    this.displayDialog = true;
  }

  hideDialog() {
    this.displayDialog = false;
    this.submitted = false;
  }

  onGlobalFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    const table = document.querySelector('p-table');
    if (table) {
      (table as any).filterGlobal(input.value, 'contains');
    }
  }

  saveWorkOrder() {
    this.submitted = true;

    if (!this.currentWO.product_id || !this.currentWO.quantity || !this.currentWO.warehouse_id) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos requeridos',
        detail: 'Complete todos los campos obligatorios'
      });
      return;
    }

    this.saving.set(true);
    this.workOrdersService.createWorkOrder(this.currentWO).subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Orden creada correctamente'
          });
          this.hideDialog();
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
    this.selectedWO = wo;
    this.displayViewDialog = true;
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
