import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutActions = ({ finalAmount, onSubmit, isLoading, agreePrivacy }) => {
  return (
    <div className="checkout-actions">
      <Link to="/cart" className="btn-secondary">
        장바구니로 돌아가기
      </Link>
      <button 
        type="submit" 
        className="btn-primary"
        onClick={onSubmit}
        disabled={isLoading || !agreePrivacy}
      >
        {isLoading ? '결제 중...' : `${finalAmount.toLocaleString()}원 결제하기`}
      </button>
    </div>
  );
};

export default CheckoutActions;
