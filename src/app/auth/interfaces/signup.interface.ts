// Interfaces para Signup

export interface SignupRequest {
  org_name: string;
  admin_email: string;
  admin_password: string;
  admin_full_name: string;
  plan_code: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  data: {
    org_id: number;
    user_id: number;
    access_token: string;
    plan: {
      code: string;
      name: string;
      max_users: number;
      max_products: number;
      max_ai_reports_per_day: number;
    };
  };
}
