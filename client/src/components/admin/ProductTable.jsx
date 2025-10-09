import React, { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { HiPencil, HiTrash, HiStar, HiOutlineStar } from 'react-icons/hi';
import { getProductStatus, getStatusColor, getStatusText, getTotalStock } from '../../utils/productUtils';
import LazyImage from '../common/LazyImage';

const ProductTable = React.memo(({ 
  products, 
  showActionsMenu,
  onActionsClick,
  onToggleFeatured,
  onDeleteProduct,
  onEditProduct 
}) => {

  const handleActionsClick = useCallback((productId, e) => {
    e.stopPropagation();
    onActionsClick(productId, e);
  }, [onActionsClick]);

  const handleToggleFeaturedClick = useCallback((productId, currentFeatured) => {
    onToggleFeatured(productId, currentFeatured);
  }, [onToggleFeatured]);

  const handleDeleteClick = useCallback((productId) => {
    onDeleteProduct(productId);
  }, [onDeleteProduct]);

  const handleEditClick = useCallback((productId) => {
    onEditProduct(productId);
  }, [onEditProduct]);

  const productRows = useMemo(() => {
    if (products.length === 0) {
      return (
        <tr>
          <td colSpan="6" className="no-products">
            상품이 없습니다.
          </td>
        </tr>
      );
    }

    return products.map((product) => {
      const status = getProductStatus(product);
      const statusColor = getStatusColor(status);
      const statusText = getStatusText(status);
      const totalStock = getTotalStock(product);
      const mainImage = product.images?.[0];

      return (
        <tr key={product._id}>
          <td className="product-cell">
            <div className="product-info">
              <div className="product-details">
                <div className="product-name">{product.name}</div>
                <div className="product-id">SKU: {product.sku}</div>
              </div>
              <div className="product-image">
                {mainImage ? (
                  <LazyImage 
                    src={mainImage.url} 
                    alt={mainImage.alt || product.name}
                    className="product-img"
                    placeholder="📦"
                  />
                ) : (
                  <div className="product-emoji">📦</div>
                )}
              </div>
            </div>
          </td>
          <td className="category-cell">
            <div className="category-info">
              <div className="main-category">{product.mainCategory}</div>
              <div className="sub-category">{product.subCategory}</div>
            </div>
          </td>
          <td className="price-cell">
            ₩{product.price?.toLocaleString()}
          </td>
          <td className="stock-cell">
            {totalStock}개
          </td>
          <td className="status-cell">
            <div className="status-container">
              <span 
                className="status-badge"
                style={{ backgroundColor: statusColor }}
              >
                {statusText}
              </span>
              {product.isFeatured && (
                <span className="featured-badge">추천</span>
              )}
            </div>
          </td>
          <td className="actions-cell">
            <div className="actions-container">
              <button 
                className="actions-btn"
                onClick={(e) => handleActionsClick(product._id, e)}
              >
                ⋯
              </button>
              
              {showActionsMenu === product._id && (
                <div className="actions-menu">
                  <button 
                    className="action-item featured"
                    onClick={() => handleToggleFeaturedClick(product._id, product.isFeatured)}
                  >
                    <span className="action-icon">
                      {product.isFeatured ? <HiStar /> : <HiOutlineStar />}
                    </span>
                    {product.isFeatured ? '추천 해제' : '추천 설정'}
                  </button>
                  <button 
                    className="action-item edit"
                    onClick={() => handleEditClick(product._id)}
                  >
                    <span className="action-icon"><HiPencil /></span>
                    수정
                  </button>
                  <button 
                    className="action-item delete"
                    onClick={() => handleDeleteClick(product._id)}
                  >
                    <span className="action-icon"><HiTrash /></span>
                    삭제
                  </button>
                </div>
              )}
            </div>
          </td>
        </tr>
      );
    });
  }, [products, showActionsMenu, handleActionsClick, handleToggleFeaturedClick, handleDeleteClick, handleEditClick]);

  return (
    <div className="products-table-container">
      <table className="products-table">
        <thead>
          <tr>
            <th>상품</th>
            <th>카테고리</th>
            <th>가격</th>
            <th>재고</th>
            <th>상태</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {productRows}
        </tbody>
      </table>
    </div>
  );
});

ProductTable.displayName = 'ProductTable';

export default ProductTable;
