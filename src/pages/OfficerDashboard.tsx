// ============================================================
// AgriFedX — Officer Dashboard
// ============================================================

import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import storageService from '../services/storageService';
import {
  Users, FileText, AlertTriangle, Shield, Bell, Map as MapIcon, Calendar
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line, Legend
} from 'recharts';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];

export default function OfficerDashboard() {
  const { language } = useApp();

  const farmers = storageService.getFarmers();
  const diagnoses = storageService.getDiagnoses();
  const alerts = storageService.getAlerts().filter(a => a.active);
  const validations = storageService.getValidations();
  const hotspots = storageService.getHotspots();
  const pending = validations.filter(v => v.decision === 'PENDING');
  const highRisk = diagnoses.filter(d => d.riskLevel === 'HIGH');

  // Chart data
  const diseaseDistribution = (() => {
    const counts: Record<string, number> = {};
    diagnoses.forEach(d => { counts[d.disease] = (counts[d.disease] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  })();

  const riskDistribution = [
    { name: 'HIGH', value: diagnoses.filter(d => d.riskLevel === 'HIGH').length, fill: '#ef4444' },
    { name: 'MEDIUM', value: diagnoses.filter(d => d.riskLevel === 'MEDIUM').length, fill: '#f97316' },
    { name: 'LOW', value: diagnoses.filter(d => d.riskLevel === 'LOW').length, fill: '#22c55e' },
  ];

  const casesOverTime = (() => {
    const dayMap: Record<string, number> = {};
    diagnoses.forEach(d => {
      const day = new Date(d.createdAt).toLocaleDateString();
      dayMap[day] = (dayMap[day] || 0) + 1;
    });
    return Object.entries(dayMap).slice(-7).map(([date, count]) => ({ date, cases: count }));
  })();

  const cropDistribution = (() => {
    const counts: Record<string, number> = {};
    diagnoses.forEach(d => { counts[d.crop] = (counts[d.crop] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  })();

  return (
    <div className="page officer-dashboard">
      <div className="page-header">
        <h1>{t('officer.dashboard', language)}</h1>
        <p>Agriculture Intelligence Overview</p>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid six-cols">
        <div className="stat-card"><div className="stat-icon"><Users size={22} /></div><div className="stat-body"><span className="stat-label">{t('officer.totalFarmers', language)}</span><span className="stat-value">{farmers.length}</span></div></div>
        <div className="stat-card"><div className="stat-icon"><FileText size={22} /></div><div className="stat-body"><span className="stat-label">{t('officer.totalCases', language)}</span><span className="stat-value">{diagnoses.length}</span></div></div>
        <div className="stat-card risk-card"><div className="stat-icon"><AlertTriangle size={22} /></div><div className="stat-body"><span className="stat-label">{t('officer.highRisk', language)}</span><span className="stat-value text-red">{highRisk.length}</span></div></div>
        <div className="stat-card"><div className="stat-icon"><Shield size={22} /></div><div className="stat-body"><span className="stat-label">{t('officer.pendingValidation', language)}</span><span className="stat-value text-orange">{pending.length}</span></div></div>
        <div className="stat-card"><div className="stat-icon"><Bell size={22} /></div><div className="stat-body"><span className="stat-label">{t('officer.activeAlerts', language)}</span><span className="stat-value">{alerts.length}</span></div></div>
        <div className="stat-card"><div className="stat-icon"><MapIcon size={22} /></div><div className="stat-body"><span className="stat-label">{t('officer.hotspots', language)}</span><span className="stat-value">{hotspots.filter(h => h.level === 'HIGH').length}</span></div></div>
      </div>

      {/* Charts */}
      <div className="charts-row">
        <div className="chart-card">
          <h3>Disease Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={diseaseDistribution} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {diseaseDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h3>Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={riskDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="value" name="Cases">
                {riskDistribution.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h3>Cases Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={casesOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Line type="monotone" dataKey="cases" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <h3>Crop Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={cropDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="value" fill="#22c55e" name="Diagnoses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card wide">
          <h3>High-Risk Areas</h3>
          <div className="area-list">
            {hotspots.filter(h => h.level === 'HIGH' || h.level === 'MEDIUM').map(h => (
              <div key={h.id} className={`area-item area-${h.level.toLowerCase()}`}>
                <div className="area-info">
                  <strong>{h.district}</strong>
                  <span>{h.disease} — {h.cases} cases</span>
                </div>
                <span className={`risk-badge risk-${h.level.toLowerCase()}`}>{h.level}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="tables-row">
        <div className="table-card">
          <h3>Recent Cases</h3>
          <table className="data-table">
            <thead>
              <tr><th>Disease</th><th>Crop</th><th>Risk</th><th>District</th><th>Date</th></tr>
            </thead>
            <tbody>
              {diagnoses.slice(0, 8).map(d => (
                <tr key={d.id}>
                  <td>{d.disease}</td>
                  <td>{d.crop}</td>
                  <td><span className={`risk-badge risk-${d.riskLevel.toLowerCase()}`}>{d.riskScore}</span></td>
                  <td>{d.location.district}</td>
                  <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-card">
          <h3>Pending Validations</h3>
          <table className="data-table">
            <thead>
              <tr><th>AI Disease</th><th>Confidence</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {pending.slice(0, 6).map(v => (
                <tr key={v.id}>
                  <td>{v.aiDisease}</td>
                  <td>{v.aiConfidence}%</td>
                  <td><span className="validation-badge val-pending">PENDING</span></td>
                  <td>{new Date(v.timestamp).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
