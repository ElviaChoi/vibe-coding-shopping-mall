import { memo, useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/sections/HeroSection';
import CollectionsSection from '../components/sections/CollectionsSection';
import FeaturedProductsSection from '../components/sections/FeaturedProductsSection';
import NewsletterSection from '../components/sections/NewsletterSection';
import Footer from '../components/layout/Footer';
import LazyImage from '../components/common/LazyImage';
import useAuth from '../hooks/useAuth';
import { productAPI } from '../utils/api';
import '../styles/components/common/ProductGrid.css';

function MainPage() {
  const { user, loading, error, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  
  const [searchProducts, setSearchProducts] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  useEffect(() => {
    const loadSearchResults = async () => {
      if (!searchQuery) {
        setSearchProducts([]);
        return;
      }

      try {
        setSearchLoading(true);
        setSearchError(null);
        
        const response = await productAPI.getProducts({
          search: searchQuery,
          isActive: 'true',
          limit: 50
        });
        
        if (response.success) {
          setSearchProducts(response.data || []);
        } else {
          setSearchError('검색 결과를 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('검색 결과 로드 오류:', err);
        setSearchError('검색 결과를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setSearchLoading(false);
      }
    };

    loadSearchResults();
  }, [searchQuery]);

  return (
    <div className="cos-main">
      <Navbar user={user} loading={loading} onLogout={logout} />
      
      {error && (
        <div className="error-banner" role="alert">
          <p>{error}</p>
        </div>
      )}

      <main>
        {searchQuery ? (
          <div className="page-container">
            <div className="category-page">
              <div className="page-header">
                <h1>검색 결과: "{searchQuery}"</h1>
                <p>"{searchQuery}"에 대한 검색 결과를 찾았습니다.</p>
              </div>
              
              {searchLoading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>검색 중...</p>
                </div>
              ) : searchError ? (
                <div className="error-container">
                  <h2>오류가 발생했습니다</h2>
                  <p>{searchError}</p>
                </div>
              ) : searchProducts.length === 0 ? (
                <div className="no-products-container">
                  <h3>검색 결과가 없습니다</h3>
                  <p>"{searchQuery}"에 대한 상품을 찾을 수 없습니다.</p>
                </div>
              ) : (
                <div className="products-grid">
                  {searchProducts.map((product) => {
                    const mainImage = product.images?.[0];
                    const totalStock = product.sizes?.reduce((sum, size) => sum + (size.stock || 0), 0) || 0;
                    
                    return (
                      <Link key={product._id} to={`/product/${product._id}`} className="product-item">
                        <div className="product-image">
                          {mainImage ? (
                            <LazyImage 
                              src={mainImage.url} 
                              alt={mainImage.alt || product.name}
                              className="product-img"
                              placeholder="📦"
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
        ) : (
          <>
            <HeroSection />
            <CollectionsSection />
            <FeaturedProductsSection />
            <NewsletterSection />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default memo(MainPage);