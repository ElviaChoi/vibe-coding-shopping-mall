import React from 'react';

const ShippingInfoForm = ({ shipping, onShippingChange, onAddressSearch }) => {
  const handleChange = (field, value) => {
    onShippingChange({ ...shipping, [field]: value });
  };

  return (
    <section className="checkout-section">
      <h2 className="section-title">배송지 정보</h2>
      <div className="form-group">
        <label>수령인 *</label>
        <input
          type="text"
          value={shipping.recipient}
          onChange={(e) => handleChange('recipient', e.target.value)}
          placeholder="홍길동"
          required
        />
      </div>
      <div className="form-group">
        <label>전화번호 *</label>
        <input
          type="tel"
          value={shipping.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="010-1234-5678"
          required
        />
      </div>
      <div className="form-group">
        <label>우편번호 *</label>
        <div className="address-search">
          <input
            type="text"
            value={shipping.postalCode}
            onChange={(e) => handleChange('postalCode', e.target.value)}
            placeholder="12345"
            required
          />
          <button type="button" onClick={onAddressSearch} className="btn-search">
            우편번호 검색
          </button>
        </div>
      </div>
      <div className="form-group">
        <label>주소 *</label>
        <input
          type="text"
          value={shipping.mainAddress}
          onChange={(e) => handleChange('mainAddress', e.target.value)}
          placeholder="서울시 강남구 테헤란로 123"
          required
        />
      </div>
      <div className="form-group">
        <label>상세주소</label>
        <input
          type="text"
          value={shipping.detailAddress}
          onChange={(e) => handleChange('detailAddress', e.target.value)}
          placeholder="101동 101호"
        />
      </div>
      <div className="form-group">
        <label>배송 메시지</label>
        <input
          type="text"
          value={shipping.message}
          onChange={(e) => handleChange('message', e.target.value)}
          placeholder="문 앞에 놔주세요"
          maxLength={200}
        />
      </div>
    </section>
  );
};

export default ShippingInfoForm;
