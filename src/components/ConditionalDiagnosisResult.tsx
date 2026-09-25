// ============================================================
// AgriNex AI — Conditional Diagnosis Result Component
// ============================================================
// Autonomously renders EXACTLY ONE of 4 dashboards based on classification:
// 1. Disease/Spot Dashboard
// 2. Visible Pest Dashboard
// 3. Healthy / No Issue Result
// 4. Uncertain / Low Confidence (Expert Referral)
// ============================================================

import React from 'react';
import type { Language } from '../types';
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
} from 'lucide-react';

interface Props {
  result: UnifiedClassificationResult;
  imageDataUrl: string;
  language?: Language;
  onUploadNewImage: () => void;
  onRequestExpertReview?: () => void;
}

export default function ConditionalDiagnosisResult({
  result,
  imageDataUrl,
  language = 'en',
  onUploadNewImage,
  onRequestExpertReview,
}: Props) {
  const isMr = language === 'mr';
  const isHi = language === 'hi';

  const t = (en: string, mr: string, hi: string) => {
    if (isMr) return mr;
    if (isHi) return hi;
    return en;
  };

  const confidencePct = Math.round(result.confidence * 100);

  // ============================================================
  // DASHBOARD 1: LEAF SPOT / DISEASE DETECTED
  // ============================================================
  if (result.classification === 'disease') {
    return (
      <div className="conditional-result-wrapper disease-theme animate-fade-in">
        {/* Top Result Banner */}
        <div className="cond-card disease-primary-card">
          <div className="cond-card-header">
            <div className="cond-header-title">
              <div className="icon-badge badge-disease">
                <Activity size={22} />
              </div>
              <div>
                <span className="cond-type-tag">
                  {t('LEAF DISEASE / SPOT DETECTED', 'पानावरील रोग / ठिपके आढळले', 'पत्ती पर रोग / धब्बे पाए गए')}
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
        </div>

        {/* Visual Evidence Card */}
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
                  <div className="attention-marker-box" style={{ left: '22%', top: '25%', width: '56%', height: '50%' }}>
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

        {/* Precaution / Immediate Action (What to do now) */}
        <div className="cond-card precautions-card">
          <div className="card-section-title">
            <ShieldAlert size={18} className="text-orange" />
            <h3>{t('What to Do Now (Verified Precautions)', 'आता काय करावे (तातडीची खबरदारी)', 'अब क्या करें (तत्काल सावधानियां)')}</h3>
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
              🔄 <strong>{t('Re-upload photo: ', 'पुन्हा फोटो अपलोड करा: ', 'पुन: फोटो अपलोड करें: ')}</strong>
              {t(
                'Take and upload a fresh leaf photo in 3 to 4 days to track disease progression.',
                '३ ते ४ दिवसांनंतर पुन्हा नवीन फोटो अपलोड करून रोगाची स्थिती तपासा.',
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
            <button className="btn btn-secondary" onClick={onUploadNewImage}>
              <Camera size={16} /> {t('Upload Another Leaf', 'दुसरा फोटो तपासा', 'अन्य फोटो जांचें')}
            </button>
            {onRequestExpertReview && (
              <button className="btn btn-outline" onClick={onRequestExpertReview}>
                <UserCheck size={16} /> {t('Request Expert Review', 'तज्ज्ञांची मदत मागा', 'विशेषज्ञ समीक्षा मांगें')}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // DASHBOARD 2: VISIBLE PEST DETECTED
  // ============================================================
  if (result.classification === 'pest') {
    return (
      <div className="conditional-result-wrapper pest-theme animate-fade-in">
        {/* Top Result Banner */}
        <div className="cond-card pest-primary-card">
          <div className="cond-card-header">
            <div className="cond-header-title">
              <div className="icon-badge badge-pest">
                <Bug size={24} />
              </div>
              <div>
                <span className="cond-type-tag">
                  {t('VISIBLE PEST DETECTED', 'दृश्य कीड आढळली', 'प्रत्यक्ष कीट पाया गया')}
                </span>
                <h2 className="cond-main-name">{result.name} {t('Detected', 'आढळले', 'पाया गया')}</h2>
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
              <span className="pest-stat-label">{t('Visible Pests in Image', 'फोटोत दिसणारी कीड संख्या', 'फोटो में दृश्यमान कीट संख्या')}</span>
              <strong className="pest-stat-value count-accent">{result.visible_count || 1}</strong>
              <small className="pest-stat-sub">
                ⚠️ {t('Visible in this uploaded photo only (not a field-wide census)', 'फक्त या अपलोड केलेल्या फोटोतील मोजणी (संपूर्ण शेताची नाही)', 'केवल इस अपलोड फोटो में गिनती (पूरे खेत की नहीं)')}
              </small>
            </div>
          </div>

          <p className="cond-explanation-text">
            <strong>{t('Inspection Note:', 'निरीक्षण नोंद:', 'निरीक्षण नोट:')} </strong>
            {result.explanation}
          </p>
        </div>

        {/* Pest Image Evidence */}
        <div className="cond-card visual-evidence-card">
          <div className="card-section-title">
            <Eye size={18} className="text-orange" />
            <h3>{t('Pest Image Evidence', 'किडीचा दृश्य पुरावा', 'कीट का दृश्य साक्ष्य')}</h3>
          </div>

          <div className="evidence-grid">
            <div className="evidence-image-container">
              {imageDataUrl ? (
                <div className="evidence-img-frame">
                  <img src={imageDataUrl} alt="Analyzed Pest" />
                  <div className="pest-marker-box" style={{ left: '20%', top: '22%', width: '58%', height: '55%' }}>
                    <span className="marker-label pest-label">
                      🐛 {result.name} ({result.visible_count || 1} {t('visible', 'दिसणारे', 'दृश्यमान')})
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
                <span className="meta-label">{t('Activity Level:', 'हालचाल पातळी:', 'गतिविधि स्तर:')}</span>
                <span className="status-badge-inline orange">
                  {result.severity} {t('Activity (Image-based)', 'हालचाल (फोटोवर आधारित)', 'गतिविधि (फोटो पर आधारित)')}
                </span>
              </div>
              <p className="meta-desc">
                {t(
                  'Follow verified integrated pest management (IPM) practices below. Do not spray uncertified high-dose pesticides unnecessarily.',
                  'खालील प्रमाणित एकात्मिक कीड नियंत्रण (IPM) पद्धतींचे पालन करा. विनाकारण तीव्र रासायनिक फवारणी करू नका.',
                  'नीचे दी गई प्रमाणित एकीकृत कीट नियंत्रण (IPM) पद्धतियों का पालन करें। अनावश्यक रूप से तेज कीटनाशक न छिड़कें।'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Pest-Related Precautions */}
        <div className="cond-card precautions-card">
          <div className="card-section-title">
            <ShieldAlert size={18} className="text-orange" />
            <h3>{t('Pest Management Precautions', 'कीड व्यवस्थापन व खबरदारी', 'कीट प्रबंधन एवं सावधानियां')}</h3>
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
              📋 <strong>{t('Recheck interval: ', 'फेरतपासणी कालावधी: ', 'पुन: जांच अंतराल: ')}</strong>
              {t(
                'Recheck the infested patches after 3 to 4 days to assess if natural predators or cultural controls are keeping them in check.',
                '३ ते ४ दिवसांनी पुन्हा बाधित झाडे तपासा आणि मित्रकीटकांचे कार्य सुरू आहे का ते पहा.',
                '3 से 4 दिनों में पुन: पौधों की जांच करें कि क्या मित्रकीट या जैविक उपाय नियंत्रण में हैं।'
              )}
            </p>
          </div>

          <div className="cond-footer-actions">
            <button className="btn btn-secondary" onClick={onUploadNewImage}>
              <Camera size={16} /> {t('Upload Another Photo', 'दुसरा फोटो तपासा', 'अन्य फोटो जांचें')}
            </button>
            {onRequestExpertReview && (
              <button className="btn btn-outline" onClick={onRequestExpertReview}>
                <UserCheck size={16} /> {t('Pest Expert Verification', 'कीड तज्ज्ञ पडताळणी', 'कीट विशेषज्ञ सत्यापन')}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // DASHBOARD 3: HEALTHY / NO ISSUE DETECTED
  // ============================================================
  if (result.classification === 'healthy') {
    return (
      <div className="conditional-result-wrapper healthy-theme animate-fade-in">
        <div className="cond-card healthy-primary-card">
          <div className="healthy-hero-block">
            <div className="icon-badge badge-healthy">
              <CheckCircle2 size={36} className="text-green" />
            </div>
            <h2>{t('✓ No Visible Pest or Disease Symptom Detected', '✓ कोणतीही दृश्य कीड किंवा रोगाची लक्षणे आढळली नाहीत', '✓ कोई दृश्य कीट या रोग के लक्षण नहीं दिखे')}</h2>
            <p className="healthy-sub-text">
              {t(
                'The uploaded leaf shows healthy green color profile with intact margins and no visible lesions or insects.',
                'अपलोड केलेले पान निरोगी असून त्यावर कोणतेही डाग किंवा किडीची लक्षणे दिसत नाहीत.',
                'अपलोड की गई पत्ती स्वस्थ हरी है, किनारे साबुत हैं और कोई धब्बे या कीट नहीं दिखते हैं।'
              )}
            </p>
          </div>

          <div className="healthy-guidance-box">
            <h4>🌱 {t('Field Guidance', 'शेत मार्गदर्शन', 'खेत मार्गदर्शन')}</h4>
            <ul>
              <li>{t('Continue normal field monitoring and routine crop care.', 'नियमित शेत निरीक्षण व पिकाची योग्य काळजी सुरू ठेवा.', 'सामान्य खेत निगरानी और नियमित देखभाल जारी रखें।')}</li>
              <li>{t('Maintain regular nutrient and water scheduling for optimal vegetative growth.', 'संतुलित खत व पाण्याचे व्यवस्थापन सुरू ठेवा.', 'उचित पोषण और जल प्रबंधन बनाए रखें।')}</li>
              <li>{t('Upload another image immediately if you observe any spotting, curling, or creeping insects.', 'पानांवर डाग किंवा कीड आढळल्यास त्वरित नवीन फोटो अपलोड करा.', 'यदि पत्तियों पर धब्बे या कीड़े दिखाई दें तो तुरंत नया फोटो अपलोड करें।')}</li>
            </ul>
          </div>

          <div className="healthy-disclaimer">
            <Info size={16} />
            <span>
              {t(
                'Note: This result applies only to the uploaded image. Continue regular scouting across different rows of your field.',
                'टीप: हा निष्कर्ष फक्त या अपलोड केलेल्या फोटोपुरता मर्यादित आहे. संपूर्ण शेतात नियमित फेरफटका मारून निरीक्षण करत राहा.',
                'नोट: यह परिणाम केवल इस अपलोड फोटो पर लागू होता है। अपने खेत की अन्य कतारों में भी नियमित निगरानी जारी रखें।'
              )}
            </span>
          </div>

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
  // DASHBOARD 4: UNCERTAIN / LOW CONFIDENCE
  // ============================================================
  return (
    <div className="conditional-result-wrapper uncertain-theme animate-fade-in">
      <div className="cond-card uncertain-primary-card">
        <div className="uncertain-hero-block">
          <div className="icon-badge badge-uncertain">
            <HelpCircle size={36} className="text-amber" />
          </div>
          <h2>{t('⚠️ Unable to Identify Confidently', '⚠️ खात्रीशीर ओळख पटवता आली नाही', '⚠️ विश्वासपूर्वक पहचान संभव नहीं हो सकी')}</h2>
          <p className="uncertain-sub-text">
            {t(
              'The AI model could not detect clear pest or disease patterns with sufficient certainty. To avoid incorrect treatment, no diagnosis is forced.',
              'कमी स्पष्टतेमुळे रोग किंवा किडीची खात्री पटलेली नाही. चुकीची शिफारस टाळण्यासाठी सिस्टीमने कोणताही निर्णय जबरदस्तीने घेतलेला नाही.',
              'कम स्पष्टता के कारण रोग या कीट की पुष्टि नहीं हो सकी। गलत उपचार से बचने के लिए कोई जबरन निष्कर्ष नहीं दिया गया है।'
            )}
          </p>
        </div>

        <div className="photo-tips-box">
          <h4>📷 {t('How to Take a Better Photo:', 'उत्तम फोटो कसा घ्यावा:', 'बेहतर फोटो कैसे लें:')}</h4>
          <div className="photo-tips-grid">
            <div className="photo-tip-item">
              <span>☀️</span>
              <strong>{t('Good Lighting', 'चांगला प्रकाश', 'अच्छा प्रकाश')}</strong>
              <small>{t('Use natural daylight; avoid dark shadows or flash glare.', 'नैसर्गिक सूर्यप्रकाशात फोटो घ्या.', 'प्राकृतिक दिन के प्रकाश में फोटो लें।')}</small>
            </div>
            <div className="photo-tip-item">
              <span>🔍</span>
              <strong>{t('Clear Close-up', 'जवळून स्पष्ट', 'स्पष्ट क्लोज-अप')}</strong>
              <small>{t('Focus directly on the affected leaf or insect.', 'बाधित पानावर किंवा किडीवर कॅमेरा फोकस करा.', 'प्रभावित पत्ती या कीट पर फोकस करें।')}</small>
            </div>
            <div className="photo-tip-item">
              <span>📐</span>
              <strong>{t('Flat Angle', 'सपाट कोन', 'सीधा कोण')}</strong>
              <small>{t('Keep camera parallel to the leaf surface.', 'कॅमेरा पानाच्या समांतर ठेवा.', 'कैमरा पत्ती की सतह के समानांतर रखें।')}</small>
            </div>
          </div>
        </div>

        <div className="cond-footer-actions center-actions">
          <button className="btn btn-primary" onClick={onUploadNewImage}>
            <Camera size={16} /> {t('📷 Upload Clearer Image', '📷 स्पष्ट फोटो पुन्हा अपलोड करा', '📷 स्पष्ट फोटो पुन: अपलोड करें')}
          </button>
          {onRequestExpertReview && (
            <button className="btn btn-secondary" onClick={onRequestExpertReview}>
              <UserCheck size={16} /> {t('👨‍🌾 Request Expert Verification', '👨‍🌾 कृषी तज्ज्ञांची मदत घ्या', '👨‍🌾 कृषि विशेषज्ञ सत्यापन मांगें')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
