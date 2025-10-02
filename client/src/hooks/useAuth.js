import { useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../utils/api';

function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserProfile = useCallback(async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        setUser(result.data);
        localStorage.setItem('user', JSON.stringify(result.data));
        window.dispatchEvent(new CustomEvent('userLogin'));
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
    } catch (error) {
      console.error('사용자 정보 조회 오류:', error);
      setError('사용자 정보를 불러오는 중 오류가 발생했습니다.');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.dispatchEvent(new CustomEvent('userLogout'));
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  return {
    user,
    loading,
    error,
    logout,
    refetch: fetchUserProfile
  };
}

export default useAuth;
