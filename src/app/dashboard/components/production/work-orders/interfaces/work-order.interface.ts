export interface WorkOrder {
  id?: number;
  product_id: number;
  product_name?: string;
  quantity: number;
  warehouse_id: number;
  warehouse_name?: string;
  assigned_to?: number;
  assigned_to_name?: string;
  reference?: string;
  notes?: string;
  status: WorkOrderStatus;
  planned_start?: string;
  planned_end?: string;
  actual_start?: string;
  actual_end?: string;
  produced_quantity?: number;
  created_at?: string;
  updated_at?: string;
}

export type WorkOrderStatus = 'Planificada' | 'En Progreso' | 'Finalizada' | 'Cancelada';

export interface Product {
  id: number;
  code: string;
  name: string;
  description?: string;
}

export interface Warehouse {
  id: number;
  name: string;
  location?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}
