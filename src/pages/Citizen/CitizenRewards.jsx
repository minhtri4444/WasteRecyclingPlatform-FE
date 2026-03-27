import React, { useEffect, useState } from 'react';
import axiosInstance from '../../apis/axiosInstance';

const CitizenRewards = () => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/citizen/rewards');
      setRewards(res.data);
    } catch (err) {
      // Xử lý lỗi nếu cần
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Phần thưởng</h2>
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <div className="space-y-4">
          {Array.isArray(rewards) && rewards.length === 0 ? (
            <div>Chưa có phần thưởng nào.</div>
          ) : (
            (Array.isArray(rewards) ? rewards : []).map((reward) => (
              <div key={reward.id} className="border rounded p-3 bg-white flex items-center justify-between">
                <div>
                  <div className="font-semibold">{reward.title}</div>
                  <div className="text-sm text-gray-600">{reward.description}</div>
                </div>
                <div className="text-green-600 font-bold">{reward.points} điểm</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CitizenRewards;
