import { memo } from 'react';
import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/sections/HeroSection';
import CollectionsSection from '../components/sections/CollectionsSection';
import FeaturedProductsSection from '../components/sections/FeaturedProductsSection';
import NewsletterSection from '../components/sections/NewsletterSection';
import Footer from '../components/layout/Footer';
import useAuth from '../hooks/useAuth';

function MainPage() {
  const { user, loading, error, logout } = useAuth();

  return (
    <div className="cos-main">
      <Navbar user={user} loading={loading} onLogout={logout} />
      
      {error && (
        <div className="error-banner" role="alert">
          <p>{error}</p>
        </div>
      )}

      <main>
        <HeroSection />
        <CollectionsSection />
        <FeaturedProductsSection />
        <NewsletterSection />
      </main>

      <Footer />
    </div>
  );
}

export default memo(MainPage);