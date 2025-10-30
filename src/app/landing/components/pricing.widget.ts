import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';
import { SkeletonModule } from 'primeng/skeleton';
import { Router } from '@angular/router';
import { PlanService } from '../services/plan.service';
import { Plan } from '../interfaces/plan.interface';

@Component({
  selector: 'app-pricing-widget',
  standalone: true,
  imports: [CommonModule, DividerModule, ButtonModule, RippleModule, SkeletonModule],
  template: `
    <div id="pricing" class="py-6 px-6 lg:px-20 my-2 md:my-6">
      <div class="text-center mb-6">
        <div class="text-surface-900 dark:text-surface-0 font-normal mb-2 text-4xl">
          Planes para Cada Necesidad
        </div>
        <span class="text-muted-color text-2xl">
          Desde emprendedores hasta grandes empresas
        </span>
      </div>

      <!-- Loading State -->
      <div *ngIf="planService.loading()" class="grid grid-cols-12 gap-4 justify-between mt-20 md:mt-0">
        <div class="col-span-12 lg:col-span-4 p-0 md:p-4" *ngFor="let i of [1,2,3]">
          <div class="p-6 border-2 border-surface-200 dark:border-surface-600 rounded-xl">
            <p-skeleton height="2rem" class="mb-4"></p-skeleton>
            <p-skeleton height="8rem" class="mb-4"></p-skeleton>
            <p-skeleton height="3rem" class="mb-4"></p-skeleton>
            <p-skeleton height="2.5rem" class="mb-2" *ngFor="let j of [1,2,3,4]"></p-skeleton>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div *ngIf="planService.error()" class="text-center mt-12">
        <i class="pi pi-exclamation-triangle text-red-500" style="font-size: 4rem"></i>
        <p class="text-xl text-red-600 mt-4">{{ planService.error() }}</p>
        <button pButton pRipple label="Reintentar" (click)="loadPlans()" class="mt-4"></button>
      </div>

      <!-- Plans Grid -->
      <div *ngIf="!planService.loading() && !planService.error()" 
           class="grid grid-cols-12 gap-4 justify-between mt-20 md:mt-0">
        <div *ngFor="let plan of planService.plans()" 
             class="col-span-12 lg:col-span-4 p-0 md:p-4">
          <div 
            class="p-4 flex flex-col pricing-card cursor-pointer border-2 duration-300 transition-all relative"
            [ngClass]="{
              'border-primary shadow-lg transform -translate-y-2': isPopular(plan),
              'border-surface-200 dark:border-surface-600 hover:border-primary': !isPopular(plan)
            }"
            style="border-radius: 10px; min-height: 580px">
            
            <!-- Popular Badge -->
            <div *ngIf="isPopular(plan)" 
                 class="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white px-6 py-2 rounded-full text-sm font-bold">
              MÁS POPULAR
            </div>

            <!-- Plan Name -->
            <div class="text-surface-900 dark:text-surface-0 text-center my-8 text-3xl font-bold">
              {{ plan.name }}
            </div>

            <!-- Plan Icon/Image -->
            <div class="flex justify-center mb-6">
              <div class="bg-primary/10 rounded-full p-8">
                <i [class]="getPlanIcon(plan.code)" class="text-primary" style="font-size: 4rem"></i>
              </div>
            </div>

            <!-- Price -->
            <div class="my-8 flex flex-col items-center gap-4">
              <div class="flex items-center">
                <span class="text-2xl mr-2 text-surface-600 dark:text-surface-300">
                  {{ getPlanPrice(plan.code).currency }}
                </span>
                <span class="text-5xl font-bold text-surface-900 dark:text-surface-0">
                  {{ getPlanPrice(plan.code).amount }}
                </span>
                <span class="text-surface-600 dark:text-surface-200 ml-2">
                  / {{ getPlanPrice(plan.code).period }}
                </span>
              </div>
              <button pButton pRipple 
                      [label]="plan.code === 'free' ? 'Comenzar Gratis' : 'Comenzar Prueba'"
                      class="p-button-rounded border-0 font-light leading-tight w-full"
                      [ngClass]="isPopular(plan) ? 'bg-primary' : 'bg-blue-500'"
                      (click)="selectPlan(plan)">
              </button>
            </div>

            <p-divider class="w-full bg-surface-200"></p-divider>

            <!-- Features List -->
            <ul class="my-8 list-none p-0 flex text-surface-900 dark:text-surface-0 flex-col gap-3">
              <!-- Límites -->
              <li class="flex items-center gap-2">
                <i class="pi pi-check text-green-500 text-xl"></i>
                <span class="text-lg">
                  {{ formatLimit(plan.limits.max_users, 'usuarios') }}
                </span>
              </li>
              <li class="flex items-center gap-2">
                <i class="pi pi-check text-green-500 text-xl"></i>
                <span class="text-lg">
                  {{ formatLimit(plan.limits.max_products, 'productos') }}
                </span>
              </li>
              <li class="flex items-center gap-2">
                <i class="pi pi-check text-green-500 text-xl"></i>
                <span class="text-lg">
                  {{ formatLimit(plan.limits.max_warehouses, 'almacenes') }}
                </span>
              </li>
              <li class="flex items-center gap-2">
                <i class="pi pi-check text-green-500 text-xl"></i>
                <span class="text-lg">
                  {{ plan.limits.max_movements_per_day }} movimientos/día
                </span>
              </li>
              <li class="flex items-center gap-2">
                <i class="pi pi-check text-green-500 text-xl"></i>
                <span class="text-lg font-semibold text-primary">
                  {{ plan.limits.max_ai_reports_per_day }} reportes IA/día
                </span>
              </li>

              <!-- Features -->
              <li class="flex items-center gap-2">
                <i [class]="plan.features.allow_bom ? 'pi pi-check text-green-500' : 'pi pi-times text-red-400'" 
                   class="text-xl"></i>
                <span class="text-lg" [class.line-through]="!plan.features.allow_bom" 
                      [class.text-surface-400]="!plan.features.allow_bom">
                  Listas de Materiales (BOM)
                </span>
              </li>
              <li class="flex items-center gap-2">
                <i [class]="plan.features.allow_work_orders ? 'pi pi-check text-green-500' : 'pi pi-times text-red-400'" 
                   class="text-xl"></i>
                <span class="text-lg" [class.line-through]="!plan.features.allow_work_orders" 
                      [class.text-surface-400]="!plan.features.allow_work_orders">
                  Órdenes de Trabajo
                </span>
              </li>
              <li class="flex items-center gap-2">
                <i [class]="plan.features.allow_mrp ? 'pi pi-check text-green-500' : 'pi pi-times text-red-400'" 
                   class="text-xl"></i>
                <span class="text-lg" [class.line-through]="!plan.features.allow_mrp" 
                      [class.text-surface-400]="!plan.features.allow_mrp">
                  Planificación MRP
                </span>
              </li>
              <li class="flex items-center gap-2">
                <i [class]="plan.features.allow_forecast ? 'pi pi-check text-green-500' : 'pi pi-times text-red-400'" 
                   class="text-xl"></i>
                <span class="text-lg" [class.line-through]="!plan.features.allow_forecast" 
                      [class.text-surface-400]="!plan.features.allow_forecast">
                  Pronóstico de Demanda
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Info Footer -->
      <div class="text-center mt-12 text-surface-600 dark:text-surface-300">
        <p class="text-xl mb-2">✅ Prueba gratuita de 14 días • No requiere tarjeta de crédito</p>
        <p class="text-xl">✅ Cancela en cualquier momento • Soporte 24/7</p>
      </div>
    </div>
  `,
  styles: [`
    .pricing-card {
      transition: all 0.3s ease;
    }
    .pricing-card:hover {
      transform: translateY(-8px);
    }
  `]
})
export class PricingWidget implements OnInit {
  planService = inject(PlanService);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans(): void {
    this.planService.getPlans().subscribe();
  }

  selectPlan(plan: Plan): void {
    this.router.navigate(['/auth/register'], {
      queryParams: { plan: plan.code }
    });
  }

  getPlanPrice(code: string): { amount: number; currency: string; period: string } {
    return this.planService.getPlanPrice(code);
  }

  isPopular(plan: Plan): boolean {
    return this.planService.isPopularPlan(plan.code);
  }

  getPlanIcon(code: string): string {
    const icons: Record<string, string> = {
      free: 'pi pi-gift',
      starter: 'pi pi-bolt',
      pro: 'pi pi-star-fill'
    };
    return icons[code.toLowerCase()] || 'pi pi-box';
  }

  formatLimit(value: number, label: string): string {
    if (value >= 999999) {
      return `${label} ilimitados`;
    }
    return `Hasta ${value} ${label}`;
  }
}
