import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { 
  HiChartBar, 
  HiDocumentText, 
  HiCube, 
  HiPlus, 
  HiHome 
} from 'react-icons/hi';
import '../../styles/components/admin/AdminLayout.css';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        alert('로그인이 필요합니다.');
        navigate('/login', { state: { from: location.pathname } });
      } else if (user.user_type !== 'admin') {
        alert('관리자만 접근할 수 있습니다.');
        navigate('/');
      }
    }
  }, [user, loading, navigate, location.pathname]);

  const menuItems = [
    { path: '/admin', label: '대시보드', icon: HiChartBar },
    { path: '/admin/orders', label: '주문 관리', icon: HiDocumentText },
    { path: '/admin/products', label: '상품 관리', icon: HiCube },
    { path: '/admin/add-product', label: '상품 등록', icon: HiPlus }
  ];

  const isActive = (path) => location.pathname === path;

  if (loading) {
    return (
      <div className="admin-layout">
        <div className="admin-loading">
          <p>권한을 확인하는 중...</p>
        </div>
      </div>
    );
  }

  if (!user || user.user_type !== 'admin') {
    return null;
  }

  return (
    <div className="admin-layout">
      <div className="admin-content-wrapper">
        <div className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
          <div className="admin-brand">
            <h2>COS 관리자</h2>
          </div>
          
          <nav className="admin-nav">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`admin-nav-item ${isActive(item.path) ? 'active' : ''}`}
                >
                  <span className="nav-icon">
                    <IconComponent size={18} />
                  </span>
                  <span className="nav-label">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="admin-nav-footer">
            <Link
              to="/"
              className="admin-nav-item home-button"
            >
              <span className="nav-icon">
                <HiHome size={18} />
              </span>
              <span className="nav-label">홈으로</span>
            </Link>
          </div>
        </div>

        <div className="admin-main">
          <main className="admin-main-content">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;