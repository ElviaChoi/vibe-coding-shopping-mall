import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiCube, 
  HiUsers, 
  HiShoppingCart, 
  HiTrendingUp 
} from 'react-icons/hi';
import { orderAPI } from '../../utils/api';
import { getRelativeTime, formatAmount } from '../../utils/formatUtils';
import '../../styles/pages/admin/AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRecentOrders = async () => {
      try {
        setLoading(true);
        const response = await orderAPI.getAllOrders({ limit: 4, sort: 'createdAt', order: 'desc' });
        
        if (response.success) {
          setRecentOrders(response.data || []);
        } else {
          setError('최근 주문을 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('주문 로드 오류:', err);
        setError('최근 주문을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadRecentOrders();
  }, []);
  const stats = [
    {
      title: '총 상품',
      value: '2,847',
      change: '+12%',
      changeText: '지난 달 대비',
      icon: HiCube
    },
    {
      title: '활성 사용자',
      value: '1,234',
      change: '+8%',
      changeText: '지난 달 대비',
      icon: HiUsers
    },
    {
      title: '오늘 주문',
      value: '89',
      change: '+23%',
      changeText: '지난 달 대비',
      icon: HiShoppingCart
    },
    {
      title: '매출',
      value: '₩4,567,890',
      change: '+15%',
      changeText: '지난 달 대비',
      icon: HiTrendingUp
    }
  ];

  const topProducts = [
    {
      rank: '#1',
      name: '미니멀 울 코트',
      sold: '52개 판매'
    },
    {
      rank: '#2',
      name: '코튼 블렌드 셔츠',
      sold: '49개 판매'
    },
    {
      rank: '#3',
      name: '테일러드 트라우저',
      sold: '20개 판매'
    },
    {
      rank: '#4',
      name: '캐시미어 스웨터',
      sold: '12개 판매'
    }
  ];

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>대시보드</h1>
        <p>환영합니다. 오늘 스토어 현황을 확인해보세요.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div className="stat-header">
                <div className="stat-icon">
                  <IconComponent size={24} />
                </div>
                <div className="stat-info">
                  <h3 className="stat-title">{stat.title}</h3>
                  <div className="stat-value">{stat.value}</div>
                </div>
              </div>
              <div className="stat-change">
                <span className="change-value positive">{stat.change}</span>
                <span className="change-text">{stat.changeText}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Information */}
      <div className="dashboard-details">
        <div className="detail-card">
          <h3 className="detail-title">최근 주문</h3>
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>주문을 불러오는 중...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="empty-state">
              <p>최근 주문이 없습니다.</p>
            </div>
          ) : (
            <div className="orders-list">
              {recentOrders.map((order, index) => (
                <div 
                  key={order._id || index} 
                  className="order-item"
                  onClick={() => navigate('/admin/orders')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="order-info">
                    <div className="order-id">#{order.orderNumber || order._id?.slice(-4) || 'N/A'}</div>
                    <div className="order-details">
                      {order.items?.length || 0}개 상품 • {formatAmount(order)}
                    </div>
                  </div>
                  <div className="order-time">
                    {getRelativeTime(order.createdAt || order.orderDate)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="detail-card">
          <h3 className="detail-title">인기 상품</h3>
          <div className="products-list">
            {topProducts.map((product, index) => (
              <div key={index} className="product-item">
                <div className="product-rank">{product.rank}</div>
                <div className="product-info">
                  <div className="product-name">{product.name}</div>
                  <div className="product-sales">{product.sold}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;