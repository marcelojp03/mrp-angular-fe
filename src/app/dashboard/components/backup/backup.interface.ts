// Interfaces para Backup

export interface BackupResponse {
  success: boolean;
  message: string;
  data: {
    org_id: number;
    backup_timestamp: string;
    backup_version: string;
    data: Record<string, TableBackup>;
    statistics: BackupStatistics;
  };
}

export interface TableBackup {
  count: number;
  has_org_filter: boolean;
  rows: any[];
}

export interface BackupStatistics {
  tables_with_org: number;
  tables_without_org: number;
  total_tables: number;
  total_rows: number;
}
