export interface Movement {
  id: number;
  movement_type: 'IN' | 'OUT';  // API usa movement_type, no type
  reason: string;  // PURCHASE, CONSUMPTION, TRANSFER, ADJUSTMENT, etc.
  quantity: number;
  product_id: number;
  product_name?: string;
  product_code?: string;
  from_warehouse_id?: number | null;
  from_warehouse_name?: string;
  to_warehouse_id?: number | null;
  to_warehouse_name?: string;
  reference_type?: string | null;
  reference_id?: string | null;
  note?: string | null;
  org_id?: number;
  created_at: string;
  created_by?: number | null;
  created_by_name?: string;
}

export interface MovementsResponse {
  data: Movement[];
  message: string;
  success: boolean;
  total?: number;
}
