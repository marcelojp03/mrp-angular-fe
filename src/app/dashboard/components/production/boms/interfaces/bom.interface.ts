export interface BOM {
  id?: number;
  product_id: number;
  product_name?: string;
  product_code?: string;
  version: string;
  description?: string;
  is_active: boolean;
  org_id?: number;
  components: BOMComponent[];
  created_at?: string;
  updated_at?: string;
}

export interface BOMComponent {
  id?: number;
  bom_id?: number;
  component_id: number;
  component_name?: string;
  component_code?: string;
  quantity: number;
  unit_id: number;
  unit_code?: string;
  unit_description?: string;
  scrap_percentage: number;
  sequence: number;
  notes?: string;
  created_at?: string;
}

export interface BOMsResponse {
  data: BOM[];
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
  min_stock?: number;
  unit_id?: number;
  status?: boolean;
}

export interface Unit {
  id: number;
  code: string;           // Código de la unidad (EA, KG, M, L, etc.)
  description: string;    // Descripción (Unidad, Kilogramo, Metro, etc.)
}

export interface ProductsResponse {
  data: Product[];
  message: string;
  success: boolean;
}

export interface UnitsResponse {
  data: Unit[];
  message: string;
  success: boolean;
}
