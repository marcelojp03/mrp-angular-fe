import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-csv-export',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    FormsModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <p-toast />
    <div class="grid grid-cols-12 gap-6">
      <!-- Exportar Productos -->
      <div class="col-span-12 md:col-span-6">
        <div class="card">
          <div class="flex items-center mb-4">
            <i class="pi pi-box text-4xl text-blue-500 mr-4"></i>
            <div>
              <h3 class="text-2xl font-bold text-surface-900 dark:text-surface-0 m-0">
                Productos
              </h3>
              <p class="text-muted-color mt-1">
                Exportar catálogo completo de productos
              </p>
            </div>
          </div>
          
          <div class="mt-6">
            <button
              pButton
              icon="pi pi-download"
              label="Descargar Productos CSV"
              class="w-full p-button-lg"
              [loading]="loadingProducts()"
              (click)="exportProducts()"
            ></button>
          </div>
          
          <div class="mt-4 text-sm text-muted-color">
            <ul class="list-disc list-inside space-y-1">
              <li>Código de producto</li>
              <li>Nombre del producto</li>
              <li>Descripción</li>
              <li>Categoría</li>
              <li>Stock actual por almacén</li>
              <li>Precios y proveedores</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Exportar Movimientos -->
      <div class="col-span-12 md:col-span-6">
        <div class="card">
          <div class="flex items-center mb-4">
            <i class="pi pi-arrow-right-arrow-left text-4xl text-green-500 mr-4"></i>
            <div>
              <h3 class="text-2xl font-bold text-surface-900 dark:text-surface-0 m-0">
                Movimientos
              </h3>
              <p class="text-muted-color mt-1">
                Exportar historial de movimientos de inventario
              </p>
            </div>
          </div>
          
          <div class="mt-4">
            <label class="block text-sm font-medium mb-2">Rango de Fechas</label>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs text-muted-color mb-1">Desde</label>
                <input
                  pInputText
                  type="date"
                  [(ngModel)]="dateFrom"
                  class="w-full"
                  placeholder="Fecha inicial"
                />
              </div>
              <div>
                <label class="block text-xs text-muted-color mb-1">Hasta</label>
                <input
                  pInputText
                  type="date"
                  [(ngModel)]="dateTo"
                  class="w-full"
                  placeholder="Fecha final"
                />
              </div>
            </div>
          </div>
          
          <div class="mt-6">
            <button
              pButton
              icon="pi pi-download"
              label="Descargar Movimientos CSV"
              class="w-full p-button-lg p-button-success"
              [loading]="loadingMovements()"
              (click)="exportMovements()"
            ></button>
          </div>
          
          <div class="mt-4 text-sm text-muted-color">
            <ul class="list-disc list-inside space-y-1">
              <li>Tipo de movimiento (entrada/salida)</li>
              <li>Producto y almacén</li>
              <li>Cantidad y fecha</li>
              <li>Usuario responsable</li>
              <li>Observaciones</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Información Adicional -->
      <div class="col-span-12">
        <div class="card bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500">
          <div class="flex items-start">
            <i class="pi pi-info-circle text-blue-500 text-xl mr-3 mt-1"></i>
            <div>
              <h4 class="font-semibold text-surface-900 dark:text-surface-0 mb-2">
                Información sobre las exportaciones
              </h4>
              <ul class="text-sm text-muted-color space-y-1">
                <li>• Los archivos se generan en formato CSV compatible con Excel y Google Sheets</li>
                <li>• La exportación incluye solo los datos de tu organización</li>
                <li>• Para movimientos, si no seleccionas fechas se exportarán los últimos 30 días</li>
                <li>• El encoding es UTF-8 para correcta visualización de caracteres especiales</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CSVExportComponent {
  private http = inject(HttpClient);
  private messageService = inject(MessageService);
  private apiUrl = environment.backend.host;

  loadingProducts = signal<boolean>(false);
  loadingMovements = signal<boolean>(false);
  
  dateFrom: string = '';
  dateTo: string = '';

  exportProducts() {
    this.loadingProducts.set(true);
    
    this.http.get(`${this.apiUrl}/reports/products.csv`, {
      responseType: 'blob',
      observe: 'response'
    }).subscribe({
      next: (response) => {
        const blob = response.body;
        if (blob) {
          this.downloadFile(blob, 'productos.csv');
          this.messageService.add({
            severity: 'success',
            summary: 'Exportación Exitosa',
            detail: 'Archivo de productos descargado correctamente'
          });
        }
        this.loadingProducts.set(false);
      },
      error: (err) => {
        console.error('Error exporting products:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo exportar el archivo de productos'
        });
        this.loadingProducts.set(false);
      }
    });
  }

  exportMovements() {
    this.loadingMovements.set(true);
    
    let url = `${this.apiUrl}/reports/movements.csv`;
    const params: string[] = [];
    
    if (this.dateFrom) {
      params.push(`from=${this.dateFrom}`);
    }
    if (this.dateTo) {
      params.push(`to=${this.dateTo}`);
    }
    
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    
    this.http.get(url, {
      responseType: 'blob',
      observe: 'response'
    }).subscribe({
      next: (response) => {
        const blob = response.body;
        if (blob) {
          const filename = this.dateFrom && this.dateTo
            ? `movimientos_${this.dateFrom}_${this.dateTo}.csv`
            : 'movimientos.csv';
          this.downloadFile(blob, filename);
          this.messageService.add({
            severity: 'success',
            summary: 'Exportación Exitosa',
            detail: 'Archivo de movimientos descargado correctamente'
          });
        }
        this.loadingMovements.set(false);
      },
      error: (err) => {
        console.error('Error exporting movements:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo exportar el archivo de movimientos'
        });
        this.loadingMovements.set(false);
      }
    });
  }

  private downloadFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
