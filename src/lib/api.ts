import { cookies } from "next/headers";

const BASE_URL = process.env.EXTERNAL_BACKEND_URL || "http://localhost:8000/api/v1";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface FetchOptions extends RequestInit {
  token?: string;
  req?: Request;
}

export async function fetchWrapper<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { token, headers = {}, req, ...customConfig } = options;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  if (req) {
    const authHeader = req.headers.get("Authorization");
    if (authHeader) defaultHeaders["Authorization"] = authHeader;

    const cookieHeader = req.headers.get("cookie");
    if (cookieHeader) defaultHeaders["cookie"] = cookieHeader;
  }

  const cookieStore = await cookies();
  const businessId = cookieStore.get("business_id")?.value;

  if (businessId) {
    defaultHeaders["x-business-id"] = businessId;
  }

  const config: RequestInit = {
    ...customConfig,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorBody = await response.text();
    throw new ApiError(response.status, errorBody || response.statusText);
  }

  if (response.status === 204) return {} as T;
  return response.json();
}

export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) =>
    fetchWrapper<T>(endpoint, { ...options, method: "GET" }),
  post: <T>(endpoint: string, body: unknown, options?: FetchOptions) =>
    fetchWrapper<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    }),
  put: <T>(endpoint: string, body: unknown, options?: FetchOptions) =>
    fetchWrapper<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    }),
  patch: <T>(endpoint: string, body: unknown, options?: FetchOptions) =>
    fetchWrapper<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  delete: <T>(endpoint: string, options?: FetchOptions) =>
    fetchWrapper<T>(endpoint, { ...options, method: "DELETE" }),
};
