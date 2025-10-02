import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { productAPI } from '../../utils/api';
import { HiPlus } from 'react-icons/hi';
import { LoadingSpinner, ErrorMessage, Pagination } from '../../components/common';
import ProductTable from '../../components/admin/ProductTable';
import ProductSearch from '../../components/admin/ProductSearch';
import '../../styles/pages/admin/AdminProducts.css';

const AdminProducts = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showActionsMenu, setShowActionsMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const loadProducts = async (page = 1, search = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page,
        limit: 10,
        ...(search && { search })
      };
      
      const response = await productAPI.getProducts(params);
      
      if (response.success) {
        setProducts(response.data || []);
        setCurrentPage(response.pagination?.currentPage || 1);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalProducts(response.pagination?.totalProducts || 0);
      } else {
        setError('상품 목록을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('상품 로드 오류:', err);
      setError(err.message || '상품 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 상품 목록 로드
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('refresh')) {
      loadProducts(currentPage, searchTerm);
    } else {
      loadProducts(currentPage, searchTerm);
    }
  }, [currentPage, searchTerm, location.search]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showActionsMenu && !event.target.closest('.actions-container')) {
        setShowActionsMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showActionsMenu]);
  const handleActionsClick = (productId, e) => {
    e.stopPropagation();
    setShowActionsMenu(showActionsMenu === productId ? null : productId);
  };

  const handleEditProduct = (productId) => {
    alert('상품 수정 기능은 추후 구현될 예정입니다.');
    setShowActionsMenu(null);
  };
  const handleToggleFeatured = async (productId, currentFeatured) => {
    try {
      const response = await productAPI.updateProduct(productId, {
        isFeatured: !currentFeatured
      });

      if (response.success) {
        loadProducts(currentPage, searchTerm);
        setShowActionsMenu(null);
        alert(currentFeatured ? '추천이 해제되었습니다.' : '추천으로 설정되었습니다.');
      } else {
        alert('추천 설정 변경에 실패했습니다: ' + response.message);
      }
    } catch (err) {
      console.error('추천 설정 변경 오류:', err);
      alert('추천 설정 변경 중 오류가 발생했습니다: ' + err.message);
    }
  };
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('정말로 이 상품을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await productAPI.deleteProduct(productId);

      if (response.success) {
        loadProducts(currentPage, searchTerm);
        setShowActionsMenu(null);
        alert('상품이 삭제되었습니다.');
      } else {
        alert('상품 삭제에 실패했습니다: ' + response.message);
      }
    } catch (err) {
      console.error('상품 삭제 오류:', err);
      alert('상품 삭제 중 오류가 발생했습니다: ' + err.message);
    }
  };
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="admin-products">
      <div className="page-header">
        <div className="header-content">
          <div className="header-text">
            <h1>상품 관리</h1>
            <p>등록된 상품을 관리하고 새로운 상품을 추가하세요.</p>
          </div>
          <Link to="/admin/add-product" className="add-product-btn">
            <HiPlus size={16} />
            상품 추가
          </Link>
        </div>
      </div>

      <div className="products-section">
        <div className="section-header">
          <h2>상품 목록 ({totalProducts}개)</h2>
          <div className="search-filter-container">
            <ProductSearch
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
            <button className="filter-btn">
              <span className="filter-icon">⚡</span>
              필터
            </button>
          </div>
        </div>

        {loading && <LoadingSpinner message="상품 목록을 불러오는 중..." />}

        {error && (
          <ErrorMessage 
            message={error} 
            onRetry={() => loadProducts(currentPage, searchTerm)}
            retryText="다시 시도"
          />
        )}

        {!loading && !error && (
          <ProductTable
            products={products}
            showActionsMenu={showActionsMenu}
            onActionsClick={handleActionsClick}
            onToggleFeatured={handleToggleFeatured}
            onDeleteProduct={handleDeleteProduct}
            onEditProduct={handleEditProduct}
          />
        )}

        {!loading && !error && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalProducts}
            itemsPerPage={10}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default AdminProducts;