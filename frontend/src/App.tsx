import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ComparisonPage from './pages/ComparisonPage';
import CalculatorHubPage from './pages/CalculatorHubPage';
import LoanList from './components/LoanList';
import CreditCardList from './components/CreditCardList';
import DepositRateList from './components/DepositRateList';
import CampaignList from './components/CampaignList';
import LoanCalculator from './components/LoanCalculator';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <nav className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="text-2xl font-bold text-blue-600">
                KredyIo
              </Link>
              <div className="flex gap-6">
                <Link
                  to="/"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Ana Sayfa
                </Link>
                <Link
                  to="/krediler"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Krediler
                </Link>
                <Link
                  to="/kredi-kartlari"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Kredi Kartları
                </Link>
                <Link
                  to="/mevduat"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Mevduat Oranları
                </Link>
                <Link
                  to="/kampanyalar"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Kampanyalar
                </Link>
                <Link
                  to="/karsilastir"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Karşılaştır
                </Link>
                <Link
                  to="/hesaplama"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Hesaplama
                </Link>
              </div>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/krediler" element={<LoanList />} />
            <Route path="/kredi-kartlari" element={<CreditCardList />} />
            <Route path="/mevduat" element={<DepositRateList />} />
            <Route path="/kampanyalar" element={<CampaignList />} />
            <Route path="/karsilastir" element={<ComparisonPage />} />
            <Route path="/hesaplama" element={<CalculatorHubPage />} />
            <Route path="/calculator" element={<LoanCalculator />} />
            {/* Fallback for 404 */}
            <Route path="*" element={
              <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-gray-600 mb-8">Sayfa bulunamadı</p>
                <Link to="/" className="text-blue-600 hover:underline">Ana Sayfaya Dön</Link>
              </div>
            } />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white mt-12">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">KredyIo</h3>
                <p className="text-gray-400">
                  Türkiye'nin en kapsamlı kredi karşılaştırma platformu
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Hızlı Linkler</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link to="/" className="hover:text-white">
                      Ana Sayfa
                    </Link>
                  </li>
                  <li>
                    <Link to="/products" className="hover:text-white">
                      Ürünler
                    </Link>
                  </li>
                  <li>
                    <Link to="/calculator" className="hover:text-white">
                      Hesaplama
                    </Link>
                  </li>
                  <li>
                    <Link to="/banks" className="hover:text-white">
                      Bankalar
                    </Link>
                  </li>
                  <li>
                    <Link to="/rates" className="hover:text-white">
                      Oranlar
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">İletişim</h3>
                <p className="text-gray-400">info@kredyio.com</p>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 KredyIo. Tüm hakları saklıdır.</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
