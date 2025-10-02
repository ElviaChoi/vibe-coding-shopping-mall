import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message = '로딩 중...', size = 'medium' }) => {
  return (
    <div className={`loading-container ${size}`}>
      <div className="loading-spinner"></div>
      <p>{message}</p>
    </div>
  );
};

export default LoadingSpinner;
