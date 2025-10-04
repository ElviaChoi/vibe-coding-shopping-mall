import React from 'react';
import { Link } from 'react-router-dom';
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
      <div className="cart-item-image">
        <Link to={`/product/${item.product._id}`}>
          {item.product.images?.[0] && (
            <img src={item.product.images[0].url} alt={item.product.name} />
          )}
        </Link>
      </div>
      
      <div className="cart-item-info">
        <h3>
          <Link to={`/product/${item.product._id}`}>
            {item.product.name}
          </Link>
        </h3>
        <p className="cart-item-option">
          사이즈: {item.size}
        </p>
        <div className="cart-item-price">
          {item.product.price.toLocaleString()}원
        </div>
      </div>
      
      <div className="cart-item-controls">
        <QuantityControls
          quantity={item.quantity}
          onQuantityChange={handleQuantityChange}
          onRemove={handleRemove}
        />
        <div className="cart-item-total">
          {(item.product.price * item.quantity).toLocaleString()}원
        </div>
        <button 
          type="button" 
          className="remove-btn"
          onClick={handleRemove}
          aria-label="상품 삭제"
        >
          삭제
        </button>
      </div>
    </div>
  );
};

export default CartItem;
