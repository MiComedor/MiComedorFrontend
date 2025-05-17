// axiosInstance.ts
import axios from "axios";

const getToken = () => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  const user = JSON.parse(userStr);
  return user?.token || user?.accessToken || null;
};

const api = axios.create({
  baseURL: "http://localhost:8084",
});

api.interceptors.request.use((config) => {
  const token = getToken();
  const isProtectedRoute = !config.url?.includes("/authenticate");

  if (token && isProtectedRoute) {
    console.log("🔐 Enviando token en header");
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});



export default api;
