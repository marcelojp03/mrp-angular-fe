import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { StockAlert } from '../home.interface';

@Component({
    standalone: true,
    selector: 'app-stock-alerts-widget',
    imports: [CommonModule, TableModule, TagModule, ButtonModule, MenuModule],
    template: `
        <div class="card !mb-8">
            <div class="flex justify-between items-center mb-6">
                <div class="font-semibold text-xl">
                    <i class="pi pi-exclamation-triangle mr-2 text-red-500"></i>
                    Alertas de Stock Bajo
                </div>
                <div>
                    <button pButton type="button" icon="pi pi-ellipsis-v" class="p-button-rounded p-button-text p-button-plain" (click)="menu.toggle($event)"></button>
                    <p-menu #menu [popup]="true" [model]="items"></p-menu>
                </div>
            </div>
            
            @if (alerts && alerts.length > 0) {
                <p-table [value]="alerts" [paginator]="true" [rows]="5" responsiveLayout="scroll">
                    <ng-template #header>
                        <tr>
                            <th>Código</th>
                            <th>Producto</th>
                            <th>Tipo</th>
                            <th>Stock Actual</th>
                            <th>Stock Mínimo</th>
                            <th>Faltante</th>
                            <th>Unidad</th>
                        </tr>
                    </ng-template>
                    <ng-template #body let-alert>
                        <tr>
                            <td>
                                <span class="font-semibold">{{ alert.code }}</span>
                            </td>
                            <td>
                                <div class="font-medium">{{ alert.name }}</div>
                                <div class="text-muted-color text-sm">{{ alert.description }}</div>
                            </td>
                            <td>
                                <p-tag 
                                    [value]="alert.item_type" 
                                    [severity]="alert.item_type === 'FG' ? 'success' : alert.item_type === 'RM' ? 'info' : 'warn'" />
                            </td>
                            <td>
                                <p-tag [value]="alert.current_stock.toString()" severity="danger" />
                            </td>
                            <td>{{ alert.min_stock }}</td>
                            <td>
                                <span class="text-red-600 dark:text-red-400 font-bold">
                                    {{ alert.min_stock - alert.current_stock }}
                                </span>
                            </td>
                            <td>
                                <p-tag [value]="alert.unit_code" severity="secondary" />
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            } @else {
                <div class="text-center text-muted-color py-8">
                    <i class="pi pi-check-circle text-6xl mb-3 text-green-500 block"></i>
                    <h3 class="text-xl font-semibold text-surface-900 dark:text-surface-0 mb-2">
                        ¡Todo el stock está en niveles óptimos!
                    </h3>
                    <p class="text-surface-600 dark:text-surface-300">
                        No hay productos con stock por debajo del mínimo
                    </p>
                </div>
            }
        </div>
    `
})
export class StockAlertsWidget {
    @Input() alerts: StockAlert[] = [];

    items = [
        { label: 'Exportar CSV', icon: 'pi pi-fw pi-download' },
        { label: 'Actualizar', icon: 'pi pi-fw pi-refresh' }
    ];
}
