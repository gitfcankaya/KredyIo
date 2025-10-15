/**
 * CalculatorWidget Component
 * Universal calculator component for financial products
 * 
 * Based on 20+ patterns from HesapKurdu.com:
 * - Pattern #22: Dual Input Layout
 * - Pattern #39: Calculator Hub
 * - Real-time calculations with debouncing
 * - Breakdown display with charts
 * - URL parameter synchronization
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  CalculatorWidgetProps,
  CalculatorState,
  CalculatorInputConfig,
} from './types';
import {
  validateLoanInputs,
  validateCreditCardInputs,
  validateDepositInputs,
  encodeCalculatorParams,
  decodeCalculatorParams,
} from './utils';
import './CalculatorWidget.css';

const CalculatorWidget: React.FC<CalculatorWidgetProps> = ({
  config,
  layout = 'card',
  theme = 'light',
  initialValues = {},
  onCalculate,
  onChange,
  onShare,
  onCompare,
  showHeader = true,
  showFooter = true,
  showReset = true,
  autoCalculate = true,
  debounceMs = 500,
  className = '',
  containerClassName = '',
  primaryCTA,
  secondaryCTA,
}) => {
  // Initialize state
  const [state, setState] = useState<CalculatorState>(() => {
    const defaultValues: Record<string, number | string> = {};
    config.inputs.forEach(input => {
      defaultValues[input.id] = initialValues[input.id] ?? input.defaultValue;
    });
    
    return {
      values: defaultValues,
      result: null,
      isCalculating: false,
      errors: {},
      isDirty: false,
      showBreakdown: config.showBreakdown ?? true,
      showChart: config.showChart ?? false,
    };
  });

  // Debounce timer
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // Handle input change
  const handleInputChange = useCallback(
    (inputId: string, value: number | string) => {
      setState(prev => {
        const newValues = {
          ...prev.values,
          [inputId]: value,
        };

        // Call onChange callback
        if (onChange) {
          onChange(newValues);
        }

        return {
          ...prev,
          values: newValues,
          isDirty: true,
          errors: {
            ...prev.errors,
            [inputId]: '', // Clear error for this input
          },
        };
      });

      // Auto-calculate with debounce
      if (autoCalculate) {
        if (debounceTimer) {
          clearTimeout(debounceTimer);
        }

        const timer = setTimeout(() => {
          performCalculation();
        }, debounceMs);

        setDebounceTimer(timer);
      }
    },
    [autoCalculate, debounceMs, debounceTimer, onChange]
  );

  // Perform calculation
  const performCalculation = useCallback(() => {
    setState(prev => ({ ...prev, isCalculating: true }));

    try {
      // Validate inputs based on calculator type
      let validation = { valid: true, errors: [] as string[] };
      
      if (config.type === 'loan' || config.type === 'mortgage' || config.type === 'vehicle') {
        const amount = Number(state.values.amount || 0);
        const rate = Number(state.values.interestRate || 0);
        const term = Number(state.values.term || 0);
        validation = validateLoanInputs(amount, rate, term);
      } else if (config.type === 'creditCard') {
        const income = Number(state.values.monthlyIncome || 0);
        const debts = Number(state.values.existingDebts || 0);
        validation = validateCreditCardInputs(income, debts);
      } else if (config.type === 'deposit') {
        const amount = Number(state.values.principal || 0);
        const rate = Number(state.values.interestRate || 0);
        const term = Number(state.values.term || 0);
        validation = validateDepositInputs(amount, rate, term);
      }

      if (!validation.valid) {
        setState(prev => ({
          ...prev,
          isCalculating: false,
          errors: { general: validation.errors.join(', ') },
        }));
        return;
      }

      // Perform calculation
      const result = config.calculate(state.values);

      setState(prev => ({
        ...prev,
        result,
        isCalculating: false,
        errors: {},
      }));

      // Call onCalculate callback
      if (onCalculate) {
        onCalculate(result);
      }

      // Update URL if enabled
      if (config.enableUrlSync) {
        const params = encodeCalculatorParams(config.type, state.values);
        window.history.replaceState({}, '', `?${params}`);
      }
    } catch (error) {
      console.error('Calculation error:', error);
      setState(prev => ({
        ...prev,
        isCalculating: false,
        errors: { general: 'Hesaplama sırasında bir hata oluştu' },
      }));
    }
  }, [config, state.values, onCalculate]);

  // Handle manual calculate button click
  const handleCalculate = useCallback(() => {
    performCalculation();
  }, [performCalculation]);

  // Handle reset
  const handleReset = useCallback(() => {
    const defaultValues: Record<string, number | string> = {};
    config.inputs.forEach(input => {
      defaultValues[input.id] = input.defaultValue;
    });

    setState({
      values: defaultValues,
      result: null,
      isCalculating: false,
      errors: {},
      isDirty: false,
      showBreakdown: config.showBreakdown ?? true,
      showChart: config.showChart ?? false,
    });

    if (onChange) {
      onChange(defaultValues);
    }
  }, [config, onChange]);

  // Handle share
  const handleShare = useCallback(() => {
    const params = encodeCalculatorParams(config.type, state.values);
    const url = `${window.location.origin}${window.location.pathname}?${params}`;
    
    if (navigator.share) {
      navigator.share({
        title: config.title,
        text: config.description,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link kopyalandı!');
    }

    if (onShare) {
      onShare(url);
    }
  }, [config, state.values, onShare]);

  // Initialize from URL parameters
  useEffect(() => {
    if (config.enableUrlSync) {
      const { type, values } = decodeCalculatorParams(window.location.search);
      if (type === config.type && Object.keys(values).length > 0) {
        setState(prev => ({
          ...prev,
          values: { ...prev.values, ...values },
        }));
        
        // Auto-calculate if there are URL params
        if (autoCalculate) {
          setTimeout(() => performCalculation(), 100);
        }
      }
    }
  }, [config.enableUrlSync, config.type, autoCalculate]);

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  // Render input field
  const renderInput = (input: CalculatorInputConfig) => {
    const value = state.values[input.id];
    const error = state.errors[input.id];

    if (input.type === 'slider') {
      return (
        <div key={input.id} className="calculator-input-group">
          <label className="calculator-label">
            {input.label}
            {input.tooltip && (
              <span className="calculator-tooltip" title={input.tooltip}>
                <svg width="16" height="16" viewBox="0 0 16 16">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" fill="none" />
                  <text x="8" y="11" textAnchor="middle" fontSize="10">i</text>
                </svg>
              </span>
            )}
          </label>
          
          <div className="calculator-slider-container">
            <div className="calculator-slider-value">
              {input.prefix}
              {input.formatValue
                ? input.formatValue(Number(value))
                : Number(value).toLocaleString('tr-TR')}
              {input.suffix || input.unit}
            </div>
            
            <input
              type="range"
              min={input.min}
              max={input.max}
              step={input.step || 1}
              value={Number(value)}
              onChange={e => handleInputChange(input.id, Number(e.target.value))}
              className="calculator-slider"
            />
            
            <div className="calculator-slider-labels">
              <span>{input.min?.toLocaleString('tr-TR')} {input.unit}</span>
              <span>{input.max?.toLocaleString('tr-TR')} {input.unit}</span>
            </div>
          </div>
          
          {error && <span className="calculator-error">{error}</span>}
        </div>
      );
    }

    if (input.type === 'input') {
      return (
        <div key={input.id} className="calculator-input-group">
          <label className="calculator-label">
            {input.label}
            {input.tooltip && (
              <span className="calculator-tooltip" title={input.tooltip}>
                <svg width="16" height="16" viewBox="0 0 16 16">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" fill="none" />
                  <text x="8" y="11" textAnchor="middle" fontSize="10">i</text>
                </svg>
              </span>
            )}
          </label>
          
          <div className="calculator-input-wrapper">
            {input.prefix && <span className="calculator-input-prefix">{input.prefix}</span>}
            <input
              type="number"
              min={input.min}
              max={input.max}
              step={input.step || 1}
              value={value}
              onChange={e => handleInputChange(input.id, Number(e.target.value))}
              className="calculator-input"
              placeholder={`${input.min || 0} - ${input.max || '∞'}`}
            />
            {input.suffix && <span className="calculator-input-suffix">{input.suffix}</span>}
            {input.unit && <span className="calculator-input-unit">{input.unit}</span>}
          </div>
          
          {error && <span className="calculator-error">{error}</span>}
        </div>
      );
    }

    if (input.type === 'select') {
      return (
        <div key={input.id} className="calculator-input-group">
          <label className="calculator-label">{input.label}</label>
          
          <select
            value={String(value)}
            onChange={e => handleInputChange(input.id, e.target.value)}
            className="calculator-select"
          >
            {input.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          {error && <span className="calculator-error">{error}</span>}
        </div>
      );
    }

    return null;
  };

  // Render result summary
  const renderResultSummary = () => {
    if (!state.result) return null;

    if (state.result.type === 'loan') {
      return (
        <div className="calculator-result-summary">
          <div className="calculator-result-item emphasis">
            <span className="result-label">Aylık Ödeme</span>
            <span className="result-value">
              ₺{state.result.monthlyPayment.toLocaleString('tr-TR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          
          <div className="calculator-result-item">
            <span className="result-label">Toplam Ödeme</span>
            <span className="result-value">
              ₺{state.result.totalPayment.toLocaleString('tr-TR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          
          <div className="calculator-result-item">
            <span className="result-label">Toplam Faiz</span>
            <span className="result-value">
              ₺{state.result.totalInterest.toLocaleString('tr-TR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      );
    }

    if (state.result.type === 'creditCard') {
      return (
        <div className="calculator-result-summary">
          <div className="calculator-result-item emphasis">
            <span className="result-label">Önerilen Limit</span>
            <span className="result-value">
              ₺{state.result.recommendedLimit.toLocaleString('tr-TR')}
            </span>
          </div>
          
          <div className="calculator-result-item">
            <span className="result-label">Minimum Limit</span>
            <span className="result-value">
              ₺{state.result.minimumLimit.toLocaleString('tr-TR')}
            </span>
          </div>
          
          <div className="calculator-result-item">
            <span className="result-label">Maximum Limit</span>
            <span className="result-value">
              ₺{state.result.maximumLimit.toLocaleString('tr-TR')}
            </span>
          </div>
        </div>
      );
    }

    if (state.result.type === 'deposit') {
      return (
        <div className="calculator-result-summary">
          <div className="calculator-result-item emphasis">
            <span className="result-label">Vade Sonu Tutarı</span>
            <span className="result-value">
              ₺{state.result.maturityAmount.toLocaleString('tr-TR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          
          <div className="calculator-result-item">
            <span className="result-label">Net Kazanç</span>
            <span className="result-value">
              ₺{state.result.netInterest.toLocaleString('tr-TR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          
          <div className="calculator-result-item">
            <span className="result-label">Efektif Getiri</span>
            <span className="result-value">
              %{state.result.effectiveYield.toFixed(2)}
            </span>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={`calculator-widget ${layout} ${theme} ${className}`}>
      <div className={`calculator-container ${containerClassName}`}>
        {showHeader && (
          <div className="calculator-header">
            {config.icon && (
              <img src={config.icon} alt="" className="calculator-icon" />
            )}
            <div className="calculator-title-group">
              <h2 className="calculator-title">{config.title}</h2>
              {config.description && (
                <p className="calculator-description">{config.description}</p>
              )}
            </div>
          </div>
        )}

        <div className="calculator-content">
          <div className="calculator-inputs">
            {config.inputs.map(input => renderInput(input))}
          </div>

          {state.errors.general && (
            <div className="calculator-error-banner">
              {state.errors.general}
            </div>
          )}

          {!autoCalculate && (
            <button
              type="button"
              className="calculator-button primary"
              onClick={handleCalculate}
              disabled={state.isCalculating}
            >
              {state.isCalculating ? 'Hesaplanıyor...' : 'Hesapla'}
            </button>
          )}

          {state.result && (
            <div className="calculator-results">
              {renderResultSummary()}
              
              {state.showBreakdown && state.result.type === 'loan' && (
                <button
                  type="button"
                  className="calculator-toggle-breakdown"
                  onClick={() =>
                    setState(prev => ({
                      ...prev,
                      showBreakdown: !prev.showBreakdown,
                    }))
                  }
                >
                  Ödeme Planını Göster
                </button>
              )}
            </div>
          )}
        </div>

        {showFooter && (
          <div className="calculator-footer">
            <div className="calculator-actions">
              {showReset && (
                <button
                  type="button"
                  className="calculator-button secondary"
                  onClick={handleReset}
                >
                  Sıfırla
                </button>
              )}
              
              {config.showShare && state.result && (
                <button
                  type="button"
                  className="calculator-button secondary"
                  onClick={handleShare}
                >
                  Paylaş
                </button>
              )}
              
              {primaryCTA && (
                <button
                  type="button"
                  className="calculator-button primary"
                  onClick={primaryCTA.onClick}
                >
                  {primaryCTA.label}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalculatorWidget;
