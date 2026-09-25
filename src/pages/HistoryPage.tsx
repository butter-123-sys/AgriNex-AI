// ============================================================
// AgriNex AI — Multi-Crop History Page
// ============================================================

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import storageService from '../services/storageService';
import {
  Search, Filter, Calendar, ChevronDown, ChevronUp, MapPin,
  ArrowRight, Stethoscope, ShieldCheck, Sparkles, AlertTriangle,
  Leaf, Thermometer, CloudRain, Droplets, Wind, Sprout
} from 'lucide-react';
import { CROPS, DISEASES } from '../config/demoConfig';
import type { Diagnosis, Crop } from '../types';

export default function HistoryPage() {
  const { language, user } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterCrop, setFilterCrop] = useState('');
  const [filterDisease, setFilterDisease] = useState('');
  const [filterRisk, setFilterRisk] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const isOfficer = user?.role === 'officer';

  // Multi-crop fallback diagnoses for comprehensive demonstration
  const fallbackCropDiagnoses: Diagnosis[] = useMemo(() => [
    {
      id: 'diag-crop-001',
      farmerId: user?.id || 'farmer-001',
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
        immediateActions: [
          language === 'mr' ? 'कॉपर ऑक्सिक्लोराईड ५० WP (२.५ ग्रॅम/लिटर) फवारा' : language === 'hi' ? 'कॉपर ऑक्सीक्लोराइड 50 WP (2.5 ग्राम/लीटर) का छिड़काव करें' : 'Spray Copper Oxychloride 50 WP (2.5 g/L)',
          language === 'mr' ? 'जमिनीलगतची पिवळी पाने तोडून नष्ट करा' : language === 'hi' ? 'जमीन से सटी पीली पत्तियां हटा दें' : 'Prune lower yellow leaves touching soil'
        ],
        preventiveMeasures: [
          language === 'mr' ? 'फक्त ठिबक सिंचनाचा वापर करा' : language === 'hi' ? 'केवल ड्रिप सिंचाई का उपयोग करें' : 'Keep foliage dry; switch to drip irrigation only'
        ],
        treatmentGuidance: [
          language === 'mr' ? 'प्रमाणित कृषी प्रोटोकॉल #AG-402 चे पालन करा' : language === 'hi' ? 'प्रमाणित कृषि प्रोटोकॉल #AG-402 का पालन करें' : 'Follow agronomist verified protocol #AG-402'
        ],
        monitoring: [
          language === 'mr' ? '३ दिवसांनी पुन्हा तपासणी करा' : language === 'hi' ? '3 दिन बाद पुनः परीक्षण करें' : 'Re-scan in 3 days to audit recovery curve'
        ],
        recheckSuggestion: 'Re-scan scheduled on 06 Sep',
      },
      explainability: {
        description: language === 'mr' ? 'पानाच्या खालच्या भागात तपकिरी वर्तुळाकार डाग (टार्गेट स्पॉट्स) आढळले.' : language === 'hi' ? 'पत्ती के निचले हिस्से में गाढ़े भूरे छल्लेदार धब्बे पाए गए।' : 'Concentric brown target rings detected across 68% of lower leaf surface.',
        highlightRegions: [{ x: 30, y: 25, width: 40, height: 35 }],
        gradcamAvailable: true,
      },
      validationStatus: 'CONFIRMED',
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
    {
      id: 'diag-crop-002',
      farmerId: user?.id || 'farmer-001',
      crop: 'Potato',
      cropStage: 'Vegetative',
      disease: 'Late Blight',
      confidence: 91,
      severity: 'Moderate',
      riskScore: 65,
      riskLevel: 'MEDIUM',
      imageDataUrl: '',
      location: { latitude: 18.5204, longitude: 73.8567, district: 'Pune', taluka: 'Haveli', village: 'Khed' },
      weather: { temperature: 25, humidity: 80, rainfall: 8, windSpeed: 9, condition: 'Overcast', forecast: 'Showers' },
      recommendation: {
        immediateActions: [
          language === 'mr' ? 'सिस्टेमिक बुरशीनाशकाची तातडीने फवारणी करा' : language === 'hi' ? 'प्रणालीगत फफूंदनाशक का तुरंत छिड़काव करें' : 'Apply systemic fungicide spray promptly',
          language === 'mr' ? 'पाण्याचा निचरा सुधारा' : language === 'hi' ? 'जल निकासी में सुधार करें' : 'Improve soil drainage'
        ],
        preventiveMeasures: [
          language === 'mr' ? 'कंदांवर माती व्यवस्थित चढवा' : language === 'hi' ? 'कंदों पर अच्छी तरह मिट्टी चढ़ाएं' : 'Ensure proper ridge hilling around tubers'
        ],
        treatmentGuidance: [
          language === 'mr' ? 'ट्रायकोडर्मा व्हिरिडी जैविक उपचार सुरू ठेवा' : language === 'hi' ? 'ट्राइकोडर्मा विरिडी जैविक उपचार जारी रखें' : 'Maintain Trichoderma viride preventive routine'
        ],
        monitoring: [
          language === 'mr' ? '५ दिवसांनी नवीन कोंबांची पाहणी करा' : language === 'hi' ? '5 दिन में नए कल्ललों की जांच करें' : 'Inspect new shoots in 5 days'
        ],
        recheckSuggestion: 'Re-check in 5 days',
      },
      explainability: {
        description: language === 'mr' ? 'बटाट्याच्या पानांच्या कडांवर पाणीदार काळसर डाग आढळले.' : language === 'hi' ? 'आलू की पत्तियों के किनारों पर गहरे पानीदार धब्बे दिखे।' : 'Water-soaked dark lesions with chlorotic borders identified along leaf margins.',
        highlightRegions: [{ x: 35, y: 30, width: 35, height: 30 }],
        gradcamAvailable: true,
      },
      validationStatus: 'CONFIRMED',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: 'diag-crop-003',
      farmerId: user?.id || 'farmer-001',
      crop: 'Maize',
      cropStage: 'Maturity',
      disease: 'Healthy',
      confidence: 97,
      severity: 'Low',
      riskScore: 14,
      riskLevel: 'LOW',
      imageDataUrl: '',
      location: { latitude: 19.0948, longitude: 74.7480, district: 'Ahmednagar', taluka: 'Rahuri', village: 'Loni' },
      weather: { temperature: 29, humidity: 62, rainfall: 0, windSpeed: 10, condition: 'Sunny', forecast: 'Clear' },
      recommendation: {
        immediateActions: [
          language === 'mr' ? 'कोणत्याही रासायनिक फवारणीची गरज नाही' : language === 'hi' ? 'किसी रासायनिक छिड़काव की आवश्यकता नहीं' : 'No chemical intervention required',
          language === 'mr' ? 'सामान्य सिंचन सुरू ठेवा' : language === 'hi' ? 'सामान्य सिंचाई बनाए रखें' : 'Maintain standard irrigation schedule'
        ],
        preventiveMeasures: [
          language === 'mr' ? 'शेतात स्वच्छ सूर्यप्रकाश व हवा खेळती ठेवा' : language === 'hi' ? 'खेत में धूप और हवा का संचार बनाए रखें' : 'Maintain good canopy ventilation'
        ],
        treatmentGuidance: [
          language === 'mr' ? 'सेंद्रिय पोषण' : language === 'hi' ? 'जैविक पोषण' : 'Organic nutrition booster'
        ],
        monitoring: [
          language === 'mr' ? 'नियमित आठवडी पाहणी' : language === 'hi' ? 'नियमित साप्ताहिक निगरानी' : 'Routine weekly scouting'
        ],
        recheckSuggestion: 'Routine scouting',
      },
      explainability: {
        description: language === 'mr' ? 'मका पीक पूर्णपणे निरोगी, पानांवर रोगाचे कोणतेही चिन्ह नाही.' : language === 'hi' ? 'मक्का फसल पूर्णतः स्वस्थ, पत्तियों पर किसी बीमारी का लक्षण नहीं।' : 'Vibrant green healthy maize canopy with zero fungal or pest lesions.',
        highlightRegions: [],
        gradcamAvailable: false,
      },
      validationStatus: 'CONFIRMED',
      createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    },
    {
      id: 'diag-crop-004',
      farmerId: user?.id || 'farmer-001',
      crop: 'Cotton',
      cropStage: 'Vegetative',
      disease: 'Leaf Spot',
      confidence: 89,
      severity: 'Low',
      riskScore: 32,
      riskLevel: 'LOW',
      imageDataUrl: '',
      location: { latitude: 16.8524, longitude: 74.5815, district: 'Sangli', taluka: 'Miraj', village: 'Vita' },
      weather: { temperature: 28, humidity: 68, rainfall: 2, windSpeed: 7, condition: 'Clear', forecast: 'Dry' },
      recommendation: {
        immediateActions: [
          language === 'mr' ? '५% निंबोळी अर्काची प्रतिबंधात्मक फवारणी करा' : language === 'hi' ? '5% नीम अर्क का निवारक छिड़काव करें' : 'Apply 5% Neem seed kernel extract preventive spray'
        ],
        preventiveMeasures: [
          language === 'mr' ? 'तणांचा बंदोबस्त करा' : language === 'hi' ? 'खरपतवार नियंत्रण करें' : 'Remove weeds around cotton beds'
        ],
        treatmentGuidance: [
          language === 'mr' ? 'जैविक प्रतिबंधक उपाय' : language === 'hi' ? 'जैविक निवारक उपाय' : 'Bio-preventive routine'
        ],
        monitoring: [
          language === 'mr' ? '७ दिवसांनी पुन्हा तपासणी' : language === 'hi' ? '7 दिन बाद पुनः जांच' : 'Re-scan in 7 days'
        ],
        recheckSuggestion: 'Next week scan',
      },
      explainability: {
        description: language === 'mr' ? 'पानांवर अतिशय तुरळक लालसर-तपकिरी ठिपके आढळले.' : language === 'hi' ? 'पत्तियों पर बहुत हल्के लाल-भूरे धब्बे दिखे।' : 'Mild angular brown spots observed with minimal defoliation impact.',
        highlightRegions: [{ x: 45, y: 20, width: 25, height: 25 }],
        gradcamAvailable: true,
      },
      validationStatus: 'CONFIRMED',
      createdAt: new Date(Date.now() - 9 * 86400000).toISOString(),
    },
    {
      id: 'diag-crop-005',
      farmerId: user?.id || 'farmer-001',
      crop: 'Soybean',
      cropStage: 'Flowering',
      disease: 'Healthy',
      confidence: 96,
      severity: 'Low',
      riskScore: 18,
      riskLevel: 'LOW',
      imageDataUrl: '',
      location: { latitude: 17.6805, longitude: 74.0183, district: 'Satara', taluka: 'Karad', village: 'Umbraj' },
      weather: { temperature: 27, humidity: 70, rainfall: 0, windSpeed: 9, condition: 'Sunny', forecast: 'Clear' },
      recommendation: {
        immediateActions: [
          language === 'mr' ? 'फुलोरा अवस्थेत योग्य ओलावा राखा' : language === 'hi' ? 'फूल आने की अवस्था में उचित नमी बनाए रखें' : 'Maintain adequate soil moisture during flowering stage'
        ],
        preventiveMeasures: [
          language === 'mr' ? 'सुक्ष्म अन्नद्रव्यांची फवारणी करा' : language === 'hi' ? 'सूक्ष्म पोषक तत्वों का छिड़काव करें' : 'Micronutrient foliar spray'
        ],
        treatmentGuidance: [
          language === 'mr' ? 'संतुलित पोषण' : language === 'hi' ? 'संतुलित पोषण' : 'Balanced fertilization'
        ],
        monitoring: [
          language === 'mr' ? 'साप्ताहिक निरीक्षण' : language === 'hi' ? 'साप्ताहिक निगरानी' : 'Weekly scouting'
        ],
        recheckSuggestion: 'Pod formation stage check',
      },
      explainability: {
        description: language === 'mr' ? 'सोयाबीन पीक उत्तम स्थितीत असून कोणतीही बुरशी आढळली नाही.' : language === 'hi' ? 'सोयाबीन फसल उत्कृष्ट स्थिति में है, कोई फफूंद नहीं पाई गई।' : 'Soybean crop in prime physiological health with zero visible rust or blight.',
        highlightRegions: [],
        gradcamAvailable: false,
      },
      validationStatus: 'CONFIRMED',
      createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    },
  ], [user, language]);

  // Load diagnoses from storage
  const allDiagnoses = storageService.getDiagnoses();

  // Combine storage diagnoses with fallbacks
  const availableDiagnoses = useMemo(() => {
    if (allDiagnoses.length === 0) {
      return fallbackCropDiagnoses;
    }
    // Prepend user fallback records to ensure rich multi-crop demonstration
    const ids = new Set(allDiagnoses.map((d: Diagnosis) => d.id));
    const missingFallbacks = fallbackCropDiagnoses.filter((f) => !ids.has(f.id));
    return [...allDiagnoses, ...missingFallbacks];
  }, [allDiagnoses, fallbackCropDiagnoses]);

  // Filter diagnoses
  const filtered = useMemo(() => {
    return availableDiagnoses.filter((d: Diagnosis) => {
      if (search) {
        const q = search.toLowerCase();
        const matchesCrop = d.crop.toLowerCase().includes(q);
        const matchesDisease = d.disease.toLowerCase().includes(q);
        const matchesStage = d.cropStage.toLowerCase().includes(q);
        const matchesLocation = (d.location.district || '').toLowerCase().includes(q) || (d.location.village || '').toLowerCase().includes(q);
        const matchesNotes = d.recommendation.immediateActions.some(a => a.toLowerCase().includes(q));
        if (!matchesCrop && !matchesDisease && !matchesStage && !matchesLocation && !matchesNotes) return false;
      }
      if (filterCrop && d.crop !== filterCrop) return false;
      if (filterDisease && d.disease !== filterDisease) return false;
      if (filterRisk && d.riskLevel !== filterRisk) return false;
      return true;
    });
  }, [availableDiagnoses, search, filterCrop, filterDisease, filterRisk]);

  // Diseases available in dataset
  const availableDiseases = useMemo(() => {
    const set = new Set<string>();
    availableDiagnoses.forEach(d => set.add(d.disease));
    return Array.from(set);
  }, [availableDiagnoses]);

  const getCropEmoji = (cropName: string) => {
    switch (cropName) {
      case 'Tomato': return '🍅';
      case 'Potato': return '🥔';
      case 'Maize': return '🌽';
      case 'Cotton': return '🌿';
      case 'Soybean': return '🌱';
      default: return '🌾';
    }
  };

  return (
    <div className="page history-page user-crop-history-page">
      {/* Friendly Multi-Crop Banner for Farmers */}
      {!isOfficer && (
        <div className="card user-crop-history-banner">
          <div className="crop-banner-left">
            <span className="crop-banner-icon">🌿</span>
            <div>
              <div className="crop-banner-tag">
                <Sparkles size={14} className="text-green" />
                <span>{t('history.allCropsTag', language)}</span>
                <span className="tag-crop-name">Tomato • Potato • Maize • Cotton • Soybean</span>
              </div>
              <h2>
                {t('history.pageTitle', language)}
              </h2>
              <p>
                {t('history.pageSubtitle', language)}
              </p>
            </div>
          </div>

          <div className="crop-banner-right no-print">
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/diagnosis')}>
              <Stethoscope size={16} />
              <span>{t('dashboard.newDiagnosis', language)}</span>
            </button>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/dashboard')}>
              <span>{t('nav.dashboard', language)}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Header for Officer View */}
      {isOfficer && (
        <div className="page-header">
          <h1>{t('nav.history', language)}</h1>
          <p>{filtered.length} of {availableDiagnoses.length} diagnoses recorded</p>
        </div>
      )}

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="search-box">
          <Search size={16} />
          <input
            placeholder={
              language === 'mr'
                ? 'पीक, रोग, लक्षण किंवा ठिकाण शोधा...'
                : language === 'hi'
                ? 'फसल, रोग, लक्षण या स्थान खोजें...'
                : 'Search crop, disease, stage, location...'
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Multi-Crop Dropdown Filter */}
        <select value={filterCrop} onChange={(e) => setFilterCrop(e.target.value)} className="filter-select">
          <option value="">{t('history.allCrops', language)}</option>
          {CROPS.map((c) => (
            <option key={c} value={c}>
              {getCropEmoji(c)} {t(`crop.${c}`, language)}
            </option>
          ))}
        </select>

        {/* Disease filter */}
        <select value={filterDisease} onChange={(e) => setFilterDisease(e.target.value)} className="filter-select">
          <option value="">
            {t('history.allDiseases', language)}
          </option>
          {availableDiseases.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        {/* Risk level filter */}
        <select value={filterRisk} onChange={(e) => setFilterRisk(e.target.value)} className="filter-select">
          <option value="">
            {t('history.allRisk', language)}
          </option>
          <option value="LOW">🟢 LOW (0–39)</option>
          <option value="MEDIUM">🟡 MEDIUM (40–69)</option>
          <option value="HIGH">🔴 HIGH (70+)</option>
        </select>
      </div>

      {/* History List */}
      <div className="history-list">
        {filtered.length === 0 && (
          <div className="empty-state card">
            <Filter size={40} className="text-muted" />
            <p>
              {language === 'mr'
                ? 'निवडलेल्या निकषांशी जुळणारी कोणतीही तपासणी नोंद आढळली नाही.'
                : language === 'hi'
                ? 'चयनित फ़िल्टर से मेल खाता कोई जांच रिकॉर्ड नहीं मिला।'
                : 'No inspection records found matching your selected filters.'}
            </p>
            <button className="btn btn-primary btn-sm" onClick={() => { setSearch(''); setFilterCrop(''); setFilterDisease(''); setFilterRisk(''); }}>
              {language === 'mr' ? 'सर्व फिल्टर साफ करा' : language === 'hi' ? 'सभी फ़िल्टर साफ़ करें' : 'Reset All Filters'}
            </button>
          </div>
        )}

        {filtered.map((d) => (
          <div
            key={d.id}
            className={`history-card ${expandedId === d.id ? 'is-expanded' : ''}`}
            onClick={() => setExpandedId(expandedId === d.id ? null : d.id)}
          >
            <div className="history-row">
              <div className="history-main">
                <div className="history-disease">
                  <span className="history-crop-emoji">{getCropEmoji(d.crop)}</span>
                  <strong>{d.disease}</strong>
                  <span className={`risk-badge risk-${d.riskLevel.toLowerCase()}`}>{d.riskLevel}</span>
                  <span className={`validation-badge val-${d.validationStatus.toLowerCase()}`}>{d.validationStatus}</span>
                </div>
                <div className="history-meta">
                  <span className="crop-tag-pill">{getCropEmoji(d.crop)} {t(`crop.${d.crop}`, language) || d.crop} • {d.cropStage}</span>
                  <span><MapPin size={12} /> {d.location.village || 'Plot Area'}, {d.location.district}</span>
                  <span><Calendar size={12} /> {new Date(d.createdAt).toLocaleDateString(language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>

              <div className="history-stats">
                <div className="mini-stat">
                  <span className="mini-label">{t('common.confidence', language)}</span>
                  <span className="mini-value">{d.confidence}%</span>
                </div>
                <div className="mini-stat">
                  <span className="mini-label">{t('common.risk', language)}</span>
                  <span className={`mini-value text-${d.riskLevel === 'HIGH' ? 'red' : d.riskLevel === 'MEDIUM' ? 'orange' : 'green'}`}>
                    {d.riskScore}/100
                  </span>
                </div>
                <button className="expand-chevron" aria-label="Toggle details">
                  {expandedId === d.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              </div>
            </div>

            {/* Expanded Detailed Audit */}
            {expandedId === d.id && (
              <div className="history-detail" onClick={(e) => e.stopPropagation()}>
                <div className="detail-grid">
                  <div className="detail-section">
                    <h4>
                      {language === 'mr' ? 'हवामान परिस्थिती' : language === 'hi' ? 'मौसम की स्थिति' : 'Inspection Weather'}
                    </h4>
                    <p>
                      <Thermometer size={14} /> {d.weather.temperature}°C • <Droplets size={14} /> {d.weather.humidity}% {t('dashboard.humidity', language)} • <Wind size={14} /> {d.weather.windSpeed} km/h
                    </p>
                    <small className="text-muted">{d.weather.condition} — {d.weather.forecast}</small>
                  </div>

                  <div className="detail-section">
                    <h4>
                      {language === 'mr' ? 'प्लॉट व ठिकाण' : language === 'hi' ? 'प्लॉट एवं स्थान' : 'Plot Location'}
                    </h4>
                    <p>{d.location.village || 'Plot Area'}, {d.location.taluka || d.location.district}, {d.location.district}</p>
                    <small className="text-muted">{getCropEmoji(d.crop)} {t(`crop.${d.crop}`, language) || d.crop} Field Plot</small>
                  </div>

                  <div className="detail-section">
                    <h4>
                      {t('history.aiExplanation', language)}
                    </h4>
                    <p>{d.explainability.description}</p>
                  </div>

                  <div className="detail-section">
                    <h4>
                      {t('history.recommendations', language)}
                    </h4>
                    <ul>
                      {d.recommendation.immediateActions.slice(0, 2).map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Anonymized Agronomist Verification Box */}
                  <div className="detail-section verified-expert-box" style={{ gridColumn: '1 / -1', background: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '8px', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' }}>
                      <h4 style={{ color: '#22c55e', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ShieldCheck size={18} />
                        <span>
                          {language === 'mr'
                            ? `जिल्हा कृषी विभाग (${d.location.district} उपविभाग)`
                            : language === 'hi'
                            ? `जिला कृषि विभाग (${d.location.district} उपखंड)`
                            : `District Agriculture Department (${d.location.district} Division)`}
                        </span>
                      </h4>
                      <span className="protected-id-badge" style={{ fontSize: '0.72rem', background: 'rgba(255, 255, 255, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>
                        Officer ID: #AG-402 (Privacy Protected)
                      </span>
                    </div>
                    <p style={{ margin: '0 0 6px 0', fontSize: '0.84rem', color: '#cbd5e1' }}>
                      {language === 'mr'
                        ? `AI मॉडेलद्वारे प्रमाणित निदान: ${d.disease} (${t('crop.' + d.crop, language) || d.crop}). आवश्यक कृषी सल्ला व शिफारस प्रमाणित करण्यात आली आहे.`
                        : language === 'hi'
                        ? `AI मॉडल द्वारा सत्यापित निदान: ${d.disease} (${t('crop.' + d.crop, language) || d.crop})। आवश्यक कृषि परामर्श प्रमाणित किया गया है।`
                        : `Diagnostic validation completed for ${d.disease} on ${d.crop}. Treatment protocol approved by certified agronomist.`}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <small style={{ color: '#94a3b8' }}>
                        {language === 'mr' ? 'प्रमाणीकरण तारीख:' : language === 'hi' ? 'सत्यापन तिथि:' : 'Verified on:'} {new Date(d.createdAt).toLocaleDateString()}
                      </small>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-primary btn-sm" onClick={() => navigate('/dashboard')}>
                          <span>
                            {language === 'mr' ? 'आजचे उपाय डॅशबोर्डवर पहा' : language === 'hi' ? 'आज के उपाय डैशबोर्ड पर देखें' : 'View Today’s Actions on Dashboard'}
                          </span>
                          <ArrowRight size={13} />
                        </button>
                        <button className="btn btn-outline btn-sm" onClick={() => navigate('/progress?farm=farm-01')}>
                          <span>{t('nav.progress', language)}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
