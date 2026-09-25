// ============================================================
// AgriFedX — Main Layout with Navigation & Trilingual Support
// ============================================================

import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Stethoscope, History, TrendingUp, Map, Bell,
  Shield, BarChart3, Network, LogOut, Menu, X, User, Globe,
  FlaskConical, ChevronDown, RotateCcw, Bot, Sparkles, Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import storageService from '../services/storageService';
import type { Language } from '../types';

export default function Layout() {
  const { user, language, setLanguage, logout, unreadCount } = useApp();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);

  const notifications = storageService.getNotifications();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMarkAllRead = () => {
    storageService.markAllNotificationsRead();
    window.location.reload();
  };

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    setLangDropdown(false);
  };

  const farmerNav = [
    { to: '/diagnosis', icon: Stethoscope, label: t('nav.diagnosis', language) },
    { to: '/dashboard', icon: LayoutDashboard, label: t('nav.dashboard', language) },
    { to: '/progress', icon: TrendingUp, label: t('nav.progress', language) },
    { to: '/chatbot', icon: Bot, label: t('nav.chatbot', language) },
    { to: '/map', icon: Map, label: t('nav.map', language) },
    { to: '/alerts', icon: Bell, label: t('nav.alerts', language) },
    { to: '/history', icon: History, label: t('nav.history', language) },
  ];

  const officerNav = [
    { to: '/officer/dashboard', icon: LayoutDashboard, label: t('nav.officerDashboard', language) },
    { to: '/officer/validation', icon: Shield, label: t('nav.validations', language) },
    { to: '/chatbot', icon: Bot, label: t('nav.chatbot', language) },
    { to: '/map', icon: Map, label: t('nav.map', language) },
    { to: '/alerts', icon: Bell, label: t('nav.alerts', language) },
    { to: '/officer/analytics', icon: BarChart3, label: t('nav.analytics', language) },
  ];

  const navItems = user?.role === 'officer' ? officerNav : farmerNav;

  return (
    <div className="layout">
      {/* Top Bar */}
      <header className="topbar">
        <div className="topbar-left">
          <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="topbar-brand" onClick={() => navigate(user?.role === 'officer' ? '/officer/dashboard' : '/diagnosis')}>
            <FlaskConical size={22} className="brand-icon" style={{ color: '#22c55e' }} />
            <span className="brand-name" style={{ color: '#22c55e', fontWeight: 700 }}>AgriNex AI</span>
          </div>
        </div>

        <div className="topbar-right">
          {/* Trilingual Toggle (EN / MR / HI) */}
          <div className="lang-switcher-wrapper">
            <button
              className="lang-btn"
              onClick={() => setLangDropdown(!langDropdown)}
              title="Change Language / भाषा बदला"
            >
              <Globe size={16} />
              <span>{language === 'en' ? 'English' : language === 'mr' ? 'मराठी' : 'हिन्दी'}</span>
              <ChevronDown size={14} />
            </button>

            {langDropdown && (
              <div className="lang-dropdown">
                <button
                  className={`lang-option ${language === 'en' ? 'active' : ''}`}
                  onClick={() => handleSelectLanguage('en')}
                >
                  <span>🇬🇧 English</span>
                  {language === 'en' && <Check size={14} />}
                </button>
                <button
                  className={`lang-option ${language === 'mr' ? 'active' : ''}`}
                  onClick={() => handleSelectLanguage('mr')}
                >
                  <span>🇮🇳 मराठी (Marathi)</span>
                  {language === 'mr' && <Check size={14} />}
                </button>
                <button
                  className={`lang-option ${language === 'hi' ? 'active' : ''}`}
                  onClick={() => handleSelectLanguage('hi')}
                >
                  <span>🇮🇳 हिन्दी (Hindi)</span>
                  {language === 'hi' && <Check size={14} />}
                </button>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="notif-wrapper">
            <button className="notif-btn" onClick={() => setNotifOpen(!notifOpen)}>
              <Bell size={18} />
              {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
            </button>

            {notifOpen && (
              <div className="notif-dropdown">
                <div className="notif-header">
                  <h4>Notifications</h4>
                  <button onClick={handleMarkAllRead}>Mark all read</button>
                </div>
                <div className="notif-list">
                  {notifications.slice(0, 8).map((n) => (
                    <div
                      key={n.id}
                      className={`notif-item ${n.read ? 'read' : 'unread'}`}
                      onClick={() => {
                        storageService.markNotificationRead(n.id);
                        setNotifOpen(false);
                      }}
                    >
                      <strong>{n.title}</strong>
                      <p>{n.message}</p>
                      <small>{new Date(n.createdAt).toLocaleDateString()}</small>
                    </div>
                  ))}
                  {notifications.length === 0 && <p className="notif-empty">No notifications</p>}
                </div>
              </div>
            )}
          </div>

          <div className="user-info">
            <User size={16} />
            <span>{user?.name}</span>
            <span className="role-badge">{user?.role}</span>
          </div>

          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <div className="layout-body">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>

      {/* Floating Chatbot Assistant Launcher */}
      <button
        className="fab-chat-btn"
        onClick={() => navigate('/chatbot')}
        title="AgriNexAi Multi-Agent Chatbot"
      >
        <Bot size={24} />
        <span className="fab-tooltip">
          {language === 'mr' ? 'AI सहाय्यक' : language === 'hi' ? 'AI सहायक' : 'AI Chatbot'}
        </span>
      </button>

      {/* Mobile Overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}
