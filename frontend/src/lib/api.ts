export const API_BACKEND = 'localhost:8000/api/v1/';



export async function apiRequest<T, D = unknown>(
  endpoint: string,
  method: string,
  data?: D
): Promise<T> {
  const response = await fetch(`${API_BACKEND}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: data ? JSON.stringify(data) : undefined
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}