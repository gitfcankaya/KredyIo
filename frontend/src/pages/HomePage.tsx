/**
 * Home Page
 * Main landing page with live API data integration
 */

import React, { useEffect, useState } from 'react';
import MainNavigation from '../components/Navigation/MainNavigation';
import FooterNavigation from '../components/Navigation/FooterNavigation';
import Container from '../components/Navigation/Container';
import HeroSection from '../components/Navigation/HeroSection';
import CalculatorWidget from '../components/CalculatorWidget/CalculatorWidget';
import { BlogPostCard, TestimonialCard, TrustBadges, FeaturePills } from '../components/UI';
import { loanCalculatorConfig } from '../components/CalculatorWidget/configs';
import { mainNavItems, footerSections } from '../components/Navigation/configs';
import {
  campaignsService,
  currencyRatesService,
  goldPricesService,
  articlesService,
  newsArticlesService,
  economicIndicatorsService,
  banksService,
} from '../services/api';
import './Pages.css';

interface Campaign {
  id: number;
  title: string;
  description: string;
  bankId: number;
  bankName?: string;
  imageUrl?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isFeatured: boolean;
}

interface CurrencyRate {
  id: number;
  currencyCode: string;
  buyingRate: number;
  sellingRate: number;
  date: string;
}

interface GoldPrice {
  id: number;
  goldType: string;
  buyingPrice: number;
  sellingPrice: number;
  date: string;
}

interface NewsArticle {
  id: number;
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  publishDate: string;
  isActive: boolean;
}

interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  authorName: string;
  categoryName: string;
  imageUrl?: string;
  publishDate: string;
  viewCount: number;
  isPublished: boolean;
}

interface EconomicIndicator {
  id: number;
  indicatorCode: string;
  value: number;
  date: string;
  description?: string;
}

const HomePage: React.FC = () => {
  // API data states
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [currencyRates, setCurrencyRates] = useState<CurrencyRate[]>([]);
  const [goldPrices, setGoldPrices] = useState<GoldPrice[]>([]);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [popularArticles, setPopularArticles] = useState<Article[]>([]);
  const [economicIndicators, setEconomicIndicators] = useState<EconomicIndicator[]>([]);
  const [banksCount, setBanksCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [
          campaignsData,
          currencyData,
          goldData,
          newsData,
          articlesData,
          indicatorsData,
          banksData,
        ] = await Promise.all([
          campaignsService.getFeaturedCampaigns().catch(() => []),
          currencyRatesService.getLatestRates().catch(() => []),
          goldPricesService.getLatestPrices().catch(() => []),
          newsArticlesService.getLatestNews(5).catch(() => []),
          articlesService.getPopularArticles(3).catch(() => []),
          economicIndicatorsService.getLatestIndicators().catch(() => []),
          banksService.getBanks(true).catch(() => []),
        ]);

        setCampaigns(campaignsData);
        setCurrencyRates(currencyData);
        setGoldPrices(goldData);
        setNewsArticles(newsData);
        setPopularArticles(articlesData);
        setEconomicIndicators(indicatorsData);
        setBanksCount(banksData.length);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
        setError('Veri yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Static configuration data
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
      description: `${banksCount || 'Tüm'} bankaları karşılaştırın`,
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

  if (error) {
    return (
      <div className="home-page">
        <MainNavigation items={mainNavItems} />
        <Container size="xl" className="py-16">
          <div className="bg-danger-50 border border-danger-200 rounded-lg p-8 text-center">
            <h2 className="text-xl font-bold text-danger-700 mb-2">Bir Hata Oluştu</h2>
            <p className="text-danger-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-danger-600 text-white rounded-lg hover:bg-danger-700"
            >
              Tekrar Dene
            </button>
          </div>
        </Container>
        <FooterNavigation sections={footerSections} />
      </div>
    );
  }

  return (
    <div className="home-page">
      <MainNavigation items={mainNavItems} />

      {/* Hero Section */}
      <HeroSection
        variant="gradient"
        title="Türkiye'nin En Kapsamlı Finansal Karşılaştırma Platformu"
        description={`${banksCount} bankadan krediler, kredi kartları, mevduat ve daha fazlası için en uygun seçenekleri karşılaştırın`}
        primaryCTA={{
          label: 'Hemen Başla',
          href: '/products',
        }}
        secondaryCTA={{
          label: 'Kredi Hesapla',
          href: '/calculators',
        }}
      />

      {/* Live Market Data Ticker */}
      {!loading && (currencyRates.length > 0 || goldPrices.length > 0 || economicIndicators.length > 0) && (
        <section className="bg-neutral-900 text-white py-4 overflow-hidden">
          <Container size="xl">
            <div className="flex items-center gap-12 overflow-x-auto whitespace-nowrap">
              {/* Currency Rates */}
              {currencyRates.slice(0, 3).map((rate) => (
                <div key={rate.id} className="flex items-center gap-2 text-sm">
                  <span className="font-semibold">{rate.currencyCode}</span>
                  <span className="text-neutral-400">Alış:</span>
                  <span>{formatCurrency(rate.buyingRate)}</span>
                  <span className="text-neutral-400 ml-2">Satış:</span>
                  <span>{formatCurrency(rate.sellingRate)}</span>
                </div>
              ))}
              
              {/* Gold Prices */}
              {goldPrices.slice(0, 2).map((gold) => (
                <div key={gold.id} className="flex items-center gap-2 text-sm">
                  <span className="font-semibold">{gold.goldType}</span>
                  <span className="text-neutral-400">Alış:</span>
                  <span>{formatCurrency(gold.buyingPrice)}</span>
                  <span className="text-neutral-400 ml-2">Satış:</span>
                  <span>{formatCurrency(gold.sellingPrice)}</span>
                </div>
              ))}

              {/* Economic Indicators */}
              {economicIndicators.slice(0, 2).map((indicator) => (
                <div key={indicator.id} className="flex items-center gap-2 text-sm">
                  <span className="font-semibold">{indicator.indicatorCode}</span>
                  <span>%{indicator.value.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

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

      {/* Featured Campaigns Section */}
      {!loading && campaigns.length > 0 && (
        <section className="bg-neutral-50 py-16">
          <Container size="xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-neutral-900 mb-2">
                  Öne Çıkan Kampanyalar
                </h2>
                <p className="text-neutral-700">
                  En avantajlı kampanyalar ve fırsatlar
                </p>
              </div>
              <a href="/campaigns" className="btn-secondary">
                Tüm Kampanyalar
              </a>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.slice(0, 6).map((campaign) => (
                <div key={campaign.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                  {campaign.imageUrl && (
                    <img
                      src={campaign.imageUrl}
                      alt={campaign.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">
                    {campaign.title}
                  </h3>
                  <p className="text-neutral-700 mb-4 line-clamp-2">
                    {campaign.description}
                  </p>
                  {campaign.bankName && (
                    <div className="text-sm text-neutral-600 mb-2">
                      <span className="font-semibold">Banka:</span> {campaign.bankName}
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm text-neutral-600">
                    <span>Bitiş: {formatDate(campaign.endDate)}</span>
                    <a href={`/campaigns/${campaign.id}`} className="text-primary-600 hover:text-primary-700 font-semibold">
                      Detaylar →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

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

      {/* News Section */}
      {!loading && newsArticles.length > 0 && (
        <section className="bg-white py-16 border-y border-neutral-200">
          <Container size="xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-neutral-900 mb-2">
                  Son Haberler
                </h2>
                <p className="text-neutral-700">
                  Finans dünyasından güncel haberler
                </p>
              </div>
              <a href="/news" className="btn-secondary">
                Tüm Haberler
              </a>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsArticles.map((news) => (
                <div key={news.id} className="bg-neutral-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  {news.imageUrl && (
                    <img
                      src={news.imageUrl}
                      alt={news.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <div className="text-xs text-primary-600 font-semibold uppercase mb-2">
                      {news.category}
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900 mb-2 line-clamp-2">
                      {news.title}
                    </h3>
                    <p className="text-neutral-700 mb-4 line-clamp-3">
                      {news.content.substring(0, 150)}...
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-600">
                        {formatDate(news.publishDate)}
                      </span>
                      <a href={`/news/${news.id}`} className="text-primary-600 hover:text-primary-700 font-semibold text-sm">
                        Devamı →
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

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

      {/* Blog/Articles Section */}
      {!loading && popularArticles.length > 0 && (
        <Container size="xl" className="py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-2">
                Popüler İçerikler
              </h2>
              <p className="text-neutral-700">
                Finansal okuryazarlığınızı artırın
              </p>
            </div>
            <a href="/articles" className="btn-secondary">
              Tüm İçerikler
            </a>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularArticles.map((article) => (
              <BlogPostCard
                key={article.id}
                post={{
                  id: article.id.toString(),
                  title: article.title,
                  excerpt: article.excerpt || article.content.substring(0, 150) + '...',
                  image: article.imageUrl || '/default-blog.jpg',
                  author: {
                    name: article.authorName,
                    avatar: '/avatars/default.jpg',
                    title: 'Yazar',
                  },
                  category: {
                    name: article.categoryName,
                    slug: article.categoryName.toLowerCase().replace(/\s+/g, '-'),
                    color: '#3B82F6',
                  },
                  date: new Date(article.publishDate),
                  readTime: Math.ceil(article.content.length / 200),
                  href: `/articles/${article.slug}`,
                }}
                variant="vertical"
              />
            ))}
          </div>
        </Container>
      )}

      {/* Testimonials Section */}
      <Container size="xl" className="py-16 bg-neutral-50">
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

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mb-4 mx-auto"></div>
            <p className="text-lg text-neutral-700">Yükleniyor...</p>
          </div>
        </div>
      )}

      <FooterNavigation sections={footerSections} />
    </div>
  );
};

export default HomePage;
