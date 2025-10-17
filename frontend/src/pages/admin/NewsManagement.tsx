import React, { useState, useEffect } from 'react';
import { DataTable } from '../../components/Admin/DataTable';
import type { Column } from '../../components/Admin/DataTable';
import { newsArticlesService } from '../../services/api';
import './BanksManagement.css';

interface NewsArticle {
  id: number;
  title: string;
  summary?: string;
  content?: string;
  sourceUrl: string;
  source: string;
  author?: string;
  imageUrl?: string;
  tags?: string;
  category?: string;
  publishedAt: string;
  scrapedAt: string;
  isActive: boolean;
  viewCount: number;
}

interface FormData {
  title: string;
  summary: string;
  content: string;
  sourceUrl: string;
  source: string;
  author: string;
  imageUrl: string;
  tags: string;
  category: string;
  publishedAt: string;
  isActive: boolean;
}

const NewsManagement: React.FC = () => {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<NewsArticle | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    summary: '',
    content: '',
    sourceUrl: '',
    source: '',
    author: '',
    imageUrl: '',
    tags: '',
    category: '',
    publishedAt: new Date().toISOString().split('T')[0],
    isActive: true
  });

  const sourceOptions = [
    'Bloomberg HT',
    'Ekonomist',
    'Para Analiz',
    'Dünya Gazetesi',
    'Hürriyet',
    'Sabah',
    'Diğer'
  ];

  const categoryOptions = [
    { value: '', label: 'Kategori Seçiniz' },
    { value: 'Ekonomi', label: 'Ekonomi' },
    { value: 'Bankacılık', label: 'Bankacılık' },
    { value: 'Kredi', label: 'Kredi' },
    { value: 'Mevduat', label: 'Mevduat' },
    { value: 'Kredi Kartı', label: 'Kredi Kartı' },
    { value: 'Finans', label: 'Finans' },
    { value: 'Piyasalar', label: 'Piyasalar' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await newsArticlesService.getNews();
      setNewsArticles(data);
      setError('');
    } catch (err) {
      setError('Haberler yüklenirken hata oluştu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setModalMode('create');
    setSelectedArticle(null);
    setFormData({
      title: '',
      summary: '',
      content: '',
      sourceUrl: '',
      source: '',
      author: '',
      imageUrl: '',
      tags: '',
      category: '',
      publishedAt: new Date().toISOString().split('T')[0],
      isActive: true
    });
    setShowModal(true);
  };

  const handleEdit = (article: NewsArticle) => {
    setModalMode('edit');
    setSelectedArticle(article);
    setFormData({
      title: article.title,
      summary: article.summary || '',
      content: article.content || '',
      sourceUrl: article.sourceUrl,
      source: article.source,
      author: article.author || '',
      imageUrl: article.imageUrl || '',
      tags: article.tags || '',
      category: article.category || '',
      publishedAt: article.publishedAt.split('T')[0],
      isActive: article.isActive
    });
    setShowModal(true);
  };

  const handleDelete = (article: NewsArticle) => {
    setArticleToDelete(article);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!articleToDelete) return;

    try {
      setSaving(true);
      await newsArticlesService.deleteNews(articleToDelete.id);
      await loadData();
      setShowDeleteConfirm(false);
      setArticleToDelete(null);
    } catch (err) {
      setError('Haber silinirken hata oluştu');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      if (modalMode === 'create') {
        await newsArticlesService.createNews(formData);
      } else if (selectedArticle) {
        await newsArticlesService.updateNews(selectedArticle.id, formData);
      }
      
      await loadData();
      setShowModal(false);
      setError('');
    } catch (err) {
      setError('Haber kaydedilirken hata oluştu');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const columns: Column<NewsArticle>[] = [
    {
      key: 'title',
      label: 'Başlık',
      sortable: true,
      render: (article) => (
        <div>
          <div className="fw-bold">{article.title}</div>
          {article.summary && (
            <small className="text-muted">{article.summary.substring(0, 100)}...</small>
          )}
        </div>
      )
    },
    {
      key: 'source',
      label: 'Kaynak',
      sortable: true,
      render: (article) => (
        <div>
          <div className="fw-bold">{article.source}</div>
          {article.author && <small className="text-muted">{article.author}</small>}
        </div>
      )
    },
    {
      key: 'category',
      label: 'Kategori',
      sortable: true,
      render: (article) => article.category ? (
        <span className="badge bg-info">{article.category}</span>
      ) : '-'
    },
    {
      key: 'publishedAt',
      label: 'Yayın Tarihi',
      sortable: true,
      render: (article) => new Date(article.publishedAt).toLocaleDateString('tr-TR')
    },
    {
      key: 'stats',
      label: 'İstatistikler',
      sortable: false,
      render: (article) => (
        <small>👁️ {article.viewCount} görüntüleme</small>
      )
    },
    {
      key: 'status',
      label: 'Durum',
      sortable: false,
      render: (article) => article.isActive ? (
        <span className="badge bg-success">✓ Aktif</span>
      ) : (
        <span className="badge bg-secondary">Pasif</span>
      )
    }
  ];

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Haber Yönetimi</h1>
        <button className="btn btn-primary" onClick={handleCreate}>
          + Yeni Haber
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <DataTable
        data={newsArticles}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchKeys={['title', 'source', 'category']}
        emptyMessage="Henüz haber eklenmemiş"
      />

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalMode === 'create' ? 'Yeni Haber' : 'Haber Düzenle'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="row">
                  {/* Basic Info */}
                  <div className="col-12">
                    <h3 className="section-title">Haber Bilgileri</h3>
                  </div>

                  <div className="col-12">
                    <div className="form-group">
                      <label>Başlık *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group">
                      <label>Özet</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={formData.summary}
                        onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                        placeholder="Haberin kısa özeti"
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group">
                      <label>İçerik</label>
                      <textarea
                        className="form-control"
                        rows={8}
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        placeholder="Haberin tam metni"
                      />
                    </div>
                  </div>

                  {/* Source Info */}
                  <div className="col-12 mt-3">
                    <h3 className="section-title">Kaynak Bilgileri</h3>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Kaynak *</label>
                      <select
                        className="form-control"
                        value={formData.source}
                        onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                        required
                      >
                        <option value="">Kaynak Seçiniz</option>
                        {sourceOptions.map(source => (
                          <option key={source} value={source}>{source}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Yazar</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        placeholder="İsteğe bağlı"
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group">
                      <label>Kaynak URL *</label>
                      <input
                        type="url"
                        className="form-control"
                        value={formData.sourceUrl}
                        onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
                        placeholder="https://example.com/news/..."
                        required
                      />
                    </div>
                  </div>

                  {/* Media & Categorization */}
                  <div className="col-12 mt-3">
                    <h3 className="section-title">Medya ve Kategori</h3>
                  </div>

                  <div className="col-12">
                    <div className="form-group">
                      <label>Görsel URL</label>
                      <input
                        type="url"
                        className="form-control"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Kategori</label>
                      <select
                        className="form-control"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        {categoryOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Etiketler (JSON Array)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        placeholder='["ekonomi", "faiz", "merkez bankası"]'
                      />
                    </div>
                  </div>

                  {/* Publishing Info */}
                  <div className="col-12 mt-3">
                    <h3 className="section-title">Yayın Bilgileri</h3>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Yayın Tarihi *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.publishedAt}
                        onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Durum</label>
                      <div className="checkbox-group">
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
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  İptal
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && articleToDelete && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-content modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Haberi Sil</h2>
              <button className="close-btn" onClick={() => setShowDeleteConfirm(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <p><strong>{articleToDelete.title}</strong> haberini silmek istediğinizden emin misiniz?</p>
              <p className="text-danger">Bu işlem geri alınamaz!</p>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>
                İptal
              </button>
              <button className="btn btn-danger" onClick={confirmDelete} disabled={saving}>
                {saving ? 'Siliniyor...' : 'Sil'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsManagement;
