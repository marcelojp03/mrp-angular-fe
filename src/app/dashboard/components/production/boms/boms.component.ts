import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { MessageService, ConfirmationService } from 'primeng/api';
import { BomsService } from './boms.service';
import { BOM, Product, Unit, BOMComponent } from './interfaces/bom.interface';

@Component({
  selector: 'app-boms',
  standalone: true,
  imports: [CommonModule, SharedModule],
  providers: [MessageService, ConfirmationService],
  template: `
<div class="card">
  <div class="flex justify-content-between align-items-center mb-4">
    <h2 class="text-3xl font-bold text-surface-900 dark:text-surface-0 m-0">
      <i class="pi pi-list mr-2 text-primary-500"></i>
      Lista de Materiales (BOM)
    </h2>
    <p-button 
      label="Nueva BOM" 
      icon="pi pi-plus" 
      (onClick)="showDialog()"
      severity="success">
    </p-button>
  </div>

  <!-- Tabla de BOMs -->
  <p-table 
    [value]="boms()" 
    [paginator]="true" 
    [rows]="10"
    [rowsPerPageOptions]="[10, 25, 50]"
    [loading]="loading()"
    [globalFilterFields]="['product_name', 'version', 'description']"
    styleClass="p-datatable-sm">
    
    <ng-template pTemplate="caption">
      <div class="flex justify-content-between">
        <p-iconField iconPosition="left">
          <p-inputIcon styleClass="pi pi-search" />
          <input 
            pInputText 
            type="text" 
            (input)="onFilter($event)" 
            placeholder="Buscar BOM..." 
            class="w-full" />
        </p-iconField>
        <p-button 
          icon="pi pi-refresh" 
          (onClick)="loadBOMs()" 
          [text]="true"
          [rounded]="true">
        </p-button>
      </div>
    </ng-template>

    <ng-template pTemplate="header">
      <tr>
        <th pSortableColumn="product_name">
          Producto <p-sortIcon field="product_name"></p-sortIcon>
        </th>
        <th pSortableColumn="version">
          Versión <p-sortIcon field="version"></p-sortIcon>
        </th>
        <th>Componentes</th>
        <th pSortableColumn="is_active">
          Estado <p-sortIcon field="is_active"></p-sortIcon>
        </th>
        <th>Descripción</th>
        <th>Acciones</th>
      </tr>
    </ng-template>

    <ng-template pTemplate="body" let-bom>
      <tr>
        <td>
          <span class="font-semibold">{{ bom.product_name }}</span>
        </td>
        <td>
          <p-tag [value]="bom.version" severity="info"></p-tag>
        </td>
        <td>
          <span class="text-surface-600 dark:text-surface-300">
            {{ bom.components?.length || 0 }} componentes
          </span>
        </td>
        <td>
          <p-tag 
            [value]="bom.is_active ? 'ACTIVA' : 'INACTIVA'" 
            [severity]="bom.is_active ? 'success' : 'secondary'">
          </p-tag>
        </td>
        <td>
          <span class="text-sm">{{ bom.description || '-' }}</span>
        </td>
        <td>
          <div class="flex gap-2">
            <p-button 
              icon="pi pi-eye" 
              (onClick)="viewBOM(bom)" 
              [text]="true"
              [rounded]="true"
              severity="info"
              pTooltip="Ver detalles">
            </p-button>
            <p-button 
              *ngIf="!bom.is_active"
              icon="pi pi-check" 
              (onClick)="activateBOM(bom.id)" 
              [text]="true"
              [rounded]="true"
              severity="success"
              pTooltip="Activar BOM">
            </p-button>
            <p-button 
              *ngIf="!bom.is_active"
              icon="pi pi-pencil" 
              (onClick)="editBOM(bom)" 
              [text]="true"
              [rounded]="true"
              severity="info"
              pTooltip="Editar">
            </p-button>
            <p-button 
              *ngIf="!bom.is_active"
              icon="pi pi-trash" 
              (onClick)="deleteBOM(bom.id)" 
              [text]="true"
              [rounded]="true"
              severity="danger"
              pTooltip="Eliminar">
            </p-button>
          </div>
        </td>
      </tr>
    </ng-template>

    <ng-template pTemplate="emptymessage">
      <tr>
        <td colspan="6" class="text-center py-6">
          <i class="pi pi-inbox text-surface-300 dark:text-surface-600 text-6xl mb-3"></i>
          <p class="text-xl text-surface-600 dark:text-surface-300">
            No hay BOMs registradas
          </p>
        </td>
      </tr>
    </ng-template>
  </p-table>
</div>

<!-- Dialog Crear/Editar BOM -->
<p-dialog 
  [(visible)]="displayDialog" 
  [header]="editMode() ? 'Editar BOM' : 'Nueva BOM'" 
  [modal]="true"
  [style]="{width: '80vw'}"
  [draggable]="false">
  
  <div class="grid formgrid p-fluid">
    <!-- Producto -->
    <div class="field col-12 md:col-6">
      <label for="product">Producto *</label>
      <p-select
        inputId="product"
        [options]="products()"
        [(ngModel)]="currentBOM.product_id"
        optionLabel="name"
        optionValue="id"
        placeholder="Seleccione un producto"
        [filter]="true"
        filterBy="name,code">
        <ng-template pTemplate="selectedItem" let-product>
          <span *ngIf="product">{{ product.code }} - {{ product.name }}</span>
        </ng-template>
        <ng-template pTemplate="item" let-product>
          <span>{{ product.code }} - {{ product.name }}</span>
        </ng-template>
      </p-select>
    </div>

    <!-- Versión -->
    <div class="field col-12 md:col-3">
      <label for="version">Versión *</label>
      <input 
        id="version" 
        type="text" 
        pInputText 
        [(ngModel)]="currentBOM.version"
        placeholder="1.0" />
    </div>

    <!-- Estado -->
    <div class="field col-12 md:col-3">
      <label for="active">Estado</label>
      <p-select
        inputId="active"
        [options]="[{label: 'Activa', value: true}, {label: 'Inactiva', value: false}]"
        [(ngModel)]="currentBOM.is_active"
        optionLabel="label"
        optionValue="value">
      </p-select>
    </div>

    <!-- Descripción -->
    <div class="field col-12">
      <label for="description">Descripción</label>
      <textarea 
        id="description" 
        pInputTextarea 
        [(ngModel)]="currentBOM.description"
        rows="2"
        placeholder="Descripción de la BOM...">
      </textarea>
    </div>

    <!-- Componentes -->
    <div class="field col-12">
      <div class="flex justify-content-between align-items-center mb-3">
        <label class="text-xl font-semibold">Componentes *</label>
        <p-button 
          label="Agregar Componente" 
          icon="pi pi-plus" 
          (onClick)="addComponent()"
          size="small">
        </p-button>
      </div>

      <p-table [value]="currentBOM.components" styleClass="p-datatable-sm">
        <ng-template pTemplate="header">
          <tr>
            <th style="width:30%">Componente</th>
            <th style="width:15%">Cantidad</th>
            <th style="width:15%">Scrap %</th>
            <th style="width:15%">Unidad</th>
            <th style="width:20%">Notas</th>
            <th style="width:5%"></th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-comp let-i="rowIndex">
          <tr>
            <td>
              <p-select
                [options]="products()"
                [(ngModel)]="comp.component_id"
                optionLabel="name"
                optionValue="id"
                placeholder="Seleccione"
                [filter]="true"
                styleClass="w-full">
              </p-select>
            </td>
            <td>
              <p-inputNumber
                [(ngModel)]="comp.quantity"
                mode="decimal"
                [minFractionDigits]="2"
                [min]="0.01">
              </p-inputNumber>
            </td>
            <td>
              <p-inputNumber
                [(ngModel)]="comp.scrap_percentage"
                mode="decimal"
                [minFractionDigits]="1"
                [min]="0"
                [max]="100"
                suffix="%">
              </p-inputNumber>
            </td>
            <td>
              <p-select
                [options]="units()"
                [(ngModel)]="comp.unit_id"
                optionLabel="abbreviation"
                optionValue="id"
                placeholder="Unidad"
                styleClass="w-full">
              </p-select>
            </td>
            <td>
              <input 
                type="text" 
                pInputText 
                [(ngModel)]="comp.notes"
                placeholder="Notas"
                class="w-full" />
            </td>
            <td>
              <p-button 
                icon="pi pi-trash" 
                (onClick)="removeComponent(i)"
                [text]="true"
                [rounded]="true"
                severity="danger"
                size="small">
              </p-button>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  </div>

  <ng-template pTemplate="footer">
    <p-button 
      label="Cancelar" 
      icon="pi pi-times" 
      (onClick)="displayDialog = false"
      [text]="true">
    </p-button>
    <p-button 
      label="Guardar" 
      icon="pi pi-check" 
      (onClick)="saveBOM()"
      [loading]="saving()">
    </p-button>
  </ng-template>
</p-dialog>

<!-- Dialog Ver BOM -->
<p-dialog 
  [(visible)]="displayViewDialog" 
  header="Detalle de BOM" 
  [modal]="true"
  [style]="{width: '70vw'}">
  
  <div *ngIf="selectedBOM" class="grid">
    <div class="col-12 md:col-6">
      <p class="text-surface-600 dark:text-surface-300 mb-1">Producto</p>
      <p class="text-xl font-semibold">{{ selectedBOM.product_name }}</p>
    </div>
    <div class="col-12 md:col-3">
      <p class="text-surface-600 dark:text-surface-300 mb-1">Versión</p>
      <p-tag [value]="selectedBOM.version" severity="info"></p-tag>
    </div>
    <div class="col-12 md:col-3">
      <p class="text-surface-600 dark:text-surface-300 mb-1">Estado</p>
      <p-tag 
        [value]="selectedBOM.is_active ? 'ACTIVA' : 'INACTIVA'" 
        [severity]="selectedBOM.is_active ? 'success' : 'secondary'">
      </p-tag>
    </div>
    <div class="col-12" *ngIf="selectedBOM.description">
      <p class="text-surface-600 dark:text-surface-300 mb-1">Descripción</p>
      <p>{{ selectedBOM.description }}</p>
    </div>
    
    <div class="col-12">
      <h3 class="text-xl font-semibold mb-3">Componentes</h3>
      <p-table [value]="selectedBOM.components" styleClass="p-datatable-sm">
        <ng-template pTemplate="header">
          <tr>
            <th>Componente</th>
            <th>Cantidad</th>
            <th>Scrap</th>
            <th>Cantidad + Scrap</th>
            <th>Notas</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-comp>
          <tr>
            <td>{{ comp.component_name }}</td>
            <td>{{ comp.quantity }} {{ comp.unit_name }}</td>
            <td>{{ comp.scrap_percentage }}%</td>
            <td class="font-semibold">
              {{ (comp.quantity * (1 + comp.scrap_percentage/100)).toFixed(2) }} {{ comp.unit_name }}
            </td>
            <td>{{ comp.notes || '-' }}</td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  </div>
</p-dialog>

<p-toast />
<p-confirmDialog />
  `
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
    if (!this.validateBOM()) return;

    this.saving.set(true);
    
    const request = this.editMode() 
      ? this.bomsService.updateBOM(this.currentBOM.id, this.currentBOM)
      : this.bomsService.createBOM(this.currentBOM);

    request.subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `BOM ${this.editMode() ? 'actualizada' : 'creada'} correctamente`
          });
          this.displayDialog = false;
          this.loadBOMs();
        }
        this.saving.set(false);
      },
      error: (err) => {
        console.error('Error saving BOM:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'No se pudo guardar la BOM'
        });
        this.saving.set(false);
      }
    });
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
    if (!this.currentBOM.product_id) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Debe seleccionar un producto'
      });
      return false;
    }

    if (!this.currentBOM.version) {
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

  onFilter(event: any) {
    // Implementar filtro si es necesario
  }
}
