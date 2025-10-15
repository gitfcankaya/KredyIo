import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, TrendingUp, DollarSign, CreditCard, Home, Car, Building2, PieChart } from 'lucide-react';

interface ExchangeRate {
  currency: string;
  buying: number;
  selling: number;
  change: number;
}

interface GoldPrice {
  type: string;
  price: number;
  change: number;
}

interface BankRate {
  bank: string;
  logo: string;
  loanRate: number;
  depositRate: number;
}

const HomePage: React.FC = () => {
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [goldPrices, setGoldPrices] = useState<GoldPrice[]>([]);
  const [bankRates, setBankRates] = useState<BankRate[]>([]);
  
  // Mock data - Bu veriler backend API'sinden gelecek
  useEffect(() => {
    // Simulated API calls
    setExchangeRates([
      { currency: 'USD', buying: 32.45, selling: 32.58, change: 0.15 },
      { currency: 'EUR', buying: 35.12, selling: 35.28, change: -0.08 },
      { currency: 'GBP', buying: 40.85, selling: 41.02, change: 0.23 },
    ]);

    setGoldPrices([
      { type: 'Çeyrek Altın', price: 2.850, change: 1.2 },
      { type: 'Yarım Altın', price: 5.680, change: 1.1 },
      { type: 'Tam Altın', price: 11.340, change: 0.9 },
    ]);

    setBankRates([
      { bank: 'Akbank', logo: '/logos/akbank.png', loanRate: 3.99, depositRate: 45.0 },
      { bank: 'Garanti BBVA', logo: '/logos/garanti.png', loanRate: 4.44, depositRate: 43.5 },
      { bank: 'İş Bankası', logo: '/logos/isbank.png', loanRate: 3.99, depositRate: 44.2 },
      { bank: 'Yapı Kredi', logo: '/logos/yapikredi.png', loanRate: 3.69, depositRate: 42.8 },
      { bank: 'VakıfBank', logo: '/logos/vakifbank.png', loanRate: 4.15, depositRate: 43.0 },
      { bank: 'Ziraat Bankası', logo: '/logos/ziraat.png', loanRate: 4.25, depositRate: 42.5 },
    ]);
  }, []);

  const calculatorTypes = [
    {
      title: 'İhtiyaç Kredisi',
      icon: Calculator,
      description: 'Kişisel ihtiyaçlarınız için kredi hesaplayın',
      color: 'bg-blue-500',
      path: '/calculator/personal'
    },
    {
      title: 'Konut Kredisi',
      icon: Home,
      description: 'Ev almak için konut kredisi hesaplayın',
      color: 'bg-green-500',
      path: '/calculator/housing'
    },
    {
      title: 'Taşıt Kredisi',
      icon: Car,
      description: 'Araç almak için taşıt kredisi hesaplayın',
      color: 'bg-purple-500',
      path: '/calculator/vehicle'
    },
    {
      title: 'KOBİ Kredisi',
      icon: Building2,
      description: 'İşletmeniz için ticari kredi hesaplayın',
      color: 'bg-orange-500',
      path: '/calculator/business'
    }
  ];

  const features = [
    {
      icon: TrendingUp,
      title: 'Güncel Oranlar',
      description: 'Tüm bankaların en güncel faiz oranları'
    },
    {
      icon: Calculator,
      title: 'Detaylı Hesaplama',
      description: 'Kapsamlı kredi hesaplama araçları'
    },
    {
      icon: PieChart,
      title: 'Karşılaştırma',
      description: 'Banka ve ürün karşılaştırması'
    },
    {
      icon: CreditCard,
      title: 'Hızlı Başvuru',
      description: 'Online başvuru imkanı'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Türkiye'nin En Kapsamlı
              <span className="block text-yellow-300">Finans Karşılaştırma</span>
              Platformu
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Krediler, mevduat, kredi kartları ve daha fazlası için en uygun seçenekleri bulun
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/calculator"
                className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-300 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Calculator size={24} />
                Hemen Hesapla
              </Link>
              <Link
                to="/products"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-900 transition-colors"
              >
                Ürünleri İncele
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Calculator Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Hızlı Hesaplama Araçları</h2>
            <p className="text-xl text-gray-600">İhtiyacınıza uygun kredi türünü seçin ve anında hesaplayın</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {calculatorTypes.map((calc, index) => (
              <Link
                key={index}
                to={calc.path}
                className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`${calc.color} w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <calc.icon className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{calc.title}</h3>
                <p className="text-gray-600 group-hover:text-gray-700">{calc.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Financial Data Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Exchange Rates */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <DollarSign className="text-green-500" size={28} />
                Döviz Kurları
              </h3>
              <div className="space-y-4">
                {exchangeRates.map((rate, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <div className="font-medium text-gray-900">{rate.currency}</div>
                    <div className="text-right">
                      <div className="font-semibold">₺{rate.selling.toFixed(2)}</div>
                      <div className={`text-sm ${rate.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {rate.change >= 0 ? '+' : ''}{rate.change.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link 
                to="/rates/exchange" 
                className="block text-center mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Tüm Kurları Görüntüle →
              </Link>
            </div>

            {/* Gold Prices */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="text-yellow-500" size={28} />
                Altın Fiyatları
              </h3>
              <div className="space-y-4">
                {goldPrices.map((gold, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <div className="font-medium text-gray-900">{gold.type}</div>
                    <div className="text-right">
                      <div className="font-semibold">₺{gold.price.toLocaleString()}</div>
                      <div className={`text-sm ${gold.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {gold.change >= 0 ? '+' : ''}{gold.change.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link 
                to="/rates/gold" 
                className="block text-center mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Detaylı Fiyatları Görüntüle →
              </Link>
            </div>

            {/* Bank Interest Rates */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <PieChart className="text-blue-500" size={28} />
                Banka Faiz Oranları
              </h3>
              <div className="space-y-3">
                {bankRates.slice(0, 4).map((bank, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <div className="font-medium text-gray-900 text-sm">{bank.bank}</div>
                    <div className="text-right text-sm">
                      <div className="text-blue-600 font-semibold">%{bank.loanRate}</div>
                      <div className="text-gray-500">Kredi</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link 
                to="/banks" 
                className="block text-center mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Tüm Bankaları Görüntüle →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Banks Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Popüler Bankalar</h2>
            <p className="text-xl text-gray-600">En avantajlı oranları sunan bankaları keşfedin</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {bankRates.map((bank, index) => (
              <Link
                key={index}
                to={`/banks/${bank.bank.toLowerCase().replace(/\s+/g, '-')}`}
                className="group bg-gray-50 rounded-xl p-6 text-center hover:bg-blue-50 hover:shadow-md transition-all duration-300"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <span className="text-2xl font-bold text-blue-600">{bank.bank.charAt(0)}</span>
                </div>
                <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {bank.bank}
                </h4>
                <p className="text-sm text-gray-600 mt-1">%{bank.loanRate} faizden</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Neden KredyIo?</h2>
            <p className="text-xl text-gray-600">Finansal kararlarınızı doğru vermeniz için ihtiyacınız olan her şey</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                  <feature.icon className="text-white" size={36} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Hemen Başlayın</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Size en uygun finansal ürünleri bulmak için kredi hesaplama araçlarımızı kullanmaya başlayın
          </p>
          <Link
            to="/calculator"
            className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-300 transition-colors inline-flex items-center gap-2"
          >
            <Calculator size={24} />
            Kredi Hesapla
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;