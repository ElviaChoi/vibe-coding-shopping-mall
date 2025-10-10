import React from 'react';
import '../../styles/components/product/QuantitySelector.css';

const QuantitySelector = ({ quantity, onQuantityChange, maxQuantity = 10 }) => {
  const handleDecrease = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      onQuantityChange(quantity + 1);
    }
  };

  return (
    <div className="quantity-selector">
      <h3>수량</h3>
      <div className="quantity-controls">
        <button 
          type="button" 
          className="quantity-btn decrease"
          onClick={handleDecrease}
          disabled={quantity <= 1}
          aria-label="수량 감소"
        >
          -
        </button>
        <span className="quantity">{quantity}</span>
        <button 
          type="button" 
          className="quantity-btn increase"
          onClick={handleIncrease}
          disabled={quantity >= maxQuantity}
          aria-label="수량 증가"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;
