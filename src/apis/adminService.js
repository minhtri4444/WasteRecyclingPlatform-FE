import axiosInstance from "./axiosInstance";

const adminService = {
  // User management
  getUsers: (params = {}) => axiosInstance.get("/Admin/users", { params }),
  updateUserStatus: (userId, data) =>
    axiosInstance.put(`/Admin/users/${userId}/status`, data),

  // Dashboard stats
  getStats: () => axiosInstance.get("/Admin/stats"),

  // Feedbacks
  getFeedbacks: (params = {}) => axiosInstance.get("/Admin/feedbacks", { params }),
  updateFeedback: (feedbackId, data) =>
    axiosInstance.put(`/Admin/feedbacks/${feedbackId}`, data),

  // Reports
  getReports: (params = {}) => axiosInstance.get("/Admin/reports", { params }),

  // Service areas
  getServiceAreas: (params = {}) => axiosInstance.get("/Admin/service-areas", { params }),
  createServiceArea: (data) => axiosInstance.post("/Admin/service-areas", data),

  // Waste types
  getWasteTypes: (params = {}) => axiosInstance.get("/Admin/waste-types", { params }),
};

export default adminService;
