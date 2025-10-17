/**
 * Reusable Data Table Component
 * Generic table with search, sort, pagination
 */

import React, { useState, useEffect } from 'react';
import './DataTable.css';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  pageSize?: number;
  emptyMessage?: string;
}

export function DataTable<T extends { id: number | string }>({
  data,
  columns,
  loading = false,
  searchable = true,
  searchPlaceholder = 'Ara...',
  searchKeys = [],
  onEdit,
  onDelete,
  onView,
  pageSize: initialPageSize = 10,
  emptyMessage = '📭 Veri bulunamadı',
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [filteredData, setFilteredData] = useState<T[]>(data);

  useEffect(() => {
    filterAndSort();
  }, [data, searchTerm, sortColumn, sortDirection]);

  const filterAndSort = () => {
    let result = [...data];

    // Search filter
    if (searchTerm && searchKeys.length > 0) {
      result = result.filter(item =>
        searchKeys.some(key => {
          const value = item[key];
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Sort
    if (sortColumn) {
      result.sort((a, b) => {
        const aValue = (a as any)[sortColumn];
        const bValue = (b as any)[sortColumn];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc'
            ? aValue.localeCompare(bValue, 'tr')
            : bValue.localeCompare(aValue, 'tr');
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }

        return 0;
      });
    }

    setFilteredData(result);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading) {
    return (
      <div className="table-loading">
        <div className="spinner"></div>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="data-table-wrapper">
      {/* Controls */}
      <div className="table-controls">
        {searchable && (
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        )}
        <div className="page-size-selector">
          <label>Göster:</label>
          <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  onClick={() => column.sortable !== false && handleSort(String(column.key))}
                  className={column.sortable !== false ? 'sortable' : ''}
                  style={{ width: column.width }}
                >
                  {column.label}
                  {sortColumn === column.key && (
                    <span className="sort-indicator">
                      {sortDirection === 'asc' ? ' ↑' : ' ↓'}
                    </span>
                  )}
                </th>
              ))}
              {(onEdit || onDelete || onView) && <th style={{ width: '120px' }}>İşlemler</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr key={item.id}>
                {columns.map((column) => (
                  <td key={String(column.key)}>
                    {column.render ? column.render(item) : String((item as any)[column.key] || '')}
                  </td>
                ))}
                {(onEdit || onDelete || onView) && (
                  <td>
                    <div className="action-buttons">
                      {onView && (
                        <button
                          className="btn btn-sm btn-info"
                          onClick={() => onView(item)}
                          title="Görüntüle"
                        >
                          👁️
                        </button>
                      )}
                      {onEdit && (
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => onEdit(item)}
                          title="Düzenle"
                        >
                          ✏️
                        </button>
                      )}
                      {onDelete && (
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => onDelete(item)}
                          title="Sil"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {paginatedData.length === 0 && (
          <div className="no-data">{searchTerm ? '🔍 Arama sonucu bulunamadı' : emptyMessage}</div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            ⏮ İlk
          </button>
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ◀ Önceki
          </button>
          <span className="pagination-info">
            Sayfa {currentPage} / {totalPages} ({filteredData.length} kayıt)
          </span>
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Sonraki ▶
          </button>
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            Son ⏭
          </button>
        </div>
      )}
    </div>
  );
}
