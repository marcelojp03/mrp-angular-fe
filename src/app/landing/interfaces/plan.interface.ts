export interface Plan {
  id: number;
  code: string;
  name: string;
  is_active: boolean;
  limits: {
    max_users: number;
    max_products: number;
    max_warehouses: number;
    max_movements_per_day: number;
    max_ai_reports_per_day: number;
  };
  features: {
    allow_bom: boolean;
    allow_work_orders: boolean;
    allow_mrp: boolean;
    allow_forecast: boolean;
  };
}

export interface PlansResponse {
  success: boolean;
  data: Plan[];
}
