import React from 'react';
import { getStatusLabel } from '../../utils/orderUtils';

const OrderListCard = ({ order, onOrderClick }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getTotalItems = (items) => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="order-card" onClick={() => onOrderClick(order)}>
      <div className="order-header">
        <div className="order-info">
          <h3 className="order-number">주문번호: {order.orderNumber}</h3>
          <span className="order-date">{formatDate(order.createdAt)}</span>
        </div>
        <div className="order-status">
          <span className={`status-badge status-${order.status}`}>
            {getStatusLabel(order.status)}
          </span>
        </div>
      </div>
      
      <div className="order-items-preview">
        {order.items.slice(0, 3).map((item, index) => (
          <div key={index} className="preview-item">
            <div className="preview-image">
              {item.product.images?.[0] && (
                <img src={item.product.images[0].url} alt={item.product.name} />
              )}
            </div>
            <div className="preview-info">
              <span className="preview-name">{item.product.name}</span>
              <span className="preview-option">사이즈: {item.size} / 수량: {item.quantity}</span>
            </div>
          </div>
        ))}
        {order.items.length > 3 && (
          <div className="more-items">
            +{order.items.length - 3}개 더보기
          </div>
        )}
      </div>
      
      <div className="order-footer">
        <div className="order-total">
          총 {getTotalItems(order.items)}개 상품
        </div>
        <div className="order-amount">
          {order.totalAmount.toLocaleString()}원
        </div>
      </div>
    </div>
  );
};

export default OrderListCard;
