/**
 * Loan Comparison Page
 * Compare different loan products with filtering, sorting, and side-by-side comparison
 */

import React, { useEffect, useState } from 'react';
import MainNavigation from '../components/Navigation/MainNavigation';
import FooterNavigation from '../components/Navigation/FooterNavigation';
import Container from '../components/Navigation/Container';
import { mainNavItems, footerSections } from '../components/Navigation/configs';
import { loanProductsService, banksService, calculatorService } from '../services/api';
import { LoanProduct, Bank, LoanProductFilter } from '../types';
import './Pages.css';

interface ComparisonProduct extends LoanProduct {
  monthlyPayment?: number;
}

const LoanComparison: React.FC = () => {
  // State
  const [products, setProducts] = useState<LoanProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<LoanProduct[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter state
  const [filters, setFilters] = useState<LoanProductFilter>({
    isActive: true,
  });
  const [selectedBankId, setSelectedBankId] = useState<number | null>(null);
  const [selectedLoanType, setSelectedLoanType] = useState<string>('');
  const [loanAmount, setLoanAmount] = useState<number>(100000);
  const [loanTerm, setLoanTerm] = useState<number>(36);
  
  // Comparison state
  const [comparisonMode, setComparisonMode] = useState<boolean>(false);
  const [selectedForComparison, setSelectedForComparison] = useState<number[]>([]);
  const [comparisonProducts, setComparisonProducts] = useState<ComparisonProduct[]>([]);
  
  // Sort state
  const [sortBy, setSortBy] = useState<'rate' | 'term' | 'amount'>('rate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [productsData, banksData] = await Promise.all([
          loanProductsService.getProducts(),
          banksService.getBanks(true),
        ]);

        setProducts(productsData);
        setFilteredProducts(productsData);
        setBanks(banksData);
      } catch (err) {
        console.error('Error fetching loan products:', err);
        setError('Kredi ürünleri yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...products];

    // Bank filter
    if (selectedBankId) {
      filtered = filtered.filter(p => p.bank.id === selectedBankId);
    }

    // Loan type filter
    if (selectedLoanType) {
      filtered = filtered.filter(p => p.loanType === selectedLoanType);
    }

    // Amount filter
    filtered = filtered.filter(p => 
      loanAmount >= p.minAmount && loanAmount <= p.maxAmount
    );

    // Term filter
    filtered = filtered.filter(p => 
      loanTerm >= p.minTerm && loanTerm <= p.maxTerm
    );

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'rate':
          comparison = a.minInterestRate - b.minInterestRate;
          break;
        case 'term':
          comparison = a.maxTerm - b.maxTerm;
          break;
        case 'amount':
          comparison = a.maxAmount - b.maxAmount;
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    setFilteredProducts(filtered);
  }, [products, selectedBankId, selectedLoanType, loanAmount, loanTerm, sortBy, sortDirection]);

  // Calculate monthly payment
  const calculateMonthlyPayment = async (product: LoanProduct): Promise<number> => {
    try {
      const result = await calculatorService.calculateLoanPayment({
        amount: loanAmount,
        interestRate: product.minInterestRate,
        termMonths: loanTerm,
      });
      return result.monthlyPayment;
    } catch {
      return 0;
    }
  };

  // Toggle comparison selection
  const toggleComparison = (productId: number) => {
    if (selectedForComparison.includes(productId)) {
      setSelectedForComparison(selectedForComparison.filter(id => id !== productId));
    } else if (selectedForComparison.length < 3) {
      setSelectedForComparison([...selectedForComparison, productId]);
    }
  };

  // Enter comparison mode
  const enterComparisonMode = async () => {
    const selected = products.filter(p => selectedForComparison.includes(p.id));
    
    // Calculate monthly payments for each
    const withPayments = await Promise.all(
      selected.map(async (product) => ({
        ...product,
        monthlyPayment: await calculateMonthlyPayment(product),
      }))
    );
    
    setComparisonProducts(withPayments);
    setComparisonMode(true);
  };

  // Exit comparison mode
  const exitComparisonMode = () => {
    setComparisonMode(false);
    setSelectedForComparison([]);
    setComparisonProducts([]);
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Get unique loan types
  const loanTypes = Array.from(new Set(products.map(p => p.loanType))).filter(Boolean);

  if (loading) {
    return (
      <div className="loan-comparison-page">
        <MainNavigation items={mainNavItems} />
        <Container size="xl" className="py-16">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
          </div>
        </Container>
        <FooterNavigation sections={footerSections} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="loan-comparison-page">
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
    <div className="loan-comparison-page">
      <MainNavigation items={mainNavItems} />

      {/* Header */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
        <Container size="xl">
          <h1 className="text-4xl font-bold mb-4">Kredi Karşılaştırma</h1>
          <p className="text-xl opacity-90">
            {filteredProducts.length} kredi ürünü arasından size en uygun olanı bulun
          </p>
        </Container>
      </section>

      {/* Comparison Mode */}
      {comparisonMode ? (
        <section className="bg-white py-8 border-b">
          <Container size="xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Karşılaştırma</h2>
              <button
                onClick={exitComparisonMode}
                className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300"
              >
                ← Listeye Dön
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {comparisonProducts.map((product) => (
                <div key={product.id} className="bg-white border-2 border-primary-200 rounded-lg p-6">
                  {/* Bank Logo & Name */}
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                    {product.bank.logoUrl && (
                      <img
                        src={product.bank.logoUrl}
                        alt={product.bank.name}
                        className="h-10 w-auto"
                      />
                    )}
                    <div>
                      <div className="font-semibold text-neutral-900">{product.bank.name}</div>
                      <div className="text-sm text-neutral-600">{product.productName}</div>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-neutral-600 mb-1">Faiz Oranı</div>
                      <div className="text-2xl font-bold text-primary-600">
                        %{product.minInterestRate.toFixed(2)}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-neutral-600 mb-1">Aylık Ödeme</div>
                      <div className="text-xl font-bold text-neutral-900">
                        {product.monthlyPayment ? formatCurrency(product.monthlyPayment) : '-'}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-neutral-600 mb-1">Kredi Tutarı</div>
                        <div className="font-semibold">
                          {formatCurrency(product.minAmount)} - {formatCurrency(product.maxAmount)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-neutral-600 mb-1">Vade</div>
                        <div className="font-semibold">
                          {product.minTerm} - {product.maxTerm} ay
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-neutral-600">Teminat: </span>
                        <span className={product.requiresCollateral ? 'text-danger-600' : 'text-success-600'}>
                          {product.requiresCollateral ? 'Gerekli' : 'Gereksiz'}
                        </span>
                      </div>
                      <div>
                        <span className="text-neutral-600">Kefil: </span>
                        <span className={product.requiresGuarantor ? 'text-danger-600' : 'text-success-600'}>
                          {product.requiresGuarantor ? 'Gerekli' : 'Gereksiz'}
                        </span>
                      </div>
                    </div>

                    {/* Features */}
                    {product.features && product.features.length > 0 && (
                      <div>
                        <div className="text-sm text-neutral-600 mb-2">Özellikler</div>
                        <ul className="text-sm space-y-1">
                          {product.features.slice(0, 3).map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <span className="text-success-600">✓</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Apply Button */}
                    <a
                      href={product.bank.websiteUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-3 bg-primary-600 text-white text-center rounded-lg hover:bg-primary-700 font-semibold"
                    >
                      Başvur
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      ) : (
        <>
          {/* Filters Section */}
          <section className="bg-white py-8 border-b sticky top-0 z-10 shadow-sm">
            <Container size="xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Bank Filter */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Banka
                  </label>
                  <select
                    value={selectedBankId || ''}
                    onChange={(e) => setSelectedBankId(e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Tüm Bankalar</option>
                    {banks.map((bank) => (
                      <option key={bank.id} value={bank.id}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Loan Type Filter */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Kredi Türü
                  </label>
                  <select
                    value={selectedLoanType}
                    onChange={(e) => setSelectedLoanType(e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Tüm Türler</option>
                    {loanTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount Filter */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Kredi Tutarı: {formatCurrency(loanAmount)}
                  </label>
                  <input
                    type="range"
                    min="10000"
                    max="1000000"
                    step="10000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-neutral-600 mt-1">
                    <span>10K</span>
                    <span>1M</span>
                  </div>
                </div>

                {/* Term Filter */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Vade: {loanTerm} ay
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="120"
                    step="3"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-neutral-600 mt-1">
                    <span>3 ay</span>
                    <span>120 ay</span>
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Sırala
                  </label>
                  <select
                    value={`${sortBy}-${sortDirection}`}
                    onChange={(e) => {
                      const [by, dir] = e.target.value.split('-');
                      setSortBy(by as 'rate' | 'term' | 'amount');
                      setSortDirection(dir as 'asc' | 'desc');
                    }}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="rate-asc">Faiz Oranı (Düşük → Yüksek)</option>
                    <option value="rate-desc">Faiz Oranı (Yüksek → Düşük)</option>
                    <option value="term-asc">Vade (Kısa → Uzun)</option>
                    <option value="term-desc">Vade (Uzun → Kısa)</option>
                    <option value="amount-asc">Tutar (Düşük → Yüksek)</option>
                    <option value="amount-desc">Tutar (Yüksek → Düşük)</option>
                  </select>
                </div>
              </div>

              {/* Comparison Bar */}
              {selectedForComparison.length > 0 && (
                <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-lg flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-semibold">{selectedForComparison.length}</span> ürün seçildi
                    {selectedForComparison.length >= 2 && (
                      <span className="text-neutral-600 ml-2">
                        (Karşılaştırmak için en az 2 ürün gerekli)
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedForComparison([])}
                      className="px-4 py-2 bg-white text-neutral-700 rounded-lg hover:bg-neutral-50 text-sm"
                    >
                      Temizle
                    </button>
                    <button
                      onClick={enterComparisonMode}
                      disabled={selectedForComparison.length < 2}
                      className={`px-6 py-2 rounded-lg text-sm font-semibold ${
                        selectedForComparison.length >= 2
                          ? 'bg-primary-600 text-white hover:bg-primary-700'
                          : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                      }`}
                    >
                      Karşılaştır ({selectedForComparison.length}/3)
                    </button>
                  </div>
                </div>
              )}
            </Container>
          </section>

          {/* Products Grid */}
          <section className="py-8">
            <Container size="xl">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                    Ürün Bulunamadı
                  </h3>
                  <p className="text-neutral-600">
                    Arama kriterlerinizi değiştirerek tekrar deneyin
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className={`bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow border-2 ${
                        selectedForComparison.includes(product.id)
                          ? 'border-primary-500'
                          : 'border-transparent'
                      }`}
                    >
                      {/* Selection Checkbox */}
                      <div className="p-4 border-b flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {product.bank.logoUrl && (
                            <img
                              src={product.bank.logoUrl}
                              alt={product.bank.name}
                              className="h-8 w-auto"
                            />
                          )}
                          <div>
                            <div className="font-semibold text-neutral-900">{product.bank.name}</div>
                            <div className="text-sm text-neutral-600">{product.loanType}</div>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedForComparison.includes(product.id)}
                          onChange={() => toggleComparison(product.id)}
                          disabled={!selectedForComparison.includes(product.id) && selectedForComparison.length >= 3}
                          className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-neutral-900 mb-4">
                          {product.productName}
                        </h3>

                        {/* Interest Rate - Prominent */}
                        <div className="bg-primary-50 rounded-lg p-4 mb-4">
                          <div className="text-sm text-neutral-600 mb-1">Faiz Oranı</div>
                          <div className="text-3xl font-bold text-primary-600">
                            %{product.minInterestRate.toFixed(2)}
                            {product.maxInterestRate !== product.minInterestRate && (
                              <span className="text-lg"> - %{product.maxInterestRate.toFixed(2)}</span>
                            )}
                          </div>
                        </div>

                        {/* Key Info */}
                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-neutral-600">Kredi Tutarı:</span>
                            <span className="font-semibold">
                              {formatCurrency(product.minAmount)} - {formatCurrency(product.maxAmount)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-neutral-600">Vade:</span>
                            <span className="font-semibold">
                              {product.minTerm} - {product.maxTerm} ay
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-neutral-600">Yaş Aralığı:</span>
                            <span className="font-semibold">
                              {product.minAge} - {product.maxAge} yaş
                            </span>
                          </div>
                        </div>

                        {/* Requirements */}
                        <div className="flex gap-2 mb-4">
                          {!product.requiresCollateral && (
                            <span className="px-2 py-1 bg-success-100 text-success-700 text-xs rounded-full">
                              Teminatsız
                            </span>
                          )}
                          {!product.requiresGuarantor && (
                            <span className="px-2 py-1 bg-success-100 text-success-700 text-xs rounded-full">
                              Kefilsiz
                            </span>
                          )}
                          {product.isFeatured && (
                            <span className="px-2 py-1 bg-warning-100 text-warning-700 text-xs rounded-full">
                              ⭐ Öne Çıkan
                            </span>
                          )}
                        </div>

                        {/* Features */}
                        {product.features && product.features.length > 0 && (
                          <div className="mb-4">
                            <ul className="text-sm space-y-1">
                              {product.features.slice(0, 2).map((feature, index) => (
                                <li key={index} className="flex items-center gap-2 text-neutral-700">
                                  <span className="text-success-600">✓</span>
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2">
                          <a
                            href={product.bank.websiteUrl || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2 bg-primary-600 text-white text-center rounded-lg hover:bg-primary-700 font-semibold text-sm"
                          >
                            Başvur
                          </a>
                          <button
                            className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 text-sm"
                            onClick={() => alert(`${product.productName} detayları yakında...`)}
                          >
                            Detay
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Container>
          </section>
        </>
      )}

      <FooterNavigation sections={footerSections} />
    </div>
  );
};

export default LoanComparison;
