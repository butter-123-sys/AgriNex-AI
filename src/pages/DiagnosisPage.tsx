// ============================================================
// AgriNex AI — Simple Farmer-Friendly Image Diagnosis Workflow
// ============================================================
// Based on handwritten design:
// UPLOAD IMAGE → GET RESULT → FOLLOW GUIDANCE → MONITOR → UPLOAD AGAIN
//
// MAIN ENTRY:
// 1. 🌿 Affected Leaf / Crop Image
// 2. 🪤 Pest Trap Image
// 3. ❓ Don't Know Which Pest Trap to Use
// ============================================================

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import { CROPS, CROP_STAGES, DEMO_LOCATIONS } from '../config/demoConfig';
import { detectDisease } from '../services/mock/mockDiseaseService';
import { getWeather } from '../services/mock/mockWeatherService';
import { calculateRisk } from '../services/mock/mockRiskService';
import { generateRecommendation } from '../services/mock/mockRecommendationService';
import {
  validateImageForTarget,
  validateFileType,
  type DetectedImageType,
  type TargetSection,
} from '../services/imageValidator';
import { matchImage } from '../services/trainedDataset';
import pestTrapService from '../services/pestTrapService';
import classifyCropImage, {
  toImageClassificationResult,
  type UnifiedClassificationResult,
} from '../services/unifiedClassifier';
import { recommendPestTrap, type TrapRecommendation } from '../services/trapAdvisorService';
import storageService from '../services/storageService';
import type {
  Crop,
  CropStage,
  Location,
  WeatherData,
  DemoScenario,
  Diagnosis,
  PipelineStep,
  FollowUpComparison,
} from '../types';
import {
  Upload,
  X,
  Camera,
  Leaf,
  MapPin,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  CloudRain,
  ShieldAlert,
  Save,
  PlusCircle,
  Map,
  History,
  ShieldCheck,
  ImageOff,
  ScanEye,
  Bug,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Calendar,
  Bell,
  Eye,
  UserCheck,
  Check,
  TrendingDown,
  TrendingUp,
  Info,
} from 'lucide-react';

export type Step =
  | 'main_menu'
  | 'upload_leaf'
  | 'upload_trap'
  | 'trap_advisor'
  | 'leaf_disease_result'
  | 'leaf_pest_result'
  | 'trap_recommendation'
  | 'trap_result'
  | 'healthy_result'
  | 'uncertain_result';

const PIPELINE_STEPS: string[] = [
  'Uploading image',
  'Validating image quality & clarity',
  'Matching against AI trained database',
  'Running symptom & pest detection',
  'Verifying weather risk',
  'Generating farmer action plan',
];

export default function DiagnosisPage() {
  const { user, language } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Progressive Step state
  const [currentStep, setCurrentStep] = useState<Step>('main_menu');

  // Path 3 (Trap Advisor) sub-step state
  const [advisorSubStep, setAdvisorSubStep] = useState<'upload' | 'result'>('upload');
  const [advisorLeafImageData, setAdvisorLeafImageData] = useState('');
  const [advisorLeafImageName, setAdvisorLeafImageName] = useState('');
  const [advisorAnalyzing, setAdvisorAnalyzing] = useState(false);
  const [advisorWeather, setAdvisorWeather] = useState<WeatherData | null>(null);
  const advisorFileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [imageData, setImageData] = useState<string>('');
  const [imageName, setImageName] = useState('');
  const [crop, setCrop] = useState<Crop>('Tomato');
  const [cropStage, setCropStage] = useState<CropStage>('Flowering');
  const [locationIdx, setLocationIdx] = useState(0);
  const [scenario, setScenario] = useState<DemoScenario | ''>('');

  // Interactive Question State for Case B (Pest)
  const [noticedPestAnswer, setNoticedPestAnswer] = useState<'yes' | 'no'>('yes');
  const [usesPestTrapAnswer, setUsesPestTrapAnswer] = useState<'yes' | 'no' | null>(null);

  // Trap Advisor state (Path 3 & Case B: NO trap)
  const [observedPestForAdvisor, setObservedPestForAdvisor] = useState('Whitefly & Sucking Pests');
  const [trapRecommendation, setTrapRecommendation] = useState<TrapRecommendation | null>(null);
  const [showTrapGuidanceModal, setShowTrapGuidanceModal] = useState(false);
  const [scheduleReminderSaved, setScheduleReminderSaved] = useState(false);

  // Validation state
  const [imageError, setImageError] = useState('');
  const [validatingImage, setValidatingImage] = useState(false);
  const [imageValidated, setImageValidated] = useState(false);
  const [wrongImageType, setWrongImageType] = useState<DetectedImageType | null>(null);
  const [rejectedImageData, setRejectedImageData] = useState('');
  const [rejectedImageName, setRejectedImageName] = useState('');

  // Path 3 Advisor Validation state
  const [advisorImageError, setAdvisorImageError] = useState('');
  const [advisorValidatingImage, setAdvisorValidatingImage] = useState(false);
  const [advisorImageValidated, setAdvisorImageValidated] = useState(false);
  const [advisorWrongImageType, setAdvisorWrongImageType] = useState<DetectedImageType | null>(null);
  const [advisorRejectedImageData, setAdvisorRejectedImageData] = useState('');
  const [advisorRejectedImageName, setAdvisorRejectedImageName] = useState('');

  // Pipeline state
  const [analyzing, setAnalyzing] = useState(false);
  const [pipelineSteps, setPipelineSteps] = useState<PipelineStep[]>([]);

  // Results state
  const [result, setResult] = useState<Diagnosis | null>(null);
  const [unifiedResult, setUnifiedResult] = useState<UnifiedClassificationResult | null>(null);
  const [saved, setSaved] = useState(false);
  const [weatherNote, setWeatherNote] = useState<string>('');
  const [trapComparisonMsg, setTrapComparisonMsg] = useState<string | null>(null);

  // Multilingual helper: takes (mr, hi, en) matching the calls in this page
  const tr = (mr: string, hi: string, en: string) => {
    if (language === 'mr') return mr;
    if (language === 'hi') return hi;
    return en;
  };

  // Pre-fill scenario from URL if present
  useEffect(() => {
    const s = searchParams.get('scenario');
    if (s) {
      setScenario(s as DemoScenario);
      if (s === 'early_blight') {
        setCrop('Tomato');
        setCurrentStep('upload_leaf');
      } else if (s === 'late_blight') {
        setCrop('Potato');
        setCurrentStep('upload_leaf');
      } else if (s === 'caterpillar_leaf') {
        setCrop('Tomato');
        setCurrentStep('upload_leaf');
      } else if (s === 'yellow_trap_whitefly' || s === 'blue_trap_thrips') {
        setCurrentStep('upload_trap');
      } else if (s === 'healthy' || s === 'low_confidence') {
        setCurrentStep('upload_leaf');
      }
    }
  }, [searchParams]);

  // Update trap advisor recommendation whenever crop, location, or observed pest changes
  useEffect(() => {
    const loc = DEMO_LOCATIONS[locationIdx];
    const rec = recommendPestTrap(crop, loc?.district, observedPestForAdvisor);
    setTrapRecommendation(rec);
  }, [crop, locationIdx, observedPestForAdvisor]);

  // Image handling
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
    setWrongImageType(null);

    const fileCheck = validateFileType(file);
    if (!fileCheck.valid) {
      setImageError(fileCheck.reason);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;

      setValidatingImage(true);
      try {
        const target: TargetSection = currentStep === 'upload_trap' ? 'trap' : 'leaf';
        const validation = await validateImageForTarget(dataUrl, target, file.name);

        if (!validation.isValid) {
          const localizedMsg =
            language === 'mr'
              ? validation.reasonsByLang.mr
              : language === 'hi'
              ? validation.reasonsByLang.hi
              : validation.reasonsByLang.en;
          setImageError(localizedMsg);
          setWrongImageType(validation.detectedType);
          setImageValidated(false);
          setImageData('');
          setImageName('');
          setRejectedImageData(dataUrl);
          setRejectedImageName(file.name);
          if (fileInputRef.current) fileInputRef.current.value = '';
          setValidatingImage(false);
          return;
        }

        setImageData(dataUrl);
        setImageName(file.name);
        setImageValidated(true);
        setImageError('');
        setWrongImageType(null);
        setRejectedImageData('');
        setRejectedImageName('');
      } catch {
        setImageData(dataUrl);
        setImageName(file.name);
        setImageValidated(true);
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
    setWrongImageType(null);
    setRejectedImageData('');
    setRejectedImageName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAdvisorLeafImage = () => {
    setAdvisorLeafImageData('');
    setAdvisorLeafImageName('');
    setAdvisorImageError('');
    setAdvisorImageValidated(false);
    setAdvisorWrongImageType(null);
    setAdvisorRejectedImageData('');
    setAdvisorRejectedImageName('');
    if (advisorFileInputRef.current) advisorFileInputRef.current.value = '';
  };

  const switchToTrapSectionWithImage = () => {
    setCurrentStep('upload_trap');
    setImageData(rejectedImageData || imageData);
    setImageName(rejectedImageName || imageName);
    setImageValidated(true);
    setImageError('');
    setWrongImageType(null);
    setRejectedImageData('');
    setRejectedImageName('');
  };

  const switchToLeafSectionWithImage = () => {
    setCurrentStep('upload_leaf');
    setImageData(rejectedImageData || imageData);
    setImageName(rejectedImageName || imageName);
    setImageValidated(true);
    setImageError('');
    setWrongImageType(null);
    setRejectedImageData('');
    setRejectedImageName('');
  };

  const switchToTrapSectionFromAdvisor = () => {
    setImageData(advisorRejectedImageData || advisorLeafImageData);
    setImageName(advisorRejectedImageName || advisorLeafImageName);
    setImageValidated(true);
    setImageError('');
    setWrongImageType(null);
    removeAdvisorLeafImage();
    setCurrentStep('upload_trap');
  };

  const resetToMainMenu = () => {
    setCurrentStep('main_menu');
    setResult(null);
    setUnifiedResult(null);
    setSaved(false);
    setImageData('');
    setImageName('');
    setImageError('');
    setImageValidated(false);
    setWrongImageType(null);
    setRejectedImageData('');
    setRejectedImageName('');
    setScenario('');
    setUsesPestTrapAnswer(null);
    setScheduleReminderSaved(false);
    setTrapComparisonMsg(null);
    setAdvisorSubStep('upload');
    setAdvisorLeafImageData('');
    setAdvisorLeafImageName('');
    setAdvisorImageError('');
    setAdvisorImageValidated(false);
    setAdvisorWrongImageType(null);
    setAdvisorRejectedImageData('');
    setAdvisorRejectedImageName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (advisorFileInputRef.current) advisorFileInputRef.current.value = '';
  };

  // Handle leaf image for the advisor path (Path 3)
  const handleAdvisorLeafFile = (file: File) => {
    setAdvisorImageError('');
    setAdvisorImageValidated(false);
    setAdvisorWrongImageType(null);

    const fileCheck = validateFileType(file);
    if (!fileCheck.valid) {
      setAdvisorImageError(fileCheck.reason);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;

      setAdvisorValidatingImage(true);
      try {
        const validation = await validateImageForTarget(dataUrl, 'leaf', file.name);

        if (!validation.isValid) {
          const localizedMsg =
            language === 'mr'
              ? validation.reasonsByLang.mr
              : language === 'hi'
              ? validation.reasonsByLang.hi
              : validation.reasonsByLang.en;
          setAdvisorImageError(localizedMsg);
          setAdvisorWrongImageType(validation.detectedType);
          setAdvisorImageValidated(false);
          setAdvisorLeafImageData('');
          setAdvisorLeafImageName('');
          setAdvisorRejectedImageData(dataUrl);
          setAdvisorRejectedImageName(file.name);
          if (advisorFileInputRef.current) advisorFileInputRef.current.value = '';
          setAdvisorValidatingImage(false);
          return;
        }

        setAdvisorLeafImageData(dataUrl);
        setAdvisorLeafImageName(file.name);
        setAdvisorImageValidated(true);
        setAdvisorImageError('');
        setAdvisorWrongImageType(null);
        setAdvisorRejectedImageData('');
        setAdvisorRejectedImageName('');
      } catch {
        setAdvisorLeafImageData(dataUrl);
        setAdvisorLeafImageName(file.name);
        setAdvisorImageValidated(true);
      }
      setAdvisorValidatingImage(false);
    };
    reader.readAsDataURL(file);
  };

  // Analyze the leaf image in Path 3 and set the trap recommendation via pixel-analysis
  const runAdvisorLeafAnalysis = async () => {
    if (advisorImageError) return;
    if (advisorLeafImageData && !advisorImageValidated) return;

    setAdvisorAnalyzing(true);
    // Fetch weather data for climate-aware precautions
    const loc = DEMO_LOCATIONS[locationIdx];
    const weather = await getWeather(loc);
    setAdvisorWeather(weather);
    // Brief simulated analysis (pixel-based classifier already set trapRecommendation via useEffect)
    await new Promise((r) => setTimeout(r, 1800));
    // If we have an actual image, run the classifier and override the pest guess
    if (advisorLeafImageData) {
      try {
        const unified = await classifyCropImage(
          advisorLeafImageData,
          crop,
          cropStage,
          advisorLeafImageName,
          undefined,
          'auto'
        );
        // Map classified pest to observed pest string so advisor re-computes
        if (unified.classification === 'pest') {
          const n = (unified.name || '').toLowerCase();
          if (n.includes('caterpillar') || n.includes('borer') || n.includes('armyworm') || n.includes('moth')) {
            setObservedPestForAdvisor('Caterpillar & Borer');
          } else if (n.includes('thrip')) {
            setObservedPestForAdvisor('Thrips');
          } else {
            setObservedPestForAdvisor('Whitefly & Sucking Pests');
          }
        }
      } catch {
        // fall back to current selection
      }
    }
    setAdvisorAnalyzing(false);
    setAdvisorSubStep('result');
    // Schedule 3-day check notification
    if (!scheduleReminderSaved) {
      storageService.saveNotification({
        id: `notif-advisor-${Date.now()}`,
        type: 'followup_reminder',
        title: '🔔 Pest Control Check Reminder',
        message: tr(
          'तुमच्या पिकावरील कीड नियंत्रणात आहे का ते तपासण्याची वेळ झाली आहे. सापळ्याचा फोटो अपलोड करा.',
          'यह जांचने का समय है कि आपकी फसल पर कीट नियंत्रण में है या नहीं। ट्रैप की फोटो अपलोड करें।',
          "It's time to check if the pest infestation is under control. Upload a photo of your trap to monitor."
        ),
        read: false,
        createdAt: new Date().toISOString(),
      });
      setScheduleReminderSaved(true);
    }
  };

  // Run Image Analysis
  const runAnalysis = async () => {
    if (!imageData && !scenario) {
      setImageError(tr('कृपया पुढे जाण्यासाठी फोटो निवडा.', 'कृपया आगे बढ़ने के लिए फोटो चुनें।', 'Please upload an image to proceed.'));
      return;
    }
    if (imageError && !scenario) {
      return;
    }
    if (imageData && !imageValidated && !scenario) {
      return;
    }

    setAnalyzing(true);
    setResult(null);
    setSaved(false);

    const steps: PipelineStep[] = PIPELINE_STEPS.map((label) => ({ label, status: 'pending' }));
    setPipelineSteps(steps);

    const updateStep = (idx: number, status: PipelineStep['status']) => {
      steps[idx] = { ...steps[idx], status };
      setPipelineSteps([...steps]);
    };

    const loc: Location = DEMO_LOCATIONS[locationIdx];
    const imgForAnalysis = imageData || 'demo-placeholder-image';

    try {
      updateStep(0, 'running');
      await new Promise((r) => setTimeout(r, 300));
      updateStep(0, 'done');

      updateStep(1, 'running');
      await new Promise((r) => setTimeout(r, 300));
      updateStep(1, 'done');

      updateStep(2, 'running');
      let detection;
      if (scenario) {
        detection = await detectDisease(imgForAnalysis, crop, scenario as DemoScenario);
      } else if (imageData) {
        const match = await matchImage(imageData);
        detection = match.result;
      } else {
        detection = await detectDisease(imgForAnalysis, crop);
      }
      await new Promise((r) => setTimeout(r, 350));
      updateStep(2, 'done');

      updateStep(3, 'running');
      const isTrapMode = currentStep === 'upload_trap';
      const farmerIntent = isTrapMode ? 'pest_trap' : 'auto';

      const pestAnalysis = await pestTrapService.analyzePestAndTrap(
        imgForAnalysis,
        crop,
        cropStage,
        scenario || undefined,
        imageName
      );

      const unified = await classifyCropImage(
        imgForAnalysis,
        crop,
        cropStage,
        imageName,
        scenario || undefined,
        farmerIntent
      );
      setUnifiedResult(unified);
      await new Promise((r) => setTimeout(r, 350));
      updateStep(3, 'done');

      updateStep(4, 'running');
      const weather = await getWeather(loc);
      const risk = calculateRisk(detection, weather, crop, cropStage);
      await new Promise((r) => setTimeout(r, 300));
      updateStep(4, 'done');

      updateStep(5, 'running');
      const recommendation = generateRecommendation(detection.disease, risk, crop, cropStage, weather);

      // Simple farmer weather note
      if (weather.humidity >= 78) {
        setWeatherNote(
          tr(
            `हवामान परिस्थिती (आर्द्रता ${weather.humidity}%) मुळे रोगाचा फैलाव वाढू शकतो. पाने कोरडी ठेवा.`,
            `मौसम की स्थिति (नमी ${weather.humidity}%) से रोग का फैलाव बढ़ सकता है। पत्तियां सूखी रखें।`,
            `Weather conditions (${weather.humidity}% humidity) may increase disease spread risk. Keep leaves dry.`
          )
        );
      } else if (unified.classification === 'pest') {
        setWeatherNote(
          tr(
            'उष्ण आणि कोरड्या हवामानामुळे किडींची हालचाल वाढू शकते. झाडांचे नियमित निरीक्षण करा.',
            'गर्म और शुष्क मौसम से कीटों की गतिविधि बढ़ सकती है। पौधों का नियमित निरीक्षण करें।',
            'Warm conditions favor sucking pest activity. Inspect leaf undersides regularly.'
          )
        );
      } else {
        setWeatherNote(
          tr(
            'हवामान सामान्य आहे. नियमित शेत निरीक्षण सुरू ठेवा.',
            'मौसम सामान्य है। नियमित खेत निगरानी जारी रखें।',
            'Weather conditions are normal. Continue routine crop scouting.'
          )
        );
      }

      // Check repeat monitoring comparison for Trap observations
      if (unified.classification === 'trap' || isTrapMode) {
        const pastDiagnoses = storageService.getDiagnoses();
        const previousTrapDiag = pastDiagnoses.find(
          (d) => d.pestAnalysis?.isTrapImage || d.imageClassification?.classification === 'trap'
        );

        if (previousTrapDiag) {
          const prevClassification = previousTrapDiag.imageClassification;
          const prevCount =
            (prevClassification && 'visible_count' in prevClassification
              ? prevClassification.visible_count
              : previousTrapDiag.pestAnalysis?.totalPestCount) || 12;
          const newCount = unified.visible_count || 12;

          if (newCount < prevCount) {
            setTrapComparisonMsg(
              tr(
                `अपलोड केलेल्या सापळ्याच्या फोटोंमध्ये कीड हालचाल कमी झाली आहे (${prevCount} → ${newCount}).`,
                `अपलोड की गई ट्रैप फोटो में कीट गतिविधि कम हुई है (${prevCount} → ${newCount})।`,
                `Visible pest activity in your uploaded trap images has decreased (${prevCount} → ${newCount}).`
              )
            );
          } else if (newCount > prevCount) {
            setTrapComparisonMsg(
              tr(
                `नवीनतम सापळ्याच्या फोटोत अधिक कीटक दिसत आहेत (${prevCount} → ${newCount}). निरीक्षण सुरू ठेवा आणि प्रमाणित मार्गदर्शन घ्या.`,
                `नवीनतम ट्रैप फोटो में अधिक कीट दिख रहे हैं (${prevCount} → ${newCount})। निगरानी जारी रखें और प्रमाणित मार्गदर्शन लें।`,
                `More insects are visible in the latest trap image (${prevCount} → ${newCount}). Continue monitoring and consider expert/verified guidance.`
              )
            );
          } else {
            setTrapComparisonMsg(
              tr(
                `सापळ्याच्या फोटोंमध्ये कीड संख्या स्थिर आहे (${prevCount} कीटक).`,
                `ट्रैप फोटो में कीटों की संख्या स्थिर है (${prevCount} कीट)।`,
                `Visible insect count is stable in uploaded trap images (${prevCount} insects).`
              )
            );
          }
        }
      }

      const imageClassification = toImageClassificationResult(unified);

      const diagnosis: Diagnosis = {
        id: `diag-${Date.now()}`,
        farmerId: user?.id || 'farmer-001',
        crop,
        cropStage,
        disease: unified.classification === 'pest' ? `${unified.name} Infestation` : unified.name,
        confidence: Math.round(unified.confidence * 100),
        severity: unified.severity,
        riskScore: risk.score,
        riskLevel: risk.level,
        imageDataUrl: imageData ? imageData.substring(0, 200) + '...' : '',
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
        imageClassification,
      };

      await new Promise((r) => setTimeout(r, 250));
      updateStep(5, 'done');
      setResult(diagnosis);

      // Route to EXACTLY the next relevant step per user flow!
      if (isTrapMode || unified.classification === 'trap') {
        setCurrentStep('trap_result');
      } else if (unified.classification === 'healthy') {
        setCurrentStep('healthy_result');
      } else if (unified.classification === 'uncertain') {
        setCurrentStep('uncertain_result');
      } else if (unified.classification === 'pest') {
        setCurrentStep('leaf_pest_result');
      } else {
        setCurrentStep('leaf_disease_result');
      }
    } catch (err) {
      console.error('Diagnosis error:', err);
    }

    setAnalyzing(false);
  };

  // Schedule Trap Monitoring Reminder (Section: After Trap Recommendation)
  const handleCreateTrapReminder = () => {
    storageService.saveNotification({
      id: `notif-trap-${Date.now()}`,
      type: 'followup_reminder',
      title: '🔔 Pest Trap Check Reminder',
      message: tr(
        'आपल्या कीड सापळ्याची तपासणी करण्याची वेळ झाली आहे. कीड हालचालींचे निरीक्षण करण्यासाठी सापळ्याचा स्पष्ट फोटो अपलोड करा.',
        'अपने कीट ट्रैप की जांच करने का समय हो गया है। कीट गतिविधि की निगरानी हेतु ट्रैप की स्पष्ट फोटो अपलोड करें।',
        "It's time to check your pest trap. Upload a clear photo of your trap so AgriNex AI can monitor pest activity."
      ),
      read: false,
      createdAt: new Date().toISOString(),
    });
    setScheduleReminderSaved(true);
  };

  const handleSaveDiagnosis = () => {
    if (!result) return;
    const toSave = { ...result, imageDataUrl: imageData };
    storageService.saveDiagnosis(toSave);
    setSaved(true);
  };

  const handleExpertRequest = () => {
    if (result) {
      storageService.saveValidation({
        id: `val-${Date.now()}`,
        diagnosisId: result.id,
        aiDisease: unifiedResult?.name || result.disease,
        aiConfidence: Math.round((unifiedResult?.confidence || 0.5) * 100),
        decision: 'PENDING',
        comment: 'Farmer requested expert review.',
        expertId: '',
        timestamp: new Date().toISOString(),
      });
    }
    alert(
      tr(
        'कृषी तज्ज्ञांकडे पडताळणी विनंती पाठवली आहे. लवकरच मार्गदर्शन मिळेल.',
        'कृषि विशेषज्ञ के पास सत्यापन अनुरोध भेज दिया गया है। जल्द ही मार्गदर्शन मिलेगा।',
        'Request submitted to agricultural expert extension. You will receive guidance shortly.'
      )
    );
  };

  return (
    <div className="page diagnosis-page">
      <div className="page-header">
        <h1>{t('diagnosis.title', language)}</h1>
        <p>
          {tr(
            'फोटो घ्या → समस्या समजून घ्या → उपाय करा → निरीक्षण करा',
            'फोटो लें → समस्या समझें → उपाय करें → निगरानी करें',
            'Take a photo → Understand the problem → Follow guidance → Monitor again'
          )}
        </p>
      </div>

      {/* ============================================================
          MAIN ENTRY SCREEN (When step === 'main_menu')
          Shows ONLY the 3 simple handwritten cards!
          ============================================================ */}
      {currentStep === 'main_menu' && (
        <div className="entry-cards-container animate-fade-in">
          {/* Card 1 */}
          <div
            className="main-entry-card"
            onClick={() => {
              setCurrentStep('upload_leaf');
              setImageData('');
            }}
          >
            <div className="entry-icon-badge" style={{ color: '#22c55e' }}>
              🌿
            </div>
            <div className="entry-text-block">
              <h3 className="entry-title">
                {tr('🌿 बाधित पान / पिकाचा फोटो', '🌿 प्रभावित पत्ती / फसल का फोटो', '🌿 Affected Leaf / Crop Image')}
              </h3>
              <p className="entry-subtitle">
                {tr(
                  'समस्या ओळखण्यासाठी आपल्या बाधित पानाचा किंवा पिकाचा फोटो अपलोड करा.',
                  'समस्या की पहचान करने के लिए अपनी प्रभावित पत्ती या फसल की फोटो अपलोड करें।',
                  'Upload a photo of your affected leaf or crop to identify the problem.'
                )}
              </p>
            </div>
            <ChevronRight size={24} className="entry-arrow-icon" />
          </div>

          {/* Card 2 */}
          <div
            className="main-entry-card trap-card"
            onClick={() => {
              setCurrentStep('upload_trap');
              setImageData('');
            }}
          >
            <div className="entry-icon-badge" style={{ color: '#f59e0b' }}>
              🪤
            </div>
            <div className="entry-text-block">
              <h3 className="entry-title">
                {tr('🪤 कीड सापळ्याचा फोटो', '🪤 कीट ट्रैप का फोटो', '🪤 Pest Trap Image')}
              </h3>
              <p className="entry-subtitle">
                {tr(
                  'आपल्याकडे आधीच सापळ्याचा फोटो आहे का? कीड ओळखण्यासाठी व निरीक्षण करण्यासाठी तो अपलोड करा.',
                  'क्या आपके पास पहले से ट्रैप का फोटो है? कीट की पहचान और निगरानी हेतु इसे अपलोड करें।',
                  'Already have a pest-trap image? Upload it to identify and monitor the pest.'
                )}
              </p>
            </div>
            <ChevronRight size={24} className="entry-arrow-icon" />
          </div>

          {/* Card 3 */}
          <div
            className="main-entry-card advisor-card"
            onClick={() => {
              setCurrentStep('trap_advisor');
            }}
          >
            <div className="entry-icon-badge" style={{ color: '#3b82f6' }}>
              ❓
            </div>
            <div className="entry-text-block">
              <h3 className="entry-title">
                {tr('❓ कोणता कीड सापळा वापरावा हे माहित नाही', '❓ कौन सा कीट ट्रैप इस्तेमाल करें नहीं पता', "❓ Don't Know Which Pest Trap to Use")}
              </h3>
              <p className="entry-subtitle">
                {tr(
                  'योग्य सापळा निवडण्यासाठी आणि शेतात बसवण्यासाठी सोपे मार्गदर्शन मिळवा.',
                  'उपयुक्त ट्रैप चुनने और निगरानी करने के लिए सरल मार्गदर्शन प्राप्त करें।',
                  'Get simple guidance for choosing and monitoring a suitable trap.'
                )}
              </p>
            </div>
            <ChevronRight size={24} className="entry-arrow-icon" />
          </div>
        </div>
      )}

      {/* ============================================================
          PATH 1: UPLOAD AFFECTED LEAF OR CROP IMAGE
          ============================================================ */}
      {currentStep === 'upload_leaf' && (
        <div className="diagnosis-form-container animate-fade-in">
          <div className="workflow-step-nav">
            <button className="workflow-back-btn" onClick={resetToMainMenu}>
              <ChevronLeft size={16} /> {tr('मागे जा', 'पीछे जाएं', 'Back to Choices')}
            </button>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              {tr('पायरी १: पानाचा फोटो अपलोड करा', 'चरण 1: पत्ती का फोटो अपलोड करें', 'Step 1: Upload Leaf Photo')}
            </span>
          </div>

          <div className="form-section">
            <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', marginBottom: '8px' }}>
              <Camera size={18} /> {tr('बाधित पानाचा किंवा पिकाचा स्पष्ट फोटो अपलोड करा', 'प्रभावित पत्ती या फसल का स्पष्ट फोटो अपलोड करें', 'Upload a clear photo of the affected leaf or crop')}
            </h3>

            {!imageData ? (
              <div
                className="upload-zone"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={42} />
                <p style={{ fontSize: '1.05rem', fontWeight: 600 }}>
                  {tr('येथे फोटो टाका किंवा कॅमेऱ्याने फोटो घ्या', 'यहां फोटो खींचें या कैमरे से फोटो लें', t('diagnosis.dragDrop', language))}
                </p>
                <small>JPG, PNG, WebP — Tomato, Potato, Maize, Cotton, Soybean leaves</small>
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
                  {validatingImage && (
                    <div className="image-validating">
                      <Loader2 size={24} className="spin" />
                      <span>{tr('फोटो तपासत आहे...', 'फोटो की जांच हो रही है...', 'Validating photo...')}</span>
                    </div>
                  )}
                  {imageError && (
                    <div className="image-rejected">
                      <ImageOff size={28} />
                      <span style={{ maxWidth: '90%', fontSize: '0.85rem' }}>{imageError}</span>
                      {wrongImageType === 'pest_trap' && (
                        <button
                          type="button"
                          className="btn btn-sm"
                          style={{
                            marginTop: '10px',
                            background: '#d97706',
                            color: '#fff',
                            border: 'none',
                            fontWeight: 600,
                            padding: '6px 14px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            switchToTrapSectionWithImage();
                          }}
                        >
                          {tr('🪤 कीटक सापळा विभागात जा', '🪤 कीट ट्रैप अनुभाग में जाएं', '🪤 Switch to Pest Trap Section')}
                        </button>
                      )}
                    </div>
                  )}
                  {imageValidated && !imageError && (
                    <div className="image-accepted">
                      <CheckCircle2 size={18} />
                      <span>{tr('पानाचा फोटो सत्यापित', 'पत्ती का फोटो सत्यापित', 'Leaf photo verified')}</span>
                    </div>
                  )}
                  <button className="remove-img" onClick={removeImage}><X size={16} /></button>
                </div>
                <span className="img-name">{imageName}</span>
              </div>
            )}

            {imageError && (
              <div className="image-error-msg" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={16} /> <span>{imageError}</span>
                </div>
                {wrongImageType === 'pest_trap' && (
                  <button
                    type="button"
                    className="btn btn-sm"
                    style={{
                      background: '#d97706',
                      color: '#fff',
                      border: 'none',
                      fontWeight: 600,
                      padding: '5px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                    }}
                    onClick={switchToTrapSectionWithImage}
                  >
                    {tr('🪤 कीटक सापळा विभागात जा', '🪤 कीट ट्रैप अनुभाग में जाएं', '🪤 Switch to Pest Trap Section')}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Simple Crop & Location selection */}
          <div className="form-row">
            <div className="form-section half">
              <h3><Leaf size={18} /> {t('diagnosis.selectCrop', language)}</h3>
              <select value={crop} onChange={(e) => setCrop(e.target.value as Crop)} className="select-input">
                {CROPS.map((c) => (
                  <option key={c} value={c}>{t(`crop.${c}`, language) || c}</option>
                ))}
              </select>
            </div>
            <div className="form-section half">
              <h3><MapPin size={18} /> {t('diagnosis.selectLocation', language)}</h3>
              <select value={locationIdx} onChange={(e) => setLocationIdx(Number(e.target.value))} className="select-input">
                {DEMO_LOCATIONS.map((loc, i) => (
                  <option key={i} value={i}>{loc.district}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Evaluator Demo Shortcuts */}
          <div className="form-section" style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                🎬 <strong>Evaluator Demo Quick Test:</strong>
              </span>
              <select
                value={scenario}
                onChange={(e) => setScenario(e.target.value as DemoScenario)}
                className="select-input"
                style={{ width: 'auto', fontSize: '0.82rem', padding: '4px 10px' }}
              >
                <option value="">Select test case (Optional)</option>
                <option value="early_blight">Tomato: Early Blight (Disease Case A)</option>
                <option value="late_blight">Potato: Late Blight (Disease Case A)</option>
                <option value="caterpillar_leaf">Tomato: Caterpillar on Leaf (Pest Case B)</option>
                <option value="healthy">Maize: Healthy Leaf (No problem)</option>
                <option value="low_confidence">Uncertain / Blurry Image</option>
              </select>
            </div>
          </div>

          {/* Analyze Button */}
          <button
            className="btn btn-primary btn-lg btn-full analyze-btn"
            onClick={runAnalysis}
            disabled={analyzing || (imageData !== '' && !imageValidated && !scenario) || (imageData !== '' && !!imageError && !scenario) || (!imageData && !scenario)}
          >
            {analyzing ? (
              <><Loader2 size={18} className="spin" /> {t('diagnosis.analyzing', language)}</>
            ) : (
              <>{t('diagnosis.analyze', language)} <ChevronRight size={18} /></>
            )}
          </button>

          {/* Processing Animation */}
          {analyzing && (
            <div className="pipeline-steps">
              <h3><ScanEye size={18} /> Processing Photo</h3>
              {pipelineSteps.map((step, i) => (
                <div key={i} className={`pipeline-step ${step.status}`}>
                  {step.status === 'done' ? (
                    <CheckCircle2 size={18} />
                  ) : step.status === 'running' ? (
                    <Loader2 size={18} className="spin" />
                  ) : (
                    <div className="step-dot" />
                  )}
                  <span>{step.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================
          PATH 2: UPLOAD PEST TRAP IMAGE
          ============================================================ */}
      {currentStep === 'upload_trap' && (
        <div className="diagnosis-form-container animate-fade-in">
          <div className="workflow-step-nav">
            <button className="workflow-back-btn" onClick={resetToMainMenu}>
              <ChevronLeft size={16} /> {tr('मागे जा', 'पीछे जाएं', 'Back to Choices')}
            </button>
            <span style={{ fontSize: '0.85rem', color: '#f59e0b' }}>
              🪤 {tr('सापळा फोटो तपासणी', 'ट्रैप फोटो जांच', 'Trap Image Surveillance')}
            </span>
          </div>

          <div className="form-section">
            <h3 style={{ fontSize: '1.15rem', color: '#fcd34d', marginBottom: '8px' }}>
              🪤 {tr('आपल्या कीड सापळ्याचा स्पष्ट फोटो अपलोड करा', 'अपने कीट ट्रैप का स्पष्ट फोटो अपलोड करें', 'Upload a clear photo of your pest trap')}
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: '14px' }}>
              {tr(
                'पिवळा चिकट सापळा, निळा चिकट सापळा किंवा इतर शेती सापळ्याचा फोटो घ्या. AI आपोआप सापळ्याचा प्रकार व कीटक संख्या मोजेल.',
                'पीला चिपचिपा ट्रैप, नीला ट्रैप या अन्य कृषि ट्रैप का फोटो लें। AI स्वतः ट्रैप प्रकार एवं कीट संख्या की गणना करेगा।',
                'Take a photo of your yellow sticky trap, blue sticky trap, or other agricultural trap. AI will identify the trap and count visible insects.'
              )}
            </p>

            {!imageData ? (
              <div
                className="upload-zone"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                style={{ borderColor: 'rgba(245, 158, 11, 0.4)' }}
              >
                <span style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🪤</span>
                <p style={{ fontSize: '1.05rem', fontWeight: 600 }}>
                  {tr('सापळ्याचा फोटो येथे ड्रॅग करा किंवा निवडा', 'ट्रैप का फोटो यहां खींचें या चुनें', 'Drag or upload trap image here')}
                </p>
                <small>JPG, PNG, WebP — Yellow Sticky Trap, Blue Sticky Trap, Pheromone Trap</small>
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
                  <img src={imageData} alt="Uploaded trap" />
                  {validatingImage && (
                    <div className="image-validating">
                      <Loader2 size={24} className="spin" />
                      <span>{tr('सापळ्याचा फोटो तपासत आहे...', 'ट्रैप फोटो की जांच हो रही है...', 'Validating trap photo...')}</span>
                    </div>
                  )}
                  {imageError && (
                    <div className="image-rejected">
                      <ImageOff size={28} />
                      <span style={{ maxWidth: '90%', fontSize: '0.85rem' }}>{imageError}</span>
                      {wrongImageType === 'crop_leaf' && (
                        <button
                          type="button"
                          className="btn btn-sm"
                          style={{
                            marginTop: '10px',
                            background: '#16a34a',
                            color: '#fff',
                            border: 'none',
                            fontWeight: 600,
                            padding: '6px 14px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            switchToLeafSectionWithImage();
                          }}
                        >
                          {tr('🍃 रोग व कीड निदानात जा', '🍃 रोग एवं कीट पहचान में जाएं', '🍃 Switch to Crop Leaf Diagnosis')}
                        </button>
                      )}
                    </div>
                  )}
                  {imageValidated && !imageError && (
                    <div className="image-accepted">
                      <CheckCircle2 size={18} />
                      <span>{tr('सापळ्याचा फोटो सत्यापित', 'ट्रैप फोटो सत्यापित', 'Trap photo verified')}</span>
                    </div>
                  )}
                  <button className="remove-img" onClick={removeImage}><X size={16} /></button>
                </div>
                <span className="img-name">{imageName}</span>
              </div>
            )}

            {imageError && (
              <div className="image-error-msg" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={16} /> <span>{imageError}</span>
                </div>
                {wrongImageType === 'crop_leaf' && (
                  <button
                    type="button"
                    className="btn btn-sm"
                    style={{
                      background: '#16a34a',
                      color: '#fff',
                      border: 'none',
                      fontWeight: 600,
                      padding: '5px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                    }}
                    onClick={switchToLeafSectionWithImage}
                  >
                    {tr('🍃 रोग व कीड निदानात जा', '🍃 रोग एवं कीट पहचान में जाएं', '🍃 Switch to Crop Leaf Diagnosis')}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Evaluator Shortcut */}
          <div className="form-section" style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                🎬 <strong>Trap Demo Shortcut:</strong>
              </span>
              <select
                value={scenario}
                onChange={(e) => setScenario(e.target.value as DemoScenario)}
                className="select-input"
                style={{ width: 'auto', fontSize: '0.82rem', padding: '4px 10px' }}
              >
                <option value="">Select test trap</option>
                <option value="yellow_trap_whitefly">Yellow Sticky Trap: Whitefly (12 insects)</option>
                <option value="blue_trap_thrips">Blue Sticky Trap: Thrips (14 insects)</option>
              </select>
            </div>
          </div>

          <button
            className="btn btn-primary btn-lg btn-full analyze-btn"
            onClick={runAnalysis}
            disabled={
              analyzing ||
              (imageData !== '' && !imageValidated && !scenario) ||
              (imageData !== '' && !!imageError && !scenario) ||
              (!imageData && !scenario)
            }
            style={{ background: '#d97706', borderColor: '#b45309' }}
          >
            {analyzing ? (
              <><Loader2 size={18} className="spin" /> {tr('सापळ्याचे विश्लेषण सुरू...', 'ट्रैप का विश्लेषण जारी...', 'Analyzing Trap Image...')}</>
            ) : (
              <>{tr('सापळ्याचे विश्लेषण करा', 'ट्रैप का विश्लेषण करें', 'Analyze Trap Image')} <ChevronRight size={18} /></>
            )}
          </button>
        </div>
      )}

      {/* ============================================================
          PATH 3: ❓ DON'T KNOW WHICH PEST TRAP TO USE
          Sub-step A: Upload leaf image with pest
          Sub-step B: Show AI-suggested trap + 3-day reminder
          ============================================================ */}
      {currentStep === 'trap_advisor' && trapRecommendation && (
        <div className="diagnosis-form-container animate-fade-in">
          <div className="workflow-step-nav">
            <button
              className="workflow-back-btn"
              onClick={() => {
                if (advisorSubStep === 'result') {
                  setAdvisorSubStep('upload');
                } else {
                  resetToMainMenu();
                }
              }}
            >
              <ChevronLeft size={16} /> {advisorSubStep === 'result' ? tr('पुन्हा फोटो अपलोड करा', 'फिर से फोटो अपलोड करें', 'Upload Again') : tr('मागे जा', 'पीछे जाएं', 'Back to Choices')}
            </button>
            <span style={{ fontSize: '0.85rem', color: '#3b82f6' }}>
              ❓ {tr('सापळा सल्लागार', 'ट्रैप सलाहकार', 'Trap Advisor')}{advisorSubStep === 'result' ? ` — ${tr('शिफारस', 'अनुशंसा', 'Recommendation')}` : ''}
            </span>
          </div>

          {/* ===== SUB-STEP A: Leaf Image Upload ===== */}
          {advisorSubStep === 'upload' && (
            <div className="cond-card" style={{ borderTop: '4px solid #3b82f6' }}>
              <h2 style={{ fontSize: '1.15rem', color: '#60a5fa', marginBottom: '4px' }}>
                📷 {tr('बाधित पानाचा / कीडयुक्त पानाचा फोटो अपलोड करा', 'कीट वाली पत्ती का फोटो अपलोड करें', 'Upload a photo of your leaf with pest')}
              </h2>
              <p style={{ fontSize: '0.86rem', color: '#94a3b8', marginBottom: '16px' }}>
                {tr(
                  'AI पानावरील कीड ओळखेल आणि कोणता सापळा वापरावा हे सांगेल. फोटो नसेल तर पुढे जा, आम्ही पिकाच्या आधारावर सुचवू.',
                  'AI पत्ती पर कीट की पहचान करेगा और बताएगा कि कौन सा ट्रैप इस्तेमाल करें। फोटो न हो तो आगे बढ़ें, हम फसल के आधार पर सुझाएंगे।',
                  'AI will identify the pest on your leaf and suggest the right trap. No photo? Proceed and we will suggest based on your crop.'
                )}
              </p>

              {/* Crop Selector */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                  {tr('पीक निवडा:', 'फसल चुनें:', 'Select Crop:')}
                </label>
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value as Crop)}
                  className="select-input"
                >
                  {CROPS.map((c) => (
                    <option key={c} value={c}>{t(`crop.${c}`, language) || c}</option>
                  ))}
                </select>
              </div>

              {/* Upload Zone */}
              {!advisorLeafImageData ? (
                <div
                  className="upload-zone"
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file) handleAdvisorLeafFile(file);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => advisorFileInputRef.current?.click()}
                  style={{ borderColor: 'rgba(59, 130, 246, 0.45)', cursor: 'pointer' }}
                >
                  <span style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🍃</span>
                  <p style={{ fontSize: '1.05rem', fontWeight: 600 }}>
                    {tr('पानाचा फोटो येथे ड्रॅग करा किंवा निवडा', 'पत्ती का फोटो यहां खींचें या चुनें', 'Drag or click to upload leaf photo')}
                  </p>
                  <small style={{ color: '#64748b' }}>{tr('JPG, PNG, WebP — फोटो ऐच्छिक आहे', 'JPG, PNG, WebP — फोटो वैकल्पिक है', 'JPG, PNG, WebP — photo is optional')}</small>
                  <input
                    ref={advisorFileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleAdvisorLeafFile(file);
                    }}
                    hidden
                  />
                </div>
              ) : (
                <div className={`image-preview-container ${advisorImageError ? 'has-error' : ''}`} style={{ marginBottom: '12px' }}>
                  <div className="image-preview">
                    <img src={advisorLeafImageData} alt="Leaf with pest" style={{ maxHeight: '180px', borderRadius: '8px' }} />
                    {advisorValidatingImage && (
                      <div className="image-validating">
                        <Loader2 size={24} className="spin" />
                        <span>{tr('पानाचा फोटो तपासत आहे...', 'पत्ती के फोटो की जांच...', 'Validating leaf photo...')}</span>
                      </div>
                    )}
                    {advisorImageError && (
                      <div className="image-rejected">
                        <ImageOff size={28} />
                        <span style={{ maxWidth: '90%', fontSize: '0.85rem' }}>{advisorImageError}</span>
                        {advisorWrongImageType === 'pest_trap' && (
                          <button
                            type="button"
                            className="btn btn-sm"
                            style={{
                              marginTop: '10px',
                              background: '#d97706',
                              color: '#fff',
                              border: 'none',
                              fontWeight: 600,
                              padding: '6px 14px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              switchToTrapSectionFromAdvisor();
                            }}
                          >
                            {tr('🪤 माझ्याकडे आधीच सापळा आहे (सापळा तपासा)', '🪤 मेरे पास पहले से ट्रैप है (ट्रैप जांचें)', '🪤 I Already Have a Trap (Check Trap)')}
                          </button>
                        )}
                      </div>
                    )}
                    {advisorImageValidated && !advisorImageError && (
                      <div className="image-accepted">
                        <CheckCircle2 size={18} />
                        <span>{tr('पानाचा फोटो सत्यापित', 'पत्ती का फोटो सत्यापित', 'Leaf photo verified')}</span>
                      </div>
                    )}
                    <button
                      className="remove-img"
                      onClick={removeAdvisorLeafImage}
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <span className="img-name">
                    {advisorImageValidated ? `✅ ${advisorLeafImageName}` : advisorLeafImageName}
                  </span>
                </div>
              )}

              {advisorImageError && (
                <div className="image-error-msg" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={16} /> <span>{advisorImageError}</span>
                  </div>
                  {advisorWrongImageType === 'pest_trap' && (
                    <button
                      type="button"
                      className="btn btn-sm"
                      style={{
                        background: '#d97706',
                        color: '#fff',
                        border: 'none',
                        fontWeight: 600,
                        padding: '5px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                      }}
                      onClick={switchToTrapSectionFromAdvisor}
                    >
                      {tr('🪤 माझ्याकडे आधीच सापळा आहे (सापळा तपासा)', '🪤 मेरे पास पहले से ट्रैप है (ट्रैप जांचें)', '🪤 I Already Have a Trap (Check Trap)')}
                    </button>
                  )}
                </div>
              )}

              {/* Analyze / Proceed Button */}
              <button
                className="btn btn-primary btn-lg btn-full analyze-btn"
                onClick={runAdvisorLeafAnalysis}
                disabled={advisorAnalyzing || (!!advisorLeafImageData && !advisorImageValidated) || !!advisorImageError}
                style={{ background: '#3b82f6', borderColor: '#2563eb', marginTop: '16px' }}
              >
                {advisorAnalyzing ? (
                  <><Loader2 size={18} className="spin" /> {tr('AI कीड ओळखत आहे...', 'AI कीट पहचान रहा है...', 'AI is identifying pest...')}</>
                ) : advisorLeafImageData ? (
                  <>{tr('AI ने पानाचे विश्लेषण करा', 'AI से पत्ती का विश्लेषण करें', 'Analyze Leaf & Suggest Trap')} <ChevronRight size={18} /></>
                ) : (
                  <>{tr('पिकावर आधारित सापळा सुचवा', 'फसल के आधार पर ट्रैप सुझाएं', 'Suggest Trap Based on Crop')} <ChevronRight size={18} /></>
                )}
              </button>

              {/* Processing animation */}
              {advisorAnalyzing && (
                <div className="pipeline-steps" style={{ marginTop: '12px' }}>
                  <h3><ScanEye size={18} /> {tr('कीड विश्लेषण सुरू...', 'कीट विश्लेषण जारी...', 'Pest Detection Running...')}</h3>
                  {[tr('फोटो स्कॅन करत आहे...', 'फोटो स्कैन हो रहा है...', 'Scanning photo...'),
                    tr('पानावरील कीड ओळखत आहे...', 'पत्ती पर कीट पहचान रहा है...', 'Identifying pest on leaf...'),
                    tr('योग्य सापळा शोधत आहे...', 'उपयुक्त ट्रैप खोज रहा है...', 'Finding the best trap match...')].map((label, i) => (
                    <div key={i} className="pipeline-step running">
                      <Loader2 size={16} className="spin" />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ===== SUB-STEP B: Trap Recommendation + Notification ===== */}
          {advisorSubStep === 'result' && (
            <div className="cond-card" style={{ borderTop: '4px solid #22c55e' }}>

              {/* Detected Pest Banner */}
              {advisorLeafImageData && (
                <div style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}>
                  <span style={{ fontSize: '1.5rem' }}>🔍</span>
                  <div>
                    <div style={{ fontSize: '0.82rem', color: '#86efac', fontWeight: 600, marginBottom: '2px' }}>
                      {tr('AI ने पानावर कीड ओळखली:', 'AI ने पत्ती पर कीट पहचाना:', 'AI detected pest on your leaf:')}
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
                      {observedPestForAdvisor === 'Caterpillar & Borer' ? '🐛 Caterpillar / Borer' :
                       observedPestForAdvisor === 'Thrips' ? '🦟 Thrips' :
                       '🪲 Whitefly / Sucking Pest'}
                    </div>
                  </div>
                </div>
              )}

              <h2 style={{ fontSize: '1.25rem', color: '#60a5fa', marginBottom: '8px' }}>
                🪤 {tr('शिफारस केलेला कीड सापळा', 'अनुशंसित कीट ट्रैप', 'RECOMMENDED PEST TRAP')}
              </h2>

              {/* Trap Type Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(59, 130, 246, 0.15)',
                border: '2px solid rgba(59, 130, 246, 0.4)',
                borderRadius: '12px',
                padding: '10px 18px',
                marginBottom: '14px',
              }}>
                <span style={{ fontSize: '1.8rem' }}>
                  {trapRecommendation.trapType === 'Yellow Sticky Trap' ? '🟡' :
                   trapRecommendation.trapType === 'Blue Sticky Trap' ? '🔵' :
                   trapRecommendation.trapType === 'Pheromone Trap' ? '🟠' :
                   trapRecommendation.trapType === 'Light Trap' ? '💡' : '🪤'}
                </span>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {tr('वापरा हे सापळे:', 'इस ट्रैप का उपयोग करें:', 'Use This Trap:')}
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                    {trapRecommendation.trapType}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div style={{
                background: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '10px',
                padding: '14px 16px',
                marginBottom: '14px',
              }}>
                <p style={{ fontSize: '0.9rem', color: '#cbd5e1', margin: '0 0 10px 0' }}>
                  <strong style={{ color: '#93c5fd' }}>{tr('का वापरावा: ', 'क्यों इस्तेमाल करें: ', 'Why this trap: ')}</strong>
                  {trapRecommendation.whyReason}
                </p>
                <p style={{ fontSize: '0.88rem', color: '#94a3b8', margin: 0 }}>
                  <strong style={{ color: '#93c5fd' }}>{tr('लक्ष्य कीड: ', 'लक्षित कीट: ', 'Target Pests: ')}</strong>
                  {trapRecommendation.targetPests.join(', ')}
                </p>
              </div>

              {/* Installation Tips */}
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px 16px', borderRadius: '8px', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '0.9rem', color: '#93c5fd', margin: '0 0 8px 0' }}>
                  📋 {tr('बसवण्याच्या सूचना:', 'लगाने के निर्देश:', 'Installation Instructions:')}
                </h4>
                <ol style={{ paddingLeft: '18px', margin: 0, fontSize: '0.88rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                  <li>{tr('सापळा बाधित पिकाच्या भागात पिकाच्या उंचीवर लावा.', 'ट्रैप को प्रभावित फसल क्षेत्र के पास पौधे की ऊंचाई पर लगाएं।', 'Place the trap near the affected crop area at plant canopy height.')}</li>
                  <li>{tr('प्रति एकर ८ ते १० सापळे लावा.', 'प्रति एकड़ 8 से 10 ट्रैप लगाएं।', 'Install 8–10 traps per acre spaced 10 metres apart.')}</li>
                  <li>{tr('दर ३ दिवसांनी सापळा तपासा.', 'हर 3 दिन में ट्रैप जांचें।', 'Check the trap every 3 days.')}</li>
                  <li style={{ color: '#fcd34d', fontWeight: 600 }}>
                    {trapRecommendation.installationTip}
                  </li>
                </ol>
              </div>

              {/* ===== WEATHER & CLIMATE PRECAUTIONS ===== */}
              {advisorWeather && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(14, 165, 233, 0.05))',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '16px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <CloudRain size={20} style={{ color: '#38bdf8' }} />
                    <h4 style={{ margin: 0, fontSize: '1rem', color: '#38bdf8' }}>
                      {tr('🌦️ हवामान आधारित खबरदारी', '🌦️ मौसम आधारित सावधानियां', '🌦️ Climate & Weather Precautions')}
                    </h4>
                  </div>

                  {/* Current Weather Summary */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                    gap: '8px',
                    marginBottom: '14px',
                  }}>
                    <div style={{ background: 'rgba(15, 23, 42, 0.5)', borderRadius: '8px', padding: '8px 10px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '2px' }}>
                        {tr('तापमान', 'तापमान', 'Temperature')}
                      </div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: advisorWeather.temperature >= 30 ? '#fbbf24' : '#67e8f9' }}>
                        {advisorWeather.temperature}°C
                      </div>
                    </div>
                    <div style={{ background: 'rgba(15, 23, 42, 0.5)', borderRadius: '8px', padding: '8px 10px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '2px' }}>
                        {tr('आर्द्रता', 'नमी', 'Humidity')}
                      </div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: advisorWeather.humidity >= 78 ? '#fb923c' : '#67e8f9' }}>
                        {advisorWeather.humidity}%
                      </div>
                    </div>
                    <div style={{ background: 'rgba(15, 23, 42, 0.5)', borderRadius: '8px', padding: '8px 10px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '2px' }}>
                        {tr('पाऊस', 'बारिश', 'Rainfall')}
                      </div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: advisorWeather.rainfall >= 15 ? '#f87171' : '#67e8f9' }}>
                        {advisorWeather.rainfall} mm
                      </div>
                    </div>
                    <div style={{ background: 'rgba(15, 23, 42, 0.5)', borderRadius: '8px', padding: '8px 10px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '2px' }}>
                        {tr('वारा', 'हवा', 'Wind')}
                      </div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: advisorWeather.windSpeed >= 12 ? '#fbbf24' : '#67e8f9' }}>
                        {advisorWeather.windSpeed} km/h
                      </div>
                    </div>
                  </div>

                  {/* Forecast */}
                  <div style={{ fontSize: '0.82rem', color: '#7dd3fc', marginBottom: '12px', fontStyle: 'italic' }}>
                    📡 {tr('अंदाज:', 'पूर्वानुमान:', 'Forecast:')} {advisorWeather.forecast}
                  </div>

                  {/* Climate-Based Precautions List */}
                  <div style={{ background: 'rgba(15, 23, 42, 0.5)', borderRadius: '8px', padding: '12px 14px' }}>
                    <h4 style={{ fontSize: '0.88rem', color: '#38bdf8', margin: '0 0 8px 0' }}>
                      <ShieldAlert size={15} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                      {tr('हवामानानुसार पाळायच्या पायऱ्या:', 'मौसम के अनुसार पालन करने योग्य कदम:', 'Steps to Follow Based on Weather:')}
                    </h4>
                    <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.7', listStyle: 'none' }}>

                      {/* High Humidity Precaution */}
                      {advisorWeather.humidity >= 75 && (
                        <li style={{ marginBottom: '6px' }}>
                          <span style={{ color: '#fb923c', fontWeight: 700 }}>💧 {tr('उच्च आर्द्रता', 'उच्च नमी', 'High Humidity')} ({advisorWeather.humidity}%):</span>{' '}
                          {tr(
                            'बुरशीजन्य रोगांचा धोका वाढतो. पाने कोरडी ठेवा. सापळे ओल्या ठिकाणांपासून दूर ठेवा. सकाळी पाणी द्या जेणेकरून दुपारपर्यंत पाने सुकतील.',
                            'फंगल रोगों का खतरा बढ़ जाता है। पत्तियां सूखी रखें। ट्रैप गीली जगहों से दूर रखें। सुबह पानी दें ताकि दोपहर तक पत्तियां सूख जाएं।',
                            'Fungal disease risk increases. Keep foliage dry. Place traps away from wet spots. Water in the morning so leaves dry by noon.'
                          )}
                        </li>
                      )}

                      {/* Heavy Rain Precaution */}
                      {advisorWeather.rainfall >= 10 && (
                        <li style={{ marginBottom: '6px' }}>
                          <span style={{ color: '#f87171', fontWeight: 700 }}>🌧️ {tr('जोरदार पाऊस', 'भारी बारिश', 'Heavy Rain')} ({advisorWeather.rainfall} mm):</span>{' '}
                          {tr(
                            'पावसामुळे चिकट सापळे धुतले जाऊ शकतात. पावसानंतर सापळे तपासा आणि बदला. सापळ्यांना पावसापासून संरक्षण द्या किंवा छताखाली ठेवा.',
                            'बारिश से चिपचिपे ट्रैप धुल सकते हैं। बारिश के बाद ट्रैप जांचें और बदलें। ट्रैप को बारिश से बचाएं या छत के नीचे रखें।',
                            'Rain can wash off sticky traps. Check and replace traps after rain. Shelter traps under a small canopy or reposition after heavy showers.'
                          )}
                        </li>
                      )}

                      {/* High Temperature Precaution */}
                      {advisorWeather.temperature >= 30 && (
                        <li style={{ marginBottom: '6px' }}>
                          <span style={{ color: '#fbbf24', fontWeight: 700 }}>🌡️ {tr('उच्च तापमान', 'उच्च तापमान', 'High Temperature')} ({advisorWeather.temperature}°C):</span>{' '}
                          {tr(
                            'उष्ण हवामानामुळे किडींची हालचाल वाढते. सापळे दर २ दिवसांनी तपासा. सकाळी व संध्याकाळी पिकाचे निरीक्षण करा कारण किडी या वेळी सर्वात सक्रिय असतात.',
                            'गर्म मौसम से कीटों की गतिविधि बढ़ती है। ट्रैप हर 2 दिन में जांचें। सुबह और शाम को फसल की निगरानी करें क्योंकि कीट इस समय सबसे अधिक सक्रिय होते हैं।',
                            'Hot weather increases pest activity. Check traps every 2 days instead of 3. Scout crops early morning and evening when pests are most active.'
                          )}
                        </li>
                      )}

                      {/* Strong Wind Precaution */}
                      {advisorWeather.windSpeed >= 10 && (
                        <li style={{ marginBottom: '6px' }}>
                          <span style={{ color: '#a78bfa', fontWeight: 700 }}>💨 {tr('जोरदार वारा', 'तेज़ हवा', 'Strong Wind')} ({advisorWeather.windSpeed} km/h):</span>{' '}
                          {tr(
                            'वाऱ्यामुळे सापळे उडू शकतात. सापळे बांबूच्या काठीला घट्ट बांधा. वाऱ्याच्या दिशेला सापळे ठेवा जेणेकरून उडणाऱ्या किडी अडकतील.',
                            'हवा से ट्रैप उड़ सकते हैं। ट्रैप को बांस की छड़ी से मजबूती से बांधें। हवा की दिशा में ट्रैप लगाएं ताकि उड़ने वाले कीट फंसें।',
                            'Wind can displace traps. Secure traps firmly to bamboo sticks. Position traps on the windward side so flying pests are intercepted.'
                          )}
                        </li>
                      )}

                      {/* Moderate / Normal Weather */}
                      {advisorWeather.humidity < 75 && advisorWeather.rainfall < 10 && advisorWeather.temperature < 30 && advisorWeather.windSpeed < 10 && (
                        <li style={{ marginBottom: '6px' }}>
                          <span style={{ color: '#4ade80', fontWeight: 700 }}>✅ {tr('सामान्य हवामान', 'सामान्य मौसम', 'Normal Conditions')}:</span>{' '}
                          {tr(
                            'हवामान पिकासाठी अनुकूल आहे. नियमित निरीक्षण सुरू ठेवा. दर ३ दिवसांनी सापळा तपासा.',
                            'मौसम फसल के लिए अनुकूल है। नियमित निगरानी जारी रखें। हर 3 दिन में ट्रैप जांचें।',
                            'Weather conditions are favorable. Continue routine crop scouting. Check traps every 3 days as planned.'
                          )}
                        </li>
                      )}

                      {/* General Precautions Always Shown */}
                      <li style={{ marginBottom: '6px' }}>
                        <span style={{ color: '#93c5fd', fontWeight: 700 }}>🛡️ {tr('सामान्य खबरदारी:', 'सामान्य सावधानी:', 'General Precaution:')}</span>{' '}
                        {tr(
                          'शेतातील तण काढा कारण ते किडींना आश्रय देतात. सापळ्यांजवळ कीटनाशक फवारणी टाळा कारण ते सापळ्यांची प्रभावीता कमी करते.',
                          'खेत से खरपतवार हटाएं क्योंकि वे कीटों को आश्रय देते हैं। ट्रैप के पास कीटनाशक छिड़काव से बचें क्योंकि यह ट्रैप की प्रभावशीलता कम करता है।',
                          'Remove weeds from the field as they harbor pests. Avoid pesticide spraying near traps as it reduces trap effectiveness.'
                        )}
                      </li>
                      <li>
                        <span style={{ color: '#93c5fd', fontWeight: 700 }}>📸 {tr('निरीक्षण नोंदवा:', 'निगरानी रिकॉर्ड करें:', 'Record Observations:')}</span>{' '}
                        {tr(
                          'प्रत्येक तपासणीत सापळ्याचा फोटो AgriNex AI वर अपलोड करा. AI कीड संख्येतील बदल ट्रॅक करेल आणि पुढील मार्गदर्शन देईल.',
                          'हर जांच में ट्रैप का फोटो AgriNex AI पर अपलोड करें। AI कीट संख्या में बदलाव ट्रैक करेगा और आगे मार्गदर्शन देगा।',
                          'Upload a trap photo to AgriNex AI at each check. AI will track pest count changes and provide further guidance.'
                        )}
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* 3-Day Reminder Banner */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(234, 88, 12, 0.1))',
                border: '2px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <Bell size={20} style={{ color: '#fbbf24' }} />
                  <h4 style={{ margin: 0, fontSize: '1rem', color: '#fbbf24' }}>
                    {tr('🔔 ३ दिवसांनी तपासणी करा', '🔔 3 दिन बाद जांच करें', '🔔 Check in 3 Days')}
                  </h4>
                  <span style={{
                    background: '#f59e0b',
                    color: '#000',
                    borderRadius: '20px',
                    padding: '2px 10px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    marginLeft: 'auto',
                  }}>
                    {tr('सूचना पाठवली ✓', 'सूचना भेजी ✓', 'NOTIFIED ✓')}
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#fde68a', margin: '0 0 10px 0' }}>
                  {tr(
                    '३ दिवसांनंतर सापळ्याचा फोटो अपलोड करा आणि कीड नियंत्रणात आहे का ते तपासा. AgriNex AI तुम्हाला आठवण करून देईल.',
                    '3 दिन बाद ट्रैप का फोटो अपलोड करें और देखें कि कीट नियंत्रण में है या नहीं। AgriNex AI आपको याद दिलाएगा।',
                    'After 3 days, upload a photo of your trap to see if pest activity is reducing. AgriNex AI will remind you.'
                  )}
                </p>
                <button
                  className="btn btn-secondary"
                  onClick={() => setCurrentStep('upload_trap')}
                  style={{ background: '#d97706', borderColor: '#b45309', color: '#fff' }}
                >
                  <Camera size={16} />
                  <span>{tr('सापळा बसवला? फोटो अपलोड करा', 'ट्रैप लगाया? फोटो अपलोड करें', 'Trap Installed? Upload Photo Now')}</span>
                </button>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-outline"
                  onClick={() => setAdvisorSubStep('upload')}
                >
                  <Upload size={14} /> {tr('दुसरा फोटो वापरा', 'दूसरा फोटो उपयोग करें', 'Try Another Photo')}
                </button>
                <button className="btn btn-outline" onClick={resetToMainMenu}>
                  {tr('मुख्य मेनूवर जा', 'मुख्य मेनू पर जाएं', 'Back to Main Menu')}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================
          CASE A: CROP HEALTH ISSUE / DISEASE DETECTED
          (No visible pest present)
          ============================================================ */}
      {currentStep === 'leaf_disease_result' && unifiedResult && (
        <div className="result-container animate-fade-in">
          <div className="cond-card disease-primary-card">
            <div className="cond-card-header">
              <div className="cond-header-title">
                <div className="icon-badge badge-disease">
                  <Leaf size={22} />
                </div>
                <div>
                  <span className="cond-type-tag">
                    {tr('🌿 पिकात आरोग्य समस्या आढळली', '🌿 फसल में स्वास्थ्य समस्या पाई गई', '🌿 CROP HEALTH ISSUE DETECTED')}
                  </span>
                  <h2 className="cond-main-name">{unifiedResult.name}</h2>
                </div>
              </div>

              <div className="cond-header-badges">
                <span className="confidence-pill">
                  <ShieldCheck size={14} /> {Math.round(unifiedResult.confidence * 100)}% {t('Confidence', language)}
                </span>
                <span className={`severity-pill severity-${unifiedResult.severity.toLowerCase()}`}>
                  {unifiedResult.severity} {tr('तीव्रता', 'गंभीरता', 'Severity')}
                </span>
              </div>
            </div>

            <p className="cond-explanation-text">
              <strong>{tr('लक्षण: ', 'लक्षण: ', 'Symptom: ')}</strong>
              {unifiedResult.explanation}
            </p>

            {weatherNote && (
              <div className="farmer-weather-note" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'rgba(59, 130, 246, 0.08)', borderRadius: '8px', marginTop: '14px', fontSize: '0.88rem' }}>
                <CloudRain size={16} className="text-blue" />
                <span>🌤️ {weatherNote}</span>
              </div>
            )}
          </div>

          {/* Visual evidence */}
          <div className="cond-card visual-evidence-card">
            <div className="card-section-title">
              <Eye size={18} className="text-green" />
              <h3>{tr('दृश्य पुरावा', 'दृश्य साक्ष्य', 'Visual Evidence')}</h3>
            </div>
            <div className="evidence-grid">
              <div className="evidence-image-container">
                {imageData ? (
                  <div className="evidence-img-frame">
                    <img src={imageData} alt="Analyzed Leaf" />
                  </div>
                ) : (
                  <div className="evidence-placeholder">🌿</div>
                )}
              </div>
              <div className="evidence-meta-panel">
                <div className="meta-row">
                  <span className="meta-label">{t('common.crop', language)}:</span>
                  <strong className="meta-value">🌾 {crop}</strong>
                </div>
                <div className="meta-row">
                  <span className="meta-label">{tr('बाधित भाग:', 'प्रभावित क्षेत्र:', 'Affected Area:')}</span>
                  <span className="status-badge-inline">
                    {unifiedResult.affectedRegion || tr('पानाचा १५% भाग', 'पत्ती का 15% भाग', '15% of visible leaf area')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Precautions: What should you do? (3-5 items) */}
          <div className="cond-card precautions-card">
            <div className="card-section-title">
              <ShieldAlert size={18} className="text-orange" />
              <h3>{tr('तुम्ही काय करावे?', 'आपको क्या करना चाहिए?', 'WHAT SHOULD YOU DO?')}</h3>
            </div>
            <ul className="precaution-list">
              <li className="precaution-item">
                <span className="item-num">1</span>
                <span>{tr('तीव्र बाधित पाने व फांद्या काढून शेताबाहेर नष्ट करा.', 'अधिक प्रभावित पत्तियों और टहनियों को हटाकर नष्ट करें।', 'Remove severely affected plant parts where appropriate.')}</span>
              </li>
              <li className="precaution-item">
                <span className="item-num">2</span>
                <span>{tr('शेतात स्वच्छता राखा आणि पडलेला कचरा साफ करा.', 'खेत में स्वच्छता बनाए रखें और गिरे पत्तों को साफ करें।', 'Maintain field cleanliness and sanitation.')}</span>
              </li>
              <li className="precaution-item">
                <span className="item-num">3</span>
                <span>{tr('रोग पसरू नये म्हणून जवळच्या झाडांवर लक्ष ठेवा.', 'रोग का फैलाव रोकने के लिए आसपास के पौधों की निगरानी करें।', 'Monitor nearby plants in adjacent rows.')}</span>
              </li>
              <li className="precaution-item">
                <span className="item-num">4</span>
                <span>{tr('स्थानिक प्रमाणित कृषी मार्गदर्शनानुसार उपचार करा.', 'स्थानीय प्रमाणित कृषि मार्गदर्शन के अनुसार उपचार करें।', 'Follow verified local agricultural guidance.')}</span>
              </li>
              <li className="precaution-item">
                <span className="item-num">5</span>
                <span>{tr('३ ते ४ दिवसांनी पुन्हा पिकाची पाहणी करा.', '3 से 4 दिन बाद पुनः फसल की जांच करें।', 'Recheck the crop after 3 to 4 days of monitoring.')}</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="cond-footer-actions" style={{ marginTop: '20px' }}>
            <button
              className="btn btn-primary"
              onClick={() => {
                setCurrentStep('upload_leaf');
                setImageData('');
              }}
            >
              <RotateCcw size={16} /> {tr('🔄 पुन्हा निरीक्षण करा', '🔄 पुन: निगरानी करें', '🔄 Monitor Again')}
            </button>
            {!saved ? (
              <button className="btn btn-secondary" onClick={handleSaveDiagnosis}>
                <Save size={16} /> {tr('निदान जतन करा', 'निदान सहेजें', 'Save Diagnosis')}
              </button>
            ) : (
              <span className="saved-badge"><Check size={16} /> {tr('जतन केले', 'सहेजा गया', 'Saved')}</span>
            )}
            <button className="btn btn-outline" onClick={resetToMainMenu}>
              <PlusCircle size={16} /> {tr('नवीन तपासणी', 'नई जांच', 'New Diagnosis')}
            </button>
          </div>
        </div>
      )}

      {/* ============================================================
          CASE B: VISIBLE PEST PRESENT
          Shows Pest Info + Interactive Questions:
          "Did you notice a pest on your crop? [YES] [NO]"
          "Do you use a pest trap on your farm? [YES] [NO]"
          ============================================================ */}
      {currentStep === 'leaf_pest_result' && unifiedResult && (
        <div className="result-container animate-fade-in">
          {/* Pest Detected Banner */}
          <div className="cond-card pest-primary-card">
            <div className="cond-card-header">
              <div className="cond-header-title">
                <div className="icon-badge badge-pest">
                  <Bug size={24} />
                </div>
                <div>
                  <span className="cond-type-tag">
                    {tr('🐛 दृश्य कीड आढळली', '🐛 प्रत्यक्ष कीट पाया गया', '🐛 VISIBLE PEST DETECTED')}
                  </span>
                  <h2 className="cond-main-name">{unifiedResult.name}</h2>
                </div>
              </div>

              <div className="cond-header-badges">
                <span className="confidence-pill">
                  <ShieldCheck size={14} /> {Math.round(unifiedResult.confidence * 100)}% {t('Confidence', language)}
                </span>
                <span className="severity-pill severity-moderate">
                  {unifiedResult.severity} {tr('पातळी', 'स्तर', 'Activity')}
                </span>
              </div>
            </div>

            <div className="pest-stats-strip">
              <div className="pest-stat-box">
                <span className="pest-stat-label">{tr('किडीचा प्रकार', 'कीट का प्रकार', 'Pest Type')}</span>
                <strong className="pest-stat-value">{unifiedResult.name}</strong>
              </div>

              <div className="pest-stat-box highlight-count">
                <span className="pest-stat-label">{tr('फोटोत दिसणारी कीड संख्या', 'फोटो में दृश्य कीट संख्या', 'Clearly Visible Pests in Image')}</span>
                <strong className="pest-stat-value count-accent">{unifiedResult.visible_count || 4} {tr('दिसणारे', 'दृश्यमान', 'visible')}</strong>
                <small className="pest-stat-sub">
                  ⚠️ {tr('फक्त या फोटोतील मोजणी (संपूर्ण शेताची नाही)', 'केवल इस फोटो में गिनती (पूरे खेत की नहीं)', 'In this uploaded photo only')}
                </small>
              </div>
            </div>

            <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '8px', padding: '10px 14px', marginTop: '12px', color: '#86efac', fontSize: '0.9rem' }}>
              ✓ {tr('आम्हाला या फोटोमध्ये संभाव्य कीड आढळली आहे.', 'हमें इस फोटो में एक संभावित कीट मिला है।', 'We detected a possible pest in this image.')}
            </div>
          </div>

          {/* Visual Evidence */}
          <div className="cond-card visual-evidence-card">
            <div className="card-section-title">
              <Eye size={18} className="text-orange" />
              <h3>{tr('किडीचे स्थान व दृश्य पुरावा', 'कीट का स्थान एवं साक्ष्य', 'Uploaded Leaf Image with Highlighted Pest')}</h3>
            </div>
            <div className="evidence-grid">
              <div className="evidence-image-container">
                {imageData ? (
                  <div className="evidence-img-frame">
                    <img src={imageData} alt="Analyzed Pest" />
                    <div
                      className="pest-marker-box"
                      style={{
                        left: '20%',
                        top: '22%',
                        width: '58%',
                        height: '55%',
                      }}
                    >
                      <span className="marker-label pest-label">
                        🐛 {unifiedResult.name} ({unifiedResult.visible_count || 4} {tr('दिसणारे', 'दृश्य', 'visible')})
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="evidence-placeholder">🐛</div>
                )}
              </div>
              <div className="evidence-meta-panel">
                <div className="meta-row">
                  <span className="meta-label">{t('common.crop', language)}:</span>
                  <strong className="meta-value">🌾 {crop}</strong>
                </div>
                <div className="meta-row">
                  <span className="meta-label">{tr('दिसणारी संख्या:', 'दृश्यमान संख्या:', 'Visible count:')}</span>
                  <span className="status-badge-inline orange">
                    {unifiedResult.visible_count || 4} {tr('कीटक', 'कीट', 'pests')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================
              CASE B INTERACTIVE QUESTIONS:
              1. "Did you notice a pest on your crop? [YES] [NO]"
              2. "Do you use a pest trap on your farm? [YES] [NO]"
              ============================================================ */}
          <div className="pest-question-box">
            <h4>
              <span>❓</span>
              {tr('कीड व्यवस्थापन चौकशी', 'कीट प्रबंधन पूछताछ', 'Pest Management Questions')}
            </h4>

            {/* Question 1 */}
            <div className="question-group" style={{ borderTop: 'none', paddingTop: 0 }}>
              <span className="question-label">
                1. {tr('आपल्या पिकावर आपल्याला कीड दिसली का?', 'क्या आपने अपनी फसल पर कीट देखा?', 'Did you notice a pest on your crop?')}
              </span>
              <div className="question-btn-row">
                <button
                  type="button"
                  className={`choice-btn ${noticedPestAnswer === 'yes' ? 'yes' : 'no'}`}
                  onClick={() => setNoticedPestAnswer('yes')}
                >
                  ✓ {tr('होय, दिसली', 'हाँ, दिखा', 'YES')}
                </button>
                <button
                  type="button"
                  className={`choice-btn ${noticedPestAnswer === 'no' ? 'yes' : 'no'}`}
                  onClick={() => setNoticedPestAnswer('no')}
                >
                  ✕ {tr('नाही', 'नहीं', 'NO')}
                </button>
              </div>
            </div>

            {/* Question 2 */}
            <div className="question-group">
              <span className="question-label">
                2. {tr('आपण आपल्या शेतात कीड सापळा (Pest Trap) वापरता का?', 'क्या आप अपने खेत में कीट ट्रैप (Pest Trap) का उपयोग करते हैं?', 'Do you use a pest trap on your farm?')}
              </span>
              <div className="question-btn-row">
                <button
                  type="button"
                  className="choice-btn yes"
                  style={{ fontSize: '1rem', padding: '12px 24px' }}
                  onClick={() => {
                    setUsesPestTrapAnswer('yes');
                    setCurrentStep('upload_trap');
                  }}
                >
                  🪤 {tr('होय — मी कीड सापळा वापरतो', 'हाँ — मैं कीट ट्रैप का उपयोग करता हूँ', 'YES — I use a pest trap')}
                </button>

                <button
                  type="button"
                  className="choice-btn no"
                  style={{ fontSize: '1rem', padding: '12px 24px' }}
                  onClick={() => {
                    setUsesPestTrapAnswer('no');
                    setCurrentStep('trap_recommendation');
                  }}
                >
                  ✕ {tr('नाही — मी सापळा वापरत नाही', 'नहीं — मैं ट्रैप का उपयोग नहीं करता', "NO — I don't use a pest trap")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          IF FARMER SELECTS NO: DOES NOT USE PEST TRAP
          Shows:
          - 🪤 PEST MONITORING RECOMMENDATION
          - Suggested trap + Why
          - 📅 Monitor the trap for the next few days (NEXT CHECK: After 3 days)
          - 🔔 PEST TRAP CHECK REMINDER
          ============================================================ */}
      {currentStep === 'trap_recommendation' && trapRecommendation && (
        <div className="diagnosis-form-container animate-fade-in">
          <div className="workflow-step-nav">
            <button className="workflow-back-btn" onClick={() => setCurrentStep('leaf_pest_result')}>
              <ChevronLeft size={16} /> {tr('मागे जा', 'पीछे जाएं', 'Back to Pest Result')}
            </button>
            <span style={{ fontSize: '0.85rem', color: '#f59e0b' }}>
              🪤 {tr('सापळा शिफारस', 'ट्रैप अनुशंसा', 'Trap Recommendation')}
            </span>
          </div>

          <div className="cond-card" style={{ borderTop: '4px solid #f59e0b' }}>
            <h2 style={{ fontSize: '1.25rem', color: '#fbbf24', marginBottom: '8px' }}>
              🪤 {tr('कीड नियंत्रण व सापळा शिफारस', 'कीट निगरानी एवं ट्रैप अनुशंसा', 'PEST MONITORING RECOMMENDATION')}
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#cbd5e1', marginBottom: '16px' }}>
              {tr(
                'आढळलेल्या किडीच्या आधारे, योग्य कीड सापळ्याचा वापर करून नियमित निरीक्षण केल्याने किडीच्या हालचालींवर बारीक लक्ष ठेवण्यास मदत होईल.',
                'पहचाने गए कीट के आधार पर, उपयुक्त कीट ट्रैप से नियमित निगरानी करने से आपको कीट गतिविधि को ट्रैक करने में मदद मिलेगी।',
                'Based on the detected pest, regular monitoring with an appropriate pest trap may help you track pest activity.'
              )}
            </p>

            <div className="trap-recommendation-box">
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fbbf24', marginBottom: '6px' }}>
                💡 {tr('सुचवलेला सापळा:', 'सुझाया गया ट्रैप:', 'Suggested Trap:')} <strong>{trapRecommendation.trapType}</strong>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '12px' }}>
                <strong>WHY? </strong> {trapRecommendation.whyReason}
              </div>

              <button
                type="button"
                className="btn btn-outline"
                style={{ fontSize: '0.85rem', padding: '6px 14px', marginBottom: '14px' }}
                onClick={() => setShowTrapGuidanceModal(!showTrapGuidanceModal)}
              >
                📖 {showTrapGuidanceModal ? tr('मार्गदर्शन लपवा', 'मार्गदर्शन छुपाएं', 'Hide Trap Guidance') : tr('साधे सापळा मार्गदर्शन पहा', 'सरल ट्रैप मार्गदर्शन देखें', 'View Simple Trap Guidance')}
              </button>

              {showTrapGuidanceModal && (
                <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '14px', borderRadius: '8px', marginBottom: '14px' }}>
                  <h4 style={{ fontSize: '0.9rem', color: '#fcd34d', margin: '0 0 6px 0' }}>
                    {tr('सापळा कसा वापरावा:', 'ट्रैप का उपयोग कैसे करें:', 'How to Use This Trap:')}
                  </h4>
                  <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                    <li><strong>{tr('कोणता सापळा:', 'कौन सा ट्रैप:', 'What type:')}</strong> {trapRecommendation.trapType}</li>
                    <li><strong>{tr('कुठे लावावा:', 'कहाँ लगाएं:', 'Where to place:')}</strong> {trapRecommendation.installationTip}</li>
                    <li><strong>{tr('काय तपासावे:', 'क्या देखें:', 'What to monitor:')}</strong> {trapRecommendation.primaryPest}</li>
                  </ul>
                </div>
              )}

              {/* Continuous Monitoring Schedule & Automated Reminder */}
              <div className="trap-check-reminder-card">
                <div className="reminder-header-row">
                  <Calendar size={20} className="text-amber" />
                  <h4>{tr('📅 सापळ्याचे पुढील काही दिवस निरीक्षण करा', '📅 ट्रैप की अगले कुछ दिन निगरानी करें', '📅 Monitor the trap for the next few days.')}</h4>
                  <span className="schedule-pill">{tr('पुढील तपासणी: ३ दिवसांनंतर', 'अगली जांच: 3 दिन बाद', 'NEXT CHECK: After 3 days')}</span>
                </div>
                <p style={{ fontSize: '0.88rem', color: '#cbd5e1', margin: '8px 0 14px 0' }}>
                  {tr(
                    'आपल्या शेतात सापळा लावा आणि ३ दिवसांनी त्याचा फोटो घ्या.',
                    'अपने खेत में ट्रैप लगाएं और 3 दिनों के बाद उसकी फोटो लें।',
                    'Place the trap on your farm and take a photo after 3 days.'
                  )}
                </p>

                {/* Reminder Notification Box */}
                <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: '10px', padding: '14px 16px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontWeight: 800, fontSize: '0.92rem', marginBottom: '6px' }}>
                    <Bell size={18} />
                    <span>{tr('🔔 कीड सापळा तपासणी स्मरणपत्र', '🔔 कीट ट्रैप जांच रिमाइंडर', '🔔 PEST TRAP CHECK REMINDER')}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
                    "{tr(
                      'आपल्या कीड सापळ्याची तपासणी करण्याची वेळ झाली आहे. AgriNex AI द्वारे कीड हालचालींचे निरीक्षण करण्यासाठी सापळ्याचा स्पष्ट फोटो अपलोड करा.',
                      'अपने कीट ट्रैप की जांच करने का समय हो गया है। AgriNex AI द्वारा कीट गतिविधि की निगरानी हेतु ट्रैप की स्पष्ट फोटो अपलोड करें।',
                      "It's time to check your pest trap. Upload a clear photo of your trap so AgriNex AI can monitor pest activity."
                    )}"
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setCurrentStep('upload_trap');
                    }}
                    style={{ background: '#d97706', borderColor: '#b45309' }}
                  >
                    <Camera size={16} />
                    <span>{tr('🪤 सापळ्याचा फोटो अपलोड करा', '🪤 कीट ट्रैप की फोटो अपलोड करें', 'Upload Pest Trap Image')}</span>
                  </button>

                  {!scheduleReminderSaved ? (
                    <button className="btn btn-secondary" onClick={handleCreateTrapReminder}>
                      <Bell size={16} /> {tr('३ दिवसांचे स्मरणपत्र सेट करा', '3 दिन का रिमाइंडर सेट करें', 'Save 3-Day Reminder')}
                    </button>
                  ) : (
                    <span className="saved-badge"><Check size={16} /> {tr('स्मरणपत्र सेट केले', 'रिमाइंडर सेट हुआ', 'Reminder Set in Notifications')}</span>
                  )}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <button className="btn btn-outline" onClick={resetToMainMenu}>
                {tr('मुख्य मेनूवर परत जा', 'मुख्य मेनू पर वापस जाएं', 'Back to Main Menu')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          PEST TRAP RESULT
          Shows:
          - Trap type
          - Possible pest
          - "12 visible insects in this trap image" (NEVER "Your field has 12 pests")
          - Activity: Moderate
          - Repeat monitoring comparison
          - WHAT SHOULD YOU DO?
          ============================================================ */}
      {currentStep === 'trap_result' && unifiedResult && (
        <div className="result-container animate-fade-in">
          {/* Repeat Monitoring Comparison Banner (if available) */}
          {trapComparisonMsg && (
            <div className="followup-comparison-banner trend-good" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <TrendingDown size={22} className="text-green" />
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.98rem' }}>
                    {tr('🔄 सापळा फेरतपासणी तुलना', '🔄 ट्रैप पुन: परीक्षण तुलना', 'Trap Re-Scan Comparison')}
                  </h4>
                  <p style={{ margin: '4px 0 0', fontWeight: 600, fontSize: '0.92rem' }}>
                    {trapComparisonMsg}
                  </p>
                  <small style={{ color: '#94a3b8', display: 'block', marginTop: '4px' }}>
                    ⚠️ {tr(
                      'नोंद: ही तुलना फक्त अपलोड केलेल्या सापळ्यांच्या फोटोंवर आधारित आहे (संपूर्ण शेतातील कीड संख्या नाही).',
                      'नोट: यह तुलना केवल अपलोड की गई ट्रैप फोटो पर आधारित है (पूरे खेत की नहीं)।',
                      'Note: Comparison applies to visible insects in uploaded trap images only (not a field-wide census).'
                    )}
                  </small>
                </div>
              </div>
            </div>
          )}

          <div className="cond-card trap-primary-card" style={{ borderTop: '4px solid #f59e0b' }}>
            <div className="cond-card-header">
              <div className="cond-header-title">
                <div className="icon-badge" style={{ background: '#fef3c7', color: '#b45309' }}>
                  🪤
                </div>
                <div>
                  <span className="cond-type-tag" style={{ color: '#b45309' }}>
                    {tr('🪤 कीड सापळा निकाल', '🪤 कीट ट्रैप परिणाम', 'PEST TRAP RESULT')}
                  </span>
                  <h2 className="cond-main-name">{unifiedResult.trap_type || unifiedResult.name}</h2>
                </div>
              </div>

              <div className="cond-header-badges">
                <span className="confidence-pill">
                  <ShieldCheck size={14} /> {Math.round(unifiedResult.confidence * 100)}% {t('Confidence', language)}
                </span>
                <span className="status-badge-inline orange">
                  {tr('मध्यम हालचाल', 'मध्यम गतिविधि', 'Moderate Activity')}
                </span>
              </div>
            </div>

            <div className="pest-stats-strip">
              <div className="pest-stat-box">
                <span className="pest-stat-label">{tr('सापळ्याचा प्रकार', 'ट्रैप का प्रकार', 'Trap Type')}</span>
                <strong className="pest-stat-value">{unifiedResult.trap_type || unifiedResult.name}</strong>
              </div>

              <div className="pest-stat-box">
                <span className="pest-stat-label">{tr('संभाव्य कीड', 'संभावित कीट', 'Possible Pest')}</span>
                <strong className="pest-stat-value" style={{ color: '#d97706' }}>{unifiedResult.pest_type || 'Whitefly'}</strong>
              </div>

              <div className="pest-stat-box highlight-count">
                <span className="pest-stat-label">{tr('फोटोत दिसणारे कीटक', 'फोटो में दृश्य कीट', 'Visible insects')}</span>
                <strong className="pest-stat-value count-accent">
                  {unifiedResult.visible_count || 12} {tr('कीटक या फोटोत', 'कीट इस फोटो में', 'in this trap image')}
                </strong>
                <small className="pest-stat-sub">
                  ⚠️ {tr(
                    'फक्त या सापळ्याच्या फोटोतील मोजणी (शेतातील एकूण संख्या नाही)',
                    'केवल इस ट्रैप फोटो में गिनती (खेत की कुल संख्या नहीं)',
                    'Visible insects in this trap image (NOT total pests in your field)'
                  )}
                </small>
              </div>
            </div>
          </div>

          {/* Visual evidence */}
          <div className="cond-card visual-evidence-card">
            <div className="card-section-title">
              <Eye size={18} className="text-amber" />
              <h3>{tr('सापळ्याचा दृश्य पुरावा', 'ट्रैप का दृश्य साक्ष्य', 'Trap Image & Insect Count Surveillance')}</h3>
            </div>
            <div className="evidence-grid">
              <div className="evidence-image-container">
                {imageData ? (
                  <div className="evidence-img-frame">
                    <img src={imageData} alt="Analyzed Trap" />
                  </div>
                ) : (
                  <div className="evidence-placeholder">🪤</div>
                )}
              </div>
              <div className="evidence-meta-panel">
                <div className="meta-row">
                  <span className="meta-label">{tr('तपासणी स्थिती:', 'निरीक्षण स्थिति:', 'Surveillance Status:')}</span>
                  <span className="status-badge-inline orange">
                    {tr('कीड हालचालींचे निरीक्षण सुरू ठेवा', 'कीट गतिविधि की निगरानी जारी रखें', 'Monitor pest activity')}
                  </span>
                </div>
                <p className="meta-desc">
                  {tr(
                    'सापळे हवेतील कीटकांचे नमुने टिपतात. एका सापळ्याचा फोटो म्हणजे संपूर्ण शेतातील कीड नाही, म्हणून पिकाचे नुकसान पाहिल्याशिवाय फवारणी करू नका.',
                    'ट्रैप उड़ने वाले कीटों का नमूना लेते हैं। एक फोटो पूरे खेत की संख्या नहीं दर्शाती, इसलिए फसल नुकसान देखे बिना कीटनाशक न छिड़कें।',
                    'A trap image only represents what is visible in that image. Never treat one trap image as a total field census.'
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* WHAT SHOULD YOU DO? */}
          <div className="cond-card precautions-card">
            <div className="card-section-title">
              <ShieldAlert size={18} className="text-orange" />
              <h3>{tr('तुम्ही काय करावे?', 'आपको क्या करना चाहिए?', 'WHAT SHOULD YOU DO?')}</h3>
            </div>
            <ul className="precaution-list">
              <li className="precaution-item">
                <span className="item-num">1</span>
                <span>{tr('सापळ्याचे नियमित निरीक्षण सुरू ठेवा.', 'ट्रैप की नियमित निगरानी जारी रखें।', 'Continue monitoring the trap regularly.')}</span>
              </li>
              <li className="precaution-item">
                <span className="item-num">2</span>
                <span>{tr('जवळच्या झाडांची तपासणी करा.', 'आसपास के पौधों की जांच करें।', 'Check nearby plants.')}</span>
              </li>
              <li className="precaution-item">
                <span className="item-num">3</span>
                <span>{tr('पानांवर अधिक प्रादुर्भाव आहे का ते पहा.', 'पत्तियों पर और संक्रमण है या नहीं इसकी जांच करें।', 'Inspect leaves for further infestation.')}</span>
              </li>
              <li className="precaution-item">
                <span className="item-num">4</span>
                <span>{tr('योग्य प्रमाणित कीड व्यवस्थापन पद्धतींचे पालन करा.', 'उचित प्रमाणित कीट-प्रबंधन मार्गदर्शन का पालन करें।', 'Follow appropriate verified pest-management guidance.')}</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="cond-footer-actions" style={{ marginTop: '20px' }}>
            <button
              className="btn btn-primary"
              onClick={() => {
                setCurrentStep('upload_trap');
                setImageData('');
              }}
              style={{ background: '#d97706', borderColor: '#b45309' }}
            >
              <RotateCcw size={16} /> {tr('🔄 पुन्हा निरीक्षण करा (नवीन सापळा फोटो)', '🔄 पुन: निगरानी (नया ट्रैप फोटो)', '🔄 Monitor Again (Upload Next Trap Photo)')}
            </button>
            {!saved ? (
              <button className="btn btn-secondary" onClick={handleSaveDiagnosis}>
                <Save size={16} /> {tr('निकाल जतन करा', 'परिणाम सहेजें', 'Save Trap Result')}
              </button>
            ) : (
              <span className="saved-badge"><Check size={16} /> {tr('जतन केले', 'सहेजा गया', 'Saved')}</span>
            )}
            <button className="btn btn-outline" onClick={resetToMainMenu}>
              <PlusCircle size={16} /> {tr('नवीन तपासणी', 'नई जांच', 'New Diagnosis')}
            </button>
          </div>
        </div>
      )}

      {/* ============================================================
          HEALTHY / NO ISSUE DETECTED
          ============================================================ */}
      {currentStep === 'healthy_result' && (
        <div className="result-container animate-fade-in">
          <div className="cond-card healthy-primary-card">
            <div className="healthy-hero-block">
              <div className="icon-badge badge-healthy">
                <CheckCircle2 size={36} className="text-green" />
              </div>
              <h2>{tr('✓ कोणतीही दृश्य कीड किंवा रोगाची लक्षणे आढळली नाहीत', '✓ कोई दृश्य कीट या रोग के लक्षण नहीं दिखे', '✓ No visible pest or disease symptom detected')}</h2>
              <p className="healthy-sub-text">
                {tr(
                  'आपल्या अपलोड केलेल्या फोटोमध्ये कोणतीही स्पष्ट समस्या दिसत नाही. पानाचा रंग निरोगी आहे.',
                  'आपकी अपलोड की गई फोटो में कोई स्पष्ट समस्या नहीं दिख रही है। पत्ती का रंग स्वस्थ है।',
                  'Your uploaded image does not show a clear problem.'
                )}
              </p>
            </div>

            <div className="healthy-guidance-box">
              <h4>🌱 {tr('तुम्ही काय करावे?', 'आपको क्या करना चाहिए?', 'WHAT SHOULD YOU DO?')}</h4>
              <ul>
                <li>{tr('नियमित शेत निरीक्षण सुरू ठेवा.', 'नियमित खेत निगरानी जारी रखें।', 'Continue regular field monitoring across different crop rows.')}</li>
                <li>{tr('कोणत्याही झाडावर लक्षणे आढळल्यास नवीन स्पष्ट फोटो अपलोड करा.', 'किसी पौधे पर लक्षण दिखें तो नया स्पष्ट फोटो अपलोड करें।', 'Upload another clear image if symptoms appear on any plant.')}</li>
              </ul>
            </div>

            <div className="healthy-disclaimer" style={{ background: 'rgba(234, 179, 8, 0.08)', border: '1px solid rgba(234, 179, 8, 0.25)', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Info size={18} className="text-amber" />
              <span style={{ fontSize: '0.88rem' }}>
                ⚠️ <strong>{tr('महत्त्वाची नोंद: ', 'महत्वपूर्ण सूचना: ', 'Important field notice: ')}</strong>
                {tr(
                  'AI ने फक्त या अपलोड केलेल्या फोटोचे विश्लेषण केले आहे. संपूर्ण शेतात फेरफटका मारल्याशिवाय संपूर्ण शेत निरोगी आहे असे समजू नका.',
                  'AI ने केवल इस अपलोड किए गए फोटो का विश्लेषण किया है। खेत में घूमे बिना पूरे खेत को पूर्णतः स्वस्थ न मानें।',
                  'The AI has only analyzed the uploaded image. Never assume your field is completely healthy without scouting.'
                )}
              </span>
            </div>

            <div className="cond-footer-actions center-actions" style={{ marginTop: '20px' }}>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setCurrentStep('upload_leaf');
                  setImageData('');
                }}
              >
                <Camera size={16} /> {tr('दुसऱ्या पानाचा फोटो घ्या', 'अन्य पत्ती का फोटो लें', 'Upload Another Photo')}
              </button>
              <button className="btn btn-outline" onClick={resetToMainMenu}>
                {tr('मुख्य मेनूवर परत जा', 'मुख्य मेनू पर वापस जाएं', 'Back to Main Menu')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          UNCERTAIN / LOW CONFIDENCE
          ============================================================ */}
      {currentStep === 'uncertain_result' && (
        <div className="result-container animate-fade-in">
          <div className="cond-card uncertain-primary-card">
            <div className="uncertain-hero-block">
              <div className="icon-badge badge-uncertain">
                <HelpCircle size={36} className="text-amber" />
              </div>
              <h2>{tr('⚠️ आम्ही याची खात्रीपूर्वक ओळख पटवू शकलो नाही', '⚠️ हम इसकी विश्वासपूर्वक पहचान नहीं कर सके', '⚠️ We could not identify this confidently.')}</h2>
              <p className="uncertain-sub-text">
                {tr(
                  'कृपया अधिक स्पष्ट फोटो अपलोड करा. चुकीचा उपचार टाळण्यासाठी AI जबरदस्तीने निष्कर्ष काढत नाही.',
                  'कृपया अधिक स्पष्ट फोटो अपलोड करें। गलत उपचार से बचने हेतु AI कोई जबरन निष्कर्ष नहीं देता।',
                  'Please upload a clearer image. To avoid incorrect treatment, no diagnosis is forced.'
                )}
              </p>
            </div>

            <div className="photo-tips-box">
              <h4>📷 {tr('फोटो काढण्यासाठी सोप्या सूचना:', 'फोटो खींचने के सरल निर्देश:', 'Photo Instructions:')}</h4>
              <div className="photo-tips-grid">
                <div className="photo-tip-item">
                  <span>☀️</span>
                  <strong>{tr('चांगला प्रकाश', 'अच्छा प्रकाश', 'Good Lighting')}</strong>
                  <small>{tr('नैसर्गिक प्रकाशात फोटो घ्या.', 'प्राकृतिक दिन के प्रकाश में फोटो लें।', 'Use natural daylight; avoid dark shadow.')}</small>
                </div>
                <div className="photo-tip-item">
                  <span>🔍</span>
                  <strong>{tr('स्पष्ट ठेवा', 'स्पष्ट रखें', 'Keep Visible')}</strong>
                  <small>{tr('बाधित पान किंवा कीड फ्रेममध्ये स्पष्ट ठेवा.', 'प्रभावित पत्ती या कीट को फ्रेम में रखें।', 'Keep the affected leaf/pest visible.')}</small>
                </div>
                <div className="photo-tip-item">
                  <span>📐</span>
                  <strong>{tr('अस्पष्ट टाळा', 'धुंधली से बचें', 'Avoid Blurry Images')}</strong>
                  <small>{tr('कॅमेरा स्थिर पकडा.', 'कैमरा स्थिर रखें।', 'Hold camera steady without shaking.')}</small>
                </div>
                <div className="photo-tip-item">
                  <span>🔬</span>
                  <strong>{tr('जवळून फोटो घ्या', 'क्लोज-अप लें', 'Take a Close-up')}</strong>
                  <small>{tr('१०-१५ सेमी अंतरावरून फोटो घ्या.', '10-15 सेमी की दूरी से फोटो लें।', 'Take a close-up photo.')}</small>
                </div>
              </div>
            </div>

            <div className="cond-footer-actions center-actions" style={{ marginTop: '20px' }}>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setCurrentStep('upload_leaf');
                  setImageData('');
                }}
              >
                <Camera size={16} /> {tr('स्पष्ट फोटो पुन्हा अपलोड करा', 'स्पष्ट फोटो पुन: अपलोड करें', 'Upload Clearer Image')}
              </button>
              <button className="btn btn-secondary" onClick={handleExpertRequest}>
                <UserCheck size={16} /> {tr('कृषी तज्ज्ञांची मदत घ्या', 'कृषि विशेषज्ञ से पूछें', 'Ask Expert')}
              </button>
              <button className="btn btn-outline" onClick={resetToMainMenu}>
                {tr('मुख्य मेनूवर परत जा', 'मुख्य मेनू पर जाएं', 'Back to Main Menu')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
