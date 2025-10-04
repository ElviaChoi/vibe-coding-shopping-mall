import React from 'react';
import SizeSelector from './SizeSelector';
import QuantitySelector from './QuantitySelector';
import ProductActions from './ProductActions';
import './ProductInfo.css';

const ProductInfo = ({ 
  product, 
  selectedSize, 
  onSizeSelect, 
  quantity, 
  onQuantityChange, 
  selectedSizeStock,
  isAdmin,
  onAddToCart,
  addingToCart,
  user
}) => {
  if (!product) return null;

  return (
    <div className="product-info">
      <div className="product-header">
        <h1 className="product-name">{product.name}</h1>
        <div className="product-brand">{product.brand}</div>
      </div>
      
      <div className="product-price">
        <span className="current-price">{product.price.toLocaleString()}원</span>
        {product.originalPrice && product.originalPrice > product.price && (
          <span className="original-price">{product.originalPrice.toLocaleString()}원</span>
        )}
        {product.discountRate && (
          <span className="discount-rate">{product.discountRate}% 할인</span>
        )}
      </div>
      
      <div className="product-description">
        <h3>상품 설명</h3>
        <p>{product.description || '상품에 대한 자세한 설명이 없습니다.'}</p>
      </div>
      
      {product.features && product.features.length > 0 && (
        <div className="product-features">
          <h3>상품 특징</h3>
          <ul>
            {product.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      )}

      <SizeSelector 
        sizes={product.sizes}
        selectedSize={selectedSize}
        onSizeSelect={onSizeSelect}
      />

      <QuantitySelector 
        quantity={quantity}
        onQuantityChange={onQuantityChange}
        maxQuantity={selectedSizeStock}
      />

      {!isAdmin ? (
        <ProductActions 
          product={product}
          selectedSize={selectedSize}
          quantity={quantity}
          onAddToCart={onAddToCart}
          addingToCart={addingToCart}
          user={user}
        />
      ) : (
        <div className="admin-notice">
          <span>👨‍💼</span>
          <p>관리자 계정으로 로그인되어 있어 구매 기능이 비활성화되었습니다.</p>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
