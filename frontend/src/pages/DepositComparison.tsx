/**
 * Deposit Comparison Page
 * Compare different deposit products with filtering, sorting, and maturity calculations
 */

import React, { useEffect, useState } from 'react';
import MainNavigation from '../components/Navigation/MainNavigation';
import FooterNavigation from '../components/Navigation/FooterNavigation';
import Container from '../components/Navigation/Container';
import { mainNavItems, footerSections } from '../components/Navigation/configs';
import { depositProductsService, banksService } from '../services/api';
import { DepositProduct, Bank, DepositType } from '../types';
import './Pages.css';

interface DepositWithCalculation extends DepositProduct {
  calculatedReturn?: number;
  maturityAmount?: number;
}

const DepositComparison: React.FC = () => {
  // State
  const [deposits, setDeposits] = useState<DepositProduct[]>([]);
  const [filteredDeposits, setFilteredDeposits] = useState<DepositProduct[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter state
  const [selectedBankId, setSelectedBankId] = useState<number | null>(null);
  const [selectedDepositType, setSelectedDepositType] = useState<DepositType | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('TRY');
  const [depositAmount, setDepositAmount] = useState<number>(50000);
  const [depositTerm, setDepositTerm] = useState<number>(90); // days
  
  // Comparison state
  const [comparisonMode, setComparisonMode] = useState<boolean>(false);
  const [selectedForComparison, setSelectedForComparison] = useState<number[]>([]);
  const [comparisonDeposits, setComparisonDeposits] = useState<DepositWithCalculation[]>([]);
  
  // Sort state
  const [sortBy, setSortBy] = useState<'rate' | 'amount' | 'term'>('rate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [depositsData, banksData] = await Promise.all([
          depositProductsService.getProducts(),
          banksService.getBanks(true),
        ]);

        setDeposits(depositsData);
        setFilteredDeposits(depositsData);
        setBanks(banksData);
      } catch (err) {
        console.error('Error fetching deposit products:', err);
        setError('Mevduat ürünleri yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...deposits];

    // Bank filter
    if (selectedBankId) {
      filtered = filtered.filter(d => d.bankId === selectedBankId);
    }

    // Deposit type filter
    if (selectedDepositType !== null) {
      filtered = filtered.filter(d => d.type === selectedDepositType);
    }

    // Currency filter
    filtered = filtered.filter(d => d.currency === selectedCurrency);

    // Amount filter
    filtered = filtered.filter(d => {
      const meetsMin = depositAmount >= d.minimumAmount;
      const meetsMax = !d.maximumAmount || depositAmount <= d.maximumAmount;
      return meetsMin && meetsMax;
    });

    // Term filter
    filtered = filtered.filter(d => {
      const meetsMin = depositTerm >= d.minimumTerm;
      const meetsMax = !d.maximumTerm || depositTerm <= d.maximumTerm;
      return meetsMin && meetsMax;
    });

    // Active deposits only
    filtered = filtered.filter(d => d.isActive);

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'rate':
          comparison = a.interestRate - b.interestRate;
          break;
        case 'amount':
          comparison = a.minimumAmount - b.minimumAmount;
          break;
        case 'term':
          comparison = a.minimumTerm - b.minimumTerm;
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    setFilteredDeposits(filtered);
  }, [deposits, selectedBankId, selectedDepositType, selectedCurrency, depositAmount, depositTerm, sortBy, sortDirection]);

  // Calculate maturity return
  const calculateReturn = (deposit: DepositProduct): { returnAmount: number; maturityAmount: number } => {
    const principal = depositAmount;
    const rate = deposit.interestRate / 100;
    const days = depositTerm;
    
    // Simple interest: I = P * r * t (where t is in years)
    const timeInYears = days / 365;
    const returnAmount = principal * rate * timeInYears;
    const maturityAmount = principal + returnAmount;
    
    return { returnAmount, maturityAmount };
  };

  // Toggle comparison selection
  const toggleComparison = (depositId: number) => {
    if (selectedForComparison.includes(depositId)) {
      setSelectedForComparison(selectedForComparison.filter(id => id !== depositId));
    } else if (selectedForComparison.length < 3) {
      setSelectedForComparison([...selectedForComparison, depositId]);
    }
  };

  // Enter comparison mode
  const enterComparisonMode = () => {
    const selected = deposits.filter(d => selectedForComparison.includes(d.id));
    
    // Calculate returns for each
    const withCalculations = selected.map(deposit => {
      const { returnAmount, maturityAmount } = calculateReturn(deposit);
      return {
        ...deposit,
        calculatedReturn: returnAmount,
        maturityAmount: maturityAmount,
      };
    });
    
    setComparisonDeposits(withCalculations);
    setComparisonMode(true);
  };

  // Exit comparison mode
  const exitComparisonMode = () => {
    setComparisonMode(false);
    setSelectedForComparison([]);
    setComparisonDeposits([]);
  };

  // Format currency
  const formatCurrency = (value: number, currency: string = 'TRY') => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Get deposit type name
  const getDepositTypeName = (type: DepositType): string => {
    const types: Record<DepositType, string> = {
      [DepositType.VadeliMevduat]: 'Vadeli Mevduat',
      [DepositType.VadesizMevduat]: 'Vadesiz Mevduat',
      [DepositType.DovizMevduati]: 'Döviz Mevduatı',
      [DepositType.AltinHesabi]: 'Altın Hesabı',
      [DepositType.YatirimHesabi]: 'Yatırım Hesabı',
    };
    return types[type] || 'Diğer';
  };

  // Parse JSON features
  const parseFeatures = (data: string[] | any): string[] => {
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  // Get unique currencies
  const currencies = Array.from(new Set(deposits.map(d => d.currency))).filter(Boolean);

  if (loading) {
    return (
      <div className="deposit-comparison-page">
        <MainNavigation items={mainNavItems} />
        <Container size="xl" className="py-16">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-success-600"></div>
          </div>
        </Container>
        <FooterNavigation sections={footerSections} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="deposit-comparison-page">
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
    <div className="deposit-comparison-page">
      <MainNavigation items={mainNavItems} />

      {/* Header */}
      <section className="bg-gradient-to-r from-success-600 to-success-800 text-white py-12">
        <Container size="xl">
          <h1 className="text-4xl font-bold mb-4">Mevduat Karşılaştırma</h1>
          <p className="text-xl opacity-90">
            {filteredDeposits.length} mevduat ürünü arasından en yüksek getiriyi bulun
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

            {/* Calculation Summary */}
            <div className="bg-success-50 border border-success-200 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm text-neutral-600 mb-1">Yatırım Tutarı</div>
                  <div className="text-2xl font-bold text-neutral-900">
                    {formatCurrency(depositAmount, selectedCurrency)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-neutral-600 mb-1">Vade</div>
                  <div className="text-2xl font-bold text-neutral-900">
                    {depositTerm} gün
                  </div>
                </div>
                <div>
                  <div className="text-sm text-neutral-600 mb-1">Para Birimi</div>
                  <div className="text-2xl font-bold text-neutral-900">
                    {selectedCurrency}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {comparisonDeposits.map((deposit) => {
                const features = parseFeatures(deposit.features);
                const bank = banks.find(b => b.id === deposit.bankId);

                return (
                  <div key={deposit.id} className="bg-white border-2 border-success-200 rounded-lg overflow-hidden">
                    {/* Bank Header */}
                    <div className="bg-gradient-to-r from-success-500 to-success-600 text-white p-4">
                      <div className="flex items-center gap-3 mb-2">
                        {bank?.logoUrl && (
                          <img
                            src={bank.logoUrl}
                            alt={bank.name}
                            className="h-8 w-auto bg-white p-1 rounded"
                          />
                        )}
                        <div>
                          <div className="font-semibold">{bank?.name}</div>
                          <div className="text-sm opacity-90">{deposit.name}</div>
                        </div>
                      </div>
                      <span className="inline-block px-3 py-1 bg-white bg-opacity-20 rounded-full text-xs font-semibold">
                        {getDepositTypeName(deposit.type)}
                      </span>
                    </div>

                    <div className="p-6">
                      {/* Interest Rate - Prominent */}
                      <div className="bg-success-50 rounded-lg p-4 mb-4">
                        <div className="text-sm text-neutral-600 mb-1">Faiz Oranı</div>
                        <div className="text-3xl font-bold text-success-600">
                          %{deposit.interestRate.toFixed(2)}
                        </div>
                        <div className="text-xs text-neutral-500 mt-1">Yıllık</div>
                      </div>

                      {/* Calculated Returns */}
                      <div className="space-y-3 mb-4">
                        <div className="bg-neutral-50 rounded-lg p-3">
                          <div className="text-sm text-neutral-600 mb-1">Kazanç</div>
                          <div className="text-xl font-bold text-success-600">
                            {deposit.calculatedReturn ? formatCurrency(deposit.calculatedReturn, deposit.currency) : '-'}
                          </div>
                        </div>
                        
                        <div className="bg-success-100 rounded-lg p-3">
                          <div className="text-sm text-neutral-600 mb-1">Vade Sonunda Alacağınız</div>
                          <div className="text-2xl font-bold text-success-700">
                            {deposit.maturityAmount ? formatCurrency(deposit.maturityAmount, deposit.currency) : '-'}
                          </div>
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="space-y-2 mb-4 text-sm border-t pt-4">
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Min Tutar:</span>
                          <span className="font-semibold">{formatCurrency(deposit.minimumAmount, deposit.currency)}</span>
                        </div>
                        {deposit.maximumAmount && (
                          <div className="flex justify-between">
                            <span className="text-neutral-600">Max Tutar:</span>
                            <span className="font-semibold">{formatCurrency(deposit.maximumAmount, deposit.currency)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Min Vade:</span>
                          <span className="font-semibold">{deposit.minimumTerm} gün</span>
                        </div>
                        {deposit.maximumTerm && (
                          <div className="flex justify-between">
                            <span className="text-neutral-600">Max Vade:</span>
                            <span className="font-semibold">{deposit.maximumTerm} gün</span>
                          </div>
                        )}
                      </div>

                      {/* Features */}
                      {features.length > 0 && (
                        <div className="mb-4">
                          <div className="text-sm font-semibold text-neutral-700 mb-2">
                            ⭐ Özellikler
                          </div>
                          <ul className="text-sm space-y-1">
                            {features.slice(0, 3).map((feature, index) => (
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
                        href={bank?.websiteUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-3 bg-success-600 text-white text-center rounded-lg hover:bg-success-700 font-semibold"
                      >
                        Başvur
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>
      ) : (
        <>
          {/* Filters Section */}
          <section className="bg-white py-8 border-b sticky top-0 z-10 shadow-sm">
            <Container size="xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                {/* Bank Filter */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Banka
                  </label>
                  <select
                    value={selectedBankId || ''}
                    onChange={(e) => setSelectedBankId(e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-success-500 focus:border-transparent"
                  >
                    <option value="">Tüm Bankalar</option>
                    {banks.map((bank) => (
                      <option key={bank.id} value={bank.id}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Deposit Type Filter */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Mevduat Türü
                  </label>
                  <select
                    value={selectedDepositType !== null ? selectedDepositType : ''}
                    onChange={(e) => setSelectedDepositType(e.target.value ? Number(e.target.value) as DepositType : null)}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-success-500 focus:border-transparent"
                  >
                    <option value="">Tüm Türler</option>
                    <option value={DepositType.VadeliMevduat}>Vadeli Mevduat</option>
                    <option value={DepositType.VadesizMevduat}>Vadesiz Mevduat</option>
                    <option value={DepositType.DovizMevduati}>Döviz Mevduatı</option>
                    <option value={DepositType.AltinHesabi}>Altın Hesabı</option>
                    <option value={DepositType.YatirimHesabi}>Yatırım Hesabı</option>
                  </select>
                </div>

                {/* Currency Filter */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Para Birimi
                  </label>
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-success-500 focus:border-transparent"
                  >
                    {currencies.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount Filter */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Tutar: {formatCurrency(depositAmount, selectedCurrency)}
                  </label>
                  <input
                    type="range"
                    min="1000"
                    max="500000"
                    step="1000"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-neutral-600 mt-1">
                    <span>1K</span>
                    <span>500K</span>
                  </div>
                </div>

                {/* Term Filter */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Vade: {depositTerm} gün
                  </label>
                  <input
                    type="range"
                    min="30"
                    max="365"
                    step="30"
                    value={depositTerm}
                    onChange={(e) => setDepositTerm(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-neutral-600 mt-1">
                    <span>30</span>
                    <span>365</span>
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
                      setSortBy(by as 'rate' | 'amount' | 'term');
                      setSortDirection(dir as 'asc' | 'desc');
                    }}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-success-500 focus:border-transparent"
                  >
                    <option value="rate-desc">Faiz (Yüksek → Düşük)</option>
                    <option value="rate-asc">Faiz (Düşük → Yüksek)</option>
                    <option value="amount-asc">Tutar (Düşük → Yüksek)</option>
                    <option value="amount-desc">Tutar (Yüksek → Düşük)</option>
                    <option value="term-asc">Vade (Kısa → Uzun)</option>
                    <option value="term-desc">Vade (Uzun → Kısa)</option>
                  </select>
                </div>
              </div>

              {/* Comparison Bar */}
              {selectedForComparison.length > 0 && (
                <div className="mt-6 p-4 bg-success-50 border border-success-200 rounded-lg flex items-center justify-between">
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
                          ? 'bg-success-600 text-white hover:bg-success-700'
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

          {/* Deposits Grid */}
          <section className="py-8">
            <Container size="xl">
              {filteredDeposits.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">💰</div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                    Ürün Bulunamadı
                  </h3>
                  <p className="text-neutral-600">
                    Arama kriterlerinizi değiştirerek tekrar deneyin
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredDeposits.map((deposit) => {
                    const features = parseFeatures(deposit.features);
                    const bank = banks.find(b => b.id === deposit.bankId);
                    const { returnAmount, maturityAmount } = calculateReturn(deposit);

                    return (
                      <div
                        key={deposit.id}
                        className={`bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow border-2 ${
                          selectedForComparison.includes(deposit.id)
                            ? 'border-success-500'
                            : 'border-transparent'
                        }`}
                      >
                        {/* Selection Checkbox & Bank Info */}
                        <div className="p-4 border-b flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {bank?.logoUrl && (
                              <img
                                src={bank.logoUrl}
                                alt={bank.name}
                                className="h-6 w-auto"
                              />
                            )}
                            <div>
                              <div className="font-semibold text-neutral-900 text-sm">{bank?.name}</div>
                              <div className="text-xs text-neutral-600">{deposit.currency}</div>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={selectedForComparison.includes(deposit.id)}
                            onChange={() => toggleComparison(deposit.id)}
                            disabled={!selectedForComparison.includes(deposit.id) && selectedForComparison.length >= 3}
                            className="w-5 h-5 text-success-600 rounded focus:ring-2 focus:ring-success-500"
                          />
                        </div>

                        {/* Deposit Details */}
                        <div className="p-4">
                          <h3 className="text-lg font-bold text-neutral-900 mb-2">
                            {deposit.name}
                          </h3>
                          
                          <span className={`inline-block mb-3 px-2 py-1 rounded-full text-xs font-semibold ${
                            deposit.type === DepositType.VadeliMevduat ? 'bg-success-100 text-success-700' :
                            deposit.type === DepositType.DovizMevduati ? 'bg-blue-100 text-blue-700' :
                            deposit.type === DepositType.AltinHesabi ? 'bg-yellow-100 text-yellow-700' :
                            'bg-neutral-100 text-neutral-700'
                          }`}>
                            {getDepositTypeName(deposit.type)}
                          </span>

                          {/* Interest Rate - Prominent */}
                          <div className="bg-success-50 rounded-lg p-3 mb-3">
                            <div className="text-xs text-neutral-600 mb-1">Faiz Oranı</div>
                            <div className="text-2xl font-bold text-success-600">
                              %{deposit.interestRate.toFixed(2)}
                            </div>
                            <div className="text-xs text-neutral-500">Yıllık</div>
                          </div>

                          {/* Quick Calculation */}
                          <div className="bg-success-100 rounded-lg p-3 mb-3">
                            <div className="text-xs text-neutral-600 mb-1">Vade Sonunda Alacağınız</div>
                            <div className="text-lg font-bold text-success-700">
                              {formatCurrency(maturityAmount, deposit.currency)}
                            </div>
                            <div className="text-xs text-success-600 mt-1">
                              +{formatCurrency(returnAmount, deposit.currency)} kazanç
                            </div>
                          </div>

                          {/* Product Info */}
                          <div className="space-y-1 mb-3 text-xs">
                            <div className="flex justify-between">
                              <span className="text-neutral-600">Min Tutar:</span>
                              <span className="font-semibold">{formatCurrency(deposit.minimumAmount, deposit.currency)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-600">Vade:</span>
                              <span className="font-semibold">
                                {deposit.minimumTerm} - {deposit.maximumTerm || '∞'} gün
                              </span>
                            </div>
                          </div>

                          {/* Features Preview */}
                          {features.length > 0 && (
                            <div className="mb-3">
                              <ul className="text-xs space-y-1">
                                {features.slice(0, 2).map((feature, index) => (
                                  <li key={index} className="flex items-center gap-1 text-neutral-700">
                                    <span className="text-success-600 text-xs">✓</span>
                                    <span className="line-clamp-1">{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2">
                            <a
                              href={bank?.websiteUrl || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-2 bg-success-600 text-white text-center rounded-lg hover:bg-success-700 font-semibold text-sm"
                            >
                              Başvur
                            </a>
                            <button
                              className="px-3 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 text-sm"
                              onClick={() => alert(`${deposit.name} detayları yakında...`)}
                            >
                              Detay
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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

export default DepositComparison;
