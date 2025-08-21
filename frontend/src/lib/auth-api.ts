import { apiRequest, API_AUTH } from "./api";

export interface RegisterInterface {
  username: string;
  email: string;
  password: string;
}

export interface LoginInterface {
  username: string;
  password: string;
}

export async function LoginRequest(
  data: LoginInterface
): Promise<boolean> {
  return apiRequest<boolean, LoginInterface>(
    API_AUTH,
    "/users/login",
    "POST",
    data
  );
}

export async function LogoutRequest(): Promise<void> {
  return apiRequest<void>(
    API_AUTH,
    "/users/logout",
    "POST"
  );
}

export async function RegisterRequest(
  data: RegisterInterface
) {
  return apiRequest<unknown, RegisterInterface>(
    API_AUTH,
    "/users/register",
    "POST",
    data
  );
}

export async function MeRequest() {
  return apiRequest<{ username: string; email: string }>(
    API_AUTH,
    "/users/me",
    "GET"
  );
}
