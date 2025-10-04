import React from 'react';

const OrderItemsList = ({ cartItems }) => {
  return (
    <section className="checkout-section">
      <h2 className="section-title">주문 상품</h2>
      <div className="order-items">
        {cartItems.map((item) => (
          <div key={`${item.product._id}-${item.size}`} className="order-item">
            <div className="order-item-image">
              {item.product.images?.[0] && (
                <img src={item.product.images[0].url} alt={item.product.name} />
              )}
            </div>
            <div className="order-item-info">
              <h3>{item.product.name}</h3>
              <p className="order-item-option">
                사이즈: {item.size} / 수량: {item.quantity}개
              </p>
            </div>
            <div className="order-item-price">
              {(item.product.price * item.quantity).toLocaleString()}원
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OrderItemsList;
