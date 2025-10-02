import React from 'react';

const ProductSearch = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="search-box">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        className="search-input"
        placeholder="상품 검색..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default ProductSearch;
