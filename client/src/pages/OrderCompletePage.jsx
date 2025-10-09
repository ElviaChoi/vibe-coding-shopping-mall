import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import useAuth from '../hooks/useAuth';
import { useCart } from '../contexts/CartContext';
import '../styles/pages/OrderCompletePage.css';

function OrderCompletePage() {
  const { user, loading: authLoading, logout } = useAuth();
  const { refreshCartCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const { order, paymentInfo } = location.state || {};

  useEffect(() => {
    if (order) {
      refreshCartCount();
    }
  }, [order]);

  useEffect(() => {
    if (!order) {
      navigate('/', { replace: true });
    }
  }, [order, navigate]);

  if (!order) {
    return null;
  }

  return (
    <div className="App">
      <Navbar user={user} loading={authLoading} onLogout={logout} />
      <div className="order-complete-page">
        <div className="order-complete-container">
          <div className="complete-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h1 className="complete-title">주문이 완료되었습니다!</h1>
          <p className="complete-message">
            주문번호: <strong>{order.orderNumber}</strong>
          </p>

          <section className="complete-section">
            <h2 className="section-title">주문 정보</h2>
            <div className="info-grid">
              <div className="info-row">
                <span className="info-label">주문자</span>
                <span className="info-value">{order.customer.name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">이메일</span>
                <span className="info-value">{order.customer.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">전화번호</span>
                <span className="info-value">{order.customer.phone}</span>
              </div>
            </div>
          </section>

          <section className="complete-section">
            <h2 className="section-title">배송 정보</h2>
            <div className="info-grid">
              <div className="info-row">
                <span className="info-label">수령인</span>
                <span className="info-value">{order.shipping.recipient}</span>
              </div>
              <div className="info-row">
                <span className="info-label">전화번호</span>
                <span className="info-value">{order.shipping.phone}</span>
              </div>
              <div className="info-row full">
                <span className="info-label">배송 주소</span>
                <span className="info-value">
                  [{order.shipping.address.postalCode}] {order.shipping.address.mainAddress} {order.shipping.address.detailAddress}
                </span>
              </div>
              {order.shipping.message && (
                <div className="info-row full">
                  <span className="info-label">배송 메시지</span>
                  <span className="info-value">{order.shipping.message}</span>
                </div>
              )}
            </div>
          </section>

          <section className="complete-section">
            <h2 className="section-title">주문 상품</h2>
            <div className="order-items">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="order-item-image">
                    {item.product?.images?.[0] && (
                      <img src={item.product.images[0].url} alt={item.product.name} />
                    )}
                  </div>
                  <div className="order-item-info">
                    <h3>{item.product?.name || '상품명'}</h3>
                    <p className="order-item-option">
                      사이즈: {item.size} / 수량: {item.quantity}개
                    </p>
                  </div>
                  <div className="order-item-price">
                    {((item.product?.price || 0) * item.quantity).toLocaleString()}원
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="complete-section">
            <h2 className="section-title">결제 정보</h2>
            <div className="payment-summary">
              <div className="summary-row">
                <span>총 상품 금액</span>
                <span>{order.payment.itemsTotal.toLocaleString()}원</span>
              </div>
              <div className="summary-row">
                <span>배송비</span>
                <span>{order.payment.shippingFee === 0 ? '무료' : `${order.payment.shippingFee.toLocaleString()}원`}</span>
              </div>
              <div className="summary-row total">
                <span>최종 결제 금액</span>
                <span className="total-amount">{order.payment.finalAmount.toLocaleString()}원</span>
              </div>
              <div className="summary-row">
                <span>결제 수단</span>
                <span>
                  {order.payment.method === 'credit_card' && '신용카드'}
                  {order.payment.method === 'bank_transfer' && '계좌이체'}
                  {order.payment.method === 'kakao_pay' && '카카오페이'}
                  {order.payment.method === 'toss' && '토스페이'}
                </span>
              </div>
              {paymentInfo && (
                <div className="summary-row">
                  <span>결제 승인번호</span>
                  <span className="small-text">{paymentInfo.imp_uid}</span>
                </div>
              )}
            </div>
          </section>

          <div className="notice-box">
            <h3>안내사항</h3>
            <ul>
              <li>주문 내역은 마이페이지에서 확인하실 수 있습니다.</li>
              <li>배송은 영업일 기준 2-3일 소요됩니다.</li>
              <li>배송 관련 문의사항은 고객센터로 연락 주시기 바랍니다.</li>
            </ul>
          </div>

          <div className="complete-actions">
            <Link to="/" className="btn-secondary">
              홈으로 이동
            </Link>
            <button 
              className="btn-primary"
              onClick={() => navigate('/orders', { state: { refresh: Date.now() } })}
            >
              주문 내역 보기
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default OrderCompletePage;
