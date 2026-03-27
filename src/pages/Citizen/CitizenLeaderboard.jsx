import React, { useEffect, useState } from 'react';
import axiosInstance from '../../apis/axiosInstance';

const CitizenLeaderboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/citizen/leaderboard');
      setData(res.data);
    } catch (err) {
      // Xử lý lỗi nếu cần
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Bảng xếp hạng</h2>
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <table className="w-full border rounded bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-3">#</th>
              <th className="py-2 px-3 text-left">Tên</th>
              <th className="py-2 px-3 text-right">Điểm</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) && data.length === 0 ? (
              <tr><td colSpan={3} className="text-center py-4">Chưa có dữ liệu</td></tr>
            ) : (
              (Array.isArray(data) ? data : []).map((item, idx) => (
                <tr key={item.id} className="border-t">
                  <td className="py-2 px-3 text-center">{idx + 1}</td>
                  <td className="py-2 px-3">{item.name}</td>
                  <td className="py-2 px-3 text-right">{item.points}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CitizenLeaderboard;
