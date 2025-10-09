import React from 'react';
import { getStatusLabel } from '../../utils/orderUtils';

const OrderListCard = ({ order, onOrderClick }) => {
  console.log('OrderListCard order data:', order);
  console.log('OrderListCard totalAmount:', order?.totalAmount);
  console.log('OrderListCard payment:', order?.payment);
  
  // order가 없거나 필수 필드가 없는 경우 처리
  if (!order) {
    console.error('OrderListCard: order is null or undefined');
    return <div className="order-card error">주문 정보를 불러올 수 없습니다.</div>;
  }

  if (!order.items || !Array.isArray(order.items)) {
    console.error('OrderListCard: order.items is not an array:', order.items);
    return <div className="order-card error">주문 상품 정보가 없습니다.</div>;
  }
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getTotalItems = (items) => {
    return items?.reduce((total, item) => total + (item.quantity || 0), 0) || 0;
  };

  const getTotalAmount = (order) => {
    // payment 객체에서 총액 가져오기
    if (order.payment?.finalAmount) {
      return order.payment.finalAmount;
    }
    if (order.payment?.totalAmount) {
      return order.payment.totalAmount;
    }
    if (order.totalAmount) {
      return order.totalAmount;
    }
    // items에서 계산
    if (order.items) {
      return order.items.reduce((total, item) => {
        const itemPrice = item.product?.price || 0;
        const quantity = item.quantity || 0;
        return total + (itemPrice * quantity);
      }, 0);
    }
    return 0;
  };

  return (
    <div className="order-card" onClick={() => onOrderClick(order)}>
      {/* 주문 헤더 */}
      <div className="order-header">
        <div className="order-info">
          <h3 className="order-number">{order.orderNumber}</h3>
          <span className="order-date">{formatDate(order.createdAt)}</span>
        </div>
        <div className="order-status">
          <span className={`status-badge status-${order.status}`}>
            {getStatusLabel(order.status)}
          </span>
        </div>
      </div>
      
      {/* 구분선 */}
      <div className="divider"></div>
      
      {/* 첫 번째 상품만 표시 */}
      <div className="order-item">
        <div className="item-image">
          {order.items?.[0]?.product?.images?.[0] && (
            <img src={order.items[0].product.images[0].url} alt={order.items[0].product.name || '상품'} />
          )}
        </div>
        <div className="item-info">
          <span className="item-name">{order.items?.[0]?.product?.name || '상품명'}</span>
          <span className="item-details">{order.items?.[0]?.size} / {order.items?.[0]?.quantity}개</span>
        </div>
      </div>
      
      {/* 구분선 */}
      <div className="divider"></div>
      
      {/* 주문 요약 및 버튼 */}
      <div className="order-footer">
        <div className="order-summary">
          <span className="total-label">총 결제 금액</span>
          <span className="total-amount">₩{getTotalAmount(order).toLocaleString()}</span>
        </div>
        <button className="btn-view-detail" onClick={(e) => {
          e.stopPropagation();
          onOrderClick(order);
        }}>
          주문 상세보기 →
        </button>
      </div>
    </div>
  );
};

export default OrderListCard;
