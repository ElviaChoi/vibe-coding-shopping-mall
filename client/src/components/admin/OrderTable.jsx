import React from 'react';
import StatusBadge from '../common/StatusBadge';
import { getStatusInfo } from '../../utils/orderUtils';

const OrderTable = ({ 
  orders, 
  statusDropdownOpen, 
  dropdownPosition,
  onStatusClick,
  onViewDetail 
}) => {

  return (
    <div className="orders-table-container">
      <table className="orders-table">
        <thead>
          <tr>
            <th>주문번호</th>
            <th>고객명</th>
            <th>상품수</th>
            <th>금액</th>
            <th>상태</th>
            <th>주문일</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="7" className="no-orders">
                주문 내역이 없습니다.
              </td>
            </tr>
          ) : (
            orders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              return (
                <tr key={order._id}>
                  <td>
                    <span className="order-id">{order.orderNumber}</span>
                  </td>
                  <td>{order.customer?.name || '정보 없음'}</td>
                  <td>{order.items?.length || 0}개</td>
                  <td>
                    <span className="amount">₩ {order.payment?.finalAmount?.toLocaleString() || '0'}</span>
                  </td>
                  <td>
                    <div className="status-dropdown-container">
                      <StatusBadge
                        status={order.status}
                        clickable
                        showDropdown
                        onClick={(e) => onStatusClick(order._id, e)}
                      />
                      
                      {statusDropdownOpen === order._id && (
                        <div 
                          className="status-dropdown-menu-fixed"
                          style={{
                            top: dropdownPosition.top,
                            left: dropdownPosition.left
                          }}
                        >
                          <div 
                            className="status-dropdown-item"
                            onClick={() => onStatusClick(order._id, null, 'pending')}
                          >
                            <span className="status-color-dot" style={{ backgroundColor: '#6c757d' }}></span>
                            주문대기
                          </div>
                          <div 
                            className="status-dropdown-item"
                            onClick={() => onStatusClick(order._id, null, 'paid')}
                          >
                            <span className="status-color-dot" style={{ backgroundColor: '#17a2b8' }}></span>
                            결제완료
                          </div>
                          <div 
                            className="status-dropdown-item"
                            onClick={() => onStatusClick(order._id, null, 'preparing')}
                          >
                            <span className="status-color-dot" style={{ backgroundColor: '#ffc107' }}></span>
                            배송준비중
                          </div>
                          <div 
                            className="status-dropdown-item"
                            onClick={() => onStatusClick(order._id, null, 'shipping')}
                          >
                            <span className="status-color-dot" style={{ backgroundColor: '#007bff' }}></span>
                            배송중
                          </div>
                          <div 
                            className="status-dropdown-item"
                            onClick={() => onStatusClick(order._id, null, 'delivered')}
                          >
                            <span className="status-color-dot" style={{ backgroundColor: '#28a745' }}></span>
                            배송완료
                          </div>
                          <div 
                            className="status-dropdown-item"
                            onClick={() => onStatusClick(order._id, null, 'cancelled')}
                          >
                            <span className="status-color-dot" style={{ backgroundColor: '#dc3545' }}></span>
                            취소
                          </div>
                          <div 
                            className="status-dropdown-item"
                            onClick={() => onStatusClick(order._id, null, 'refunded')}
                          >
                            <span className="status-color-dot" style={{ backgroundColor: '#6f42c1' }}></span>
                            환불
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('ko-KR') : '-'}
                  </td>
                  <td>
                    <button 
                      className="action-btn"
                      onClick={() => onViewDetail(order)}
                    >
                      상세 보기
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
