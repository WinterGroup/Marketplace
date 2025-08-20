import { config } from "@/config/services";

// выбираем окружение "development" | "production"
const ENV: "development" | "production" = "development";

export const API_AUTH = config[ENV].authService;
// export const API_GATEWAY = config[ENV].apiGateway;
export const API_PRODUCT = config[ENV].productService;

export async function apiRequest<T, D = unknown>(
  baseUrl: string,
  endpoint: string,
  method: string,
  data?: D
): Promise<T> {
  const response = await fetch(`${baseUrl}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include", 
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  try {
    return (await response.json()) as T;
  } catch {
    return {} as T;
  }
}
