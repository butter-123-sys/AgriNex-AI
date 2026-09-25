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
import pestTrapService from '../services/pestTrapService';
import PestDashboardCard from '../components/PestDashboardCard';
import classifyCropImage, { type UnifiedClassificationResult } from '../services/unifiedClassifier';
import ConditionalDiagnosisResult from '../components/ConditionalDiagnosisResult';
import storageService from '../services/storageService';
import type { Crop, CropStage, Location, DemoScenario, Diagnosis, PipelineStep } from '../types';
import {
  Upload, X, Camera, Leaf, MapPin, ChevronRight,
  CheckCircle2, Loader2, AlertTriangle, Thermometer,
  Droplets, Wind, CloudRain, ShieldAlert, Lightbulb,
  Eye, Save, PlusCircle, Map, History, ShieldCheck,
  ImageOff, ScanEye, Database, Activity, Bug
} from 'lucide-react';

const PIPELINE_STEPS: string[] = [
  'Uploading image',
  'Validating crop or trap image',
  'Image quality & color check',
  'Matching against trained dataset',
  'Running disease detection AI',
  'Scanning for pests & agricultural trap patterns',
  'Generating explainability map',
  'Fetching weather intelligence',
  'Calculating disease & pest risk',
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
  const [unifiedResult, setUnifiedResult] = useState<UnifiedClassificationResult | null>(null);
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
      else if (s === 'yellow_trap_whitefly') { setCrop('Tomato'); setCropStage('Flowering'); setLocationIdx(0); }
      else if (s === 'blue_trap_thrips') { setCrop('Cotton'); setCropStage('Vegetative'); setLocationIdx(1); }
      else if (s === 'caterpillar_leaf') { setCrop('Tomato'); setCropStage('Vegetative'); setLocationIdx(0); }
      else if (s === 'healthy_caterpillar') { setCrop('Tomato'); setCropStage('Vegetative'); setLocationIdx(0); }
      else if (s === 'leaf_damage_no_pest') { setCrop('Tomato'); setCropStage('Flowering'); setLocationIdx(0); }
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
    setUnifiedResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const resetDiagnosis = () => {
    setResult(null);
    setUnifiedResult(null);
    setSaved(false);
    setImageData('');
    setImageName('');
    setImageError('');
    setImageValidated(false);
    setCropImageConfidence(0);
    setScenario('');
    setMatchInfo(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleExpertRequest = () => {
    if (result) {
      storageService.saveValidation({
        id: `val-${Date.now()}`,
        diagnosisId: result.id,
        aiDisease: unifiedResult?.name || result.disease,
        aiConfidence: Math.round((unifiedResult?.confidence || 0.5) * 100),
        decision: 'PENDING',
        comment: 'Farmer requested expert review due to low confidence or high severity.',
        expertId: '',
        timestamp: new Date().toISOString(),
      });
    }
    alert(
      language === 'mr'
        ? 'कृषी तज्ज्ञांकडे पडताळणी विनंती पाठवली आहे. लवकरच मार्गदर्शन मिळेल.'
        : language === 'hi'
        ? 'कृषि विशेषज्ञ के पास सत्यापन अनुरोध भेज दिया गया है। जल्द ही मार्गदर्शन मिलेगा।'
        : 'Request submitted to agricultural expert extension. You will receive guidance shortly.'
    );
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
      await new Promise((r) => setTimeout(r, 600));
      updateStep(4, 'done');

      // Step 5: Pest & Trap Intelligence Analysis
      updateStep(5, 'running');
      const pestAnalysis = await pestTrapService.analyzePestAndTrap(
        imgForAnalysis,
        crop,
        cropStage,
        scenario || undefined,
        imageName
      );
      await new Promise((r) => setTimeout(r, 500));
      updateStep(5, 'done');

      // Step 6: Explainability
      updateStep(6, 'running');
      await new Promise((r) => setTimeout(r, 400));
      updateStep(6, 'done');

      // Step 7: Weather
      updateStep(7, 'running');
      const weather = await getWeather(loc);
      await new Promise((r) => setTimeout(r, 400));
      updateStep(7, 'done');

      // Step 8: Risk
      updateStep(8, 'running');
      const risk = calculateRisk(detection, weather, crop, cropStage);
      if (pestAnalysis.hasPest && pestAnalysis.activityLevel === 'High') {
        risk.factors.push(`🐛 Elevated pest population: ${pestAnalysis.totalPestCount} insects detected`);
      }
      await new Promise((r) => setTimeout(r, 400));
      updateStep(8, 'done');

      // Step 9: Recommendations
      updateStep(9, 'running');
      const recommendation = generateRecommendation(detection.disease, risk, crop, cropStage, weather);
      if (pestAnalysis.hasPest && pestAnalysis.actionPoints.length > 0) {
        recommendation.immediateActions.unshift(`🐛 Pest Alert: ${pestAnalysis.actionPoints[0]}`);
      }
      await new Promise((r) => setTimeout(r, 400));
      updateStep(9, 'done');

      // Step 10: Nearby check
      updateStep(10, 'running');
      const nearbyHotspot = checkNearby(loc.latitude, loc.longitude, detection.disease);
      if (nearbyHotspot) {
        risk.factors.push(`⚠️ Nearby hotspot: ${nearbyHotspot.cases} cases of ${nearbyHotspot.disease} in ${nearbyHotspot.district}`);
      }
      await new Promise((r) => setTimeout(r, 400));
      updateStep(10, 'done');

      // Step 11: Save Diagnosis & Run Unified Conditional Classification
      updateStep(11, 'running');

      const unified = await classifyCropImage(
        imgForAnalysis,
        crop,
        cropStage,
        imageName,
        scenario || undefined
      );
      setUnifiedResult(unified);

      const resolvedDisease =
        unified.classification === 'pest'
          ? `${unified.name} Infestation`
          : unified.classification === 'healthy'
          ? 'Healthy'
          : unified.name || detection.disease;

      const diagnosis: Diagnosis = {
        id: `diag-${Date.now()}`,
        farmerId: user?.id || 'farmer-001',
        crop,
        cropStage,
        disease: resolvedDisease,
        confidence: Math.round(unified.confidence * 100),
        severity: unified.severity,
        riskScore: risk.score,
        riskLevel: risk.level,
        imageDataUrl: imageData ? imageData.substring(0, 200) + '...' : '', // Store truncated to save space
        location: loc,
        weather,
        recommendation: {
          ...recommendation,
          immediateActions: unified.recommendations.slice(0, 4),
        },
        explainability: {
          description: unified.explanation,
          highlightRegions: [{ x: 25, y: 20, width: 50, height: 40 }],
          gradcamAvailable: false,
        },
        validationStatus: unified.confidence < 0.8 ? 'PENDING' : 'CONFIRMED',
        createdAt: new Date().toISOString(),
        pestAnalysis,
      };

      await new Promise((r) => setTimeout(r, 300));
      updateStep(11, 'done');

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
        <p>
          {language === 'mr'
            ? 'पीक, पान किंवा सापळ्याचा फोटो अपलोड करा — AI आपोआप रोग किंवा किडीची अचूक तपासणी करून योग्य डॅशबोर्ड दाखवेल'
            : language === 'hi'
            ? 'फसल, पत्ती या ट्रैप की तस्वीर अपलोड करें — AI स्वचालित रूप से रोग या कीट की पहचान कर उपयुक्त परिणाम देगा'
            : 'Upload any crop leaf or trap photo — AI automatically inspects and routes to Pest or Disease Dashboard'}
        </p>
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
            <p className="form-hint">
              🤖 {language === 'mr'
                ? 'स्वयंचलित तपासणी: तुम्हाला रोग किंवा कीड निवडण्याची गरज नाही. सिस्टम स्वतः फोटो तपासून अचूक डॅशबोर्ड देईल.'
                : language === 'hi'
                ? 'स्वचालित पहचान: आपको रोग या कीट चुनने की आवश्यकता नहीं है। सिस्टम अपने आप फोटो जांच कर सही डैशबोर्ड देगा।'
                : 'Automated AI: You don’t need to choose pest or disease. The system automatically inspects your image and displays the right dashboard.'}
            </p>

            {!imageData ? (
              <div
                className="upload-zone"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={40} />
                <p>{t('diagnosis.dragDrop', language)}</p>
                <small>{language === 'mr' ? 'JPG, PNG, WebP — पीक, पाने किंवा सापळ्यांचे फोटो' : language === 'hi' ? 'JPG, PNG, WebP — फसल, पत्तियां या ट्रैप के फोटो' : 'JPG, PNG, WebP — Crop leaves or trap photos'}</small>
                <div className="upload-accepted">
                  <span>✅ {language === 'mr' ? 'टोमॅटो, बटाटा, मका पाने' : language === 'hi' ? 'टमाटर, आलू, मक्का पत्तियां' : 'Tomato, Potato, Maize leaves'}</span>
                  <span>✅ {language === 'mr' ? 'कीड / सुरवंट / पाने' : language === 'hi' ? 'कीट / इल्ली / पत्तियां' : 'Pests on leaves & foliage'}</span>
                  <span>✅ {language === 'mr' ? 'पिवळे व निळे चिकट सापळे' : language === 'hi' ? 'पीले और नीले चिपचिपे ट्रैप' : 'Yellow & Blue Sticky Traps'}</span>
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

          {/* ============================================================
              AUTOMATED CONDITIONAL DASHBOARD ROUTING:
              EXACTLY ONE DASHBOARD RENDERS AT A TIME:
              1. LEAF SPOT / DISEASE SYMPTOM -> Disease Dashboard Only
              2. VISIBLE PEST                -> Pest Dashboard Only
              3. HEALTHY / NO RELEVANT ISSUE -> Simple Monitoring Result
              4. UNCERTAIN / LOW CONFIDENCE  -> Expert Verification Guidance
              ============================================================ */}
          {unifiedResult && (
            <ConditionalDiagnosisResult
              result={unifiedResult}
              imageDataUrl={imageData}
              language={language}
              onUploadNewImage={resetDiagnosis}
              onRequestExpertReview={handleExpertRequest}
            />
          )}

          {/* Context Meta Grid: Weather & Location for the Field (Visible for Disease and Pest) */}
          {(unifiedResult?.classification === 'disease' || unifiedResult?.classification === 'pest') && (
            <div className="result-grid" style={{ marginTop: '20px' }}>
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

              {/* Location Card */}
              <div className="result-card location-result">
                <h3><MapPin size={18} /> Field Location & Crop</h3>
                <p><strong>{result.location.district}</strong></p>
                <p>{result.location.village}, {result.location.taluka}</p>
                <small>📍 {result.location.latitude.toFixed(4)}°N, {result.location.longitude.toFixed(4)}°E</small>
                <div className="crop-info">
                  <span className="crop-badge">🌾 {result.crop}</span>
                  <span className="stage-badge">📅 {result.cropStage}</span>
                </div>
              </div>
            </div>
          )}

          {/* Step guidance for farmer (when action is required) */}
          {(unifiedResult?.classification === 'disease' || unifiedResult?.classification === 'pest') && (
            <div className="diagnosis-next-steps-banner card">
              <div className="next-banner-content">
                <h4>🎯 {language === 'mr' ? 'पुढील पायरी: आजचे उपाय डॅशबोर्डवर तयार आहेत' : language === 'hi' ? 'अगला कदम: आज के उपाय डैशबोर्ड पर तैयार हैं' : 'Next Step: Today’s Field Actions Ready on Dashboard'}</h4>
                <p>
                  {language === 'mr'
                    ? 'निदान पूर्ण झाले आहे. शेतात आज काय फवारणी करायची व काय काळजी घ्यायची यासाठी कृपया डॅशबोर्डवरील कार्य सूचीचे पालन करा.'
                    : language === 'hi'
                    ? 'जांच पूरी हो गई है। खेत में क्या सावधानी रखनी है, इसके लिए कृपया डैशबोर्ड पर जाएं।'
                    : 'Diagnosis complete. To execute the recommended precautions and crop care today, follow the action checklist on your Dashboard.'}
                </p>
              </div>
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/dashboard')}>
                <span>{language === 'mr' ? 'डॅशबोर्डवर आजचे उपाय पहा' : language === 'hi' ? 'डैशबोर्ड पर आज के उपाय देखें' : 'Go to Dashboard (Today’s Actions)'}</span>
                <ChevronRight size={18} />
              </button>
            </div>
          )}

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
            <button className="btn btn-outline" onClick={resetDiagnosis}>
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
