import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../../utils/api';

function FeaturedProductsSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 추천 상품 로드
  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 추천 상품만 조회 (isFeatured: true인 상품들만)
        const response = await productAPI.getProducts({
          limit: 8, // 더 많은 추천 상품을 가져와서 4개만 표시
          isFeatured: true,
          isActive: true
        });
        
        if (response.success) {
          // 추천 상품만 필터링하여 최대 4개까지 표시
          const featuredProducts = (response.data || []).filter(product => product.isFeatured === true);
          setProducts(featuredProducts.slice(0, 4));
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

    loadFeaturedProducts();
  }, []);

  // 로딩 상태
  if (loading) {
    return (
      <section className="featured-section">
        <div className="section-container">
          <h2 className="section-title">추천 상품</h2>
          <p className="section-description">
            이번 시즌 가장 사랑받는 아이템들을 만나보세요.
          </p>
          <div className="products-grid">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="product-item loading">
                <div className="product-image">
                  <div className="image-placeholder loading-placeholder"></div>
                </div>
                <div className="product-info">
                  <div className="loading-text"></div>
                  <div className="loading-text short"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <section className="featured-section">
        <div className="section-container">
          <h2 className="section-title">추천 상품</h2>
          <p className="section-description">
            이번 시즌 가장 사랑받는 아이템들을 만나보세요.
          </p>
          <div className="error-message">
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="featured-section">
      <div className="section-container">
        <h2 className="section-title">추천 상품</h2>
        <p className="section-description">
          이번 시즌 가장 사랑받는 아이템들을 만나보세요.
        </p>
        
        <div className="products-grid">
          {products.length === 0 ? (
            <div className="no-products">
              <p>추천 상품이 없습니다.</p>
              <p className="no-products-subtitle">관리자 페이지에서 상품을 추천으로 설정해주세요.</p>
            </div>
          ) : (
            products.map((product) => {
              const mainImage = product.images?.[0];
              const totalStock = product.sizes?.reduce((sum, size) => sum + (size.stock || 0), 0) || 0;
              const isFeatured = product.isFeatured;
              
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
                    {isFeatured && (
                      <span className="sale-badge" aria-label="추천 상품">추천</span>
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
            })
          )}
        </div>
        
        <div className="section-actions">
          <Link to="/recommended" className="btn-outline">추천 상품 더보기</Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProductsSection;
