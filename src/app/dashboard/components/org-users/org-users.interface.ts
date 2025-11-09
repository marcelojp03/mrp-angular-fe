// Interfaces para Users

export interface User {
  id: number;
  name: string;
  email: string;
  photo: string | null;
  status: boolean;
  roles: UserRole[];
}

export interface UserRole {
  role_id: number;
  role: string;
  user_id: number;
}

export interface UsersResponse {
  success: boolean;
  message: string;
  data: User[];
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  photo?: string | null;
  role_ids?: number[]; // Array de IDs de roles
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  status?: boolean;
  photo?: string | null;
  role_ids?: number[]; // Array de IDs de roles (reemplaza todos)
}
