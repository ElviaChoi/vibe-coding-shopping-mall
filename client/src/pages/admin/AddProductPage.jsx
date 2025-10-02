import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';
import ProductForm from '../../components/admin/ProductForm';
import ImageUpload from '../../components/admin/ImageUpload';
import { useProductForm } from '../../hooks/useProductForm';
import { useCloudinary } from '../../hooks/useCloudinary';
import { useProductSubmit } from '../../hooks/useProductSubmit';
import { SIZE_OPTIONS, MAIN_CATEGORIES, SUB_CATEGORIES } from '../../constants/productConstants';
import '../../styles/pages/admin/AddProductPage.css';

const AddProductPage = () => {
  const navigate = useNavigate();
  
  const {
    formData,
    selectedSizes,
    isLoading,
    error,
    setError,
    setIsLoading,
    handleInputChange,
    handleSizeToggle,
    handleStockChange,
    handleImageUpload,
    removeImage
  } = useProductForm();

  const { openWidget } = useCloudinary(handleImageUpload);
  const { submitProduct } = useProductSubmit();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitProduct(formData, selectedSizes, setError, setIsLoading, navigate);
  };

  const handleSaveDraft = () => {
    alert('임시 저장되었습니다.');
  };

  return (
    <div className="add-product-page">
      <div className="page-header">
        <div className="header-content">
          <div className="page-title">
            <h1>새 상품 추가</h1>
            <p>상점에 새 상품을 등록하세요.</p>
          </div>
          <div className="back-button" onClick={() => navigate('/admin/products')}>
            <HiArrowLeft size={16} />
            <span className="back-text">상품 관리</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div className="form-container">
        <form onSubmit={handleSubmit} className="product-form">
          <ProductForm
            formData={formData}
            onInputChange={handleInputChange}
            selectedSizes={selectedSizes}
            onSizeToggle={handleSizeToggle}
            onStockChange={handleStockChange}
            sizeOptions={SIZE_OPTIONS}
            mainCategories={MAIN_CATEGORIES}
            subCategories={SUB_CATEGORIES}
          />

          <div className="form-right">
            <ImageUpload
              images={formData.images}
              onUpload={openWidget}
              onRemove={removeImage}
            />

            <div className="action-buttons">
              <button 
                type="submit" 
                className="create-btn"
                disabled={isLoading}
              >
                {isLoading ? '등록 중...' : '상품 등록'}
              </button>
              <button 
                type="button" 
                className="draft-btn" 
                onClick={handleSaveDraft}
                disabled={isLoading}
              >
                임시 저장
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;
