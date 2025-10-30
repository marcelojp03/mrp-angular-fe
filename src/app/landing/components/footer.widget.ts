import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer-widget',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <div class="py-12 px-12 mx-0 mt-20 lg:mx-20 border-t border-surface-200 dark:border-surface-700">
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12 md:col-span-3">
          <a (click)="scrollTo('home')" class="flex flex-wrap items-center justify-center md:justify-start mb-6 cursor-pointer">
            <i class="pi pi-box text-primary" style="font-size: 2.5rem"></i>
            <span class="text-surface-900 dark:text-surface-0 font-semibold text-2xl ml-3">MRP System</span>
          </a>
          <p class="text-surface-600 dark:text-surface-300 leading-normal">
            Plataforma SaaS multi-tenant para gestión inteligente de inventario con IA.
          </p>
        </div>

        <div class="col-span-12 md:col-span-9">
          <div class="grid grid-cols-12 gap-8 text-center md:text-left">
            <div class="col-span-12 md:col-span-3">
              <h4 class="font-medium text-2xl leading-normal mb-6 text-surface-900 dark:text-surface-0">
                Producto
              </h4>
              <a (click)="scrollTo('features')" class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100 hover:text-primary transition-colors">
                Características
              </a>
              <a (click)="scrollTo('pricing')" class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100 hover:text-primary transition-colors">
                Planes y Precios
              </a>
              <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100 hover:text-primary transition-colors">
                Documentación
              </a>
              <a class="leading-normal text-xl block cursor-pointer text-surface-700 dark:text-surface-100 hover:text-primary transition-colors">
                API Reference
              </a>
            </div>

            <div class="col-span-12 md:col-span-3">
              <h4 class="font-medium text-2xl leading-normal mb-6 text-surface-900 dark:text-surface-0">
                Recursos
              </h4>
              <a routerLink="/auth/register" class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100 hover:text-primary transition-colors">
                Comenzar
              </a>
              <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100 hover:text-primary transition-colors">
                Tutoriales
              </a>
              <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100 hover:text-primary transition-colors">
                Casos de Uso
              </a>
              <a class="leading-normal text-xl block cursor-pointer text-surface-700 dark:text-surface-100 hover:text-primary transition-colors">
                Blog
              </a>
            </div>

            <div class="col-span-12 md:col-span-3">
              <h4 class="font-medium text-2xl leading-normal mb-6 text-surface-900 dark:text-surface-0">
                Empresa
              </h4>
              <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100 hover:text-primary transition-colors">
                Acerca de
              </a>
              <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100 hover:text-primary transition-colors">
                Equipo
              </a>
              <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100 hover:text-primary transition-colors">
                Contacto
              </a>
              <a class="leading-normal text-xl block cursor-pointer text-surface-700 dark:text-surface-100 hover:text-primary transition-colors">
                Carreras
              </a>
            </div>

            <div class="col-span-12 md:col-span-3">
              <h4 class="font-medium text-2xl leading-normal mb-6 text-surface-900 dark:text-surface-0">
                Legal
              </h4>
              <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100 hover:text-primary transition-colors">
                Privacidad
              </a>
              <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100 hover:text-primary transition-colors">
                Términos de Servicio
              </a>
              <a class="leading-normal text-xl block cursor-pointer text-surface-700 dark:text-surface-100 hover:text-primary transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-12 pt-8 border-t border-surface-200 dark:border-surface-700 flex flex-col md:flex-row justify-between items-center">
        <p class="text-surface-600 dark:text-surface-300 text-lg">
          © 2025 MRP System. Todos los derechos reservados.
        </p>
        <div class="flex gap-4 mt-4 md:mt-0">
          <a class="cursor-pointer text-surface-600 dark:text-surface-300 hover:text-primary transition-colors">
            <i class="pi pi-github text-2xl"></i>
          </a>
          <a class="cursor-pointer text-surface-600 dark:text-surface-300 hover:text-primary transition-colors">
            <i class="pi pi-twitter text-2xl"></i>
          </a>
          <a class="cursor-pointer text-surface-600 dark:text-surface-300 hover:text-primary transition-colors">
            <i class="pi pi-linkedin text-2xl"></i>
          </a>
        </div>
      </div>
    </div>
  `
})
export class FooterWidget {
  constructor(public router: Router) {}

  scrollTo(section: string): void {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
