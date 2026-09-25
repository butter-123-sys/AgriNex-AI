// ============================================================
// AgriNex AI — Farmer Dashboard: Multi-Crop Health Intelligence
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import storageService from '../services/storageService';
import {
  Stethoscope, TrendingUp, Map, ChevronRight, ShieldCheck,
  Thermometer, Droplets, Wind, MapPin, CheckCircle2, Sparkles, Sprout, Bug
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

export default function FarmerDashboard() {
  const { language, user } = useApp();
  const navigate = useNavigate();

  // Per day actions state (checked items)
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);

  const toggleStep = (stepNum: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNum) ? prev.filter((s) => s !== stepNum) : [...prev, stepNum]
    );
  };

  // Donut chart data with multi-language disease labels
  const donutData = [
    { name: t('disease.EarlyBlight', language), value: 50, color: '#ef4444' },
    { name: t('disease.LateBlight', language), value: 25, color: '#f97316' },
    { name: t('disease.LeafSpot', language), value: 17, color: '#eab308' },
    { name: t('disease.Healthy', language), value: 8, color: '#22c55e' },
  ];

  // 10-Day trajectory data with multi-language notes
  const trajectoryData = [
    { day: `${t('dashboard.dayLabel', language)} 1`, risk: 35, note: t('traj.day1', language) },
    { day: `${t('dashboard.dayLabel', language)} 4`, risk: 48, note: t('traj.day4', language) },
    { day: `${t('dashboard.dayLabel', language)} 7`, risk: 65, note: t('traj.day7', language) },
    { day: `${t('dashboard.dayLabel', language)} 10`, risk: 78, note: t('traj.day10', language) },
  ];

  // Custom label renderer for donut chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, name, percent, fill }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 24;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const isRight = x > cx;

    return (
      <text
        x={x}
        y={y}
        fill={fill}
        textAnchor={isRight ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight={700}
      >
        {`${name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  return (
    <div className="page dashboard-image3-page">
      {/* ============================================================
          AGRINEX AI: OVERALL MULTI-CROP HEALTH INTELLIGENCE HERO
          ============================================================ */}
      {/* ============================================================
          AGRINEX AI: SIMPLIFIED DASHBOARD HEADER
          ============================================================ */}
      <div className="card agrinex-simplified-hero">
        <div className="simplified-hero-main">
          <div className="hero-brand-block">
            <div className="hero-title-row">
              <h1 className="hero-title">{t('brand.name', language)}</h1>
              <span className="hero-badge"><Sparkles size={13} className="text-green" /> {t('brand.tagline', language)}</span>
            </div>
            <p className="hero-sub">{t('dashboard.multiCropMonitoring', language)}</p>
          </div>

          <div className="hero-farmer-block">
            <span className="farmer-avatar-circle">👨‍🌾</span>
            <div className="farmer-profile-meta">
              <span className="farmer-name">{user?.name || 'Rajesh Patil'}</span>
              <small className="farmer-sub-text"><MapPin size={12} className="text-green" /> Nashik, Deolali • {t('dashboard.farmerPlotOwner', language)}</small>
            </div>
          </div>
        </div>

        <div className="simplified-hero-footer">
          {/* Multi-Crop Coverage Chips */}
          <div className="hero-crops-group">
            <span className="crops-row-label">
              <Sprout size={14} className="text-green" /> {t('common.crop', language)}:
            </span>
            <span className="crop-pill active">🍅 {t('crop.Tomato', language)}</span>
            <span className="crop-pill active">🥔 {t('crop.Potato', language)}</span>
            <span className="crop-pill active">🌽 {t('crop.Maize', language)}</span>
            <span className="crop-pill active">🌿 {t('crop.Cotton', language)}</span>
            <span className="crop-pill active">🌱 {t('crop.Soybean', language)}</span>
          </div>

          {/* Compact Weather Stats */}
          <div className="hero-weather-strip">
            <div className="weather-mini-item">
              <Thermometer size={14} className="text-red" />
              <span><strong>27°C</strong></span>
            </div>
            <div className="weather-mini-item">
              <Droplets size={14} className="text-blue" />
              <span><strong>82%</strong> {t('dashboard.humidity', language)}</span>
            </div>
            <div className="weather-mini-item">
              <Wind size={14} className="text-cyan" />
              <span><strong>8 km/h</strong> {t('dashboard.windSpeed', language)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          PER DAY ACTIONS TO BE FOLLOWED IN DASHBOARD (100% LOCALIZED)
          ============================================================ */}
      <div className="card per-day-actions-card">
        <div className="per-day-header">
          <div className="header-left">
            <div className="action-hub-indicator">
              <ShieldCheck size={20} className="text-green" />
              <span>{t('dashboard.perDayTitle', language)}</span>
            </div>
            <h3>{t('dashboard.perDayHeading', language)}</h3>
            <p className="per-day-sub">{t('dashboard.perDaySub', language)}</p>
          </div>

          <div className="per-day-progress-badge">
            <CheckCircle2 size={16} className="text-green" />
            <span>{completedSteps.length} / 3 {t('dashboard.completedToday', language)}</span>
          </div>
        </div>

        <div className="per-day-steps-grid">
          {/* Step 1 */}
          <div className={`per-day-step-box ${completedSteps.includes(1) ? 'is-done' : ''}`}>
            <div className="step-box-top">
              <span className={`step-circle-num ${completedSteps.includes(1) ? 'done' : ''}`}>
                {completedSteps.includes(1) ? '✓' : '1'}
              </span>
              <button
                className={`step-check-btn ${completedSteps.includes(1) ? 'checked' : ''}`}
                onClick={() => toggleStep(1)}
              >
                {completedSteps.includes(1)
                  ? t('dashboard.stepDone', language)
                  : t('dashboard.stepMark', language)}
              </button>
            </div>
            <div className="step-box-body">
              <strong>{t('dashboard.action1.title', language)}</strong>
              <p>{t('dashboard.action1.desc', language)}</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className={`per-day-step-box ${completedSteps.includes(2) ? 'is-done' : ''}`}>
            <div className="step-box-top">
              <span className={`step-circle-num ${completedSteps.includes(2) ? 'done' : ''}`}>
                {completedSteps.includes(2) ? '✓' : '2'}
              </span>
              <button
                className={`step-check-btn ${completedSteps.includes(2) ? 'checked' : ''}`}
                onClick={() => toggleStep(2)}
              >
                {completedSteps.includes(2)
                  ? t('dashboard.stepDone', language)
                  : t('dashboard.stepMark', language)}
              </button>
            </div>
            <div className="step-box-body">
              <strong>{t('dashboard.action2.title', language)}</strong>
              <p>{t('dashboard.action2.desc', language)}</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className={`per-day-step-box ${completedSteps.includes(3) ? 'is-done' : ''}`}>
            <div className="step-box-top">
              <span className={`step-circle-num ${completedSteps.includes(3) ? 'done' : ''}`}>
                {completedSteps.includes(3) ? '✓' : '3'}
              </span>
              <button
                className={`step-check-btn ${completedSteps.includes(3) ? 'checked' : ''}`}
                onClick={() => toggleStep(3)}
              >
                {completedSteps.includes(3)
                  ? t('dashboard.stepDone', language)
                  : t('dashboard.stepMark', language)}
              </button>
            </div>
            <div className="step-box-body">
              <strong>{t('dashboard.action3.title', language)}</strong>
              <p>{t('dashboard.action3.desc', language)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          GROWTH STAGES & 3 QUICK ACTION CARDS (100% LOCALIZED)
          ============================================================ */}
      <div className="dashboard-top-grid">
        {/* Left: Growth Stage Tracker */}
        <div className="card stage-tracker-card">
          <div className="stage-tracker-header">
            <span>{t('dashboard.growthStageHeader', language)}</span>
          </div>

          <div className="stages-vertical-list">
            {/* Stage 1 */}
            <div className="stage-row stage-completed">
              <div className="stage-left">
                <span className="stage-num-badge green">1</span>
                <strong className="stage-title">{t('stage.seedling', language)}</strong>
              </div>
              <span className="stage-date">Jul 10</span>
            </div>

            {/* Stage 2 */}
            <div className="stage-row stage-completed">
              <div className="stage-left">
                <span className="stage-num-badge green">2</span>
                <strong className="stage-title">{t('stage.vegetative', language)}</strong>
              </div>
              <span className="stage-date">Aug 02</span>
            </div>

            {/* Stage 3: Current Active */}
            <div className="stage-row stage-active">
              <div className="stage-left">
                <span className="stage-num-badge orange">3</span>
                <strong className="stage-title">{t('stage.flowering', language)}</strong>
              </div>
              <div className="stage-right-active">
                <span className="stage-date-active">Aug 20 - {t('stage.present', language)}</span>
                <span className="active-pill-badge">{t('stage.active', language)}</span>
              </div>
            </div>

            {/* Stage 4 */}
            <div className="stage-row stage-pending">
              <div className="stage-left">
                <span className="stage-num-badge muted">4</span>
                <span className="stage-title muted">{t('stage.fruiting', language)}</span>
              </div>
              <span className="stage-date muted">Sep 15</span>
            </div>

            {/* Stage 5 */}
            <div className="stage-row stage-pending">
              <div className="stage-left">
                <span className="stage-num-badge muted">5</span>
                <span className="stage-title muted">{t('stage.maturity', language)}</span>
              </div>
              <span className="stage-date muted">Oct 05</span>
            </div>
          </div>
        </div>

        {/* Right: 3 Quick Action Cards */}
        <div className="dashboard-actions-stack">
          {/* Action 1: Scan Any Crop Leaf */}
          <div
            className="card action-nav-card"
            onClick={() => navigate('/diagnosis')}
            role="button"
            tabIndex={0}
          >
            <div className="action-nav-icon">
              <Stethoscope size={22} />
            </div>
            <div className="action-nav-content">
              <strong>{t('dashboard.scanLeaf', language)}</strong>
              <small>{t('dashboard.runAI', language)}</small>
            </div>
            <ChevronRight size={18} className="action-nav-chevron" />
          </div>

          {/* Action 2: Monitor Crop Health Trend */}
          <div
            className="card action-nav-card"
            onClick={() => navigate('/progress?farm=farm-01')}
            role="button"
            tabIndex={0}
          >
            <div className="action-nav-icon">
              <TrendingUp size={22} />
            </div>
            <div className="action-nav-content">
              <strong>{t('dashboard.monitorTrend', language)}</strong>
              <small>{t('dashboard.trackProgress', language)}</small>
            </div>
            <ChevronRight size={18} className="action-nav-chevron" />
          </div>

          {/* Action 3: Maharashtra Disease Map */}
          <div
            className="card action-nav-card"
            onClick={() => navigate('/map')}
            role="button"
            tabIndex={0}
          >
            <div className="action-nav-icon">
              <Map size={22} />
            </div>
            <div className="action-nav-content">
              <strong>{t('dashboard.diseaseMapMH', language)}</strong>
              <small>{t('dashboard.viewHotspots', language)}</small>
            </div>
            <ChevronRight size={18} className="action-nav-chevron" />
          </div>

          {/* CONDITIONAL COMPACT PEST ACTIVITY CARD (ONLY WHEN PEST/TRAP DATA EXISTS) */}
          {(() => {
            const diagnoses = storageService.getDiagnoses();
            const latestPestDiag = diagnoses.find((d) => d.pestAnalysis?.hasPest);
            const pData = latestPestDiag?.pestAnalysis;

            if (!pData || !pData.hasPest) return null;

            return (
              <div
                className="card pest-activity-compact-card"
                onClick={() => navigate('/history')}
                role="button"
                tabIndex={0}
                style={{ cursor: 'pointer' }}
              >
                <div className="pest-card-compact-header">
                  <div className="compact-title-group">
                    <span className="compact-bug-badge">🐛</span>
                    <strong>{language === 'mr' ? 'कीड प्रादुर्भाव स्थिती' : language === 'hi' ? 'कीट गतिविधि स्थिति' : 'Pest Activity'}</strong>
                  </div>
                  <span className={`status-pill status-${pData.activityLevel.toLowerCase()}`}>
                    {pData.activityLevel} Activity
                  </span>
                </div>

                <div className="compact-pest-counts-list">
                  {pData.detections.map((det, i) => (
                    <div key={i} className="compact-pest-row">
                      <span className="det-pest-name">{det.pestType}:</span>
                      <strong className="det-pest-count">{det.count}</strong>
                    </div>
                  ))}
                  {pData.isTrapImage && pData.trapInfo && (
                    <div className="compact-pest-row trap-row">
                      <span className="det-pest-name">Trap:</span>
                      <span className="det-trap-val">{pData.trapInfo.type}</span>
                    </div>
                  )}
                </div>

                <div className="compact-pest-footer">
                  <span className="compact-monitoring-tag">⚠️ Status: Monitoring Required</span>
                  <ChevronRight size={16} className="compact-arrow" />
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* ============================================================
          BOTTOM GRID: DONUT & LINE CHARTS (ALL CROPS & LOCALIZED)
          ============================================================ */}
      <div className="dashboard-bottom-grid">
        {/* Bottom Left: Diseases Detected Donut Chart */}
        <div className="card dashboard-chart-card">
          <div className="chart-card-header">
            <h3>🌱 {t('dashboard.diseasesDetected', language)}</h3>
            <p>{t('dashboard.donutSubtitle', language)}</p>
          </div>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <PieChart margin={{ top: 15, right: 30, bottom: 15, left: 30 }}>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={76}
                  paddingAngle={3}
                  dataKey="value"
                  label={renderCustomizedLabel}
                  labelLine={{ stroke: '#64748b', strokeWidth: 1 }}
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="custom-simple-tooltip">
                          <strong style={{ color: d.color }}>{d.name}</strong>
                          <p>{d.value}% {t('dashboard.fieldDiagnosesTooltip', language)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Right: Crop Disease Risk Trajectory */}
        <div className="card dashboard-chart-card">
          <div className="chart-card-header">
            <h3>📈 {t('dashboard.riskTrajectory', language)}</h3>
            <p>{t('dashboard.trajectorySubtitle', language)}</p>
          </div>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <AreaChart data={trajectoryData} margin={{ top: 20, right: 30, left: -15, bottom: 5 }}>
                <defs>
                  <linearGradient id="image3RiskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="custom-simple-tooltip">
                          <strong>{d.day}</strong>
                          <p>{t('dashboard.riskScoreTooltip', language)}: <span className="text-red">{d.risk}/100</span></p>
                          <small>{d.note}</small>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="risk"
                  stroke="#ef4444"
                  strokeWidth={3}
                  fill="url(#image3RiskGrad)"
                  dot={{ r: 5, fill: '#ef4444', strokeWidth: 0 }}
                  activeDot={{ r: 7, fill: '#ef4444', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
