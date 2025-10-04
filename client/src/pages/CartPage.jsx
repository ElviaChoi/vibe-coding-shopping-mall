import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI, cartAPI } from '../utils/api';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import useAuth from '../hooks/useAuth';
import { useCart } from '../contexts/CartContext';
import { CartItem, CartSummary, EmptyCart } from '../components/cart';

function CartPage() {
  const { user, loading: authLoading, error: authError, logout } = useAuth();
  const { refreshCartCount } = useCart();
  const navigate = useNavigate();
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
          <EmptyCart />
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item, index) => (
                <CartItem
                  key={`${item.product._id}-${item.size}`}
                  item={item}
                  onQuantityChange={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>

            <CartSummary 
              totalAmount={totalAmount}
              itemCount={cartItems.length}
              onCheckout={() => navigate('/checkout', { state: { cartItems, totalAmount } })}
            />
          </>
        )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CartPage;
