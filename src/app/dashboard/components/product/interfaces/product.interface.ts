export interface Product {
    code: string;
    created_at: string;
    description: string;
    id: number;
    item_type: 'RM' | 'FG' | 'CONSUMABLE' | 'SERVICE';
    min_stock: number;
    name: string;
    org_id: number;
    procurement_type: 'BUY' | 'MAKE';
    status: boolean;
    unit_code: string | null;
    unit_id: number | null;
    updated_at: string;
}

export interface ProductsResponse {
    data: Product[];
    message: string;
    success: boolean;
}

export interface ProductRequest {
    code?: string;
    name: string;
    description?: string;
    item_type: 'RM' | 'FG' | 'CONSUMABLE' | 'SERVICE';
    min_stock: number;
    procurement_type: 'BUY' | 'MAKE';
    unit_id?: number | null;
    status?: boolean;
}

export interface ProductUpdateRequest extends ProductRequest {
    id: number;
}

// Interface for display in the component
export interface ProductVM {
    id: number;
    code: string;
    name: string;
    description: string;
    item_type: string;
    item_type_label: string;
    min_stock: number;
    procurement_type: string;
    procurement_type_label: string;
    unit_code: string | null;
    status: boolean;
    created_at: string;
    updated_at: string;
}

export const ItemTypeLabels = {
    'RM': 'Materia Prima',
    'FG': 'Producto Terminado',
    'CONSUMABLE': 'Consumible',
    'SERVICE': 'Servicio'
};

export const ProcurementTypeLabels = {
    'BUY': 'Comprar',
    'MAKE': 'Fabricar'
};