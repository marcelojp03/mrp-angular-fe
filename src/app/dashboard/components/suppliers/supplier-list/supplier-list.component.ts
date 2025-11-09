import { Component, OnInit, ViewChild, signal, inject } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { Table } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SupplierService } from '../supplier.service';
import { Supplier, SupplierRequest, SupplierUpdateRequest } from '../interfaces/supplier.interface';

export interface SupplierUI {
  id: number;
  name: string;
  address: string;
  city: string;
  email: string;
  mobile?: string | null;
  phone: string;
  status: boolean;
}

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [SharedModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './supplier-list.component.html'
})
export class SupplierListComponent implements OnInit {
  private supplierService = inject(SupplierService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  suppliers = signal<SupplierUI[]>([]);
  supplierDialog = false;
  supplier: Partial<SupplierUI> = {};
  submitted = false;
  loading = signal(false);

  @ViewChild('dt') dt!: Table;

  // columnas para export y consistencia
  cols = [
    { field: 'id',      header: 'ID' },
    { field: 'name',    header: 'Name' },
    { field: 'address', header: 'Address' },
    { field: 'city',    header: 'City' },
    { field: 'email',   header: 'Email' },
    { field: 'mobile',  header: 'Mobile' },
    { field: 'phone',   header: 'Phone' },
    { field: 'status',  header: 'Status' }
  ];

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.loading.set(true);
    this.supplierService.listar().subscribe({
      next: (res) => {
        console.info("SUPPLIERS OBTAINED", res);
        const data = res.data.map((x: any) => ({
          id: x.id,
          name: x.name,
          address: x.address,
          city: x.city,
          email: x.email,
          mobile: x.mobile,
          phone: x.phone,
          status: x.status
        })) as SupplierUI[];
        this.suppliers.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading suppliers', err);
        this.loading.set(false);
      }
    });
  }

  exportCSV() { this.dt.exportCSV(); }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  // UI dialog
  openNew() {
    this.supplier = { 
      name: '', 
      address: '', 
      city: '', 
      email: '', 
      mobile: '', 
      phone: '', 
      status: true 
    };
    this.submitted = false;
    this.supplierDialog = true;
  }

  editSupplier(row: SupplierUI) {
    this.supplier = {
      ...row,
      mobile: row.mobile ?? ''
    };
    this.supplierDialog = true;
  }

  hideDialog() {
    this.supplierDialog = false;
    this.submitted = false;
  }

  // CRUD
  saveSupplier() {
    this.submitted = true;
    if (!this.supplier.name?.trim()) return;

    if (this.supplier.id) {
      const payload: SupplierUpdateRequest = {
        id: this.supplier.id,
        name: this.supplier.name,
        address: this.supplier.address || '',
        city: this.supplier.city || '',
        email: this.supplier.email || '',
        mobile: this.supplier.mobile || '',
        phone: this.supplier.phone || ''
      };
      this.supplierService.actualizarProveedor(payload).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Proveedor actualizado', life: 3000 });
          const arr = [...this.suppliers()];
          const idx = arr.findIndex(s => s.id === this.supplier.id);
          if (idx > -1) arr[idx] = { ...arr[idx], ...this.supplier as SupplierUI };
          this.suppliers.set(arr);
          this.supplierDialog = false;
        },
        error: (err: any) => {
          console.error('Error updating supplier', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'No se pudo actualizar el proveedor',
            life: 3000
          });
        }
      });
    } else {
      const payload: SupplierRequest = {
        name: this.supplier.name,
        address: this.supplier.address || '',
        city: this.supplier.city || '',
        email: this.supplier.email || '',
        mobile: this.supplier.mobile || '',
        phone: this.supplier.phone || ''
      };
      this.supplierService.registrarProveedor(payload).subscribe({
        next: (res: any) => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Proveedor creado', life: 3000 });
          if (res?.data) {
            const x = res.data;
            const created: SupplierUI = {
              id: x.id,
              name: x.name ?? this.supplier.name!,
              address: x.address ?? this.supplier.address ?? '',
              city: x.city ?? this.supplier.city ?? '',
              email: x.email ?? this.supplier.email ?? '',
              mobile: x.mobile ?? this.supplier.mobile ?? null,
              phone: x.phone ?? this.supplier.phone ?? '',
              status: x.status ?? true
            };
            this.suppliers.set([...this.suppliers(), created]);
          } else {
            this.loadSuppliers();
          }
          this.supplierDialog = false;
        },
        error: (err: any) => {
          console.error('Error creating supplier', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'No se pudo crear el proveedor',
            life: 3000
          });
        }
      });
    }
  }

  confirmDelete(row: SupplierUI) {
    this.confirmationService.confirm({
      message: `¿Eliminar el proveedor "${row.name}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteSupplier(row.id)
    });
  }

  deleteSupplier(id: number) {
    this.supplierService.eliminarProveedor(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Proveedor eliminado', life: 3000 });
        this.suppliers.set(this.suppliers().filter(s => s.id !== id));
      },
      error: (err: any) => {
        console.error('Error deleting supplier', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'No se pudo eliminar el proveedor',
          life: 3000
        });
      }
    });
  }

  reactivateSupplier(row: SupplierUI) {
    this.supplierService.reactivarProveedor(row.id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'info', summary: 'Reactivado', detail: 'Proveedor reactivado', life: 3000 });
        const arr = [...this.suppliers()];
        const idx = arr.findIndex(s => s.id === row.id);
        if (idx > -1) arr[idx] = { ...arr[idx], status: true };
        this.suppliers.set(arr);
      },
      error: (err: any) => {
        console.error('Error reactivating supplier', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'No se pudo reactivar el proveedor',
          life: 3000
        });
      }
    });
  }

  // helpers estado
  getStatusLabel(v: boolean) { return v ? 'Activo' : 'Inactivo'; }
  getStatusSeverity(v: boolean) { return v ? 'success' : 'danger'; }

  // helper para dígitos
  onlyDigits(field: 'phone' | 'mobile') {
    const v = (this.supplier[field] ?? '') as string;
    this.supplier[field] = v.replace(/\D+/g, '');
  }
}
