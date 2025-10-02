import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../../utils/api';

function CollectionsSection() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 컬렉션 데이터 로드
  useEffect(() => {
    const loadCollections = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 각 카테고리별로 대표 상품 이미지 조회
        const categories = ['women', 'men', 'accessories'];
        const collectionPromises = categories.map(async (category) => {
          try {
            const response = await productAPI.getProducts({
              mainCategory: category,
              limit: 1,
              isActive: true
            });
            
            const representativeProduct = response.data?.[0];
            const mainImage = representativeProduct?.images?.[0];
            
            return {
              id: category,
              title: getCategoryTitle(category),
              description: getCategoryDescription(category),
              imageClass: category,
              productCount: response.pagination?.totalProducts || 0,
              hasProducts: (response.pagination?.totalProducts || 0) > 0,
              representativeImage: mainImage ? {
                url: mainImage.url,
                alt: mainImage.alt || representativeProduct.name
              } : null,
              representativeProduct: representativeProduct
            };
          } catch (err) {
            console.error(`${category} 카테고리 로드 오류:`, err);
            return {
              id: category,
              title: getCategoryTitle(category),
              description: getCategoryDescription(category),
              imageClass: category,
              productCount: 0,
              hasProducts: false,
              representativeImage: null,
              representativeProduct: null
            };
          }
        });
        
        const collectionsData = await Promise.all(collectionPromises);
        setCollections(collectionsData);
      } catch (err) {
        console.error('컬렉션 로드 오류:', err);
        setError('컬렉션을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadCollections();
  }, []);

  // 카테고리 제목 매핑
  const getCategoryTitle = (category) => {
    const titles = {
      women: '여성 컬렉션',
      men: '남성 컬렉션',
      accessories: '악세사리'
    };
    return titles[category] || category;
  };

  // 카테고리 설명 매핑
  const getCategoryDescription = (category) => {
    const descriptions = {
      women: '세련되고 편안한 일상복',
      men: '모던한 실용적인 스타일',
      accessories: '완성도 높은 디테일'
    };
    return descriptions[category] || '다양한 상품을 만나보세요';
  };

  // 로딩 상태
  if (loading) {
    return (
      <section className="collections-section">
        <div className="section-container">
          <h2 className="section-title">컬렉션 둘러보기</h2>
          <p className="section-description">
            각각의 제품은 신중하게 선택된 소재와 정교한 디테일로 제작됩니다.
          </p>
          
          <div className="collections-grid">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="collection-item loading">
                <div className="collection-image">
                  <div className="image-placeholder loading-placeholder"></div>
                </div>
                <div className="collection-info">
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
      <section className="collections-section">
        <div className="section-container">
          <h2 className="section-title">컬렉션 둘러보기</h2>
          <p className="section-description">
            각각의 제품은 신중하게 선택된 소재와 정교한 디테일로 제작됩니다.
          </p>
          <div className="error-message">
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="collections-section">
      <div className="section-container">
        <h2 className="section-title">컬렉션 둘러보기</h2>
        <p className="section-description">
          각각의 제품은 신중하게 선택된 소재와 정교한 디테일로 제작됩니다.
        </p>
        
        <div className="collections-grid">
          {collections.map((collection) => (
            <Link 
              key={collection.id} 
              to={collection.hasProducts ? `/${collection.id}` : '#'}
              className={`collection-item ${!collection.hasProducts ? 'disabled' : ''}`}
              onClick={(e) => !collection.hasProducts && e.preventDefault()}
            >
              <div className="collection-image">
                {collection.representativeImage ? (
                  <img 
                    src={collection.representativeImage.url} 
                    alt={collection.representativeImage.alt}
                    className="collection-product-image"
                  />
                ) : (
                <div className={`image-placeholder ${collection.imageClass}`} 
                     role="img" 
                       aria-label={`${collection.title} 이미지`}>
                    📦
                  </div>
                )}
              </div>
              <div className="collection-info">
                <h3>{collection.title}</h3>
                <p>{collection.description}</p>
                {!collection.hasProducts && (
                  <span className="no-products">상품 준비 중</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CollectionsSection;
