import React from 'react';

const OrderItemsList = ({ items }) => {
  return (
    <div className="order-items-list">
      <h3>주문 상품</h3>
      <div className="items-container">
        {items.map((item, index) => (
          <div key={index} className="order-item">
            <div className="item-image">
              {item.product.images?.[0] && (
                <img src={item.product.images[0].url} alt={item.product.name} />
              )}
            </div>
            <div className="item-info">
              <h4 className="item-name">{item.product.name}</h4>
              <div className="item-details">
                <span className="item-size">사이즈: {item.size}</span>
                <span className="item-quantity">수량: {item.quantity}개</span>
              </div>
              <div className="item-price">
                {item.product.price.toLocaleString()}원
              </div>
            </div>
            <div className="item-total">
              {(item.product.price * item.quantity).toLocaleString()}원
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderItemsList;
