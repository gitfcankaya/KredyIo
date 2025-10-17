/**
 * Loans Management Page
 * CRUD operations for loan products
 */

import React, { useState, useEffect } from 'react';
import { DataTable } from '../../components/Admin/DataTable';
import { loanProductsService, banksService } from '../../services/api';
import './BanksManagement.css';

interface Bank {
  id: number;
  name: string;
}

interface LoanProduct {
  id: number;
  bankId: number;
  bank?: Bank;
  productName: string;
  name?: string;
  loanType: string;
  minAmount: number;
  maxAmount: number;
  minTerm: number;
  maxTerm: number;
  minInterestRate: number;
  maxInterestRate: number;
  purpose?: string;
  requiresCollateral: boolean;
  requiresGuarantor: boolean;
  minAge?: number;
  maxAge?: number;
  description?: string;
  features?: string;
  isActive: boolean;
  isPromoted: boolean;
  isFeatured: boolean;
}

interface FormData {
  bankId: number;
  productName: string;
  loanType: string;
  minAmount: number;
  maxAmount: number;
  minTerm: number;
  maxTerm: number;
  minInterestRate: number;
  maxInterestRate: number;
  purpose: string;
  requiresCollateral: boolean;
  requiresGuarantor: boolean;
  minAge: number;
  maxAge: number;
  description: string;
  features: string;
  isActive: boolean;
  isPromoted: boolean;
  isFeatured: boolean;
}

const LoansManagement: React.FC = () => {
  const [loans, setLoans] = useState<LoanProduct[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedLoan, setSelectedLoan] = useState<LoanProduct | null>(null);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loanToDelete, setLoanToDelete] = useState<LoanProduct | null>(null);

  const [formData, setFormData] = useState<FormData>({
    bankId: 0,
    productName: '',
    loanType: 'PersonalLoan',
    minAmount: 0,
    maxAmount: 0,
    minTerm: 0,
    maxTerm: 0,
    minInterestRate: 0,
    maxInterestRate: 0,
    purpose: '',
    requiresCollateral: false,
    requiresGuarantor: false,
    minAge: 18,
    maxAge: 65,
    description: '',
    features: '',
    isActive: true,
    isPromoted: false,
    isFeatured: false,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [loansData, banksData] = await Promise.all([
        loanProductsService.getProducts(),
        banksService.getBanks(),
      ]);
      setLoans(loansData);
      setBanks(banksData);
    } catch (err: any) {
      setError(err.message || 'Veriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setModalMode('create');
    setSelectedLoan(null);
    setFormData({
      bankId: 0,
      productName: '',
      loanType: 'PersonalLoan',
      minAmount: 0,
      maxAmount: 0,
      minTerm: 0,
      maxTerm: 0,
      minInterestRate: 0,
      maxInterestRate: 0,
      purpose: '',
      requiresCollateral: false,
      requiresGuarantor: false,
      minAge: 18,
      maxAge: 65,
      description: '',
      features: '',
      isActive: true,
      isPromoted: false,
      isFeatured: false,
    });
    setShowModal(true);
  };

  const handleEdit = (loan: LoanProduct) => {
    setModalMode('edit');
    setSelectedLoan(loan);
    setFormData({
      bankId: loan.bankId,
      productName: loan.productName,
      loanType: loan.loanType,
      minAmount: loan.minAmount,
      maxAmount: loan.maxAmount,
      minTerm: loan.minTerm,
      maxTerm: loan.maxTerm,
      minInterestRate: loan.minInterestRate,
      maxInterestRate: loan.maxInterestRate,
      purpose: loan.purpose || '',
      requiresCollateral: loan.requiresCollateral,
      requiresGuarantor: loan.requiresGuarantor,
      minAge: loan.minAge || 18,
      maxAge: loan.maxAge || 65,
      description: loan.description || '',
      features: loan.features || '',
      isActive: loan.isActive,
      isPromoted: loan.isPromoted,
      isFeatured: loan.isFeatured,
    });
    setShowModal(true);
  };

  const handleDelete = (loan: LoanProduct) => {
    setLoanToDelete(loan);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!loanToDelete) return;

    try {
      setSaving(true);
      await loanProductsService.deleteProduct(loanToDelete.id);
      await loadData();
      setShowDeleteConfirm(false);
      setLoanToDelete(null);
    } catch (err: any) {
      setError(err.message || 'Silme işlemi sırasında bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.bankId || !formData.productName) {
      setError('Lütfen tüm zorunlu alanları doldurun');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      if (modalMode === 'create') {
        await loanProductsService.createProduct(formData);
      } else if (selectedLoan) {
        await loanProductsService.updateProduct(selectedLoan.id, formData);
      }

      await loadData();
      setShowModal(false);
    } catch (err: any) {
      setError(err.message || 'Kaydetme işlemi sırasında bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      key: 'productName',
      label: 'Ürün Adı',
      sortable: true,
      render: (item: LoanProduct) => (
        <div>
          <div className="font-semibold">{item.productName}</div>
          <div className="text-sm text-gray-500">{item.bank?.name || 'Banka bulunamadı'}</div>
        </div>
      ),
    },
    {
      key: 'loanType',
      label: 'Kredi Türü',
      sortable: true,
      render: (item: LoanProduct) => {
        const types: { [key: string]: string } = {
          PersonalLoan: 'İhtiyaç Kredisi',
          MortgageLoan: 'Konut Kredisi',
          VehicleLoan: 'Taşıt Kredisi',
          CommercialLoan: 'Ticari Kredi',
        };
        return <span className="badge badge-info">{types[item.loanType] || item.loanType}</span>;
      },
    },
    {
      key: 'amount',
      label: 'Tutar Aralığı',
      render: (item: LoanProduct) => (
        <div className="text-sm">
          {item.minAmount.toLocaleString('tr-TR')} - {item.maxAmount.toLocaleString('tr-TR')} ₺
        </div>
      ),
    },
    {
      key: 'interestRate',
      label: 'Faiz Oranı',
      render: (item: LoanProduct) => (
        <div className="text-sm">
          %{item.minInterestRate} - %{item.maxInterestRate}
        </div>
      ),
    },
    {
      key: 'term',
      label: 'Vade',
      render: (item: LoanProduct) => (
        <div className="text-sm">
          {item.minTerm} - {item.maxTerm} ay
        </div>
      ),
    },
    {
      key: 'isActive',
      label: 'Durum',
      sortable: true,
      render: (item: LoanProduct) => (
        <span className={`badge ${item.isActive ? 'badge-success' : 'badge-secondary'}`}>
          {item.isActive ? 'Aktif' : 'Pasif'}
        </span>
      ),
    },
  ];

  return (
    <div className="banks-management">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Kredi Ürünleri</h1>
          <p className="page-subtitle">Kredi ürünlerini yönetin</p>
        </div>
        <button onClick={handleCreate} className="btn btn-primary">
          ➕ Yeni Kredi Ekle
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-error">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {/* Data Table */}
      <DataTable
        data={loans}
        columns={columns}
        loading={loading}
        searchable={true}
        searchPlaceholder="Kredi ara..."
        searchKeys={['productName', 'loanType', 'purpose']}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="Henüz kredi ürünü eklenmemiş"
      />

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal modal-lg">
            <div className="modal-header">
              <h2>{modalMode === 'create' ? 'Yeni Kredi Ekle' : 'Kredi Düzenle'}</h2>
              <button onClick={() => setShowModal(false)} className="modal-close">✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid">
                  {/* Banka */}
                  <div className="form-group">
                    <label className="form-label">
                      Banka <span className="required">*</span>
                    </label>
                    <select
                      className="form-input"
                      value={formData.bankId}
                      onChange={(e) => setFormData({ ...formData, bankId: parseInt(e.target.value) })}
                      required
                    >
                      <option value={0}>Banka seçin</option>
                      {banks.map((bank) => (
                        <option key={bank.id} value={bank.id}>
                          {bank.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Ürün Adı */}
                  <div className="form-group">
                    <label className="form-label">
                      Ürün Adı <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.productName}
                      onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                      placeholder="Örn: İhtiyaç Kredisi"
                      required
                    />
                  </div>

                  {/* Kredi Türü */}
                  <div className="form-group">
                    <label className="form-label">
                      Kredi Türü <span className="required">*</span>
                    </label>
                    <select
                      className="form-input"
                      value={formData.loanType}
                      onChange={(e) => setFormData({ ...formData, loanType: e.target.value })}
                      required
                    >
                      <option value="PersonalLoan">İhtiyaç Kredisi</option>
                      <option value="MortgageLoan">Konut Kredisi</option>
                      <option value="VehicleLoan">Taşıt Kredisi</option>
                      <option value="CommercialLoan">Ticari Kredi</option>
                    </select>
                  </div>

                  {/* Amaç */}
                  <div className="form-group">
                    <label className="form-label">Amaç</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.purpose}
                      onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                      placeholder="Örn: Ev alımı, araç alımı"
                    />
                  </div>

                  {/* Min Tutar */}
                  <div className="form-group">
                    <label className="form-label">Minimum Tutar (₺)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.minAmount}
                      onChange={(e) => setFormData({ ...formData, minAmount: parseFloat(e.target.value) })}
                      min="0"
                      step="1000"
                    />
                  </div>

                  {/* Max Tutar */}
                  <div className="form-group">
                    <label className="form-label">Maximum Tutar (₺)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.maxAmount}
                      onChange={(e) => setFormData({ ...formData, maxAmount: parseFloat(e.target.value) })}
                      min="0"
                      step="1000"
                    />
                  </div>

                  {/* Min Vade */}
                  <div className="form-group">
                    <label className="form-label">Minimum Vade (Ay)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.minTerm}
                      onChange={(e) => setFormData({ ...formData, minTerm: parseInt(e.target.value) })}
                      min="0"
                    />
                  </div>

                  {/* Max Vade */}
                  <div className="form-group">
                    <label className="form-label">Maximum Vade (Ay)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.maxTerm}
                      onChange={(e) => setFormData({ ...formData, maxTerm: parseInt(e.target.value) })}
                      min="0"
                    />
                  </div>

                  {/* Min Faiz */}
                  <div className="form-group">
                    <label className="form-label">Minimum Faiz Oranı (%)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.minInterestRate}
                      onChange={(e) => setFormData({ ...formData, minInterestRate: parseFloat(e.target.value) })}
                      min="0"
                      step="0.01"
                    />
                  </div>

                  {/* Max Faiz */}
                  <div className="form-group">
                    <label className="form-label">Maximum Faiz Oranı (%)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.maxInterestRate}
                      onChange={(e) => setFormData({ ...formData, maxInterestRate: parseFloat(e.target.value) })}
                      min="0"
                      step="0.01"
                    />
                  </div>

                  {/* Min Yaş */}
                  <div className="form-group">
                    <label className="form-label">Minimum Yaş</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.minAge}
                      onChange={(e) => setFormData({ ...formData, minAge: parseInt(e.target.value) })}
                      min="18"
                      max="100"
                    />
                  </div>

                  {/* Max Yaş */}
                  <div className="form-group">
                    <label className="form-label">Maximum Yaş</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.maxAge}
                      onChange={(e) => setFormData({ ...formData, maxAge: parseInt(e.target.value) })}
                      min="18"
                      max="100"
                    />
                  </div>

                  {/* Açıklama */}
                  <div className="form-group form-group-full">
                    <label className="form-label">Açıklama</label>
                    <textarea
                      className="form-input"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      placeholder="Kredi hakkında detaylı bilgi"
                    />
                  </div>

                  {/* Özellikler */}
                  <div className="form-group form-group-full">
                    <label className="form-label">Özellikler (virgülle ayırın)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.features}
                      onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                      placeholder="Örn: Düşük faiz, Hızlı onay, Online başvuru"
                    />
                  </div>

                  {/* Checkboxes */}
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.requiresCollateral}
                        onChange={(e) => setFormData({ ...formData, requiresCollateral: e.target.checked })}
                      />
                      <span>Teminat Gerekli</span>
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.requiresGuarantor}
                        onChange={(e) => setFormData({ ...formData, requiresGuarantor: e.target.checked })}
                      />
                      <span>Kefil Gerekli</span>
                    </label>
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

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.isPromoted}
                        onChange={(e) => setFormData({ ...formData, isPromoted: e.target.checked })}
                      />
                      <span>Öne Çıkan</span>
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      />
                      <span>Vitrin</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  İptal
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Kaydediliyor...' : modalMode === 'create' ? 'Ekle' : 'Güncelle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && loanToDelete && (
        <div className="modal-overlay">
          <div className="modal modal-sm">
            <div className="modal-header">
              <h2>Krediyi Sil</h2>
              <button onClick={() => setShowDeleteConfirm(false)} className="modal-close">✕</button>
            </div>
            <div className="modal-body">
              <p>
                <strong>{loanToDelete.productName}</strong> kredisini silmek istediğinize emin misiniz?
              </p>
              <p className="text-sm text-gray-500">Bu işlem geri alınamaz.</p>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowDeleteConfirm(false)} className="btn btn-secondary">
                İptal
              </button>
              <button onClick={confirmDelete} className="btn btn-danger" disabled={saving}>
                {saving ? 'Siliniyor...' : 'Sil'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoansManagement;
