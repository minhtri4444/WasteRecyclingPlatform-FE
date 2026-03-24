import axios from "axios";

// 1. Khởi tạo instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// 2. Interceptor cho Request: Tự động đính kèm Token (An toàn)
axiosInstance.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (error) {
        console.error("Lỗi đọc token từ localStorage:", error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Interceptor cho Response: Trả về thẳng data
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;