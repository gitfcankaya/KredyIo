/**
 * Register Page
 * User registration with email, password, and full name
 */

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

const Register: React.FC = () => {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      return;
    }

    if (!acceptedTerms) {
      setError('Kullanım koşullarını kabul etmelisiniz');
      return;
    }

    setLoading(true);

    try {
      await register(email, password, fullName);
      // Redirect will be handled by routing
      window.location.href = '/admin';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">📝 Kayıt Ol</h1>
          <p className="auth-subtitle">KredyIo hesabı oluşturun</p>
        </div>

        {error && (
          <div className="auth-error">
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">
              Ad Soyad <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Adınız Soyadınız"
              required
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Email Adresi <span className="required">*</span>
            </label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@email.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Şifre <span className="required">*</span>
            </label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="En az 6 karakter"
              required
              autoComplete="new-password"
            />
            <small className="form-hint">
              En az 6 karakter uzunluğunda olmalıdır
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">
              Şifre Tekrar <span className="required">*</span>
            </label>
            <input
              type="password"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Şifrenizi tekrar girin"
              required
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                required
              />
              <span>
                <a href="/terms" target="_blank" rel="noopener noreferrer">
                  Kullanım Koşullarını
                </a>{' '}
                ve{' '}
                <a href="/privacy" target="_blank" rel="noopener noreferrer">
                  Gizlilik Politikasını
                </a>{' '}
                kabul ediyorum <span className="required">*</span>
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Zaten hesabınız var mı?{' '}
            <a href="/login" className="auth-link">
              Giriş Yapın
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
