import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import useAuth from '../hooks/useAuth';
import { useCart } from '../contexts/CartContext';
import {
  CustomerInfoForm,
  ShippingInfoForm,
  OrderItemsList,
  PaymentMethodSelector,
  PaymentSummary,
  CheckoutActions
} from '../components/checkout';

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

          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
          const response = await fetch(`${API_URL}/orders`, {
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
            <CustomerInfoForm 
              customer={customer} 
              onCustomerChange={setCustomer} 
            />

            <ShippingInfoForm 
              shipping={shipping} 
              onShippingChange={setShipping}
              onAddressSearch={handleAddressSearch}
            />

            <OrderItemsList cartItems={cartItems} />

            <PaymentMethodSelector 
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
            />

            <PaymentSummary 
              totalAmount={totalAmount}
              shippingFee={shippingFee}
              finalAmount={finalAmount}
              agreePrivacy={agreePrivacy}
              onAgreePrivacyChange={setAgreePrivacy}
            />

            <CheckoutActions 
              finalAmount={finalAmount}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CheckoutPage;
