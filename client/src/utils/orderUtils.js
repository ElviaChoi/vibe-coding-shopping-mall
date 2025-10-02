export const ORDER_STATUS_MAP = {
  'pending': { color: '#6c757d', text: '주문대기' },
  'paid': { color: '#17a2b8', text: '결제완료' },
  'preparing': { color: '#ffc107', text: '배송준비중' },
  'shipping': { color: '#007bff', text: '배송중' },
  'delivered': { color: '#28a745', text: '배송완료' },
  'cancelled': { color: '#dc3545', text: '취소' },
  'refunded': { color: '#6f42c1', text: '환불' }
};

export const getStatusInfo = (status) => {
  return ORDER_STATUS_MAP[status] || { color: '#6c757d', text: status };
};

export const getStatusLabel = (status) => {
  const statusMap = {
    'pending': '주문대기',
    'paid': '결제완료',
    'preparing': '배송준비중',
    'shipping': '배송중',
    'delivered': '배송완료',
    'cancelled': '주문취소',
    'refunded': '환불완료'
  };
  return statusMap[status] || status;
};

export const getStatusStep = (status) => {
  const statusMap = {
    'pending': { step: 1, label: '배송준비중', description: '주문이 접수되어 처리 중입니다' },
    'paid': { step: 1, label: '배송준비중', description: '주문이 접수되어 처리 중입니다' },
    'preparing': { step: 1, label: '배송준비중', description: '주문이 접수되어 처리 중입니다' },
    'shipping': { step: 2, label: '배송중', description: '상품이 배송 중입니다' },
    'delivered': { step: 3, label: '배송완료', description: '배송이 완료되었습니다' },
    'cancelled': { step: 0, label: '취소됨', description: '주문이 취소되었습니다' }
  };
  return statusMap[status] || statusMap['pending'];
};

