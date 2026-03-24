import axiosInstance from "./axiosInstance";

const enterpriseService = {
  // Capacities
  getCapacities: (params = {}) => axiosInstance.get("/Enterprise/capacities", { params }),
  createCapacity: (data) => axiosInstance.post("/Enterprise/capacities", data),
  updateCapacity: (capacityId, data) =>
    axiosInstance.put(`/Enterprise/capacities/${capacityId}`, data),
  deleteCapacity: (capacityId) => axiosInstance.delete(`/Enterprise/capacities/${capacityId}`),

  // Pending reports
  getPendingReports: (params = {}) =>
    axiosInstance.get("/Enterprise/reports/pending", { params }),
  acceptReport: (reportId) => axiosInstance.post(`/Enterprise/reports/${reportId}/accept`),
  rejectReport: (reportId) => axiosInstance.post(`/Enterprise/reports/${reportId}/reject`),

  // Assignments
  getAssignments: (params = {}) => axiosInstance.get("/Enterprise/assignments", { params }),
  createAssignment: (data) => axiosInstance.post("/Enterprise/assignments", data),

  // Stats
  getStats: (params = {}) => axiosInstance.get("/Enterprise/stats", { params }),

  // Reward rules
  getRewardRules: (params = {}) => axiosInstance.get("/Enterprise/reward-rules", { params }),
  createRewardRule: (data) => axiosInstance.post("/Enterprise/reward-rules", data),
  updateRewardRule: (ruleId, data) =>
    axiosInstance.put(`/Enterprise/reward-rules/${ruleId}`, data),
  deleteRewardRule: (ruleId) => axiosInstance.delete(`/Enterprise/reward-rules/${ruleId}`),

  // Collectors
  getCollectors: (params = {}) => axiosInstance.get("/Enterprise/collectors", { params }),
};

export default enterpriseService;
