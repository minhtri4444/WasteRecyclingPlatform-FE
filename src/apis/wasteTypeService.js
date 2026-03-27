// Lấy danh sách loại rác thải cho Citizen
import axiosInstance from './axiosInstance';

export const getWasteTypes = async () => {
  return axiosInstance.get('/admin/waste-types');
};
