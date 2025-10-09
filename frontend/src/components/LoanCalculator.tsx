import React, { useState } from 'react';
import { calculatorService } from '../services/api';
import { LoanPaymentResult } from '../types';

const LoanCalculator: React.FC = () => {
  const [amount, setAmount] = useState<string>('50000');
  const [interestRate, setInterestRate] = useState<string>('1.89');
  const [termMonths, setTermMonths] = useState<string>('36');
  const [result, setResult] = useState<LoanPaymentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);

  const handleCalculate = async () => {
    try {
      setLoading(true);
      setError(null);

      const amountNum = parseFloat(amount);
      const rateNum = parseFloat(interestRate);
      const termNum = parseInt(termMonths);

      if (isNaN(amountNum) || isNaN(rateNum) || isNaN(termNum)) {
        setError('Lütfen geçerli değerler girin');
        return;
      }

      if (amountNum <= 0) {
        setError('Kredi tutarı 0\'dan büyük olmalıdır');
        return;
      }

      if (rateNum < 0) {
        setError('Faiz oranı negatif olamaz');
        return;
      }

      if (termNum <= 0) {
        setError('Vade 0\'dan büyük olmalıdır');
        return;
      }

      const calculationResult = await calculatorService.calculateLoanPayment({
        amount: amountNum,
        interestRate: rateNum,
        termMonths: termNum,
      });

      setResult(calculationResult);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Hesaplama sırasında bir hata oluştu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Kredi Hesaplama
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Kredi Bilgileri</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kredi Tutarı (₺)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="50000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yıllık Faiz Oranı (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="1.89"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vade (Ay)
              </label>
              <input
                type="number"
                value={termMonths}
                onChange={(e) => setTermMonths(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="36"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              onClick={handleCalculate}
              disabled={loading}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-white ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700'
              } transition-colors`}
            >
              {loading ? 'Hesaplanıyor...' : 'Hesapla'}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Sonuçlar</h2>

            <div className="space-y-4 mb-6">
              <div className="bg-primary-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Aylık Ödeme</div>
                <div className="text-3xl font-bold text-primary-600">
                  {formatCurrency(result.monthlyPayment)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Toplam Faiz</div>
                  <div className="text-xl font-semibold text-gray-800">
                    {formatCurrency(result.totalInterest)}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Toplam Ödeme</div>
                  <div className="text-xl font-semibold text-gray-800">
                    {formatCurrency(result.totalAmount)}
                  </div>
                </div>
              </div>
            </div>

            {/* Amortization Schedule */}
            {result.amortizationSchedule && result.amortizationSchedule.length > 0 && (
              <div>
                <button
                  onClick={() => setShowSchedule(!showSchedule)}
                  className="w-full mb-4 py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-700 transition-colors"
                >
                  {showSchedule ? 'Ödeme Planını Gizle' : 'Ödeme Planını Göster'}
                </button>

                {showSchedule && (
                  <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-4 py-2 text-left">Ay</th>
                          <th className="px-4 py-2 text-right">Ödeme</th>
                          <th className="px-4 py-2 text-right">Anapara</th>
                          <th className="px-4 py-2 text-right">Faiz</th>
                          <th className="px-4 py-2 text-right">Kalan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.amortizationSchedule.map((entry) => (
                          <tr key={entry.month} className="border-t border-gray-100">
                            <td className="px-4 py-2">{entry.month}</td>
                            <td className="px-4 py-2 text-right">
                              {formatCurrency(entry.payment)}
                            </td>
                            <td className="px-4 py-2 text-right">
                              {formatCurrency(entry.principal)}
                            </td>
                            <td className="px-4 py-2 text-right">
                              {formatCurrency(entry.interest)}
                            </td>
                            <td className="px-4 py-2 text-right">
                              {formatCurrency(entry.balance)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanCalculator;
