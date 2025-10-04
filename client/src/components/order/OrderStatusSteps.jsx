import React from 'react';
import { getStatusStep } from '../../utils/orderUtils';

const OrderStatusSteps = ({ status }) => {
  const currentStep = getStatusStep(status);
  
  const steps = [
    { key: 'pending', label: '주문접수', icon: '📝' },
    { key: 'confirmed', label: '주문확인', icon: '✅' },
    { key: 'shipped', label: '배송중', icon: '🚚' },
    { key: 'delivered', label: '배송완료', icon: '📦' },
    { key: 'completed', label: '주문완료', icon: '🎉' }
  ];

  return (
    <div className="order-status-steps">
      <h3>주문 진행 상황</h3>
      <div className="steps-container">
        {steps.map((step, index) => {
          const isActive = index <= currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <div key={step.key} className={`step ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}>
              <div className="step-icon">
                <span className="icon">{step.icon}</span>
              </div>
              <div className="step-label">{step.label}</div>
              {index < steps.length - 1 && (
                <div className={`step-connector ${isActive ? 'active' : ''}`}></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusSteps;
