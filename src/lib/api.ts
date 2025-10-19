// lib/api.ts
import axios from "axios";

// ✅ Đặt baseURL mặc định trỏ đến API thật trên Azure
const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://memoirsvietnam-faa3hydzbwhbdnhe.southeastasia-01.azurewebsites.net/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Interceptor: chỉ chạy trong môi trường trình duyệt (client-side)
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
