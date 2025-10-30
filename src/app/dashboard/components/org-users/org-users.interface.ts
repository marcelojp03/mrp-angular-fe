// Interfaces para Org Users

export interface OrgUser {
  id: number;
  email: string;
  full_name: string;
  role_id: number;
  role_name?: string;
  status: boolean;
  joined_at: string;
}

export interface OrgUsersResponse {
  success: boolean;
  data: OrgUser[];
}

export interface AddOrgUserRequest {
  email: string;
  full_name: string;
  password: string;
  role_id: number;
}

export interface AddOrgUserResponse {
  success: boolean;
  message: string;
  data: {
    user_id: number;
    org_id: number;
  };
}
