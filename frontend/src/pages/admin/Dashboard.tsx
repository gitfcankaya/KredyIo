/**
 * Admin Dashboard Component
 * Main dashboard with statistics and recent activity
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/Admin/AdminLayout';
import {
  banksService,
  loanProductsService,
  creditCardProductsService,
  depositProductsService,
  campaignsService,
  newsArticlesService,
  articlesService,
} from '../../services/api';
import './Dashboard.css';

interface Stats {
  banks: number;
  loans: number;
  creditCards: number;
  deposits: number;
  campaigns: number;
  news: number;
  articles: number;
  users: number;
}

interface RecentActivity {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: string;
  description: string;
  timestamp: Date;
  user: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    banks: 0,
    loans: 0,
    creditCards: 0,
    deposits: 0,
    campaigns: 0,
    news: 0,
    articles: 0,
    users: 0,
  });
  const [recentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'create',
      entity: 'Kredi Ürünü',
      description: 'Yeni konut kredisi ürünü eklendi',
      timestamp: new Date(),
      user: 'Admin User',
    },
    {
      id: '2',
      type: 'update',
      entity: 'Kampanya',
      description: 'Yaz kampanyası güncellendi',
      timestamp: new Date(Date.now() - 3600000),
      user: 'Admin User',
    },
    {
      id: '3',
      type: 'delete',
      entity: 'Haber',
      description: 'Eski haber silindi',
      timestamp: new Date(Date.now() - 7200000),
      user: 'Admin User',
    },
  ]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);

      const [
        banksData,
        loansData,
        cardsData,
        depositsData,
        campaignsData,
        newsData,
        articlesData,
      ] = await Promise.all([
        banksService.getBanks(),
        loanProductsService.getProducts(),
        creditCardProductsService.getProducts(),
        depositProductsService.getProducts(),
        campaignsService.getCampaigns(),
        newsArticlesService.getNews(),
        articlesService.getArticles(),
      ]);

      setStats({
        banks: banksData.length,
        loans: loansData.length,
        creditCards: cardsData.length,
        deposits: depositsData.length,
        campaigns: campaignsData.length,
        news: newsData.length,
        articles: articlesData.length,
        users: 0, // Will be populated when user management is implemented
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      id: 'banks',
      title: 'Bankalar',
      value: stats.banks,
      icon: '🏦',
      color: 'primary',
      change: '+2',
      changeType: 'increase' as const,
    },
    {
      id: 'loans',
      title: 'Kredi Ürünleri',
      value: stats.loans,
      icon: '💵',
      color: 'success',
      change: '+5',
      changeType: 'increase' as const,
    },
    {
      id: 'cards',
      title: 'Kredi Kartları',
      value: stats.creditCards,
      icon: '💳',
      color: 'secondary',
      change: '+3',
      changeType: 'increase' as const,
    },
    {
      id: 'deposits',
      title: 'Mevduat Ürünleri',
      value: stats.deposits,
      icon: '💎',
      color: 'info',
      change: '+8',
      changeType: 'increase' as const,
    },
    {
      id: 'campaigns',
      title: 'Kampanyalar',
      value: stats.campaigns,
      icon: '🎁',
      color: 'warning',
      change: '-1',
      changeType: 'decrease' as const,
    },
    {
      id: 'news',
      title: 'Haberler',
      value: stats.news,
      icon: '📰',
      color: 'danger',
      change: '+4',
      changeType: 'increase' as const,
    },
    {
      id: 'articles',
      title: 'Makaleler',
      value: stats.articles,
      icon: '📄',
      color: 'primary',
      change: '+2',
      changeType: 'increase' as const,
    },
    {
      id: 'users',
      title: 'Kullanıcılar',
      value: stats.users,
      icon: '👥',
      color: 'secondary',
      change: '0',
      changeType: 'neutral' as const,
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'create':
        return '➕';
      case 'update':
        return '✏️';
      case 'delete':
        return '🗑️';
      default:
        return '📝';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'create':
        return 'success';
      case 'update':
        return 'info';
      case 'delete':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 60) {
      return `${minutes} dakika önce`;
    } else if (hours < 24) {
      return `${hours} saat önce`;
    } else {
      return date.toLocaleDateString('tr-TR');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Yükleniyor...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="dashboard">
        {/* Page Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Dashboard</h1>
            <p className="dashboard-subtitle">Sisteme genel bakış ve son aktiviteler</p>
          </div>
          <button className="refresh-btn" onClick={loadStats}>
            🔄 Yenile
          </button>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {statCards.map(stat => (
            <div key={stat.id} className={`stat-card stat-card-${stat.color}`}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-content">
                <div className="stat-title">{stat.title}</div>
                <div className="stat-value">{stat.value}</div>
                <div className={`stat-change stat-change-${stat.changeType}`}>
                  {stat.changeType === 'increase' ? '↗' : stat.changeType === 'decrease' ? '↘' : '→'}
                  <span>{stat.change} bu ay</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="dashboard-grid">
          {/* Quick Actions */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2 className="card-title">Hızlı İşlemler</h2>
            </div>
            <div className="card-content">
              <div className="quick-actions">
                <button onClick={() => navigate('/admin/banks')} className="quick-action-btn">
                  <span className="action-icon">➕</span>
                  <div className="action-text">
                    <div className="action-label">Yeni Banka</div>
                    <div className="action-desc">Banka ekle</div>
                  </div>
                </button>
                <button onClick={() => navigate('/admin/products/loans')} className="quick-action-btn">
                  <span className="action-icon">💰</span>
                  <div className="action-text">
                    <div className="action-label">Yeni Kredi</div>
                    <div className="action-desc">Kredi ürünü ekle</div>
                  </div>
                </button>
                <button onClick={() => navigate('/admin/campaigns')} className="quick-action-btn">
                  <span className="action-icon">🎁</span>
                  <div className="action-text">
                    <div className="action-label">Yeni Kampanya</div>
                    <div className="action-desc">Kampanya oluştur</div>
                  </div>
                </button>
                <button onClick={() => navigate('/admin/content/news')} className="quick-action-btn">
                  <span className="action-icon">📰</span>
                  <div className="action-text">
                    <div className="action-label">Yeni Haber</div>
                    <div className="action-desc">Haber yayınla</div>
                  </div>
                </button>
                <button onClick={() => navigate('/admin/content/articles')} className="quick-action-btn">
                  <span className="action-icon">📄</span>
                  <div className="action-text">
                    <div className="action-label">Yeni Makale</div>
                    <div className="action-desc">Makale ekle</div>
                  </div>
                </button>
                <button className="quick-action-btn">
                  <span className="action-icon">⚙️</span>
                  <div className="action-text">
                    <div className="action-label">Ayarlar</div>
                    <div className="action-desc">Sistem ayarları</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2 className="card-title">Son Aktiviteler</h2>
              <button className="view-all-btn">Tümünü Gör</button>
            </div>
            <div className="card-content">
              <div className="activity-list">
                {recentActivity.map(activity => (
                  <div key={activity.id} className="activity-item">
                    <div className={`activity-icon activity-icon-${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="activity-content">
                      <div className="activity-description">
                        <strong>{activity.entity}</strong> - {activity.description}
                      </div>
                      <div className="activity-meta">
                        <span className="activity-user">{activity.user}</span>
                        <span className="activity-time">{formatTimestamp(activity.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chart Placeholders */}
        <div className="charts-grid">
          <div className="dashboard-card chart-card">
            <div className="card-header">
              <h2 className="card-title">Aylık İstatistikler</h2>
            </div>
            <div className="card-content">
              <div className="chart-placeholder">
                📊 Grafik yakında eklenecek
              </div>
            </div>
          </div>

          <div className="dashboard-card chart-card">
            <div className="card-header">
              <h2 className="card-title">Popüler Ürünler</h2>
            </div>
            <div className="card-content">
              <div className="chart-placeholder">
                📈 Grafik yakında eklenecek
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
