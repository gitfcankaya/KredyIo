/**
 * Calculator Hub Page
 * Central page for all financial calculators
 */

import React, { useState } from 'react';
import MainNavigation from '../components/Navigation/MainNavigation';
import FooterNavigation from '../components/Navigation/FooterNavigation';
import Breadcrumb from '../components/Navigation/Breadcrumb';
import Container from '../components/Navigation/Container';
import HeroSection from '../components/Navigation/HeroSection';
import CalculatorWidget from '../components/CalculatorWidget/CalculatorWidget';
import { InfoCard } from '../components/UI';
import { loanCalculatorConfig, depositCalculatorConfig } from '../components/CalculatorWidget/configs';
import { mainNavItems, footerSections } from '../components/Navigation/configs';
import './Pages.css';

const CalculatorHubPage: React.FC = () => {
  const [selectedCalculator, setSelectedCalculator] = useState<string>('loan');

  const breadcrumbItems = [
    { id: '1', label: 'Anasayfa', href: '/' },
    { id: '2', label: 'Hesaplama Araçları', href: '#' },
  ];

  const calculators = [
    {
      id: 'loan',
      title: 'Kredi Hesaplama',
      description: 'Kredi ödemelerinizi ve toplam maliyeti hesaplayın',
      icon: '💰',
      config: loanCalculatorConfig,
      popular: true,
    },
    {
      id: 'deposit',
      title: 'Mevduat Hesaplama',
      description: 'Mevduat getirilerinizi hesaplayın',
      icon: '💵',
      config: depositCalculatorConfig,
      popular: true,
    },
    {
      id: 'credit-card',
      title: 'Kredi Kartı Hesaplama',
      description: 'Kredi kartı borcunuzu hesaplayın',
      icon: '💳',
      config: loanCalculatorConfig, // Placeholder
      popular: false,
    },
    {
      id: 'mortgage',
      title: 'Konut Kredisi Hesaplama',
      description: 'Konut kredisi ödemelerinizi hesaplayın',
      icon: '🏠',
      config: loanCalculatorConfig, // Placeholder
      popular: true,
    },
  ];

  const selectedCalc = calculators.find((c) => c.id === selectedCalculator);

  return (
    <div className="calculator-hub-page">
      <MainNavigation items={mainNavItems} />

      <Breadcrumb items={breadcrumbItems} />

      <HeroSection
        variant="gradient"
        title="Finansal Hesaplama Araçları"
        description="Kredi, mevduat ve diğer finansal ürünlerinizi hesaplayın"
      />

      <Container size="xl" className="py-12">
        {/* Info Banner */}
        <InfoCard
          variant="info"
          style="subtle"
          title="Hesaplama Araçları"
          description="Tüm hesaplamalarımız güncel faiz oranları ve banka koşullarına göre yapılmaktadır."
          className="mb-8"
        />

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Calculator Selection Sidebar */}
          <aside className="lg:col-span-1">
            <div className="calculator-menu">
              <h2 className="calculator-menu-title">Hesaplama Araçları</h2>
              <nav className="calculator-menu-list">
                {calculators.map((calc) => (
                  <button
                    key={calc.id}
                    className={`calculator-menu-item ${selectedCalculator === calc.id ? 'active' : ''}`}
                    onClick={() => setSelectedCalculator(calc.id)}
                  >
                    <span className="calculator-menu-icon">{calc.icon}</span>
                    <div className="calculator-menu-content">
                      <div className="calculator-menu-name">
                        {calc.title}
                        {calc.popular && (
                          <span className="calculator-menu-badge">Popüler</span>
                        )}
                      </div>
                      <div className="calculator-menu-description">
                        {calc.description}
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>

            {/* Quick Tips */}
            <div className="calculator-tips">
              <h3 className="calculator-tips-title">💡 İpuçları</h3>
              <ul className="calculator-tips-list">
                <li>Farklı vade seçeneklerini karşılaştırın</li>
                <li>Erken ödeme seçeneklerini değerlendirin</li>
                <li>Aylık bütçenize uygun taksit tutarını seçin</li>
                <li>Toplam maliyeti göz önünde bulundurun</li>
              </ul>
            </div>
          </aside>

          {/* Calculator Content */}
          <main className="lg:col-span-3">
            {selectedCalc && (
              <div className="calculator-content">
                <div className="calculator-header">
                  <div>
                    <h1 className="calculator-title">
                      <span className="calculator-icon">{selectedCalc.icon}</span>
                      {selectedCalc.title}
                    </h1>
                    <p className="calculator-description">{selectedCalc.description}</p>
                  </div>
                </div>

                <CalculatorWidget config={selectedCalc.config} />

                {/* Additional Info */}
                <div className="calculator-info-grid">
                  <InfoCard
                    variant="success"
                    style="subtle"
                    title="Güvenilir Hesaplama"
                    description="Tüm hesaplamalar güncel TCMB faiz oranları ve banka koşullarına göre yapılır."
                  />
                  <InfoCard
                    variant="warning"
                    style="subtle"
                    title="Tahmini Değerler"
                    description="Gösterilen değerler tahminidir. Kesin bilgi için bankanızla iletişime geçiniz."
                  />
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Popular Calculators Section */}
        <section className="popular-calculators-section">
          <h2 className="section-title">En Çok Kullanılan Hesaplama Araçları</h2>
          <div className="popular-calculators-grid">
            {calculators
              .filter((calc) => calc.popular)
              .map((calc) => (
                <button
                  key={calc.id}
                  className="popular-calculator-card"
                  onClick={() => setSelectedCalculator(calc.id)}
                >
                  <span className="popular-calculator-icon">{calc.icon}</span>
                  <h3 className="popular-calculator-title">{calc.title}</h3>
                  <p className="popular-calculator-description">{calc.description}</p>
                  <span className="popular-calculator-link">
                    Hesapla →
                  </span>
                </button>
              ))}
          </div>
        </section>
      </Container>

      <FooterNavigation sections={footerSections} />
    </div>
  );
};

export default CalculatorHubPage;
