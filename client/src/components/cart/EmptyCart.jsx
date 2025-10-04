import React from 'react';
import { Link } from 'react-router-dom';

const EmptyCart = () => {
  return (
    <div className="empty-cart">
      <div className="empty-cart-content">
        <div className="empty-cart-icon">
          🛒
        </div>
        <h2>장바구니가 비어있습니다</h2>
        <p>원하는 상품을 장바구니에 담아보세요!</p>
        <Link to="/" className="btn-primary">
          쇼핑하러 가기
        </Link>
      </div>
    </div>
  );
};

export default EmptyCart;
