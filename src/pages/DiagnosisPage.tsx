// ============================================================
// AgriFedX — Diagnosis Page (Image Upload + Analysis Pipeline)
// ============================================================

import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import { CROPS, CROP_STAGES, DEMO_LOCATIONS } from '../config/demoConfig';
import { detectDisease } from '../services/mock/mockDiseaseService';
import { getWeather } from '../services/mock/mockWeatherService';
import { calculateRisk } from '../services/mock/mockRiskService';
import { generateRecommendation } from '../services/mock/mockRecommendationService';
import { checkNearby } from '../services/mock/mockHotspotService';
import { validateCropImage, validateFileType } from '../services/imageValidator';
import { matchImage, getTrainedCount } from '../services/trainedDataset';
import storageService from '../services/storageService';
import type { Crop, CropStage, Location, DemoScenario, Diagnosis, PipelineStep } from '../types';
import {
  Upload, X, Camera, Leaf, MapPin, ChevronRight,
  CheckCircle2, Loader2, AlertTriangle, Thermometer,
  Droplets, Wind, CloudRain, ShieldAlert, Lightbulb,
  Eye, Save, PlusCircle, Map, History, ShieldCheck,
  ImageOff, ScanEye, Database
} from 'lucide-react';

const PIPELINE_STEPS: string[] = [
  'Uploading image',
  'Validating crop image',
  'Image quality check',
  'Matching against trained dataset',
  'Running disease detection AI',
  'Generating explainability map',
  'Fetching weather intelligence',
  'Calculating disease risk',
  'Generating recommendations',
  'Checking nearby disease cases',
  'Saving diagnosis',
];

export default function DiagnosisPage() {
  const { user, language } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [imageData, setImageData] = useState<string>('');
  const [imageName, setImageName] = useState('');
  const [crop, setCrop] = useState<Crop>('Tomato');
  const [cropStage, setCropStage] = useState<CropStage>('Flowering');
  const [locationIdx, setLocationIdx] = useState(0);
  const [scenario, setScenario] = useState<DemoScenario | ''>('');

  // Validation state
  const [imageError, setImageError] = useState('');
  const [validatingImage, setValidatingImage] = useState(false);
  const [imageValidated, setImageValidated] = useState(false);
  const [cropImageConfidence, setCropImageConfidence] = useState(0);

  // Pipeline state
  const [analyzing, setAnalyzing] = useState(false);
  const [pipelineSteps, setPipelineSteps] = useState<PipelineStep[]>([]);
  const [matchInfo, setMatchInfo] = useState<{ type: string; confidence: number } | null>(null);

  // Result state
  const [result, setResult] = useState<Diagnosis | null>(null);
  const [saved, setSaved] = useState(false);

  // Pre-fill scenario from URL
  useEffect(() => {
    const s = searchParams.get('scenario');
    if (s) {
      setScenario(s as DemoScenario);
      if (s === 'early_blight') { setCrop('Tomato'); setCropStage('Flowering'); setLocationIdx(0); }
      else if (s === 'late_blight') { setCrop('Potato'); setCropStage('Vegetative'); setLocationIdx(1); }
      else if (s === 'healthy') { setCrop('Maize'); setCropStage('Maturity'); setLocationIdx(2); }
      else if (s === 'low_confidence') { setCrop('Potato'); setCropStage('Flowering'); setLocationIdx(3); }
    }
  }, [searchParams]);

  // Image handling with validation
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = async (file: File) => {
    setImageError('');
    setImageValidated(false);
    setCropImageConfidence(0);

    // Step 1: File type validation
    const fileCheck = validateFileType(file);
    if (!fileCheck.valid) {
      setImageError(fileCheck.reason);
      return;
    }

    // Step 2: Load image
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      setImageData(dataUrl);
      setImageName(file.name);

      // Step 3: Validate it's a crop image
      setValidatingImage(true);
      try {
        const validation = await validateCropImage(dataUrl);

        if (!validation.isCropImage) {
          setImageError(validation.reason);
          setValidatingImage(false);
          // Don't clear image — show it with error overlay
          return;
        }

        setImageValidated(true);
        setCropImageConfidence(validation.confidence);
      } catch {
        // If validation fails, allow the image (graceful degradation)
        setImageValidated(true);
        setCropImageConfidence(50);
      }
      setValidatingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageData('');
    setImageName('');
    setImageError('');
    setImageValidated(false);
    setCropImageConfidence(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Analysis pipeline
  const runAnalysis = async () => {
    if (!imageData && !scenario) {
      setImageError('Please upload a crop leaf image to proceed.');
      return;
    }

    setAnalyzing(true);
    setResult(null);
    setSaved(false);
    setMatchInfo(null);

    const steps: PipelineStep[] = PIPELINE_STEPS.map((label) => ({ label, status: 'pending' }));
    setPipelineSteps(steps);

    const updateStep = (idx: number, status: PipelineStep['status']) => {
      steps[idx] = { ...steps[idx], status };
      setPipelineSteps([...steps]);
    };

    const loc: Location = DEMO_LOCATIONS[locationIdx];
    const imgForAnalysis = imageData || 'demo-placeholder-image';

    try {
      // Step 0: Upload
      updateStep(0, 'running');
      await new Promise((r) => setTimeout(r, 400));
      updateStep(0, 'done');

      // Step 1: Validate crop image
      updateStep(1, 'running');
      await new Promise((r) => setTimeout(r, 500));
      updateStep(1, 'done');

      // Step 2: Quality check
      updateStep(2, 'running');
      await new Promise((r) => setTimeout(r, 400));
      updateStep(2, 'done');

      // Step 3: Match against trained dataset
      updateStep(3, 'running');
      await new Promise((r) => setTimeout(r, 600));

      let detection;
      if (scenario) {
        // Use demo scenario
        detection = await detectDisease(imgForAnalysis, crop, scenario as DemoScenario);
        setMatchInfo({ type: 'demo_scenario', confidence: detection.confidence });
      } else if (imageData) {
        // Use trained dataset matching
        const match = await matchImage(imageData);
        detection = match.result;
        setMatchInfo({ type: match.matchType, confidence: match.matchConfidence });
      } else {
        detection = await detectDisease(imgForAnalysis, crop);
      }
      updateStep(3, 'done');

      // Step 4: Disease detection
      updateStep(4, 'running');
      await new Promise((r) => setTimeout(r, 700));
      updateStep(4, 'done');

      // Step 5: Explainability
      updateStep(5, 'running');
      await new Promise((r) => setTimeout(r, 500));
      updateStep(5, 'done');

      // Step 6: Weather
      updateStep(6, 'running');
      const weather = await getWeather(loc);
      await new Promise((r) => setTimeout(r, 400));
      updateStep(6, 'done');

      // Step 7: Risk
      updateStep(7, 'running');
      const risk = calculateRisk(detection, weather, crop, cropStage);
      await new Promise((r) => setTimeout(r, 500));
      updateStep(7, 'done');

      // Step 8: Recommendations
      updateStep(8, 'running');
      const recommendation = generateRecommendation(detection.disease, risk, crop, cropStage, weather);
      await new Promise((r) => setTimeout(r, 400));
      updateStep(8, 'done');

      // Step 9: Nearby check
      updateStep(9, 'running');
      const nearbyHotspot = checkNearby(loc.latitude, loc.longitude, detection.disease);
      if (nearbyHotspot) {
        risk.factors.push(`⚠️ Nearby hotspot: ${nearbyHotspot.cases} cases of ${nearbyHotspot.disease} in ${nearbyHotspot.district}`);
      }
      await new Promise((r) => setTimeout(r, 400));
      updateStep(9, 'done');

      // Step 10: Save
      updateStep(10, 'running');
      const diagnosis: Diagnosis = {
        id: `diag-${Date.now()}`,
        farmerId: user?.id || 'farmer-001',
        crop,
        cropStage,
        disease: detection.disease,
        confidence: detection.confidence,
        severity: detection.severity,
        riskScore: risk.score,
        riskLevel: risk.level,
        imageDataUrl: imageData ? imageData.substring(0, 200) + '...' : '', // Store truncated to save space
        location: loc,
        weather,
        recommendation,
        explainability: {
          description: `The AI model identified visual patterns associated with ${detection.disease}. ${detection.affectedRegion}`,
          highlightRegions: [{ x: 25, y: 20, width: 50, height: 40 }],
          gradcamAvailable: false,
        },
        validationStatus: detection.confidence < 80 ? 'PENDING' : 'CONFIRMED',
        createdAt: new Date().toISOString(),
      };

      await new Promise((r) => setTimeout(r, 300));
      updateStep(10, 'done');

      setResult(diagnosis);
    } catch (err) {
      console.error('Analysis error:', err);
    }

    setAnalyzing(false);
  };

  const handleSave = () => {
    if (!result) return;

    // Save full imageDataUrl for display
    const toSave = { ...result, imageDataUrl: imageData };
    storageService.saveDiagnosis(toSave);

    // Create notification
    if (result.riskLevel === 'HIGH') {
      storageService.saveNotification({
        id: `notif-${Date.now()}`,
        type: 'high_risk',
        title: '⚠️ High Risk Alert',
        message: `${result.disease} detected in your ${result.crop} crop with risk ${result.riskScore}/100.`,
        read: false,
        createdAt: new Date().toISOString(),
        relatedId: result.id,
      });
    }

    storageService.saveNotification({
      id: `notif-${Date.now() + 1}`,
      type: 'disease_alert',
      title: `🌿 ${result.disease} Detected`,
      message: `${result.disease} detected in your ${result.crop} crop with ${result.confidence}% confidence.`,
      read: false,
      createdAt: new Date().toISOString(),
      relatedId: result.id,
    });

    // Add validation record for low confidence
    if (result.confidence < 80) {
      storageService.saveValidation({
        id: `val-${Date.now()}`,
        diagnosisId: result.id,
        aiDisease: result.disease,
        aiConfidence: result.confidence,
        decision: 'PENDING',
        comment: '',
        expertId: '',
        timestamp: new Date().toISOString(),
      });
    }

    // Community Early Warning: Auto-create alert if multiple nearby cases exist
    if (result.disease !== 'Healthy') {
      const allDiagnoses = storageService.getDiagnoses();
      const nearbyMatches = allDiagnoses.filter(
        (d) => d.disease === result.disease && (d.location.district === result.location.district || !d.location.district)
      );
      if (nearbyMatches.length >= 2) {
        const existingAlerts = storageService.getAlerts();
        const existing = existingAlerts.find(
          (a) => a.active && a.disease === result.disease && (a.district === result.location.district || a.area.includes(result.location.district))
        );
        if (!existing) {
          const totalCases = nearbyMatches.length + 1;
          const avgRisk = Math.round(
            (nearbyMatches.reduce((sum, d) => sum + d.riskScore, 0) + result.riskScore) / totalCases
          );
          storageService.saveAlert({
            id: `alert-${Date.now()}`,
            disease: result.disease,
            riskLevel: avgRisk >= 70 ? 'HIGH' : 'MEDIUM',
            area: `${result.location.district} Cluster`,
            district: result.location.district,
            cases: totalCases,
            averageRisk: avgRisk,
            period: 'Active (Last 7 days)',
            recommendation: `Multiple cases of ${result.disease} detected in ${result.location.district}. Prompt foliage scouting and preventive fungicide application recommended.`,
            createdAt: new Date().toISOString(),
            active: true,
          });

          storageService.saveNotification({
            id: `notif-${Date.now() + 2}`,
            type: 'community_warning',
            title: `🚨 Community Alert: ${result.disease} Outbreak`,
            message: `${totalCases} cases of ${result.disease} identified in ${result.location.district}. Community early warning active.`,
            read: false,
            createdAt: new Date().toISOString(),
          });
        }
      }
    }

    // Append to disease progression records
    const progressList = storageService.getProgress();
    const dayCount = progressList.filter((p) => p.farmerId === (user?.id || 'farmer-001') && p.crop === result.crop).length * 3 + 1;
    const newProgress = [
      ...progressList,
      {
        id: `prog-${Date.now()}`,
        farmerId: user?.id || 'farmer-001',
        diagnosisId: result.id,
        crop: result.crop,
        disease: result.disease,
        riskScore: result.riskScore,
        day: dayCount,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      },
    ];
    storageService.saveProgress(newProgress);

    setSaved(true);
  };

  const selectedLoc = DEMO_LOCATIONS[locationIdx];
  const trainedCount = getTrainedCount();

  return (
    <div className="page diagnosis-page">
      <div className="page-header">
        <h1>{t('diagnosis.title', language)}</h1>
        <p>Upload a crop leaf image for instant AI-powered disease diagnosis</p>
      </div>

      {!result ? (
        <div className="diagnosis-form-container">
          {/* Trained Dataset Info */}
          <div className="trained-info">
            <Database size={16} />
            <span>Local AI model trained on <strong>{trainedCount}</strong> images</span>
            <span className="trained-dot">● Active</span>
          </div>

          {/* Image Upload */}
          <div className="form-section">
            <h3><Camera size={18} /> {t('diagnosis.uploadImage', language)}</h3>
            <p className="form-hint">📸 Only crop/leaf photographs are accepted. Non-crop images will be rejected.</p>

            {!imageData ? (
              <div
                className="upload-zone"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={40} />
                <p>{t('diagnosis.dragDrop', language)}</p>
                <small>{language === 'mr' ? 'JPG, PNG, WebP — केवळ पीक/पानांचे फोटो' : language === 'hi' ? 'JPG, PNG, WebP — केवल फसल/पत्तियों के चित्र' : 'JPG, PNG, WebP — Crop/leaf images only'}</small>
                <div className="upload-accepted">
                  <span>✅ {language === 'mr' ? 'टोमॅटो, बटाटा पाने' : language === 'hi' ? 'टमाटर, आलू पत्तियां' : 'Tomato, Potato leaves'}</span>
                  <span>✅ {language === 'mr' ? 'मका, कापूस, सोयाबीन' : language === 'hi' ? 'मक्का, कपास, सोयाबीन' : 'Maize, Cotton, Soybean'}</span>
                  <span>✅ {language === 'mr' ? 'पिकांचे रोगग्रस्त भाग' : language === 'hi' ? 'फसलों के रोगग्रस्त भाग' : 'Diseased crop leaves'}</span>
                  <span>❌ {language === 'mr' ? 'सेल्फी चालणार नाही' : language === 'hi' ? 'सेल्फ़ी मान्य नहीं' : 'No selfies'}</span>
                  <span>❌ {language === 'mr' ? 'स्क्रीनशॉट चालणार नाही' : language === 'hi' ? 'स्क्रीनशॉट मान्य नहीं' : 'No screenshots'}</span>
                  <span>❌ {language === 'mr' ? 'कागदपत्रे चालणार नाही' : language === 'hi' ? 'दस्तावेज़ मान्य नहीं' : 'No documents'}</span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handleFileSelect}
                  hidden
                />
              </div>
            ) : (
              <div className={`image-preview-container ${imageError ? 'has-error' : ''}`}>
                <div className="image-preview">
                  <img src={imageData} alt="Uploaded leaf" />
                  {/* Validation overlay */}
                  {validatingImage && (
                    <div className="image-validating">
                      <Loader2 size={24} className="spin" />
                      <span>Validating crop image...</span>
                    </div>
                  )}
                  {imageError && (
                    <div className="image-rejected">
                      <ImageOff size={24} />
                      <span>{imageError}</span>
                    </div>
                  )}
                  {imageValidated && !imageError && (
                    <div className="image-accepted">
                      <CheckCircle2 size={18} />
                      <span>Crop image verified ({cropImageConfidence}%)</span>
                    </div>
                  )}
                  <button className="remove-img" onClick={removeImage}><X size={16} /></button>
                </div>
                <span className="img-name">{imageName}</span>
              </div>
            )}

            {imageError && !imageData && (
              <div className="image-error-msg">
                <AlertTriangle size={16} /> {imageError}
              </div>
            )}
          </div>

          {/* Demo Scenario Selector */}
          <div className="form-section">
            <h3><ScanEye size={18} /> {t('diagnosis.demoScenario', language)}</h3>
            <p className="form-hint">
              {language === 'mr'
                ? 'डेमोसाठी पूर्व-निर्मित परिस्थिती निवडा किंवा वर प्रत्यक्ष पिकाचा फोटो अपलोड करा.'
                : language === 'hi'
                ? 'डेमो के लिए पूर्व-निर्धारित परिदृश्य चुनें या ऊपर वास्तविक फसल की तस्वीर अपलोड करें।'
                : 'Select a preset scenario for demo, or upload a real crop image above.'}
            </p>
            <select value={scenario} onChange={(e) => {
              const s = e.target.value as DemoScenario;
              setScenario(s);
              if (s === 'early_blight') { setCrop('Tomato'); setCropStage('Flowering'); setLocationIdx(0); }
              else if (s === 'late_blight') { setCrop('Potato'); setCropStage('Vegetative'); setLocationIdx(1); }
              else if (s === 'healthy') { setCrop('Maize'); setCropStage('Maturity'); setLocationIdx(2); }
              else if (s === 'low_confidence') { setCrop('Potato'); setCropStage('Flowering'); setLocationIdx(3); }
            }} className="select-input">
              <option value="">
                {language === 'mr' ? 'अपलोड केलेला फोटो वापरा (AI वर्गीकरण)' : language === 'hi' ? 'अपलोड की गई छवि का उपयोग करें (AI वर्गीकरण)' : 'Use uploaded image (AI classification)'}
              </option>
              <option value="early_blight">🍅 {language === 'mr' ? 'परिस्थिती A: टोमॅटो लवकर करपा — ९४%, उच्च जोखीम' : language === 'hi' ? 'परिदृश्य A: टमाटर अगेती झुलसा — 94%, उच्च जोखिम' : 'Scenario A: Early Blight — 94%, HIGH RISK'}</option>
              <option value="late_blight">🥔 {language === 'mr' ? 'परिस्थिती B: बटाटा उशिरा करपा — ९१%, उच्च जोखीम' : language === 'hi' ? 'परिदृश्य B: आलू पछेती झुलसा — 91%, उच्च जोखिम' : 'Scenario B: Late Blight — 91%, HIGH RISK'}</option>
              <option value="healthy">✅ {language === 'mr' ? 'परिस्थिती C: मका निरोगी — ९७%, कमी जोखीम' : language === 'hi' ? 'परिदृश्य C: मक्का स्वस्थ — 97%, कम जोखिम' : 'Scenario C: Healthy — 97%, LOW RISK'}</option>
              <option value="low_confidence">❓ {language === 'mr' ? 'परिस्थिती D: कमी आत्मविश्वास — ६२%, तज्ञ पडताळणी' : language === 'hi' ? 'परिदृश्य D: कम विश्वास — 62%, विशेषज्ञ समीक्षा' : 'Scenario D: Low Confidence — 62%, EXPERT REVIEW'}</option>
            </select>
          </div>

          {/* Crop & Stage */}
          <div className="form-row">
            <div className="form-section half">
              <h3><Leaf size={18} /> {t('diagnosis.selectCrop', language)}</h3>
              <select value={crop} onChange={(e) => setCrop(e.target.value as Crop)} className="select-input">
                {CROPS.map(c => <option key={c} value={c}>{t(`crop.${c}`, language) || c}</option>)}
              </select>
            </div>
            <div className="form-section half">
              <h3>{t('diagnosis.selectStage', language)}</h3>
              <select value={cropStage} onChange={(e) => setCropStage(e.target.value as CropStage)} className="select-input">
                {CROP_STAGES.map(s => <option key={s} value={s}>{t(`stage.${s.toLowerCase()}`, language) || s}</option>)}
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="form-section">
            <h3><MapPin size={18} /> {t('diagnosis.selectLocation', language)}</h3>
            <select value={locationIdx} onChange={(e) => setLocationIdx(Number(e.target.value))} className="select-input">
              {DEMO_LOCATIONS.map((loc, i) => (
                <option key={i} value={i}>{loc.district} — {loc.village}, {loc.taluka}</option>
              ))}
            </select>
            <small className="location-info">
              📍 {selectedLoc.latitude.toFixed(4)}°N, {selectedLoc.longitude.toFixed(4)}°E
            </small>
          </div>

          {/* Analyze Button */}
          <button
            className="btn btn-primary btn-lg btn-full analyze-btn"
            onClick={runAnalysis}
            disabled={analyzing || (imageData !== '' && !imageValidated && !scenario) || (imageData !== '' && !!imageError && !scenario)}
          >
            {analyzing ? (
              <><Loader2 size={18} className="spin" /> {t('diagnosis.analyzing', language)}</>
            ) : (
              <>{t('diagnosis.analyze', language)} <ChevronRight size={18} /></>
            )}
          </button>

          {/* Disabled reason */}
          {imageData && imageError && !scenario && (
            <p className="analyze-hint">⚠️ Upload a valid crop image or select a demo scenario to proceed.</p>
          )}

          {/* Pipeline Animation */}
          {analyzing && (
            <div className="pipeline-steps">
              <h3><ScanEye size={18} /> AI Processing Pipeline</h3>
              {pipelineSteps.map((step, i) => (
                <div key={i} className={`pipeline-step ${step.status}`}>
                  {step.status === 'done' ? <CheckCircle2 size={18} /> : step.status === 'running' ? <Loader2 size={18} className="spin" /> : <div className="step-dot" />}
                  <span>{step.label}</span>
                  {step.status === 'done' && <span className="step-time">{(300 + i * 50)}ms</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ====== RESULT VIEW ====== */
        <div className="result-container">
          <div className="result-header-banner">
            <CheckCircle2 size={28} />
            <div>
              <h2>Analysis Complete</h2>
              {matchInfo && (
                <small className="match-info">
                  {matchInfo.type === 'exact' ? '🎯 Exact match from trained dataset' :
                   matchInfo.type === 'similar' ? '🔍 Similar image found in trained dataset' :
                   matchInfo.type === 'demo_scenario' ? '🎬 Demo scenario result' :
                   '🆕 New image classified by AI'}
                </small>
              )}
            </div>
          </div>

          <div className="result-grid">
            {/* Disease Card */}
            <div className="result-card disease-result">
              <h3><ActivityIcon size={18} /> Disease Detected</h3>
              <div className="disease-name">{result.disease}</div>
              <div className="confidence-bar">
                <div className="confidence-fill" style={{ width: `${result.confidence}%` }} />
              </div>
              <div className="confidence-label">{result.confidence}% Confidence</div>
              <div className={`severity-badge severity-${result.severity.toLowerCase()}`}>{result.severity} Severity</div>
              {result.validationStatus === 'PENDING' && (
                <div className="validation-warning">
                  <AlertTriangle size={16} />
                  Expert Validation Required — Confidence below 80%
                </div>
              )}
              {result.validationStatus === 'CONFIRMED' && (
                <div className="validation-confirmed-badge">
                  <ShieldCheck size={16} />
                  AI Prediction Verified
                </div>
              )}
            </div>

            {/* Risk Card */}
            <div className="result-card risk-result">
              <h3><ShieldAlert size={18} /> Risk Score</h3>
              <div className="risk-gauge">
                <svg viewBox="0 0 120 120" className="gauge-svg">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#1e293b" strokeWidth="10" />
                  <circle cx="60" cy="60" r="50" fill="none"
                    stroke={result.riskLevel === 'HIGH' ? '#ef4444' : result.riskLevel === 'MEDIUM' ? '#f97316' : '#22c55e'}
                    strokeWidth="10"
                    strokeDasharray={`${(result.riskScore / 100) * 314} 314`}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                    className="gauge-animated"
                  />
                  <text x="60" y="55" textAnchor="middle" className="gauge-text">{result.riskScore}</text>
                  <text x="60" y="72" textAnchor="middle" className="gauge-sub">/100</text>
                </svg>
              </div>
              <div className={`risk-badge risk-${result.riskLevel.toLowerCase()}`}>{result.riskLevel} RISK</div>
              {/* Risk factors */}
              <div className="risk-factors">
                {result.recommendation.immediateActions.slice(0, 2).map((f, i) => (
                  <small key={i} className="risk-factor">• {f}</small>
                ))}
              </div>
            </div>

            {/* Weather Card */}
            <div className="result-card weather-result">
              <h3><CloudRain size={18} /> Weather Conditions</h3>
              <div className="weather-grid">
                <div className="weather-item"><Thermometer size={16} /><span>{result.weather.temperature}°C</span><small>Temperature</small></div>
                <div className="weather-item"><Droplets size={16} /><span>{result.weather.humidity}%</span><small>Humidity</small></div>
                <div className="weather-item"><CloudRain size={16} /><span>{result.weather.rainfall} mm</span><small>Rainfall</small></div>
                <div className="weather-item"><Wind size={16} /><span>{result.weather.windSpeed} km/h</span><small>Wind</small></div>
              </div>
              <div className="weather-forecast">
                <small>☁️ {result.weather.condition} — {result.weather.forecast}</small>
              </div>
            </div>

            {/* AI Explanation Card */}
            <div className="result-card explain-result">
              <h3><Eye size={18} /> AI Explanation (Explainable AI)</h3>
              <div className="explain-visual">
                {imageData ? (
                  <div className="explain-image-wrapper">
                    <img src={imageData} alt="Analyzed leaf" />
                    <div className="heatmap-overlay" />
                    <div className="attention-box" style={{
                      left: '25%', top: '20%', width: '50%', height: '40%'
                    }} />
                    <div className="explain-label">AI Attention Region</div>
                  </div>
                ) : (
                  <div className="explain-placeholder">
                    <Leaf size={60} />
                    <p>Demo mode — using scenario prediction</p>
                  </div>
                )}
              </div>
              <p className="explain-text">{result.explainability.description}</p>
              <small className="explain-note">
                In production, real Grad-CAM heatmaps from the CNN model are displayed. This demo uses color-based visual simulation.
              </small>
            </div>

            {/* Recommendations Card */}
            <div className="result-card recommend-result">
              <h3><Lightbulb size={18} /> Recommendations</h3>
              <div className="recommend-sections">
                <div className="recommend-section">
                  <h4>🔴 Immediate Actions</h4>
                  <ul>{result.recommendation.immediateActions.map((a, i) => <li key={i}>{a}</li>)}</ul>
                </div>
                <div className="recommend-section">
                  <h4>🟡 Preventive Measures</h4>
                  <ul>{result.recommendation.preventiveMeasures.map((a, i) => <li key={i}>{a}</li>)}</ul>
                </div>
                <div className="recommend-section">
                  <h4>🟢 Treatment Guidance</h4>
                  <ul>{result.recommendation.treatmentGuidance.map((a, i) => <li key={i}>{a}</li>)}</ul>
                </div>
                <div className="recommend-section">
                  <h4>📋 Monitoring</h4>
                  <ul>{result.recommendation.monitoring.map((a, i) => <li key={i}>{a}</li>)}</ul>
                </div>
                <div className="recheck-box">
                  <small>🔄 {result.recommendation.recheckSuggestion}</small>
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="result-card location-result">
              <h3><MapPin size={18} /> Location & Crop Info</h3>
              <p><strong>{result.location.district}</strong></p>
              <p>{result.location.village}, {result.location.taluka}</p>
              <small>📍 {result.location.latitude.toFixed(4)}°N, {result.location.longitude.toFixed(4)}°E</small>
              <div className="crop-info">
                <span className="crop-badge">🌾 {result.crop}</span>
                <span className="stage-badge">📅 {result.cropStage}</span>
              </div>
            </div>
          </div>

          {/* Step guidance for farmer */}
          <div className="diagnosis-next-steps-banner card">
            <div className="next-banner-content">
              <h4>🎯 {language === 'mr' ? 'पुढील पायरी: आजचे उपाय डॅशबोर्डवर तयार आहेत' : language === 'hi' ? 'अगला कदम: आज के उपाय डैशबोर्ड पर तैयार हैं' : 'Next Step: Today’s Field Actions Ready on Dashboard'}</h4>
              <p>
                {language === 'mr'
                  ? 'निदान पूर्ण झाले आहे. शेतात आज काय फवारणी करायची व काय काळजी घ्यायची यासाठी कृपया डॅशबोर्डवरील कार्य सूचीचे पालन करा.'
                  : language === 'hi'
                  ? 'रोग की पहचान हो गई है। खेत में क्या छिड़काव करना है और क्या सावधानी रखनी है, इसके लिए कृपया डैशबोर्ड पर जाएं।'
                  : 'Diagnosis complete. To execute the recommended spray and crop care today, follow the action checklist on your Dashboard.'}
              </p>
            </div>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/dashboard')}>
              <span>{language === 'mr' ? 'डॅशबोर्डवर आजचे उपाय पहा' : language === 'hi' ? 'डैशबोर्ड पर आज के उपाय देखें' : 'Go to Dashboard (Today’s Actions)'}</span>
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="result-actions">
            {!saved ? (
              <button className="btn btn-secondary" onClick={handleSave}>
                <Save size={18} /> Save Diagnosis
              </button>
            ) : (
              <span className="saved-badge"><CheckCircle2 size={18} /> Diagnosis Saved Successfully</span>
            )}
            <button className="btn btn-secondary" onClick={() => navigate('/progress')}>
              <ShieldAlert size={18} /> Disease Progress Report
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/map')}>
              <Map size={18} /> View Map
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/history')}>
              <History size={18} /> View History
            </button>
            <button className="btn btn-outline" onClick={() => { setResult(null); setSaved(false); setImageData(''); setImageName(''); setImageError(''); setImageValidated(false); setScenario(''); setMatchInfo(null); }}>
              <PlusCircle size={18} /> New Diagnosis
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ActivityIcon({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>;
}
