const BASE_URL = process.env.BACKEND_API_URL || "http://localhost:8000/api/v1";

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
  businessId?: string;
  req?: Request;
  onResponse?: (response: Response) => void;
}

export async function fetchWrapper<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { token, businessId, headers = {}, req, onResponse, body, ...customConfig } = options;

  const isFormData = body instanceof FormData;

  const defaultHeaders: Record<string, string> = {
    ...(!isFormData ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };


  if (req) {
    const authHeader = req.headers.get("Authorization");
    if (authHeader) defaultHeaders["Authorization"] = authHeader;

    const cookieHeader = req.headers.get("cookie");
    if (cookieHeader) defaultHeaders["cookie"] = cookieHeader;
  }

  if (businessId) {
    defaultHeaders["x-business-id"] = businessId;
  }

  const config: RequestInit = {
    ...customConfig,
    body,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    credentials: "include",
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  onResponse?.(response);

  if (!response.ok) {
    const errorBody = await response.text();
    throw new ApiError(response.status, errorBody || response.statusText);
  }

  if (response.status === 204) return {} as T;
  return response.json();
}

function serializeBody(body: unknown): BodyInit {
  return body instanceof FormData ? body : JSON.stringify(body) ?? "";
}

export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) =>
    fetchWrapper<T>(endpoint, { ...options, method: "GET" }),
  post: <T>(endpoint: string, body: unknown, options?: FetchOptions) =>
    fetchWrapper<T>(endpoint, {
      ...options,
      method: "POST",
      body: serializeBody(body),
    }),
  put: <T>(endpoint: string, body: unknown, options?: FetchOptions) =>
    fetchWrapper<T>(endpoint, {
      ...options,
      method: "PUT",
      body: serializeBody(body),
    }),
  patch: <T>(endpoint: string, body: unknown, options?: FetchOptions) =>
    fetchWrapper<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: serializeBody(body),
    }),
  delete: <T>(endpoint: string, options?: FetchOptions) =>
    fetchWrapper<T>(endpoint, { ...options, method: "DELETE" }),
};
