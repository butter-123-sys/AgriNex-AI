// ============================================================
// AgriNexAi — Simple & Informative Disease Progress Report (/progress)
// Note: Expert Officer Personal Names are Protected (Anonymized)
// ============================================================

import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  TrendingUp, Calendar, AlertTriangle, ShieldCheck,
  CheckCircle2, ArrowRight, Printer, Share2,
  Stethoscope, Clock, Shield, Sparkles, Droplets,
  Thermometer, CloudRain, Check, AlertCircle
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from 'recharts';
import { useApp } from '../context/AppContext';

export default function ProgressPage() {
  const { language, user } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedFarm, setSelectedFarm] = useState('farm-01');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const f = searchParams.get('farm');
    if (f) setSelectedFarm(f);
  }, [searchParams]);

  const handleFarmChange = (id: string) => {
    setSelectedFarm(id);
    setSearchParams({ farm: id });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const farmScenarios = [
    {
      id: 'farm-01',
      title: language === 'mr' ? 'टोमॅटो प्लॉट A (नाशिक) — करपा रोग अहवाल' : language === 'hi' ? 'टमाटर प्लॉट A (नासिक) — झुलसा रोग रिपोर्ट' : 'Tomato Plot A (Nashik) — Early Blight Progress',
      crop: 'Tomato',
      cropEmoji: '🍅',
      disease: 'Early Blight',
      location: 'Deolali, Nashik',
      variety: 'Hybrid Tomato (Shivam)',
      stage: language === 'mr' ? 'फुलोरा टप्पा' : language === 'hi' ? 'फूल आने की अवस्था' : 'Flowering Stage',
      currentRisk: 78,
      previousRisk: 65,
      change: +13,
      trend: 'INCREASING' as const,
      trendText: language === 'mr' ? 'रोग वाढत आहे' : language === 'hi' ? 'बीमारी बढ़ रही है' : 'Disease is Increasing',
      mainCause: language === 'mr'
        ? 'गेल्या ४ दिवसांत हवेतील ८२% जास्त दमटपणामुळे बुरशी वेगाने पसरली.'
        : language === 'hi'
        ? 'पिछले 4 दिनों में 82% अत्यधिक नमी के कारण फफूंद तेजी से फैली।'
        : 'Continuous high humidity (82%) over the last 4 days favored rapid fungal spore spread.',
      immediateSolution: language === 'mr'
        ? 'कॉपर ऑक्सिक्लोराईड फवारणी करा आणि जमिनीला टेकलेली खराब पाने तोडून टाका.'
        : language === 'hi'
        ? 'कॉपर ऑक्सीक्लोराइड का छिड़काव करें और जमीन से सटी खराब पत्तियां तोड़ दें।'
        : 'Spray Copper Oxychloride (2.5 g/L) and prune lower yellow leaves immediately.',
      data: [
        { day: 'Day 1', date: '25 Aug', riskScore: 35, humidity: '72%', temp: '26°C', spots: '10% Leaf Area', note: 'Mild yellow spots seen on bottom leaves' },
        { day: 'Day 4', date: '28 Aug', riskScore: 48, humidity: '78%', temp: '27°C', spots: '25% Leaf Area', note: 'Concentric brown rings starting to expand' },
        { day: 'Day 7', date: '31 Aug', riskScore: 65, humidity: '82%', temp: '27°C', spots: '48% Leaf Area', note: 'Rain moisture accelerated spore movement' },
        { day: 'Day 10', date: '03 Sep', riskScore: 78, humidity: '85%', temp: '28°C', spots: '68% Leaf Area', note: 'Active outbreak: urgent fungicide spray required' },
      ],
      beforeAfter: {
        before: { day: 'Day 1 (25 Aug)', status: 'Mild Initial Spots (10%)', desc: 'Isolated small yellow spots on bottom leaves.' },
        after: { day: 'Day 10 (03 Sep)', status: 'Severe Blight Rings (68%)', desc: 'Dark brown concentric rings spreading upward to stem.' },
      },
      farmerActionPlan: [
        {
          title: language === 'mr' ? '१. कोणती फवारणी करावी?' : language === 'hi' ? '1. क्या दवा छिड़कें?' : '1. Which Medicine to Spray?',
          detail: language === 'mr'
            ? 'कॉपर ऑक्सिक्लोराईड ५० WP (२.५ ग्रॅम प्रति लिटर पाण्यात) किंवा मॅन्कोझेब ७५ WP (२ ग्रॅम प्रति लिटर).'
            : language === 'hi'
            ? 'कॉपर ऑक्सीक्लोराइड 50 WP (2.5 ग्राम प्रति लीटर पानी में) या मैंकोजेब 75 WP (2 ग्राम प्रति लीटर)।'
            : 'Copper Oxychloride 50 WP (2.5 g per liter of water) or Mancozeb 75 WP (2 g per liter).',
        },
        {
          title: language === 'mr' ? '२. फवारणीची योग्य वेळ' : language === 'hi' ? '2. छिड़काव की सही स्थिति' : '2. Best Spray Condition',
          detail: language === 'mr' ? 'वारा शांत असताना व पाने कोरडी असताना फवारा. तीव्र दुपारचे ऊन किंवा सकाळचे दव असताना फवारू नका.' : language === 'hi' ? 'जब हवा शांत हो और पत्तियां सूखी हों तब छिड़कें। तेज धूप या सुबह की ओस में न छिड़कें।' : 'Apply when wind is gentle and foliage is dry. Avoid intense midday heat or wet morning dew.',
        },
        {
          title: language === 'mr' ? '३. शेतातील काळजी' : language === 'hi' ? '3. खेत में क्या सावधानी रखें?' : '3. Field Care',
          detail: language === 'mr' ? 'जमिनीला टेकलेली पिवळी पाने काढून टाका. फक्त ठिबक सिंचनाने पाणी द्या, पानांवर पाणी उडवू नका.' : language === 'hi' ? 'जमीन को छूने वाली पीली पत्तियां हटा दें। केवल ड्रिप से पानी दें, पत्तियों पर पानी न डालें।' : 'Prune leaves touching the wet soil. Use drip irrigation only; keep foliage dry.',
        },
        {
          title: language === 'mr' ? '४. पुढील तपासणी' : language === 'hi' ? '4. अगली जांच कब करें?' : '4. Next Inspection',
          detail: language === 'mr' ? 'फवारणीनंतर ३ दिवसांनी (६ सप्टेंबर) पुन्हा फोटो स्कॅन करून फरक तपासा.' : language === 'hi' ? 'दवा छिड़कने के 3 दिन बाद (6 सितंबर) दोबारा फोटो स्कैन करके जांच करें।' : 'Scan leaves again in 3 days (06 Sep) to confirm that disease has stopped spreading.',
        },
      ],
      officialVerification: {
        status: 'VERIFIED & CERTIFIED',
        department: language === 'mr' ? 'जिल्हा कृषी विभाग (नाशिक उपविभाग)' : language === 'hi' ? 'जिला कृषि विभाग (नासिक उपखंड)' : 'District Agriculture Department (Nashik Division)',
        officerProtectedId: 'Officer ID: #AG-402 (Privacy Protected)',
        clinicalNote: language === 'mr'
          ? 'टोमॅटो अर्ली ब्लाइट लक्षणांची डिजिटल तपासणी पूर्ण झाली आहे. सुचवलेली फवारणी योग्य असून त्वरित करावी.'
          : language === 'hi'
          ? 'टमाटर अगेती झुलसा लक्षणों की डिजिटल जांच सत्यापित है। सुझाई गई दवा का छिड़काव तुरंत करें।'
          : 'Early Blight symptoms verified via dual-CNN telemetry. Fungicide protocol confirmed appropriate for flowering stage.',
      },
    },
    {
      id: 'farm-02',
      title: language === 'mr' ? 'बटाटा प्लॉट B (पुणे) — रोग नियंत्रण प्रगती अहवाल' : language === 'hi' ? 'आलू प्लॉट B (पुणे) — रोग नियंत्रण प्रगति रिपोर्ट' : 'Potato Plot B (Pune) — Late Blight Recovery',
      crop: 'Potato',
      cropEmoji: '🥔',
      disease: 'Late Blight',
      location: 'Haveli, Pune',
      variety: 'Kufri Jyoti',
      stage: language === 'mr' ? 'कंद वाढीचा टप्पा' : language === 'hi' ? 'कंद वृद्धि चरण' : 'Tuber Bulking',
      currentRisk: 38,
      previousRisk: 54,
      change: -16,
      trend: 'IMPROVING' as const,
      trendText: language === 'mr' ? 'पीक सुधारत आहे (यशस्वी नियंत्रण)' : language === 'hi' ? 'फसल सुधर रही है (सफल नियंत्रण)' : 'Crop is Recovering (Controlled)',
      mainCause: language === 'mr'
        ? 'मेटालॅक्सिल फवारणी आणि पाण्याचा निचरा केल्यामुळे रोगाचा प्रसार थांबला.'
        : language === 'hi'
        ? 'मेटालेक्सिल छिड़काव और जल निकासी के कारण बीमारी का फैलाव रुक गया।'
        : 'Systemic fungicide application and soil drainage successfully halted Late Blight lesions.',
      immediateSolution: language === 'mr'
        ? 'उपाय यशस्वी ठरले आहेत. प्रतिबंधात्मक जैविक बुरशीनाशक सुरू ठेवा.'
        : language === 'hi'
        ? 'इलाज सफल रहा है। जैविक फफूंदनाशक का छिड़काव बनाए रखें।'
        : 'Treatment successful. Maintain preventive bio-fungicide (Trichoderma) routine.',
      data: [
        { day: 'Day 1', date: '20 Aug', riskScore: 82, humidity: '88%', temp: '24°C', spots: '75% Leaf Area', note: 'Severe dark water-soaked lesions' },
        { day: 'Day 4', date: '23 Aug', riskScore: 71, humidity: '82%', temp: '25°C', spots: '55% Leaf Area', note: 'Fungicide applied; lesion edges dried' },
        { day: 'Day 7', date: '26 Aug', riskScore: 54, humidity: '75%', temp: '26°C', spots: '32% Leaf Area', note: 'New shoots emerging clean and healthy' },
        { day: 'Day 10', date: '29 Aug', riskScore: 38, humidity: '68%', temp: '27°C', spots: '18% Leaf Area', note: 'Controlled status: crop health restored' },
      ],
      beforeAfter: {
        before: { day: 'Day 1 (20 Aug)', status: 'Severe Blight (75%)', desc: 'Dark water-soaked rot with white spore mold.' },
        after: { day: 'Day 10 (29 Aug)', status: 'Healed & Dry (18%)', desc: 'Lesions dried up completely, healthy green shoots active.' },
      },
      farmerActionPlan: [
        {
          title: language === 'mr' ? '१. सध्याचा उपाय' : language === 'hi' ? '1. वर्तमान उपाय' : '1. Ongoing Care',
          detail: language === 'mr'
            ? 'Trichoderma viride (५ ग्रॅम प्रति लिटर) जैविक फवारणी दर १० दिवसांनी चालू ठेवा.'
            : language === 'hi'
            ? 'Trichoderma viride (5 ग्राम प्रति लीटर) जैविक छिड़काव हर 10 दिन में जारी रखें।'
            : 'Maintain Trichoderma viride (5 g per liter) preventive bio-fungicide spray every 10 days.',
        },
        {
          title: language === 'mr' ? '२. खत व्यवस्थापन' : language === 'hi' ? '2. खाद प्रबंधन' : '2. Fertilizer Management',
          detail: language === 'mr' ? 'अतिरिक्त युरिया देणे टाळा, जेणेकरून झाडे जास्त दाट होणार नाहीत.' : language === 'hi' ? 'अतिरिक्त यूरिया न दें, ताकि पत्तियां ज्यादा घनी न हों।' : 'Avoid excess nitrogen fertilizer that creates overly dense canopy.',
        },
        {
          title: language === 'mr' ? '३. मातीची भर' : language === 'hi' ? '3. मिट्टी चढ़ाना' : '3. Soil Ridge Care',
          detail: language === 'mr' ? 'बटाट्याच्या कंदांवर माती व्यवस्थित चढवून घ्या.' : language === 'hi' ? 'आलू के कंदों पर अच्छी तरह मिट्टी चढ़ा कर रखें।' : 'Ensure good soil hilling around potato ridges to prevent tuber infection.',
        },
        {
          title: language === 'mr' ? '४. पुढील तपासणी' : language === 'hi' ? '4. अगली जांच' : '4. Next Inspection',
          detail: language === 'mr' ? '५ दिवसांनी नियमित देखरेख स्कॅन करा.' : language === 'hi' ? '5 दिन बाद सामान्य निगरानी स्कैन करें।' : 'Routine follow-up scan scheduled in 5 days.',
        },
      ],
      officialVerification: {
        status: 'VERIFIED & RECOVERED',
        department: language === 'mr' ? 'जिल्हा कृषी विभाग (पुणे उपविभाग)' : language === 'hi' ? 'जिला कृषि विभाग (पुणे उपखंड)' : 'District Agriculture Department (Pune Division)',
        officerProtectedId: 'Officer ID: #AG-718 (Privacy Protected)',
        clinicalNote: language === 'mr'
          ? 'बटाटा पिकावरील करपा यशस्वीरित्या नियंत्रणात आला आहे. कंद वाढ सामान्य स्थितीत आहे.'
          : language === 'hi'
          ? 'आलू फसल पर झुलसा रोग सफलतापूर्वक नियंत्रित हो गया है। कंद का विकास सामान्य है।'
          : 'Late Blight successfully controlled. Lesion margins dried; crop vegetative health restored.',
      },
    },
  ];

  const currentScenario = farmScenarios.find((f) => f.id === selectedFarm) || farmScenarios[0];

  return (
    <div className="page simple-progress-page">
      {/* Top Header & Plot Toggle */}
      <div className="card simple-report-header">
        <div className="header-left">
          <div className="plot-badge-tag">
            <span>{currentScenario.cropEmoji}</span>
            <span>{currentScenario.title}</span>
          </div>
          <h2>
            {language === 'mr'
              ? 'पीक रोग प्रगती व तपासणी अहवाल'
              : language === 'hi'
              ? 'फसल रोग प्रगति एवं जांच रिपोर्ट'
              : 'Crop Disease Progress & Treatment Report'}
          </h2>
          <p className="report-sub">
            {currentScenario.location} • {currentScenario.variety} • <strong>{currentScenario.stage}</strong>
          </p>
        </div>

        <div className="header-right no-print">
          {/* Farm Switcher */}
          <div className="simple-plot-toggle">
            {farmScenarios.map((f) => (
              <button
                key={f.id}
                className={`toggle-plot-btn ${selectedFarm === f.id ? 'active' : ''}`}
                onClick={() => handleFarmChange(f.id)}
              >
                <span>{f.cropEmoji} {f.crop}</span>
                <span className={`mini-status ${f.trend === 'INCREASING' ? 'danger' : 'success'}`}>
                  {f.trend === 'INCREASING' ? (language === 'mr' ? 'धोका' : 'Alert') : (language === 'mr' ? 'सुधार' : 'OK')}
                </span>
              </button>
            ))}
          </div>

          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={16} />
            <span>{language === 'mr' ? 'अहवाल प्रिंट करा' : language === 'hi' ? 'रिपोर्ट प्रिंट करें' : 'Print / Save PDF'}</span>
          </button>
        </div>
      </div>

      {/* Top Farmer Clarification Guidance Banner */}
      <div className="card farmer-clarification-banner">
        <div className="clarification-icon">💡</div>
        <div className="clarification-text">
          <strong>
            {language === 'mr'
              ? 'शेतकरी मित्रांनो लक्ष द्या: आज शेतात काय उपाय करायचे?'
              : language === 'hi'
              ? 'किसान भाइयों ध्यान दें: आज खेत में क्या उपाय करना है?'
              : 'Farmer Guidance: What should you do in your field today?'}
          </strong>
          <p>
            {language === 'mr'
              ? 'शेतात प्रत्यक्ष काम करण्यासाठी फक्त "डॅशबोर्ड" (Dashboard) वरील ३ पायऱ्यांचे पालन करा. हा "प्रगती अहवाल" केवळ मागील १० दिवसांचा रोग इतिहास, सुधारणा आलेख आणि कृषी विभागाची अधिकृत नोंद आहे.'
              : language === 'hi'
              ? 'खेत में काम करने के लिए केवल "डैशबोर्ड" (Dashboard) पर दिए गए 3 चरणों का पालन करें। यह "प्रगति रिपोर्ट" केवल पिछले 10 दिनों का रोग इतिहास, सुधार ग्राफ और आधिकारिक रिकॉर्ड है।'
              : 'For practical field operations, always follow the 3 action steps on your Dashboard. This Progress Report is strictly your 10-day historical health record, recovery chart, and official agronomic audit.'}
          </p>
        </div>
        <button className="btn btn-primary btn-sm no-print" onClick={() => navigate('/dashboard')}>
          <span>
            {language === 'mr' ? 'आजचे उपाय डॅशबोर्डवर पहा' : language === 'hi' ? 'आज के उपाय डैशबोर्ड पर देखें' : 'View Today’s Actions on Dashboard'}
          </span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* 3 Clear, Informative Key Highlights */}
      <div className="simple-highlights-grid">
        {/* Box 1: Current Score & Trend */}
        <div className={`card highlight-box ${currentScenario.trend === 'INCREASING' ? 'box-danger' : 'box-success'}`}>
          <div className="box-title-row">
            <span className="box-label">
              {language === 'mr' ? 'सध्याची स्थिती' : language === 'hi' ? 'वर्तमान स्थिति' : 'Current Status'}
            </span>
            <span className={`badge ${currentScenario.trend === 'INCREASING' ? 'badge-danger' : 'badge-success'}`}>
              {currentScenario.trendText}
            </span>
          </div>
          <div className="box-score-row">
            <span className={`big-score ${currentScenario.trend === 'INCREASING' ? 'text-red' : 'text-green'}`}>
              {currentScenario.currentRisk} <small>/ 100</small>
            </span>
            <span className="score-delta">
              {currentScenario.change > 0 ? `+${currentScenario.change} pts` : `${currentScenario.change} pts`}
            </span>
          </div>
          <p className="box-desc">
            {currentScenario.trend === 'INCREASING'
              ? (language === 'mr' ? 'गेल्या आठवड्यापेक्षा धोका १३ गुणांनी वाढला आहे.' : language === 'hi' ? 'पिछले हफ्ते की तुलना में 13 अंक बढ़ा है।' : 'Disease risk increased by 13 points since Day 1.')
              : (language === 'mr' ? 'उपचारानंतर धोका १६ गुणांनी कमी झाला आहे.' : language === 'hi' ? 'इलाज के बाद जोखिम 16 अंक कम हुआ है।' : 'Disease risk reduced by 16 points after treatment.')}
          </p>
        </div>

        {/* Box 2: Main Cause */}
        <div className="card highlight-box info-box">
          <div className="box-title-row">
            <span className="box-label">
              {language === 'mr' ? 'रोगाचे मुख्य कारण' : language === 'hi' ? 'रोग का मुख्य कारण' : 'Main Cause'}
            </span>
            <CloudRain size={18} className="text-primary" />
          </div>
          <p className="cause-text">{currentScenario.mainCause}</p>
          <div className="cause-meta">
            <span><Thermometer size={14} /> 27°C Temp</span>
            <span><Droplets size={14} /> 82% Humidity</span>
          </div>
        </div>

        {/* Box 3: Official Certified Prescription on Record */}
        <div className="card highlight-box action-box">
          <div className="box-title-row">
            <span className="box-label">
              {language === 'mr' ? 'अधिकृत औषध नोंद' : language === 'hi' ? 'आधिकारिक दवा रिकॉर्ड' : 'Official Prescription on Record'}
            </span>
            <ShieldCheck size={18} className="text-green" />
          </div>
          <p className="solution-text">
            <strong>Copper Oxychloride 50 WP (2.5 g/L)</strong> — {language === 'mr' ? 'कृषी तज्ञांकडून प्रमाणित' : language === 'hi' ? 'कृषि विशेषज्ञों द्वारा प्रमाणित' : 'Agronomist Certified'}
          </p>
          <div className="next-action-tag">
            <ArrowRight size={13} />
            <span onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
              {language === 'mr' ? 'फवारणी पद्धत डॅशबोर्डवर पहा ➔' : language === 'hi' ? 'छिड़काव विधि डैशबोर्ड पर देखें ➔' : 'Step-by-step checklist on Dashboard ➔'}
            </span>
          </div>
        </div>
      </div>

      {/* Before vs After Comparison Card */}
      <div className="card simple-compare-card">
        <div className="compare-card-header">
          <h3>
            {language === 'mr'
              ? '🔍 १० दिवसांतील पानांची तुलना (दिवस १ विरुद्ध दिवस १०)'
              : language === 'hi'
              ? '🔍 10 दिनों में पत्तियों की तुलना (दिन 1 बनाम दिन 10)'
              : '🔍 10-Day Leaf Comparison (Day 1 vs Day 10)'}
          </h3>
        </div>

        <div className="simple-compare-boxes">
          <div className="compare-box before">
            <span className="compare-tag">{currentScenario.beforeAfter.before.day}</span>
            <h4>{currentScenario.beforeAfter.before.status}</h4>
            <p>{currentScenario.beforeAfter.before.desc}</p>
          </div>

          <div className="compare-arrow">➔</div>

          <div className={`compare-box after ${currentScenario.trend === 'INCREASING' ? 'danger' : 'success'}`}>
            <span className="compare-tag">{currentScenario.beforeAfter.after.day}</span>
            <h4>{currentScenario.beforeAfter.after.status}</h4>
            <p>{currentScenario.beforeAfter.after.desc}</p>
          </div>
        </div>
      </div>

      {/* Simple Evolution Chart */}
      <div className="card simple-chart-card">
        <div className="chart-title-flex">
          <div>
            <h3>
              {language === 'mr'
                ? '📈 १० दिवसांचा रोग वाढीचा आलेख'
                : language === 'hi'
                ? '📈 10 दिनों का रोग ग्राफ'
                : '📈 10-Day Disease Evolution Curve'}
            </h3>
            <p className="chart-sub">
              {language === 'mr'
                ? 'हिरवा = सुरक्षित (०-३९), पिवळा = मध्यम (४०-६९), लाल = धोक्याची पातळी (७०+)'
                : language === 'hi'
                ? 'हरा = सुरक्षित (0-39), पीला = मध्यम (40-69), लाल = खतरे का स्तर (70+)'
                : 'Green = Safe (0-39), Amber = Moderate (40-69), Red = High Alert (70+)'}
            </p>
          </div>

          <div className="legend-tags">
            <span className="leg safe">🟢 0-39 Safe</span>
            <span className="leg warn">🟡 40-69 Watch</span>
            <span className="leg danger">🔴 70-100 Danger</span>
          </div>
        </div>

        <div style={{ width: '100%', height: 230 }}>
          <ResponsiveContainer>
            <AreaChart data={currentScenario.data} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="cleanRiskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentScenario.trend === 'INCREASING' ? '#ef4444' : '#22c55e'} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={currentScenario.trend === 'INCREASING' ? '#ef4444' : '#22c55e'} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis domain={[0, 100]} stroke="#94a3b8" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="simple-tt">
                        <strong>{d.day} ({d.date})</strong>
                        <p>Risk Score: <strong>{d.riskScore}/100</strong></p>
                        <small>Spots: {d.spots} • Humidity: {d.humidity}</small>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" label={{ value: '🔴 Red Zone (70+)', fill: '#ef4444', fontSize: 11 }} />
              <ReferenceLine y={40} stroke="#f59e0b" strokeDasharray="3 3" />
              <Area
                type="monotone"
                dataKey="riskScore"
                stroke={currentScenario.trend === 'INCREASING' ? '#ef4444' : '#22c55e'}
                strokeWidth={3}
                fill="url(#cleanRiskGrad)"
                dot={{ r: 6, fill: currentScenario.trend === 'INCREASING' ? '#ef4444' : '#22c55e' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4-Day History Table (Simple & Clear) */}
      <div className="card simple-history-table-card">
        <h3>
          {language === 'mr'
            ? '📋 ४ तपासण्यांची तारीखवार नोंद'
            : language === 'hi'
            ? '📋 4 जांचों का तारीखवार विवरण'
            : '📋 4-Day Sequential Inspection Log'}
        </h3>

        <div className="table-responsive">
          <table className="simple-table">
            <thead>
              <tr>
                <th>{language === 'mr' ? 'तपासणी' : language === 'hi' ? 'जांच' : 'Inspection'}</th>
                <th>{language === 'mr' ? 'तारीख' : language === 'hi' ? 'तारीख' : 'Date'}</th>
                <th>{language === 'mr' ? 'धोका गुण' : language === 'hi' ? 'जोखिम स्कोर' : 'Risk Score'}</th>
                <th>{language === 'mr' ? 'हवामान' : language === 'hi' ? 'मौसम' : 'Weather'}</th>
                <th>{language === 'mr' ? 'पानावरील डाग' : language === 'hi' ? 'पत्ती पर धब्बे' : 'Lesion Spread'}</th>
                <th>{language === 'mr' ? 'शेतात काय दिसले?' : language === 'hi' ? 'खेत में क्या दिखा?' : 'Observation'}</th>
              </tr>
            </thead>
            <tbody>
              {currentScenario.data.map((step) => (
                <tr key={step.day}>
                  <td><strong>{step.day}</strong></td>
                  <td>{step.date}</td>
                  <td>
                    <span className={`risk-badge-cell ${step.riskScore >= 70 ? 'danger' : step.riskScore >= 40 ? 'warn' : 'good'}`}>
                      {step.riskScore} / 100
                    </span>
                  </td>
                  <td>{step.temp}, {step.humidity}</td>
                  <td>{step.spots}</td>
                  <td className="note-cell">{step.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clinical Treatment Efficacy & Historical Audit (No duplicate action steps) */}
      <div className="card simple-action-plan-card">
        <div className="audit-card-top">
          <div>
            <h3>
              {language === 'mr'
                ? '🔬 कृषी अधिकारी तपासणी नोंद व शास्त्रीय निष्कर्ष'
                : language === 'hi'
                ? '🔬 कृषि अधिकारी जांच रिकॉर्ड एवं वैज्ञानिक निष्कर्ष'
                : '🔬 Agronomist Clinical Evaluation & Scientific Findings'}
            </h3>
            <p className="sub-hint">
              {language === 'mr'
                ? '१० दिवसांच्या निरीक्षणावरून कृषी प्रणालीचे अधिकृत मूल्यांकन (दैनंदिन उपायांसाठी डॅशबोर्ड वापरा):'
                : language === 'hi'
                ? '10 दिनों के निरीक्षण के आधार पर आधिकारिक मूल्यांकन (दैनिक उपायों के लिए डैशबोर्ड देखें):'
                : 'Official evaluation based on 10-day monitoring (Follow Dashboard for daily farm tasks):'}
            </p>
          </div>
          <button className="btn btn-primary btn-sm no-print" onClick={() => navigate('/dashboard')}>
            <span>{language === 'mr' ? 'आजचे उपाय डॅशबोर्डवर करा' : language === 'hi' ? 'आज के उपाय डैशबोर्ड पर करें' : 'Perform Today’s Actions on Dashboard'}</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="action-plan-grid">
          <div className="plan-item-box">
            <h4>
              {language === 'mr' ? '१. रोग स्थिती मूल्यमापन' : language === 'hi' ? '1. रोग स्थिति मूल्यांकन' : '1. Disease Severity Audit'}
            </h4>
            <p>
              {currentScenario.trend === 'INCREASING'
                ? (language === 'mr'
                  ? 'रोग वाढीचा वेग जास्त असल्याने तातडीने कॉपर बुरशीनाशकाची फवारणी आवश्यक आहे.'
                  : language === 'hi'
                  ? 'रोग का फैलाव तेज होने के कारण तुरंत कॉपर फफूंदनाशक का छिड़काव अनिवार्य है।'
                  : 'Fungal escalation active; contact copper spray necessary to halt mycelial spread.')
                : (language === 'mr'
                  ? 'बुरशीनाशक उपचार यशस्वी ठरले असून नवीन फुटवे निरोगी येत आहेत.'
                  : language === 'hi'
                  ? 'दवा का असर सफल रहा है और नई पत्तियां स्वस्थ आ रही हैं।'
                  : 'Fungicide regimen effective; lesions dried up and new growth is healthy.')}
            </p>
          </div>

          <div className="plan-item-box">
            <h4>
              {language === 'mr' ? '२. सूक्ष्म हवामान विश्लेषण' : language === 'hi' ? '2. सूक्ष्म मौसम विश्लेषण' : '2. Microclimate Analysis'}
            </h4>
            <p>
              {language === 'mr'
                ? 'हवेतील ८२% जास्त दमटपणामुळे झाडांमध्ये हवा खेळती राहणे आणि पाने सुकी राहणे आवश्यक आहे.'
                : language === 'hi'
                ? 'हवा में 82% अत्यधिक नमी के कारण पौधों में हवा का संचार और पत्तियों का सूखा रहना जरूरी है।'
                : 'Relative humidity of 82% requires strict pruning and canopy aeration to starve fungal spores.'}
            </p>
          </div>

          <div className="plan-item-box">
            <h4>
              {language === 'mr' ? '३. पुढील तपासणी तारीख' : language === 'hi' ? '3. अगली जांच की तारीख' : '3. Next Audit Date'}
            </h4>
            <p>
              {language === 'mr'
                ? 'फवारणीनंतर ३ दिवसांनी (६ सप्टेंबर) कॅमेऱ्याने पुन्हा स्कॅन करून सुधारणा तपासावी.'
                : language === 'hi'
                ? 'दवा छिड़कने के 3 दिन बाद (6 सितंबर) कैमरे से दोबारा स्कैन करके सुधार जांचें।'
                : 'Next evaluation scan scheduled on 06 Sep (in 3 days) to audit recovery index.'}
            </p>
          </div>
        </div>
      </div>

      {/* Official Government / Department Verification (Personal Names Protected) */}
      <div className="card simple-verification-footer">
        <div className="verif-icon">
          <ShieldCheck size={28} className="text-green" />
        </div>
        <div className="verif-content">
          <div className="verif-title-row">
            <h4>{currentScenario.officialVerification.department}</h4>
            <span className="protected-id-badge">
              {currentScenario.officialVerification.officerProtectedId}
            </span>
          </div>
          <p className="clinical-text">"{currentScenario.officialVerification.clinicalNote}"</p>
          <small className="privacy-note">
            🔒 {language === 'mr'
              ? 'कृषी अधिकारी ओळख गोपनीयता नियमांनुसार सुरक्षित ठेवली आहे.'
              : language === 'hi'
              ? 'कृषि अधिकारी की व्यक्तिगत पहचान डेटा गोपनीयता नियमों के तहत सुरक्षित रखी गई है।'
              : 'Agronomist individual identity is protected under agricultural data privacy guidelines.'}
          </small>
        </div>
      </div>
    </div>
  );
}
