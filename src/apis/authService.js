import axiosInstance from "./axiosInstance";

const authService = {
  // Đăng nhập: truyền { email, password }
  login: (data) => axiosInstance.post("/Auth/login", data),

  // Đăng ký Citizen: { fullName, email, password, phone, role: "Citizen" }
  registerCitizen: (data) => axiosInstance.post("/Auth/register", data),

  // Đăng ký Enterprise: { ..., companyName, address, companyDescription }
  registerEnterprise: (data) => axiosInstance.post("/Auth/register/enterprise", data),

  // Đăng ký Collector: { ..., enterpriseId }
  registerCollector: (data) => axiosInstance.post("/Auth/register/collector", data),
};

export default authService;