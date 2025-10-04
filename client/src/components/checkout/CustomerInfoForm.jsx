import React from 'react';

const CustomerInfoForm = ({ customer, onCustomerChange }) => {
  const handleChange = (field, value) => {
    onCustomerChange({ ...customer, [field]: value });
  };

  return (
    <section className="checkout-section">
      <h2 className="section-title">주문자 정보</h2>
      <div className="form-grid">
        <div className="form-group">
          <label>이름 *</label>
          <input
            type="text"
            value={customer.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="홍길동"
            required
          />
        </div>
        <div className="form-group">
          <label>이메일 *</label>
          <input
            type="email"
            value={customer.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="example@email.com"
            required
          />
        </div>
        <div className="form-group">
          <label>전화번호 *</label>
          <input
            type="tel"
            value={customer.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="010-1234-5678"
            required
          />
        </div>
      </div>
    </section>
  );
};

export default CustomerInfoForm;
