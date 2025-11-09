import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { MessageService, ConfirmationService } from 'primeng/api';
import { BomsService } from './boms.service';
import { BOM, Product, Unit } from './interfaces/bom.interface';

@Component({
  selector: 'app-boms',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './boms.component.html'
})
export class BomsComponent implements OnInit {
  private bomsService = inject(BomsService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  boms = signal<BOM[]>([]);
  products = signal<Product[]>([]);
  units = signal<Unit[]>([]);
  loading = signal(false);
  saving = signal(false);
  editMode = signal(false);
  submitted = false;

  displayDialog = false;
  displayViewDialog = false;
  selectedBOM: BOM | null = null;

  currentBOM: any = this.getEmptyBOM();

  ngOnInit() {
    this.loadBOMs();
    this.loadProducts();
    this.loadUnits();
  }

  loadBOMs() {
    this.loading.set(true);
    this.bomsService.getBOMs().subscribe({
      next: (response) => {
        if (response.success) {
          this.boms.set(response.data);
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading BOMs:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las BOMs'
        });
        this.loading.set(false);
      }
    });
  }

  loadProducts() {
    this.bomsService.getProducts().subscribe({
      next: (response) => {
        if (response.success) {
          this.products.set(response.data);
        }
      },
      error: (err) => console.error('Error loading products:', err)
    });
  }

  loadUnits() {
    this.bomsService.getUnits().subscribe({
      next: (response) => {
        if (response.success) {
          this.units.set(response.data);
        }
      },
      error: (err) => console.error('Error loading units:', err)
    });
  }

  showDialog() {
    this.currentBOM = this.getEmptyBOM();
    this.editMode.set(false);
    this.displayDialog = true;
  }

  editBOM(bom: BOM) {
    this.currentBOM = { ...bom, components: [...bom.components] };
    this.editMode.set(true);
    this.displayDialog = true;
  }

  viewBOM(bom: BOM) {
    this.selectedBOM = bom;
    this.displayViewDialog = true;
  }

  addComponent() {
    this.currentBOM.components.push({
      component_id: 0,
      quantity: 1,
      scrap_percentage: 0,
      unit_id: 1,
      sequence: this.currentBOM.components.length + 1,
      notes: ''
    });
  }

  removeComponent(index: number) {
    this.currentBOM.components.splice(index, 1);
  }

  saveBOM() {
    this.submitted = true;
    if (!this.validateBOM()) return;

    // Preparar payload para el backend
    const payload = {
      product_id: Number(this.currentBOM.product_id),
      version: this.currentBOM.version,
      description: this.currentBOM.description || '',
      is_active: Boolean(this.currentBOM.is_active),
      components: this.currentBOM.components.map((c: any) => ({
        component_id: Number(c.component_id),
        quantity: Number(c.quantity),
        unit_id: c.unit_id ? Number(c.unit_id) : undefined,
        scrap_percentage: c.scrap_percentage ? Number(c.scrap_percentage) : 0,
        sequence: c.sequence ? Number(c.sequence) : undefined,
        notes: c.notes || undefined
      }))
    };

    console.log('📤 Enviando BOM al backend:', payload);

    this.saving.set(true);

    const request = this.editMode()
      ? this.bomsService.updateBOM(this.currentBOM.id, payload)
      : this.bomsService.createBOM(payload);

    request.subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `BOM ${this.editMode() ? 'actualizada' : 'creada'} correctamente`
          });
          this.hideDialog();
          this.loadBOMs();
        }
        this.saving.set(false);
      },
      error: (err) => {
        console.error('❌ Error saving BOM:', err);
        console.error('❌ Error response:', err.error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'No se pudo guardar la BOM'
        });
        this.saving.set(false);
      }
    });
  }

  hideDialog(): void {
    this.displayDialog = false;
    this.submitted = false;
  }

  activateBOM(id: number) {
    this.confirmationService.confirm({
      message: '¿Desea activar esta versión de BOM? Solo puede haber una BOM activa por producto.',
      header: 'Confirmar Activación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.bomsService.activateBOM(id).subscribe({
          next: (response) => {
            if (response.success) {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'BOM activada correctamente'
              });
              this.loadBOMs();
            }
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error?.message || 'No se pudo activar la BOM'
            });
          }
        });
      }
    });
  }

  deleteBOM(id: number) {
    this.confirmationService.confirm({
      message: '¿Está seguro de eliminar esta BOM?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.bomsService.deleteBOM(id).subscribe({
          next: (response) => {
            if (response.success) {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'BOM eliminada correctamente'
              });
              this.loadBOMs();
            }
            },
            error: (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: err.error?.message || 'No se pudo eliminar la BOM'
              });
            }
          });
      }
    });
  }

  private validateBOM(): boolean {
    if (!this.currentBOM.product_id || this.currentBOM.product_id === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Debe seleccionar un producto'
      });
      return false;
    }

    if (!this.currentBOM.version || this.currentBOM.version.trim() === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Debe ingresar una versión'
      });
      return false;
    }

    if (this.currentBOM.components.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Debe agregar al menos un componente'
      });
      return false;
    }

    // Validar cada componente
    for (let i = 0; i < this.currentBOM.components.length; i++) {
      const comp = this.currentBOM.components[i];
      
      if (!comp.component_id || comp.component_id === 0) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Validación',
          detail: `Componente ${i + 1}: Debe seleccionar un componente válido`
        });
        return false;
      }

      if (!comp.quantity || comp.quantity <= 0) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Validación',
          detail: `Componente ${i + 1}: La cantidad debe ser mayor a 0`
        });
        return false;
      }

      if (!comp.unit_id || comp.unit_id === 0) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Validación',
          detail: `Componente ${i + 1}: Debe seleccionar una unidad`
        });
        return false;
      }
    }

    return true;
  }

  private getEmptyBOM() {
    return {
      product_id: 0,
      version: '1.0',
      is_active: false,
      description: '',
      components: []
    };
  }

  onGlobalFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    const table = document.querySelector('p-table') as any;
    if (table && table.filterGlobal) {
      table.filterGlobal(input.value, 'contains');
    }
  }
}
