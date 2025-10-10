import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/components/product/ProductActions.css';

const ProductActions = ({ 
  product, 
  selectedSize, 
  quantity, 
  onAddToCart, 
  addingToCart, 
  user 
}) => {
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('사이즈를 선택해주세요.');
      return;
    }
    onAddToCart();
  };

  const handleBuyNow = () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    
    if (!selectedSize) {
      alert('사이즈를 선택해주세요.');
      return;
    }

    // 장바구니에 추가 후 바로 주문 페이지로 이동
    onAddToCart();
    navigate('/checkout', {
      state: {
        cartItems: [{
          product,
          size: selectedSize,
          quantity
        }],
        totalAmount: product.price * quantity
      }
    });
  };

  return (
    <div className="product-actions">
      <button 
        type="button" 
        className="btn-secondary add-to-cart-btn"
        onClick={handleAddToCart}
        disabled={addingToCart || !selectedSize}
      >
        {addingToCart ? '추가 중...' : '장바구니 담기'}
      </button>
      
      <button 
        type="button" 
        className="btn-primary buy-now-btn"
        onClick={handleBuyNow}
        disabled={addingToCart || !selectedSize}
      >
        바로 구매하기
      </button>
    </div>
  );
};

export default ProductActions;
