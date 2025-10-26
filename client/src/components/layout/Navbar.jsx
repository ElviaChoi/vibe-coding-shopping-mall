import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../../contexts/CartContext';

function Navbar({ user, loading, onLogout }) {
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-left">
          <button 
            className="icon-btn hamburger-btn" 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="메뉴"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="nav-menu">
            <Link to="/women" className="nav-link">여성</Link>
            <Link to="/men" className="nav-link">남성</Link>
            <Link to="/accessories" className="nav-link">악세사리</Link>
            <Link to="/recommended" className="nav-link">추천</Link>
          </div>
        </div>
        
        <Link to="/" className="logo">COS</Link>
        
        <div className="nav-right">
          <div className="nav-icons">
            {(!user || user.user_type !== 'admin') && (
              <>
                <button className="icon-btn search-btn" aria-label="검색" onClick={() => setSearchOpen(true)}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                
                <Link to="/cart" className="icon-btn cart-btn" aria-label="장바구니">
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="cart-count">{cartCount}</span>
                  )}
                </Link>
                
                {user && (
                  <Link to="/orders" className="icon-btn orders-btn" aria-label="내 주문">
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </Link>
                )}
              </>
            )}
            
            {!loading && (
              <>
                {user ? (
                  <div className="user-menu">
                    <span className="welcome-msg">{user.name}님 환영합니다</span>
                    {user.user_type === 'admin' && (
                      <>
                        <Link to="/admin" className="admin-btn desktop-admin-btn">어드민</Link>
                        <Link to="/admin" className="icon-btn admin-icon-btn mobile-admin-btn" aria-label="어드민">
                          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </Link>
                      </>
                    )}
                    <button onClick={onLogout} className="logout-btn desktop-logout-btn">로그아웃</button>
                    <button onClick={onLogout} className="icon-btn logout-icon-btn mobile-logout-btn" aria-label="로그아웃">
                      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="auth-buttons desktop-auth">
                      <Link to="/login" className="login-btn">로그인</Link>
                      <Link to="/signup" className="signup-btn">회원가입</Link>
                    </div>
                    <Link to="/login" className="icon-btn user-icon-btn mobile-auth" aria-label="로그인">
                      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {menuOpen && (
        <>
          <div className="mobile-menu-overlay" onClick={() => setMenuOpen(false)}></div>
          <div className="mobile-menu">
            <button className="mobile-menu-close" onClick={() => setMenuOpen(false)}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="mobile-menu-links">
              <Link to="/women" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>여성</Link>
              <Link to="/men" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>남성</Link>
              <Link to="/accessories" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>악세사리</Link>
              <Link to="/recommended" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>추천</Link>
              
              {/* 검색 버튼 */}
              {(!user || user.user_type !== 'admin') && (
                <button className="mobile-nav-link search-link" onClick={() => { setSearchOpen(true); setMenuOpen(false); }}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  검색
                </button>
              )}
              
              {/* 모바일 메뉴에 아이콘들 추가 */}
              <div className="mobile-menu-icons">
                {(!user || user.user_type !== 'admin') && (
                  <>
                    
                    <Link to="/cart" className="mobile-icon-btn cart-btn" aria-label="장바구니" onClick={() => setMenuOpen(false)}>
                      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>장바구니 {cartCount > 0 && `(${cartCount})`}</span>
                    </Link>
                    
                    {user && (
                      <Link to="/orders" className="mobile-icon-btn orders-btn" aria-label="내 주문" onClick={() => setMenuOpen(false)}>
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                        <span>내 주문</span>
                      </Link>
                    )}
                  </>
                )}
                
                {!loading && (
                  <>
                    {user ? (
                      <div className="mobile-user-section">
                        <div className="mobile-welcome">안녕하세요, {user.name}님</div>
                        {user.user_type === 'admin' && (
                          <Link to="/admin" className="mobile-icon-btn admin-btn" onClick={() => setMenuOpen(false)}>
                            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>관리자</span>
                          </Link>
                        )}
                        <button onClick={() => { onLogout(); setMenuOpen(false); }} className="mobile-icon-btn logout-btn">
                          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>로그아웃</span>
                        </button>
                      </div>
                    ) : (
                      <>
                        <Link to="/login" className="mobile-icon-btn login-btn" onClick={() => setMenuOpen(false)}>
                          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>로그인</span>
                        </Link>
                        <Link to="/signup" className="mobile-icon-btn signup-btn" onClick={() => setMenuOpen(false)}>
                          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                          <span>회원가입</span>
                        </Link>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* 검색 모달 */}
      {searchOpen && (
        <>
          <div className="search-overlay" onClick={() => setSearchOpen(false)}></div>
          <div className="search-modal">
            <div className="search-header">
              <h2 className="search-title">상품 검색</h2>
              <button className="search-close" onClick={() => setSearchOpen(false)}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form className="search-form" onSubmit={handleSearchSubmit}>
              <div className="search-input-wrapper">
                <svg className="search-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  className="search-input-modal"
                  placeholder="검색어를 입력하세요..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="search-button-group">
                <button type="button" className="search-cancel-btn" onClick={() => setSearchOpen(false)}>
                  취소
                </button>
                <button type="submit" className="search-submit-btn">
                  검색
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </nav>
  );
}

export default Navbar;
