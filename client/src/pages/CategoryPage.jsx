import { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { productAPI } from '../utils/api';
import useAuth from '../hooks/useAuth';

const CategoryPage = () => {
  const { category } = useParams();
  const location = useLocation();
  const { user, loading: authLoading, error: authError, logout } = useAuth();
  
  // URL 경로에서 카테고리 추출 (예: /women -> women)
  const currentCategory = category || location.pathname.substring(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 카테고리 매핑
  const categoryMapping = {
    women: 'women',
    men: 'men',
    accessories: 'accessories'
  };

  const categoryNames = {
    women: '여성',
    men: '남성',
    accessories: '악세사리'
  };

  useEffect(() => {
    const loadCategoryProducts = async () => {
      try {
        setLoading(true);
        const mappedCategory = categoryMapping[currentCategory] || currentCategory;
        
        const response = await productAPI.getProducts({
          mainCategory: mappedCategory,
          isActive: 'true',
          limit: 50
        });
        
        if (response.success) {
          setProducts(response.data || []);
        } else {
          setError('상품을 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('카테고리 상품 로드 오류:', err);
        setError('상품을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (currentCategory) {
      loadCategoryProducts();
    }
  }, [currentCategory]);

  if (loading) {
    return (
      <div className="App">
        <Navbar user={user} loading={authLoading} onLogout={logout} />
        <div className="page-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>{categoryNames[category] || category} 상품을 불러오는 중...</p>
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

  const displayCategoryName = categoryNames[currentCategory] || currentCategory;

  return (
    <div className="App">
      <Navbar user={user} loading={authLoading} onLogout={logout} />
      <div className="page-container">
        <div className="category-page">
          <div className="page-header">
            <h1>{displayCategoryName} 컬렉션</h1>
            <p>{displayCategoryName}을 위한 세련되고 실용적인 아이템들을 만나보세요.</p>
          </div>
          
          {products.length === 0 ? (
            <div className="no-products-container">
              <h3>{displayCategoryName} 상품이 없습니다</h3>
              <p>아직 등록된 {displayCategoryName} 상품이 없습니다.</p>
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

export default CategoryPage;
