import { Component } from '@angular/core';

@Component({
  selector: 'app-highlights-widget',
  standalone: true,
  template: `
    <div id="highlights" class="py-6 px-6 lg:px-20 mx-0 my-12 lg:mx-20">
      <div class="text-center">
        <div class="text-surface-900 dark:text-surface-0 font-normal mb-2 text-4xl">
          Potente en Cualquier Lugar
        </div>
        <span class="text-muted-color text-2xl">
          Accede desde cualquier dispositivo, en cualquier momento
        </span>
      </div>

      <div class="grid grid-cols-12 gap-4 mt-20 pb-2 md:pb-20">
        <div class="flex justify-center col-span-12 lg:col-span-6 bg-blue-50 dark:bg-blue-900/20 p-12 order-1 lg:order-none rounded-3xl">
          <div class="text-center">
            <i class="pi pi-mobile text-blue-500" style="font-size: 8rem"></i>
            <p class="text-surface-600 dark:text-surface-300 text-xl mt-4">Diseño Responsive</p>
          </div>
        </div>

        <div class="col-span-12 lg:col-span-6 my-auto flex flex-col lg:items-end text-center lg:text-right gap-4">
          <div class="flex items-center justify-center bg-blue-200 self-center lg:self-end" 
               style="width: 4.2rem; height: 4.2rem; border-radius: 10px">
            <i class="pi pi-fw pi-mobile !text-4xl text-blue-700"></i>
          </div>
          <div class="leading-none text-surface-900 dark:text-surface-0 text-3xl font-semibold">
            Acceso Móvil
          </div>
          <span class="text-surface-700 dark:text-surface-100 text-2xl leading-normal ml-0 md:ml-2" style="max-width: 650px">
            Gestiona tu inventario desde cualquier dispositivo. Interfaz optimizada para móviles, tablets y escritorio.
            Diseño responsive que se adapta a tu pantalla.
          </span>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-4 my-20 pt-2 md:pt-20">
        <div class="col-span-12 lg:col-span-6 my-auto flex flex-col text-center lg:text-left lg:items-start gap-4">
          <div class="flex items-center justify-center bg-purple-200 self-center lg:self-start" 
               style="width: 4.2rem; height: 4.2rem; border-radius: 10px">
            <i class="pi pi-fw pi-desktop !text-3xl text-purple-700"></i>
          </div>
          <div class="leading-none text-surface-900 dark:text-surface-0 text-3xl font-semibold">
            Dashboard Completo
          </div>
          <span class="text-surface-700 dark:text-surface-100 text-2xl leading-normal mr-0 md:mr-2" style="max-width: 650px">
            Panel de control intuitivo con estadísticas en tiempo real. Visualiza alertas de stock bajo,
            movimientos recientes y productos más activos. Todo en un solo lugar.
          </span>
        </div>

        <div class="flex justify-end order-1 sm:order-2 col-span-12 lg:col-span-6 bg-purple-50 dark:bg-purple-900/20 p-12 rounded-3xl">
          <div class="text-center">
            <i class="pi pi-chart-line text-purple-500" style="font-size: 8rem"></i>
            <p class="text-surface-600 dark:text-surface-300 text-xl mt-4">Analíticas Avanzadas</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-4 my-20 pb-2 md:pb-20">
        <div class="flex justify-center col-span-12 lg:col-span-6 bg-green-50 dark:bg-green-900/20 p-12 order-1 lg:order-none rounded-3xl">
          <div class="text-center">
            <i class="pi pi-cloud text-green-500" style="font-size: 8rem"></i>
            <p class="text-surface-600 dark:text-surface-300 text-xl mt-4">En la Nube</p>
          </div>
        </div>

        <div class="col-span-12 lg:col-span-6 my-auto flex flex-col lg:items-end text-center lg:text-right gap-4">
          <div class="flex items-center justify-center bg-green-200 self-center lg:self-end" 
               style="width: 4.2rem; height: 4.2rem; border-radius: 10px">
            <i class="pi pi-fw pi-cloud !text-4xl text-green-700"></i>
          </div>
          <div class="leading-none text-surface-900 dark:text-surface-0 text-3xl font-semibold">
            100% Cloud
          </div>
          <span class="text-surface-700 dark:text-surface-100 text-2xl leading-normal ml-0 md:ml-2" style="max-width: 650px">
            Sin instalaciones ni mantenimiento. Actualizaciones automáticas y backups en la nube.
            Tus datos siempre seguros y accesibles.
          </span>
        </div>
      </div>
    </div>
  `
})
export class HighlightsWidget {}
