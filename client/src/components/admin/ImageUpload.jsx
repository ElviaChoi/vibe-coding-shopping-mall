import React from 'react';

const ImageUpload = ({ 
  images, 
  onUpload, 
  onRemove 
}) => {
  return (
    <div className="image-section">
      <h3>상품 이미지</h3>
      <div className="image-upload-area">
        <div className="upload-label" onClick={onUpload}>
          <div className="upload-icon">📤</div>
          <p>Cloudinary를 통해 이미지를 업로드하세요</p>
          <button type="button" className="upload-btn">+ 이미지 추가</button>
        </div>
      </div>

      {images.length > 0 && (
        <div className="image-preview">
          {images.map((image, index) => (
            <div key={index} className="preview-item">
              <img 
                src={image.url} 
                alt={image.alt}
                onLoad={() => {}}
                onError={() => console.error('이미지 로드 실패:', image.url)}
              />
              <div className="image-actions">
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => onRemove(index)}
                >
                  삭제
                </button>
              </div>
              {image.isMain && (
                <div className="main-badge">메인 이미지</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
