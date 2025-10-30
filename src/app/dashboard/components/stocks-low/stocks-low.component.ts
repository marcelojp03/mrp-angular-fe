import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { environment } from '../../../../environments/environment';

interface StockLowItem {
  id: number;
  code: string;
  name: string;
  description: string;
  current_stock: number;
  min_stock: number;
  unit_code: string;
  item_type: string;
  procurement_type: string;
}

interface StockLowResponse {
  success: boolean;
  data: StockLowItem[];
}

@Component({
  selector: 'app-stocks-low',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <p-toast />
    <div class="grid grid-cols-12 gap-8">
      <div class="col-span-12">
        <div class="card">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h2 class="text-3xl font-bold text-surface-900 dark:text-surface-0 m-0">
                <i class="pi pi-exclamation-triangle mr-2 text-red-500"></i>
                Alertas de Stock Bajo
              </h2>
              <p class="text-muted-color mt-2">
                Productos con stock por debajo del mínimo establecido
              </p>
            </div>
            <button
              pButton
              icon="pi pi-refresh"
              label="Actualizar"
              class="p-button-outlined"
              (click)="loadStocks()"
              [loading]="loading()"
            ></button>
          </div>

          @if (loading()) {
            <div class="text-center py-8">
              <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
              <p class="text-muted-color mt-4">Cargando alertas...</p>
            </div>
          } @else if (stocks() && stocks()!.length > 0) {
            <p-table
              [value]="stocks()!"
              [paginator]="true"
              [rows]="10"
              [rowsPerPageOptions]="[10, 25, 50]"
              [showCurrentPageReport]="true"
              currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} alertas"
              responsiveLayout="scroll"
              [globalFilterFields]="['code', 'name', 'description']"
            >
              <ng-template #header>
                <tr>
                  <th pSortableColumn="code">
                    Código <p-sortIcon field="code"></p-sortIcon>
                  </th>
                  <th pSortableColumn="name">
                    Producto <p-sortIcon field="name"></p-sortIcon>
                  </th>
                  <th pSortableColumn="item_type">
                    Tipo <p-sortIcon field="item_type"></p-sortIcon>
                  </th>
                  <th pSortableColumn="current_stock" class="text-right">
                    Stock Actual <p-sortIcon field="current_stock"></p-sortIcon>
                  </th>
                  <th pSortableColumn="min_stock" class="text-right">
                    Stock Mínimo <p-sortIcon field="min_stock"></p-sortIcon>
                  </th>
                  <th class="text-right">
                    Faltante
                  </th>
                  <th pSortableColumn="unit_code" class="text-center">
                    Unidad <p-sortIcon field="unit_code"></p-sortIcon>
                  </th>
                  <th class="text-center">Severidad</th>
                </tr>
              </ng-template>
              <ng-template #body let-item>
                <tr>
                  <td>
                    <span class="font-semibold">{{ item.code }}</span>
                  </td>
                  <td>
                    <div class="font-medium">{{ item.name }}</div>
                    <div class="text-muted-color text-sm">{{ item.description }}</div>
                  </td>
                  <td>
                    <p-tag 
                      [value]="item.item_type" 
                      [severity]="item.item_type === 'FG' ? 'success' : item.item_type === 'RM' ? 'info' : 'warn'" />
                  </td>
                  <td class="text-right">
                    <p-tag [value]="item.current_stock.toString()" severity="danger" />
                  </td>
                  <td class="text-right">
                    <span class="font-medium">{{ item.min_stock }}</span>
                  </td>
                  <td class="text-right">
                    <span class="text-red-600 dark:text-red-400 font-bold">
                      {{ item.min_stock - item.current_stock }}
                    </span>
                  </td>
                  <td class="text-center">
                    <p-tag [value]="item.unit_code" severity="secondary" />
                  </td>
                  <td class="text-center">
                    <p-tag
                      [value]="getSeverityLabel(item.min_stock - item.current_stock, item.min_stock)"
                      [severity]="getSeverity(item.min_stock - item.current_stock, item.min_stock)"
                    ></p-tag>
                  </td>
                </tr>
              </ng-template>
              <ng-template #emptymessage>
                <tr>
                  <td colspan="8" class="text-center py-8">
                    <i class="pi pi-check-circle text-6xl text-green-500 mb-3 block"></i>
                    <p class="text-muted-color">No hay productos con stock bajo</p>
                  </td>
                </tr>
              </ng-template>
            </p-table>
          } @else {
            <div class="text-center py-8">
              <i class="pi pi-check-circle text-6xl text-green-500 mb-4 block"></i>
              <h3 class="text-xl font-semibold text-surface-900 dark:text-surface-0 mb-2">
                ¡Todo el stock está en niveles óptimos!
              </h3>
              <p class="text-muted-color">No hay productos con stock por debajo del mínimo</p>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class StocksLowComponent implements OnInit {
  private http = inject(HttpClient);
  private messageService = inject(MessageService);
  private apiUrl = environment.backend.host;

  stocks = signal<StockLowItem[]>([]);
  loading = signal<boolean>(false);

  ngOnInit() {
    this.loadStocks();
  }

  loadStocks() {
    this.loading.set(true);
    this.http.get<StockLowResponse>(`${this.apiUrl}/stocks/low`).subscribe({
      next: (response) => {
        if (response.success) {
          this.stocks.set(response.data);
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading stocks:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las alertas de stock'
        });
        this.loading.set(false);
      }
    });
  }

  getSeverity(difference: number, minStock: number): 'danger' | 'warning' | 'info' {
    const percentage = (Math.abs(difference) / minStock) * 100;
    if (percentage >= 50) return 'danger';
    if (percentage >= 25) return 'warning';
    return 'info';
  }

  getSeverityLabel(difference: number, minStock: number): string {
    const percentage = (Math.abs(difference) / minStock) * 100;
    if (percentage >= 50) return 'CRÍTICO';
    if (percentage >= 25) return 'ADVERTENCIA';
    return 'BAJO';
  }
}
