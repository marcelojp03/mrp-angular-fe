import { Component, OnInit, ViewChild, signal } from '@angular/core';
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
  templateUrl: './supplier-items.component.html'
})
export class SupplierItemsComponent implements OnInit {
  supplierItems = signal<SupplierItemVM[]>([]);
  supplierItemDialog = false;
  supplierItem: Partial<SupplierItemVM> = {};
  submitted = false;
  loading = false;

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

  constructor(
    private supplierItemService: SupplierItemService,
    private productService: ProductoService,
    private supplierService: SupplierService,
    private toast: MessageService,
    private confirm: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadSupplierItems();
    this.loadProducts();
    this.loadSuppliers();
  }

  loadSupplierItems(): void {
    this.loading = true;
    this.supplierItemService.listar().subscribe({
      next: (res) => {
        console.info("SUPPLIER ITEMS OBTAINED", res);
        const data = res.data.map((item: SupplierItem) => ({
          ...item,
          product_name: this.getProductName(item.product_id),
          supplier_name: this.getSupplierName(item.supplier_id)
        })) as SupplierItemVM[];
        this.supplierItems.set(data);
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading supplier items', err);
        this.loading = false;
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
      error: (err: any) => console.error('Error loading products', err)
    });
  }

  loadSuppliers(): void {
    this.supplierService.listar().subscribe({
      next: (res) => {
        this.suppliers.set(res.data || []);
        // Update supplier names in supplier items after suppliers are loaded
        this.updateSupplierNames();
      },
      error: (err: any) => console.error('Error loading suppliers', err)
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
          this.toast.add({ severity: 'success', summary: 'Success', detail: 'Supplier item updated', life: 3000 });
          this.loadSupplierItems();
          this.supplierItemDialog = false;
        },
        error: (err: any) => console.error('Error updating supplier item', err)
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
          this.toast.add({ severity: 'success', summary: 'Success', detail: 'Supplier item created', life: 3000 });
          this.loadSupplierItems();
          this.supplierItemDialog = false;
        },
        error: (err: any) => console.error('Error creating supplier item', err)
      });
    }
  }

  confirmDelete(row: SupplierItemVM) {
    this.confirm.confirm({
      message: `¿Eliminar el item del proveedor "${row.supplier_name}" para "${row.product_name}"?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteSupplierItem(row.id)
    });
  }

  deleteSupplierItem(id: number) {
    this.supplierItemService.eliminarItem(id).subscribe({
      next: () => {
        this.toast.add({ severity: 'success', summary: 'Success', detail: 'Supplier item deleted', life: 3000 });
        this.supplierItems.set(this.supplierItems().filter(s => s.id !== id));
      },
      error: (err: any) => console.error('Error deleting supplier item', err)
    });
  }

  toggleActive(row: SupplierItemVM) {
    this.supplierItemService.toggleEstado(row.id).subscribe({
      next: () => {
        this.toast.add({ 
          severity: 'info', 
          summary: 'Updated', 
          detail: `Supplier item ${row.is_active ? 'deactivated' : 'activated'}`, 
          life: 3000 
        });
        this.loadSupplierItems();
      },
      error: (err: any) => console.error('Error toggling supplier item status', err)
    });
  }

  setAsPreferred(row: SupplierItemVM) {
    this.supplierItemService.marcarComoPreferido(row.id).subscribe({
      next: () => {
        this.toast.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: 'Supplier item marked as preferred', 
          life: 3000 
        });
        this.loadSupplierItems();
      },
      error: (err: any) => console.error('Error setting preferred supplier item', err)
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