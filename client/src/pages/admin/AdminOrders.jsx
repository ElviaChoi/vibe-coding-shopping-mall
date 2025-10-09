import React, { useState, useEffect } from 'react';
import { orderAPI } from '../../utils/api';
import { LoadingSpinner, ErrorMessage, Pagination } from '../../components/common';
import OrderTable from '../../components/admin/OrderTable';
import OrderDetailModal from '../../components/admin/OrderDetailModal';
import OrderTabs from '../../components/admin/OrderTabs';
import OrderSearch from '../../components/admin/OrderSearch';
import '../../styles/pages/admin/AdminOrders.css';

const AdminOrders = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [tabCounts, setTabCounts] = useState({
    all: 0,
    pending: 0,
    paid: 0,
    preparing: 0,
    shipping: 0,
    delivered: 0,
    cancelled: 0
  });
  const loadTabCounts = async () => {
    try {
      const statuses = ['pending', 'paid', 'preparing', 'shipping', 'delivered', 'cancelled'];
      const counts = { all: 0 };
      
      // 전체 주문 개수
      const allResponse = await orderAPI.getAllOrders({ page: 1, limit: 1 });
      if (allResponse.success) {
        counts.all = allResponse.pagination?.totalOrders || 0;
      }
      
      // 각 상태별 주문 개수
      for (const status of statuses) {
        const response = await orderAPI.getAllOrders({ page: 1, limit: 1, status });
        if (response.success) {
          counts[status] = response.pagination?.totalOrders || 0;
        } else {
          counts[status] = 0;
        }
      }
      
      setTabCounts(counts);
    } catch (err) {
      console.error('탭 카운트 로드 오류:', err);
    }
  };

  const loadOrders = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page,
        limit: 2,
        ...(searchQuery && { search: searchQuery }),
        ...(activeTab !== 'all' && { status: activeTab })
      };
      
      const response = await orderAPI.getAllOrders(params);
      
      if (response.success) {
        setOrders(response.data || []);
        setCurrentPage(response.pagination?.currentPage || 1);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalOrders(response.pagination?.totalOrders || 0);
      } else {
        setError('주문 목록을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('주문 로드 오류:', err);
      setError('주문 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTabCounts();
  }, []);

  useEffect(() => {
    loadOrders(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (searchQuery !== undefined) {
      setCurrentPage(1);
      loadOrders(1);
    }
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
    loadOrders(1);
  }, [activeTab]);
  const handlePageChange = (newPage) => {
    loadOrders(newPage);
  };

  // 주문 상태 업데이트
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await orderAPI.updateOrderStatus(orderId, newStatus);
      
      if (response.success) {
        // 주문 목록 새로고침
        loadOrders(currentPage);
        // 탭 카운트 새로고침
        loadTabCounts();
        setStatusDropdownOpen(null);
        
        // 모달에 표시 중인 주문 정보도 즉시 업데이트
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(prev => ({
            ...prev,
            status: newStatus
          }));
        }
      } else {
        alert('주문 상태 업데이트에 실패했습니다: ' + response.message);
      }
    } catch (err) {
      console.error('주문 상태 업데이트 오류:', err);
      alert('주문 상태 업데이트 중 오류가 발생했습니다: ' + err.message);
    }
  };

  const handleStatusClick = (orderId, event, newStatus) => {
    if (newStatus) {
      updateOrderStatus(orderId, newStatus);
    } else if (event) {
      event.stopPropagation();
    
      if (statusDropdownOpen === orderId) {
        setStatusDropdownOpen(null);
      } else {
        const rect = event.target.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX
        });
        setStatusDropdownOpen(orderId);
      }
    }
  };
  useEffect(() => {
    const handleClickOutside = () => {
        setStatusDropdownOpen(null);
    };

    if (statusDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    return () => {
        document.removeEventListener('click', handleClickOutside);
    };
    }
  }, [statusDropdownOpen]);


  if (loading) {
    return (
      <div className="admin-orders">
        <LoadingSpinner message="주문을 불러오는 중..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-orders">
        <ErrorMessage 
          message={error} 
          onRetry={() => loadOrders(currentPage)}
          retryText="다시 시도"
        />
      </div>
    );
  }

  return (
    <div className="admin-orders">
      <div className="page-header">
        <div className="header-left">
          <h1>주문 관리</h1>
          <p>모든 주문을 관리하고 처리하세요.</p>
        </div>
        
        <div className="header-right">
          <OrderSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClearSearch={() => setSearchQuery('')}
          />
        </div>
      </div>

      <OrderTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabCounts={tabCounts}
      />

      <div className="orders-container">
        <OrderTable
          orders={orders}
          statusDropdownOpen={statusDropdownOpen}
          dropdownPosition={dropdownPosition}
          onStatusClick={handleStatusClick}
          onViewDetail={setSelectedOrder}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalOrders}
          itemsPerPage={2}
          onPageChange={handlePageChange}
        />
      </div>

      <OrderDetailModal
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onStatusUpdate={updateOrderStatus}
      />
    </div>
  );
};

export default AdminOrders;