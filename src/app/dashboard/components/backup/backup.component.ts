import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';

import { BackupService } from './backup.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { BackupResponse } from './backup.interface';

@Component({
  selector: 'app-backup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    ProgressSpinnerModule,
    ToastModule,
    TagModule,
    DividerModule,
    MessageModule
  ],
  providers: [MessageService],
  templateUrl: './backup.component.html',
  styleUrl: './backup.component.scss'
})
export class BackupComponent implements OnInit {
  private backupService = inject(BackupService);
  private subscriptionService = inject(SubscriptionService);
  private messageService = inject(MessageService);

  // Signals
  loading = signal<boolean>(false);
  backupData = signal<BackupResponse | null>(null);
  lastBackupDate = signal<Date | null>(null);
  canBackup = signal<boolean>(true);
  backupLimit = signal<number>(0);

  ngOnInit(): void {
    this.loadBackupInfo();
  }

  loadBackupInfo(): void {
    this.subscriptionService.getSubscription().subscribe({
      next: (response) => {
        // Default backup enabled for all paid plans
        this.backupLimit.set(1); // Allow backup once per day by default
        this.canBackup.set(true);
      },
      error: (error: any) => {
        console.error('Error loading backup info:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar la información de backup'
        });
      }
    });

    // Load last backup date from localStorage
    const lastBackup = localStorage.getItem('last_backup_date');
    if (lastBackup) {
      this.lastBackupDate.set(new Date(lastBackup));
    }
  }

  generateBackup(): void {
    if (!this.canBackup()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Backup No Disponible',
        detail: 'Tu plan actual no incluye backups automáticos'
      });
      return;
    }

    // Check backup frequency
    if (this.lastBackupDate()) {
      const daysSinceLastBackup = this.getDaysSinceLastBackup();
      if (daysSinceLastBackup < this.backupLimit()) {
        const daysRemaining = this.backupLimit() - daysSinceLastBackup;
        this.messageService.add({
          severity: 'warn',
          summary: 'Backup Reciente',
          detail: `Debes esperar ${daysRemaining} día(s) antes de generar otro backup`
        });
        return;
      }
    }

    this.loading.set(true);

    this.backupService.generateBackup().subscribe({
      next: (response) => {
        this.backupData.set(response);
        this.lastBackupDate.set(new Date());
        localStorage.setItem('last_backup_date', new Date().toISOString());

        this.messageService.add({
          severity: 'success',
          summary: 'Backup Generado',
          detail: 'El backup se generó exitosamente'
        });

        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error generating backup:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Error al generar el backup'
        });
        this.loading.set(false);
      }
    });
  }

  downloadBackup(): void {
    if (!this.backupData()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Sin Datos',
        detail: 'Primero debes generar un backup'
      });
      return;
    }

    try {
      const jsonStr = JSON.stringify(this.backupData(), null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      link.download = `backup_${timestamp}.json`;
      
      link.click();
      window.URL.revokeObjectURL(url);

      this.messageService.add({
        severity: 'success',
        summary: 'Descarga Iniciada',
        detail: 'El archivo de backup se está descargando'
      });
    } catch (error) {
      console.error('Error downloading backup:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al descargar el backup'
      });
    }
  }

  getDaysSinceLastBackup(): number {
    if (!this.lastBackupDate()) return Infinity;
    
    const now = new Date();
    const lastBackup = this.lastBackupDate()!;
    const diffTime = Math.abs(now.getTime() - lastBackup.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }

  getNextBackupDate(): Date | null {
    if (!this.lastBackupDate() || this.backupLimit() === 0) return null;
    
    const nextDate = new Date(this.lastBackupDate()!);
    nextDate.setDate(nextDate.getDate() + this.backupLimit());
    
    return nextDate;
  }

  canGenerateBackup(): boolean {
    if (!this.canBackup()) return false;
    if (!this.lastBackupDate()) return true;
    
    return this.getDaysSinceLastBackup() >= this.backupLimit();
  }

  getBackupStats() {
    if (!this.backupData()) return null;

    const data = this.backupData()!;
    const backupData = data.data.data;
    
    return {
      categories: backupData['categories']?.count || 0,
      subcategories: backupData['subcategories']?.count || 0,
      products: backupData['products']?.count || 0,
      inventory: backupData['inventory']?.count || 0,
      suppliers: backupData['suppliers']?.count || 0,
      warehouses: backupData['warehouses']?.count || 0,
      payment_methods: backupData['payment_methods']?.count || 0,
      users: backupData['users']?.count || 0,
      total: data.data.statistics.total_rows
    };
  }
}
