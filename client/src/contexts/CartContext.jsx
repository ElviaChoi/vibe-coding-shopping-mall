import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../utils/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const getCurrentUserId = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user._id;
      } catch (error) {
        console.error('사용자 데이터 파싱 오류:', error);
        return null;
      }
    }
    return null;
  };

  const fetchCartCount = async () => {
    const userId = getCurrentUserId();
    if (!userId) {
      setCartCount(0);
      return;
    }

    try {
      const response = await cartAPI.getCartCount(userId);
      if (response && response.success) {
        setCartCount(response.data?.totalItems || 0);
      } else {
        setCartCount(0);
      }
    } catch (error) {
      console.error('장바구니 개수 조회 오류:', error);
      setCartCount(0);
    }
  };

  const addToCart = async (productId, size, quantity = 1) => {
    const userId = getCurrentUserId();
    if (!userId) {
      return { 
        success: false, 
        message: '로그인이 필요합니다.' 
      };
    }

    try {
      setLoading(true);
      const response = await cartAPI.addToCart(userId, {
        productId,
        size,
        quantity
      });
      
      if (response.success) {
        await fetchCartCount();
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('장바구니 추가 오류:', error);
      return { 
        success: false, 
        message: '장바구니에 상품을 추가하는 중 오류가 발생했습니다.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId, size) => {
    const userId = getCurrentUserId();
    if (!userId) {
      return { 
        success: false, 
        message: '로그인이 필요합니다.' 
      };
    }

    try {
      setLoading(true);
      const response = await cartAPI.removeFromCart(userId, {
        productId,
        size
      });
      
      if (response.success) {
        await fetchCartCount();
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('장바구니 제거 오류:', error);
      return { 
        success: false, 
        message: '장바구니에서 상품을 제거하는 중 오류가 발생했습니다.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (productId, size, quantity) => {
    const userId = getCurrentUserId();
    if (!userId) {
      return { 
        success: false, 
        message: '로그인이 필요합니다.' 
      };
    }

    try {
      setLoading(true);
      const response = await cartAPI.updateCartItem(userId, {
        productId,
        size,
        quantity
      });
      
      if (response.success) {
        await fetchCartCount();
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('장바구니 업데이트 오류:', error);
      return { 
        success: false, 
        message: '장바구니를 업데이트하는 중 오류가 발생했습니다.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    const userId = getCurrentUserId();
    if (!userId) {
      return { 
        success: false, 
        message: '로그인이 필요합니다.' 
      };
    }

    try {
      setLoading(true);
      const response = await cartAPI.clearCart(userId);
      
      if (response.success) {
        setCartCount(0);
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('장바구니 비우기 오류:', error);
      return { 
        success: false, 
        message: '장바구니를 비우는 중 오류가 발생했습니다.' 
      };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const handleStorageChange = (e) => {
      if (!isMounted) return;
      
      if (e.key === 'token') {
        if (e.newValue === null) {
          setCartCount(0);
        } else if (e.newValue !== null) {
          fetchCartCount();
        }
      }
    };

    const handleLogout = () => {
      if (!isMounted) return;
      setCartCount(0);
    };

    const handleLogin = () => {
      if (!isMounted) return;
      fetchCartCount();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userLogout', handleLogout);
    window.addEventListener('userLogin', handleLogin);

    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        fetchCartCount();
      } else {
        setCartCount(0);
      }
    };

    const timeoutId = setTimeout(checkLoginStatus, 100);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLogout', handleLogout);
      window.removeEventListener('userLogin', handleLogin);
    };
  }, []);

  const value = {
    cartCount,
    loading,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    refreshCartCount: fetchCartCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
