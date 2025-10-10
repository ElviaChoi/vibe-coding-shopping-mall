import React, { useCallback } from 'react';
import '../../styles/components/common/StatusBadge.css';

const STATUS_CONFIG = {
  pending: { color: '#6c757d', text: '주문대기' },
  paid: { color: '#17a2b8', text: '결제완료' },
  preparing: { color: '#ffc107', text: '배송준비중' },
  shipping: { color: '#007bff', text: '배송중' },
  delivered: { color: '#28a745', text: '배송완료' },
  cancelled: { color: '#dc3545', text: '취소' },
  refunded: { color: '#6f42c1', text: '환불' },
  active: { color: '#28a745', text: '활성' },
  inactive: { color: '#6c757d', text: '비활성' },
  featured: { color: '#f39c12', text: '추천' }
};

const StatusBadge = React.memo(({ 
  status, 
  clickable = false, 
  onClick, 
  showDropdown = false,
  className = '' 
}) => {
  const config = STATUS_CONFIG[status] || { color: '#6c757d', text: status };
  
  const handleClick = useCallback((e) => {
    if (clickable && onClick) {
      e.stopPropagation();
      onClick(e);
    }
  }, [clickable, onClick]);

  return (
    <span 
      className={`status-badge ${clickable ? 'clickable' : ''} ${className}`}
      style={{ backgroundColor: config.color }}
      onClick={handleClick}
    >
      {config.text}
      {clickable && showDropdown && (
        <span className="dropdown-arrow">▼</span>
      )}
    </span>
  );
});

StatusBadge.displayName = 'StatusBadge';

export default StatusBadge;
