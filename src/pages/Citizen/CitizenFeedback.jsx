import React, { useState } from 'react';
import axiosInstance from '../../apis/axiosInstance';

const CitizenFeedback = ({ reportId, onFeedbackSent }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await axiosInstance.post('/citizen/feedbacks', {
        reportId,
        content,
      });
      setMessage('Gửi phản hồi thành công!');
      setContent('');
      if (onFeedbackSent) onFeedbackSent();
    } catch (err) {
      setMessage('Gửi phản hồi thất bại.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded p-4 mt-4">
      <label className="block mb-1 font-medium">Phản hồi</label>
      <textarea
        className="w-full border rounded px-3 py-2 mb-2"
        value={content}
        onChange={e => setContent(e.target.value)}
        required
        placeholder="Nhập phản hồi của bạn..."
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Đang gửi...' : 'Gửi phản hồi'}
      </button>
      {message && <div className="mt-2 text-sm text-green-600">{message}</div>}
    </form>
  );
};

export default CitizenFeedback;
