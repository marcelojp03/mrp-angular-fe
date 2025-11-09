// Interfaces para Reportes con IA

export interface AIReportRequest {
  query: string;
  format?: 'json' | 'csv' | 'excel' | 'pdf';
  limit?: number;
  dry_run?: boolean;
}

export interface AIReportResponse {
  success: boolean;  // El backend usa 'success' booleano, no 'status' string
  message: string;
  data: {
    sql: string;
    columns: string[];
    rows: any[];
    interpretation: string;
    summary: {
      total_rows: number;
      execution_time_ms: number;
    };
    export_options: string[];
  } | null;
}

export interface AIReportError {
  status: 'error';
  message: string;
  data: null;
}
