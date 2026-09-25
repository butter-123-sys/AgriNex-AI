// ============================================================
// AgriNex AI — Pest & Trap Analysis Dashboard Card
// ============================================================
// Conditionally displayed ONLY when pest/trap evidence is detected.
// Presents:
// - Trap Type (Yellow/Blue Sticky, Pheromone, Light, etc.)
// - Pests Detected with distinct type-wise counts
// - Pest Activity (Low / Moderate / High)
// - Pest-wise Process: What to check, Precautions, Management (IPM), Monitoring
// ============================================================

import { useState } from 'react';
import type { PestAnalysisResult, Language, PestType } from '../types';
import {
  Bug,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Camera,
  ShieldAlert,
  Info,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  FlaskConical,
  Sprout,
  Activity,
} from 'lucide-react';

interface Props {
  pestAnalysis: PestAnalysisResult;
  language?: Language;
  onUploadClearer?: () => void;
}

export default function PestDashboardCard({ pestAnalysis, language = 'en', onUploadClearer }: Props) {
  // CRITICAL REQUIREMENT: Do NOT display if no pest is detected
  if (!pestAnalysis || !pestAnalysis.hasPest) {
    return null;
  }

  const [activePestTab, setActivePestTab] = useState<number>(0);
  const [showFullProcess, setShowFullProcess] = useState<boolean>(true);

  const isMr = language === 'mr';
  const isHi = language === 'hi';

  const tPest = (key: string, enText: string, mrText: string, hiText: string) => {
    if (isMr) return mrText;
    if (isHi) return hiText;
    return enText;
  };

  const getPestName = (pestType: PestType): string => {
    switch (pestType) {
      case 'Caterpillar':
        return tPest('cat', 'Caterpillar', 'सुरवंट / अळी', 'सुंडी / इल्ली');
      case 'Whitefly':
        return tPest('wf', 'Whitefly', 'पांढरी माशी', 'सफेद मक्खी');
      case 'Aphids':
        return tPest('aph', 'Aphids', 'मावा', 'माहू (एफिड्स)');
      case 'Thrips':
        return tPest('thr', 'Thrips', 'थ्रिप्स (फुलकिडे)', 'थ्रिप्स (चुरडा)');
      case 'Stem Borer':
        return tPest('sb', 'Stem Borer', 'खोडकिडा', 'तना छेदक');
      case 'Fall Armyworm':
        return tPest('faw', 'Fall Armyworm', 'लष्करी अळी', 'फॉल आर्मीवर्म');
      case 'Leafminer':
        return tPest('lm', 'Leafminer', 'नागअळी', 'लीफ माइनर');
      case 'Fruit Borer':
        return tPest('fb', 'Fruit Borer', 'फळपोखरणारी अळी', 'फल छेदक');
      default:
        return tPest('unk', 'Unknown Pest', 'अनोळखी कीड', 'अज्ञात कीट');
    }
  };

  const getTrapName = (trapType: string): string => {
    switch (trapType) {
      case 'Yellow Sticky Trap':
        return tPest('yst', 'Yellow Sticky Trap', 'पिवळा चिकट सापळा', 'पीला चिपचिपा ट्रैप');
      case 'Blue Sticky Trap':
        return tPest('bst', 'Blue Sticky Trap', 'निळा चिकट सापळा', 'नीला चिपचिपा ट्रैप');
      case 'Pheromone Trap':
        return tPest('pht', 'Pheromone Trap', 'कामगंध सापळा', 'फेरोमोन ट्रैप');
      case 'Light Trap':
        return tPest('lt', 'Light Trap', 'प्रकाश सापळा', 'प्रकाश ट्रैप');
      case 'Pitfall Trap':
        return tPest('pft', 'Pitfall Trap', 'पिटफॉल सापळा', 'पिटफॉल ट्रैप');
      default:
        return tPest('ot', 'Agricultural Trap', 'कृषी सापळा', 'कृषि ट्रैप');
    }
  };

  const selectedGuidance = pestAnalysis.pestGuidanceList[activePestTab] || pestAnalysis.pestGuidanceList[0];

  return (
    <div className="card pest-dashboard-card">
      {/* Card Header */}
      <div className="pest-card-header">
        <div className="pest-header-title">
          <div className="pest-icon-wrapper">
            <Bug size={22} className="text-orange" />
          </div>
          <div>
            <h3>
              {tPest(
                'title',
                '🐛 Pest & Trap Intelligence',
                '🐛 कीड व ट्रॅप विश्लेषण',
                '🐛 कीट व ट्रैप विश्लेषण'
              )}
            </h3>
            <span className="pest-header-sub">
              {pestAnalysis.isTrapImage
                ? tPest(
                    'trapSub',
                    'Agricultural Trap Surveillance & Monitoring',
                    'शेती सापळा निरीक्षण व कीड संख्या',
                    'कृषि ट्रैप निगरानी एवं कीट संख्या'
                  )
                : tPest(
                    'cropSub',
                    'Crop Foliage Pest Detection',
                    'पानांवरील प्रत्यक्ष कीड निरीक्षण',
                    'पत्ती पर प्रत्यक्ष कीट निगरानी'
                  )}
            </span>
          </div>
        </div>

        <div className="pest-header-badges">
          {pestAnalysis.isDemoMode && (
            <span className="badge badge-demo">
              <FlaskConical size={12} />
              {tPest('demo', 'DEMO MODE', 'डेमो मोड', 'डेमो मोड')}
            </span>
          )}
          {pestAnalysis.activityLevel !== 'Unspecified' && (
            <span className={`pest-activity-badge activity-${pestAnalysis.activityLevel.toLowerCase()}`}>
              <Activity size={13} />
              {pestAnalysis.activityLevel === 'High' && (isMr ? '🔴 तीव्र प्रादुर्भाव' : isHi ? '🔴 उच्च गतिविधि' : '🔴 High Activity')}
              {pestAnalysis.activityLevel === 'Moderate' && (isMr ? '🟠 मध्यम प्रादुर्भाव' : isHi ? '🟠 मध्यम गतिविधि' : '🟠 Moderate Activity')}
              {pestAnalysis.activityLevel === 'Low' && (isMr ? '🟢 कमी प्रादुर्भाव' : isHi ? '🟢 कम गतिविधि' : '🟢 Low Activity')}
            </span>
          )}
        </div>
      </div>

      {/* Trap Type Section (Shown when a trap is detected) */}
      {pestAnalysis.isTrapImage && pestAnalysis.trapInfo && (
        <div className="pest-trap-banner">
          <div className="trap-info-left">
            <span className="trap-type-label">
              {tPest('trapType', 'TRAP TYPE', 'सापळ्याचा प्रकार', 'ट्रैप का प्रकार')}
            </span>
            <div className="trap-name-row">
              <span className="trap-symbol">
                {pestAnalysis.trapInfo.type.includes('Yellow') ? '🟡' : pestAnalysis.trapInfo.type.includes('Blue') ? '🔵' : '🪤'}
              </span>
              <strong className="trap-name">{getTrapName(pestAnalysis.trapInfo.type)}</strong>
              {pestAnalysis.trapInfo.confidence && (
                <span className="trap-confidence-pill">
                  {pestAnalysis.trapInfo.confidence}% {tPest('conf', 'Confidence', 'अचूकता', 'सटीकता')}
                </span>
              )}
            </div>
            <p className="trap-purpose-text">{pestAnalysis.trapInfo.purpose}</p>
          </div>

          <div className="trap-monitoring-notice">
            <Info size={16} />
            <div>
              <strong>{tPest('status', 'Monitoring Status: Active', 'निरीक्षण स्थिती: सक्रिय', 'निगरानी स्थिति: सक्रिय')}</strong>
              <small>{tPest('trapNotice', 'The trap module is primarily for MONITORING. Do not automatically convert trap counts into pesticide prescriptions.', 'सापळा प्रामुख्याने निरीक्षणासाठी आहे. सापळ्यातील संख्येवरून परस्पर रासायनिक फवारणी करू नका.', 'ट्रैप मुख्य रूप से निगरानी के लिए है। ट्रैप की संख्या के आधार पर सीधे कीटनाशक न छिड़कें।')}</small>
            </div>
          </div>
        </div>
      )}

      {/* Trap Uncertain Notice */}
      {pestAnalysis.isTrapImage && pestAnalysis.trapInfo?.uncertain && (
        <div className="pest-alert-box alert-warning">
          <AlertTriangle size={18} />
          <div>
            <strong>{tPest('trapUncertain', '⚠️ Trap Type Uncertain', '⚠️ सापळ्याचा प्रकार अस्पष्ट', '⚠️ ट्रैप का प्रकार अस्पष्ट')}</strong>
            <p>{tPest('clearerTrap', 'Please upload a clearer image of the complete trap.', 'कृपया संपूर्ण सापळ्याचा स्पष्ट फोटो अपलोड करा.', 'कृपया पूरे ट्रैप की स्पष्ट फोटो अपलोड करें।')}</p>
          </div>
        </div>
      )}

      {/* Low Confidence / Unknown Pest Notice (Requirement 14) */}
      {pestAnalysis.lowConfidence && (
        <div className="pest-alert-box alert-warning">
          <HelpCircle size={20} />
          <div className="alert-content">
            <strong>{tPest('unkTitle', '⚠️ Possible Pest Detected', '⚠️ संशयित कीड आढळली', '⚠️ संभावित कीट पाया गया')}</strong>
            <p>{tPest('unkDesc', 'Unable to identify the pest reliably from this image angle.', 'या फोटोवरून किडीची खात्रीशीर ओळख पटवता येत नाही.', 'इस चित्र से कीट की सटीक पहचान नहीं हो पा रही है।')}</p>
            <div className="alert-actions">
              {onUploadClearer && (
                <button className="btn btn-sm btn-secondary" onClick={onUploadClearer}>
                  <Camera size={14} /> {tPest('uploadClearer', '📷 Upload Clearer Image', '📷 स्पष्ट फोटो अपलोड करा', '📷 स्पष्ट फोटो अपलोड करें')}
                </button>
              )}
              <span className="expert-hint">👨‍🌾 {tPest('askExpert', 'Agricultural Expert Verification Recommended', 'कृषी तज्ज्ञांचा सल्ला घ्या', 'कृषि विशेषज्ञ की सलाह लें')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Pests Detected & Number of Pests Section (Requirements 4 & 5) */}
      <div className="pest-counts-container">
        <div className="counts-header">
          <span className="counts-title">
            {tPest('detectedPests', 'Detected Pests & Counts', 'आढळलेली कीड व संख्या', 'पाए गए कीट एवं संख्या')}
          </span>
          <span className="total-badge">
            {tPest('total', 'Total', 'एकूण', 'कुल')}: <strong>{pestAnalysis.totalPestCount}</strong> {tPest('insects', 'insects detected', 'कीटक आढळले', 'कीट मिले')}
          </span>
        </div>

        {pestAnalysis.countingReliable ? (
          <div className="pest-type-grid">
            {pestAnalysis.detections.map((det, idx) => (
              <div
                key={idx}
                className={`pest-count-card ${activePestTab === idx ? 'active-pest-card' : ''}`}
                onClick={() => setActivePestTab(idx)}
                role="button"
                tabIndex={0}
              >
                <div className="pest-card-top">
                  <span className="pest-type-icon">
                    {det.pestType === 'Caterpillar' ? '🐛' : det.pestType === 'Whitefly' ? '🪰' : det.pestType === 'Aphids' ? '🐞' : det.pestType === 'Thrips' ? '🦗' : '🪲'}
                  </span>
                  <div className="pest-meta">
                    <strong className="pest-name">{getPestName(det.pestType)}</strong>
                    <small className="pest-category-tag">{det.category}</small>
                  </div>
                </div>
                <div className="pest-card-count">
                  <span className="count-number">{det.count}</span>
                  <small className="count-unit">{tPest('visible', 'visible', 'दिसणारे', 'दृश्यमान')}</small>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="counting-unreliable-box">
            <Camera size={18} />
            <div>
              <strong>{tPest('countUnreliable', 'Unable to reliably count insects from this image.', 'या फोटोवरून अचूक कीड मोजणे शक्य नाही.', 'इस चित्र से कीटों की सही गिनती संभव नहीं है।')}</strong>
              <p>{tPest('countHint', 'Image resolution or lighting is low. Please upload a closer, focused shot.', 'फोटोतील प्रकाश कमी आहे. कृपया जवळून स्पष्ट फोटो अपलोड करा.', 'कृपया पास से स्पष्ट फोटो अपलोड करें।')}</p>
            </div>
            {onUploadClearer && (
              <button className="btn btn-sm btn-outline" onClick={onUploadClearer}>
                <Camera size={14} /> {tPest('uploadAgain', 'Upload Clearer Image', 'स्पष्ट फोटो घ्या', 'स्पष्ट फोटो लें')}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pest-Specific Process (Requirements 7 & 8) */}
      {selectedGuidance && (
        <div className="pest-process-section">
          <div className="process-header" onClick={() => setShowFullProcess(!showFullProcess)}>
            <div className="process-title-group">
              <Sprout size={18} className="text-green" />
              <h4>
                {tPest('guidanceFor', 'Pest Management Guide:', 'कीड व्यवस्थापन मार्गदर्शक:', 'कीट प्रबंधन गाइड:')}{' '}
                <span className="highlight-pest-name">{getPestName(selectedGuidance.pestType)}</span>
              </h4>
            </div>
            <button className="btn-icon-subtle">
              {showFullProcess ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>

          {showFullProcess && (
            <div className="process-body">
              {/* Step 1: What to check */}
              <div className="process-step-block">
                <div className="step-label-row">
                  <span className="step-badge step-check">🔍</span>
                  <strong>{tPest('check', 'What to Check', 'काय तपासावे', 'क्या जांचें')}</strong>
                </div>
                <ul className="step-points">
                  {selectedGuidance.whatToCheck.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Step 2: Immediate precaution */}
              <div className="process-step-block">
                <div className="step-label-row">
                  <span className="step-badge step-precaution">⚠️</span>
                  <strong>{tPest('precaution', 'Immediate Precautions', 'तातडीची खबरदारी', 'तत्काल सावधानी')}</strong>
                </div>
                <ul className="step-points">
                  {selectedGuidance.immediatePrecautions.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Step 3: Management Approach */}
              <div className="process-step-block">
                <div className="step-label-row">
                  <span className="step-badge step-mgmt">🛡️</span>
                  <strong>{tPest('mgmt', 'Integrated Management (IPM)', 'एकात्मिक कीड व्यवस्थापन (IPM)', 'एकीकृत कीट प्रबंधन (IPM)')}</strong>
                </div>
                <ul className="step-points">
                  {selectedGuidance.managementApproach.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Step 4: Monitoring */}
              <div className="process-step-block">
                <div className="step-label-row">
                  <span className="step-badge step-monitor">📋</span>
                  <strong>{tPest('monitor', 'Monitoring & Recheck Interval', 'निरीक्षण व फेरतपासणी', 'निगरानी एवं पुनः परीक्षण')}</strong>
                </div>
                <ul className="step-points">
                  {selectedGuidance.monitoring.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Step 5: Expert Help */}
              <div className="process-step-block expert-block">
                <div className="step-label-row">
                  <span className="step-badge step-expert">👨‍🌾</span>
                  <strong>{tPest('expert', 'Expert Help if Required', 'कृषी तज्ज्ञांची मदत', 'कृषि विशेषज्ञ सलाह')}</strong>
                </div>
                <p className="expert-text">{selectedGuidance.expertReferral}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer / Safety Disclaimer */}
      <div className="pest-card-footer">
        <small>
          🌱 {tPest(
            'disclaimer',
            'AgriNex AI adheres to verified IPM standards. No uncertified chemical pesticide doses are generated automatically.',
            'AgriNex AI प्रमाणित एकात्मिक कीड नियंत्रण (IPM) तत्त्वांचे पालन करते. मनमानी रासायनिक औषधांची शिफारस केली जात नाही.',
            'AgriNex AI प्रमाणित एकीकृत कीट नियंत्रण (IPM) नियमों का पालन करता है। अनावश्यक रासायनिक दवाओं की स्वचालित सिफारिश नहीं की जाती है।'
          )}
        </small>
      </div>
    </div>
  );
}
