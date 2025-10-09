import { Link } from 'react-router-dom';
import { useState } from 'react';
import '../../styles/components/sections/HeroSection.css';

function HeroSection() {
  const [hoveredButton, setHoveredButton] = useState(null);

  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">미니멀한 아름다움을<br />일상에서 만나다</h1>
        <p className="hero-description">
          시간을 초월한 디자인과 지속 가능한 소재로 만든,<br />현대적이고 세련된 스타일을
          만나보세요.
        </p>
        <div className="hero-buttons">
          <div className="button-wrapper">
            <Link 
              to="/women" 
              className={`btn-secondary women-btn ${hoveredButton === 'men' ? 'inverted' : ''}`}
              onMouseEnter={() => setHoveredButton('women')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              여성 컬렉션
            </Link>
            <Link 
              to="/men" 
              className={`btn-secondary men-btn ${hoveredButton === 'women' ? 'inverted' : ''}`}
              onMouseEnter={() => setHoveredButton('men')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              남성 컬렉션
            </Link>
          </div>
        </div>
      </div>
      <div className="hero-image">
        <div className="placeholder-image">
          <div className="image-placeholder" role="img" aria-label="미니멀 패션 이미지"></div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
