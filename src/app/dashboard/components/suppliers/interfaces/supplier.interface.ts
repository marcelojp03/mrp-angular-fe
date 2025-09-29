export interface Supplier {
    id: number;
    name: string;
    address: string;
    city: string;
    email: string;
    mobile: string | null;
    phone: string;
    status: boolean;
    created_at: string | null;
    updated_at: string | null;
    created_by: number | null;
    updated_by: number | null;
    deleted_at: string | null;
}

export interface SuppliersResponse {
    data: Supplier[];
    message: string;
    success: boolean;
}

export interface SupplierRequest {
    name: string;
    address: string;
    city: string;
    email: string;
    mobile?: string;
    phone: string;
    status?: boolean;
}

export interface SupplierUpdateRequest extends SupplierRequest {
    id: number;
}

// Interface for display in the component
export interface SupplierVM {
    id: number;
    name: string;
    address: string;
    city: string;
    email: string;
    mobile: string | null;
    phone: string;
    status: boolean;
    created_at: string | null;
    updated_at: string | null;
}