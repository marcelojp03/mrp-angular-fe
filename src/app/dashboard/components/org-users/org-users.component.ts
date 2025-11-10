import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { MessageService, ConfirmationService } from 'primeng/api';
import { OrgUsersService } from './org-users.service';
import { RolesService } from '../roles/roles.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { User, CreateUserRequest, UpdateUserRequest } from './org-users.interface';
import { Role } from '../roles/interfaces/role.interface';

@Component({
  selector: 'app-org-users',
  standalone: true,
  imports: [CommonModule, SharedModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './org-users.component.html',
  styleUrl: './org-users.component.scss'
})
export class OrgUsersComponent implements OnInit {
  private usersService = inject(OrgUsersService);
  private rolesService = inject(RolesService);
  private subscriptionService = inject(SubscriptionService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  // Signals
  users = signal<User[]>([]);
  availableRoles = signal<Role[]>([]);
  subscriptionLimits = signal<{max_users?: number} | null>(null);
  loading = signal(false);
  saving = signal(false);
  editingUser = signal(false);
  
  // Dialog
  userDialog = false;
  resetPasswordDialog = false;
  searchValue = '';
  currentUser: Partial<CreateUserRequest & UpdateUserRequest & { id?: number }> = {};
  newPassword = '';

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
    this.loadSubscriptionLimits();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.usersService.getUsers().subscribe({
      next: (res) => {
        if (res.success) {
          this.users.set(res.data);
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: err.error?.message || 'Error al cargar usuarios' 
        });
        this.loading.set(false);
      }
    });
  }

  loadRoles(): void {
    this.rolesService.getRoles().subscribe({
      next: (res) => {
        if (res.success && Array.isArray(res.data)) {
          this.availableRoles.set(res.data.filter((r: Role) => r.status));
        }
      },
      error: (err) => {
        console.error('Error loading roles:', err);
      }
    });
  }

  loadSubscriptionLimits(): void {
    this.subscriptionService.getSubscription().subscribe({
      next: (res) => {
        if (res.success && res.data?.plan?.limits) {
          this.subscriptionLimits.set({
            max_users: res.data.plan.limits.max_users || 999999
          });
        }
      },
      error: (err) => {
        console.error('Error loading subscription limits:', err);
      }
    });
  }

  showDialog(): void {
    const maxUsers = this.subscriptionLimits()?.max_users || Infinity;
    if (this.users().length >= maxUsers) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Límite alcanzado',
        detail: `Has alcanzado el límite de ${maxUsers} usuarios de tu plan`
      });
      return;
    }

    this.currentUser = { role_ids: [], status: true };
    this.editingUser.set(false);
    this.userDialog = true;
  }

  editUser(user: User): void {
    this.currentUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.status,
      role_ids: user.roles?.map(r => r.role_id) || []
    };
    this.editingUser.set(true);
    this.userDialog = true;
  }

  saveUser(): void {
    // Validations
    if (!this.currentUser.name?.trim()) {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Validación', 
        detail: 'El nombre es requerido' 
      });
      return;
    }

    if (!this.currentUser.email?.trim()) {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Validación', 
        detail: 'El email es requerido' 
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.currentUser.email)) {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Validación', 
        detail: 'El formato del email no es válido' 
      });
      return;
    }

    if (!this.editingUser() && (!this.currentUser.password || this.currentUser.password.length < 6)) {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Validación', 
        detail: 'La contraseña debe tener al menos 6 caracteres' 
      });
      return;
    }

    this.saving.set(true);

    const request = this.editingUser() && this.currentUser.id
      ? this.usersService.updateUser(this.currentUser.id, {
          name: this.currentUser.name,
          email: this.currentUser.email,
          status: this.currentUser.status,
          role_ids: this.currentUser.role_ids
        })
      : this.usersService.createUser({
          name: this.currentUser.name!,
          email: this.currentUser.email!,
          password: this.currentUser.password!,
          role_ids: this.currentUser.role_ids
        });

    request.subscribe({
      next: (res) => {
        if (res.success) {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Éxito', 
            detail: res.message || 'Usuario guardado correctamente' 
          });
          this.userDialog = false;
          this.loadUsers();
        }
        this.saving.set(false);
      },
      error: (err) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: err.error?.message || 'Error al guardar el usuario' 
        });
        this.saving.set(false);
      }
    });
  }

  deleteUser(id: number): void {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar este usuario?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.usersService.deleteUser(id).subscribe({
          next: (res) => {
            if (res.success) {
              this.messageService.add({ 
                severity: 'success', 
                summary: 'Éxito', 
                detail: res.message || 'Usuario eliminado correctamente' 
              });
              this.loadUsers();
            }
          },
          error: (err) => {
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Error', 
              detail: err.error?.message || 'Error al eliminar el usuario' 
            });
          }
        });
      }
    });
  }

  /**
   * Muestra el diálogo para resetear contraseña
   */
  showResetPasswordDialog(): void {
    this.resetPasswordDialog = true;
    this.newPassword = '';
  }

  /**
   * Confirma el reseteo de contraseña
   */
  confirmResetPassword(): void {
    if (!this.currentUser.id) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'No se encontró el ID del usuario' 
      });
      return;
    }

    if (!this.newPassword || this.newPassword.length < 6) {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Validación', 
        detail: 'La contraseña debe tener al menos 6 caracteres' 
      });
      return;
    }

    this.usersService.resetPassword(this.currentUser.id, this.newPassword).subscribe({
      next: (res) => {
        if (res.success) {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Éxito', 
            detail: res.message || 'Contraseña reseteada correctamente' 
          });
          this.resetPasswordDialog = false;
          this.newPassword = '';
        }
      },
      error: (err) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: err.error?.message || 'Error al resetear la contraseña' 
        });
      }
    });
  }
}
