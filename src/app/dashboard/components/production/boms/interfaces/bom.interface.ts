export interface BOM {
  id?: number;
  product_id: number;
  product_name?: string;
  product_code?: string;
  version: string;
  description?: string;
  is_active: boolean;
  components: BOMComponent[];
  created_at?: string;
  updated_at?: string;
}

export interface BOMComponent {
  id?: number;
  component_id: number;
  component_name?: string;
  component_code?: string;
  quantity: number;
  unit_id: number;
  unit_name?: string;
  scrap_percentage: number;
  notes?: string;
}

export interface Product {
  id: number;
  code: string;
  name: string;
  description?: string;
  category_id?: number;
  subcategory_id?: number;
  unit_id?: number;
}

export interface Unit {
  id: number;
  name: string;
  abbreviation: string;
}
