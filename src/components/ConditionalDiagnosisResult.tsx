// ============================================================
// AgriNex AI — Conditional Diagnosis Result Component
// ============================================================
// Autonomously renders EXACTLY ONE of 5 dashboards based on classification:
// 1. Disease/Spot Dashboard (Disease only)
// 2. Visible Pest Dashboard (Pest only)
// 3. Pest Trap Analysis (Trap only)
// 4. Healthy / No Issue Result
// 5. Uncertain / Low Confidence (Expert Referral)
// ============================================================

import React from 'react';
import type { Language, FollowUpComparison } from '../types';
import type { UnifiedClassificationResult } from '../services/unifiedClassifier';
import {
  Activity,
  Bug,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  ShieldAlert,
  Camera,
  RotateCcw,
  Sprout,
  Eye,
  Calendar,
  UserCheck,
  Info,
  Check,
  TrendingDown,
  TrendingUp,
  Sparkles,
  CloudRain,
  MapPin,
} from 'lucide-react';

interface Props {
  result: UnifiedClassificationResult;
  imageDataUrl: string;
  language?: Language;
  onUploadNewImage: () => void;
  onMonitorAgain?: () => void;
  onRequestExpertReview?: () => void;
  followUpComparison?: FollowUpComparison | null;
  weatherNote?: string;
}

export default function ConditionalDiagnosisResult({
  result,
  imageDataUrl,
  language = 'en',
  onUploadNewImage,
  onMonitorAgain,
  onRequestExpertReview,
  followUpComparison,
  weatherNote,
}: Props) {
  const isMr = language === 'mr';
  const isHi = language === 'hi';

  const t = (en: string, mr: string, hi: string) => {
    if (isMr) return mr;
    if (isHi) return hi;
    return en;
  };

  const confidencePct = Math.round(result.confidence * 100);

  // Reusable Follow-up Comparison Banner (Section 14)
  const renderFollowUpBanner = () => {
    if (!followUpComparison) return null;

    const isDecreased = followUpComparison.trend === 'decreased';
    const isIncreased = followUpComparison.trend === 'increased';

    return (
      <div className={`followup-comparison-banner card ${isDecreased ? 'trend-good' : isIncreased ? 'trend-alert' : 'trend-stable'}`} style={{ marginBottom: '16px', borderLeft: isDecreased ? '4px solid #22c55e' : isIncreased ? '4px solid #ef4444' : '4px solid #3b82f6' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isDecreased ? <TrendingDown size={22} className="text-green" /> : isIncreased ? <TrendingUp size={22} className="text-red" /> : <Info size={22} className="text-blue" />}
          <div>
            <h4 style={{ margin: 0, fontSize: '0.98rem' }}>
              {t('Follow-up Image Comparison', 'पाठपुरावा फोटो तुलना', 'फॉलो-अप फोटो तुलना')}
            </h4>
            <p style={{ margin: '4px 0 0', fontWeight: 600, fontSize: '0.92rem' }}>
              {followUpComparison.statusMessage}
            </p>
            <small style={{ color: 'var(--text-muted, #94a3b8)', display: 'block', marginTop: '4px' }}>
              ⚠️ {t('Comparison is based strictly on your uploaded photographs, not a whole-field census.', 'तुलना फक्त आपण अपलोड केलेल्या फोटोंवर आधारित आहे, संपूर्ण शेताची नाही.', 'तुलना केवल आपके अपलोड किए गए फोटो पर आधारित है, पूरे खेत की नहीं।')}
            </small>
          </div>
        </div>
      </div>
    );
  };

  // Reusable Simple Weather Risk Note (Section 12)
  const renderWeatherNote = () => {
    if (!weatherNote) return null;
    return (
      <div className="farmer-weather-note" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'rgba(59, 130, 246, 0.08)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)', marginTop: '14px', fontSize: '0.88rem' }}>
        <CloudRain size={16} className="text-blue" />
        <span>🌤️ <strong>{t('Weather Advisory:', 'हवामान सल्ला:', 'मौसम सलाह:')} </strong> {weatherNote}</span>
      </div>
    );
  };

  // ============================================================
  // DASHBOARD 1: LEAF SPOT / DISEASE DETECTED (Section 2)
  // ============================================================
  if (result.classification === 'disease') {
    return (
      <div className="conditional-result-wrapper disease-theme animate-fade-in">
        {renderFollowUpBanner()}

        {/* Top Result Banner */}
        <div className="cond-card disease-primary-card">
          <div className="cond-card-header">
            <div className="cond-header-title">
              <div className="icon-badge badge-disease">
                <Activity size={22} />
              </div>
              <div>
                <span className="cond-type-tag">
                  {t('DISEASE / LEAF SPOT DETECTED', 'पानावरील रोग / ठिपके आढळले', 'पत्ती पर रोग / धब्बे पाए गए')}
                </span>
                <h2 className="cond-main-name">{result.name}</h2>
              </div>
            </div>

            <div className="cond-header-badges">
              <span className="confidence-pill">
                <ShieldCheck size={14} /> {confidencePct}% {t('Confidence', 'खात्री', 'विश्वास')}
              </span>
              <span className={`severity-pill severity-${result.severity.toLowerCase()}`}>
                {result.severity === 'High' && (isMr ? '🔴 तीव्र प्रादुर्भाव' : isHi ? '🔴 उच्च गंभीरता' : '🔴 High Severity')}
                {result.severity === 'Moderate' && (isMr ? '🟠 मध्यम प्रादुर्भाव' : isHi ? '🟠 मध्यम गंभीरता' : '🟠 Moderate Severity')}
                {result.severity === 'Low' && (isMr ? '🟢 कमी प्रादुर्भाव' : isHi ? '🟢 कम गंभीरता' : '🟢 Low Severity')}
              </span>
            </div>
          </div>

          <p className="cond-explanation-text">
            <strong>{t('Symptom:', 'लक्षण:', 'लक्षण:')} </strong>
            {result.explanation}
          </p>
          <small className="cond-severity-note">
            ℹ️ {result.severityExplanation}
          </small>

          {renderWeatherNote()}
        </div>

        {/* Visual Evidence Card with Localized Highlight */}
        <div className="cond-card visual-evidence-card">
          <div className="card-section-title">
            <Eye size={18} className="text-green" />
            <h3>{t('Visual Evidence & Affected Region', 'दृश्य पुरावा आणि बाधित भाग', 'दृश्य साक्ष्य एवं प्रभावित क्षेत्र')}</h3>
          </div>

          <div className="evidence-grid">
            <div className="evidence-image-container">
              {imageDataUrl ? (
                <div className="evidence-img-frame">
                  <img src={imageDataUrl} alt="Analyzed Leaf" />
                  <div
                    className="attention-marker-box"
                    style={{
                      left: `${result.highlight_box?.x || 22}%`,
                      top: `${result.highlight_box?.y || 25}%`,
                      width: `${result.highlight_box?.width || 56}%`,
                      height: `${result.highlight_box?.height || 50}%`,
                    }}
                  >
                    <span className="marker-label">
                      🎯 {t('Affected Area Detected', 'बाधित क्षेत्र आढळले', 'प्रभावित क्षेत्र चिह्नित')}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="evidence-placeholder">
                  <Sprout size={48} />
                </div>
              )}
            </div>

            <div className="evidence-meta-panel">
              <div className="meta-row">
                <span className="meta-label">{t('Affected Crop:', 'बाधित पीक:', 'प्रभावित फसल:')}</span>
                <strong className="meta-value">🌾 {result.affectedCrop}</strong>
              </div>
              <div className="meta-row">
                <span className="meta-label">{t('Affected Area (Estimate):', 'बाधित क्षेत्र (अंदाज):', 'प्रभावित क्षेत्र (अनुमान):')}</span>
                <span className="status-badge-inline">
                  {result.affectedRegion || t('15% of visible leaf area', 'पानाचा १५% भाग बाधित', 'पत्ती का 15% भाग प्रभावित')}
                </span>
              </div>
              <div className="meta-row">
                <span className="meta-label">{t('Inspection Status:', 'तपासणी स्थिती:', 'निरीक्षण स्थिति:')}</span>
                <span className="status-badge-inline">
                  <Check size={13} /> {t('Foliar Lesion Verified', 'पानावरील डाग सत्यापित', 'पत्ती के धब्बे सत्यापित')}
                </span>
              </div>
              <p className="meta-desc">
                {t(
                  'The AI localized disease lesion spots across leaf tissue. Follow the precautions below to halt spread.',
                  'AI ने पानावरील रोगाचे ठिपके शोधले आहेत. प्रादुर्भाव रोखण्यासाठी खालील खबरदारीचे पालन करा.',
                  'AI ने पत्ती पर रोग के धब्बों की पहचान की है। फैलाव रोकने के लिए नीचे दी गई सावधानियों का पालन करें।'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Precaution / What to do now (Section 2: 3-5 simple disease-specific precautions) */}
        <div className="cond-card precautions-card">
          <div className="card-section-title">
            <ShieldAlert size={18} className="text-orange" />
            <h3>{t('WHAT SHOULD I DO?', 'आता काय करावे?', 'अब क्या करें?')}</h3>
          </div>
          <ul className="precaution-list">
            {result.recommendations.map((rec, idx) => (
              <li key={idx} className="precaution-item">
                <span className="item-num">{idx + 1}</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Monitoring & Follow-up */}
        <div className="cond-card monitoring-card">
          <div className="card-section-title">
            <Calendar size={18} className="text-cyan" />
            <h3>{t('Field Monitoring & Recheck', 'शेत निरीक्षण व फेरतपासणी', 'खेत निगरानी एवं पुन: परीक्षण')}</h3>
          </div>
          <div className="monitoring-content">
            <p>
              🔍 <strong>{t('Check nearby plants: ', 'जवळची झाडे तपासा: ', 'आसपास के पौधे जांचें: ')}</strong>
              {t(
                'Inspect leaves in the same and adjacent rows for spreading spots.',
                'त्याच आणि लगतच्या ओळींमधील झाडे तपासून ठिपके पसरत आहेत का ते पहा.',
                'उसी और आसपास की कतारों के पौधों की जांच करें कि धब्बे फैल तो नहीं रहे।'
              )}
            </p>
            <p>
              🔄 <strong>{t('Monitor again after 3–4 days: ', '३ ते ४ दिवसांनी पुन्हा निरीक्षण करा: ', '3 से 4 दिनों में पुन: निरीक्षण करें: ')}</strong>
              {t(
                'Upload a fresh leaf photo to track whether foliar lesions are stabilized or declining.',
                '३ ते ४ दिवसांनंतर पुन्हा नवीन फोटो अपलोड करून रोगाची प्रगती तपासा.',
                '3 से 4 दिनों के बाद नया फोटो अपलोड करके रोग की प्रगति देखें।'
              )}
            </p>
          </div>

          {result.expert_verification && (
            <div className="expert-alert-strip">
              <UserCheck size={18} />
              <div>
                <strong>{t('Agricultural Expert Verification Recommended', 'कृषी तज्ज्ञांचा सल्ला शिफारस केला आहे', 'कृषि विशेषज्ञ सलाह अनुशंसित')}</strong>
                <small>
                  {t(
                    'High severity detected. Consult your local agricultural extension worker or KVK.',
                    'तीव्र प्रादुर्भाव आढळला आहे. स्थानिक कृषी सहाय्यक किंवा केव्हीकेशी संपर्क साधा.',
                    'उच्च गंभीरता पाई गई है। स्थानीय कृषि सहायक या केवीके से परामर्श लें।'
                  )}
                </small>
              </div>
            </div>
          )}

          <div className="cond-footer-actions">
            <button className="btn btn-primary" onClick={onMonitorAgain || onUploadNewImage}>
              <RotateCcw size={16} /> {t('🔄 Monitor Again', '🔄 पुन्हा निरीक्षण करा', '🔄 पुन: निगरानी करें')}
            </button>
            <button className="btn btn-secondary" onClick={onUploadNewImage}>
              <Camera size={16} /> {t('Upload Another Leaf', 'दुसरा फोटो तपासा', 'अन्य फोटो जांचें')}
            </button>
            {onRequestExpertReview && (
              <button className="btn btn-outline" onClick={onRequestExpertReview}>
                <UserCheck size={16} /> {t('Verify with Expert', 'तज्ज्ञांकडून पडताळणी करा', 'विशेषज्ञ से सत्यापित कराएं')}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // DASHBOARD 2: VISIBLE PEST DETECTED (Section 3 & 4)
  // ============================================================
  if (result.classification === 'pest') {
    return (
      <div className="conditional-result-wrapper pest-theme animate-fade-in">
        {renderFollowUpBanner()}

        {/* Top Result Banner */}
        <div className="cond-card pest-primary-card">
          <div className="cond-card-header">
            <div className="cond-header-title">
              <div className="icon-badge badge-pest">
                <Bug size={24} />
              </div>
              <div>
                <span className="cond-type-tag">
                  {t('🐛 PEST DETECTED', '🐛 कीड आढळली', '🐛 कीट पाया गया')}
                </span>
                <h2 className="cond-main-name">{result.name}</h2>
              </div>
            </div>

            <div className="cond-header-badges">
              <span className="confidence-pill">
                <ShieldCheck size={14} /> {confidencePct}% {t('Confidence', 'खात्री', 'विश्वास')}
              </span>
              <span className={`severity-pill severity-${result.severity.toLowerCase()}`}>
                {result.severity === 'High' && (isMr ? '🔴 तीव्र कीड संख्या' : isHi ? '🔴 उच्च कीट संख्या' : '🔴 High Activity')}
                {result.severity === 'Moderate' && (isMr ? '🟠 मध्यम कीड संख्या' : isHi ? '🟠 मध्यम कीट संख्या' : '🟠 Moderate Activity')}
                {result.severity === 'Low' && (isMr ? '🟢 कमी कीड संख्या' : isHi ? '🟢 कम कीट संख्या' : '🟢 Low Activity')}
              </span>
            </div>
          </div>

          {/* Pest Type & Visible Count Box */}
          <div className="pest-stats-strip">
            <div className="pest-stat-box">
              <span className="pest-stat-label">{t('Pest Type', 'किडीचा प्रकार', 'कीट का प्रकार')}</span>
              <strong className="pest-stat-value">{result.name}</strong>
              <small className="pest-stat-sub">({result.pestCategory || 'Insect'})</small>
            </div>

            <div className="pest-stat-box highlight-count">
              <span className="pest-stat-label">{t('Visible pests in image', 'फोटोत दिसणारी कीड संख्या', 'फोटो में दृश्यमान कीट संख्या')}</span>
              <strong className="pest-stat-value count-accent">{result.visible_count || 1} {t('visible', 'दिसणारे', 'दृश्यमान')}</strong>
              <small className="pest-stat-sub">
                ⚠️ {t('Count is based on the uploaded image only (never claimed as whole-field population)', 'फक्त या अपलोड केलेल्या फोटोतील मोजणी (संपूर्ण शेताची नाही)', 'केवल इस अपलोड फोटो में गिनती (पूरे खेत की नहीं)')}
              </small>
            </div>
          </div>

          <p className="cond-explanation-text">
            <strong>{t('Inspection Note:', 'निरीक्षण नोंद:', 'निरीक्षण नोट:')} </strong>
            {result.explanation}
          </p>

          {renderWeatherNote()}
        </div>

        {/* Pest Image Evidence with Highlighted Region */}
        <div className="cond-card visual-evidence-card">
          <div className="card-section-title">
            <Eye size={18} className="text-orange" />
            <h3>{t('Pest Location & Highlighted Image', 'किडीचे स्थान आणि दृश्य पुरावा', 'कीट स्थान एवं दृश्य साक्ष्य')}</h3>
          </div>

          <div className="evidence-grid">
            <div className="evidence-image-container">
              {imageDataUrl ? (
                <div className="evidence-img-frame">
                  <img src={imageDataUrl} alt="Analyzed Pest" />
                  <div
                    className="pest-marker-box"
                    style={{
                      left: `${result.highlight_box?.x || 20}%`,
                      top: `${result.highlight_box?.y || 22}%`,
                      width: `${result.highlight_box?.width || 58}%`,
                      height: `${result.highlight_box?.height || 55}%`,
                    }}
                  >
                    <span className="marker-label pest-label">
                      🐛 {result.name} ({result.visible_count || 1} {t('visible in image', 'फोटोत दिसणारे', 'फोटो में दृश्यमान')})
                    </span>
                  </div>
                </div>
              ) : (
                <div className="evidence-placeholder">
                  <Bug size={48} />
                </div>
              )}
            </div>

            <div className="evidence-meta-panel">
              <div className="meta-row">
                <span className="meta-label">{t('Target Crop:', 'पीक:', 'फसल:')}</span>
                <strong className="meta-value">🌾 {result.affectedCrop}</strong>
              </div>
              <div className="meta-row">
                <span className="meta-label">{t('Indicative Activity:', 'प्रादुर्भाव पातळी:', 'गतिविधि स्तर:')}</span>
                <span className="status-badge-inline orange">
                  {result.severity} {t('Activity (Based on uploaded image)', 'पातळी (अपलोड फोटोवर आधारित)', 'स्तर (अपलोड फोटो पर आधारित)')}
                </span>
              </div>
              <p className="meta-desc">
                {t(
                  'Follow verified integrated pest management (IPM) practices below. Do not spray broad-spectrum pesticides without verifying economic threshold.',
                  'खालील प्रमाणित एकात्मिक कीड नियंत्रण (IPM) पद्धतींचे पालन करा. विनाकारण तीव्र रासायनिक फवारणी करू नका.',
                  'नीचे दी गई प्रमाणित एकीकृत कीट नियंत्रण (IPM) पद्धतियों का पालन करें। अनावश्यक रूप से तेज कीटनाशक न छिड़कें।'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Pest-Related Precautions (Section 4) */}
        <div className="cond-card precautions-card">
          <div className="card-section-title">
            <ShieldAlert size={18} className="text-orange" />
            <h3>{t('WHAT SHOULD I DO?', 'आता काय करावे?', 'अब क्या करें?')}</h3>
          </div>
          <ul className="precaution-list">
            {result.recommendations.map((rec, idx) => (
              <li key={idx} className="precaution-item">
                <span className="item-num">{idx + 1}</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Follow-up & Actions */}
        <div className="cond-card monitoring-card">
          <div className="card-section-title">
            <Calendar size={18} className="text-cyan" />
            <h3>{t('Follow-up & Monitoring', 'पाठपुरावा व शेत निरीक्षण', 'अनुवर्ती कार्रवाई एवं खेत निगरानी')}</h3>
          </div>
          <div className="monitoring-content">
            <p>
              🔍 <strong>{t('Field follow-up: ', 'शेत पाठपुरावा: ', 'खेत निगरानी: ')}</strong>
              {t(
                'Monitor the field closely. Upload another image if pest population or leaf damage increases.',
                'शेतावर बारीक लक्ष ठेवा. कीड संख्या किंवा पानांचे नुकसान वाढल्यास पुन्हा फोटो अपलोड करा.',
                'खेत की बारीकी से निगरानी करें। यदि कीटों की संख्या या पत्ती का नुकसान बढ़ता है तो पुन: फोटो अपलोड करें।'
              )}
            </p>
            <p>
              📋 <strong>{t('Monitor again after 3–4 days: ', '३ ते ४ दिवसांनी पुन्हा तपासा: ', '3 से 4 दिनों में पुन: जांचें: ')}</strong>
              {t(
                'Recheck the infested patches after 3 to 4 days to assess if natural predators or cultural controls are keeping them in check.',
                '३ ते ४ दिवसांनी पुन्हा बाधित झाडे तपासा आणि मित्रकीटकांचे कार्य सुरू आहे का ते पहा.',
                '3 से 4 दिनों में पुन: पौधों की जांच करें कि क्या मित्रकीट या जैविक उपाय नियंत्रण में हैं।'
              )}
            </p>
          </div>

          <div className="cond-footer-actions">
            <button className="btn btn-primary" onClick={onMonitorAgain || onUploadNewImage}>
              <RotateCcw size={16} /> {t('🔄 Monitor Again', '🔄 पुन्हा निरीक्षण करा', '🔄 पुन: निगरानी करें')}
            </button>
            <button className="btn btn-secondary" onClick={onUploadNewImage}>
              <Camera size={16} /> {t('Upload Another Photo', 'दुसरा फोटो तपासा', 'अन्य फोटो जांचें')}
            </button>
            {onRequestExpertReview && (
              <button className="btn btn-outline" onClick={onRequestExpertReview}>
                <UserCheck size={16} /> {t('Verify with Expert', 'तज्ज्ञांकडून पडताळणी करा', 'विशेषज्ञ से सत्यापित कराएं')}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // DASHBOARD 3: PEST-TRAP WORKFLOW (Section 5)
  // ============================================================
  if (result.classification === 'trap') {
    return (
      <div className="conditional-result-wrapper trap-theme animate-fade-in">
        {renderFollowUpBanner()}

        {/* Top Trap Result Banner */}
        <div className="cond-card trap-primary-card" style={{ borderTop: '4px solid #f59e0b' }}>
          <div className="cond-card-header">
            <div className="cond-header-title">
              <div className="icon-badge" style={{ background: '#fef3c7', color: '#b45309' }}>
                🪤
              </div>
              <div>
                <span className="cond-type-tag" style={{ color: '#b45309' }}>
                  {t('🪤 PEST TRAP ANALYSIS', '🪤 कीड सापळा विश्लेषण', '🪤 कीट ट्रैप विश्लेषण')}
                </span>
                <h2 className="cond-main-name">{result.trap_type || result.name}</h2>
              </div>
            </div>

            <div className="cond-header-badges">
              <span className="confidence-pill">
                <ShieldCheck size={14} /> {confidencePct}% {t('Confidence', 'खात्री', 'विश्वास')}
              </span>
              <span className="status-badge-inline orange">
                {result.status || t('Monitor pest activity', 'कीड हालचालींचे निरीक्षण करा', 'कीट गतिविधि की निगरानी करें')}
              </span>
            </div>
          </div>

          {/* Trap Specifications & Count Box */}
          <div className="pest-stats-strip">
            <div className="pest-stat-box">
              <span className="pest-stat-label">{t('Trap Type Identified', 'ओळखलेला सापळा प्रकार', 'पहचाना गया ट्रैप प्रकार')}</span>
              <strong className="pest-stat-value">{result.trap_type || result.name}</strong>
              <small className="pest-stat-sub">({t('Automated AI Recognition', 'स्वयंचलित AI ओळख', 'स्वचालित AI पहचान')})</small>
            </div>

            <div className="pest-stat-box">
              <span className="pest-stat-label">{t('Possible Pest Visible', 'सापळ्यात दिसणारी कीड', 'ट्रैप में संभावित कीट')}</span>
              <strong className="pest-stat-value" style={{ color: '#d97706' }}>{result.pest_type || 'Whitefly'}</strong>
              <small className="pest-stat-sub">({t('Target Monitored Species', 'लक्ष्य कीटक प्रजाती', 'लक्षित कीट प्रजाति')})</small>
            </div>

            <div className="pest-stat-box highlight-count">
              <span className="pest-stat-label">{t('Visible insects counted in this image', 'या फोटोत मोजलेले कीटक', 'इस फोटो में गिने गए कीट')}</span>
              <strong className="pest-stat-value count-accent">{result.visible_count || 12}</strong>
              <small className="pest-stat-sub">
                ⚠️ {t('Visible insects counted in this image (NOT total pests in your field)', 'फक्त या फोटोत मोजलेले कीटक (संपूर्ण शेतातील कीड संख्या नाही)', 'केवल इस फोटो में गिने गए कीट (आपके पूरे खेत की कुल संख्या नहीं)')}
              </small>
            </div>
          </div>

          <p className="cond-explanation-text">
            <strong>{t('Monitoring Note: ', 'निरीक्षण नोंद: ', 'निगरानी नोट: ')}</strong>
            {result.explanation}
          </p>

          {renderWeatherNote()}
        </div>

        {/* Visual Trap Evidence */}
        <div className="cond-card visual-evidence-card">
          <div className="card-section-title">
            <Eye size={18} className="text-amber" />
            <h3>{t('Trap Image & Insect Count Surveillance', 'सापळ्याचा फोटो आणि कीटक मोजणी', 'ट्रैप फोटो एवं कीट गणना')}</h3>
          </div>

          <div className="evidence-grid">
            <div className="evidence-image-container">
              {imageDataUrl ? (
                <div className="evidence-img-frame">
                  <img src={imageDataUrl} alt="Analyzed Trap" />
                  <div
                    className="pest-marker-box"
                    style={{
                      left: '18%',
                      top: '18%',
                      width: '64%',
                      height: '64%',
                      borderColor: '#f59e0b',
                    }}
                  >
                    <span className="marker-label pest-label" style={{ background: '#d97706' }}>
                      🪤 {result.visible_count || 12} {t('insects on trap surface', 'सापळ्यावरील कीटक', 'ट्रैप सतह पर कीट')}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="evidence-placeholder">
                  🪤
                </div>
              )}
            </div>

            <div className="evidence-meta-panel">
              <div className="meta-row">
                <span className="meta-label">{t('Monitoring Purpose:', 'सापळ्याचा उद्देश:', 'ट्रैप का उद्देश्य:')}</span>
                <strong className="meta-value">{t('Early-Warning Population Scouting', 'पूर्व-सूचना कीड निरीक्षण', 'प्रारंभिक चेतावनी कीट निगरानी')}</strong>
              </div>
              <div className="meta-row">
                <span className="meta-label">{t('Interpretation:', 'अर्थ:', 'व्याख्या:')}</span>
                <span className="status-badge-inline orange">
                  {t('Monitor pest activity — check again in 3–4 days', 'कीड हालचाल निरीक्षण करा — ३ ते ४ दिवसांनी पुन्हा तपासा', 'कीट गतिविधि निगरानी — 3-4 दिनों में पुन: जांचें')}
                </span>
              </div>
              <p className="meta-desc">
                {t(
                  'Agricultural traps sample flying insect activity. One trap photo does not represent the entire field population, so avoid spraying without verifying crop damage.',
                  'सापळे हवेतील कीटकांचे नमुने टिपतात. एका सापळ्याचा फोटो म्हणजे संपूर्ण शेतातील कीड नाही, म्हणून झाडांचे नुकसान पाहिल्याशिवाय फवारणी करू नका.',
                  'ट्रैप उड़ने वाले कीटों का नमूना लेते हैं। एक ट्रैप की तस्वीर पूरे खेत की संख्या नहीं दर्शाती, इसलिए फसल नुकसान देखे बिना कीटनाशक न छिड़कें।'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* What should I do for Trap */}
        <div className="cond-card precautions-card">
          <div className="card-section-title">
            <ShieldAlert size={18} className="text-orange" />
            <h3>{t('WHAT SHOULD I DO?', 'आता काय करावे?', 'अब क्या करें?')}</h3>
          </div>
          <ul className="precaution-list">
            {result.recommendations.map((rec, idx) => (
              <li key={idx} className="precaution-item">
                <span className="item-num">{idx + 1}</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Trap Monitoring & Follow-up Actions */}
        <div className="cond-card monitoring-card">
          <div className="card-section-title">
            <Calendar size={18} className="text-cyan" />
            <h3>{t('Trap Follow-up & Monitoring', 'सापळा पाठपुरावा व फेरतपासणी', 'ट्रैप अनुवर्ती कार्रवाई एवं पुन: परीक्षण')}</h3>
          </div>
          <div className="monitoring-content">
            <p>
              🔍 <strong>{t('Record count on calendar: ', 'कॅलेंडरवर नोंद ठेवा: ', 'कैलेंडर पर नोट करें: ')}</strong>
              {t(
                'Record the count of visible insects every 3 to 4 days to see if the population is rising or falling.',
                'दर ३ ते ४ दिवसांनी सापळ्यावरील कीटकांची संख्या नोंदवा जेणेकरून संख्या वाढत आहे की कमी होत आहे ते समजेल.',
                'प्रत्येक 3 से 4 दिनों में ट्रैप के कीटों की संख्या नोट करें ताकि पता चले कि आबादी बढ़ रही है या घट रही है।'
              )}
            </p>
            <p>
              🔄 <strong>{t('Upload follow-up trap photo: ', 'पुढचा सापळा फोटो अपलोड करा: ', 'अगला ट्रैप फोटो अपलोड करें: ')}</strong>
              {t(
                'Take another photo in 3 to 4 days to automatically compare whether pest density is increasing.',
                '३ ते ४ दिवसांनी पुन्हा नवीन फोटो घेऊन कीड संख्या वाढली आहे का ते आपोआप तपासा.',
                '3 से 4 दिनों में पुन: फोटो लेकर जांचें कि क्या कीट घनत्व बढ़ रहा है।'
              )}
            </p>
          </div>

          <div className="cond-footer-actions">
            <button className="btn btn-primary" onClick={onMonitorAgain || onUploadNewImage}>
              <RotateCcw size={16} /> {t('🔄 Monitor Again', '🔄 पुन्हा निरीक्षण करा', '🔄 पुन: निगरानी करें')}
            </button>
            <button className="btn btn-secondary" onClick={onUploadNewImage}>
              <Camera size={16} /> {t('Upload Another Trap Image', 'दुसरा सापळा फोटो अपलोड करा', 'अन्य ट्रैप फोटो अपलोड करें')}
            </button>
            {onRequestExpertReview && (
              <button className="btn btn-outline" onClick={onRequestExpertReview}>
                <UserCheck size={16} /> {t('Verify with Expert', 'तज्ज्ञांकडून पडताळणी करा', 'विशेषज्ञ से सत्यापित कराएं')}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // DASHBOARD 4: HEALTHY / NO ISSUE DETECTED (Section 7)
  // ============================================================
  if (result.classification === 'healthy') {
    return (
      <div className="conditional-result-wrapper healthy-theme animate-fade-in">
        {renderFollowUpBanner()}

        <div className="cond-card healthy-primary-card">
          <div className="healthy-hero-block">
            <div className="icon-badge badge-healthy">
              <CheckCircle2 size={36} className="text-green" />
            </div>
            <h2>{t('✓ No visible pest or disease symptom detected', '✓ कोणतीही दृश्य कीड किंवा रोगाची लक्षणे आढळली नाहीत', '✓ कोई दृश्य कीट या रोग के लक्षण नहीं दिखे')}</h2>
            <p className="healthy-sub-text">
              {t(
                'Your uploaded image does not show a clear problem. The leaf tissue shows intact green coloration and no visible lesions or insect colonies.',
                'आपल्या अपलोड केलेल्या फोटोमध्ये कोणतीही स्पष्ट समस्या दिसत नाही. पानाचा रंग निरोगी असून त्यावर डाग किंवा कीड दिसत नाही.',
                'आपकी अपलोड की गई फोटो में कोई स्पष्ट समस्या नहीं दिख रही है। पत्ती का रंग स्वस्थ है और कोई धब्बे या कीट नहीं दिखते हैं।'
              )}
            </p>
          </div>

          <div className="healthy-guidance-box">
            <h4>🌱 {t('WHAT SHOULD I DO?', 'आता काय करावे?', 'अब क्या करें?')}</h4>
            <ul>
              <li>{t('Continue regular field monitoring across different crop rows.', 'विविध ओळींमध्ये नियमित शेत निरीक्षण सुरू ठेवा.', 'विभिन्न कतारों में नियमित खेत निगरानी जारी रखें।')}</li>
              <li>{t('Upload another clear image if symptoms appear on any plant in your plot.', 'कोणत्याही झाडावर लक्षणे आढळल्यास त्वरित नवीन स्पष्ट फोटो अपलोड करा.', 'यदि किसी भी पौधे पर लक्षण दिखाई दें तो तुरंत नया स्पष्ट फोटो अपलोड करें।')}</li>
            </ul>
          </div>

          <div className="healthy-disclaimer" style={{ background: 'rgba(234, 179, 8, 0.08)', border: '1px solid rgba(234, 179, 8, 0.25)', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Info size={18} className="text-amber" />
            <span style={{ fontSize: '0.88rem' }}>
              ⚠️ <strong>{t('Important field notice:', 'महत्त्वाची नोंद:', 'महत्वपूर्ण सूचना:')} </strong>
              {t(
                'The AI has only analyzed this uploaded photograph. Never assume the entire field is completely healthy without regular scouting.',
                'AI ने फक्त या अपलोड केलेल्या फोटोचे विश्लेषण केले आहे. शेतात फेरफटका मारल्याशिवाय संपूर्ण शेत निरोगी आहे असे समजू नका.',
                'AI ने केवल इस अपलोड किए गए फोटो का विश्लेषण किया है। खेत में घूमे बिना पूरे खेत को पूर्णतः स्वस्थ न मानें।'
              )}
            </span>
          </div>

          {renderWeatherNote()}

          <div className="cond-footer-actions center-actions">
            <button className="btn btn-primary" onClick={onUploadNewImage}>
              <Camera size={16} /> {t('Upload Another Leaf', 'दुसऱ्या पानाचा फोटो घ्या', 'अन्य पत्ती का फोटो लें')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // DASHBOARD 5: UNCERTAIN / LOW CONFIDENCE (Section 8)
  // ============================================================
  return (
    <div className="conditional-result-wrapper uncertain-theme animate-fade-in">
      {renderFollowUpBanner()}

      <div className="cond-card uncertain-primary-card">
        <div className="uncertain-hero-block">
          <div className="icon-badge badge-uncertain">
            <HelpCircle size={36} className="text-amber" />
          </div>
          <h2>{t('⚠ Unable to identify confidently', '⚠ खात्रीशीर ओळख पटवता आली नाही', '⚠ विश्वासपूर्वक पहचान संभव नहीं हो सकी')}</h2>
          <p className="uncertain-sub-text">
            {t(
              'Please upload a clearer image. The AI will not force an incorrect diagnosis when confidence is below the safety threshold.',
              'कृपया अधिक स्पष्ट फोटो अपलोड करा. अचूक खात्री नसल्यास सिस्टीम चुकीची शिफारस टाळण्यासाठी जबरदस्तीने निष्कर्ष काढत नाही.',
              'कृपया अधिक स्पष्ट फोटो अपलोड करें। सुरक्षा सीमा से कम विश्वास होने पर गलत उपचार से बचने हेतु कोई जबरन निष्कर्ष नहीं दिया जाता।'
            )}
          </p>
        </div>

        <div className="photo-tips-box">
          <h4>📷 {t('Simple Photo Instructions:', 'फोटो काढण्यासाठी सोप्या सूचना:', 'फोटो खींचने के लिए सरल निर्देश:')}</h4>
          <div className="photo-tips-grid">
            <div className="photo-tip-item">
              <span>☀️</span>
              <strong>{t('Good Lighting', 'चांगला प्रकाश', 'अच्छा प्रकाश')}</strong>
              <small>{t('Use natural daylight; avoid harsh flash glare or dark shadow.', 'नैसर्गिक प्रकाशात फोटो घ्या; सावली टाळा.', 'प्राकृतिक दिन के प्रकाश में फोटो लें; परछाईं से बचें।')}</small>
            </div>
            <div className="photo-tip-item">
              <span>🔍</span>
              <strong>{t('Keep Leaf/Pest Visible', 'पान किंवा कीड स्पष्ट ठेवा', 'पत्ती या कीट को स्पष्ट रखें')}</strong>
              <small>{t('Keep the affected leaf or insect visible and centered in frame.', 'बाधित पान किंवा कीड फ्रेमच्या मध्यभागी स्पष्ट ठेवा.', 'प्रभावित पत्ती या कीट को फ्रेम के केंद्र में रखें।')}</small>
            </div>
            <div className="photo-tip-item">
              <span>📐</span>
              <strong>{t('Avoid Blurry Images', 'अस्पष्ट फोटो टाळा', 'धुंधली फोटो से बचें')}</strong>
              <small>{t('Hold camera steady so edges and spots stay crisp.', 'कॅमेरा स्थिर पकडा जेणेकरून डाग स्पष्ट दिसतील.', 'कैमरा स्थिर रखें ताकि धब्बे साफ दिखें।')}</small>
            </div>
            <div className="photo-tip-item">
              <span>🔬</span>
              <strong>{t('Take a Close-up', 'जवळून फोटो घ्या', 'क्लोज-अप लें')}</strong>
              <small>{t('Get within 10–15 cm of the affected area.', 'बाधित भागाच्या जवळून (१०–१५ सेमी) फोटो घ्या.', 'प्रभावित भाग के नजदीक (10-15 सेमी) से फोटो लें।')}</small>
            </div>
          </div>
        </div>

        {renderWeatherNote()}

        <div className="cond-footer-actions center-actions">
          <button className="btn btn-primary" onClick={onUploadNewImage}>
            <Camera size={16} /> {t('Upload Clearer Image', 'स्पष्ट फोटो पुन्हा अपलोड करा', 'स्पष्ट फोटो पुन: अपलोड करें')}
          </button>
          {onRequestExpertReview && (
            <button className="btn btn-secondary" onClick={onRequestExpertReview}>
              <UserCheck size={16} /> {t('Request Expert Verification', 'कृषी तज्ज्ञांकडून पडताळणी मागा', 'कृषि विशेषज्ञ से सत्यापन मांगें')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
