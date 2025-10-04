import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import useAuth from '../hooks/useAuth';
import { orderAPI } from '../utils/api';
import { getStatusLabel } from '../utils/orderUtils';
import { OrderListCard, OrderStatusSteps, OrderItemsList } from '../components/order';
import OrderTabs from '../components/admin/OrderTabs';
import OrderDetailModal from '../components/admin/OrderDetailModal';
import '../styles/pages/OrderDetailPage.css';

function OrderDetailPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { state: { from: '/orders' } });
      return;
    }

    const fetchOrders = async () => {
      if (!user?._id) return;

      try {
        setLoading(true);
        const response = await orderAPI.getUserOrders(user._id);
        
        if (response.success) {
          setOrders(response.data);
        } else {
          setError('주문 내역을 불러올 수 없습니다.');
        }
      } catch (err) {
        console.error('주문 목록 조회 오류:', err);
        setError('주문 내역을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user, authLoading, navigate, location.state?.refresh]);

  if (loading || authLoading) {
    return (
      <div className="App">
        <Navbar user={user} loading={authLoading} onLogout={logout} />
        <div className="order-detail-loading">
          <p>주문 내역을 불러오는 중...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <Navbar user={user} loading={authLoading} onLogout={logout} />
        <div className="order-detail-error">
          <p>{error}</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            홈으로 이동
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // 선택된 주문의 상세 정보 모달
  const OrderDetailModal = ({ order, onClose }) => {
    const statusInfo = getStatusStep(order.status);

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>×</button>
          
          <div className="modal-header">
            <h2 className="order-number">{order.orderNumber}</h2>
            <div className="order-status-badge" data-status={order.status}>
              {statusInfo.label}
            </div>
          </div>

          {/* 주문 상태 단계 */}
          {order.status !== 'cancelled' && (
            <div className="order-status-steps">
              <div className={`status-step ${statusInfo.step >= 1 ? 'active' : ''}`}>
                <div className="step-circle">{statusInfo.step >= 1 ? '✓' : '1'}</div>
                <span className="step-label">배송준비중</span>
              </div>
              <div className={`step-line ${statusInfo.step >= 2 ? 'active' : ''}`}></div>
              <div className={`status-step ${statusInfo.step >= 2 ? 'active' : ''}`}>
                <div className="step-circle">{statusInfo.step >= 2 ? '✓' : '2'}</div>
                <span className="step-label">배송중</span>
              </div>
              <div className={`step-line ${statusInfo.step >= 3 ? 'active' : ''}`}></div>
              <div className={`status-step ${statusInfo.step >= 3 ? 'active' : ''}`}>
                <div className="step-circle">{statusInfo.step >= 3 ? '✓' : '3'}</div>
                <span className="step-label">배송완료</span>
              </div>
            </div>
          )}

          <div className="order-status-description">{statusInfo.description}</div>

          <section className="modal-section">
            <h3 className="order-section-title">주문 상품</h3>
            <div className="order-items-list">
              {order.items.map((item, index) => (
                <div key={index} className="order-item-card">
                  <div className="item-image">
                    {item.product?.images?.[0] && (
                      <img src={item.product.images[0].url} alt={item.product.name} />
                    )}
                  </div>
                  <div className="item-details">
                    <h3 className="item-name">{item.product?.name || '상품명'}</h3>
                    <p className="item-options">
                      사이즈: {item.size} | 수량: {item.quantity}
                    </p>
                  </div>
                  <div className="item-price">
                    ₩{((item.product?.price || 0) * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="modal-section">
            <h3 className="order-section-title">결제 정보</h3>
            <div className="payment-summary-box">
              <div className="payment-row">
                <span className="payment-label">상품 금액</span>
                <span className="payment-value">₩{order.payment.itemsTotal.toLocaleString()}</span>
              </div>
              <div className="payment-row">
                <span className="payment-label">배송비</span>
                <span className="payment-value">
                  {order.payment.shippingFee === 0 ? '무료' : `₩${order.payment.shippingFee.toLocaleString()}`}
                </span>
              </div>
              <div className="payment-row total">
                <span className="payment-label">총 결제 금액</span>
                <span className="payment-value">₩{order.payment.finalAmount.toLocaleString()}</span>
              </div>
            </div>
          </section>

          <section className="modal-section">
            <h3 className="order-section-title">배송지</h3>
            <div className="shipping-info-box">
              <div className="shipping-row">
                <span className="shipping-label">수령인</span>
                <span className="shipping-value">{order.shipping.recipient}</span>
              </div>
              <div className="shipping-row">
                <span className="shipping-label">연락처</span>
                <span className="shipping-value">{order.shipping.phone}</span>
              </div>
              <div className="shipping-row">
                <span className="shipping-label">주소</span>
                <span className="shipping-value">
                  [{order.shipping.address.postalCode}] {order.shipping.address.mainAddress} {order.shipping.address.detailAddress}
                </span>
              </div>
              {order.shipping.message && (
                <div className="shipping-row">
                  <span className="shipping-label">배송 메시지</span>
                  <span className="shipping-value">{order.shipping.message}</span>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    );
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'paid') return ['paid', 'preparing', 'pending'].includes(order.status);
    if (activeTab === 'shipped') return order.status === 'shipping';
    if (activeTab === 'delivered') return order.status === 'delivered';
    return true;
  });

  const getTabCount = (tab) => {
    if (tab === 'all') return orders.length;
    if (tab === 'paid') return orders.filter(o => ['paid', 'preparing', 'pending'].includes(o.status)).length;
    if (tab === 'shipped') return orders.filter(o => o.status === 'shipping').length;
    if (tab === 'delivered') return orders.filter(o => o.status === 'delivered').length;
    return 0;
  };

  return (
    <div className="App">
      <Navbar user={user} loading={authLoading} onLogout={logout} />
      <div className="order-detail-page">
        <div className="order-detail-container">
          <div className="order-header">
            <div>
              <h1 className="page-title">내 주문 목록</h1>
              <p className="page-subtitle">주문하신 상품의 배송 현황을 확인하실 수 있습니다.</p>
            </div>
          </div>

          {orders.length > 0 && (
            <OrderTabs 
              activeTab={activeTab}
              onTabChange={setActiveTab}
              getTabCount={getTabCount}
            />
          )}

          {filteredOrders.length === 0 ? (
            <div className="no-orders">
              <svg width="80" height="80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 7a2 2 0 01-2 2H8a2 2 0 01-2-2L5 9z" />
              </svg>
              <h2>{orders.length === 0 ? '주문 내역이 없습니다' : '해당 상태의 주문이 없습니다'}</h2>
              <p>{orders.length === 0 ? '첫 번째 주문을 시작해보세요!' : '다른 탭을 확인해주세요.'}</p>
              {orders.length === 0 && <Link to="/" className="btn-primary">쇼핑 시작하기</Link>}
            </div>
          ) : (
            <div className="orders-list">
              {filteredOrders.map((order) => (
                <OrderListCard
                  key={order._id}
                  order={order}
                  onOrderClick={setSelectedOrder}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />

      {selectedOrder && (
        <OrderDetailModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
    </div>
  );
}

export default OrderDetailPage;
