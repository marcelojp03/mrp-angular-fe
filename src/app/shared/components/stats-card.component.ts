import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface StatCardConfig {
  label: string;
  value: number | string;
  icon: string;
  color: 'blue' | 'orange' | 'red' | 'green' | 'purple' | 'cyan' | 'pink' | 'yellow';
  footer?: string;
  footerClass?: string;
}

/**
 * Componente reutilizable para mostrar estadísticas en cards
 * 
 * Diseño basado en el dashboard principal (home)
 * Soporta todos los componentes: CRUD (Patrón A) y Read-Only (Patrón B)
 * 
 * @example
 * // En el template:
 * <app-stats-card [config]="{
 *   label: 'Total Productos',
 *   value: 150,
 *   icon: 'pi-box',
 *   color: 'blue',
 *   footer: 'Activos en inventario',
 *   footerClass: 'text-primary'
 * }" />
 */
@Component({
  standalone: true,
  selector: 'app-stats-card',
  imports: [CommonModule],
  template: `
    <div class="card mb-0">
      <div class="flex justify-between mb-4">
        <div>
          <span class="block text-muted-color font-medium mb-4">{{ config.label }}</span>
          <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ config.value }}</div>
        </div>
        <div 
          class="flex items-center justify-center rounded-border"
          [ngClass]="getIconBgClass()"
          style="width: 2.5rem; height: 2.5rem">
          <i [class]="'pi ' + config.icon + ' !text-xl'" [ngClass]="getIconColorClass()"></i>
        </div>
      </div>
      <span [class]="config.footerClass || 'text-primary font-medium'">{{ config.footer || '' }}</span>
    </div>
  `
})
export class StatsCardComponent {
  @Input({ required: true }) config!: StatCardConfig;

  getIconBgClass(): string {
    const colorMap: Record<StatCardConfig['color'], string> = {
      blue: 'bg-blue-100 dark:bg-blue-400/10',
      orange: 'bg-orange-100 dark:bg-orange-400/10',
      red: 'bg-red-100 dark:bg-red-400/10',
      green: 'bg-green-100 dark:bg-green-400/10',
      purple: 'bg-purple-100 dark:bg-purple-400/10',
      cyan: 'bg-cyan-100 dark:bg-cyan-400/10',
      pink: 'bg-pink-100 dark:bg-pink-400/10',
      yellow: 'bg-yellow-100 dark:bg-yellow-400/10'
    };
    return colorMap[this.config.color];
  }

  getIconColorClass(): string {
    const colorMap: Record<StatCardConfig['color'], string> = {
      blue: 'text-blue-500',
      orange: 'text-orange-500',
      red: 'text-red-500',
      green: 'text-green-500',
      purple: 'text-purple-500',
      cyan: 'text-cyan-500',
      pink: 'text-pink-500',
      yellow: 'text-yellow-500'
    };
    return colorMap[this.config.color];
  }
}
