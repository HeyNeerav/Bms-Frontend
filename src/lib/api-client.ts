const BASE_URL = '/api';

export async function fetchWrapper<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(!isFormData ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `API error: ${res.status} ${res.statusText}`,
    );
  }

  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

function serializeBody(body: unknown): BodyInit {
  if (body instanceof FormData) return body;
  return JSON.stringify(body);
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    fetchWrapper<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
    fetchWrapper<T>(endpoint, {
      ...options,
      method: "POST",
      body: serializeBody(body),
    }),

  put: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
    fetchWrapper<T>(endpoint, {
      ...options,
      method: "PUT",
      body: serializeBody(body),
    }),

  patch: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
    fetchWrapper<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: serializeBody(body),
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    fetchWrapper<T>(endpoint, { ...options, method: "DELETE" }),
};