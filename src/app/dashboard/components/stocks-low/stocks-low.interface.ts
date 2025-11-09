export interface StockLowItem {
  id: number;
  code: string;
  name: string;
  description: string;
  current_stock: number;
  min_stock: number;
  unit_code: string;
  item_type: string;
  procurement_type: string;
}

export interface StockLowResponse {
  success: boolean;
  data: StockLowItem[];
}
