import React from 'react';
import './Pagination.css';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  onPageChange,
  itemsPerPage,
  showItemCount = true 
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="이전 페이지"
      >
        이전
      </button>
      
      <span className="pagination-info">
        {showItemCount ? (
          `${currentPage} / ${totalPages} 페이지 (총 ${totalItems}개)`
        ) : (
          `${currentPage} / ${totalPages} 페이지`
        )}
      </span>
      
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="다음 페이지"
      >
        다음
      </button>
    </div>
  );
};

export default Pagination;
