import React from 'react';
import './EmptyState.css';

const EmptyState = ({ 
  icon = '📦', 
  title = '데이터가 없습니다', 
  description, 
  action 
}) => {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h3 className="empty-title">{title}</h3>
      {description && (
        <p className="empty-description">{description}</p>
      )}
      {action && (
        <div className="empty-action">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
