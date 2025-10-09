import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../common/Modal';
import { productAPI } from '../../utils/api';
import './ProductEditModal.css';

const ProductEditModal = React.memo(({ 
  product, 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    isFeatured: false,
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 상품 데이터로 폼 초기화
  useEffect(() => {
    if (isOpen && product) {
      setFormData({
        name: product.name || '',
        price: product.price || '',
        description: product.description || '',
        isFeatured: Boolean(product.isFeatured),
        isActive: product.isActive !== false
      });
      setError(null);
    }
  }, [product, isOpen]);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!product || !product._id) {
      setError('상품 정보를 찾을 수 없습니다.');
      return;
    }
    
    if (!formData.name.trim() || !formData.price) {
      setError('상품명과 가격은 필수 입력 항목입니다.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updateData = {
        name: formData.name.trim(),
        price: parseInt(formData.price, 10),
        description: formData.description.trim(),
        isFeatured: formData.isFeatured,
        isActive: formData.isActive
      };

      const response = await productAPI.updateProduct(product._id, updateData);
      
      if (response.success) {
        onSave(response.data);
        onClose();
      } else {
        setError(response.message || '상품 수정에 실패했습니다.');
      }
    } catch (err) {
      console.error('상품 수정 오류:', err);
      setError(err.message || '상품 수정 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [formData, product, onSave, onClose]);

  // isOpen이 false거나 product가 없으면 렌더링하지 않음
  if (!isOpen || !product) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="상품 수정"
      size="medium"
    >
      <form onSubmit={handleSubmit} className="product-edit-form">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="name">상품명 *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="상품명을 입력하세요"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">가격 (₩) *</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="0"
            min="0"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">상품 설명</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="상품에 대한 설명을 입력하세요"
            rows="4"
            disabled={loading}
          />
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleInputChange}
              disabled={loading}
            />
            <span className="checkbox-text">추천 상품으로 설정</span>
          </label>
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              disabled={loading}
            />
            <span className="checkbox-text">상품 활성화</span>
          </label>
        </div>

        <div className="modal-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            취소
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? '저장 중...' : '저장'}
          </button>
        </div>
      </form>
    </Modal>
  );
});

ProductEditModal.displayName = 'ProductEditModal';

export default ProductEditModal;
