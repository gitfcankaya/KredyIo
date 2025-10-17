/**
 * Banks Management Component
 * Full CRUD operations for banks with data table
 */

import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/Admin/AdminLayout';
import { banksService } from '../../services/api';
import { Bank } from '../../types';
import './BanksManagement.css';

interface BankFormData {
  name: string;
  code: string;
  logoUrl: string;
  websiteUrl: string;
  description: string;
  rating: number;
  customerCount: number;
  isActive: boolean;
}

const initialFormData: BankFormData = {
  name: '',
  code: '',
  logoUrl: '',
  websiteUrl: '',
  description: '',
  rating: 0,
  customerCount: 0,
  isActive: true,
};

const BanksManagement: React.FC = () => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [filteredBanks, setFilteredBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Table state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof Bank>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [formData, setFormData] = useState<BankFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof BankFormData, string>>>({});
  const [saving, setSaving] = useState(false);

  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bankToDelete, setBankToDelete] = useState<Bank | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadBanks();
  }, []);

  useEffect(() => {
    filterAndSortBanks();
  }, [banks, searchTerm, sortColumn, sortDirection]);

  const loadBanks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await banksService.getBanks();
      setBanks(data);
    } catch (err) {
      setError('Bankalar yüklenirken hata oluştu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortBanks = () => {
    let result = [...banks];

    // Search filter
    if (searchTerm) {
      result = result.filter(bank =>
        bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bank.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    result.sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

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

    setFilteredBanks(result);
  };

  const handleSort = (column: keyof Bank) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedBank(null);
    setFormData(initialFormData);
    setFormErrors({});
    setShowModal(true);
  };

  const openEditModal = (bank: Bank) => {
    setModalMode('edit');
    setSelectedBank(bank);
    setFormData({
      name: bank.name,
      code: bank.code,
      logoUrl: bank.logoUrl || '',
      websiteUrl: bank.websiteUrl || '',
      description: bank.description || '',
      rating: bank.rating || 0,
      customerCount: bank.customerCount || 0,
      isActive: bank.isActive,
    });
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBank(null);
    setFormData(initialFormData);
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof BankFormData, string>> = {};

    if (!formData.name.trim()) {
      errors.name = 'Banka adı zorunludur';
    }

    if (!formData.code.trim()) {
      errors.code = 'Banka kodu zorunludur';
    } else if (formData.code.length > 10) {
      errors.code = 'Banka kodu en fazla 10 karakter olabilir';
    }

    if (formData.rating < 0 || formData.rating > 5) {
      errors.rating = 'Puan 0-5 arasında olmalıdır';
    }

    if (formData.customerCount < 0) {
      errors.customerCount = 'Müşteri sayısı negatif olamaz';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      if (modalMode === 'create') {
        await banksService.createBank(formData);
      } else if (selectedBank) {
        await banksService.updateBank(selectedBank.id, formData);
      }

      await loadBanks();
      closeModal();
    } catch (err: any) {
      setError(err.message || 'İşlem sırasında hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const openDeleteConfirm = (bank: Bank) => {
    setBankToDelete(bank);
    setShowDeleteConfirm(true);
  };

  const closeDeleteConfirm = () => {
    setBankToDelete(null);
    setShowDeleteConfirm(false);
  };

  const handleDelete = async () => {
    if (!bankToDelete) return;

    try {
      setDeleting(true);
      setError(null);
      await banksService.deleteBank(bankToDelete.id);
      await loadBanks();
      closeDeleteConfirm();
    } catch (err: any) {
      setError(err.message || 'Silme işlemi sırasında hata oluştu');
    } finally {
      setDeleting(false);
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredBanks.length / pageSize);
  const paginatedBanks = filteredBanks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <AdminLayout>
      <div className="banks-management">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Banka Yönetimi</h1>
            <p className="page-subtitle">
              Toplam {filteredBanks.length} banka
              {searchTerm && ` (${banks.length} içinden filtrelendi)`}
            </p>
          </div>
          <button className="btn btn-primary" onClick={openCreateModal}>
            ➕ Yeni Banka Ekle
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error">
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        {/* Table Controls */}
        <div className="table-controls">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Banka adı veya kodu ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
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

        {/* Data Table */}
        {loading ? (
          <div className="table-loading">
            <div className="spinner"></div>
            <p>Yükleniyor...</p>
          </div>
        ) : (
          <>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('name')} className="sortable">
                      Banka Adı {sortColumn === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('code')} className="sortable">
                      Kod {sortColumn === 'code' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('rating')} className="sortable">
                      Puan {sortColumn === 'rating' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('customerCount')} className="sortable">
                      Müşteri Sayısı {sortColumn === 'customerCount' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('isActive')} className="sortable">
                      Durum {sortColumn === 'isActive' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBanks.map(bank => (
                    <tr key={bank.id}>
                      <td>
                        <div className="bank-cell">
                          {bank.logoUrl && (
                            <img src={bank.logoUrl} alt={bank.name} className="bank-logo" />
                          )}
                          <div>
                            <div className="bank-name">{bank.name}</div>
                            {bank.description && (
                              <div className="bank-desc">{bank.description.substring(0, 50)}...</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td><code>{bank.code}</code></td>
                      <td>
                        <div className="rating">
                          {'⭐'.repeat(Math.floor(bank.rating || 0))}
                          <span className="rating-value">{bank.rating?.toFixed(1) || '0.0'}</span>
                        </div>
                      </td>
                      <td>{(bank.customerCount || 0).toLocaleString('tr-TR')}</td>
                      <td>
                        <span className={`status-badge ${bank.isActive ? 'active' : 'inactive'}`}>
                          {bank.isActive ? '✓ Aktif' : '✕ Pasif'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => openEditModal(bank)}
                            title="Düzenle"
                          >
                            ✏️
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => openDeleteConfirm(bank)}
                            title="Sil"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {paginatedBanks.length === 0 && (
                <div className="no-data">
                  {searchTerm ? '🔍 Arama sonucu bulunamadı' : '📭 Henüz banka eklenmemiş'}
                </div>
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
                  Sayfa {currentPage} / {totalPages}
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
          </>
        )}

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">
                  {modalMode === 'create' ? '➕ Yeni Banka Ekle' : '✏️ Banka Düzenle'}
                </h2>
                <button className="modal-close" onClick={closeModal}>✕</button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">
                        Banka Adı <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-input ${formErrors.name ? 'error' : ''}`}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Örn: Türkiye İş Bankası"
                      />
                      {formErrors.name && <span className="error-message">{formErrors.name}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Banka Kodu <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-input ${formErrors.code ? 'error' : ''}`}
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        placeholder="Örn: ISBANK"
                        maxLength={10}
                      />
                      {formErrors.code && <span className="error-message">{formErrors.code}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Logo URL</label>
                      <input
                        type="url"
                        className="form-input"
                        value={formData.logoUrl}
                        onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                        placeholder="https://example.com/logo.png"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Website URL</label>
                      <input
                        type="url"
                        className="form-input"
                        value={formData.websiteUrl}
                        onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                        placeholder="https://www.example.com"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Açıklama</label>
                    <textarea
                      className="form-textarea"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Banka hakkında kısa açıklama..."
                      rows={3}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">
                        Puan (0-5) <span className="required">*</span>
                      </label>
                      <input
                        type="number"
                        className={`form-input ${formErrors.rating ? 'error' : ''}`}
                        value={formData.rating}
                        onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                        min="0"
                        max="5"
                        step="0.1"
                      />
                      {formErrors.rating && <span className="error-message">{formErrors.rating}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Müşteri Sayısı</label>
                      <input
                        type="number"
                        className={`form-input ${formErrors.customerCount ? 'error' : ''}`}
                        value={formData.customerCount}
                        onChange={(e) => setFormData({ ...formData, customerCount: Number(e.target.value) })}
                        min="0"
                      />
                      {formErrors.customerCount && <span className="error-message">{formErrors.customerCount}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      />
                      <span>Aktif</span>
                    </label>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                    disabled={saving}
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? 'Kaydediliyor...' : modalMode === 'create' ? 'Oluştur' : 'Güncelle'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && bankToDelete && (
          <div className="modal-overlay" onClick={closeDeleteConfirm}>
            <div className="modal modal-small" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">🗑️ Bankayı Sil</h2>
                <button className="modal-close" onClick={closeDeleteConfirm}>✕</button>
              </div>

              <div className="modal-body">
                <p>
                  <strong>{bankToDelete.name}</strong> bankasını silmek istediğinizden emin misiniz?
                </p>
                <p className="warning-text">
                  ⚠️ Bu işlem geri alınamaz!
                </p>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeDeleteConfirm}
                  disabled={deleting}
                >
                  İptal
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? 'Siliniyor...' : 'Sil'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default BanksManagement;
