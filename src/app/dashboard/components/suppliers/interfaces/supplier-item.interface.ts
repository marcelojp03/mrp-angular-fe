export interface SupplierItem {
    id: number;
    product_id: number;
    supplier_id: number;
    price: number;
    currency: string;
    min_order_qty: number;
    pack_size: number;
    lead_time_days: number;
    is_active: boolean;
    is_preferred: boolean;
    org_id: number;
}

export interface SupplierItemsResponse {
    data: SupplierItem[];
    message: string;
    success: boolean;
}

export interface SupplierItemRequest {
    product_id: number;
    supplier_id: number;
    price: number;
    currency: string;
    min_order_qty: number;
    pack_size: number;
    lead_time_days: number;
    is_active?: boolean;
    is_preferred?: boolean;
}

export interface SupplierItemUpdateRequest extends SupplierItemRequest {
    id: number;
}

// Interface for display in components with related data
export interface SupplierItemVM {
    id: number;
    product_id: number;
    product_name?: string;
    supplier_id: number;
    supplier_name?: string;
    price: number;
    currency: string;
    min_order_qty: number;
    pack_size: number;
    lead_time_days: number;
    is_active: boolean;
    is_preferred: boolean;
    org_id: number;
}