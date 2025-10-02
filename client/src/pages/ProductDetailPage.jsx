import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { productAPI, cartAPI } from '../utils/api';
import { useCart } from '../contexts/CartContext';
import useAuth from '../hooks/useAuth';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, loading: authLoading, error: authError, logout } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await productAPI.getProduct(id);
        
        if (response.success) {
          setProduct(response.data);
          // 첫 번째 사이즈를 기본 선택으로 설정
          if (response.data.sizes && response.data.sizes.length > 0) {
            setSelectedSize(response.data.sizes[0].size);
          }
        } else {
          setError('상품을 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('상품 로드 오류:', err);
        setError('상품을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert('사이즈를 선택해주세요.');
      return;
    }

    if (quantity <= 0) {
      alert('수량을 선택해주세요.');
      return;
    }

    try {
      setAddingToCart(true);
      
      const result = await addToCart(id, selectedSize, quantity);
      
      if (result.success) {
        alert('장바구니에 추가되었습니다!');
      } else {
        alert(result.message || '장바구니 추가에 실패했습니다.');
      }
    } catch (error) {
      console.error('장바구니 추가 오류:', error);
      alert('장바구니 추가 중 오류가 발생했습니다.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    // 바로 구매 로직
    alert('구매 페이지로 이동합니다!');
  };

  if (loading) {
    return (
      <div className="App">
        <Navbar user={user} loading={authLoading} onLogout={logout} />
        <div className="page-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>상품 정보를 불러오는 중...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="App">
        <Navbar user={user} loading={authLoading} onLogout={logout} />
        <div className="page-container">
          <div className="error-container">
            <h2>상품을 찾을 수 없습니다</h2>
            <p>{error || '요청하신 상품이 존재하지 않습니다.'}</p>
            <button onClick={() => navigate(-1)} className="btn-primary">뒤로 가기</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const mainImage = product.images?.[selectedImageIndex] || product.images?.[0];
  const totalStock = product.sizes?.reduce((sum, size) => sum + (size.stock || 0), 0) || 0;
  const selectedSizeStock = product.sizes?.find(size => size.size === selectedSize)?.stock || 0;
  const hasMultipleImages = product.images && product.images.length > 1;
  const isAdmin = user?.user_type === 'admin';

  return (
    <div className="App">
      <Navbar user={user} loading={authLoading} onLogout={logout} />
      <div className="page-container">
        <div className="product-detail-page">

          <div className="product-detail-content">
            {/* 상품 이미지 섹션 */}
            <div className="product-images">
              <div className="main-image">
                {mainImage ? (
                  <img 
                    src={mainImage.url} 
                    alt={mainImage.alt || product.name}
                    className="product-main-image"
                  />
                ) : (
                  <div className="image-placeholder no-image">
                    📦
                  </div>
                )}
              </div>
              
              {/* 썸네일 이미지들 */}
              {hasMultipleImages && (
                <div className="thumbnail-images">
                  {product.images.map((image, index) => (
                    <div 
                      key={index}
                      className={`thumbnail-image ${selectedImageIndex === index ? 'active' : ''}`}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <img 
                        src={image.url} 
                        alt={image.alt || `${product.name} 이미지 ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 상품 정보 섹션 */}
            <div className="product-info">
              <div className="product-category">{product.mainCategory === 'women' ? '여성' : product.mainCategory === 'men' ? '남성' : '악세사리'}</div>
              <h1 className="product-title">{product.name}</h1>
              <div className="product-price">₩{product.price?.toLocaleString()}</div>
              {product.description && (
                <p className="product-description">
                  {product.description}
                </p>
              )}

              {/* 사이즈 선택 */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="size-selection">
                  <label className="selection-label">사이즈</label>
                  <div className="size-buttons">
                    {product.sizes.map((size) => (
                      <button
                        key={size.size}
                        className={`size-btn ${selectedSize === size.size ? 'selected' : ''} ${size.stock === 0 ? 'out-of-stock' : ''}`}
                        onClick={() => setSelectedSize(size.size)}
                        disabled={size.stock === 0}
                      >
                        {size.size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 수량 선택 */}
              <div className="quantity-selection">
                <label className="selection-label">수량</label>
                <div className="quantity-controls">
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="quantity-display">{quantity}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= selectedSizeStock}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 액션 버튼들 */}
              {!isAdmin && (
                <div className="product-actions-buttons">
                  <button 
                    className="btn-primary add-to-cart-btn"
                    onClick={handleAddToCart}
                    disabled={!selectedSize || selectedSizeStock === 0 || addingToCart}
                  >
                    {addingToCart ? '추가 중...' : '장바구니에 추가'}
                  </button>
                  <button 
                    className="btn-secondary buy-now-btn"
                    onClick={handleBuyNow}
                    disabled={!selectedSize || selectedSizeStock === 0}
                  >
                    바로 구매
                  </button>
                </div>
              )}
              
              {isAdmin && (
                <div className="admin-notice">
                  <p>👨‍💼 관리자 계정으로 로그인되어 있어 구매 기능이 비활성화되었습니다.</p>
                </div>
              )}


              {/* 배송 및 반품 정보 */}
              <div className="shipping-info">
                <h3>배송 및 반품</h3>
                <ul className="shipping-list">
                  <li>무료배송 (3만원 이상 구매시)</li>
                  <li>주문 후 2-3일 내 배송</li>
                  <li>30일 무료 반품 가능</li>
                  <li>교환 및 환불 문의: 고객센터 1588-0000</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
