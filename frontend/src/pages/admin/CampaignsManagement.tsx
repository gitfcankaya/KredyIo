/**
 * Campaigns Management Component
 * CRUD operations for campaigns
 */

import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/Admin/AdminLayout';
import { DataTable, Column } from '../../components/Admin/DataTable';
import { campaignsService, banksService } from '../../services/api';
import '../admin/BanksManagement.css';

interface Campaign {
  id: number;
  title: string;
  description: string;
  bankId: number;
  bank?: { name: string };
  campaignType: string;
  startDate: string;
  endDate: string;
  isFeatured: boolean;
  isActive: boolean;
  imageUrl?: string;
  detailsUrl?: string;
}

interface Bank {
  id: number;
  name: string;
}

interface FormData {
  title: string;
  description: string;
  bankId: number;
  campaignType: string;
  startDate: string;
  endDate: string;
  isFeatured: boolean;
  isActive: boolean;
  imageUrl: string;
  detailsUrl: string;
}

const CampaignsManagement: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    bankId: 0,
    campaignType: 'Kredi',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isFeatured: false,
    isActive: true,
    imageUrl: '',
    detailsUrl: '',
  });
  const [saving, setSaving] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [campaignsData, banksData] = await Promise.all([
        campaignsService.getCampaigns(),
        banksService.getBanks(),
      ]);
      setCampaigns(campaignsData);
      setBanks(banksData);
    } catch (err) {
      setError('Veriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const columns: Column<Campaign>[] = [
    {
      key: 'title',
      label: 'Kampanya Başlığı',
      render: (item) => (
        <div className="bank-cell">
          {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="bank-logo" />}
          <div>
            <div className="bank-name">{item.title}</div>
            <div className="bank-desc">{item.description?.substring(0, 50)}...</div>
          </div>
        </div>
      ),
    },
    {
      key: 'bank',
      label: 'Banka',
      render: (item) => item.bank?.name || '-',
    },
    {
      key: 'campaignType',
      label: 'Tür',
      render: (item) => <span className="status-badge active">{item.campaignType}</span>,
    },
    {
      key: 'startDate',
      label: 'Başlangıç',
      render: (item) => new Date(item.startDate).toLocaleDateString('tr-TR'),
    },
    {
      key: 'endDate',
      label: 'Bitiş',
      render: (item) => new Date(item.endDate).toLocaleDateString('tr-TR'),
    },
    {
      key: 'isFeatured',
      label: 'Öne Çıkan',
      render: (item) => (item.isFeatured ? '⭐' : '-'),
    },
    {
      key: 'isActive',
      label: 'Durum',
      render: (item) => (
        <span className={`status-badge ${item.isActive ? 'active' : 'inactive'}`}>
          {item.isActive ? '✓ Aktif' : '✕ Pasif'}
        </span>
      ),
    },
  ];

  const openCreateModal = () => {
    setModalMode('create');
    setShowModal(true);
  };

  const openEditModal = (campaign: Campaign) => {
    setModalMode('edit');
    setSelectedCampaign(campaign);
    setFormData({
      title: campaign.title,
      description: campaign.description,
      bankId: campaign.bankId,
      campaignType: campaign.campaignType,
      startDate: campaign.startDate.split('T')[0],
      endDate: campaign.endDate.split('T')[0],
      isFeatured: campaign.isFeatured,
      isActive: campaign.isActive,
      imageUrl: campaign.imageUrl || '',
      detailsUrl: campaign.detailsUrl || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (modalMode === 'create') {
        await campaignsService.createCampaign(formData);
      } else if (selectedCampaign) {
        await campaignsService.updateCampaign(selectedCampaign.id, formData);
      }
      await loadData();
      setShowModal(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!campaignToDelete) return;
    try {
      await campaignsService.deleteCampaign(campaignToDelete.id);
      await loadData();
      setShowDeleteConfirm(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <AdminLayout>
      <div className="banks-management">
        <div className="page-header">
          <div>
            <h1 className="page-title">Kampanya Yönetimi</h1>
            <p className="page-subtitle">Toplam {campaigns.length} kampanya</p>
          </div>
          <button className="btn btn-primary" onClick={openCreateModal}>
            ➕ Yeni Kampanya Ekle
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        <DataTable
          data={campaigns}
          columns={columns}
          loading={loading}
          searchKeys={['title', 'description', 'campaignType']}
          searchPlaceholder="Kampanya ara..."
          onEdit={openEditModal}
          onDelete={(item) => {
            setCampaignToDelete(item);
            setShowDeleteConfirm(true);
          }}
          emptyMessage="📭 Henüz kampanya eklenmemiş"
        />

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">
                  {modalMode === 'create' ? '➕ Yeni Kampanya' : '✏️ Kampanyayı Düzenle'}
                </h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Başlık <span className="required">*</span></label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Açıklama</label>
                    <textarea
                      className="form-textarea"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Banka <span className="required">*</span></label>
                      <select
                        className="form-input"
                        value={formData.bankId}
                        onChange={(e) => setFormData({ ...formData, bankId: Number(e.target.value) })}
                        required
                      >
                        <option value={0}>Seçiniz</option>
                        {banks.map(bank => (
                          <option key={bank.id} value={bank.id}>{bank.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Tür</label>
                      <select
                        className="form-input"
                        value={formData.campaignType}
                        onChange={(e) => setFormData({ ...formData, campaignType: e.target.value })}
                      >
                        <option value="Kredi">Kredi</option>
                        <option value="Kredi Kartı">Kredi Kartı</option>
                        <option value="Mevduat">Mevduat</option>
                        <option value="Yatırım">Yatırım</option>
                        <option value="Genel">Genel</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Başlangıç Tarihi</label>
                      <input
                        type="date"
                        className="form-input"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Bitiş Tarihi</label>
                      <input
                        type="date"
                        className="form-input"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Görsel URL</label>
                    <input
                      type="url"
                      className="form-input"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Detay URL</label>
                    <input
                      type="url"
                      className="form-input"
                      value={formData.detailsUrl}
                      onChange={(e) => setFormData({ ...formData, detailsUrl: e.target.value })}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.isFeatured}
                          onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        />
                        <span>Öne Çıkan</span>
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
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    İptal
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Kaydediliyor...' : modalMode === 'create' ? 'Oluştur' : 'Güncelle'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {showDeleteConfirm && campaignToDelete && (
          <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
            <div className="modal modal-small" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">🗑️ Kampanyayı Sil</h2>
                <button className="modal-close" onClick={() => setShowDeleteConfirm(false)}>✕</button>
              </div>
              <div className="modal-body">
                <p><strong>{campaignToDelete.title}</strong> kampanyasını silmek istediğinizden emin misiniz?</p>
                <p className="warning-text">⚠️ Bu işlem geri alınamaz!</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>İptal</button>
                <button className="btn btn-danger" onClick={handleDelete}>Sil</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default CampaignsManagement;
