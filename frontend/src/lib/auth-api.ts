import { apiRequest } from "./api";


export interface RegisterInterface {
  username: string;
  email: string;
  password: string;
}

export interface LoginInterface {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

export async function LoginRequest(
  data: LoginInterface
): Promise<AuthResponse> {
  return apiRequest<AuthResponse, LoginInterface>(
    `/auth/login/`,
    "POST",
    data
  );
}


export async function LogoutRequest(): Promise<void> {
  return apiRequest<void>(`/auth/logout/`, "POST");
}



export async function RegisterRequest(
  data: RegisterInterface
): Promise<AuthResponse> {
  return apiRequest<AuthResponse, RegisterInterface>(
    `/auth/register/`,
    "POST",
    data
  );
}