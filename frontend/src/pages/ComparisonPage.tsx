/**
 * Comparison Page
 * Side-by-side product comparison with detailed features
 */

import React, { useState } from 'react';
import MainNavigation from '../components/Navigation/MainNavigation';
import FooterNavigation from '../components/Navigation/FooterNavigation';
import Breadcrumb from '../components/Navigation/Breadcrumb';
import Container from '../components/Navigation/Container';
import { ComparisonTable, InfoCard } from '../components/UI';
import type { ComparisonProduct, ComparisonFeature } from '../components/UI/types';
import { mainNavItems, footerSections } from '../components/Navigation/configs';
import './Pages.css';

const ComparisonPage: React.FC = () => {
  const breadcrumbItems = [
    { id: '1', label: 'Anasayfa', href: '/' },
    { id: '2', label: 'Ürün Karşılaştırma', href: '#' },
  ];

  // Sample comparison data
  const [products] = useState<ComparisonProduct[]>([
    {
      id: '1',
      name: 'İhtiyaç Kredisi Plus',
      provider: 'Garanti BBVA',
      logo: '/logos/garanti.png',
      badge: { text: 'En İyi', variant: 'success' },
      features: {
        'interest-rate': { value: '1.89', highlight: true },
        'max-amount': '500000',
        'max-term': '36',
        'early-payment': true,
        'application-fee': '0',
        'online-application': true,
      },
      pricing: {
        amount: 1.89,
        period: 'aylık',
        currency: '%',
      },
      cta: {
        label: 'Başvur',
        href: '/apply/1',
      },
    },
    {
      id: '2',
      name: 'Hızlı İhtiyaç Kredisi',
      provider: 'İş Bankası',
      logo: '/logos/isbank.png',
      badge: { text: 'Popüler', variant: 'primary' },
      features: {
        'interest-rate': '2.15',
        'max-amount': '300000',
        'max-term': '48',
        'early-payment': true,
        'application-fee': { value: '150 TL', tooltip: 'İlk yıl için' },
        'online-application': true,
      },
      pricing: {
        amount: 2.15,
        period: 'aylık',
        currency: '%',
      },
      cta: {
        label: 'Başvur',
        href: '/apply/2',
      },
    },
    {
      id: '3',
      name: 'Avantajlı İhtiyaç Kredisi',
      provider: 'Yapı Kredi',
      logo: '/logos/yapikredi.png',
      features: {
        'interest-rate': '2.05',
        'max-amount': '400000',
        'max-term': '36',
        'early-payment': false,
        'application-fee': '200',
        'online-application': true,
      },
      pricing: {
        amount: 2.05,
        period: 'aylık',
        currency: '%',
      },
      cta: {
        label: 'Başvur',
        href: '/apply/3',
      },
    },
  ]);

  const features: ComparisonFeature[] = [
    {
      id: 'interest-rate',
      label: 'Faiz Oranı',
      category: 'Genel Bilgiler',
      description: 'Aylık faiz oranı',
      tooltip: 'Kampanya dahil aylık faiz oranı',
    },
    {
      id: 'max-amount',
      label: 'Maksimum Tutar',
      category: 'Genel Bilgiler',
      description: 'Alabileceğiniz maksimum kredi tutarı',
    },
    {
      id: 'max-term',
      label: 'Maksimum Vade',
      category: 'Genel Bilgiler',
      description: 'Ay cinsinden maksimum vade',
    },
    {
      id: 'early-payment',
      label: 'Erken Ödeme',
      category: 'Özellikler',
      description: 'Erken ödeme imkanı',
    },
    {
      id: 'application-fee',
      label: 'Başvuru Masrafı',
      category: 'Masraflar',
      description: 'Başvuru sırasında alınan masraf',
    },
    {
      id: 'online-application',
      label: 'Online Başvuru',
      category: 'Özellikler',
      description: 'İnternet üzerinden başvuru',
    },
  ];

  const handleRemoveProduct = (productId: string) => {
    console.log('Remove product:', productId);
  };

  const handleAddProduct = () => {
    console.log('Add product');
  };

  return (
    <div className="comparison-page">
      <MainNavigation items={mainNavItems} />

      <Breadcrumb items={breadcrumbItems} />

      <Container size="full" className="py-8">
        {/* Page Header */}
        <div className="comparison-header">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">
              Ürün Karşılaştırma
            </h1>
            <p className="text-lg text-neutral-700">
              Farklı bankaların ürünlerini yan yana karşılaştırarak size en uygun seçeneği bulun
            </p>
          </div>

          <InfoCard
            variant="info"
            style="subtle"
            title="Karşılaştırma İpucu"
            description="Tablodaki değerleri inceleyerek size en uygun ürünü seçebilirsiniz. Yeşil renkle vurgulanan değerler en avantajlı seçenekleri gösterir."
            className="max-w-4xl mx-auto mb-8"
          />
        </div>

        {/* Comparison Table */}
        <ComparisonTable
          products={products}
          features={features}
          maxProducts={4}
          stickyHeader
          stickyColumn
          showPricing
          showCTA
          onRemoveProduct={handleRemoveProduct}
          onAddProduct={handleAddProduct}
        />

        {/* Additional Information */}
        <div className="comparison-footer">
          <Container size="xl" className="py-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InfoCard
                variant="success"
                style="subtle"
                title="En İyi Teklif"
                description="Yeşil renkle işaretlenen ürünler kategorilerinde en avantajlı değerlere sahiptir."
              />
              <InfoCard
                variant="info"
                style="subtle"
                title="Detaylı İnceleme"
                description="Daha fazla bilgi için ürün detay sayfalarını ziyaret edebilirsiniz."
              />
              <InfoCard
                variant="warning"
                style="subtle"
                title="Güncel Bilgiler"
                description="Gösterilen bilgiler kampanya dönemlerine göre değişiklik gösterebilir."
              />
            </div>

            {/* Comparison Tips */}
            <div className="comparison-tips">
              <h2 className="section-title">Karşılaştırma Yaparken Dikkat Edilmesi Gerekenler</h2>
              <div className="tips-grid">
                <div className="tip-card">
                  <div className="tip-icon">💰</div>
                  <h3 className="tip-title">Toplam Maliyet</h3>
                  <p className="tip-description">
                    Sadece faiz oranına değil, masraflar ve toplam ödeyeceğiniz tutara bakın.
                  </p>
                </div>
                <div className="tip-card">
                  <div className="tip-icon">📅</div>
                  <h3 className="tip-title">Vade Seçimi</h3>
                  <p className="tip-description">
                    Aylık ödeme tutarınız kadar vade süresinin de önemli olduğunu unutmayın.
                  </p>
                </div>
                <div className="tip-card">
                  <div className="tip-icon">⚡</div>
                  <h3 className="tip-title">Erken Ödeme</h3>
                  <p className="tip-description">
                    Erken ödeme yapma ihtimaliniz varsa, bu özelliği sunan ürünleri tercih edin.
                  </p>
                </div>
                <div className="tip-card">
                  <div className="tip-icon">🎯</div>
                  <h3 className="tip-title">İhtiyacınıza Uygun</h3>
                  <p className="tip-description">
                    En ucuz ürün yerine, ihtiyaçlarınıza en uygun ürünü tercih edin.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </Container>

      <FooterNavigation sections={footerSections} />
    </div>
  );
};

export default ComparisonPage;
