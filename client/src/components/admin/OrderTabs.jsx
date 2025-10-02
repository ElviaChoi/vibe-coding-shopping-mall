import React from 'react';

const OrderTabs = ({ activeTab, onTabChange, tabCounts }) => {
  const tabs = [
    { id: 'all', label: '전체' },
    { id: 'pending', label: '주문대기' },
    { id: 'paid', label: '결제완료' },
    { id: 'preparing', label: '배송준비중' },
    { id: 'shipping', label: '배송중' },
    { id: 'delivered', label: '배송완료' },
    { id: 'cancelled', label: '취소/환불' }
  ];

  return (
    <div className="admin-order-tabs">
      {tabs.map(tab => (
        <button 
          key={tab.id}
          className={`admin-order-tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label} <span className="tab-count">({tabCounts[tab.id] || 0})</span>
        </button>
      ))}
    </div>
  );
};

export default OrderTabs;
