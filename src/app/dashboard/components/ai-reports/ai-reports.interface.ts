// Interfaces para Reportes con IA

export interface AIReportRequest {
  query: string;
  limit?: number;
}

export interface AIReportResponse {
  success: boolean;
  message: string;
  data: {
    sql: string;
    columns: string[];
    rows: any[][];
    row_count: number;
    explanation: string;
    took_ms: number;
  };
}

export interface AIReportError {
  success: false;
  message: string;
  code: number;
  details?: string;
}
