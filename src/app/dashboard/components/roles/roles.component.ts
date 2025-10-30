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
  template: `
<div class="card">
  <div class="flex justify-content-between align-items-center mb-4">
    <h2 class="text-3xl font-bold m-0">
      <i class="pi pi-shield mr-2 text-primary-500"></i>
      Roles
    </h2>
    <p-button label="Nuevo Rol" icon="pi pi-plus" (onClick)="showDialog()" severity="success"></p-button>
  </div>

  <p-table [value]="roles()" [paginator]="true" [rows]="10" [loading]="loading()" styleClass="p-datatable-sm">
    <ng-template pTemplate="header">
      <tr>
        <th>Nombre</th>
        <th>Descripción</th>
        <th>Estado</th>
        <th>Acciones</th>
      </tr>
    </ng-template>
    <ng-template pTemplate="body" let-role>
      <tr>
        <td><span class="font-semibold">{{ role.name }}</span></td>
        <td>{{ role.description || '-' }}</td>
        <td>
          <p-tag [value]="role.is_active ? 'ACTIVO' : 'INACTIVO'" [severity]="role.is_active ? 'success' : 'secondary'"></p-tag>
        </td>
        <td>
          <div class="flex gap-2">
            <p-button icon="pi pi-pencil" (onClick)="editRole(role)" [text]="true" [rounded]="true" severity="info"></p-button>
            <p-button icon="pi pi-trash" (onClick)="deleteRole(role.id)" [text]="true" [rounded]="true" severity="danger"></p-button>
          </div>
        </td>
      </tr>
    </ng-template>
  </p-table>
</div>

<p-dialog [(visible)]="displayDialog" [header]="editMode() ? 'Editar Rol' : 'Nuevo Rol'" [modal]="true" [style]="{width: '30vw'}">
  <div class="grid formgrid p-fluid">
    <div class="field col-12">
      <label>Nombre *</label>
      <input pInputText [(ngModel)]="currentRole.name" />
    </div>
    <div class="field col-12">
      <label>Descripción</label>
      <textarea pInputTextarea [(ngModel)]="currentRole.description" rows="3"></textarea>
    </div>
    <div class="field col-12">
      <label>Estado</label>
      <p-checkbox [(ngModel)]="currentRole.is_active" [binary]="true" label="Activo"></p-checkbox>
    </div>
  </div>
  <ng-template pTemplate="footer">
    <p-button label="Cancelar" icon="pi pi-times" (onClick)="displayDialog = false" [text]="true"></p-button>
    <p-button label="Guardar" icon="pi pi-check" (onClick)="saveRole()" [loading]="saving()"></p-button>
  </ng-template>
</p-dialog>

<p-toast />
<p-confirmDialog />
  `
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

  ngOnInit() { this.loadRoles(); }

  loadRoles() {
    this.loading.set(true);
    this.rolesService.getRoles().subscribe({
      next: (res) => {
        if (res.success) this.roles.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  showDialog() {
    this.currentRole = { name: '', description: '', is_active: true };
    this.editMode.set(false);
    this.displayDialog = true;
  }

  editRole(role: Role) {
    this.currentRole = { ...role };
    this.editMode.set(true);
    this.displayDialog = true;
  }

  saveRole() {
    this.saving.set(true);
    
    const request = this.editMode() && this.currentRole.id
      ? this.rolesService.updateRole(this.currentRole.id, this.currentRole as Role)
      : this.rolesService.createRole(this.currentRole as Role);
    
    request.subscribe({
      next: (res) => {
        if (res.success) {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Rol guardado' });
          this.displayDialog = false;
          this.loadRoles();
        }
        this.saving.set(false);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Error al guardar' });
        this.saving.set(false);
      }
    });
  }

  deleteRole(id: number) {
    this.confirmationService.confirm({
      message: '¿Eliminar este rol?',
      accept: () => {
        this.rolesService.deleteRole(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Rol eliminado' });
            this.loadRoles();
          }
        });
      }
    });
  }
}
