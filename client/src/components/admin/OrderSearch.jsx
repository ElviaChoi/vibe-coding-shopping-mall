import React from 'react';

const OrderSearch = ({ searchQuery, onSearchChange, onClearSearch }) => {
  return (
    <div className="search-box">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        className="search-input"
        placeholder="주문번호, 고객명으로 검색..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      {searchQuery && (
        <button 
          className="clear-search"
          onClick={onClearSearch}
          aria-label="검색어 지우기"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default OrderSearch;
