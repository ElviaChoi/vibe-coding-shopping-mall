import React from 'react';

const PaymentSummary = ({ totalAmount, shippingFee, finalAmount, agreePrivacy, onAgreePrivacyChange }) => {
  return (
    <>
      <section className="checkout-section">
        <h2 className="section-title">결제 금액</h2>
        <div className="payment-summary">
          <div className="summary-row">
            <span>총 상품 금액</span>
            <span>{totalAmount.toLocaleString()}원</span>
          </div>
          <div className="summary-row">
            <span>배송비</span>
            <span>{shippingFee === 0 ? '무료' : `${shippingFee.toLocaleString()}원`}</span>
          </div>
          <div className="summary-row total">
            <span>최종 결제 금액</span>
            <span className="total-amount">{finalAmount.toLocaleString()}원</span>
          </div>
        </div>
      </section>

      <section className="checkout-section">
        <div className="agreement">
          <label className="agreement-checkbox">
            <input
              type="checkbox"
              checked={agreePrivacy}
              onChange={(e) => onAgreePrivacyChange(e.target.checked)}
            />
            <span>개인정보 수집 및 이용에 동의합니다 (필수)</span>
          </label>
        </div>
      </section>
    </>
  );
};

export default PaymentSummary;
