import { Component, OnInit, ViewChild, signal, inject } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { Table } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SupplierItemService } from '../supplier-item.service';
import { SupplierItem, SupplierItemRequest, SupplierItemUpdateRequest, SupplierItemVM } from '../interfaces/supplier-item.interface';
import { ProductoService } from '../../product/product.service';
import { SupplierService } from '../supplier.service';

@Component({
  selector: 'app-supplier-items',
  standalone: true,
  imports: [SharedModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './supplier-items.component.html'
})
export class SupplierItemsComponent implements OnInit {
  private supplierItemService = inject(SupplierItemService);
  private productService = inject(ProductoService);
  private supplierService = inject(SupplierService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  supplierItems = signal<SupplierItemVM[]>([]);
  supplierItemDialog = false;
  supplierItem: Partial<SupplierItemVM> = {};
  submitted = false;
  loading = signal(false);

  // For dropdowns
  products = signal<any[]>([]);
  suppliers = signal<any[]>([]);
  currencies = [
    { label: 'BOB - Boliviano', value: 'BOB' },
    { label: 'USD - Dólar', value: 'USD' },
    { label: 'EUR - Euro', value: 'EUR' }
  ];

  @ViewChild('dt') dt!: Table;

  // Columns for export and consistency
  cols = [
    { field: 'id', header: 'ID' },
    { field: 'product_name', header: 'Producto' },
    { field: 'supplier_name', header: 'Proveedor' },
    { field: 'price', header: 'Precio' },
    { field: 'currency', header: 'Moneda' },
    { field: 'min_order_qty', header: 'Cantidad Mínima' },
    { field: 'pack_size', header: 'Tamaño Pack' },
    { field: 'lead_time_days', header: 'Tiempo Entrega (días)' },
    { field: 'is_active', header: 'Activo' },
    { field: 'is_preferred', header: 'Preferido' }
  ];

  constructor() {}

  ngOnInit(): void {
    this.loadSupplierItems();
    this.loadProducts();
    this.loadSuppliers();
  }

  loadSupplierItems(): void {
  this.loading.set(true);
    this.supplierItemService.listar().subscribe({
      next: (res) => {
        console.info("SUPPLIER ITEMS OBTAINED", res);
        const data = res.data.map((item: SupplierItem) => ({
          ...item,
          product_name: this.getProductName(item.product_id),
          supplier_name: this.getSupplierName(item.supplier_id)
        })) as SupplierItemVM[];
  this.supplierItems.set(data);
  this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Error loading supplier items', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los items de proveedores' });
        this.loading.set(false);
      }
    });
  }

  loadProducts(): void {
    this.productService.listadoCompleto().subscribe({
      next: (res) => {
        this.products.set(res.data || []);
        // Update product names in supplier items after products are loaded
        this.updateProductNames();
      },
      error: (err: any) => {
        console.error('Error loading products', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los productos' });
      }
    });
  }

  loadSuppliers(): void {
    this.supplierService.listar().subscribe({
      next: (res) => {
        this.suppliers.set(res.data || []);
        // Update supplier names in supplier items after suppliers are loaded
        this.updateSupplierNames();
      },
      error: (err: any) => {
        console.error('Error loading suppliers', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los proveedores' });
      }
    });
  }

  private updateProductNames(): void {
    const items = this.supplierItems().map(item => ({
      ...item,
      product_name: this.getProductName(item.product_id)
    }));
    this.supplierItems.set(items);
  }

  private updateSupplierNames(): void {
    const items = this.supplierItems().map(item => ({
      ...item,
      supplier_name: this.getSupplierName(item.supplier_id)
    }));
    this.supplierItems.set(items);
  }

  private getProductName(productId: number): string {
    const product = this.products().find(p => p.id === productId);
    return product ? product.name : `Producto ${productId}`;
  }

  private getSupplierName(supplierId: number): string {
    const supplier = this.suppliers().find(s => s.id === supplierId);
    return supplier ? supplier.name : `Proveedor ${supplierId}`;
  }

  exportCSV() { 
    this.dt.exportCSV(); 
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  // UI dialog
  openNew() {
    this.supplierItem = { 
      product_id: 0,
      supplier_id: 0,
      price: 0,
      currency: 'BOB',
      min_order_qty: 0,
      pack_size: 1,
      lead_time_days: 1,
      is_active: true,
      is_preferred: false
    };
    this.submitted = false;
    this.supplierItemDialog = true;
  }

  editSupplierItem(row: SupplierItemVM) {
    this.supplierItem = { ...row };
    this.supplierItemDialog = true;
  }

  hideDialog() {
    this.supplierItemDialog = false;
    this.submitted = false;
  }

  // CRUD
  saveSupplierItem() {
  this.submitted = true;
  if (!this.supplierItem.product_id || !this.supplierItem.supplier_id || !this.supplierItem.price) return;

    if (this.supplierItem.id) {
      const payload: SupplierItemUpdateRequest = {
        id: this.supplierItem.id,
        product_id: this.supplierItem.product_id,
        supplier_id: this.supplierItem.supplier_id,
        price: this.supplierItem.price,
        currency: this.supplierItem.currency || 'BOB',
        min_order_qty: this.supplierItem.min_order_qty || 0,
        pack_size: this.supplierItem.pack_size || 1,
        lead_time_days: this.supplierItem.lead_time_days || 1,
        is_active: this.supplierItem.is_active,
        is_preferred: this.supplierItem.is_preferred
      };
      
      this.supplierItemService.actualizarItem(payload).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Item de proveedor actualizado', life: 3000 });
          this.loadSupplierItems();
          this.supplierItemDialog = false;
        },
        error: (err: any) => {
          console.error('Error updating supplier item', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'No se pudo actualizar el item' });
        }
      });
    } else {
      const payload: SupplierItemRequest = {
        product_id: this.supplierItem.product_id!,
        supplier_id: this.supplierItem.supplier_id!,
        price: this.supplierItem.price!,
        currency: this.supplierItem.currency || 'BOB',
        min_order_qty: this.supplierItem.min_order_qty || 0,
        pack_size: this.supplierItem.pack_size || 1,
        lead_time_days: this.supplierItem.lead_time_days || 1,
        is_active: this.supplierItem.is_active,
        is_preferred: this.supplierItem.is_preferred
      };
      
      this.supplierItemService.registrarItem(payload).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Item de proveedor creado', life: 3000 });
          this.loadSupplierItems();
          this.supplierItemDialog = false;
        },
        error: (err: any) => {
          console.error('Error creating supplier item', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'No se pudo crear el item' });
        }
      });
    }
  }

  confirmDelete(row: SupplierItemVM) {
    this.confirmationService.confirm({
      message: `¿Eliminar el item del proveedor "${row.supplier_name}" para "${row.product_name}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteSupplierItem(row.id)
    });
  }

  deleteSupplierItem(id: number) {
    this.supplierItemService.eliminarItem(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Item de proveedor eliminado', life: 3000 });
        this.supplierItems.set(this.supplierItems().filter(s => s.id !== id));
      },
      error: (err: any) => {
        console.error('Error deleting supplier item', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'No se pudo eliminar el item' });
      }
    });
  }

  toggleActive(row: SupplierItemVM) {
    this.supplierItemService.toggleEstado(row.id).subscribe({
      next: (response) => {
        if (response.success) {
          const newStatus = response.data.is_active;
          this.messageService.add({ 
            severity: 'info', 
            summary: 'Estado Actualizado', 
            detail: `Item ${newStatus ? 'activado' : 'desactivado'} correctamente`, 
            life: 3000 
          });
          this.loadSupplierItems();
        }
      },
      error: (err: any) => {
        console.error('Error toggling supplier item status', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'No se pudo cambiar el estado',
          life: 3000
        });
      }
    });
  }

  setAsPreferred(row: SupplierItemVM) {
    this.confirmationService.confirm({
      message: `¿Marcar a "${row.supplier_name}" como proveedor preferido para "${row.product_name}"?\n\nEsto desmarcará otros proveedores preferidos para este producto.`,
      header: 'Confirmar Proveedor Preferido',
      icon: 'pi pi-star',
      accept: () => {
        this.supplierItemService.marcarComoPreferido(row.id).subscribe({
          next: (response) => {
            if (response.success) {
              this.messageService.add({ 
                severity: 'success', 
                summary: 'Proveedor Preferido', 
                detail: `"${row.supplier_name}" marcado como preferido para "${row.product_name}"`, 
                life: 4000 
              });
              this.loadSupplierItems();
            }
          },
          error: (err: any) => {
            console.error('Error setting preferred supplier item', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error?.message || 'No se pudo marcar como preferido',
              life: 3000
            });
          }
        });
      }
    });
  }

  // Helper methods
  getStatusLabel(v: boolean) { 
    return v ? 'Activo' : 'Inactivo'; 
  }
  
  getStatusSeverity(v: boolean) { 
    return v ? 'success' : 'danger'; 
  }

  getPreferredLabel(v: boolean) { 
    return v ? 'Preferido' : 'Normal'; 
  }
  
  getPreferredSeverity(v: boolean) { 
    return v ? 'info' : 'secondary'; 
  }
}