/**
 * Product Detail Page
 * Detailed view of a single financial product with full information
 */

import React, { useState } from 'react';
import MainNavigation from '../components/Navigation/MainNavigation';
import FooterNavigation from '../components/Navigation/FooterNavigation';
import Breadcrumb from '../components/Navigation/Breadcrumb';
import Container from '../components/Navigation/Container';
import CalculatorWidget from '../components/CalculatorWidget/CalculatorWidget';
import { InfoCard, FeaturePills, TestimonialCard, FAQAccordion, TrustBadges } from '../components/UI';
import type { Product } from '../components/ProductCard/types';
import type { CalculatorConfig } from '../components/CalculatorWidget/types';
import type { FAQItem, Testimonial, TrustBadge } from '../components/UI/types';
import { mainNavItems, footerSections } from '../components/Navigation/configs';
import './Pages.css';

interface ProductDetailPageProps {
  product: Product;
  calculator?: CalculatorConfig;
  faqs?: FAQItem[];
  testimonials?: Testimonial[];
  relatedProducts?: Product[];
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  calculator,
  faqs = [],
  testimonials = [],
  relatedProducts = [],
}) => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'features' | 'calculator' | 'reviews'>('overview');

  const breadcrumbItems = [
    { id: '1', label: 'Anasayfa', href: '/' },
    { id: '2', label: product.category || 'Ürünler', href: `/${product.category || 'products'}` },
    { id: '3', label: product.name, href: '#' },
  ];

  const trustBadges: TrustBadge[] = [
    {
      id: '1',
      name: 'SSL Güvenli',
      type: 'ssl',
      icon: '/badges/ssl.svg',
      description: '256-bit SSL şifreleme',
    },
    {
      id: '2',
      name: 'KVKK Uyumlu',
      type: 'kvkk',
      icon: '/badges/kvkk.svg',
      description: 'Kişisel verilerin korunması',
    },
    {
      id: '3',
      name: 'ETBİS',
      type: 'etbis',
      icon: '/badges/etbis.svg',
      description: 'Elektronik Ticaret Bilgi Sistemi',
    },
  ];

  const featurePills = (product.features || []).map((feature: string, index: number) => ({
    id: `feature-${index}`,
    label: feature,
    variant: 'primary' as const,
  }));

  const tabs = [
    { id: 'overview', label: 'Genel Bakış', icon: '📋' },
    { id: 'features', label: 'Özellikler', icon: '✨' },
    { id: 'calculator', label: 'Hesaplama', icon: '🔢' },
    { id: 'reviews', label: 'Yorumlar', icon: '💬' },
  ];

  return (
    <div className="product-detail-page">
      <MainNavigation items={mainNavItems} />

      <Breadcrumb items={breadcrumbItems} />

      <Container size="xl" className="py-8">
        {/* Product Header */}
        <div className="product-detail-header">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Product Image & Basic Info */}
            <div className="lg:col-span-1">
              <div className="product-detail-image-container">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-detail-image"
                />
                {product.badges && product.badges[0] && (
                  <div className={`product-detail-badge ${product.badges[0].variant}`}>
                    {product.badges[0].text}
                  </div>
                )}
              </div>

              <div className="provider-card">
                <img
                  src={product.provider.logo}
                  alt={product.provider.name}
                  className="provider-logo"
                />
                <div>
                  <div className="provider-name">{product.provider.name}</div>
                  {product.rating && (
                    <div className="provider-rating">
                      <span className="rating-value">⭐ {product.rating.value}</span>
                      <span className="rating-count">({product.rating.count} değerlendirme)</span>
                    </div>
                  )}
                </div>
              </div>

              <TrustBadges badges={trustBadges} variant="vertical" size="sm" />
            </div>

            {/* Right: Product Details & CTA */}
            <div className="lg:col-span-2">
              <h1 className="product-detail-title">{product.name}</h1>
              
              {product.description && (
                <p className="product-detail-description">{product.description}</p>
              )}

              {/* Key Highlights */}
              <div className="product-highlights">
                {product.interestRate && (
                  <div className="highlight-item">
                    <div className="highlight-label">Faiz Oranı</div>
                    <div className="highlight-value">%{product.interestRate}</div>
                  </div>
                )}
                {product.financials.loanAmount && (
                  <div className="highlight-item">
                    <div className="highlight-label">Maksimum Tutar</div>
                    <div className="highlight-value">
                      {product.financials.loanAmount.toLocaleString('tr-TR')} TL
                    </div>
                  </div>
                )}
              </div>

              {/* Features Pills */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-neutral-700 mb-3">Özellikler:</h3>
                <FeaturePills pills={featurePills} size="md" maxDisplay={6} showMore />
              </div>

              {/* CTA Buttons */}
              <div className="product-detail-cta">
                <button className="btn-primary-lg">
                  Başvuru Yap
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="btn-secondary-lg">
                  Karşılaştır
                </button>
                <button className="btn-ghost-lg">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                  Paylaş
                </button>
              </div>

              <InfoCard
                variant="info"
                style="subtle"
                title="Başvuru Bilgisi"
                description="Başvurunuz 24 saat içinde değerlendirilecek ve sonuç tarafınıza bildirilecektir."
              />
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="product-detail-tabs">
          <div className="tabs-header">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-button ${selectedTab === tab.id ? 'active' : ''}`}
                onClick={() => setSelectedTab(tab.id as any)}
              >
                <span className="tab-icon">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="tabs-content">
            {selectedTab === 'overview' && (
              <div className="tab-panel">
                <h2 className="section-title">Ürün Hakkında</h2>
                <div className="prose max-w-none">
                  <p>{product.description}</p>
                  <h3>Başvuru Koşulları</h3>
                  <ul>
                    <li>18 yaşını doldurmuş olmak</li>
                    <li>Türkiye Cumhuriyeti vatandaşı olmak</li>
                    <li>Düzenli gelir sahibi olmak</li>
                    <li>Kredi notu yeterli seviyede olmak</li>
                  </ul>
                  <h3>Gerekli Belgeler</h3>
                  <ul>
                    <li>Kimlik fotokopisi</li>
                    <li>Gelir belgesi</li>
                    <li>İkametgah belgesi</li>
                  </ul>
                </div>
              </div>
            )}

            {selectedTab === 'features' && (
              <div className="tab-panel">
                <h2 className="section-title">Detaylı Özellikler</h2>
                <div className="features-grid">
                  {(product.features || []).map((feature: string, index: number) => (
                    <div key={index} className="feature-item">
                      <svg className="feature-icon" width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'calculator' && calculator && (
              <div className="tab-panel">
                <h2 className="section-title">Ödeme Planı Hesaplayın</h2>
                <CalculatorWidget config={calculator} />
              </div>
            )}

            {selectedTab === 'reviews' && (
              <div className="tab-panel">
                <h2 className="section-title">Müşteri Yorumları</h2>
                {testimonials.length > 0 ? (
                  <div className="testimonials-grid">
                    {testimonials.map((testimonial) => (
                      <TestimonialCard
                        key={testimonial.id}
                        testimonial={testimonial}
                        variant="default"
                      />
                    ))}
                  </div>
                ) : (
                  <InfoCard
                    variant="neutral"
                    style="subtle"
                    description="Henüz müşteri yorumu bulunmamaktadır."
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        {faqs.length > 0 && (
          <div className="faq-section">
            <h2 className="section-title">Sıkça Sorulan Sorular</h2>
            <FAQAccordion items={faqs} searchable showCategories />
          </div>
        )}
      </Container>

      <FooterNavigation sections={footerSections} />
    </div>
  );
};

export default ProductDetailPage;
