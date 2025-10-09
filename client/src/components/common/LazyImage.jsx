import React, { useState, useRef, useEffect, useCallback } from 'react';
import './LazyImage.css';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = '📦',
  onLoad,
  onError,
  threshold = 0.1,
  rootMargin = '50px',
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    // Intersection Observer 설정
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observerRef.current.observe(img);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [threshold, rootMargin]);

  return (
    <div 
      ref={imgRef}
      className={`lazy-image-container ${className}`}
      {...props}
    >
      {!isInView ? (
        // 뷰포트에 들어오기 전까지 플레이스홀더 표시
        <div className="lazy-image-placeholder">
          {placeholder}
        </div>
      ) : hasError ? (
        // 에러 발생 시 플레이스홀더 표시
        <div className="lazy-image-error">
          {placeholder}
        </div>
      ) : (
        // 실제 이미지 로드
        <img
          src={src}
          alt={alt}
          className={`lazy-image ${isLoaded ? 'loaded' : 'loading'}`}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
};

export default LazyImage;
