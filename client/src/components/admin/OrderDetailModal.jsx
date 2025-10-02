import React from 'react';
import Modal from '../common/Modal';
import { getStatusInfo } from '../../utils/orderUtils';

const OrderDetailModal = ({ 
  order, 
  isOpen, 
  onClose, 
  onStatusUpdate 
}) => {

  if (!order) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="주문 상세 정보"
      size="large"
    >
      <div className="order-number">{order.orderNumber}</div>
      
      <div className="modal-section">
        <h3>주문자 정보</h3>
        <div className="info-grid">
          <div className="info-row">
            <span className="label">이름 :</span>
            <span className="value">{order.customer?.name}</span>
          </div>
          <div className="info-row">
            <span className="label">이메일 :</span>
            <span className="value">{order.customer?.email}</span>
          </div>
          <div className="info-row">
            <span className="label">전화번호 :</span>
            <span className="value">{order.customer?.phone}</span>
          </div>
        </div>
      </div>

      <div className="modal-section">
        <h3>배송 정보</h3>
        <div className="info-grid">
          <div className="info-row">
            <span className="label">수령인 :</span>
            <span className="value">{order.shipping?.recipient}</span>
          </div>
          <div className="info-row">
            <span className="label">연락처 :</span>
            <span className="value">{order.shipping?.phone}</span>
          </div>
          <div className="info-row full">
            <span className="label">주소 :</span>
            <span className="value">
              {order.shipping?.address?.postalCode} {order.shipping?.address?.mainAddress} {order.shipping?.address?.detailAddress}
            </span>
          </div>
        </div>
      </div>

      <div className="modal-section">
        <h3>주문 상품</h3>
        <div className="order-items">
          {order.items?.map((item, index) => (
            <div key={index} className="order-item">
              <div className="item-image">
                <img src={item.product?.images?.[0]?.url || '/placeholder.jpg'} alt={item.product?.name} />
              </div>
              <div className="item-details">
                <h4>{item.product?.name}</h4>
                <p>사이즈: {item.size} | 수량: {item.quantity}개</p>
              </div>
              <div className="item-price">
                ₩ {item.product?.price?.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="modal-section">
        <h3>결제 정보</h3>
        <div className="payment-info">
          <div className="payment-row">
            <span className="label">상품 금액 :</span>
            <span className="value">₩ {order.payment?.itemsTotal?.toLocaleString()}</span>
          </div>
          <div className="payment-row">
            <span className="label">배송비 :</span>
            <span className="value">₩ {order.payment?.shippingFee?.toLocaleString() || '0'}</span>
          </div>
          <div className="payment-row total">
            <span className="label">총 결제 금액 :</span>
            <span className="value">₩ {order.payment?.finalAmount?.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="modal-section">
        <h3>주문 상태 변경</h3>
        <div className="status-change">
          <div className="current-status">
            현재 상태: <strong>{getStatusInfo(order.status).text}</strong>
          </div>
          <div className="status-buttons">
            {['pending', 'paid', 'preparing', 'shipping', 'delivered', 'cancelled', 'refunded'].map(status => (
              <button 
                key={status}
                className={`status-btn ${order.status === status ? 'active' : ''}`}
                onClick={() => onStatusUpdate(order._id, status)}
              >
                {getStatusInfo(status).text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default OrderDetailModal;
