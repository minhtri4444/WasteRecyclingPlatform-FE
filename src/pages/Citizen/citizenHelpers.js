export const formatReportStatus = (status) => {
  switch (status) {
    case 'pending':
      return 'Đang chờ xử lý';
    case 'in_progress':
      return 'Đang xử lý';
    case 'resolved':
      return 'Đã xử lý';
    default:
      return 'Không xác định';
  }
};

// Thêm các helper khác nếu cần
