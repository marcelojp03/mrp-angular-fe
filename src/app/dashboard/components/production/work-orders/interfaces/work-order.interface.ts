export interface WorkOrder {
  id?: number;
  reference?: string;
  product_id: number;
  product_name?: string;
  product_code?: string;
  bom_id: number;
  bom_version?: string;
  quantity: number;
  warehouse_id: number;
  warehouse_name?: string;
  assigned_to?: number | null;
  assigned_to_name?: string | null;
  notes?: string;
  status: WorkOrderStatus;
  planned_start?: string | null;
  planned_end?: string | null;
  actual_start?: string | null;
  actual_end?: string | null;
  org_id?: number;
  created_by?: number;
  created_by_name?: string;
  created_at?: string;
  updated_at?: string;
}

export type WorkOrderStatus = 'Planificada' | 'En Progreso' | 'Finalizada' | 'Cancelada';

export interface WorkOrdersResponse {
  data: WorkOrder[];
  message: string;
  success: boolean;
}

export interface Product {
  id: number;
  code: string;
  name: string;
  description?: string;
  item_type?: string;
  procurement_type?: string;
  bom_version?: string;  // Versión de BOM activa (solo para productos del endpoint products-with-active-bom)
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

export interface ProductsResponse {
  data: Product[];
  message: string;
  success: boolean;
}

export interface WarehousesResponse {
  data: Warehouse[];
  message: string;
  success: boolean;
}

export interface UsersResponse {
  data: User[];
  message: string;
  success: boolean;
}

// Interfaces para respuestas de START y FINISH
export interface Movement {
  movement_id: number;
  product_id: number;
  product_code: string;
  product_name: string;
  quantity: number;
  warehouse_id?: number;
  warehouse_name?: string;
}

export interface StartWorkOrderResponse {
  success: boolean;
  message: string;
  data: {
    work_order: {
      id: number;
      status: WorkOrderStatus;
      actual_start: string;
      product_name: string;
      quantity: number;
    };
    movements: Movement[];
  };
}

export interface FinishWorkOrderResponse {
  success: boolean;
  message: string;
  data: {
    work_order: {
      id: number;
      status: WorkOrderStatus;
      actual_start: string;
      actual_end: string;
      quantity: number;
    };
    movement: Movement;
  };
}

export interface InsufficientStockItem {
  product: string;
  required: number;
  available: number;
  missing: number;
}

export interface StartWorkOrderError {
  success: false;
  message: string;
  details?: {
    insufficient_stock: InsufficientStockItem[];
  };
}
