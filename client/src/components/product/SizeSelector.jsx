import React from 'react';
import '../../styles/components/product/SizeSelector.css';

const SizeSelector = ({ sizes, selectedSize, onSizeSelect }) => {
  if (!sizes || sizes.length === 0) return null;

  return (
    <div className="size-selector">
      <h3>사이즈 선택</h3>
      <div className="size-options">
        {sizes.map((sizeOption) => (
          <button
            key={sizeOption.size}
            className={`size-option ${selectedSize === sizeOption.size ? 'selected' : ''} ${!sizeOption.stock ? 'out-of-stock' : ''}`}
            onClick={() => onSizeSelect(sizeOption.size)}
            disabled={!sizeOption.stock}
          >
            {sizeOption.size}
            {!sizeOption.stock && <span className="stock-status">품절</span>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector;
