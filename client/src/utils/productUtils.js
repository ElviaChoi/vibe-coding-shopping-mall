export const getProductStatus = (product) => {
  if (!product.isActive) return 'Inactive';
  
  const totalStock = product.sizes?.reduce((sum, size) => sum + (size.stock || 0), 0) || 0;
  if (totalStock === 0) return 'Out of Stock';
  return 'Active';
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'Active': return '#28a745';
    case 'Out of Stock': return '#dc3545';
    case 'Inactive': return '#6c757d';
    default: return '#6c757d';
  }
};

export const getStatusText = (status) => {
  switch (status) {
    case 'Active': return '판매중';
    case 'Out of Stock': return '품절';
    case 'Inactive': return '판매중단';
    default: return status;
  }
};

export const getTotalStock = (product) => {
  return product.sizes?.reduce((sum, size) => sum + (size.stock || 0), 0) || 0;
};

