import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-features-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div id="features" class="py-6 px-6 lg:px-20 mt-8 mx-0 lg:mx-20">
      <div class="grid grid-cols-12 gap-4 justify-center">
        <div class="col-span-12 text-center mt-20 mb-6">
          <div class="text-surface-900 dark:text-surface-0 font-normal mb-2 text-4xl">
            Características Principales
          </div>
          <span class="text-muted-color text-2xl">
            Todas las herramientas que necesitas para gestionar tu inventario
          </span>
        </div>

        <!-- Reportes con IA -->
        <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 lg:pb-8 mt-6 lg:mt-0">
          <div style="height: 180px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(253, 228, 165, 0.2), rgba(187, 199, 205, 0.2))">
            <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
              <div class="flex items-center justify-center bg-blue-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                <i class="pi pi-fw pi-sparkles !text-2xl text-blue-700"></i>
              </div>
              <h5 class="mb-2 text-surface-900 dark:text-surface-0 font-semibold">Reportes con IA</h5>
              <span class="text-surface-600 dark:text-surface-200">
                Consultas en lenguaje natural con GPT-4o-mini. Acceso a todas las tablas de tu BD.
              </span>
            </div>
          </div>
        </div>

        <!-- Backup Completo -->
        <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 lg:pb-8 mt-6 lg:mt-0">
          <div style="height: 180px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 226, 237, 0.2), rgba(251, 199, 145, 0.2))">
            <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
              <div class="flex items-center justify-center bg-cyan-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                <i class="pi pi-fw pi-cloud-upload !text-2xl text-cyan-700"></i>
              </div>
              <h5 class="mb-2 text-surface-900 dark:text-surface-0 font-semibold">Backup Completo</h5>
              <span class="text-surface-600 dark:text-surface-200">
                Exporta toda tu base de datos en formato JSON. Todas las 23 tablas incluidas.
              </span>
            </div>
          </div>
        </div>

        <!-- Multi-Tenant SaaS -->
        <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pb-8 mt-6 lg:mt-0">
          <div style="height: 180px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 226, 237, 0.2), rgba(172, 180, 223, 0.2))">
            <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
              <div class="flex items-center justify-center bg-indigo-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                <i class="pi pi-fw pi-building !text-2xl text-indigo-700"></i>
              </div>
              <h5 class="mb-2 text-surface-900 dark:text-surface-0 font-semibold">Multi-Organizacional</h5>
              <span class="text-surface-600 dark:text-surface-200">
                Cada organización con sus propios datos. Aislamiento total y seguridad.
              </span>
            </div>
          </div>
        </div>

        <!-- Gestión de Inventario -->
        <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 lg:pb-8 mt-6 lg:mt-0">
          <div style="height: 180px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(187, 199, 205, 0.2), rgba(251, 199, 145, 0.2))">
            <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
              <div class="flex items-center justify-center bg-green-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                <i class="pi pi-fw pi-box !text-2xl text-green-700"></i>
              </div>
              <h5 class="mb-2 text-surface-900 dark:text-surface-0 font-semibold">Control de Stock</h5>
              <span class="text-surface-600 dark:text-surface-200">
                Gestión completa de productos, almacenes y movimientos en tiempo real.
              </span>
            </div>
          </div>
        </div>

        <!-- Proveedores -->
        <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 lg:pb-8 mt-6 lg:mt-0">
          <div style="height: 180px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(187, 199, 205, 0.2), rgba(246, 158, 188, 0.2))">
            <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
              <div class="flex items-center justify-center bg-orange-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                <i class="pi pi-fw pi-users !text-2xl text-orange-700"></i>
              </div>
              <h5 class="mb-2 text-surface-900 dark:text-surface-0 font-semibold">Proveedores</h5>
              <span class="text-surface-600 dark:text-surface-200">
                Gestiona proveedores, precios y productos asociados de manera eficiente.
              </span>
            </div>
          </div>
        </div>

        <!-- Auditoría -->
        <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pb-8 mt-6 lg:mt-0">
          <div style="height: 180px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(251, 199, 145, 0.2), rgba(246, 158, 188, 0.2))">
            <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
              <div class="flex items-center justify-center bg-pink-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                <i class="pi pi-fw pi-eye !text-2xl text-pink-700"></i>
              </div>
              <h5 class="mb-2 text-surface-900 dark:text-surface-0 font-semibold">Auditoría Total</h5>
              <span class="text-surface-600 dark:text-surface-200">
                Registro completo de todas las operaciones. Trazabilidad garantizada.
              </span>
            </div>
          </div>
        </div>

        <!-- Rate Limiting -->
        <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 mt-6 lg:mt-0">
          <div style="height: 180px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 210, 204, 0.2), rgba(160, 210, 250, 0.2))">
            <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
              <div class="flex items-center justify-center bg-teal-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                <i class="pi pi-fw pi-shield !text-2xl text-teal-700"></i>
              </div>
              <h5 class="mb-2 text-surface-900 dark:text-surface-0 font-semibold">Rate Limiting</h5>
              <span class="text-surface-600 dark:text-surface-200">
                Control de límites según tu plan. Escalable y configurable.
              </span>
            </div>
          </div>
        </div>

        <!-- Dashboard -->
        <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 mt-6 lg:mt-0">
          <div style="height: 180px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 210, 204, 0.2), rgba(212, 162, 221, 0.2))">
            <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
              <div class="flex items-center justify-center bg-purple-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                <i class="pi pi-fw pi-chart-bar !text-2xl text-purple-700"></i>
              </div>
              <h5 class="mb-2 text-surface-900 dark:text-surface-0 font-semibold">Dashboard Avanzado</h5>
              <span class="text-surface-600 dark:text-surface-200">
                Estadísticas en tiempo real, alertas y reportes personalizados.
              </span>
            </div>
          </div>
        </div>

        <!-- Exportación -->
        <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 mt-6 lg:mt-0">
          <div style="height: 180px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(160, 210, 250, 0.2), rgba(212, 162, 221, 0.2))">
            <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
              <div class="flex items-center justify-center bg-yellow-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                <i class="pi pi-fw pi-download !text-2xl text-yellow-700"></i>
              </div>
              <h5 class="mb-2 text-surface-900 dark:text-surface-0 font-semibold">Exportar a CSV</h5>
              <span class="text-surface-600 dark:text-surface-200">
                Exporta tus reportes y datos en formato CSV para análisis externo.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FeaturesWidget {}
