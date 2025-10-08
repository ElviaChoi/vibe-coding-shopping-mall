import React from 'react';
import { Link } from 'react-router-dom';

const CartSummary = ({ totalAmount, itemCount, onCheckout }) => {
  const shippingFee = totalAmount >= 30000 ? 0 : 2000;
  const finalAmount = totalAmount + shippingFee;

  return (
    <div className="cart-summary">
      <h3>주문 요약</h3>
      <div className="summary-details">
        <div className="summary-row">
          <span>상품 수량</span>
          <span>{itemCount}개</span>
        </div>
        <div className="summary-row">
          <span>상품 금액</span>
          <span>{totalAmount.toLocaleString()}원</span>
        </div>
        <div className="summary-row">
          <span>배송비</span>
          <span>
            {shippingFee === 0 ? '무료' : `${shippingFee.toLocaleString()}원`}
            {totalAmount < 30000 && (
              <small className="shipping-note">
                {' '}(3만원 이상 구매시 무료배송)
              </small>
            )}
          </span>
        </div>
        <div className="summary-row total">
          <span>총 결제 금액</span>
          <span className="total-amount">{finalAmount.toLocaleString()}원</span>
        </div>
      </div>
      
      <div className="cart-actions">
        <Link to="/" className="btn-secondary">
          쇼핑 계속하기
        </Link>
        <button 
          type="button" 
          className="btn-primary"
          onClick={onCheckout}
          disabled={itemCount === 0}
        >
          주문하기
        </button>
      </div>
    </div>
  );
};

export default CartSummary;
