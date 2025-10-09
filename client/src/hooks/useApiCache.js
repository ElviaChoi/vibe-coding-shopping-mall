import { useState, useEffect, useCallback, useRef } from 'react';

// 간단한 메모리 캐시
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5분

export const useApiCache = (key, apiCall, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  
  const { 
    enabled = true, 
    cacheDuration = CACHE_DURATION,
    refetchOnMount = false 
  } = options;

  const execute = useCallback(async (...args) => {
    // 이전 요청 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    // 캐시 확인
    const cacheKey = `${key}_${JSON.stringify(args)}`;
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < cacheDuration && !refetchOnMount) {
      setData(cached.data);
      setError(null);
      return cached.data;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall(...args, abortControllerRef.current.signal);
      
      // 캐시에 저장
      cache.set(cacheKey, { 
        data: result, 
        timestamp: Date.now() 
      });
      
      setData(result);
      setError(null);
      return result;
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('API 호출 에러:', err);
        setError(err.message || '데이터를 불러오는데 실패했습니다.');
        // 에러를 다시 throw하지 않음
      }
    } finally {
      setLoading(false);
    }
  }, [key, apiCall, cacheDuration, refetchOnMount]);

  useEffect(() => {
    if (enabled) {
      execute();
    }
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [enabled, execute]);

  const invalidateCache = useCallback(() => {
    const keysToDelete = Array.from(cache.keys()).filter(k => k.startsWith(key));
    keysToDelete.forEach(k => cache.delete(k));
  }, [key]);

  return { 
    data, 
    loading, 
    error, 
    execute, 
    invalidateCache 
  };
};

// 캐시 클리어 유틸리티
export const clearApiCache = () => {
  cache.clear();
};

// 특정 키의 캐시만 클리어
export const clearApiCacheByKey = (key) => {
  const keysToDelete = Array.from(cache.keys()).filter(k => k.startsWith(key));
  keysToDelete.forEach(k => cache.delete(k));
};
