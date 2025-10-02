import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import useAuth from '../hooks/useAuth';
import { useCart } from '../contexts/CartContext';

function CheckoutPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const { refreshCartCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems = [], totalAmount = 0 } = location.state || {};

  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [shipping, setShipping] = useState({
    recipient: '',
    phone: '',
    postalCode: '',
    mainAddress: '',
    detailAddress: '',
    message: ''
  });

  useEffect(() => {
    const IMP = window.IMP;
    if (IMP) {
      IMP.init('imp72854618');
    } else {
      console.error('포트원 스크립트가 로드되지 않았습니다.');
    }
  }, []);

  useEffect(() => {
    if (user) {
      setCustomer({
        name: user.name || '',
        email: user.email || '',
        phone: ''
      });
      
      setShipping(prev => ({
        ...prev,
        recipient: user.name || ''
      }));
    }
  }, [user]);

  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const shippingFee = totalAmount >= 30000 ? 0 : 2000;
  const finalAmount = totalAmount + shippingFee;

  const handleAddressSearch = () => {
    alert('우편번호 검색 기능은 준비 중입니다.');
  };

  const handlePayment = () => {
    const IMP = window.IMP;
    
    const pgMap = {
      credit_card: 'html5_inicis',
      bank_transfer: 'html5_inicis.HPP',
      kakao_pay: 'kakaopay',
      toss: 'tosspay'
    };

    const payMethodMap = {
      credit_card: 'card',
      bank_transfer: 'trans',
      kakao_pay: 'card',
      toss: 'card'
    };

    const merchantUid = `order_${new Date().getTime()}`;

    IMP.request_pay({
      pg: pgMap[paymentMethod],
      pay_method: payMethodMap[paymentMethod],
      merchant_uid: merchantUid,
      name: cartItems.length > 1 
        ? `${cartItems[0].product.name} 외 ${cartItems.length - 1}건`
        : cartItems[0].product.name,
      amount: finalAmount,
      buyer_email: customer.email,
      buyer_name: customer.name,
      buyer_tel: customer.phone,
      buyer_addr: `${shipping.mainAddress} ${shipping.detailAddress}`,
      buyer_postcode: shipping.postalCode,
      m_redirect_url: `${window.location.origin}/order-complete`
    }, async (rsp) => {
      if (rsp.success) {
        try {
          const orderData = {
            userId: user?._id,
            customer: {
              name: customer.name,
              email: customer.email,
              phone: customer.phone
            },
            shipping: {
              recipient: shipping.recipient,
              phone: shipping.phone,
              address: {
                postalCode: shipping.postalCode,
                mainAddress: shipping.mainAddress,
                detailAddress: shipping.detailAddress || ''
              },
              message: shipping.message || ''
            },
            items: cartItems.map(item => ({
              product: item.product._id,
              size: item.size,
              quantity: item.quantity
            })),
            payment: {
              itemsTotal: totalAmount,
              shippingFee: shippingFee,
              finalAmount: finalAmount,
              method: paymentMethod,
              impUid: rsp.imp_uid,
              merchantUid: rsp.merchant_uid,
              paidAt: new Date()
            },
            clearCart: true
          };

          const response = await fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
          });

          const result = await response.json();

          if (result.success) {
            await refreshCartCount();
            
            navigate('/order-complete', { 
              state: { 
                order: result.data, 
                paymentInfo: rsp 
              } 
            });
          } else {
            navigate('/order-fail', {
              state: {
                errorMessage: result.message || '주문 저장에 실패했습니다.',
                cartItems: cartItems
              }
            });
          }
        } catch (error) {
          console.error('❌ 주문 저장 오류:', error);
          navigate('/order-fail', {
            state: {
              errorMessage: `서버 오류가 발생했습니다. ${error.message}`,
              cartItems: cartItems
            }
          });
        }
      } else {
        console.error('결제 실패:', rsp);
        navigate('/order-fail', {
          state: {
            errorMessage: rsp.error_msg || '결제에 실패했습니다.',
            cartItems: cartItems
          }
        });
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customer.name || !customer.email || !customer.phone) {
      alert('주문자 정보를 모두 입력해주세요.');
      return;
    }

    if (!shipping.recipient || !shipping.phone || !shipping.postalCode || !shipping.mainAddress) {
      alert('배송지 정보를 모두 입력해주세요.');
      return;
    }

    if (!agreePrivacy) {
      alert('개인정보 수집 및 이용에 동의해주세요.');
      return;
    }

    handlePayment();
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="App">
        <Navbar user={user} loading={authLoading} onLogout={logout} />
        <div className="checkout-page">
          <div className="checkout-container">
            <div className="empty-checkout">
              <h2>주문할 상품이 없습니다</h2>
              <p>장바구니에 상품을 추가해주세요.</p>
              <Link to="/cart" className="btn-primary">장바구니로 이동</Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="App">
      <Navbar user={user} loading={authLoading} onLogout={logout} />
      <div className="checkout-page">
        <div className="checkout-container">
          <h1 className="checkout-title">주문/결제</h1>

          <form onSubmit={handleSubmit}>
            <section className="checkout-section">
              <h2 className="section-title">주문자 정보</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>이름 *</label>
                  <input
                    type="text"
                    value={customer.name}
                    onChange={(e) => setCustomer({...customer, name: e.target.value})}
                    placeholder="홍길동"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>이메일 *</label>
                  <input
                    type="email"
                    value={customer.email}
                    onChange={(e) => setCustomer({...customer, email: e.target.value})}
                    placeholder="example@email.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>전화번호 *</label>
                  <input
                    type="tel"
                    value={customer.phone}
                    onChange={(e) => setCustomer({...customer, phone: e.target.value})}
                    placeholder="010-1234-5678"
                    required
                  />
                </div>
              </div>
            </section>

            <section className="checkout-section">
              <h2 className="section-title">배송지 정보</h2>
              <div className="form-group">
                <label>수령인 *</label>
                <input
                  type="text"
                  value={shipping.recipient}
                  onChange={(e) => setShipping({...shipping, recipient: e.target.value})}
                  placeholder="홍길동"
                  required
                />
              </div>
              <div className="form-group">
                <label>전화번호 *</label>
                <input
                  type="tel"
                  value={shipping.phone}
                  onChange={(e) => setShipping({...shipping, phone: e.target.value})}
                  placeholder="010-1234-5678"
                  required
                />
              </div>
              <div className="form-group">
                <label>우편번호 *</label>
                <div className="address-search">
                  <input
                    type="text"
                    value={shipping.postalCode}
                    onChange={(e) => setShipping({...shipping, postalCode: e.target.value})}
                    placeholder="12345"
                    required
                  />
                  <button type="button" onClick={handleAddressSearch} className="btn-search">
                    우편번호 검색
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>주소 *</label>
                <input
                  type="text"
                  value={shipping.mainAddress}
                  onChange={(e) => setShipping({...shipping, mainAddress: e.target.value})}
                  placeholder="서울시 강남구 테헤란로 123"
                  required
                />
              </div>
              <div className="form-group">
                <label>상세주소</label>
                <input
                  type="text"
                  value={shipping.detailAddress}
                  onChange={(e) => setShipping({...shipping, detailAddress: e.target.value})}
                  placeholder="101동 101호"
                />
              </div>
              <div className="form-group">
                <label>배송 메시지</label>
                <input
                  type="text"
                  value={shipping.message}
                  onChange={(e) => setShipping({...shipping, message: e.target.value})}
                  placeholder="문 앞에 놔주세요"
                  maxLength={200}
                />
              </div>
            </section>

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

            <section className="checkout-section">
              <h2 className="section-title">결제 수단</h2>
              <div className="payment-methods">
                <label className="payment-method">
                  <input
                    type="radio"
                    name="payment"
                    value="credit_card"
                    checked={paymentMethod === 'credit_card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>신용카드</span>
                </label>
                <label className="payment-method">
                  <input
                    type="radio"
                    name="payment"
                    value="bank_transfer"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>계좌이체</span>
                </label>
                <label className="payment-method">
                  <input
                    type="radio"
                    name="payment"
                    value="kakao_pay"
                    checked={paymentMethod === 'kakao_pay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>카카오페이</span>
                </label>
                <label className="payment-method">
                  <input
                    type="radio"
                    name="payment"
                    value="toss"
                    checked={paymentMethod === 'toss'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>토스페이</span>
                </label>
              </div>
            </section>

            <section className="checkout-section">
              <h2 className="section-title">결제 금액</h2>
              <div className="payment-summary">
                <div className="summary-row">
                  <span>총 상품 금액</span>
                  <span>{totalAmount.toLocaleString()}원</span>
                </div>
                <div className="summary-row">
                  <span>배송비</span>
                  <span>{shippingFee === 0 ? '무료' : `${shippingFee.toLocaleString()}원`}</span>
                </div>
                <div className="summary-row total">
                  <span>최종 결제 금액</span>
                  <span className="total-amount">{finalAmount.toLocaleString()}원</span>
                </div>
              </div>
            </section>

            <section className="checkout-section">
              <div className="agreement">
                <label className="agreement-checkbox">
                  <input
                    type="checkbox"
                    checked={agreePrivacy}
                    onChange={(e) => setAgreePrivacy(e.target.checked)}
                  />
                  <span>개인정보 수집 및 이용에 동의합니다 (필수)</span>
                </label>
              </div>
            </section>

            <div className="checkout-actions">
              <Link to="/cart" className="btn-secondary">
                장바구니로 돌아가기
              </Link>
              <button type="submit" className="btn-primary">
                {finalAmount.toLocaleString()}원 결제하기
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CheckoutPage;
