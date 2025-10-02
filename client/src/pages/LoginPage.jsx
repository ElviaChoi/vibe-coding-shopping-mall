import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import useAuth from '../hooks/useAuth';

function LoginPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'email' ? value.toLowerCase() : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        setMessage('로그인이 성공했습니다!');
        // 토큰을 localStorage에 저장
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        
        // 로그인 성공 후 메인페이지로 이동
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        setMessage(result.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      setMessage('서버 연결에 실패했습니다.');
      console.error('로그인 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Navbar user={user} loading={authLoading} onLogout={logout} />
      
      <div className="login-container">
        <div className="login-content">
          <h1 className="login-title">로그인</h1>
          <p className="login-description">
            계정에 로그인하여 쇼핑을 시작하세요
          </p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">이메일 주소</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="이메일을 입력하세요"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">비밀번호</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>

            <button 
              type="submit" 
              className="login-btn"
              disabled={loading}
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          {message && (
            <div className={`message ${message.includes('성공') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <div className="signup-link">
            아직 계정이 없으신가요? 
            <Link to="/signup"> 회원가입</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
