// Interfaces para Reorder Suggestions

export interface ReorderSuggestion {
  product_id: number;
  code: string;
  name: string;
  current_stock: number;
  min_stock: number;
  suggested_qty: number;
  supplier_id: number | null;
  lead_time_days: number | null;
  hint: string | null;
}

export interface ReorderSuggestionsResponse {
  success: boolean;
  data: ReorderSuggestion[];
  message: string;
}
