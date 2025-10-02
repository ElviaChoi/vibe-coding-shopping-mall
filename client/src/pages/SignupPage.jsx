import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import useAuth from '../hooks/useAuth';

function SignupPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    user_type: 'customer',
    address: ''
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

    // 비밀번호 확인 검증
    if (formData.password !== formData.confirmPassword) {
      setMessage('비밀번호가 일치하지 않습니다.');
      setLoading(false);
      return;
    }

    try {
      // confirmPassword는 서버로 전송하지 않음
      const { confirmPassword, ...userData } = formData;
      
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const result = await response.json();

      if (result.success) {
        setMessage('회원가입이 성공적으로 완료되었습니다!');
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          user_type: 'customer',
          address: ''
        });
      } else {
        setMessage(result.message || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      setMessage('서버 연결에 실패했습니다.');
      console.error('회원가입 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <Navbar user={user} loading={authLoading} onLogout={logout} />
      
      <div className="signup-container">
        <div className="signup-content">
          <h1 className="signup-title">회원가입</h1>
          <p className="signup-description">
            새로운 계정을 만들어 쇼핑을 시작하세요
          </p>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="name">이름 *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="이름을 입력하세요"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">이메일 주소 *</label>
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
            <label htmlFor="password">비밀번호 *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 생성하세요 (8자 이상)"
              required
              minLength="8"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">비밀번호 확인 *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력하세요"
              required
              minLength="8"
            />
          </div>

          <div className="form-group">
            <label htmlFor="user_type">계정 유형 *</label>
            <select
              id="user_type"
              name="user_type"
              value={formData.user_type}
              onChange={handleChange}
              required
              className="custom-select"
            >
              <option value="customer">고객</option>
              <option value="admin">관리자</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="address">주소 (선택 사항)</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="주소를 입력하세요"
            />
          </div>

          {message && (
            <div className={`message ${message.includes('성공') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? '처리 중...' : '회원가입'}
          </button>
        </form>

        <div className="back-link">
          <Link to="/">← 메인페이지로 돌아가기</Link>
        </div>
      </div>
    </div>
    </div>
  );
}

export default SignupPage;
