import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';

import { OrgUsersService } from './org-users.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { OrgUser, AddOrgUserRequest } from './org-users.interface';

@Component({
  selector: 'app-org-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    TableModule,
    InputTextModule,
    TagModule,
    ToastModule,
    ProgressSpinnerModule,
    DialogModule,
    SelectModule
  ],
  providers: [MessageService],
  templateUrl: './org-users.component.html',
  styleUrl: './org-users.component.scss'
})
export class OrgUsersComponent implements OnInit {
  private orgUsersService = inject(OrgUsersService);
  private subscriptionService = inject(SubscriptionService);
  private messageService = inject(MessageService);

  // Signals
  users = signal<OrgUser[]>([]);
  loading = signal<boolean>(false);
  showAddDialog = signal<boolean>(false);
  addingUser = signal<boolean>(false);
  maxUsers = signal<number>(0);
  currentUsers = signal<number>(0);

  // Add user form
  newUserEmail = signal<string>('');
  newUserFullName = signal<string>('');
  newUserPassword = signal<string>('');
  newUserRoleId = signal<number>(2); // Default to regular user

  roleOptions = [
    { label: 'Administrador', value: 1 },
    { label: 'Usuario', value: 2 },
    { label: 'Solo Lectura', value: 3 }
  ];

  ngOnInit(): void {
    this.loadUsers();
    this.loadSubscriptionLimits();
  }

  loadUsers(): void {
    this.loading.set(true);

    this.orgUsersService.getOrgUsers().subscribe({
      next: (response) => {
        this.users.set(response.data);
        this.currentUsers.set(response.data.length);
        this.loading.set(false);
      },
      error: (error: any) => {
        console.error('Error loading users:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los usuarios de la organización'
        });
        this.loading.set(false);
      }
    });
  }

  loadSubscriptionLimits(): void {
    this.subscriptionService.getSubscription().subscribe({
      next: (response) => {
        this.maxUsers.set(response.data.plan.limits.max_users);
      },
      error: (error: any) => {
        console.error('Error loading subscription limits:', error);
      }
    });
  }

  openAddDialog(): void {
    if (this.currentUsers() >= this.maxUsers()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Límite Alcanzado',
        detail: `Has alcanzado el límite de ${this.maxUsers()} usuarios de tu plan`
      });
      return;
    }

    this.newUserEmail.set('');
    this.newUserFullName.set('');
    this.newUserPassword.set('');
    this.newUserRoleId.set(2);
    this.showAddDialog.set(true);
  }

  addUser(): void {
    const email = this.newUserEmail().trim();
    const fullName = this.newUserFullName().trim();
    const password = this.newUserPassword().trim();
    
    if (!email || !fullName || !password) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos Requeridos',
        detail: 'Debes completar todos los campos'
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Email Inválido',
        detail: 'El formato del email no es válido'
      });
      return;
    }

    // Password length validation
    if (password.length < 6) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Contraseña Débil',
        detail: 'La contraseña debe tener al menos 6 caracteres'
      });
      return;
    }

    this.addingUser.set(true);

    const request: AddOrgUserRequest = {
      email: email,
      full_name: fullName,
      password: password,
      role_id: this.newUserRoleId()
    };

    this.orgUsersService.addOrgUser(request).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Usuario Agregado',
          detail: response.message || 'El usuario fue invitado exitosamente'
        });
        this.showAddDialog.set(false);
        this.addingUser.set(false);
        this.loadUsers();
      },
      error: (error: any) => {
        console.error('Error adding user:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'No se pudo agregar el usuario'
        });
        this.addingUser.set(false);
      }
    });
  }

  getRoleSeverity(roleId: number): string {
    switch (roleId) {
      case 1: return 'danger'; // admin
      case 2: return 'success'; // user
      case 3: return 'info'; // readonly
      default: return 'secondary';
    }
  }

  getRoleLabel(roleId: number): string {
    switch (roleId) {
      case 1: return 'Administrador';
      case 2: return 'Usuario';
      case 3: return 'Solo Lectura';
      default: return 'Desconocido';
    }
  }

  getStatusSeverity(status: boolean): string {
    return status ? 'success' : 'danger';
  }

  getStatusLabel(status: boolean): string {
    return status ? 'Activo' : 'Inactivo';
  }

  getUsagePercentage(): number {
    if (this.maxUsers() === 0) return 0;
    return Math.round((this.currentUsers() / this.maxUsers()) * 100);
  }

  getUsageSeverity(): 'success' | 'info' | 'warn' | 'danger' {
    const percentage = this.getUsagePercentage();
    if (percentage >= 100) return 'danger';
    if (percentage >= 80) return 'warn';
    if (percentage >= 50) return 'info';
    return 'success';
  }
}
