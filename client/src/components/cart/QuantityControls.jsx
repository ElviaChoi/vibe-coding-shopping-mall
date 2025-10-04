import React from 'react';

const QuantityControls = ({ quantity, onQuantityChange, onRemove }) => {
  const handleDecrease = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    } else {
      onRemove();
    }
  };

  const handleIncrease = () => {
    onQuantityChange(quantity + 1);
  };

  return (
    <div className="quantity-controls">
      <button 
        type="button" 
        className="quantity-btn decrease"
        onClick={handleDecrease}
        aria-label="수량 감소"
      >
        -
      </button>
      <span className="quantity">{quantity}</span>
      <button 
        type="button" 
        className="quantity-btn increase"
        onClick={handleIncrease}
        aria-label="수량 증가"
      >
        +
      </button>
    </div>
  );
};

export default QuantityControls;
