import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SharedModule } from '../../../../shared/shared.module';
import { WarehouseService } from '../warehouse.service';
import { Warehouse, WarehouseRequest, WarehouseUpdateRequest } from '../interfaces/warehouse.interface';

@Component({
  selector: 'app-warehouse-list',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './warehouse-list.component.html'
})
export class WarehouseListComponent implements OnInit {
  private warehouseService = inject(WarehouseService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  warehouses = signal<Warehouse[]>([]);
  filteredWarehouses = signal<Warehouse[]>([]);
  loading = signal<boolean>(false);
  submitted = signal<boolean>(false);
  warehouseDialog = signal<boolean>(false);
  globalFilter = signal<string>('');

  // Form fields
  warehouseForm = signal<Warehouse>({} as Warehouse);

  ngOnInit(): void {
    this.loadWarehouses();
  }

  loadWarehouses(): void {
    this.loading.set(true);
    this.warehouseService.obtenerListaAlmacenes().subscribe({
      next: (response) => {
        const data = response.data || [];
        this.warehouses.set(data);
        this.filteredWarehouses.set(data);
        this.loading.set(false);
      },
      error: (error: any) => {
        console.error('Error loading warehouses:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los almacenes'
        });
        this.loading.set(false);
      }
    });
  }

  openNew(): void {
    this.warehouseForm.set({
      id: 0,
      name: '',
      location: '',
      org_id: 1,
      created_at: '',
      updated_at: ''
    });
    this.submitted.set(false);
    this.warehouseDialog.set(true);
  }

  editWarehouse(warehouse: Warehouse): void {
    this.warehouseForm.set({ ...warehouse });
    this.warehouseDialog.set(true);
  }

  deleteWarehouse(warehouse: Warehouse): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de que desea eliminar el almacén ${warehouse.name}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.warehouseService.eliminarAlmacen(warehouse.id!).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Almacén eliminado correctamente'
            });
            this.loadWarehouses();
          },
          error: (error) => {
            console.error('Error deleting warehouse:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar el almacén'
            });
          }
        });
      }
    });
  }

  saveWarehouse(): void {
    this.submitted.set(true);
    const warehouse = this.warehouseForm();

    if (this.isValidWarehouse(warehouse)) {
      this.loading.set(true);
      
      const operation = warehouse.id 
        ? this.warehouseService.actualizarAlmacen(warehouse)
        : this.warehouseService.registrarAlmacen(warehouse);

      operation.subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: warehouse.id ? 'Almacén actualizado correctamente' : 'Almacén creado correctamente'
          });
          this.warehouseDialog.set(false);
          this.loadWarehouses();
          this.loading.set(false);
        },
        error: (error: any) => {
          console.error('Error saving warehouse:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al guardar el almacén'
          });
          this.loading.set(false);
        }
      });
    }
  }

  hideDialog(): void {
    this.warehouseDialog.set(false);
    this.submitted.set(false);
  }

  onGlobalFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.globalFilter.set(value);
    this.applyFilter();
  }

  private applyFilter(): void {
    const filterValue = this.globalFilter().toLowerCase();
    if (!filterValue) {
      this.filteredWarehouses.set(this.warehouses());
      return;
    }

    const filtered = this.warehouses().filter(warehouse =>
      warehouse.name?.toLowerCase().includes(filterValue) ||
      warehouse.location?.toLowerCase().includes(filterValue)
    );
    this.filteredWarehouses.set(filtered);
  }

  private isValidWarehouse(warehouse: Warehouse): boolean {
    return !!(
      warehouse.name?.trim() &&
      warehouse.location?.trim()
    );
  }
}
