// Interfaces para System Logs

export interface SystemLog {
  id: number;
  ts: string;
  user_id: number;
  org_id: number;
  method: string;
  path: string;
  status_code: number;
  ip: string;
  user_agent?: string;
}

export interface LogsResponse {
  success: boolean;
  data: {
    logs: SystemLog[];
    total: number;
    page: number;
    pages: number;
  };
}

export interface LogsParams {
  page?: number;
  per_page?: number;
  user_id?: number;
  method?: string;
  path?: string;
}
