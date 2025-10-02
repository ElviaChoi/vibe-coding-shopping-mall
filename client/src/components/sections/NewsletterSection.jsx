import { useState } from 'react';

function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      // 실제 뉴스레터 구독 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000)); // 임시 지연
      setMessage('구독이 완료되었습니다!');
      setEmail('');
    } catch (error) {
      setMessage('구독 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="newsletter-section">
      <div className="section-container">
        <h2 className="section-title">뉴스레터 구독</h2>
        <p className="section-description">
          새로운 컬렉션과 특별한 이벤트 소식을 가장 먼저 받아보세요.
        </p>
        
        <form onSubmit={handleSubmit} className="newsletter-form">
          <input 
            type="email" 
            placeholder="이메일 주소를 입력하세요"
            className="newsletter-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="이메일 주소"
          />
          <button 
            type="submit" 
            className="newsletter-btn"
            disabled={isSubmitting}
            aria-label="뉴스레터 구독"
          >
            {isSubmitting ? '구독 중...' : '구독하기'}
          </button>
        </form>
        
        {message && (
          <p className="newsletter-message">{message}</p>
        )}
        
        <p className="newsletter-terms">
          구독하기 버튼 클릭 시 개인정보 처리방침에 동의하는 것으로 간주됩니다.
        </p>
      </div>
    </section>
  );
}

export default NewsletterSection;
