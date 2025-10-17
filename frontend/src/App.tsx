import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ComparisonPage from './pages/ComparisonPage';
import CalculatorHubPage from './pages/CalculatorHubPage';
import MarketDataPage from './pages/MarketDataPage';
import NewsPage from './pages/NewsPage';
import GuidesPage from './pages/GuidesPage';
import FAQPage from './pages/FAQPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import LoanList from './components/LoanList';
import CreditCardList from './components/CreditCardList';
import DepositRateList from './components/DepositRateList';
import CampaignList from './components/CampaignList';
import LoanCalculator from './components/LoanCalculator';
import AdminLayout from './components/Admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import BanksManagement from './pages/admin/BanksManagement';
import CampaignsManagement from './pages/admin/CampaignsManagement';
import LoansManagement from './pages/admin/LoansManagement';
import CardsManagement from './pages/admin/CardsManagement';
import DepositsManagement from './pages/admin/DepositsManagement';
import ArticlesManagement from './pages/admin/ArticlesManagement';
import NewsManagement from './pages/admin/NewsManagement';

function AppContent() {
  const { isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              KredyIo
            </Link>
            <div className="flex gap-6 items-center">
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
              <Link
                to="/piyasalar"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Piyasalar
              </Link>
              <Link
                to="/haberler"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Haberler
              </Link>
              <Link
                to="/rehber"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Rehber
              </Link>
              <Link
                to="/sss"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                SSS
              </Link>
              
              {/* Auth Links */}
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="text-purple-600 hover:text-purple-800 font-medium transition-colors"
                    >
                      🔧 Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="text-red-600 hover:text-red-800 font-medium transition-colors"
                  >
                    Çıkış
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Giriş
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/krediler" element={<LoanList />} />
          <Route path="/kredi-kartlari" element={<CreditCardList />} />
          <Route path="/mevduat" element={<DepositRateList />} />
          <Route path="/kampanyalar" element={<CampaignList />} />
          <Route path="/karsilastir" element={<ComparisonPage />} />
          <Route path="/hesaplama" element={<CalculatorHubPage />} />
          <Route path="/calculator" element={<LoanCalculator />} />
          <Route path="/piyasalar" element={<MarketDataPage />} />
          <Route path="/haberler" element={<NewsPage />} />
          <Route path="/rehber" element={<GuidesPage />} />
          <Route path="/rehber/:slug" element={<GuidesPage />} />
          <Route path="/sss" element={<FAQPage />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Admin Routes - Protected */}
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/banks" element={<BanksManagement />} />
                  <Route path="/campaigns" element={<CampaignsManagement />} />
                  <Route path="/products/loans" element={<LoansManagement />} />
                  <Route path="/products/credit-cards" element={<CardsManagement />} />
                  <Route path="/products/deposits" element={<DepositsManagement />} />
                  <Route path="/content/articles" element={<ArticlesManagement />} />
                  <Route path="/content/news" element={<NewsManagement />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          } />
          
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
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
