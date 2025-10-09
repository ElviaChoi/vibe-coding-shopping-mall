import { useState, useCallback, useEffect } from 'react';
import { newsletterAPI } from '../../utils/api';
import '../../styles/components/sections/NewsletterSection.css';

function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', 'info'
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showUnsubscribeForm, setShowUnsubscribeForm] = useState(false);

  // 이메일 입력 시 구독 상태 확인
  const checkSubscriptionStatus = useCallback(async (emailToCheck) => {
    if (!emailToCheck.trim()) return;
    
    try {
      const response = await newsletterAPI.checkStatus(emailToCheck.trim());
      if (response.success) {
        setIsSubscribed(response.data.isSubscribed);
      }
    } catch (error) {
      // 구독 상태 확인 실패 시 기본값 유지
      console.log('구독 상태 확인 실패:', error.message);
    }
  }, []);

  // 이메일 변경 시 구독 상태 확인 (디바운스)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (email.trim()) {
        checkSubscriptionStatus(email);
      } else {
        setIsSubscribed(false);
        setShowUnsubscribeForm(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [email, checkSubscriptionStatus]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage('이메일 주소를 입력해주세요.');
      setMessageType('error');
      return;
    }

    // 이메일 형식 검사
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email.trim())) {
      setMessage('올바른 이메일 형식이 아닙니다.');
      setMessageType('error');
      return;
    }

    setIsSubmitting(true);
    setMessage('');
    setMessageType('');

    try {
      const response = await newsletterAPI.subscribe(email.trim(), {
        frequency: 'monthly',
        categories: ['women', 'men', 'accessories']
      });

      if (response.success) {
        setMessage('뉴스레터 구독이 완료되었습니다! 새로운 소식을 가장 먼저 받아보세요.');
        setMessageType('success');
        setIsSubscribed(true);
        setShowUnsubscribeForm(false);
        setEmail('');
      } else {
        setMessage(response.message || '구독 중 오류가 발생했습니다.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('뉴스레터 구독 오류:', error);
      
      // 에러 메시지 처리
      if (error.message.includes('409')) {
        setMessage('이미 구독 중인 이메일 주소입니다.');
        setMessageType('info');
        setIsSubscribed(true);
        setShowUnsubscribeForm(true);
      } else if (error.message.includes('400')) {
        setMessage('올바른 이메일 형식이 아닙니다.');
        setMessageType('error');
      } else {
        setMessage('구독 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        setMessageType('error');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [email]);

  const handleUnsubscribe = useCallback(async () => {
    if (!email.trim()) {
      setMessage('이메일 주소를 입력해주세요.');
      setMessageType('error');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await newsletterAPI.unsubscribe(email.trim());
      
      if (response.success) {
        setMessage('뉴스레터 구독이 해지되었습니다.');
        setMessageType('success');
        setIsSubscribed(false);
        setShowUnsubscribeForm(false);
        setEmail('');
      } else {
        setMessage(response.message || '구독 해지 중 오류가 발생했습니다.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('뉴스레터 구독 해지 오류:', error);
      setMessage('구독 해지 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  }, [email]);

  const handleEmailChange = useCallback((e) => {
    setEmail(e.target.value);
    // 입력 시 메시지 초기화
    if (message) {
      setMessage('');
      setMessageType('');
    }
  }, [message]);

  const toggleUnsubscribeForm = useCallback(() => {
    setShowUnsubscribeForm(!showUnsubscribeForm);
    if (message) {
      setMessage('');
      setMessageType('');
    }
  }, [showUnsubscribeForm, message]);

  return (
    <section className="newsletter-section">
      <div className="section-container">
        <h2 className="section-title">뉴스레터 구독</h2>
        <p className="section-description">
          새로운 컬렉션과 특별한 이벤트 소식을 가장 먼저 받아보세요.
        </p>
        
        {/* 구독 폼 */}
        <form onSubmit={handleSubmit} className="newsletter-form">
          <input 
            type="email" 
            placeholder="이메일 주소를 입력하세요"
            className="newsletter-input"
            value={email}
            onChange={handleEmailChange}
            required
            disabled={isSubmitting}
            aria-label="이메일 주소"
          />
          <button 
            type="submit" 
            className="newsletter-btn"
            disabled={isSubmitting || !email.trim()}
            aria-label="뉴스레터 구독"
          >
            {isSubmitting ? '처리 중...' : '구독하기'}
          </button>
        </form>

        {/* 구독 상태 표시 및 해지 옵션 */}
        {email.trim() && (
          <div className="newsletter-status">
            {isSubscribed ? (
              <div className="subscription-status subscribed">
                <span className="status-icon">✓</span>
                <span className="status-text">이 이메일은 구독 중입니다</span>
                <button 
                  type="button"
                  className="unsubscribe-toggle-btn"
                  onClick={toggleUnsubscribeForm}
                >
                  {showUnsubscribeForm ? '취소' : '구독 해지'}
                </button>
              </div>
            ) : (
              <div className="subscription-status not-subscribed">
                <span className="status-icon">○</span>
                <span className="status-text">이 이메일은 구독되지 않았습니다</span>
              </div>
            )}
          </div>
        )}

        {/* 구독 해지 폼 */}
        {showUnsubscribeForm && (
          <div className="newsletter-unsubscribe-form">
            <p className="unsubscribe-confirm-text">
              정말로 뉴스레터 구독을 해지하시겠습니까?
            </p>
            <div className="unsubscribe-actions">
              <button 
                type="button"
                className="unsubscribe-confirm-btn"
                onClick={handleUnsubscribe}
                disabled={isSubmitting}
              >
                {isSubmitting ? '처리 중...' : '네, 해지합니다'}
              </button>
              <button 
                type="button"
                className="unsubscribe-cancel-btn"
                onClick={toggleUnsubscribeForm}
                disabled={isSubmitting}
              >
                취소
              </button>
            </div>
          </div>
        )}
        
        {/* 메시지 표시 */}
        {message && (
          <div className={`newsletter-message ${messageType}`}>
            {message}
          </div>
        )}
        
        <p className="newsletter-terms">
          구독하기 버튼 클릭 시 개인정보 처리방침에 동의하는 것으로 간주됩니다.
        </p>
      </div>
    </section>
  );
}

export default NewsletterSection;
