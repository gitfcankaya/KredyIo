import React, { useState, useEffect } from 'react';
import { DataTable } from '../../components/Admin/DataTable';
import type { Column } from '../../components/Admin/DataTable';
import { articlesService } from '../../services/api';
import './BanksManagement.css';

interface Article {
  id: number;
  title: string;
  slug: string;
  metaDescription?: string;
  metaKeywords?: string;
  category: string;
  featuredImageUrl?: string;
  content: string;
  author?: string;
  readingTimeMinutes: number;
  viewCount: number;
  tableOfContents?: string;
  relatedArticleIds?: string;
  isPublished: boolean;
  isFeatured: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  title: string;
  slug: string;
  metaDescription: string;
  metaKeywords: string;
  category: string;
  featuredImageUrl: string;
  content: string;
  author: string;
  readingTimeMinutes: number;
  tableOfContents: string;
  relatedArticleIds: string;
  isPublished: boolean;
  isFeatured: boolean;
}

const ArticlesManagement: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    slug: '',
    metaDescription: '',
    metaKeywords: '',
    category: 'General',
    featuredImageUrl: '',
    content: '',
    author: '',
    readingTimeMinutes: 5,
    tableOfContents: '',
    relatedArticleIds: '',
    isPublished: false,
    isFeatured: false
  });

  const categoryOptions = [
    { value: 'General', label: 'Genel' },
    { value: 'Loan', label: 'Kredi' },
    { value: 'CreditCard', label: 'Kredi Kartı' },
    { value: 'Deposit', label: 'Mevduat' },
    { value: 'Banking', label: 'Bankacılık' },
    { value: 'News', label: 'Haber' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await articlesService.getArticles();
      setArticles(data);
      setError('');
    } catch (err) {
      setError('Makaleler yüklenirken hata oluştu');
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
      slug: '',
      metaDescription: '',
      metaKeywords: '',
      category: 'General',
      featuredImageUrl: '',
      content: '',
      author: '',
      readingTimeMinutes: 5,
      tableOfContents: '',
      relatedArticleIds: '',
      isPublished: false,
      isFeatured: false
    });
    setShowModal(true);
  };

  const handleEdit = (article: Article) => {
    setModalMode('edit');
    setSelectedArticle(article);
    setFormData({
      title: article.title,
      slug: article.slug,
      metaDescription: article.metaDescription || '',
      metaKeywords: article.metaKeywords || '',
      category: article.category,
      featuredImageUrl: article.featuredImageUrl || '',
      content: article.content,
      author: article.author || '',
      readingTimeMinutes: article.readingTimeMinutes,
      tableOfContents: article.tableOfContents || '',
      relatedArticleIds: article.relatedArticleIds || '',
      isPublished: article.isPublished,
      isFeatured: article.isFeatured
    });
    setShowModal(true);
  };

  const handleDelete = (article: Article) => {
    setArticleToDelete(article);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!articleToDelete) return;

    try {
      setSaving(true);
      await articlesService.deleteArticle(articleToDelete.id);
      await loadData();
      setShowDeleteConfirm(false);
      setArticleToDelete(null);
    } catch (err) {
      setError('Makale silinirken hata oluştu');
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
        await articlesService.createArticle(formData);
      } else if (selectedArticle) {
        await articlesService.updateArticle(selectedArticle.id, formData);
      }
      
      await loadData();
      setShowModal(false);
      setError('');
    } catch (err) {
      setError('Makale kaydedilirken hata oluştu');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const getCategoryLabel = (category: string) => {
    const option = categoryOptions.find(opt => opt.value === category);
    return option?.label || category;
  };

  const columns: Column<Article>[] = [
    {
      key: 'title',
      label: 'Başlık',
      sortable: true,
      render: (article) => (
        <div>
          <div className="fw-bold">{article.title}</div>
          <small className="text-muted">{article.slug}</small>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Kategori',
      sortable: true,
      render: (article) => (
        <span className="badge bg-info">{getCategoryLabel(article.category)}</span>
      )
    },
    {
      key: 'author',
      label: 'Yazar',
      sortable: true,
      render: (article) => article.author || '-'
    },
    {
      key: 'stats',
      label: 'İstatistikler',
      sortable: false,
      render: (article) => (
        <div>
          <small>👁️ {article.viewCount} görüntüleme</small>
          <br />
          <small>📖 {article.readingTimeMinutes} dk okuma</small>
        </div>
      )
    },
    {
      key: 'publishedAt',
      label: 'Yayın Tarihi',
      sortable: true,
      render: (article) => article.publishedAt 
        ? new Date(article.publishedAt).toLocaleDateString('tr-TR')
        : '-'
    },
    {
      key: 'status',
      label: 'Durum',
      sortable: false,
      render: (article) => (
        <div>
          {article.isPublished ? (
            <span className="badge bg-success">✓ Yayında</span>
          ) : (
            <span className="badge bg-warning">Taslak</span>
          )}
          {article.isFeatured && (
            <span className="badge bg-primary ms-1">⭐ Öne Çıkan</span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Makale Yönetimi</h1>
        <button className="btn btn-primary" onClick={handleCreate}>
          + Yeni Makale
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <DataTable
        data={articles}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchKeys={['title', 'author', 'category']}
        emptyMessage="Henüz makale eklenmemiş"
      />

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalMode === 'create' ? 'Yeni Makale' : 'Makale Düzenle'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="row">
                  {/* Basic Info */}
                  <div className="col-12">
                    <h3 className="section-title">Temel Bilgiler</h3>
                  </div>

                  <div className="col-md-8">
                    <div className="form-group">
                      <label>Başlık *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.title}
                        onChange={(e) => {
                          const title = e.target.value;
                          const slug = title
                            .toLowerCase()
                            .replace(/ğ/g, 'g')
                            .replace(/ü/g, 'u')
                            .replace(/ş/g, 's')
                            .replace(/ı/g, 'i')
                            .replace(/ö/g, 'o')
                            .replace(/ç/g, 'c')
                            .replace(/[^a-z0-9\s-]/g, '')
                            .replace(/\s+/g, '-')
                            .replace(/-+/g, '-')
                            .trim();
                          setFormData({ ...formData, title, slug });
                        }}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Kategori *</label>
                      <select
                        className="form-control"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                      >
                        {categoryOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Slug *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        required
                      />
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
                      <label>Öne Çıkan Görsel URL</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.featuredImageUrl}
                        onChange={(e) => setFormData({ ...formData, featuredImageUrl: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>

                  {/* SEO */}
                  <div className="col-12 mt-3">
                    <h3 className="section-title">SEO Bilgileri</h3>
                  </div>

                  <div className="col-12">
                    <div className="form-group">
                      <label>Meta Açıklama</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        value={formData.metaDescription}
                        onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                        maxLength={500}
                        placeholder="Arama motorları için açıklama (max 500 karakter)"
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group">
                      <label>Meta Anahtar Kelimeler</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.metaKeywords}
                        onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
                        placeholder="kredi, banka, faiz (virgülle ayırın)"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="col-12 mt-3">
                    <h3 className="section-title">İçerik</h3>
                  </div>

                  <div className="col-12">
                    <div className="form-group">
                      <label>Makale İçeriği (HTML) *</label>
                      <textarea
                        className="form-control"
                        rows={10}
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        required
                        placeholder="HTML formatında makale içeriği"
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label>İçindekiler (JSON)</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={formData.tableOfContents}
                        onChange={(e) => setFormData({ ...formData, tableOfContents: e.target.value })}
                        placeholder='[{"title":"Başlık 1","anchor":"#baslik-1"}]'
                      />
                      <small className="text-muted">JSON array formatında</small>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label>İlgili Makale ID'leri (JSON)</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={formData.relatedArticleIds}
                        onChange={(e) => setFormData({ ...formData, relatedArticleIds: e.target.value })}
                        placeholder="[1, 2, 3]"
                      />
                      <small className="text-muted">JSON array formatında</small>
                    </div>
                  </div>

                  {/* Settings */}
                  <div className="col-12 mt-3">
                    <h3 className="section-title">Ayarlar</h3>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Okuma Süresi (dakika) *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.readingTimeMinutes}
                        onChange={(e) => setFormData({ ...formData, readingTimeMinutes: parseInt(e.target.value) || 5 })}
                        min={1}
                        max={60}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-8">
                    <div className="form-group">
                      <label>Durum</label>
                      <div className="checkbox-group">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={formData.isPublished}
                            onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                          />
                          <span>Yayınla</span>
                        </label>
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={formData.isFeatured}
                            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                          />
                          <span>⭐ Öne Çıkan</span>
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
              <h2>Makaleyi Sil</h2>
              <button className="close-btn" onClick={() => setShowDeleteConfirm(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <p><strong>{articleToDelete.title}</strong> makalesini silmek istediğinizden emin misiniz?</p>
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

export default ArticlesManagement;
