import { Link } from 'react-router-dom';

function Footer() {
  const footerSections = [
    {
      title: '고객서비스',
      links: [
        { to: '/contact', text: '문의하기' },
        { to: '/size-guide', text: '사이즈 가이드' },
        { to: '/shipping', text: '배송 안내' },
        { to: '/returns', text: '교환/반품' }
      ]
    },
    {
      title: '회사',
      links: [
        { to: '/about', text: '회사 소개' },
        { to: '/careers', text: '채용 정보' },
        { to: '/press', text: '보도 자료' },
        { to: '/sustainability', text: '지속가능성' }
      ]
    },
    {
      title: 'SNS',
      links: [
        { href: '#', text: '인스타그램', external: true },
        { href: '#', text: '페이스북', external: true },
        { href: '#', text: '유튜브', external: true },
        { href: '#', text: '네이버 블로그', external: true }
      ]
    }
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section">
            <h3>COS</h3>
            <p>미니멀 라이프스타일을 추구하는 모든 분들을 위한 브랜드</p>
          </div>
          
          {footerSections.map((section) => (
            <div key={section.title} className="footer-section">
              <h4>{section.title}</h4>
              <ul>
                {section.links.map((link) => (
                  <li key={link.text}>
                    {link.external ? (
                      <a href={link.href} target="_blank" rel="noopener noreferrer">
                        {link.text}
                      </a>
                    ) : (
                      <Link to={link.to}>{link.text}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 COS. All rights reserved.</p>
          <div className="footer-links">
            <Link to="/privacy">개인정보처리방침</Link>
            <Link to="/terms">이용약관</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
