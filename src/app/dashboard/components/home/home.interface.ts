// Interfaces para Dashboard Stats

export interface DashboardStats {
  total_products: number;
  total_warehouses: number;
  total_suppliers: number;
  total_movements_today: number;
  low_stock_count: number;
  total_users: number;
  work_orders_active?: number;
  work_orders_finished_today?: number;
  materials_consumed_today?: number;
}

export interface DashboardStatsResponse {
  success: boolean;
  data: DashboardStats;
}

export interface StockAlert {
  id: number;
  code: string;
  name: string;
  description: string;
  current_stock: number;
  min_stock: number;
  unit_code: string;
  item_type: string;
  procurement_type: string;
  org_id: number;
  status: boolean;
}

export interface StockAlertsResponse {
  success: boolean;
  data: StockAlert[];
}

export interface RecentMovement {
  id: number;
  movement_type: string;
  movement_date: string;
  product_name: string;
  warehouse_name: string;
  quantity: number;
  unit_name: string;
  user_name: string;
}

export interface RecentMovementsResponse {
  success: boolean;
  data: RecentMovement[];
}

export interface TopProduct {
  product_id: number;
  product_code: string;
  product_name: string;
  total_movements: number;
  total_quantity: number;
}

export interface TopProductsResponse {
  success: boolean;
  data: TopProduct[];
}
