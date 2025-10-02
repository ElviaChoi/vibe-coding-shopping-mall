import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import useAuth from '../hooks/useAuth';
import '../styles/pages/OrderFailPage.css';

function OrderFailPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { errorMessage, cartItems } = location.state || {};

  return (
    <div className="App">
      <Navbar user={user} loading={authLoading} onLogout={logout} />
      <div className="order-fail-page">
        <div className="order-fail-container">
          {/* 실패 아이콘 */}
          <div className="fail-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2" strokeLinecap="round" />
              <path d="M15 9l-6 6M9 9l6 6" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          <h1 className="fail-title">주문에 실패했습니다</h1>
          <p className="fail-message">
            {errorMessage || '결제 처리 중 문제가 발생했습니다.'}
          </p>

          {/* 안내 사항 */}
          <div className="fail-notice-box">
            <h3>안내사항</h3>
            <ul>
              <li>주문이 생성되지 않았으며, 결제도 진행되지 않았습니다.</li>
              <li>장바구니의 상품은 그대로 유지되어 있습니다.</li>
              <li>다시 주문을 진행하시려면 아래 버튼을 클릭해주세요.</li>
              <li>문제가 계속 발생하는 경우 고객센터로 문의해주세요.</li>
            </ul>
          </div>

          {/* 실패 상세 정보 (있는 경우) */}
          {errorMessage && (
            <div className="fail-details">
              <p className="details-label">실패 사유</p>
              <p className="details-content">{errorMessage}</p>
            </div>
          )}

          {/* 버튼 */}
          <div className="fail-actions">
            <Link to="/" className="btn-secondary">
              홈으로 이동
            </Link>
            {cartItems && cartItems.length > 0 ? (
              <button 
                onClick={() => navigate('/checkout', { 
                  state: { 
                    cartItems, 
                    totalAmount: cartItems.reduce((sum, item) => 
                      sum + (item.product.price * item.quantity), 0
                    )
                  } 
                })}
                className="btn-primary"
              >
                다시 주문하기
              </button>
            ) : (
              <Link to="/cart" className="btn-primary">
                장바구니로 이동
              </Link>
            )}
          </div>

          {/* 문의 정보 */}
          <div className="fail-contact">
            <p>문의사항이 있으시면 고객센터로 연락주세요.</p>
            <p className="contact-info">📞 1234-5678 | 📧 support@example.com</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default OrderFailPage;

