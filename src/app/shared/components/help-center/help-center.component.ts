import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { HelpCenterService, HelpSection } from './help-center.service';

@Component({
  selector: 'app-help-center',
  standalone: true,
  imports: [CommonModule, SharedModule],
  template: `
    <!-- Botón flotante de ayuda -->
    <button 
      *ngIf="!sidebarVisible"
      class="help-floating-button" 
      (click)="showHelp()"
      pTooltip="Centro de Ayuda"
      tooltipPosition="left"
      type="button">
      <i class="pi pi-question-circle"></i>
    </button>

    <!-- Drawer de ayuda (reemplaza sidebar en PrimeNG v20) -->
    <p-drawer
      [(visible)]="sidebarVisible" 
      position="right" 
      [style]="{width: '450px'}"
      [modal]="true"
      [blockScroll]="true"
      styleClass="help-drawer">
      
      <ng-template pTemplate="header">
        <div class="flex align-items-center gap-2">
          <i class="pi pi-question-circle text-2xl text-primary"></i>
          <span class="font-bold text-xl">Centro de Ayuda</span>
        </div>
      </ng-template>

      <!-- Buscador -->
      <div class="mb-4">
        <span class="p-input-icon-left w-full">
          <i class="pi pi-search"></i>
          <input 
            pInputText 
            type="text" 
            [(ngModel)]="searchTerm"
            (input)="filterSections()"
            placeholder="Buscar ayuda..." 
            class="w-full" />
        </span>
      </div>

      <!-- Acordeón con secciones de ayuda -->
      <p-accordion [multiple]="true">
        <p-accordionpanel *ngFor="let section of filteredSections">
          <p-accordionheader>
            {{ section.title }}
          </p-accordionheader>
          <p-accordioncontent>
            <div class="help-section-content">
              <p class="text-600 mb-3">{{ section.description }}</p>
            
            <div *ngIf="section.items && section.items.length > 0" class="help-items">
              <h4 class="text-sm font-semibold mb-2 text-primary">Funcionalidades:</h4>
              <ul class="list-none p-0 m-0">
                <li *ngFor="let item of section.items" class="mb-2 flex align-items-start gap-2">
                  <i class="pi pi-check-circle text-green-500 mt-1"></i>
                  <span class="text-700">{{ item }}</span>
                </li>
              </ul>
            </div>

            <div *ngIf="section.steps && section.steps.length > 0" class="help-steps mt-3">
              <h4 class="text-sm font-semibold mb-2 text-primary">Pasos:</h4>
              <ol class="list-none p-0 m-0">
                <li *ngFor="let step of section.steps; let i = index" class="mb-2 flex gap-2">
                  <span class="flex-shrink-0 inline-flex align-items-center justify-content-center border-circle bg-primary text-white" 
                        style="width: 1.5rem; height: 1.5rem; font-size: 0.75rem;">
                    {{ i + 1 }}
                  </span>
                  <span class="text-700">{{ step }}</span>
                </li>
              </ol>
            </div>

            <div *ngIf="section.tips && section.tips.length > 0" class="help-tips mt-3">
              <h4 class="text-sm font-semibold mb-2 text-primary">
                <i class="pi pi-lightbulb"></i> Consejos:
              </h4>
              <ul class="list-none p-0 m-0">
                <li *ngFor="let tip of section.tips" class="mb-2 flex align-items-start gap-2">
                  <i class="pi pi-info-circle text-blue-500 mt-1"></i>
                  <span class="text-600 text-sm">{{ tip }}</span>
                </li>
              </ul>
            </div>
          </div>
          </p-accordioncontent>
        </p-accordionpanel>
      </p-accordion>

      <!-- Información de contacto -->
      <div class="mt-4 p-3 border-round surface-100">
        <h4 class="text-sm font-semibold mb-2">
          <i class="pi pi-envelope"></i> ¿Necesitas más ayuda?
        </h4>
        <p class="text-sm text-600 m-0">
          Si no encuentras la respuesta que buscas, contáctanos a 
          <a href="mailto:soporte@mrp.com" class="text-primary">soporte@mrp.com</a>
        </p>
      </div>

      <ng-template pTemplate="footer">
        <div class="flex justify-content-between align-items-center">
          <span class="text-sm text-500">Sistema MRP v1.0</span>
          <p-button 
            label="Cerrar" 
            icon="pi pi-times" 
            (click)="hideHelp()"
            [text]="true">
          </p-button>
        </div>
      </ng-template>
    </p-drawer>
  `,
  styles: [`
    .help-floating-button {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 3.5rem;
      height: 3.5rem;
      border-radius: 50%;
      background: var(--primary-color);
      color: white;
      border: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      transition: all 0.3s ease;
      z-index: 1000;
    }

    .help-floating-button:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      background: var(--primary-600);
    }

    .help-floating-button:active {
      transform: scale(0.95);
    }

    .help-section-content {
      font-size: 0.9rem;
    }

    .help-items ul li,
    .help-steps ol li,
    .help-tips ul li {
      line-height: 1.6;
    }

    :host ::ng-deep .help-drawer {
      .p-drawer-header {
        padding: 1.5rem;
        background: var(--surface-50);
      }

      .p-drawer-content {
        padding: 1.5rem;
      }

      .p-accordion .p-accordion-header-link {
        padding: 1rem;
      }

      .p-accordion .p-accordion-content {
        padding: 1rem;
      }
    }
  `]
})
export class HelpCenterComponent implements OnInit {
  sidebarVisible = false;
  searchTerm = '';
  sections: HelpSection[] = [];
  filteredSections: HelpSection[] = [];

  constructor(private helpService: HelpCenterService) {}

  ngOnInit() {
    this.sections = this.helpService.getAllSections();
    this.filteredSections = this.sections;
  }

  showHelp() {
    this.sidebarVisible = true;
  }

  hideHelp() {
    this.sidebarVisible = false;
    this.searchTerm = '';
    this.filteredSections = this.sections;
  }

  filterSections() {
    const term = this.searchTerm.toLowerCase().trim();
    
    if (!term) {
      this.filteredSections = this.sections;
      return;
    }

    this.filteredSections = this.sections.filter(section => 
      section.title.toLowerCase().includes(term) ||
      section.description.toLowerCase().includes(term) ||
      section.items?.some(item => item.toLowerCase().includes(term)) ||
      section.steps?.some(step => step.toLowerCase().includes(term)) ||
      section.tips?.some(tip => tip.toLowerCase().includes(term))
    );
  }
}
