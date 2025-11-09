export interface Role {
  id?: number;
  name: string;
  description?: string;
  status: boolean; // El backend usa 'status', no 'is_active'
  created_at?: string;
  updated_at?: string;
}

export interface RoleResponse {
  success: boolean;
  message: string;
  data: Role | Role[]; // Puede ser un solo rol o un array
}
