export const getRelativeTime = (dateString) => {
  if (!dateString) return '시간 정보 없음';
  
  const now = new Date();
  const orderDate = new Date(dateString);
  const diffInMinutes = Math.floor((now - orderDate) / (1000 * 60));
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours}시간 전`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    return `${days}일 전`;
  }
};

export const formatAmount = (order) => {
  const amount = order.payment?.finalAmount || order.payment?.itemsTotal || 0;
  if (amount === 0) return '₩ 0';
  return `₩ ${amount.toLocaleString()}`;
};

export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '₩ 0';
  return `₩ ${amount.toLocaleString()}`;
};

