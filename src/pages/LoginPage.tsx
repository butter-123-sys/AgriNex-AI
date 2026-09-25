// ============================================================
// AgriFedX — Login Page (Matching Image 1 Exact Layout)
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlaskConical, Mail, Lock, LogIn, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';

export default function LoginPage() {
  const { user, login, logout, language } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(email, password);
    if (success) {
      const isOfficer = email.includes('officer');
      navigate(isOfficer ? '/officer/dashboard' : '/dashboard');
    } else {
      setError(t('auth.invalidCredentials', language));
    }
  };

  const quickLogin = (role: 'farmer' | 'officer') => {
    const em = role === 'farmer' ? 'farmer@agrifedx.demo' : 'officer@agrifedx.demo';
    setEmail(em);
    setPassword('demo123');
    const success = login(em, 'demo123');
    if (success) navigate(role === 'officer' ? '/officer/dashboard' : '/dashboard');
  };

  const handleContinueCurrentSession = () => {
    if (!user) return;
    navigate(user.role === 'officer' ? '/officer/dashboard' : '/dashboard');
  };

  return (
    <div className="login-page">
      <div className="login-bg" />
      <div className="login-card" style={{ maxWidth: '420px', padding: '36px 32px' }}>
        {/* Header */}
        <div className="login-header" style={{ textAlign: 'center', marginBottom: '24px' }}>
          <FlaskConical size={44} style={{ color: '#22c55e', margin: '0 auto 12px auto' }} />
          <h1 style={{ color: '#22c55e', fontWeight: 700, fontSize: '1.9rem', margin: '0 0 6px 0', letterSpacing: '-0.5px' }}>
            AgriNex AI
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0 }}>
            {t('brand.tagline', language)}
          </p>
        </div>

        {/* Existing Active Session Banner (if any) */}
        {user && (
          <div className="current-session-box" style={{
            background: 'rgba(34, 197, 94, 0.08)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '10px',
            padding: '10px 14px',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#cbd5e1' }}>
              <UserCheck size={16} className="text-green" />
              <span><strong>{user.name}</strong> ({user.role})</span>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button className="btn btn-primary btn-sm" onClick={handleContinueCurrentSession}>
                Continue <ArrowRight size={12} />
              </button>
              <button className="btn btn-outline btn-sm" onClick={() => logout()}>
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Credentials Form matching Image 1 */}
        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-msg" style={{ marginBottom: '12px' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div className="input-group" style={{ marginBottom: '14px' }}>
            <Mail size={18} style={{ color: '#64748b' }} />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ background: '#0f172a', borderColor: '#334155' }}
            />
          </div>

          <div className="input-group" style={{ marginBottom: '18px' }}>
            <Lock size={18} style={{ color: '#64748b' }} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ background: '#0f172a', borderColor: '#334155' }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg btn-full"
            style={{
              background: '#22c55e',
              borderColor: '#22c55e',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px',
              borderRadius: '8px'
            }}
          >
            <LogIn size={18} /> {t('auth.login', language)}
          </button>
        </form>

        {/* Quick Demo Login */}
        <div className="quick-login" style={{ marginTop: '22px' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.82rem', textAlign: 'center', margin: '0 0 10px 0' }}>
            {t('auth.quickLogin', language)}
          </p>
          <div className="quick-btns" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              className="btn btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '10px 8px',
                background: '#1e293b',
                borderColor: '#334155',
                color: '#f8fafc',
                fontSize: '0.84rem'
              }}
              onClick={() => quickLogin('farmer')}
            >
              <span>🌾</span>
              <span>{t('auth.loginAsFarmer', language)}</span>
            </button>

            <button
              className="btn btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '10px 8px',
                background: '#1e293b',
                borderColor: '#334155',
                color: '#f8fafc',
                fontSize: '0.84rem'
              }}
              onClick={() => quickLogin('officer')}
            >
              <span>👨‍🔬</span>
              <span>{t('auth.loginAsOfficer', language)}</span>
            </button>
          </div>
        </div>

        {/* Demo Credentials matching Image 1 */}
        <div className="login-footer" style={{ marginTop: '20px', textAlign: 'center' }}>
          <p style={{ color: '#64748b', fontSize: '0.78rem', margin: '0 0 6px 0' }}>Demo Credentials</p>
          <div style={{ background: '#0b1120', border: '1px solid #1e293b', borderRadius: '6px', padding: '8px 12px' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.78rem', fontFamily: 'monospace' }}>farmer@agrifedx.demo / demo123</div>
            <div style={{ color: '#94a3b8', fontSize: '0.78rem', fontFamily: 'monospace', marginTop: '4px' }}>officer@agrifedx.demo / demo123</div>
          </div>
        </div>
      </div>
    </div>
  );
}
