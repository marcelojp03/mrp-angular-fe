import { Component, OnInit, ViewChild, signal, computed } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { Table } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';

import { ProductoService } from '../product.service';
import { ProductVM, ProductsResponse, ItemTypeLabels, ProcurementTypeLabels, ProductRequest, ProductUpdateRequest } from '../interfaces/product.interface';
import { StatsCardComponent, type StatCardConfig } from '../../../../shared/components/stats-card.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [SharedModule, StatsCardComponent],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  productos = signal<ProductVM[]>([]);
  productoDialog = false;
  submitted = false;

  producto: Partial<ProductRequest & { id?: number }> = {};

  // Computed stats para las cards (opcionales en Patrón A)
  statsCards = computed<StatCardConfig[]>(() => {
    const data = this.productos();
    return [
      {
        label: 'Total Productos',
        value: data.length,
        icon: 'pi-box',
        color: 'blue',
        footer: 'Registrados',
        footerClass: 'text-primary font-medium'
      },
      {
        label: 'Activos',
        value: data.filter(p => p.status === true).length,
        icon: 'pi-check-circle',
        color: 'green',
        footer: 'Disponibles',
        footerClass: 'text-green-500 font-medium'
      },
      {
        label: 'Productos Terminados',
        value: data.filter(p => p.item_type === 'FG').length,
        icon: 'pi-gift',
        color: 'purple',
        footer: 'Para venta',
        footerClass: 'text-purple-500 font-medium'
      },
      {
        label: 'Materia Prima',
        value: data.filter(p => p.item_type === 'RM').length,
        icon: 'pi-inbox',
        color: 'orange',
        footer: 'Para fabricar',
        footerClass: 'text-orange-500 font-medium'
      }
    ];
  });

  // Item type and procurement type options
  itemTypeOptions = [
    { label: 'Materia Prima', value: 'RM' },
    { label: 'Producto Terminado', value: 'FG' },
    { label: 'Consumible', value: 'CONSUMABLE' },
    { label: 'Servicio', value: 'SERVICE' }
  ];

  procurementTypeOptions = [
    { label: 'Comprar', value: 'BUY' },
    { label: 'Fabricar', value: 'MAKE' }
  ];

  loading = false;

  cols = [
    { field: 'id', header: 'ID' },
    { field: 'code', header: 'Código' },
    { field: 'name', header: 'Nombre' },
    { field: 'item_type_label', header: 'Tipo' },
    { field: 'procurement_type_label', header: 'Tipo Adquisición' },
    { field: 'min_stock', header: 'Stock Mínimo' },
    { field: 'unit_code', header: 'Unidad' },
    { field: 'status', header: 'Estado' }
  ];

  @ViewChild('dt') dt!: Table;

  constructor(
    private productosSvc: ProductoService,
    private toast: MessageService,
    private confirm: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  // Tabla
  exportCSV() { this.dt.exportCSV(); }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  // Cargar datos
  cargarProductos() {
    this.loading = true;
    this.productosSvc.listadoCompleto().subscribe({
      next: (response: ProductsResponse) => {
        if (response.success) {
          const data = response.data.map(product => ({
            id: product.id,
            code: product.code,
            name: product.name,
            description: product.description,
            item_type: product.item_type,
            item_type_label: ItemTypeLabels[product.item_type],
            min_stock: product.min_stock,
            procurement_type: product.procurement_type,
            procurement_type_label: ProcurementTypeLabels[product.procurement_type],
            unit_code: product.unit_code,
            status: product.status,
            created_at: product.created_at,
            updated_at: product.updated_at
          })) as ProductVM[];

          this.productos.set(data);
        } else {
          console.error('Error en respuesta:', response.message);
          this.toast.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'No se pudieron cargar los productos', 
            life: 3000 
          });
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error al cargar productos', err);
        this.toast.add({ 
          severity: 'error', 
          summary: 'Error de conexión', 
          detail: 'No se pudo conectar con el servidor', 
          life: 3000 
        });
        this.loading = false;
      }
    });
  }

  // UI
  openNew() {
    this.producto = {
      code: '',
      name: '',
      description: '',
      item_type: 'RM',
      min_stock: 0,
      procurement_type: 'BUY',
      unit_id: null,
      status: true
    };
    this.submitted = false;
    this.productoDialog = true;
  }

  editProducto(row: ProductVM) {
    this.producto = {
      id: row.id,
      code: row.code,
      name: row.name,
      description: row.description,
      item_type: row.item_type as any,
      min_stock: row.min_stock,
      procurement_type: row.procurement_type as any,
      unit_id: null, // You might want to add unit_id to ProductVM if needed
      status: row.status
    };
    this.submitted = false;
    this.productoDialog = true;
  }

  hideDialog() {
    this.productoDialog = false;
    this.submitted = false;
  }

  // Guardar producto
  saveProducto() {
    this.submitted = true;

    if (!this.producto.name?.trim()) {
      this.toast.add({ 
        severity: 'warn', 
        summary: 'Advertencia', 
        detail: 'El nombre es requerido', 
        life: 3000 
      });
      return;
    }

    if (!this.producto.item_type) {
      this.toast.add({ 
        severity: 'warn', 
        summary: 'Advertencia', 
        detail: 'El tipo de item es requerido', 
        life: 3000 
      });
      return;
    }

    if (!this.producto.procurement_type) {
      this.toast.add({ 
        severity: 'warn', 
        summary: 'Advertencia', 
        detail: 'El tipo de adquisición es requerido', 
        life: 3000 
      });
      return;
    }

    const isEdit = !!this.producto.id;
    
    if (isEdit) {
      const updatePayload: ProductUpdateRequest = {
        id: this.producto.id!,
        code: this.producto.code || '',
        name: this.producto.name!,
        description: this.producto.description || '',
        item_type: this.producto.item_type!,
        min_stock: this.producto.min_stock || 0,
        procurement_type: this.producto.procurement_type!,
        unit_id: this.producto.unit_id,
        status: this.producto.status ?? true
      };

      this.productosSvc.actualizarProducto(updatePayload).subscribe({
        next: (res: any) => {
          this.toast.add({ 
            severity: 'success', 
            summary: 'Éxito', 
            detail: 'Producto actualizado correctamente', 
            life: 3000 
          });
          this.cargarProductos();
          this.hideDialog();
        },
        error: (err: any) => {
          console.error('Error al actualizar producto', err);
          this.toast.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'No se pudo actualizar el producto', 
            life: 4000 
          });
        }
      });
    } else {
      const createPayload: ProductRequest = {
        code: this.producto.code || '',
        name: this.producto.name!,
        description: this.producto.description || '',
        item_type: this.producto.item_type!,
        min_stock: this.producto.min_stock || 0,
        procurement_type: this.producto.procurement_type!,
        unit_id: this.producto.unit_id,
        status: this.producto.status ?? true
      };

      this.productosSvc.registrarProducto(createPayload).subscribe({
        next: (res: any) => {
          this.toast.add({ 
            severity: 'success', 
            summary: 'Éxito', 
            detail: 'Producto creado correctamente', 
            life: 3000 
          });
          this.cargarProductos();
          this.hideDialog();
        },
        error: (err: any) => {
          console.error('Error al crear producto', err);
          this.toast.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'No se pudo crear el producto', 
            life: 4000 
          });
        }
      });
    }
  }

  // Acciones fila
  confirmDelete(row: ProductVM) {
    this.confirm.confirm({
      message: `¿Eliminar el producto "${row.name}"?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.eliminar(row.id)
    });
  }

  eliminar(id: number) {
    this.productosSvc.eliminarProducto(id).subscribe({
      next: () => {
        this.toast.add({ 
          severity: 'success', 
          summary: 'Éxito', 
          detail: 'Producto eliminado', 
          life: 3000 
        });
        this.productos.set(this.productos().filter(p => p.id !== id));
      },
      error: (err: any) => {
        console.error('Error al eliminar', err);
        this.toast.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'No se pudo eliminar el producto', 
          life: 3000 
        });
      }
    });
  }

  reactivar(row: ProductVM) {
    this.productosSvc.reactivarProducto(row.id).subscribe({
      next: () => {
        this.toast.add({ 
          severity: 'info', 
          summary: 'Reactivado', 
          detail: 'Producto reactivado', 
          life: 3000 
        });
        const arr = [...this.productos()];
        const idx = arr.findIndex(p => p.id === row.id);
        if (idx > -1) arr[idx] = { ...arr[idx], status: true };
        this.productos.set(arr);
      },
      error: (err: any) => {
        console.error('Error al reactivar', err);
        this.toast.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'No se pudo reactivar el producto', 
          life: 3000 
        });
      }
    });
  }

  // helpers de estado
  getStatusLabel(v: boolean) { return v ? 'Activo' : 'Inactivo'; }
  getStatusSeverity(v: boolean) { return v ? 'success' : 'danger'; }
}
