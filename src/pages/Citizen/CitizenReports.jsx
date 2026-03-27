
import React, { useEffect, useState } from 'react';
import { createReport, getReports } from '../../apis/citizenService';
import { formatReportStatus } from './citizenHelpers';
import LocationPicker from '../../components/LocationPicker';


const CitizenReports = () => {
  const [reports, setReports] = useState([]);
  const wasteTypes = [
    { wasteTypeId: 1, name: "Organic" },
    { wasteTypeId: 2, name: "Recyclable" },
    { wasteTypeId: 3, name: "Hazardous" },
    { wasteTypeId: 4, name: "Electronic" },
    { wasteTypeId: 5, name: "Plastic" }
  ];
  const [form, setForm] = useState({
    wasteTypeId: '',
    description: '',
    image: null,
    latitude: '',
    longitude: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await getReports();
      setReports(res.data);
    } catch (err) {
      setMessage('Không thể tải danh sách báo cáo.');
    }
    setLoading(false);
  };


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const data = {
        wasteTypeId: Number(form.wasteTypeId),
        description: form.description,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        imageUrl: '', // sẽ cập nhật nếu có upload ảnh
      };
      let response;
      if (form.image) {
        const formData = new FormData();
        formData.append('wasteTypeId', data.wasteTypeId);
        formData.append('description', data.description);
        formData.append('latitude', data.latitude);
        formData.append('longitude', data.longitude);
        formData.append('image', form.image);
        console.log('Payload gửi đi (FormData):');
        for (let pair of formData.entries()) {
          console.log(pair[0]+ ':', pair[1]);
        }
        response = await createReport(formData);
      } else {
        console.log('Payload gửi đi:', data);
        response = await createReport(data);
      }
      console.log('Response trả về:', response?.data);
      setMessage('Gửi báo cáo thành công!');
      setForm({ wasteTypeId: '', description: '', image: null, latitude: '', longitude: '' });
      fetchReports();
    } catch (err) {
      setMessage('Gửi báo cáo thất bại.');
      console.log('Lỗi gửi báo cáo:', err);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Báo cáo rác thải</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded p-4 mb-8">
        <div className="mb-4">
          <label className="block mb-1 font-medium">Loại rác thải</label>
          <select
            name="wasteTypeId"
            value={form.wasteTypeId}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">-- Chọn loại rác --</option>
            {wasteTypes.map((type, idx) => (
              <option key={type.wasteTypeId} value={type.wasteTypeId}>{idx + 1}. {type.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Mô tả</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Chọn vị trí trên bản đồ (click để chọn)</label>
          <LocationPicker
            latitude={form.latitude}
            longitude={form.longitude}
            onChange={({ latitude, longitude }) => setForm(f => ({ ...f, latitude, longitude }))}
          />
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 font-medium">Vĩ độ (latitude)</label>
              <input
                type="number"
                name="latitude"
                value={form.latitude}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                step="any"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-medium">Kinh độ (longitude)</label>
              <input
                type="number"
                name="longitude"
                value={form.longitude}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                step="any"
                required
              />
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Hình ảnh (tùy chọn)</label>
          <input type="file" name="image" accept="image/*" onChange={handleChange} />
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          disabled={loading}
        >
          {loading ? 'Đang gửi...' : 'Gửi báo cáo'}
        </button>
        {message && <div className="mt-2 text-sm text-red-600">{message}</div>}
      </form>

      <h3 className="text-xl font-semibold mb-2">Lịch sử báo cáo</h3>
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <div className="space-y-4">
          {Array.isArray(reports) && reports.length === 0 ? (
            <div>Chưa có báo cáo nào.</div>
          ) : (
            (Array.isArray(reports) ? reports : []).map((r) => (
              <div key={r.id} className="border rounded p-3 bg-gray-50">
                <div><b>Vị trí:</b> {r.location}</div>
                <div><b>Mô tả:</b> {r.description}</div>
                <div><b>Trạng thái:</b> {formatReportStatus(r.status)}</div>
                {r.imageUrl && (
                  <div className="mt-2">
                    <img src={r.imageUrl} alt="Ảnh báo cáo" className="max-h-40 rounded" />
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-1">{new Date(r.createdAt).toLocaleString()}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CitizenReports;
