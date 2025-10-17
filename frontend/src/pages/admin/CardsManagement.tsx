/**
 * Credit Cards Management Page
 * CRUD operations for credit card products
 */

import React, { useState, useEffect } from 'react';
import { DataTable } from '../../components/Admin/DataTable';
import { creditCardProductsService, banksService } from '../../services/api';
import './BanksManagement.css';

interface Bank {
  id: number;
  name: string;
}

interface CreditCardProduct {
  id: number;
  bankId: number;
  bank?: Bank;
  cardName: string;
  cardImageUrl?: string;
  category: string;
  annualFee: number;
  isFirstYearFree: boolean;
  hasWelcomeBonus: boolean;
  welcomeBonusAmount?: number;
  hasAirlineMiles: boolean;
  hasPoints: boolean;
  hasCashback: boolean;
  hasShoppingDiscount: boolean;
  hasFuelDiscount: boolean;
  milesProgram?: string;
  pointsPerTL?: number;
  milesPerTL?: number;
  cashbackRate?: number;
  features?: string;
  advantages?: string;
  isActive: boolean;
  isPromoted: boolean;
}

interface FormData {
  bankId: number;
  cardName: string;
  cardImageUrl: string;
  category: string;
  annualFee: number;
  isFirstYearFree: boolean;
  hasWelcomeBonus: boolean;
  welcomeBonusAmount: number;
  hasAirlineMiles: boolean;
  hasPoints: boolean;
  hasCashback: boolean;
  hasShoppingDiscount: boolean;
  hasFuelDiscount: boolean;
  milesProgram: string;
  pointsPerTL: number;
  milesPerTL: number;
  cashbackRate: number;
  features: string;
  advantages: string;
  isActive: boolean;
  isPromoted: boolean;
}

const CardsManagement: React.FC = () => {
  const [cards, setCards] = useState<CreditCardProduct[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedCard, setSelectedCard] = useState<CreditCardProduct | null>(null);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<CreditCardProduct | null>(null);

  const [formData, setFormData] = useState<FormData>({
    bankId: 0,
    cardName: '',
    cardImageUrl: '',
    category: 'Standard',
    annualFee: 0,
    isFirstYearFree: false,
    hasWelcomeBonus: false,
    welcomeBonusAmount: 0,
    hasAirlineMiles: false,
    hasPoints: false,
    hasCashback: false,
    hasShoppingDiscount: false,
    hasFuelDiscount: false,
    milesProgram: '',
    pointsPerTL: 0,
    milesPerTL: 0,
    cashbackRate: 0,
    features: '',
    advantages: '',
    isActive: true,
    isPromoted: false,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [cardsData, banksData] = await Promise.all([
        creditCardProductsService.getProducts(),
        banksService.getBanks(),
      ]);
      setCards(cardsData);
      setBanks(banksData);
    } catch (err: any) {
      setError(err.message || 'Veriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setModalMode('create');
    setSelectedCard(null);
    setFormData({
      bankId: 0,
      cardName: '',
      cardImageUrl: '',
      category: 'Standard',
      annualFee: 0,
      isFirstYearFree: false,
      hasWelcomeBonus: false,
      welcomeBonusAmount: 0,
      hasAirlineMiles: false,
      hasPoints: false,
      hasCashback: false,
      hasShoppingDiscount: false,
      hasFuelDiscount: false,
      milesProgram: '',
      pointsPerTL: 0,
      milesPerTL: 0,
      cashbackRate: 0,
      features: '',
      advantages: '',
      isActive: true,
      isPromoted: false,
    });
    setShowModal(true);
  };

  const handleEdit = (card: CreditCardProduct) => {
    setModalMode('edit');
    setSelectedCard(card);
    setFormData({
      bankId: card.bankId,
      cardName: card.cardName,
      cardImageUrl: card.cardImageUrl || '',
      category: card.category,
      annualFee: card.annualFee,
      isFirstYearFree: card.isFirstYearFree,
      hasWelcomeBonus: card.hasWelcomeBonus,
      welcomeBonusAmount: card.welcomeBonusAmount || 0,
      hasAirlineMiles: card.hasAirlineMiles,
      hasPoints: card.hasPoints,
      hasCashback: card.hasCashback,
      hasShoppingDiscount: card.hasShoppingDiscount,
      hasFuelDiscount: card.hasFuelDiscount,
      milesProgram: card.milesProgram || '',
      pointsPerTL: card.pointsPerTL || 0,
      milesPerTL: card.milesPerTL || 0,
      cashbackRate: card.cashbackRate || 0,
      features: card.features || '',
      advantages: card.advantages || '',
      isActive: card.isActive,
      isPromoted: card.isPromoted,
    });
    setShowModal(true);
  };

  const handleDelete = (card: CreditCardProduct) => {
    setCardToDelete(card);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!cardToDelete) return;

    try {
      setSaving(true);
      await creditCardProductsService.deleteProduct(cardToDelete.id);
      await loadData();
      setShowDeleteConfirm(false);
      setCardToDelete(null);
    } catch (err: any) {
      setError(err.message || 'Silme işlemi sırasında bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.bankId || !formData.cardName) {
      setError('Lütfen tüm zorunlu alanları doldurun');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      if (modalMode === 'create') {
        await creditCardProductsService.createProduct(formData);
      } else if (selectedCard) {
        await creditCardProductsService.updateProduct(selectedCard.id, formData);
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
      key: 'cardName',
      label: 'Kart Adı',
      sortable: true,
      render: (item: CreditCardProduct) => (
        <div className="flex items-center gap-3">
          {item.cardImageUrl && (
            <img src={item.cardImageUrl} alt={item.cardName} className="bank-logo" />
          )}
          <div>
            <div className="font-semibold">{item.cardName}</div>
            <div className="text-sm text-gray-500">{item.bank?.name || 'Banka bulunamadı'}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Kategori',
      sortable: true,
      render: (item: CreditCardProduct) => {
        const categories: { [key: string]: string } = {
          Standard: 'Standart',
          NoFee: 'Ücretsiz',
          Student: 'Öğrenci',
          Miles: 'Mil',
          Points: 'Puan',
          Commercial: 'Ticari',
        };
        return <span className="badge badge-info">{categories[item.category] || item.category}</span>;
      },
    },
    {
      key: 'annualFee',
      label: 'Yıllık Ücret',
      render: (item: CreditCardProduct) => (
        <div className="text-sm">
          {item.isFirstYearFree && <div className="text-green-600 text-xs">İlk yıl ücretsiz</div>}
          {item.annualFee === 0 ? '₺0' : `₺${item.annualFee.toLocaleString('tr-TR')}`}
        </div>
      ),
    },
    {
      key: 'advantages',
      label: 'Avantajlar',
      render: (item: CreditCardProduct) => (
        <div className="flex gap-1 flex-wrap">
          {item.hasAirlineMiles && <span className="badge badge-sm">✈️ Mil</span>}
          {item.hasPoints && <span className="badge badge-sm">⭐ Puan</span>}
          {item.hasCashback && <span className="badge badge-sm">💰 Cashback</span>}
          {item.hasShoppingDiscount && <span className="badge badge-sm">🛍️ Alışveriş</span>}
          {item.hasFuelDiscount && <span className="badge badge-sm">⛽ Yakıt</span>}
        </div>
      ),
    },
    {
      key: 'isActive',
      label: 'Durum',
      sortable: true,
      render: (item: CreditCardProduct) => (
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
          <h1 className="page-title">Kredi Kartları</h1>
          <p className="page-subtitle">Kredi kartlarını yönetin</p>
        </div>
        <button onClick={handleCreate} className="btn btn-primary">
          ➕ Yeni Kart Ekle
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
        data={cards}
        columns={columns}
        loading={loading}
        searchable={true}
        searchPlaceholder="Kart ara..."
        searchKeys={['cardName', 'category']}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="Henüz kredi kartı eklenmemiş"
      />

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal modal-lg">
            <div className="modal-header">
              <h2>{modalMode === 'create' ? 'Yeni Kart Ekle' : 'Kart Düzenle'}</h2>
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

                  {/* Kart Adı */}
                  <div className="form-group">
                    <label className="form-label">
                      Kart Adı <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.cardName}
                      onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                      placeholder="Örn: World Kredi Kartı"
                      required
                    />
                  </div>

                  {/* Kategori */}
                  <div className="form-group">
                    <label className="form-label">Kategori</label>
                    <select
                      className="form-input"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Standard">Standart</option>
                      <option value="NoFee">Ücretsiz</option>
                      <option value="Student">Öğrenci</option>
                      <option value="Miles">Mil</option>
                      <option value="Points">Puan</option>
                      <option value="Commercial">Ticari</option>
                    </select>
                  </div>

                  {/* Kart Görseli URL */}
                  <div className="form-group">
                    <label className="form-label">Kart Görseli URL</label>
                    <input
                      type="url"
                      className="form-input"
                      value={formData.cardImageUrl}
                      onChange={(e) => setFormData({ ...formData, cardImageUrl: e.target.value })}
                      placeholder="https://example.com/card.png"
                    />
                  </div>

                  {/* Yıllık Ücret */}
                  <div className="form-group">
                    <label className="form-label">Yıllık Ücret (₺)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.annualFee}
                      onChange={(e) => setFormData({ ...formData, annualFee: parseFloat(e.target.value) })}
                      min="0"
                      step="0.01"
                    />
                  </div>

                  {/* Hoşgeldin Bonusu */}
                  <div className="form-group">
                    <label className="form-label">Hoşgeldin Bonusu (₺)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.welcomeBonusAmount}
                      onChange={(e) => setFormData({ ...formData, welcomeBonusAmount: parseFloat(e.target.value) })}
                      min="0"
                      step="0.01"
                      disabled={!formData.hasWelcomeBonus}
                    />
                  </div>

                  {/* Mil Programı */}
                  <div className="form-group">
                    <label className="form-label">Mil Programı</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.milesProgram}
                      onChange={(e) => setFormData({ ...formData, milesProgram: e.target.value })}
                      placeholder="Örn: Miles&Smiles"
                      disabled={!formData.hasAirlineMiles}
                    />
                  </div>

                  {/* TL Başına Puan */}
                  <div className="form-group">
                    <label className="form-label">TL Başına Puan</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.pointsPerTL}
                      onChange={(e) => setFormData({ ...formData, pointsPerTL: parseFloat(e.target.value) })}
                      min="0"
                      step="0.01"
                      disabled={!formData.hasPoints}
                    />
                  </div>

                  {/* TL Başına Mil */}
                  <div className="form-group">
                    <label className="form-label">TL Başına Mil</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.milesPerTL}
                      onChange={(e) => setFormData({ ...formData, milesPerTL: parseFloat(e.target.value) })}
                      min="0"
                      step="0.01"
                      disabled={!formData.hasAirlineMiles}
                    />
                  </div>

                  {/* Cashback Oranı */}
                  <div className="form-group">
                    <label className="form-label">Cashback Oranı (%)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.cashbackRate}
                      onChange={(e) => setFormData({ ...formData, cashbackRate: parseFloat(e.target.value) })}
                      min="0"
                      step="0.01"
                      disabled={!formData.hasCashback}
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
                      placeholder="Örn: Temassız ödeme, Sanal kart, Online alışveriş"
                    />
                  </div>

                  {/* Avantajlar */}
                  <div className="form-group form-group-full">
                    <label className="form-label">Avantajlar (virgülle ayırın)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.advantages}
                      onChange={(e) => setFormData({ ...formData, advantages: e.target.value })}
                      placeholder="Örn: Havalimanı lounge, Seyahat sigortası, Alışveriş indirimi"
                    />
                  </div>

                  {/* Checkboxes */}
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.isFirstYearFree}
                        onChange={(e) => setFormData({ ...formData, isFirstYearFree: e.target.checked })}
                      />
                      <span>İlk Yıl Ücretsiz</span>
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.hasWelcomeBonus}
                        onChange={(e) => setFormData({ ...formData, hasWelcomeBonus: e.target.checked })}
                      />
                      <span>Hoşgeldin Bonusu Var</span>
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.hasAirlineMiles}
                        onChange={(e) => setFormData({ ...formData, hasAirlineMiles: e.target.checked })}
                      />
                      <span>Havayolu Mili Var</span>
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.hasPoints}
                        onChange={(e) => setFormData({ ...formData, hasPoints: e.target.checked })}
                      />
                      <span>Puan Programı Var</span>
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.hasCashback}
                        onChange={(e) => setFormData({ ...formData, hasCashback: e.target.checked })}
                      />
                      <span>Cashback Var</span>
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.hasShoppingDiscount}
                        onChange={(e) => setFormData({ ...formData, hasShoppingDiscount: e.target.checked })}
                      />
                      <span>Alışveriş İndirimi Var</span>
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.hasFuelDiscount}
                        onChange={(e) => setFormData({ ...formData, hasFuelDiscount: e.target.checked })}
                      />
                      <span>Yakıt İndirimi Var</span>
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
      {showDeleteConfirm && cardToDelete && (
        <div className="modal-overlay">
          <div className="modal modal-sm">
            <div className="modal-header">
              <h2>Kartı Sil</h2>
              <button onClick={() => setShowDeleteConfirm(false)} className="modal-close">✕</button>
            </div>
            <div className="modal-body">
              <p>
                <strong>{cardToDelete.cardName}</strong> kartını silmek istediğinize emin misiniz?
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

export default CardsManagement;
