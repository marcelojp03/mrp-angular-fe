import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero-widget',
  standalone: true,
  imports: [ButtonModule, RippleModule],
  template: `
    <div
      id="home"
      class="flex flex-col pt-6 px-6 lg:px-20 overflow-hidden"
      style="background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, rgb(238, 239, 175) 0%, rgb(195, 227, 250) 100%); clip-path: ellipse(150% 87% at 93% 13%)"
    >
      <div class="mx-6 md:mx-20 mt-0 md:mt-6">
        <h1 class="text-6xl font-bold text-gray-900 leading-tight">
          <span class="font-light block">Sistema MRP Inteligente</span>
          Gestiona tu inventario con IA
        </h1>
        <p class="font-normal text-2xl leading-normal md:mt-4 text-gray-700">
          Plataforma SaaS multi-tenant con reportes inteligentes, backup completo y gestión avanzada de inventario.
          Planes desde gratuitos hasta empresariales.
        </p>
        <div class="flex gap-4 mt-8">
          <button pButton pRipple [rounded]="true" type="button" 
                  label="Comenzar Gratis" class="!text-xl !px-6"
                  (click)="router.navigate(['/auth/register'], { queryParams: { plan: 'free' }})"></button>
          <button pButton pRipple [rounded]="true" [outlined]="true" type="button" 
                  label="Ver Planes" class="!text-xl !px-6"
                  (click)="scrollTo('pricing')"></button>
        </div>
      </div>
      <div class="flex justify-center md:justify-end mt-12">
        <div class="bg-white dark:bg-surface-800 rounded-xl shadow-2xl p-8 max-w-2xl">
          <div class="grid grid-cols-2 gap-8">
            <div class="text-center">
              <i class="pi pi-chart-line text-primary" style="font-size: 3rem"></i>
              <h3 class="text-3xl font-bold mt-4 text-surface-900 dark:text-surface-0">Reportes IA</h3>
              <p class="text-surface-600 dark:text-surface-300 mt-2">Consultas en lenguaje natural</p>
            </div>
            <div class="text-center">
              <i class="pi pi-cloud-upload text-primary" style="font-size: 3rem"></i>
              <h3 class="text-3xl font-bold mt-4 text-surface-900 dark:text-surface-0">Backup Total</h3>
              <p class="text-surface-600 dark:text-surface-300 mt-2">Todas las tablas incluidas</p>
            </div>
            <div class="text-center">
              <i class="pi pi-users text-primary" style="font-size: 3rem"></i>
              <h3 class="text-3xl font-bold mt-4 text-surface-900 dark:text-surface-0">Multi-Tenant</h3>
              <p class="text-surface-600 dark:text-surface-300 mt-2">Organizaciones independientes</p>
            </div>
            <div class="text-center">
              <i class="pi pi-shield text-primary" style="font-size: 3rem"></i>
              <h3 class="text-3xl font-bold mt-4 text-surface-900 dark:text-surface-0">Seguridad</h3>
              <p class="text-surface-600 dark:text-surface-300 mt-2">Auditoría completa</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HeroWidget {
  constructor(public router: Router) {}

  scrollTo(section: string): void {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
