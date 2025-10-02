import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI, cartAPI } from '../utils/api';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import useAuth from '../hooks/useAuth';
import { useCart } from '../contexts/CartContext';

function CartPage() {
  const { user, loading: authLoading, error: authError, logout } = useAuth();
  const { refreshCartCount } = useCart();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (user?._id) {
      fetchCartItems();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchCartItems = async () => {
    if (!user?._id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await cartAPI.getCart(user._id);
      if (response.success) {
        setCartItems(response.data.items || []);
        setTotalAmount(response.data.totalAmount || 0);
      } else {
        setError(response.message);
      }
    } catch (error) {
      console.error('장바구니 조회 오류:', error);
      setError('장바구니를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, size, newQuantity) => {
    if (!user?._id) return;

    try {
      const response = await cartAPI.updateCartItem(user._id, {
        productId,
        size,
        quantity: newQuantity
      });
      
      if (response.success) {
        await fetchCartItems(); // 장바구니 다시 조회
        await refreshCartCount(); // Navbar 카운트 업데이트
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error('수량 업데이트 오류:', error);
      alert('수량을 업데이트하는 중 오류가 발생했습니다.');
    }
  };

  const removeItem = async (productId, size) => {
    if (!user?._id) return;

    if (window.confirm('이 상품을 장바구니에서 제거하시겠습니까?')) {
      try {
        const response = await cartAPI.removeFromCart(user._id, {
          productId,
          size
        });
        
        if (response.success) {
          await fetchCartItems(); // 장바구니 다시 조회
          await refreshCartCount(); // Navbar 카운트 업데이트
        } else {
          alert(response.message);
        }
      } catch (error) {
        console.error('상품 제거 오류:', error);
        alert('상품을 제거하는 중 오류가 발생했습니다.');
      }
    }
  };

  const clearCart = async () => {
    if (!user?._id) return;

    if (window.confirm('장바구니를 비우시겠습니까?')) {
      try {
        const response = await cartAPI.clearCart(user._id);
        
        if (response.success) {
          await fetchCartItems(); // 장바구니 다시 조회
          await refreshCartCount(); // Navbar 카운트 업데이트
        } else {
          alert(response.message);
        }
      } catch (error) {
        console.error('장바구니 비우기 오류:', error);
        alert('장바구니를 비우는 중 오류가 발생했습니다.');
      }
    }
  };

  if (loading) {
    return (
      <div className="App">
        <Navbar user={user} loading={authLoading} onLogout={logout} />
        <div className="cart-page">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>장바구니를 불러오는 중...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <Navbar user={user} loading={authLoading} onLogout={logout} />
        <div className="cart-page">
          <div className="error-container">
            <h2>오류가 발생했습니다</h2>
            <p>{error}</p>
            <button onClick={fetchCartItems} className="retry-btn">
              다시 시도
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="App">
      <Navbar user={user} loading={authLoading} onLogout={logout} />
      <div className="cart-page">
        <div className="cart-container">
        <div className="cart-header">
          <h1>장바구니</h1>
          {cartItems.length > 0 && (
            <button onClick={clearCart} className="clear-cart-btn">
              전체 삭제
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <svg width="80" height="80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h6M9 18a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
            </div>
            <h2>장바구니가 비어있습니다</h2>
            <p>원하는 상품을 장바구니에 추가해보세요.</p>
            <Link to="/" className="continue-shopping-btn">
              쇼핑 계속하기
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item, index) => (
                <div key={`${item.product._id}-${item.size}`} className="cart-item">
                  <div className="item-image">
                    <Link to={`/product/${item.product._id}`}>
                      {item.product.images && item.product.images.length > 0 ? (
                        <img 
                          src={item.product.images[0].url} 
                          alt={item.product.images[0].alt || item.product.name}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                      ) : null}
                      <div className="image-placeholder" style={{display: 'none'}}>
                        <svg width="60" height="60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </Link>
                  </div>

                  <div className="item-details">
                    <Link to={`/product/${item.product._id}`} className="item-name">
                      {item.product.name}
                    </Link>
                    <div className="item-info">
                      <span className="item-brand">{item.product.brand}</span>
                      <span className="item-size">사이즈: {item.size}</span>
                    </div>
                    <div className="item-price">
                      {item.product.price.toLocaleString()}원
                    </div>
                  </div>

                  <div className="item-controls">
                    <div className="quantity-controls">
                      <button 
                        onClick={() => updateQuantity(item.product._id, item.size, item.quantity - 1)}
                        className="quantity-btn"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product._id, item.size, item.quantity + 1)}
                        className="quantity-btn"
                      >
                        +
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item.product._id, item.size)}
                      className="remove-btn"
                      title="삭제"
                    >
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <div className="item-total">
                    {(item.product.price * item.quantity).toLocaleString()}원
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-row">
                <span>총 상품 금액</span>
                <span>{totalAmount.toLocaleString()}원</span>
              </div>
              <div className="summary-row">
                <span>배송비</span>
                <span>{totalAmount >= 30000 ? '무료' : '2,000원'}</span>
              </div>
              <div className="summary-row total">
                <span>총 결제 금액</span>
                <span>{(totalAmount + (totalAmount >= 30000 ? 0 : 2000)).toLocaleString()}원</span>
              </div>
              
              <div className="checkout-actions">
                <Link to="/" className="continue-shopping-btn">
                  쇼핑 계속하기
                </Link>
                <Link 
                  to="/checkout" 
                  state={{ cartItems, totalAmount }}
                  className="checkout-btn"
                >
                  주문하기
                </Link>
              </div>
            </div>
          </>
        )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CartPage;
