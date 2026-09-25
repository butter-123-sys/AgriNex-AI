// ============================================================
// AgriFedX — Demo Seed Data
// ============================================================

import type {
  Farmer, Diagnosis, CommunityAlert, AppNotification,
  Validation, ProgressRecord, Hotspot, Crop, Disease, CropStage,
} from '../types';
import {
  saveFarmers, saveDiagnosis, saveAlert, saveNotification,
  saveValidation, saveProgress, saveHotspots, markSeeded, isSeeded,
} from '../services/storageService';
import { DEMO_LOCATIONS } from '../config/demoConfig';

const FARMER_NAMES = [
  'Rajesh Patil', 'Sunil Jadhav', 'Priya Deshmukh', 'Amit Kulkarni', 'Sunita Shinde',
  'Vijay More', 'Rekha Pawar', 'Manoj Chavan', 'Kavita Gaikwad', 'Santosh Bhosale',
  'Anita Nikam', 'Rahul Kale', 'Meena Thorat', 'Prakash Salunkhe', 'Geeta Mane',
  'Arun Wagh', 'Suman Deshpande', 'Nilesh Joshi', 'Asha Sonawane', 'Deepak Ingale',
];

function daysAgo(n: number): string {
  return new Date(Date.now() - n * 86400000).toISOString();
}

function uid(prefix: string, i: number): string {
  return `${prefix}-${String(i).padStart(3, '0')}`;
}

export function seedDemoData(): void {
  if (isSeeded()) return;

  // ---- Farmers ----
  const crops: Crop[] = ['Tomato', 'Potato', 'Maize', 'Cotton', 'Soybean'];
  const farmers: Farmer[] = FARMER_NAMES.map((name, i) => {
    const loc = DEMO_LOCATIONS[i % DEMO_LOCATIONS.length];
    return {
      id: uid('farmer', i + 1),
      name,
      phone: `+91 ${90000 + i * 111} ${10000 + i * 37}`,
      district: loc.district,
      taluka: loc.taluka,
      village: loc.village,
      crops: [crops[i % 5], crops[(i + 2) % 5]],
    };
  });
  saveFarmers(farmers);

  // ---- Diagnoses (40 records) ----
  const diseasePool: { disease: Disease; confidence: number; severity: 'Low' | 'Moderate' | 'High'; risk: number }[] = [
    { disease: 'Early Blight', confidence: 94, severity: 'High', risk: 84 },
    { disease: 'Late Blight', confidence: 91, severity: 'High', risk: 76 },
    { disease: 'Healthy', confidence: 97, severity: 'Low', risk: 12 },
    { disease: 'Late Blight', confidence: 62, severity: 'Moderate', risk: 55 },
    { disease: 'Leaf Spot', confidence: 88, severity: 'Moderate', risk: 58 },
    { disease: 'Powdery Mildew', confidence: 90, severity: 'Moderate', risk: 62 },
    { disease: 'Rust', confidence: 86, severity: 'High', risk: 71 },
    { disease: 'Early Blight', confidence: 92, severity: 'High', risk: 80 },
    { disease: 'Healthy', confidence: 95, severity: 'Low', risk: 15 },
    { disease: 'Late Blight', confidence: 89, severity: 'High', risk: 74 },
  ];

  const stages: CropStage[] = ['Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Maturity'];

  const weatherData = [
    { temperature: 27, humidity: 82, rainfall: 12, windSpeed: 8, condition: 'Cloudy', forecast: 'Rain likely' },
    { temperature: 25, humidity: 74, rainfall: 8, windSpeed: 10, condition: 'Partly Cloudy', forecast: 'Light showers' },
    { temperature: 30, humidity: 68, rainfall: 4, windSpeed: 12, condition: 'Warm', forecast: 'Clear skies' },
    { temperature: 29, humidity: 78, rainfall: 15, windSpeed: 6, condition: 'Overcast', forecast: 'Heavy rain' },
    { temperature: 24, humidity: 85, rainfall: 20, windSpeed: 5, condition: 'Rainy', forecast: 'Continuous rain' },
    { temperature: 26, humidity: 80, rainfall: 18, windSpeed: 7, condition: 'Overcast', forecast: 'Intermittent rain' },
  ];

  // Dedicated Tomato inspection history for farmer-001 (User Crop)
  const userTomatoDiagnoses: Diagnosis[] = [
    {
      id: 'diag-tomato-001',
      farmerId: 'farmer-001',
      crop: 'Tomato',
      cropStage: 'Flowering',
      disease: 'Early Blight',
      confidence: 94,
      severity: 'High',
      riskScore: 78,
      riskLevel: 'HIGH',
      imageDataUrl: '',
      location: { latitude: 19.9975, longitude: 73.7898, district: 'Nashik', taluka: 'Nashik', village: 'Deolali' },
      weather: { temperature: 27, humidity: 82, rainfall: 12, windSpeed: 8, condition: 'Cloudy', forecast: 'Rain likely' },
      recommendation: {
        immediateActions: ['Spray Copper Oxychloride 50 WP (2.5 g/L)', 'Prune lower yellow leaves touching soil'],
        preventiveMeasures: ['Keep foliage dry; switch to drip irrigation only', 'Maintain good plant spacing for airflow'],
        treatmentGuidance: ['Follow agronomist verified protocol #AG-402'],
        monitoring: ['Re-scan in 3 days to audit recovery curve'],
        recheckSuggestion: 'Re-scan scheduled on 06 Sep',
      },
      explainability: {
        description: 'Concentric brown target rings detected across 68% of lower leaf surface.',
        highlightRegions: [{ x: 30, y: 25, width: 40, height: 35 }],
        gradcamAvailable: true,
      },
      validationStatus: 'CONFIRMED',
      createdAt: daysAgo(1),
    },
    {
      id: 'diag-tomato-002',
      farmerId: 'farmer-001',
      crop: 'Tomato',
      cropStage: 'Flowering',
      disease: 'Early Blight',
      confidence: 91,
      severity: 'Moderate',
      riskScore: 65,
      riskLevel: 'MEDIUM',
      imageDataUrl: '',
      location: { latitude: 19.9975, longitude: 73.7898, district: 'Nashik', taluka: 'Nashik', village: 'Deolali' },
      weather: { temperature: 27, humidity: 82, rainfall: 10, windSpeed: 9, condition: 'Overcast', forecast: 'Showers' },
      recommendation: {
        immediateActions: ['Inspect underside of foliage', 'Avoid overhead sprinkler watering'],
        preventiveMeasures: ['Ensure morning dew evaporates quickly', 'Clear weed growth around ridges'],
        treatmentGuidance: ['Contact fungicide preventive application recommended'],
        monitoring: ['Daily field walk inspection'],
        recheckSuggestion: 'Re-check in 3 days',
      },
      explainability: {
        description: 'Expanding brown lesions with yellow chlorotic halos visible.',
        highlightRegions: [{ x: 35, y: 30, width: 35, height: 30 }],
        gradcamAvailable: true,
      },
      validationStatus: 'CONFIRMED',
      createdAt: daysAgo(4),
    },
    {
      id: 'diag-tomato-003',
      farmerId: 'farmer-001',
      crop: 'Tomato',
      cropStage: 'Flowering',
      disease: 'Early Blight',
      confidence: 86,
      severity: 'Moderate',
      riskScore: 48,
      riskLevel: 'MEDIUM',
      imageDataUrl: '',
      location: { latitude: 19.9975, longitude: 73.7898, district: 'Nashik', taluka: 'Nashik', village: 'Deolali' },
      weather: { temperature: 28, humidity: 78, rainfall: 5, windSpeed: 10, condition: 'Partly Cloudy', forecast: 'Clear' },
      recommendation: {
        immediateActions: ['Remove lowest 2 infected leaflets', 'Clean pruning tools with disinfectant'],
        preventiveMeasures: ['Maintain soil moisture balance via drip lines'],
        treatmentGuidance: ['Bio-fungicide Trichoderma spray'],
        monitoring: ['Check for new spots on mid-canopy leaves'],
        recheckSuggestion: 'Check again in 4 days',
      },
      explainability: {
        description: 'Small isolated brown spots initiating near leaf margins.',
        highlightRegions: [{ x: 25, y: 40, width: 30, height: 25 }],
        gradcamAvailable: true,
      },
      validationStatus: 'CONFIRMED',
      createdAt: daysAgo(7),
    },
    {
      id: 'diag-tomato-004',
      farmerId: 'farmer-001',
      crop: 'Tomato',
      cropStage: 'Vegetative',
      disease: 'Leaf Spot',
      confidence: 88,
      severity: 'Low',
      riskScore: 35,
      riskLevel: 'LOW',
      imageDataUrl: '',
      location: { latitude: 19.9975, longitude: 73.7898, district: 'Nashik', taluka: 'Nashik', village: 'Deolali' },
      weather: { temperature: 26, humidity: 72, rainfall: 0, windSpeed: 11, condition: 'Clear', forecast: 'Dry conditions' },
      recommendation: {
        immediateActions: ['Monitor lower canopy foliage', 'Normal vegetative fertilizer schedule'],
        preventiveMeasures: ['Ensure clean ridge beds'],
        treatmentGuidance: ['Neem oil 0.5% preventive spray'],
        monitoring: ['Routine weekly inspection'],
        recheckSuggestion: 'Re-scan in 7 days',
      },
      explainability: {
        description: 'Mild circular leaf spots with minimal chlorosis.',
        highlightRegions: [{ x: 45, y: 20, width: 25, height: 25 }],
        gradcamAvailable: true,
      },
      validationStatus: 'CONFIRMED',
      createdAt: daysAgo(10),
    },
    {
      id: 'diag-tomato-005',
      farmerId: 'farmer-001',
      crop: 'Tomato',
      cropStage: 'Vegetative',
      disease: 'Healthy',
      confidence: 97,
      severity: 'Low',
      riskScore: 12,
      riskLevel: 'LOW',
      imageDataUrl: '',
      location: { latitude: 19.9975, longitude: 73.7898, district: 'Nashik', taluka: 'Nashik', village: 'Deolali' },
      weather: { temperature: 28, humidity: 65, rainfall: 0, windSpeed: 12, condition: 'Sunny', forecast: 'Clear' },
      recommendation: {
        immediateActions: ['Continue standard vegetative fertigation', 'No chemical intervention required'],
        preventiveMeasures: ['Support plants with staking as vegetative growth accelerates'],
        treatmentGuidance: ['Foliar micronutrient spray'],
        monitoring: ['Regular weekly scouting'],
        recheckSuggestion: 'Check on next growth stage',
      },
      explainability: {
        description: 'Vibrant green healthy leaves with zero pathogen lesions.',
        highlightRegions: [],
        gradcamAvailable: false,
      },
      validationStatus: 'CONFIRMED',
      createdAt: daysAgo(16),
    },
  ];

  userTomatoDiagnoses.forEach(saveDiagnosis);

  for (let i = 0; i < 40; i++) {
    const dp = diseasePool[i % diseasePool.length];
    const loc = DEMO_LOCATIONS[i % DEMO_LOCATIONS.length];
    const farmer = farmers[i % farmers.length];
    const crop = crops[i % 5];
    const stage = stages[i % 5];
    const weather = weatherData[i % weatherData.length];
    const riskLevel = dp.risk >= 70 ? 'HIGH' : dp.risk >= 40 ? 'MEDIUM' : 'LOW';

    const diagnosis: Diagnosis = {
      id: uid('diag', i + 1),
      farmerId: farmer.id,
      crop,
      cropStage: stage,
      disease: dp.disease,
      confidence: dp.confidence,
      severity: dp.severity,
      riskScore: dp.risk,
      riskLevel: riskLevel as Diagnosis['riskLevel'],
      imageDataUrl: '',
      location: {
        latitude: loc.latitude + (i * 0.01) % 0.05,
        longitude: loc.longitude + (i * 0.008) % 0.04,
        district: loc.district,
        taluka: loc.taluka,
        village: loc.village,
      },
      weather,
      recommendation: {
        immediateActions: ['Inspect nearby plants', 'Remove affected leaves'],
        preventiveMeasures: ['Improve ventilation', 'Practice crop rotation'],
        treatmentGuidance: ['Consult agriculture officer'],
        monitoring: ['Weekly inspection', 'Track weather'],
        recheckSuggestion: 'Re-check in 3 days',
      },
      explainability: {
        description: `The model identified visual patterns associated with ${dp.disease} in the highlighted region.`,
        highlightRegions: [{ x: 30, y: 25, width: 40, height: 35 }],
        gradcamAvailable: false,
      },
      validationStatus: dp.confidence < 80 ? 'PENDING' : 'CONFIRMED',
      createdAt: daysAgo(Math.floor(i / 3) + 2),
    };
    saveDiagnosis(diagnosis);
  }

  // ---- Hotspots ----
  const hotspots: Hotspot[] = [
    {
      id: 'hs-001', disease: 'Early Blight', crop: 'Tomato',
      latitude: 19.9975, longitude: 73.7898, cases: 7, averageRisk: 82,
      level: 'HIGH', district: 'Nashik', affectedCrops: ['Tomato', 'Potato'],
      latestCase: daysAgo(1), dateRange: 'Last 7 days', radius: 15,
    },
    {
      id: 'hs-002', disease: 'Late Blight', crop: 'Potato',
      latitude: 18.5204, longitude: 73.8567, cases: 5, averageRisk: 68,
      level: 'MEDIUM', district: 'Pune', affectedCrops: ['Potato'],
      latestCase: daysAgo(2), dateRange: 'Last 7 days', radius: 12,
    },
    {
      id: 'hs-003', disease: 'Rust', crop: 'Soybean',
      latitude: 16.8524, longitude: 74.5815, cases: 4, averageRisk: 65,
      level: 'MEDIUM', district: 'Sangli', affectedCrops: ['Soybean', 'Maize'],
      latestCase: daysAgo(3), dateRange: 'Last 10 days', radius: 10,
    },
    {
      id: 'hs-004', disease: 'Powdery Mildew', crop: 'Cotton',
      latitude: 19.0948, longitude: 74.7480, cases: 3, averageRisk: 52,
      level: 'MEDIUM', district: 'Ahmednagar', affectedCrops: ['Cotton'],
      latestCase: daysAgo(4), dateRange: 'Last 14 days', radius: 8,
    },
    {
      id: 'hs-005', disease: 'Early Blight', crop: 'Tomato',
      latitude: 17.6805, longitude: 74.0183, cases: 8, averageRisk: 78,
      level: 'HIGH', district: 'Satara', affectedCrops: ['Tomato'],
      latestCase: daysAgo(1), dateRange: 'Last 5 days', radius: 18,
    },
    {
      id: 'hs-006', disease: 'Leaf Spot', crop: 'Maize',
      latitude: 16.7050, longitude: 74.2433, cases: 2, averageRisk: 45,
      level: 'LOW', district: 'Kolhapur', affectedCrops: ['Maize'],
      latestCase: daysAgo(5), dateRange: 'Last 14 days', radius: 6,
    },
  ];
  saveHotspots(hotspots);

  // ---- Community Alerts ----
  const alerts: CommunityAlert[] = [
    {
      id: 'alert-001', disease: 'Early Blight', cases: 7, area: 'Nashik',
      district: 'Nashik', riskLevel: 'HIGH', averageRisk: 82,
      period: 'Last 7 days',
      recommendation: 'Early Blight detected near your area. Inspect your crops and monitor for symptoms.',
      createdAt: daysAgo(1), active: true,
    },
    {
      id: 'alert-002', disease: 'Late Blight', cases: 5, area: 'Pune',
      district: 'Pune', riskLevel: 'MEDIUM', averageRisk: 68,
      period: 'Last 7 days',
      recommendation: 'Late Blight cases reported nearby. Take preventive measures.',
      createdAt: daysAgo(2), active: true,
    },
    {
      id: 'alert-003', disease: 'Early Blight', cases: 8, area: 'Satara',
      district: 'Satara', riskLevel: 'HIGH', averageRisk: 78,
      period: 'Last 5 days',
      recommendation: 'Rapid increase in Early Blight cases. Urgent inspection recommended.',
      createdAt: daysAgo(0), active: true,
    },
  ];
  alerts.forEach(saveAlert);

  // ---- Notifications ----
  const notifications: AppNotification[] = [
    {
      id: 'notif-001', type: 'community_warning', title: '🚨 Community Early Warning',
      message: 'Early Blight detected near Nashik. 7 cases reported. Inspect your crops.',
      read: false, createdAt: daysAgo(0), relatedId: 'alert-001',
    },
    {
      id: 'notif-002', type: 'high_risk', title: '⚠️ High Risk Alert',
      message: 'Your latest diagnosis shows HIGH risk (84/100). Take immediate action.',
      read: false, createdAt: daysAgo(1), relatedId: 'diag-001',
    },
    {
      id: 'notif-003', type: 'disease_alert', title: '🌿 Disease Detected',
      message: 'Early Blight detected in your Tomato crop with 94% confidence.',
      read: false, createdAt: daysAgo(1), relatedId: 'diag-001',
    },
    {
      id: 'notif-004', type: 'expert_validation', title: '👨‍🔬 Expert Validation Update',
      message: 'Your diagnosis has been confirmed by District Agriculture Officer (#AG-402).',
      read: true, createdAt: daysAgo(3),
    },
    {
      id: 'notif-005', type: 'followup_reminder', title: '🔔 Follow-up Reminder',
      message: 'Time to re-check your Tomato crop. Upload a new leaf image for comparison.',
      read: false, createdAt: daysAgo(0),
    },
    {
      id: 'notif-006', type: 'community_warning', title: '🚨 Community Early Warning',
      message: 'Early Blight surge in Satara district. 8 cases in 5 days.',
      read: false, createdAt: daysAgo(0), relatedId: 'alert-003',
    },
  ];
  notifications.forEach(saveNotification);

  // ---- Validations ----
  const validations: Validation[] = [
    {
      id: 'val-001', diagnosisId: 'diag-004', aiDisease: 'Late Blight', aiConfidence: 62,
      decision: 'PENDING', comment: '', expertId: '', timestamp: daysAgo(1),
    },
    {
      id: 'val-002', diagnosisId: 'diag-014', aiDisease: 'Late Blight', aiConfidence: 62,
      decision: 'PENDING', comment: '', expertId: '', timestamp: daysAgo(2),
    },
    {
      id: 'val-003', diagnosisId: 'diag-024', aiDisease: 'Late Blight', aiConfidence: 62,
      decision: 'PENDING', comment: '', expertId: '', timestamp: daysAgo(3),
    },
    {
      id: 'val-004', diagnosisId: 'diag-034', aiDisease: 'Late Blight', aiConfidence: 62,
      decision: 'PENDING', comment: '', expertId: '', timestamp: daysAgo(4),
    },
    {
      id: 'val-005', diagnosisId: 'diag-001', aiDisease: 'Early Blight', aiConfidence: 94,
      decision: 'CONFIRMED', comment: 'Confirmed as Early Blight', expertId: 'officer-001',
      timestamp: daysAgo(0),
    },
  ];
  validations.forEach(saveValidation);

  // ---- Progress Records (Scenario 6) ----
  const progressRecords: ProgressRecord[] = [
    { id: 'prog-001', farmerId: 'farmer-001', diagnosisId: 'diag-001', crop: 'Tomato', disease: 'Early Blight', riskScore: 35, day: 1, date: daysAgo(10) },
    { id: 'prog-002', farmerId: 'farmer-001', diagnosisId: 'diag-008', crop: 'Tomato', disease: 'Early Blight', riskScore: 48, day: 4, date: daysAgo(7) },
    { id: 'prog-003', farmerId: 'farmer-001', diagnosisId: 'diag-011', crop: 'Tomato', disease: 'Early Blight', riskScore: 65, day: 7, date: daysAgo(4) },
    { id: 'prog-004', farmerId: 'farmer-001', diagnosisId: 'diag-021', crop: 'Tomato', disease: 'Early Blight', riskScore: 78, day: 10, date: daysAgo(1) },
    // Another farmer - improving trend
    { id: 'prog-005', farmerId: 'farmer-003', diagnosisId: 'diag-003', crop: 'Maize', disease: 'Leaf Spot', riskScore: 68, day: 1, date: daysAgo(12) },
    { id: 'prog-006', farmerId: 'farmer-003', diagnosisId: 'diag-013', crop: 'Maize', disease: 'Leaf Spot', riskScore: 55, day: 5, date: daysAgo(8) },
    { id: 'prog-007', farmerId: 'farmer-003', diagnosisId: 'diag-023', crop: 'Maize', disease: 'Leaf Spot', riskScore: 40, day: 9, date: daysAgo(4) },
    { id: 'prog-008', farmerId: 'farmer-003', diagnosisId: 'diag-033', crop: 'Maize', disease: 'Leaf Spot', riskScore: 28, day: 13, date: daysAgo(1) },
  ];
  saveProgress(progressRecords);

  markSeeded();
}
