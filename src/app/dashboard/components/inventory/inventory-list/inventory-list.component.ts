import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SharedModule } from '../../../../shared/shared.module';
import { InventoryService, Inventory } from '../inventory.service';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './inventory-list.component.html'
})
export class InventoryListComponent implements OnInit {
  private inventoryService = inject(InventoryService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  inventories = signal<Inventory[]>([]);
  filteredInventories = signal<Inventory[]>([]);
  loading = signal<boolean>(false);
  submitted = signal<boolean>(false);
  inventoryDialog = signal<boolean>(false);
  globalFilter = signal<string>('');

  // Form fields
  inventoryForm = signal<Inventory>({} as Inventory);

  ngOnInit(): void {
    this.loadInventories();
  }

  loadInventories(): void {
    this.loading.set(true);
    this.inventoryService.obtenerListaInventario().subscribe({
      next: (response) => {
        const rawData = response.data || response || [];
        // Mapear datos del API a la estructura esperada por el componente
        const normalizedData = rawData.map((item: any) => ({
          ...item,
          // Mapear campos del API a la estructura esperada
          id_producto: item.product_id,
          id_almacen: item.warehouse_id,
          stock: parseFloat(item.current_stock) || 0,
          stock_minimo: item.stock_minimo ?? 0,
          stock_maximo: item.stock_maximo ?? 0,
          ubicacion: item.ubicacion ?? '',
          estado: item.estado ?? true,
          // Mapear campos de relación
          producto: { nombre: item.product_name },
          almacen: { nombre: item.warehouse_name }
        }));
        this.inventories.set(normalizedData);
        this.filteredInventories.set(normalizedData);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading inventories:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar el inventario'
        });
        this.loading.set(false);
      }
    });
  }

  openNew(): void {
    this.inventoryForm.set({
      id_producto: 0,
      id_almacen: 0,
      stock: 0,
      stock_minimo: 0,
      stock_maximo: 0,
      ubicacion: '',
      estado: true
    } as Inventory);
    this.submitted.set(false);
    this.inventoryDialog.set(true);
  }

  editInventory(inventory: Inventory): void {
    this.inventoryForm.set({ ...inventory });
    this.inventoryDialog.set(true);
  }

  deleteInventory(inventory: Inventory): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de que desea eliminar este registro de inventario?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (inventory.id_producto && inventory.id_almacen) {
          this.inventoryService.eliminarInventario(inventory.id_producto, inventory.id_almacen).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Inventario eliminado correctamente'
              });
              this.loadInventories();
            },
            error: (error) => {
              console.error('Error deleting inventory:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al eliminar el inventario'
              });
            }
          });
        }
      }
    });
  }

  reactivateInventory(inventory: Inventory): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de que desea reactivar este registro de inventario?`,
      header: 'Confirmar Reactivación',
      icon: 'pi pi-question-circle',
      accept: () => {
        if (inventory.id_producto && inventory.id_almacen) {
          this.inventoryService.reactivarInventario(inventory.id_producto, inventory.id_almacen).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Inventario reactivado correctamente'
              });
              this.loadInventories();
            },
            error: (error) => {
              console.error('Error reactivating inventory:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al reactivar el inventario'
              });
            }
          });
        }
      }
    });
  }

  saveInventory(): void {
    this.submitted.set(true);
    const inventory = this.inventoryForm();

    if (this.isValidInventory(inventory)) {
      this.loading.set(true);
      
      const operation = inventory.id 
        ? this.inventoryService.actualizarInventario(inventory)
        : this.inventoryService.registrarInventario(inventory);

      operation.subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: inventory.id ? 'Inventario actualizado correctamente' : 'Inventario creado correctamente'
          });
          this.inventoryDialog.set(false);
          this.loadInventories();
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error saving inventory:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al guardar el inventario'
          });
          this.loading.set(false);
        }
      });
    }
  }

  hideDialog(): void {
    this.inventoryDialog.set(false);
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
      this.filteredInventories.set(this.inventories());
      return;
    }

    const filtered = this.inventories().filter(inventory =>
      inventory.producto?.nombre?.toLowerCase().includes(filterValue) ||
      inventory.almacen?.nombre?.toLowerCase().includes(filterValue) ||
      inventory.ubicacion?.toLowerCase().includes(filterValue) ||
      inventory.id_producto?.toString().includes(filterValue) ||
      inventory.id_almacen?.toString().includes(filterValue)
    );
    this.filteredInventories.set(filtered);
  }

  private isValidInventory(inventory: Inventory): boolean {
    return !!(
      inventory.id_producto && inventory.id_producto > 0 &&
      inventory.id_almacen && inventory.id_almacen > 0 &&
      inventory.stock !== undefined && inventory.stock >= 0
    );
  }

  getSeverity(status: boolean): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' | undefined {
    return status ? 'success' : 'secondary';
  }

  getStatusLabel(status: boolean): string {
    return status ? 'Activo' : 'Inactivo';
  }

  getStockSeverity(stock: number, stockMinimo: number): 'success' | 'warning' | 'danger' {
    const currentStock = stock || 0;
    const minStock = stockMinimo || 0;
    
    if (currentStock === 0) return 'danger';
    if (currentStock <= minStock) return 'warning';
    return 'success';
  }
}
