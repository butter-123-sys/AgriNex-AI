// ============================================================
// AgriFedX — Alerts Page (Community Early Warning)
// ============================================================

import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import storageService from '../services/storageService';
import { AlertTriangle, Bell, MapPin, Calendar, Shield, Users } from 'lucide-react';

export default function AlertsPage() {
  const { language } = useApp();
  const alerts = storageService.getAlerts();
  const activeAlerts = alerts.filter(a => a.active);

  return (
    <div className="page alerts-page">
      <div className="page-header">
        <h1>{t('nav.alerts', language)}</h1>
        <p>{activeAlerts.length} active community alerts</p>
      </div>

      {/* Active Alerts */}
      {activeAlerts.length > 0 ? (
        <div className="alerts-list">
          {activeAlerts.map(a => (
            <div key={a.id} className={`alert-card alert-${a.riskLevel.toLowerCase()}`}>
              <div className="alert-icon">
                <AlertTriangle size={28} />
              </div>
              <div className="alert-body">
                <div className="alert-top">
                  <h3>🚨 {t('alert.communityWarning', language)}</h3>
                  <span className={`risk-badge risk-${a.riskLevel.toLowerCase()}`}>{a.riskLevel}</span>
                </div>
                <p className="alert-disease">{a.disease} detected near your area</p>
                <p className="alert-recommendation">{a.recommendation}</p>

                <div className="alert-stats">
                  <div className="alert-stat">
                    <Users size={14} />
                    <span><strong>{a.cases}</strong> {t('alert.cases', language)}</span>
                  </div>
                  <div className="alert-stat">
                    <MapPin size={14} />
                    <span>{a.area}</span>
                  </div>
                  <div className="alert-stat">
                    <Shield size={14} />
                    <span>Avg Risk: {a.averageRisk}/100</span>
                  </div>
                  <div className="alert-stat">
                    <Calendar size={14} />
                    <span>{a.period}</span>
                  </div>
                </div>

                <div className="alert-target">
                  <small>📢 Target: Nearby farmers • Agriculture officers • Community network</small>
                </div>

                <small className="alert-date">{new Date(a.createdAt).toLocaleString()}</small>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Bell size={48} />
          <p>No active community alerts</p>
          <small>Alerts are generated when 3+ disease cases are detected in a nearby area within 7 days.</small>
        </div>
      )}

      {/* Alert Rules Info */}
      <div className="alert-rules">
        <h3>Alert Generation Rules</h3>
        <div className="rules-grid">
          <div className="rule-card">
            <h4>🔍 Detection</h4>
            <p>Same disease detected in 3+ cases within nearby locations</p>
          </div>
          <div className="rule-card">
            <h4>⏰ Time Window</h4>
            <p>Cases within the last 7 days</p>
          </div>
          <div className="rule-card">
            <h4>📊 Risk Threshold</h4>
            <p>Average risk score ≥ 40 (MEDIUM or above)</p>
          </div>
          <div className="rule-card">
            <h4>📢 Notification</h4>
            <p>Alerts sent to nearby farmers and agriculture officers</p>
          </div>
        </div>
      </div>
    </div>
  );
}
