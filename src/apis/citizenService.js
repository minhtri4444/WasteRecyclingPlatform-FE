// citizenService.js
// Quản lý các API cho Citizen
import axiosInstance from './axiosInstance';

export const createReport = async (data) => {
  return axiosInstance.post('/citizen/reports', data);
};

export const getReports = async () => {
  return axiosInstance.get('/citizen/reports');
};

export const getReportDetail = async (id) => {
  return axiosInstance.get(`/citizen/reports/${id}`);
};

// Thêm các API khác nếu cần
