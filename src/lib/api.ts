import { useBusinessStore } from "@/store/business";
import axios from "axios";


let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1/",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const { currBusiness } = useBusinessStore.getState();

    if (currBusiness) {
    config.headers["x-business-id"] = currBusiness._id;
  }

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const url = originalRequest.url ?? "";

    const excludedEndpoints = [
      "auth/login",
      "auth/register",
      "auth/refresh-token",
      "auth/forgot-password",
      "auth/reset-password",
    ];

    if (excludedEndpoints.some((endpoint) => url.includes(endpoint))) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const response = await axios.post(
        `${api.defaults.baseURL}auth/refresh-token`,
        {},
        { withCredentials: true },
      );

      const newAccessToken = response.data.accessToken;
      setAccessToken(newAccessToken);

      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      setAccessToken(null);

      if (typeof window !== "undefined") {
        localStorage.removeItem("businessId");

        if (window.location.pathname !== "/login") {
          window.location.replace("/login");
        }
      }

      return Promise.reject(refreshError);
    }
  },
);
