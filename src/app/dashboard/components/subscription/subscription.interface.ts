// Interfaces para Subscription

export interface Organization {
  id: number;
  name: string;
  code: string;
}

export interface Plan {
  id: number;
  code: string;
  name: string;
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

export interface Subscription {
  id: number;
  status: string;
  is_trial: boolean;
  trial_days_remaining: number | null;
}

export interface UsageStats {
  users: { current: number; limit: number; percentage: number };
  products: { current: number; limit: number; percentage: number };
  warehouses: { current: number; limit: number; percentage: number };
  movements_today: { current: number; limit: number; percentage: number };
  ai_reports_today: { current: number; limit: number; percentage: number };
}

export interface SubscriptionResponse {
  success: boolean;
  data: {
    organization: Organization;
    plan: Plan;
    subscription: Subscription;
    usage?: UsageStats;
  };
}
