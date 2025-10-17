/**
 * Deposits Management Page
 * CRUD operations for deposit products
 */

import React, { useState, useEffect } from 'react';
import { DataTable } from '../../components/Admin/DataTable';
import { depositProductsService, banksService } from '../../services/api';
import './BanksManagement.css';

interface Bank {
  id: number;
  name: string;
}

interface DepositProduct {
  id: number;
  bankId: number;
  bank?: Bank;
  productName: string;
  depositType: string;
  interestRate: number;
  minAmount: number;
  maxAmount?: number;
  minTerm: number;
  maxTerm: number;
  currency: string;
  description?: string;
  features?: string;
  isActive: boolean;
}

interface FormData {
  bankId: number;
  productName: string;
  depositType: string;
  interestRate: number;
  minAmount: number;
  maxAmount: number;
  minTerm: number;
  maxTerm: number;
  currency: string;
  description: string;
  features: string;
  isActive: boolean;
}

const DepositsManagement: React.FC = () => {
  const [deposits, setDeposits] = useState<DepositProduct[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedDeposit, setSelectedDeposit] = useState<DepositProduct | null>(null);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [depositToDelete, setDepositToDelete] = useState<DepositProduct | null>(null);

  const [formData, setFormData] = useState<FormData>({
    bankId: 0,
    productName: '',
    depositType: 'TimeDeposit',
    interestRate: 0,
    minAmount: 0,
    maxAmount: 0,
    minTerm: 0,
    maxTerm: 0,
    currency: 'TRY',
    description: '',
    features: '',
    isActive: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [depositsData, banksData] = await Promise.all([
        depositProductsService.getProducts(),
        banksService.getBanks(),
      ]);
      setDeposits(depositsData);
      setBanks(banksData);
    } catch (err: any) {
      setError(err.message || 'Veriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setModalMode('create');
    setSelectedDeposit(null);
    setFormData({
      bankId: 0,
      productName: '',
      depositType: 'TimeDeposit',
      interestRate: 0,
      minAmount: 0,
      maxAmount: 0,
      minTerm: 0,
      maxTerm: 0,
      currency: 'TRY',
      description: '',
      features: '',
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEdit = (deposit: DepositProduct) => {
    setModalMode('edit');
    setSelectedDeposit(deposit);
    setFormData({
      bankId: deposit.bankId,
      productName: deposit.productName,
      depositType: deposit.depositType,
      interestRate: deposit.interestRate,
      minAmount: deposit.minAmount,
      maxAmount: deposit.maxAmount || 0,
      minTerm: deposit.minTerm,
      maxTerm: deposit.maxTerm,
      currency: deposit.currency,
      description: deposit.description || '',
      features: deposit.features || '',
      isActive: deposit.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = (deposit: DepositProduct) => {
    setDepositToDelete(deposit);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!depositToDelete) return;

    try {
      setSaving(true);
      await depositProductsService.deleteProduct(depositToDelete.id);
      await loadData();
      setShowDeleteConfirm(false);
      setDepositToDelete(null);
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
        await depositProductsService.createProduct(formData);
      } else if (selectedDeposit) {
        await depositProductsService.updateProduct(selectedDeposit.id, formData);
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
      render: (item: DepositProduct) => (
        <div>
          <div className="font-semibold">{item.productName}</div>
          <div className="text-sm text-gray-500">{item.bank?.name || 'Banka bulunamadı'}</div>
        </div>
      ),
    },
    {
      key: 'depositType',
      label: 'Mevduat Türü',
      sortable: true,
      render: (item: DepositProduct) => {
        const types: { [key: string]: string } = {
          TimeDeposit: 'Vadeli Mevduat',
          DemandDeposit: 'Vadesiz Mevduat',
          GoldDeposit: 'Altın Hesabı',
          ForeignCurrency: 'Döviz Hesabı',
        };
        return <span className="badge badge-info">{types[item.depositType] || item.depositType}</span>;
      },
    },
    {
      key: 'interestRate',
      label: 'Faiz Oranı',
      sortable: true,
      render: (item: DepositProduct) => <div className="font-semibold">%{item.interestRate}</div>,
    },
    {
      key: 'amount',
      label: 'Tutar Aralığı',
      render: (item: DepositProduct) => (
        <div className="text-sm">
          {item.minAmount.toLocaleString('tr-TR')} {item.currency}
          {item.maxAmount && item.maxAmount > 0 && ` - ${item.maxAmount.toLocaleString('tr-TR')} ${item.currency}`}
        </div>
      ),
    },
    {
      key: 'term',
      label: 'Vade',
      render: (item: DepositProduct) => (
        <div className="text-sm">
          {item.minTerm} - {item.maxTerm} gün
        </div>
      ),
    },
    {
      key: 'isActive',
      label: 'Durum',
      sortable: true,
      render: (item: DepositProduct) => (
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
          <h1 className="page-title">Mevduat Ürünleri</h1>
          <p className="page-subtitle">Mevduat ürünlerini yönetin</p>
        </div>
        <button onClick={handleCreate} className="btn btn-primary">
          ➕ Yeni Mevduat Ekle
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
        data={deposits}
        columns={columns}
        loading={loading}
        searchable={true}
        searchPlaceholder="Mevduat ara..."
        searchKeys={['productName', 'depositType']}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="Henüz mevduat ürünü eklenmemiş"
      />

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal modal-lg">
            <div className="modal-header">
              <h2>{modalMode === 'create' ? 'Yeni Mevduat Ekle' : 'Mevduat Düzenle'}</h2>
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
                      placeholder="Örn: Vadeli Mevduat Hesabı"
                      required
                    />
                  </div>

                  {/* Mevduat Türü */}
                  <div className="form-group">
                    <label className="form-label">
                      Mevduat Türü <span className="required">*</span>
                    </label>
                    <select
                      className="form-input"
                      value={formData.depositType}
                      onChange={(e) => setFormData({ ...formData, depositType: e.target.value })}
                      required
                    >
                      <option value="TimeDeposit">Vadeli Mevduat</option>
                      <option value="DemandDeposit">Vadesiz Mevduat</option>
                      <option value="GoldDeposit">Altın Hesabı</option>
                      <option value="ForeignCurrency">Döviz Hesabı</option>
                    </select>
                  </div>

                  {/* Para Birimi */}
                  <div className="form-group">
                    <label className="form-label">Para Birimi</label>
                    <select
                      className="form-input"
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    >
                      <option value="TRY">TRY - Türk Lirası</option>
                      <option value="USD">USD - Amerikan Doları</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - İngiliz Sterlini</option>
                      <option value="GOLD">GOLD - Altın</option>
                    </select>
                  </div>

                  {/* Faiz Oranı */}
                  <div className="form-group">
                    <label className="form-label">Faiz Oranı (%)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.interestRate}
                      onChange={(e) => setFormData({ ...formData, interestRate: parseFloat(e.target.value) })}
                      min="0"
                      step="0.01"
                    />
                  </div>

                  {/* Min Tutar */}
                  <div className="form-group">
                    <label className="form-label">Minimum Tutar</label>
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
                    <label className="form-label">Maximum Tutar</label>
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
                    <label className="form-label">Minimum Vade (Gün)</label>
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
                    <label className="form-label">Maximum Vade (Gün)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.maxTerm}
                      onChange={(e) => setFormData({ ...formData, maxTerm: parseInt(e.target.value) })}
                      min="0"
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
                      placeholder="Mevduat hakkında detaylı bilgi"
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
                      placeholder="Örn: Yüksek faiz, Esnek vade, Kırılabilir"
                    />
                  </div>

                  {/* Aktif */}
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
      {showDeleteConfirm && depositToDelete && (
        <div className="modal-overlay">
          <div className="modal modal-sm">
            <div className="modal-header">
              <h2>Mevduatı Sil</h2>
              <button onClick={() => setShowDeleteConfirm(false)} className="modal-close">✕</button>
            </div>
            <div className="modal-body">
              <p>
                <strong>{depositToDelete.productName}</strong> mevduatını silmek istediğinize emin misiniz?
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

export default DepositsManagement;
