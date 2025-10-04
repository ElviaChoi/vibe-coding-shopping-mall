import React from 'react';

const PaymentMethodSelector = ({ paymentMethod, onPaymentMethodChange }) => {
  const paymentMethods = [
    { value: 'credit_card', label: '신용카드' },
    { value: 'bank_transfer', label: '계좌이체' },
    { value: 'kakao_pay', label: '카카오페이' },
    { value: 'toss', label: '토스페이' }
  ];

  return (
    <section className="checkout-section">
      <h2 className="section-title">결제 수단</h2>
      <div className="payment-methods">
        {paymentMethods.map((method) => (
          <label key={method.value} className="payment-method">
            <input
              type="radio"
              name="payment"
              value={method.value}
              checked={paymentMethod === method.value}
              onChange={(e) => onPaymentMethodChange(e.target.value)}
            />
            <span>{method.label}</span>
          </label>
        ))}
      </div>
    </section>
  );
};

export default PaymentMethodSelector;
