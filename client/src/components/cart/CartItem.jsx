import React from 'react';
import { Link } from 'react-router-dom';
import { HiTrash } from 'react-icons/hi';
import QuantityControls from './QuantityControls';

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  const handleQuantityChange = (newQuantity) => {
    onQuantityChange(item.product._id, item.size, newQuantity);
  };

  const handleRemove = () => {
    onRemove(item.product._id, item.size);
  };

  return (
    <div className="cart-item">
      <div className="item-image">
        <Link to={`/product/${item.product._id}`}>
          {item.product.images?.[0] ? (
            <img src={item.product.images[0].url} alt={item.product.name} />
          ) : (
            <div className="image-placeholder">이미지 없음</div>
          )}
        </Link>
      </div>
      
      <div className="item-details">
        <Link to={`/product/${item.product._id}`} className="item-name">
          {item.product.name}
        </Link>
        <div className="item-info">
          <span className="item-size">사이즈: {item.size}</span>
        </div>
        <div className="item-price">
          {item.product.price.toLocaleString()}원
        </div>
      </div>
      
      <div className="item-controls">
        <QuantityControls
          quantity={item.quantity}
          onQuantityChange={handleQuantityChange}
          onRemove={handleRemove}
        />
        <button 
          type="button" 
          className="remove-btn"
          onClick={handleRemove}
          aria-label="상품 삭제"
        >
          <HiTrash size={16} />
        </button>
        <div className="item-total">
          {(item.product.price * item.quantity).toLocaleString()}원
        </div>
      </div>
    </div>
  );
};

export default CartItem;
