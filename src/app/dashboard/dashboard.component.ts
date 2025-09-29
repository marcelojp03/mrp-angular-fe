import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { DataService } from '../shared/services/data.service';
import Swal from 'sweetalert2';
import { MenuItem } from 'primeng/api';
import { LayoutService } from '../core/layouts/service/layout.service'; 
import { RouterOutlet } from '@angular/router';
import { MenuResponse } from '../auth/interfaces/auth.interface';

@Component({
    selector: 'app-dashboard',
    imports: [RouterOutlet],
    template: '<router-outlet></router-outlet>',
    standalone: true,
})
export class DashboardComponent implements OnInit {
    constructor(
        private authService: AuthService,
        private dataService: DataService,
        private layoutService: LayoutService
    ) {}

    ngOnInit() {
        this.loadMenu();
    }

    loadMenu() {
        this.dataService.getMenu().subscribe({
            next: (response: MenuResponse) => {
                console.info("MENU CARGADO", response);
                if (response.success) {
                    const menuItems: MenuItem[] = this.transformToMenuItems(response.data);
                    this.layoutService.setMenu(menuItems); 
                } else {
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: response.message,
                        showConfirmButton: false,
                        timer: 3000
                    });
                }
            },
            error: (error: Error) => {
                console.error("Error loading menu:", error.message);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Error al cargar el menú',
                    text: 'No se pudo cargar el menú. Verifique su conexión.',
                    showConfirmButton: false,
                    timer: 3000
                });
            }
        });
    }

    transformToMenuItems(apiMenu: any[]): MenuItem[] {
        const normalizeIcon = (icon: string) =>
            icon?.startsWith('pi ') || icon?.startsWith('pi-') ? icon : `pi pi-${icon}`;

        const normalizeUrl = (url: string) => {
            // Convert absolute URLs to relative URLs for dashboard routing
            if (url?.startsWith('/')) {
                return url.substring(1); // Remove leading slash
            }
            return url;
        };

        const menuItems = apiMenu.map(resource => ({
            label: resource.name,
            icon: normalizeIcon(resource.icon || 'pi pi-folder'),
            routerLink: resource.url ? normalizeUrl(resource.url) : undefined,
            items: resource.subresources?.map((sub: any) => {
                const normalizedUrl = sub.url ? normalizeUrl(sub.url) : undefined;
                console.log(`Menu item: ${sub.name}, Original URL: ${sub.url}, Normalized URL: ${normalizedUrl}`);
                return {
                    label: sub.name,
                    icon: normalizeIcon(sub.icon),
                    routerLink: normalizedUrl
                };
            })
        }));

        console.log('Final menu items:', menuItems);
        return menuItems;
    }

}
