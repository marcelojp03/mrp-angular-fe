import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardStats } from '../home.interface';

@Component({
    standalone: true,
    selector: 'app-stats-widget',
    imports: [CommonModule],
    template: `
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Productos</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ stats?.total_products || 0 }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-box text-blue-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">Total activos</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Movimientos Hoy</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ stats?.total_movements_today || 0 }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-sync text-orange-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">Registrados hoy</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Alertas de Stock</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ stats?.low_stock_count || 0 }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-red-100 dark:bg-red-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-exclamation-triangle text-red-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-red-500 font-medium">Productos críticos</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3" *ngIf="stats?.work_orders_active !== undefined">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Órdenes Activas</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ stats?.work_orders_active || 0 }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-cog text-purple-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">En producción</span>
            </div>
        </div>
    `
})
export class StatsWidget {
    @Input() stats: DashboardStats | null = null;
}
