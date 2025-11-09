import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { MessageService, ConfirmationService } from 'primeng/api';
import { RolesService } from './roles.service';
import { Role } from './interfaces/role.interface';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, SharedModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './roles.component.html'
})
export class RolesComponent implements OnInit {
  private rolesService = inject(RolesService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  
  roles = signal<Role[]>([]);
  loading = signal(false);
  saving = signal(false);
  editMode = signal(false);
  displayDialog = false;
  currentRole: Partial<Role> = {};

  ngOnInit() { 
    this.loadRoles(); 
  }

  loadRoles() {
    this.loading.set(true);
    this.rolesService.getRoles().subscribe({
      next: (res) => {
        if (res.success) {
          // res.data puede ser un array o un solo objeto, lo normalizamos
          const roles = Array.isArray(res.data) ? res.data : [res.data];
          this.roles.set(roles);
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: err.error?.message || 'Error al cargar roles' 
        });
        this.loading.set(false);
      }
    });
  }

  showDialog() {
    this.currentRole = { name: '', description: '', status: true };
    this.editMode.set(false);
    this.displayDialog = true;
  }

  editRole(role: Role) {
    this.currentRole = { ...role };
    this.editMode.set(true);
    this.displayDialog = true;
  }

  saveRole() {
    if (!this.currentRole.name?.trim()) {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Validación', 
        detail: 'El nombre del rol es requerido' 
      });
      return;
    }

    this.saving.set(true);
    
    const request = this.editMode() && this.currentRole.id
      ? this.rolesService.updateRole(this.currentRole.id, this.currentRole as Role)
      : this.rolesService.createRole(this.currentRole as Role);
    
    request.subscribe({
      next: (res) => {
        if (res.success) {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Éxito', 
            detail: res.message || 'Rol guardado correctamente' 
          });
          this.displayDialog = false;
          this.loadRoles();
        }
        this.saving.set(false);
      },
      error: (err) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: err.error?.message || 'Error al guardar el rol' 
        });
        this.saving.set(false);
      }
    });
  }

  deleteRole(id: number) {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar este rol?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.rolesService.deleteRole(id).subscribe({
          next: (res) => {
            if (res.success) {
              this.messageService.add({ 
                severity: 'success', 
                summary: 'Éxito', 
                detail: res.message || 'Rol eliminado correctamente' 
              });
              this.loadRoles();
            }
          },
          error: (err) => {
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Error', 
              detail: err.error?.message || 'Error al eliminar el rol' 
            });
          }
        });
      }
    });
  }
}
