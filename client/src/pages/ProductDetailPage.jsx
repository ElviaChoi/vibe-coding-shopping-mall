import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { productAPI, cartAPI } from '../utils/api';
import { useCart } from '../contexts/CartContext';
import useAuth from '../hooks/useAuth';
import {
  ProductImageGallery,
  ProductInfo
} from '../components/product';

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

  const selectedSizeStock = product.sizes?.find(size => size.size === selectedSize)?.stock || 0;
  const isAdmin = user?.user_type === 'admin';

  return (
    <div className="App">
      <Navbar user={user} loading={authLoading} onLogout={logout} />
      <div className="page-container">
        <div className="product-detail-page">

          <div className="product-detail-content">
            <ProductImageGallery 
              images={product.images}
              selectedImageIndex={selectedImageIndex}
              onImageSelect={setSelectedImageIndex}
            />

            <div className="product-info-container">
              <ProductInfo 
                product={product}
                selectedSize={selectedSize}
                onSizeSelect={setSelectedSize}
                quantity={quantity}
                onQuantityChange={setQuantity}
                selectedSizeStock={selectedSizeStock}
                isAdmin={isAdmin}
                onAddToCart={handleAddToCart}
                addingToCart={addingToCart}
                user={user}
              />

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
