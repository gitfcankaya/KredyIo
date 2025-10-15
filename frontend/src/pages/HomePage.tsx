/**
 * Home Page
 * Main landing page with hero, featured products, and highlights
 */

import React from 'react';
import MainNavigation from '../components/Navigation/MainNavigation';
import FooterNavigation from '../components/Navigation/FooterNavigation';
import Container from '../components/Navigation/Container';
import HeroSection from '../components/Navigation/HeroSection';
import ProductCard from '../components/ProductCard/ProductCard';
import CalculatorWidget from '../components/CalculatorWidget/CalculatorWidget';
import { BlogPostCard, TestimonialCard, InfoCard, TrustBadges, FeaturePills } from '../components/UI';
import { loanCalculatorConfig } from '../components/CalculatorWidget/configs';
import { mainNavItems, footerSections } from '../components/Navigation/configs';
import './Pages.css';

const HomePage: React.FC = () => {
  // Sample featured products
  const featuredProducts = [
    {
      id: '1',
      name: 'İhtiyaç Kredisi Plus',
      category: 'loan',
      description: 'En uygun faiz oranları ile',
      image: '/products/loan-1.jpg',
      provider: {
        id: 'garanti',
        slug: 'garanti-bbva',
        name: 'Garanti BBVA',
        logo: '/logos/garanti.png',
      },
      interestRate: 1.89,
      loanAmount: 500000,
      features: ['Hızlı onay', 'Masrafsız', 'Online başvuru'],
      cta: {
        text: 'Başvur',
        href: '/products/1',
      },
      badge: {
        id: 'badge-1',
        text: 'En İyi',
        variant: 'best' as const,
      },
      rating: {
        value: 4.8,
        count: 1250,
      },
    },
    {
      id: '2',
      name: 'Platinum Kredi Kartı',
      category: 'creditCard',
      description: 'Yüksek limitli, düşük masraflı',
      image: '/products/card-1.jpg',
      provider: {
        id: 'isbank',
        slug: 'is-bankasi',
        name: 'İş Bankası',
        logo: '/logos/isbank.png',
      },
      features: ['Mil kazanımı', 'Havalimanı loungeları', 'Ücretsiz kart'],
      cta: {
        text: 'Başvur',
        href: '/products/2',
      },
      badge: {
        id: 'badge-2',
        text: 'Popüler',
        variant: 'popular' as const,
      },
      rating: {
        value: 4.6,
        count: 890,
      },
    },
    {
      id: '3',
      name: 'Yüksek Getiri Mevduat',
      category: 'deposit',
      description: 'En yüksek faiz oranları',
      image: '/products/deposit-1.jpg',
      provider: {
        id: 'yapikredi',
        slug: 'yapi-kredi',
        name: 'Yapı Kredi',
        logo: '/logos/yapikredi.png',
      },
      depositRate: 45.5,
      features: ['Online işlem', 'Ek hesap', 'SMS bilgilendirme'],
      cta: {
        text: 'Başvur',
        href: '/products/3',
      },
      rating: {
        value: 4.7,
        count: 670,
      },
    },
  ];

  const categories = [
    {
      id: 'loans',
      title: 'Krediler',
      description: 'İhtiyaç, konut, araç kredileri',
      icon: '💰',
      href: '/loans',
      color: 'bg-primary-100 text-primary-700',
    },
    {
      id: 'credit-cards',
      title: 'Kredi Kartları',
      description: 'Avantajlı kredi kartları',
      icon: '💳',
      href: '/credit-cards',
      color: 'bg-secondary-100 text-secondary-700',
    },
    {
      id: 'deposits',
      title: 'Mevduat',
      description: 'Vadeli ve vadesiz mevduat',
      icon: '💵',
      href: '/deposits',
      color: 'bg-success-100 text-success-700',
    },
    {
      id: 'accounts',
      title: 'Hesaplar',
      description: 'Vadesiz hesaplar',
      icon: '🏦',
      href: '/accounts',
      color: 'bg-warning-100 text-warning-700',
    },
  ];

  const features = [
    {
      id: '1',
      icon: '🔒',
      title: 'Güvenli ve Hızlı',
      description: '256-bit SSL şifreleme ile güvenli işlemler',
    },
    {
      id: '2',
      icon: '📊',
      title: 'Karşılaştırma Araçları',
      description: 'Tüm bankaları karşılaştırın',
    },
    {
      id: '3',
      icon: '🎯',
      title: 'Kişiselleştirilmiş',
      description: 'Size özel teklifler',
    },
    {
      id: '4',
      icon: '⚡',
      title: '7/24 Destek',
      description: 'Her zaman yanınızdayız',
    },
  ];

  const trustBadges = [
    { id: '1', name: 'SSL', type: 'ssl' as const, icon: '/badges/ssl.svg' },
    { id: '2', name: 'KVKK', type: 'kvkk' as const, icon: '/badges/kvkk.svg' },
    { id: '3', name: 'ETBİS', type: 'etbis' as const, icon: '/badges/etbis.svg' },
  ];

  const blogPosts = [
    {
      id: '1',
      title: 'Kredi Başvurusu Yaparken Dikkat Edilmesi Gerekenler',
      excerpt: 'Kredi başvurunuzda başarılı olmak için bilmeniz gereken 10 önemli nokta...',
      image: '/blog/credit-tips.jpg',
      author: {
        name: 'Ahmet Yılmaz',
        avatar: '/avatars/ahmet.jpg',
        title: 'Finansal Danışman',
      },
      category: {
        name: 'Kredi',
        slug: 'kredi',
        color: '#3B82F6',
      },
      date: new Date('2025-10-10'),
      readTime: 5,
      href: '/blog/1',
    },
    {
      id: '2',
      title: 'En Uygun Kredi Kartını Nasıl Seçersiniz?',
      excerpt: 'Kredi kartı seçerken dikkat etmeniz gereken özellikler ve avantajlar...',
      image: '/blog/card-selection.jpg',
      author: {
        name: 'Ayşe Demir',
        avatar: '/avatars/ayse.jpg',
        title: 'Finansal Uzman',
      },
      category: {
        name: 'Kredi Kartı',
        slug: 'kredi-karti',
        color: '#8B5CF6',
      },
      date: new Date('2025-10-12'),
      readTime: 7,
      href: '/blog/2',
    },
  ];

  const testimonials = [
    {
      id: '1',
      content: 'KredyIo sayesinde en uygun faiz oranlarını kolayca buldum. Süreç çok hızlı ve güvenli ilerledi.',
      author: {
        name: 'Mehmet Kaya',
        title: 'Mühendis',
        avatar: '/avatars/mehmet.jpg',
      },
      rating: 5,
      verified: true,
      date: new Date('2025-10-05'),
    },
    {
      id: '2',
      content: 'Karşılaştırma araçları sayesinde binlerce lira tasarruf ettim. Herkese tavsiye ederim!',
      author: {
        name: 'Zeynep Şahin',
        title: 'Öğretmen',
        avatar: '/avatars/zeynep.jpg',
      },
      rating: 5,
      verified: true,
      date: new Date('2025-10-08'),
    },
  ];

  return (
    <div className="home-page">
      <MainNavigation items={mainNavItems} />

      {/* Hero Section */}
      <HeroSection
        variant="gradient"
        title="Türkiye'nin En Kapsamlı Finansal Karşılaştırma Platformu"
        description="Krediler, kredi kartları, mevduat ve daha fazlası için en uygun seçenekleri karşılaştırın"
        primaryCTA={{
          label: 'Hemen Başla',
          href: '/products',
        }}
        secondaryCTA={{
          label: 'Kredi Hesapla',
          href: '/calculators',
        }}
      />

      {/* Categories Section */}
      <Container size="xl" className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            Ne Arıyorsunuz?
          </h2>
          <p className="text-lg text-neutral-700">
            İhtiyacınıza uygun finansal ürünü hemen bulun
          </p>
        </div>

        <div className="categories-grid">
          {categories.map((category) => (
            <a
              key={category.id}
              href={category.href}
              className={`category-card ${category.color}`}
            >
              <span className="category-icon">{category.icon}</span>
              <h3 className="category-title">{category.title}</h3>
              <p className="category-description">{category.description}</p>
              <span className="category-link">
                İncele →
              </span>
            </a>
          ))}
        </div>
      </Container>

      {/* Featured Products Section */}
      <section className="bg-neutral-50 py-16">
        <Container size="xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-2">
                Öne Çıkan Ürünler
              </h2>
              <p className="text-neutral-700">
                En avantajlı finansal ürünler
              </p>
            </div>
            <a href="/products" className="btn-secondary">
              Tümünü Gör
            </a>
          </div>

          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                id={product.id}
                type={product.category as any}
                title={product.name}
                description={product.description}
                provider={product.provider}
                financials={{
                  interestRate: product.interestRate,
                  loanAmount: product.loanAmount,
                  depositRate: product.depositRate,
                }}
                badges={product.badge ? [product.badge] : []}
                features={product.features}
                onApply={(id) => window.location.href = product.cta.href}
                onDetails={(id) => window.location.href = product.cta.href}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Calculator Section */}
      <Container size="xl" className="py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Hemen Hesaplayın
            </h2>
            <p className="text-lg text-neutral-700 mb-6">
              Kredi ödemelerinizi, faiz tutarlarını ve toplam maliyeti anında hesaplayın.
              Detaylı ödeme planını görüntüleyin.
            </p>
            <FeaturePills
              pills={[
                { id: '1', label: 'Kredi Hesaplama', variant: 'primary' },
                { id: '2', label: 'Mevduat Hesaplama', variant: 'success' },
                { id: '3', label: 'Kart Borcu', variant: 'secondary' },
              ]}
              size="md"
            />
          </div>
          <div>
            <CalculatorWidget config={loanCalculatorConfig} />
          </div>
        </div>
      </Container>

      {/* Features Section */}
      <section className="bg-primary-50 py-16">
        <Container size="xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Neden KredyIo?
            </h2>
            <p className="text-lg text-neutral-700">
              Finansal kararlarınızı doğru vermeniz için yanınızdayız
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature) => (
              <div key={feature.id} className="feature-card">
                <div className="feature-icon-large">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials Section */}
      <Container size="xl" className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            Müşterilerimiz Ne Diyor?
          </h2>
          <p className="text-lg text-neutral-700">
            Binlerce kullanıcı KredyIo ile tasarruf ediyor
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              variant="default"
            />
          ))}
        </div>
      </Container>

      {/* Blog Section */}
      <section className="bg-neutral-50 py-16">
        <Container size="xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-2">
                Blog & Haberler
              </h2>
              <p className="text-neutral-700">
                Finansal okuryazarlığınızı artırın
              </p>
            </div>
            <a href="/blog" className="btn-secondary">
              Tüm Yazılar
            </a>
          </div>

          <div className="blog-posts-grid">
            {blogPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} variant="vertical" />
            ))}
          </div>
        </Container>
      </section>

      {/* Trust Section */}
      <section className="bg-white py-12 border-y border-neutral-200">
        <Container size="xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                Güvenli ve Lisanslı Platform
              </h3>
              <p className="text-neutral-700">
                Verileriniz 256-bit SSL şifreleme ile korunmaktadır
              </p>
            </div>
            <TrustBadges badges={trustBadges} variant="horizontal" size="md" />
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 py-16">
        <Container size="xl">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Hemen Başlayın
            </h2>
            <p className="text-xl mb-8 opacity-90">
              En uygun finansal ürünleri karşılaştırın ve başvurun
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="/products" className="btn-white-lg">
                Ürünleri İncele
              </a>
              <a href="/calculators" className="btn-outline-white-lg">
                Hesaplama Yap
              </a>
            </div>
          </div>
        </Container>
      </section>

      <FooterNavigation sections={footerSections} />
    </div>
  );
};

export default HomePage;
