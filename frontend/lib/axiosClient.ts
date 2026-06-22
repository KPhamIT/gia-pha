import axios from "axios";
import { STORAGE_KEYS } from "@/lib/constants/storage-keys";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && typeof window !== "undefined") {
      if (error.response?.status === 401) {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
      }
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
