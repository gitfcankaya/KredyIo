/**
 * Navigation Components Usage Examples
 * Demonstrates how to use all navigation components
 */

import React from 'react';
import {
  MainNavigation,
  FooterNavigation,
  Breadcrumb,
  Container,
  HeroSection,
} from './index';
import {
  mainNavItems,
  footerSections,
  socialLinks,
  trustBadges,
  legalLinks,
  contactInfo,
} from './configs';

// ============================================
// Example 1: Complete Page Layout
// ============================================

export const CompletePageExample: React.FC = () => {
  return (
    <>
      {/* Main Navigation */}
      <MainNavigation
        logo={{
          src: '/images/logo.svg',
          alt: 'KredyIo',
          href: '/',
        }}
        items={mainNavItems}
        showSearch={true}
        searchPlaceholder="Kredi, kart veya hesaplama ara..."
        onSearch={(query) => console.log('Search:', query)}
        showLogin={true}
        loginLabel="Giriş Yap"
        onLogin={() => console.log('Login clicked')}
        showSignup={true}
        signupLabel="Üye Ol"
        onSignup={() => console.log('Signup clicked')}
        sticky={true}
        variant="light"
      />

      {/* Breadcrumb */}
      <Container variant="white" size="lg">
        <Breadcrumb
          items={[
            { id: '1', label: 'Krediler', href: '/krediler' },
            { id: '2', label: 'İhtiyaç Kredisi', href: '/krediler/ihtiyac-kredisi' },
            { id: '3', label: 'Kredi Başvurusu' },
          ]}
          showHome={true}
          enableStructuredData={true}
        />
      </Container>

      {/* Hero Section */}
      <HeroSection
        variant="gradient"
        alignment="center"
        title="En Uygun Krediyi Bulun"
        subtitle="Binlerce kredi seçeneği arasından size özel teklifler"
        description="Anında başvuru yapın, hızlı onay alın. Tüm bankalar tek platformda."
        primaryCTA={{
          label: 'Hemen Başvur',
          href: '/basvuru',
        }}
        secondaryCTA={{
          label: 'Kredileri Karşılaştır',
          href: '/karsilastir',
        }}
      />

      {/* Page Content */}
      <Container variant="white" size="lg">
        <h2>Sayfa İçeriği</h2>
        <p>Bu alana sayfa içeriği gelecek...</p>
      </Container>

      {/* Footer */}
      <FooterNavigation
        logo={{
          src: '/images/logo-white.svg',
          alt: 'KredyIo',
        }}
        tagline="Türkiye'nin Kredi ve Finans Platformu"
        description="KredyIo, tüm bankaların kredi ve kredi kartı ürünlerini karşılaştırmanızı ve en uygun teklifi bulmanızı sağlar."
        sections={footerSections}
        socialLinks={socialLinks}
        contact={contactInfo}
        newsletter={{
          title: 'Bülten',
          description: 'Kampanya ve fırsatlardan haberdar olun',
          placeholder: 'E-posta adresiniz',
          buttonText: 'Abone Ol',
          onSubmit: (email) => console.log('Newsletter:', email),
        }}
        trustBadges={trustBadges}
        copyright="© 2025 KredyIo. Tüm hakları saklıdır."
        legalLinks={legalLinks}
        variant="dark"
      />
    </>
  );
};

// ============================================
// Example 2: Hero with Calculator
// ============================================

export const HeroWithCalculatorExample: React.FC = () => {
  return (
    <HeroSection
      variant="calculator"
      alignment="left"
      title="Kredi Hesaplama"
      subtitle="Taksit ve faiz tutarınızı hemen öğrenin"
      description="Kredi miktarı, vade ve faiz oranını girerek aylık ödeme tutarınızı hesaplayın."
      calculator={
        <div className="calculator-placeholder">
          {/* Buraya CalculatorWidget component'i gelecek */}
          <p style={{ padding: '2rem', background: 'white', borderRadius: '1rem' }}>
            CalculatorWidget Component
          </p>
        </div>
      }
      minHeight="600px"
    />
  );
};

// ============================================
// Example 3: Hero with Video Background
// ============================================

export const HeroWithVideoExample: React.FC = () => {
  return (
    <HeroSection
      variant="video"
      alignment="center"
      title="Hayallerinize Yatırım Yapın"
      subtitle="KredyIo ile kredi bulmak artık çok kolay"
      backgroundVideo={{
        src: '/videos/hero-background.mp4',
        poster: '/images/hero-poster.jpg',
      }}
      overlay={true}
      overlayOpacity={0.6}
      primaryCTA={{
        label: 'Hemen Başvur',
        href: '/basvuru',
      }}
      minHeight="700px"
    />
  );
};

// ============================================
// Example 4: Different Container Variants
// ============================================

export const ContainerVariantsExample: React.FC = () => {
  return (
    <>
      <Container variant="white" size="lg">
        <h2>White Container</h2>
        <p>This container has a white background.</p>
      </Container>

      <Container variant="gray" size="lg">
        <h2>Gray Container</h2>
        <p>This container has a gray background.</p>
      </Container>

      <Container variant="gradient" size="lg">
        <h2>Gradient Container</h2>
        <p>This container has a gradient background.</p>
      </Container>

      <Container variant="transparent" size="md" noPadding>
        <h2>Transparent Container (No Padding)</h2>
        <p>This container is transparent with no padding.</p>
      </Container>
    </>
  );
};

// ============================================
// Example 5: Mobile Navigation
// ============================================

export const MobileNavigationExample: React.FC = () => {
  return (
    <MainNavigation
      logo={{
        src: '/images/logo.svg',
        alt: 'KredyIo',
      }}
      items={mainNavItems}
      showSearch={true}
      showLogin={true}
      showSignup={true}
      mobileBreakpoint={768} // Show mobile menu below 768px
      variant="light"
    />
  );
};

// ============================================
// Example 6: Logged In User Navigation
// ============================================

export const UserNavigationExample: React.FC = () => {
  return (
    <MainNavigation
      logo={{
        src: '/images/logo.svg',
        alt: 'KredyIo',
      }}
      items={mainNavItems}
      showSearch={true}
      user={{
        name: 'Ahmet Yılmaz',
        email: 'ahmet@example.com',
        avatar: '/images/avatars/user.jpg',
        menuItems: [
          { id: 'profile', label: 'Profilim', href: '/profil' },
          { id: 'applications', label: 'Başvurularım', href: '/basvurularim' },
          { id: 'favorites', label: 'Favorilerim', href: '/favoriler' },
          { id: 'settings', label: 'Ayarlar', href: '/ayarlar' },
          { id: 'logout', label: 'Çıkış Yap', href: '/cikis' },
        ],
      }}
      variant="light"
    />
  );
};

// ============================================
// Example 7: Dark Theme Navigation
// ============================================

export const DarkNavigationExample: React.FC = () => {
  return (
    <>
      <MainNavigation
        logo={{
          src: '/images/logo-white.svg',
          alt: 'KredyIo',
        }}
        items={mainNavItems}
        showSearch={true}
        showLogin={true}
        showSignup={true}
        variant="dark"
      />
      
      <FooterNavigation
        logo={{
          src: '/images/logo-white.svg',
          alt: 'KredyIo',
        }}
        sections={footerSections}
        copyright="© 2025 KredyIo"
        variant="dark"
      />
    </>
  );
};

// ============================================
// Example 8: Sticky Transparent Header
// ============================================

export const StickyTransparentHeaderExample: React.FC = () => {
  return (
    <MainNavigation
      logo={{
        src: '/images/logo-white.svg',
        alt: 'KredyIo',
      }}
      items={mainNavItems}
      showSearch={true}
      showLogin={true}
      showSignup={true}
      sticky={true}
      transparentOnTop={true} // Transparent when at top, solid when scrolled
      variant="gradient"
    />
  );
};
