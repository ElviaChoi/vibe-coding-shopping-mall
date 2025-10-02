import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { productAPI } from '../utils/api';
import useAuth from '../hooks/useAuth';

const RecommendedPage = () => {
  const { user, loading: authLoading, error: authError, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRecommendedProducts = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getProducts({
          isFeatured: 'true',
          isActive: 'true',
          limit: 20
        });
        
        if (response.success) {
          setProducts(response.data || []);
        } else {
          setError('추천 상품을 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('추천 상품 로드 오류:', err);
        setError('상품을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadRecommendedProducts();
  }, []);

  if (loading) {
    return (
      <div className="App">
        <Navbar user={user} loading={authLoading} onLogout={logout} />
        <div className="page-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>추천 상품을 불러오는 중...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <Navbar user={user} loading={authLoading} onLogout={logout} />
        <div className="page-container">
          <div className="error-container">
            <h2>오류가 발생했습니다</h2>
            <p>{error}</p>
            <Link to="/" className="btn-primary">홈으로 돌아가기</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="App">
      <Navbar user={user} loading={authLoading} onLogout={logout} />
      <div className="page-container">
        <div className="recommended-page">
          <div className="page-header">
            <h1>추천 상품</h1>
            <p>이번 시즌 가장 사랑받는 아이템들을 만나보세요.</p>
          </div>
          
          {products.length === 0 ? (
            <div className="no-products-container">
              <h3>추천 상품이 없습니다</h3>
              <p>아직 추천으로 설정된 상품이 없습니다.</p>
              <Link to="/" className="btn-outline">홈으로 돌아가기</Link>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => {
                const mainImage = product.images?.[0];
                const totalStock = product.sizes?.reduce((sum, size) => sum + (size.stock || 0), 0) || 0;
                
                return (
                  <Link key={product._id} to={`/product/${product._id}`} className="product-item">
                    <div className="product-image">
                      {mainImage ? (
                        <img 
                          src={mainImage.url} 
                          alt={mainImage.alt || product.name}
                          className="product-img"
                        />
                      ) : (
                        <div className="image-placeholder no-image"
                             role="img" 
                             aria-label={`${product.name} 이미지`}>
                          📦
                        </div>
                      )}
                      <span className="sale-badge" aria-label="추천 상품">추천</span>
                      {totalStock === 0 && (
                        <span className="sold-out-badge" aria-label="품절">품절</span>
                      )}
                    </div>
                    <div className="product-info">
                      <h4>{product.name}</h4>
                      <p>₩{product.price?.toLocaleString()}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RecommendedPage;
