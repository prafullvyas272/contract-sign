import { env } from "@/env";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

export const axiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config: any) => {
    return config;
  },
  (error: AxiosError) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  },
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse["data"] => {
    return response.data;
  },
  (error: AxiosError) => {
    console.error("Response error:", error);
    if (error.response?.status === 401) {
      console.log("Unauthorized access - redirecting to login");
    }

    return Promise.reject(error);
  },
);
