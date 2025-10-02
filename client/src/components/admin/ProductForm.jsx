import React from 'react';

const ProductForm = ({ 
  formData, 
  onInputChange, 
  selectedSizes, 
  onSizeToggle, 
  onStockChange,
  sizeOptions,
  mainCategories,
  subCategories 
}) => {
  return (
    <div className="form-left">
      <div className="form-section">
        <h3>상품 정보</h3>
        <div className="form-group">
          <label htmlFor="name">상품명</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={onInputChange}
            placeholder="상품명 입력"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">설명</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={onInputChange}
            placeholder="상품을 설명해주세요..."
            rows="4"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="mainCategory">카테고리</label>
          <select
            id="mainCategory"
            name="mainCategory"
            value={formData.mainCategory}
            onChange={onInputChange}
            required
          >
            <option value="">카테고리 선택</option>
            {mainCategories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {formData.mainCategory && (
          <div className="form-group">
            <label htmlFor="subCategory">서브 카테고리</label>
            <select
              id="subCategory"
              name="subCategory"
              value={formData.subCategory}
              onChange={onInputChange}
              required
            >
              <option value="">서브 카테고리 선택</option>
              {subCategories[formData.mainCategory]?.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="sku">SKU</label>
          <input
            type="text"
            id="sku"
            name="sku"
            value={formData.sku}
            onChange={onInputChange}
            placeholder="상품 SKU"
            required
          />
        </div>
      </div>

      <div className="form-section">
        <h3>가격</h3>
        <div className="form-group">
          <label htmlFor="price">가격 (₩)</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={onInputChange}
            placeholder="0"
            min="0"
            required
          />
        </div>
      </div>

      <div className="form-section">
        <h3>재고</h3>
        {formData.mainCategory !== 'accessories' && (
          <>
            <div className="form-group">
              <label>사용 가능한 사이즈</label>
              <div className="size-buttons">
                {sizeOptions.map(size => (
                  <button
                    key={size}
                    type="button"
                    className={`size-btn ${selectedSizes.includes(size) ? 'selected' : ''}`}
                    onClick={() => onSizeToggle(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {selectedSizes.length > 0 && (
              <div className="form-group">
                <label>사이즈별 재고 수량</label>
                <div className="stock-inputs">
                  {selectedSizes.map(size => (
                    <div key={size} className="stock-input-group">
                      <label>{size}</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.sizes.find(s => s.size === size)?.stock || 0}
                        onChange={(e) => onStockChange(size, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {formData.mainCategory === 'accessories' && (
          <div className="form-group">
            <label>재고 수량</label>
            <input
              type="number"
              min="0"
              value={formData.sizes.find(s => s.size === 'Free')?.stock || 0}
              onChange={(e) => onStockChange('Free', e.target.value)}
              placeholder="재고 수량을 입력하세요"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductForm;
