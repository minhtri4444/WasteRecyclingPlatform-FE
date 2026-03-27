import React from 'react';

const CitizenDashboard = () => {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Chào mừng bạn đến với WasteCycle!</h2>
      <div className="bg-white rounded shadow p-4">
        <p>Hệ thống giúp bạn báo cáo rác thải, theo dõi trạng thái xử lý, nhận phần thưởng và tham gia cộng đồng xanh.</p>
        <ul className="list-disc ml-6 mt-2 text-gray-700">
          <li>Báo cáo rác thải nhanh chóng, dễ dàng</li>
          <li>Xem bảng xếp hạng, nhận phần thưởng hấp dẫn</li>
          <li>Hỗ trợ, hướng dẫn phân loại rác chi tiết</li>
        </ul>
      </div>
    </div>
  );
};

export default CitizenDashboard;
