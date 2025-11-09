export interface ProductionReportParams {
  from?: string; // YYYY-MM-DD
  to?: string;   // YYYY-MM-DD
}

export interface ProductionReportResponse {
  success: boolean;
  message: string;
  data: ProductionReportData;
}

export interface ProductionReportData {
  period: {
    from: string;
    to: string;
  };
  summary: ProductionSummary;
  top_boms: TopBom[];
  top_products: TopProduct[];
  monthly_production: MonthlyProduction[];
}

export interface ProductionSummary {
  total_work_orders: number;
  total_quantity_planned: number | string; // Backend puede devolver string con decimales
  total_quantity_finished: number | string; // Backend puede devolver string con decimales
  by_status: {
    Planificada?: number;
    'En Progreso'?: number;
    Finalizada?: number;
    Cancelada?: number;
    // Fallback para inglés si backend cambia
    PLANNED?: number;
    IN_PROGRESS?: number;
    FINISHED?: number;
    CANCELLED?: number;
  };
  completion_rate: number; // Porcentaje de finalización
  efficiency_rate: number | string; // Unidades terminadas vs planificadas (puede ser string)
  avg_completion_time_hours: number; // Tiempo promedio de producción
}

export interface TopBom {
  bom_id: number;
  product_id: number;
  product_name: string;
  product_code: string;
  work_orders_count: number;
  total_quantity: number | string; // Backend devuelve string con decimales
}

export interface TopProduct {
  product_id: number;
  product_name: string;
  product_code: string;
  total_quantity: number | string; // Backend devuelve string con decimales
  orders_count: number;
}

export interface MonthlyProduction {
  month: string; // YYYY-MM
  planned: number;
  in_progress: number;
  finished: number;
  cancelled: number;
  total: number;
}
