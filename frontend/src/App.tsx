import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProductList from './components/ProductList';
import LoanCalculator from './components/LoanCalculator';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <nav className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="text-2xl font-bold text-primary-600">
                KredyIo
              </Link>
              <div className="flex gap-6">
                <Link
                  to="/"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Ürünler
                </Link>
                <Link
                  to="/calculator"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
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
            <Route path="/" element={<ProductList />} />
            <Route path="/calculator" element={<LoanCalculator />} />
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
                      Ürünler
                    </Link>
                  </li>
                  <li>
                    <Link to="/calculator" className="hover:text-white">
                      Hesaplama
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
