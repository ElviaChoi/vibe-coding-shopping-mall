import React from 'react';
import './ProductImageGallery.css';

const ProductImageGallery = ({ images, selectedImageIndex, onImageSelect }) => {
  if (!images || images.length === 0) {
    return (
      <div className="product-image-gallery">
        <div className="main-image">
          <div className="image-placeholder">
            <svg width="100" height="100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-image-gallery">
      <div className="main-image">
        <img 
          src={images[selectedImageIndex]?.url} 
          alt={images[selectedImageIndex]?.alt || '상품 이미지'} 
        />
      </div>
      
      {images.length > 1 && (
        <div className="thumbnail-images">
          {images.map((image, index) => (
            <button
              key={index}
              className={`thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
              onClick={() => onImageSelect(index)}
            >
              <img src={image.url} alt={image.alt || `상품 이미지 ${index + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
