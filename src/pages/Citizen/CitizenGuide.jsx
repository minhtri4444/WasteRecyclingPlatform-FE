import React from 'react';

const CitizenGuide = () => {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Hướng dẫn phân loại rác</h2>
      <div className="bg-white rounded shadow p-4 space-y-2">
        <div>
          <b>Rác hữu cơ:</b> Thức ăn thừa, rau củ quả, lá cây...
        </div>
        <div>
          <b>Rác tái chế:</b> Giấy, nhựa, kim loại, thủy tinh sạch...
        </div>
        <div>
          <b>Rác nguy hại:</b> Pin, bóng đèn, hóa chất, thiết bị điện tử hỏng...
        </div>
        <div>
          <b>Rác còn lại:</b> Không thuộc các nhóm trên.
        </div>
      </div>
    </div>
  );
};

export default CitizenGuide;
