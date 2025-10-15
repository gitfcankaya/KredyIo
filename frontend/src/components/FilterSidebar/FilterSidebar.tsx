/**
 * FilterSidebar Component
 * Comprehensive filtering system for product listings
 * 
 * Based on 25+ patterns from HesapKurdu.com analysis:
 * - Pattern #2, #4, #6-#11: Credit Card Filters
 * - Pattern #1, #3, #5, #40-#42: Loan Filters
 * - Pattern #15: Filter Chip Active State
 * - Pattern #16: Total Count with Emphasis
 * - Pattern #37: Deposit Filters
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  FilterSidebarProps,
  FilterSidebarState,
  FilterCategory,
  FilterOption,
  ActiveFilter,
  RangeValue,
} from './types';
import './FilterSidebar.css';

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  activeFilters,
  onFilterChange,
  onClearAll,
  onClearCategory,
  resultCount,
  totalCount,
  isLoading = false,
  layout = 'sidebar',
  isOpen = true,
  onClose,
  showResultCount = true,
  showClearAll = true,
  enableUrlSync = false,
  showActiveFilters = true,
  collapsedByDefault = false,
  onApplyFilters,
  className = '',
  headerContent,
  footerContent,
}) => {
  // Component state
  const [state, setState] = useState<FilterSidebarState>({
    expandedCategories: new Set(
      collapsedByDefault
        ? []
        : categories
            .filter(cat => cat.defaultExpanded !== false)
            .map(cat => cat.id)
    ),
    searchTerms: {},
    localFilters: { ...activeFilters },
  });

  // Update local filters when active filters change
  useEffect(() => {
    if (layout === 'sidebar') {
      setState(prev => ({ ...prev, localFilters: { ...activeFilters } }));
    }
  }, [activeFilters, layout]);

  // Toggle category expansion
  const toggleCategory = useCallback((categoryId: string) => {
    setState(prev => {
      const newExpanded = new Set(prev.expandedCategories);
      if (newExpanded.has(categoryId)) {
        newExpanded.delete(categoryId);
      } else {
        newExpanded.add(categoryId);
      }
      return { ...prev, expandedCategories: newExpanded };
    });
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback(
    (categoryId: string, value: any) => {
      if (layout === 'sidebar') {
        // Immediate update for sidebar
        onFilterChange(categoryId, value);
      } else {
        // Store locally for drawer/modal
        setState(prev => ({
          ...prev,
          localFilters: {
            ...prev.localFilters,
            [categoryId]: value,
          },
        }));
      }
    },
    [layout, onFilterChange]
  );

  // Handle apply filters (for drawer/modal)
  const handleApplyFilters = useCallback(() => {
    Object.entries(state.localFilters).forEach(([categoryId, value]) => {
      onFilterChange(categoryId, value);
    });
    if (onApplyFilters) {
      onApplyFilters();
    }
    if (onClose) {
      onClose();
    }
  }, [state.localFilters, onFilterChange, onApplyFilters, onClose]);

  // Get active filters as array
  const getActiveFilters = useCallback((): ActiveFilter[] => {
    const active: ActiveFilter[] = [];
    
    Object.entries(activeFilters).forEach(([categoryId, value]) => {
      const category = categories.find(cat => cat.id === categoryId);
      if (!category || !value) return;

      if (category.type === 'range' && Array.isArray(value)) {
        const [min, max] = value as [number, number];
        if (min !== category.min || max !== category.max) {
          active.push({
            categoryId,
            categoryLabel: category.label,
            value: [min, max] as [number, number],
            label: `${min} - ${max} ${category.unit || ''}`,
          });
        }
      } else if (category.type === 'checkbox' && Array.isArray(value) && value.length > 0) {
        (value as string[]).forEach((val: string) => {
          const option = category.options?.find(opt => opt.value === val);
          if (option) {
            active.push({
              categoryId,
              categoryLabel: category.label,
              value: val,
              label: option.label,
            });
          }
        });
      } else if (value && category.type !== 'checkbox') {
        const option = category.options?.find(opt => opt.value === value);
        active.push({
          categoryId,
          categoryLabel: category.label,
          value,
          label: option?.label || String(value),
        });
      }
    });

    return active;
  }, [activeFilters, categories]);

  // Remove single active filter
  const removeActiveFilter = useCallback(
    (filter: ActiveFilter) => {
      const category = categories.find(cat => cat.id === filter.categoryId);
      if (!category) return;

      if (category.type === 'checkbox') {
        const currentValues = (activeFilters[filter.categoryId] as string[]) || [];
        const newValues = currentValues.filter((v: string) => v !== filter.value);
        onFilterChange(filter.categoryId, newValues.length > 0 ? newValues : null);
      } else {
        onFilterChange(filter.categoryId, null);
      }
    },
    [categories, activeFilters, onFilterChange]
  );

  // Render checkbox group
  const renderCheckboxGroup = (category: FilterCategory) => {
    const selectedValues = (activeFilters[category.id] as string[]) || [];
    const searchTerm = state.searchTerms[category.id] || '';
    
    let options = category.options || [];
    if (searchTerm && category.showSearch) {
      options = options.filter(opt =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return (
      <div className="filter-checkbox-group">
        {category.showSearch && (
          <input
            type="text"
            placeholder="Ara..."
            className="filter-search-input"
            value={searchTerm}
            onChange={e =>
              setState(prev => ({
                ...prev,
                searchTerms: {
                  ...prev.searchTerms,
                  [category.id]: e.target.value,
                },
              }))
            }
          />
        )}
        
        {options.map(option => (
          <label key={option.value} className="filter-checkbox">
            <input
              type="checkbox"
              checked={selectedValues.includes(String(option.value))}
              disabled={option.disabled}
              onChange={e => {
                const newValues = e.target.checked
                  ? [...selectedValues, String(option.value)]
                  : selectedValues.filter((v: string) => v !== String(option.value));
                handleFilterChange(category.id, newValues.length > 0 ? newValues : null);
              }}
            />
            <span className="checkbox-label">
              {option.icon && <img src={option.icon} alt="" className="checkbox-icon" />}
              {option.label}
              {option.count !== undefined && (
                <span className="checkbox-count">({option.count})</span>
              )}
            </span>
          </label>
        ))}
      </div>
    );
  };

  // Render range slider
  const renderRangeSlider = (category: FilterCategory) => {
    const value = activeFilters[category.id] || [category.min, category.max];
    const [min, max] = Array.isArray(value) ? value : [category.min, category.max];

    return (
      <div className="filter-range-slider">
        <div className="range-values">
          <span className="range-value-min">
            {min} {category.unit}
          </span>
          <span className="range-value-max">
            {max} {category.unit}
          </span>
        </div>
        
        <div className="range-slider-container">
          <input
            type="range"
            min={category.min}
            max={category.max}
            step={category.step || 1}
            value={min}
            className="range-slider range-slider-min"
            onChange={e => {
              const newMin = Number(e.target.value);
              if (newMin <= max) {
                handleFilterChange(category.id, [newMin, max]);
              }
            }}
          />
          <input
            type="range"
            min={category.min}
            max={category.max}
            step={category.step || 1}
            value={max}
            className="range-slider range-slider-max"
            onChange={e => {
              const newMax = Number(e.target.value);
              if (newMax >= min) {
                handleFilterChange(category.id, [min, newMax]);
              }
            }}
          />
        </div>
        
        <div className="range-inputs">
          <input
            type="number"
            min={category.min}
            max={max}
            step={category.step || 1}
            value={min}
            className="range-input"
            onChange={e => {
              const newMin = Number(e.target.value);
              if (newMin <= max && newMin >= (category.min || 0)) {
                handleFilterChange(category.id, [newMin, max]);
              }
            }}
          />
          <span className="range-separator">-</span>
          <input
            type="number"
            min={min}
            max={category.max}
            step={category.step || 1}
            value={max}
            className="range-input"
            onChange={e => {
              const newMax = Number(e.target.value);
              if (newMax >= min && newMax <= (category.max || Infinity)) {
                handleFilterChange(category.id, [min, newMax]);
              }
            }}
          />
        </div>
      </div>
    );
  };

  // Render select dropdown
  const renderSelect = (category: FilterCategory) => {
    const value = activeFilters[category.id] || '';

    return (
      <select
        className="filter-select"
        value={value}
        onChange={e =>
          handleFilterChange(category.id, e.target.value || null)
        }
      >
        <option value="">Tümü</option>
        {category.options?.map(option => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
            {option.count !== undefined && ` (${option.count})`}
          </option>
        ))}
      </select>
    );
  };

  // Render chips (horizontal buttons)
  const renderChips = (category: FilterCategory) => {
    const value = activeFilters[category.id];

    return (
      <div className="filter-chips">
        {category.options?.map(option => (
          <button
            key={option.value}
            type="button"
            className={`filter-chip ${
              value === option.value ? 'active' : ''
            }`}
            disabled={option.disabled}
            onClick={() =>
              handleFilterChange(
                category.id,
                value === option.value ? null : option.value
              )
            }
          >
            {option.icon && <img src={option.icon} alt="" className="chip-icon" />}
            {option.label}
            {option.count !== undefined && (
              <span className="chip-count">{option.count}</span>
            )}
          </button>
        ))}
      </div>
    );
  };

  // Render radio group
  const renderRadioGroup = (category: FilterCategory) => {
    const value = activeFilters[category.id];

    return (
      <div className="filter-radio-group">
        {category.options?.map(option => (
          <label key={option.value} className="filter-radio">
            <input
              type="radio"
              name={category.id}
              value={option.value}
              checked={value === option.value}
              disabled={option.disabled}
              onChange={() => handleFilterChange(category.id, option.value)}
            />
            <span className="radio-label">
              {option.icon && <img src={option.icon} alt="" className="radio-icon" />}
              {option.label}
              {option.count !== undefined && (
                <span className="radio-count">({option.count})</span>
              )}
            </span>
          </label>
        ))}
      </div>
    );
  };

  // Render category content
  const renderCategoryContent = (category: FilterCategory) => {
    switch (category.type) {
      case 'checkbox':
        return renderCheckboxGroup(category);
      case 'range':
        return renderRangeSlider(category);
      case 'select':
        return renderSelect(category);
      case 'chips':
        return renderChips(category);
      case 'radio':
        return renderRadioGroup(category);
      default:
        return null;
    }
  };

  // Render active filters chips
  const renderActiveFilters = () => {
    const activeFiltersList = getActiveFilters();
    
    if (activeFiltersList.length === 0) return null;

    return (
      <div className="active-filters-section">
        <div className="active-filters-header">
          <span className="active-filters-title">Aktif Filtreler</span>
          {showClearAll && (
            <button
              type="button"
              className="clear-all-button"
              onClick={onClearAll}
            >
              Tümünü Temizle
            </button>
          )}
        </div>
        
        <div className="active-filters-chips">
          {activeFiltersList.map((filter, index) => (
            <div key={`${filter.categoryId}-${filter.value}-${index}`} className="active-filter-chip">
              <span className="active-filter-label">{filter.label}</span>
              <button
                type="button"
                className="active-filter-remove"
                onClick={() => removeActiveFilter(filter)}
                aria-label={`Remove ${filter.label}`}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4 4l8 8M12 4l-8 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render result count
  const renderResultCount = () => {
    if (!showResultCount) return null;

    return (
      <div className="result-count-section">
        {isLoading ? (
          <div className="result-count-loading">
            <div className="loading-spinner" />
            <span>Yükleniyor...</span>
          </div>
        ) : (
          <>
            <div className="result-count-number">{resultCount || 0}</div>
            <div className="result-count-label">
              {totalCount ? `/ ${totalCount} ` : ''}sonuç bulundu
            </div>
          </>
        )}
      </div>
    );
  };

  // Main content
  const renderContent = () => (
    <>
      {headerContent}
      
      {showActiveFilters && renderActiveFilters()}
      
      <div className="filter-categories">
        {categories.map(category => {
          const isExpanded = state.expandedCategories.has(category.id);
          const isCollapsible = category.isCollapsible !== false;

          return (
            <div key={category.id} className="filter-category">
              <div
                className={`filter-category-header ${
                  isCollapsible ? 'collapsible' : ''
                }`}
                onClick={() => isCollapsible && toggleCategory(category.id)}
              >
                <div className="filter-category-title">
                  {category.label}
                  {category.tooltip && (
                    <span className="filter-tooltip" title={category.tooltip}>
                      <svg width="16" height="16" viewBox="0 0 16 16">
                        <circle cx="8" cy="8" r="7" stroke="currentColor" fill="none" />
                        <text x="8" y="11" textAnchor="middle" fontSize="10">i</text>
                      </svg>
                    </span>
                  )}
                </div>
                
                {isCollapsible && (
                  <svg
                    className={`filter-category-chevron ${
                      isExpanded ? 'expanded' : ''
                    }`}
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M5 7.5l5 5 5-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                )}
                
                {onClearCategory && activeFilters[category.id] && (
                  <button
                    type="button"
                    className="filter-category-clear"
                    onClick={e => {
                      e.stopPropagation();
                      onClearCategory(category.id);
                    }}
                  >
                    Temizle
                  </button>
                )}
              </div>
              
              {category.description && isExpanded && (
                <div className="filter-category-description">
                  {category.description}
                </div>
              )}
              
              {isExpanded && (
                <div className="filter-category-content">
                  {renderCategoryContent(category)}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {renderResultCount()}
      
      {footerContent}
      
      {layout !== 'sidebar' && (
        <div className="filter-actions">
          <button
            type="button"
            className="filter-action-secondary"
            onClick={onClose}
          >
            İptal
          </button>
          <button
            type="button"
            className="filter-action-primary"
            onClick={handleApplyFilters}
          >
            Filtrele ({resultCount || 0})
          </button>
        </div>
      )}
    </>
  );

  // Render based on layout
  if (layout === 'drawer') {
    return (
      <>
        {isOpen && <div className="filter-overlay" onClick={onClose} />}
        <div className={`filter-sidebar drawer ${isOpen ? 'open' : ''} ${className}`}>
          <div className="drawer-header">
            <h2 className="drawer-title">Filtreler</h2>
            <button
              type="button"
              className="drawer-close"
              onClick={onClose}
              aria-label="Close filters"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
          <div className="drawer-content">{renderContent()}</div>
        </div>
      </>
    );
  }

  if (layout === 'modal') {
    if (!isOpen) return null;
    
    return (
      <div className="filter-modal-overlay" onClick={onClose}>
        <div
          className={`filter-sidebar modal ${className}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2 className="modal-title">Filtreler</h2>
            <button
              type="button"
              className="modal-close"
              onClick={onClose}
              aria-label="Close filters"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
          <div className="modal-content">{renderContent()}</div>
        </div>
      </div>
    );
  }

  // Default sidebar layout
  return (
    <div className={`filter-sidebar sidebar ${className}`}>
      {renderContent()}
    </div>
  );
};

export default FilterSidebar;
