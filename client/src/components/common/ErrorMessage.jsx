import React from 'react';
import '../../styles/components/common/ErrorMessage.css';

const ErrorMessage = ({ message, onRetry, retryText = '다시 시도' }) => {
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <p className="error-message">{message}</p>
      {onRetry && (
        <button className="retry-btn" onClick={onRetry}>
          {retryText}
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
