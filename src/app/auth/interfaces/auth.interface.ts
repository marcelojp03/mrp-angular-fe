export class User {
    correo_electronico?: string;
    clave?: string;
}

export class User2 {
    login?: string;
    password?: string;
}

// New interfaces for updated API
export interface LoginRequest {
    email: string;
    password: string;
}

export interface UserData {
    email: string;
    id: number;
    name: string;
    photo: string | null;
    roles: UserRole[];
    status: boolean;
}

export interface UserRole {
    role: string;
    role_id: number;
    user_id: number;
}

export interface LoginSuccessResponse {
    data: {
        org_id: number;
        token: string;  // Mantener para compatibilidad
        access_token: string;  // Nuevo en Sprint 3
        refresh_token: string; // Nuevo en Sprint 3
        user: UserData;
    };
    message: string;
    success: boolean;
}

export interface LoginErrorResponse {
    code: string;
    data: null;
    message: string;
    success: boolean;
}

export interface MenuResource {
    description: string;
    id: number;
    name: string;
    subresources: MenuSubresource[];
}

export interface MenuSubresource {
    description: string;
    icon: string;
    id: number;
    name: string;
    url: string;
}

export interface MenuResponse {
    data: MenuResource[];
    message: string;
    success: boolean;
}