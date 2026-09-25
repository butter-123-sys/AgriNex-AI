// ============================================================
// AgriFedX — Multilingual Translation Dictionary (EN / MR / HI)
// ============================================================

const translations: Record<string, Record<string, string>> = {
  // ---------- Navigation ----------
  'nav.dashboard': { en: 'Dashboard', mr: 'डॅशबोर्ड', hi: 'डैशबोर्ड' },
  'nav.diagnosis': { en: 'New Diagnosis', mr: 'नवीन निदान', hi: 'नया निदान' },
  'nav.history': { en: 'History', mr: 'इतिहास', hi: 'इतिहास' },
  'nav.progress': { en: 'Progress', mr: 'प्रगती', hi: 'प्रगति' },
  'nav.map': { en: 'Disease Map', mr: 'रोग नकाशा', hi: 'रोग मानचित्र' },
  'nav.alerts': { en: 'Alerts', mr: 'सूचना', hi: 'अलर्ट' },
  'nav.profile': { en: 'Profile', mr: 'प्रोफाइल', hi: 'प्रोफ़ाइल' },
  'nav.validations': { en: 'Validations', mr: 'प्रमाणीकरण', hi: 'सत्यापन' },
  'nav.analytics': { en: 'Analytics', mr: 'विश्लेषण', hi: 'विश्लेषण' },
  'nav.architecture': { en: 'Architecture', mr: 'आर्किटेक्चर', hi: 'आर्किटेक्चर' },
  'nav.officerDashboard': { en: 'Officer Dashboard', mr: 'अधिकारी डॅशबोर्ड', hi: 'अधिकारी डैशबोर्ड' },
  'nav.chatbot': { en: 'AI Multi-Agent Chatbot', mr: 'AI बहु-एजंट चॅटबॉट', hi: 'AI बहु-एजेंट चैटबॉट' },

  // ---------- Common ----------
  'common.crop': { en: 'Crop', mr: 'पीक', hi: 'फसल' },
  'common.disease': { en: 'Disease', mr: 'रोग', hi: 'रोग' },
  'common.risk': { en: 'Risk', mr: 'जोखीम', hi: 'जोखिम' },
  'common.weather': { en: 'Weather', mr: 'हवामान', hi: 'मौसम' },
  'common.location': { en: 'Location', mr: 'स्थान', hi: 'स्थान' },
  'common.confidence': { en: 'Confidence', mr: 'आत्मविश्वास', hi: 'विश्वास' },
  'common.severity': { en: 'Severity', mr: 'तीव्रता', hi: 'गंभीरता' },
  'common.status': { en: 'Status', mr: 'स्थिती', hi: 'स्थिति' },
  'common.date': { en: 'Date', mr: 'तारीख', hi: 'तारीख' },
  'common.actions': { en: 'Actions', mr: 'कृती', hi: 'कार्रवाई' },
  'common.save': { en: 'Save', mr: 'जतन करा', hi: 'सहेजें' },
  'common.cancel': { en: 'Cancel', mr: 'रद्द करा', hi: 'रद्द करें' },
  'common.confirm': { en: 'Confirm', mr: 'पुष्टी करा', hi: 'पुष्टि करें' },
  'common.search': { en: 'Search', mr: 'शोधा', hi: 'खोजें' },
  'common.filter': { en: 'Filter', mr: 'फिल्टर', hi: 'फ़िल्टर' },
  'common.noData': { en: 'No data available', mr: 'डेटा उपलब्ध नाही', hi: 'कोई डेटा उपलब्ध नहीं' },
  'common.loading': { en: 'Loading...', mr: 'लोड होत आहे...', hi: 'लोड हो रहा है...' },
  'common.demoMode': { en: 'Demo Mode', mr: 'डेमो मोड', hi: 'डेमो मोड' },

  // ---------- Brand & Core Tagline ----------
  'brand.name': { en: 'AgriNex AI', mr: 'AgriNex AI', hi: 'AgriNex AI' },
  'brand.tagline': { en: 'The Next Generation Crop Health Intelligence', mr: 'पुढील पिढीची पीक आरोग्य बुद्धिमत्ता', hi: 'अगली पीढ़ी की फसल स्वास्थ्य बुद्धिमत्ता' },

  // ---------- Crops ----------
  'crop.Tomato': { en: 'Tomato', mr: 'टोमॅटो', hi: 'टमाटर' },
  'crop.Potato': { en: 'Potato', mr: 'बटाटा', hi: 'आलू' },
  'crop.Maize': { en: 'Maize', mr: 'मका', hi: 'मक्का' },
  'crop.Cotton': { en: 'Cotton', mr: 'कापूस', hi: 'कपास' },
  'crop.Soybean': { en: 'Soybean', mr: 'सोयाबीन', hi: 'सोयाबीन' },
  'crop.all': { en: 'All Crops', mr: 'सर्व पिके', hi: 'सभी फसलें' },

  // ---------- Diseases (Multilingual) ----------
  'disease.EarlyBlight': { en: 'Early Blight', mr: 'लवकर येणारा करपा', hi: 'अगेती झुलसा' },
  'disease.LateBlight': { en: 'Late Blight', mr: 'उशिरा येणारा करपा', hi: 'पछेती झुलसा' },
  'disease.LeafSpot': { en: 'Leaf Spot', mr: 'पानावरील ठिपके', hi: 'पत्ती धब्बा रोग' },
  'disease.Healthy': { en: 'Healthy Crop', mr: 'निरोगी पीक', hi: 'स्वस्थ फसल' },

  // ---------- Stages (Multilingual) ----------
  'stage.seedling': { en: 'Seedling', mr: 'रोप अवस्था', hi: 'अंकुरण/पौध' },
  'stage.vegetative': { en: 'Vegetative', mr: 'शाकीय वाढ', hi: 'वानस्पतिक वृद्धि' },
  'stage.flowering': { en: 'Flowering', mr: 'फुलोरा अवस्था', hi: 'फूल आने की अवस्था' },
  'stage.fruiting': { en: 'Fruiting', mr: 'फळधारणा', hi: 'फल लगने की अवस्था' },
  'stage.maturity': { en: 'Maturity', mr: 'पक्वता टप्पा', hi: 'परिपक्वता चरण' },
  'stage.active': { en: 'ACTIVE', mr: 'सक्रिय', hi: 'सक्रिय' },
  'stage.present': { en: 'Present', mr: 'सध्या चालू', hi: 'वर्तमान' },

  // ---------- Dashboard ----------
  'dashboard.title': { en: 'Farmer Dashboard', mr: 'शेतकरी डॅशबोर्ड', hi: 'किसान डैशबोर्ड' },
  'dashboard.currentRisk': { en: 'Current Risk', mr: 'सध्याचा धोका', hi: 'वर्तमान जोखिम' },
  'dashboard.recentDisease': { en: 'Recent Disease', mr: 'अलीकडील रोग', hi: 'हालिया रोग' },
  'dashboard.totalDiagnoses': { en: 'Total Diagnoses', mr: 'एकूण निदान', hi: 'कुल निदान' },
  'dashboard.activeAlerts': { en: 'Active Alerts', mr: 'सक्रिय सूचना', hi: 'सक्रिय अलर्ट' },
  'dashboard.quickActions': { en: 'Quick Actions', mr: 'जलद कृती', hi: 'त्वरित कार्रवाई' },
  'dashboard.newDiagnosis': { en: 'New Diagnosis', mr: 'नवीन निदान', hi: 'नया निदान' },
  'dashboard.viewHistory': { en: 'View History', mr: 'इतिहास पहा', hi: 'इतिहास देखें' },
  'dashboard.diseaseMap': { en: 'Disease Map', mr: 'रोग नकाशा', hi: 'रोग मानचित्र' },
  'dashboard.heroTitle': { en: 'AgriNex AI', mr: 'AgriNex AI', hi: 'AgriNex AI' },
  'dashboard.heroSubtitle': { en: 'The Next Generation Crop Health Intelligence', mr: 'पुढील पिढीची पीक आरोग्य बुद्धिमत्ता', hi: 'अगली पीढ़ी की फसल स्वास्थ्य बुद्धिमत्ता' },
  'dashboard.multiCropMonitoring': { en: 'Multi-Crop Intelligence & Real-Time Farm Health Monitoring', mr: 'सर्वसमावेशक बहु-पीक बुद्धिमत्ता आणि थेट शेती आरोग्य निरीक्षण', hi: 'व्यापक बहु-फसल बुद्धिमत्ता और रीयल-टाइम खेत स्वास्थ्य निगरानी' },
  'dashboard.overallCropsSupported': { en: 'Active Multi-Crop Coverage: Tomato, Potato, Maize, Cotton, Soybean', mr: 'सक्रिय सर्व पिके: टोमॅटो, बटाटा, मका, कापूस, सोयाबीन', hi: 'सक्रिय सभी फसलें: टमाटर, आलू, मक्का, कपास, सोयाबीन' },
  'dashboard.farmerPlotOwner': { en: 'Farmer • Overall Crop Cultivator', mr: 'शेतकरी • बहु-पीक शेतकरी', hi: 'किसान • बहु-फसल उत्पादक' },
  'dashboard.fieldOverview': { en: 'Field Overview — Nashik & Maharashtra Region', mr: 'शेत विहंगावलोकन — नाशिक आणि महाराष्ट्र विभाग', hi: 'खेत अवलोकन — नासिक एवं महाराष्ट्र क्षेत्र' },
  'dashboard.airTemp': { en: 'Air Temp', mr: 'हवेचे तापमान', hi: 'हवा का तापमान' },
  'dashboard.humidity': { en: 'Relative Humidity', mr: 'सापेक्ष आर्द्रता', hi: 'सापेक्ष नमी' },
  'dashboard.windSpeed': { en: 'Wind Speed', mr: 'वाऱ्याचा वेग', hi: 'हवा की गति' },
  'dashboard.fieldLocation': { en: 'Field Plot Details', mr: 'शेत प्लॉट तपशील', hi: 'खेत प्लॉट विवरण' },

  // Daily Actions
  'dashboard.perDayTitle': { en: 'PER DAY ACTIONS TO FOLLOW', mr: 'दररोज करावयाच्या कृती', hi: 'प्रतिदिन करने योग्य कार्य' },
  'dashboard.perDayHeading': { en: '🌾 3 Key Per-Day Actions for Your Field Today', mr: '🌾 आज शेतात करावयाच्या दैनंदिन ३ पायऱ्या', hi: '🌾 आज खेत में करने के 3 दैनिक जरूरी कदम' },
  'dashboard.perDaySub': { en: 'Follow these daily agronomist-verified actions to protect crop health & halt disease:', mr: 'पिकांचे आरोग्य जपण्यासाठी आणि रोग रोखण्यासाठी कृषी अधिकाऱ्यांनी प्रमाणित केलेले आजचे थेट उपाय:', hi: 'फसल स्वास्थ्य की सुरक्षा और रोग रोकने हेतु कृषि विशेषज्ञों द्वारा प्रमाणित आज के सीधे उपाय:' },
  'dashboard.stepDone': { en: '✓ Completed', mr: '✓ पूर्ण झाले', hi: '✓ पूर्ण हुआ' },
  'dashboard.stepMark': { en: 'Mark as Done', mr: 'पूर्ण चिन्हांकित करा', hi: 'पूर्ण चिह्नित करें' },
  'dashboard.completedToday': { en: 'Completed Today', mr: 'आज पूर्ण झाले', hi: 'आज पूर्ण हुआ' },

  'dashboard.action1.title': {
    en: '1. Spray Prescribed Protective Fungicide / Bio-Pesticide',
    mr: '१. शिफारस केलेले बुरशीनाशक / जैविक कीटकनाशक फवारा',
    hi: '1. अनुशंसित फफूंदनाशक / जैविक कीटनाशक का छिड़काव करें'
  },
  'dashboard.action1.desc': {
    en: 'Spray Copper Oxychloride 50 WP (2.5 g/L water) or Neem formulation. Apply when leaves are dry and wind is gentle (< 8 km/h).',
    mr: 'कॉपर ऑक्सिक्लोराईड ५० WP (२.५ ग्रॅम प्रति लिटर पाण्यात) किंवा निंबोळी अर्क फवारा. पाने कोरडी असताना व वारा शांत असताना फवारणी करावी.',
    hi: 'कॉपर ऑक्सीक्लोराइड 50 WP (2.5 ग्राम प्रति लीटर पानी में) या नीम अर्क का छिड़काव करें। पत्तियां सूखी हों और हवा शांत हो तब छिड़कें।'
  },
  'dashboard.action2.title': {
    en: '2. Prune Infected Lower Leaves & Clear Residue',
    mr: '२. जमिनीलगतची पिवळी व डागाळलेली पाने तोडा',
    hi: '2. जमीन से सटी पीली व रोगग्रस्त पत्तियां हटाएं'
  },
  'dashboard.action2.desc': {
    en: 'Remove soil-touching spotted leaves and safely dispose of them outside the field to prevent fungal spores from splashing upward.',
    mr: 'जमिनीला टेकलेली डागाळलेली पाने काढून शेताबाहेर नष्ट करा, जेणेकरून बुरशीचे कण वरच्या पानांवर उडणार नाहीत.',
    hi: 'जमीन को छूने वाली धब्बेदार पत्तियों को तोड़कर खेत से बाहर नष्ट करें, ताकि फफूंद के बीजाणु ऊपर की पत्तियों पर न फैलें।'
  },
  'dashboard.action3.title': {
    en: '3. Water at Roots Only (Drip Irrigation)',
    mr: '३. फक्त मुळांशी पाणी द्या (ठिबक सिंचन)',
    hi: '3. केवल जड़ों में पानी दें (ड्रिप सिंचाई)'
  },
  'dashboard.action3.desc': {
    en: 'Use drip lines directly at the roots. Avoid sprinkler irrigation, as standing moisture on leaves accelerates pathogen reproduction.',
    mr: 'केवळ ठिबक सिंचनाचा वापर करा. तुषार (Sprinkler) बंद ठेवा. पानांवर पाणी साचल्यास करपा वेगाने पसरतो.',
    hi: 'केवल ड्रिप सिंचाई का उपयोग करें। फव्वारा (स्प्रिंकलर) बंद रखें, क्योंकि पत्तियों पर नमी टिकने से रोग तेजी से फैलता है।'
  },

  // Growth Stage Tracker
  'dashboard.growthStageHeader': {
    en: 'Current Stage: Flowering / Active Canopy (High Disease Vigilance)',
    mr: 'सध्याचा टप्पा: फुलोरा / सक्रिय वाढ (उच्च रोग दक्षता कालावधी)',
    hi: 'वर्तमान अवस्था: फूल आना / सक्रिय वृद्धि (उच्च रोग सतर्कता अवधि)'
  },

  // Quick Action Buttons
  'dashboard.quickActionsTitle': { en: 'Quick Crop Actions', mr: 'जलद पीक कृती', hi: 'त्वरित फसल कार्रवाई' },
  'dashboard.scanLeaf': { en: 'Scan Any Crop Leaf', mr: 'कोणत्याही पिकाचे पान स्कॅन करा', hi: 'किसी भी फसल की पत्ती स्कैन करें' },
  'dashboard.runAI': { en: 'Run instant AI disease detection for all crops', mr: 'सर्व पिकांसाठी तात्काळ AI रोग निदान चालवा', hi: 'सभी फसलों के लिए तुरंत AI रोग निदान चलाएं' },
  'dashboard.monitorTrend': { en: 'Monitor Crop Health Trend', mr: 'पीक आरोग्य प्रवृत्ती ट्रॅक करा', hi: 'फसल स्वास्थ्य रुझान ट्रैक करें' },
  'dashboard.trackProgress': { en: 'Track 10-day recovery trajectory & healing', mr: '१०-दिवसीय प्रगती व सुधारणा ट्रॅक करा', hi: '10-दिवसीय सुधार प्रक्षेपवक्र ट्रैक करें' },
  'dashboard.diseaseMapMH': { en: 'Maharashtra Disease Map', mr: 'महाराष्ट्र रोग नकाशा', hi: 'महाराष्ट्र रोग मानचित्र' },
  'dashboard.viewHotspots': { en: 'View regional hotspots & outbreak zones', mr: 'प्रादेशिक हॉटस्पॉट आणि उद्रेक क्षेत्रे पहा', hi: 'क्षेत्रीय हॉटस्पॉट और प्रकोप क्षेत्र देखें' },

  // Charts
  'dashboard.diseasesDetected': { en: 'Diseases Detected Across Crops', mr: 'सर्व पिकांमध्ये आढळलेले रोग', hi: 'सभी फसलों में पाए गए रोग' },
  'dashboard.donutSubtitle': { en: 'Distribution of pathogens found across farm crop diagnoses (Tomato, Potato, Maize, etc.)', mr: 'शेतातील विविध पिकांच्या निदानांमध्ये आढळलेल्या रोगांचे प्रमाण (टोमॅटो, बटाटा, मका इ.)', hi: 'खेत की विभिन्न फसलों में पाए गए रोगों का वितरण (टमाटर, आलू, मक्का आदि)' },
  'dashboard.riskTrajectory': { en: 'Crop Disease Risk Trajectory', mr: 'पीक रोग जोखीम मार्ग', hi: 'फसल रोग जोखिम प्रक्षेपवक्र' },
  'dashboard.trajectorySubtitle': { en: 'Day 1 to Day 10 risk progression & recovery curve across field plots', mr: 'शेत प्लॉट्समधील दिवस १ ते १० जोखीम बदल व सुधारणा वक्र', hi: 'खेत प्लॉट्स में दिन 1 से 10 जोखिम प्रगति एवं सुधार वक्र' },
  'dashboard.fieldDiagnosesTooltip': { en: 'of field diagnoses', mr: 'शेत निदानांपैकी', hi: 'खेत निदान में से' },
  'dashboard.riskScoreTooltip': { en: 'Risk Score', mr: 'जोखीम गुण', hi: 'जोखिम स्कोर' },
  'dashboard.latestDiagnosis': { en: 'LATEST DIAGNOSIS', mr: 'नवीनतम निदान', hi: 'नवीनतम निदान' },
  'dashboard.viewAdvisory': { en: 'View Complete Advisory & Actions', mr: 'संपूर्ण सल्ला आणि कृती पहा', hi: 'पूर्ण सलाह और कार्रवाई देखें' },
  'dashboard.dayLabel': { en: 'Day', mr: 'दिवस', hi: 'दिन' },
  'traj.day1': { en: 'Initial mild symptoms observed', mr: 'सुरुवातीची सौम्य लक्षणे आढळली', hi: 'शुरुआती हल्के लक्षण देखे गए' },
  'traj.day4': { en: 'Lesions spreading on lower foliage', mr: 'खालच्या पानांवर डाग पसरत आहेत', hi: 'निचली पत्तियों पर धब्बे फैल रहे हैं' },
  'traj.day7': { en: 'High humidity accelerated risk', mr: 'दमट हवेमुळे जोखीम वाढली', hi: 'उच्च आर्द्रता से जोखिम बढ़ा' },
  'traj.day10': { en: 'Treatment applied; recovery beginning', mr: 'उपाययोजना केली; सुधारणा सुरू झाली', hi: 'उपचार किया गया; सुधार शुरू हुआ' },

  // ---------- Diagnosis ----------
  'diagnosis.title': { en: 'Crop Disease Diagnosis', mr: 'पीक रोग निदान', hi: 'फसल रोग निदान' },
  'diagnosis.uploadImage': { en: 'Upload Leaf Image', mr: 'पानाचे चित्र अपलोड करा', hi: 'पत्ती की छवि अपलोड करें' },
  'diagnosis.dragDrop': { en: 'Drag & drop or click to upload', mr: 'ड्रॅग & ड्रॉप करा किंवा अपलोड करण्यासाठी क्लिक करा', hi: 'खींचें और छोड़ें या अपलोड करने के लिए क्लिक करें' },
  'diagnosis.selectCrop': { en: 'Select Crop', mr: 'पीक निवडा', hi: 'फसल चुनें' },
  'diagnosis.selectStage': { en: 'Crop Stage', mr: 'पीक टप्पा', hi: 'फसल चरण' },
  'diagnosis.selectLocation': { en: 'Location', mr: 'स्थान', hi: 'स्थान' },
  'diagnosis.analyze': { en: 'Analyze Crop', mr: 'पीक विश्लेषण करा', hi: 'फसल विश्लेषण करें' },
  'diagnosis.analyzing': { en: 'Analyzing...', mr: 'विश्लेषण सुरू...', hi: 'विश्लेषण हो रहा है...' },
  'diagnosis.result': { en: 'Diagnosis Result', mr: 'निदान निकाल', hi: 'निदान परिणाम' },
  'diagnosis.demoScenario': { en: 'Demo Scenario', mr: 'डेमो परिस्थिती', hi: 'डेमो परिदृश्य' },

  // ---------- Results ----------
  'result.diseaseDetected': { en: 'Disease Detected', mr: 'रोग आढळला', hi: 'रोग पाया गया' },
  'result.riskScore': { en: 'Risk Score', mr: 'जोखीम गुण', hi: 'जोखिम स्कोर' },
  'result.recommendations': { en: 'Recommendations', mr: 'शिफारसी', hi: 'सिफ़ारिशें' },
  'result.immediateActions': { en: 'Immediate Actions', mr: 'तात्काळ कृती', hi: 'तत्काल कार्रवाई' },
  'result.preventive': { en: 'Preventive Measures', mr: 'प्रतिबंधात्मक उपाय', hi: 'निवारक उपाय' },
  'result.treatment': { en: 'Treatment Guidance', mr: 'उपचार मार्गदर्शन', hi: 'उपचार मार्गदर्शन' },
  'result.monitoring': { en: 'Monitoring', mr: 'निरीक्षण', hi: 'निगरानी' },
  'result.aiExplanation': { en: 'AI Explanation', mr: 'AI स्पष्टीकरण', hi: 'AI व्याख्या' },
  'result.expertRequired': { en: 'Expert Validation Required', mr: 'तज्ञ प्रमाणीकरण आवश्यक', hi: 'विशेषज्ञ सत्यापन आवश्यक' },
  'result.saveDiagnosis': { en: 'Save Diagnosis', mr: 'निदान जतन करा', hi: 'निदान सहेजें' },
  'result.newDiagnosis': { en: 'New Diagnosis', mr: 'नवीन निदान', hi: 'नया निदान' },
  'result.analysisComplete': { en: 'Analysis Complete', mr: 'विश्लेषण पूर्ण', hi: 'विश्लेषण पूर्ण' },
  'result.weatherConditions': { en: 'Weather Conditions', mr: 'हवामान परिस्थिती', hi: 'मौसम की स्थिति' },
  'result.locationCropInfo': { en: 'Location & Crop Info', mr: 'स्थान आणि पीक माहिती', hi: 'स्थान और फसल जानकारी' },
  'result.diagnosisSaved': { en: 'Diagnosis Saved Successfully', mr: 'निदान यशस्वीरित्या जतन केले', hi: 'निदान सफलतापूर्वक सहेजा गया' },

  // ---------- Validation ----------
  'validation.title': { en: 'Expert Validation', mr: 'तज्ञ प्रमाणीकरण', hi: 'विशेषज्ञ सत्यापन' },
  'validation.pending': { en: 'Pending', mr: 'प्रलंबित', hi: 'लंबित' },
  'validation.confirmed': { en: 'Confirmed', mr: 'पुष्टी', hi: 'पुष्टि' },
  'validation.modified': { en: 'Modified', mr: 'सुधारित', hi: 'संशोधित' },
  'validation.rejected': { en: 'Rejected', mr: 'नाकारले', hi: 'अस्वीकृत' },
  'validation.modify': { en: 'Modify', mr: 'सुधारणा', hi: 'संशोधन' },
  'validation.reject': { en: 'Reject', mr: 'नाकारा', hi: 'अस्वीकार' },
  'validation.comment': { en: 'Expert Comment', mr: 'तज्ञ टिप्पणी', hi: 'विशेषज्ञ टिप्पणी' },

  // ---------- Officer ----------
  'officer.dashboard': { en: 'Officer Dashboard', mr: 'अधिकारी डॅशबोर्ड', hi: 'अधिकारी डैशबोर्ड' },
  'officer.totalFarmers': { en: 'Total Farmers', mr: 'एकूण शेतकरी', hi: 'कुल किसान' },
  'officer.totalCases': { en: 'Total Cases', mr: 'एकूण प्रकरणे', hi: 'कुल मामले' },
  'officer.highRisk': { en: 'High Risk Cases', mr: 'उच्च जोखीम प्रकरणे', hi: 'उच्च जोखिम मामले' },
  'officer.pendingValidation': { en: 'Pending Validation', mr: 'प्रलंबित प्रमाणीकरण', hi: 'लंबित सत्यापन' },
  'officer.activeAlerts': { en: 'Active Alerts', mr: 'सक्रिय सूचना', hi: 'सक्रिय अलर्ट' },
  'officer.hotspots': { en: 'Disease Hotspots', mr: 'रोग हॉटस्पॉट', hi: 'रोग हॉटस्पॉट' },
  'officer.expertValidation': { en: 'Expert Validation', mr: 'तज्ञ प्रमाणीकरण', hi: 'विशेषज्ञ सत्यापन' },
  'officer.overview': { en: 'Agriculture Intelligence Overview', mr: 'कृषी बुद्धिमत्ता विहंगावलोकन', hi: 'कृषि बुद्धिमत्ता अवलोकन' },
  'officer.diseaseDistribution': { en: 'Disease Distribution', mr: 'रोग वितरण', hi: 'रोग वितरण' },
  'officer.riskDistribution': { en: 'Risk Distribution', mr: 'जोखीम वितरण', hi: 'जोखिम वितरण' },
  'officer.casesOverTime': { en: 'Cases Over Time', mr: 'कालानुसार प्रकरणे', hi: 'समय के साथ मामले' },
  'officer.cropDistribution': { en: 'Crop Distribution', mr: 'पीक वितरण', hi: 'फसल वितरण' },
  'officer.highRiskAreas': { en: 'High-Risk Areas', mr: 'उच्च जोखीम क्षेत्रे', hi: 'उच्च जोखिम क्षेत्र' },
  'officer.recentCases': { en: 'Recent Cases', mr: 'अलीकडील प्रकरणे', hi: 'हालिया मामले' },
  'officer.pendingValidations': { en: 'Pending Validations', mr: 'प्रलंबित प्रमाणीकरणे', hi: 'लंबित सत्यापन' },

  // ---------- Architecture ----------
  'arch.title': { en: 'System Architecture', mr: 'सिस्टम आर्किटेक्चर', hi: 'सिस्टम आर्किटेक्चर' },
  'arch.multiAgent': { en: 'Multi-Agent Architecture', mr: 'बहु-एजंट आर्किटेक्चर', hi: 'बहु-एजेंट आर्किटेक्चर' },
  'arch.federated': { en: 'Federated Learning', mr: 'फेडरेटेड लर्निंग', hi: 'फ़ेडरेटेड लर्निंग' },
  'arch.systemPipeline': { en: 'End-to-End System Pipeline Diagram', mr: 'संपूर्ण सिस्टम पाइपलाइन आकृती', hi: 'संपूर्ण सिस्टम पाइपलाइन आरेख' },
  'arch.multiAgentCooperative': { en: 'Multi-Agent Cooperative Architecture', mr: 'बहु-एजंट सहकार्य आर्किटेक्चर', hi: 'बहु-एजेंट सहकारी आर्किटेक्चर' },
  'arch.agentsActive': { en: '6 Autonomous Agents Active', mr: '६ स्वायत्त एजंट सक्रिय', hi: '6 स्वायत्त एजेंट सक्रिय' },
  'arch.fedSimulation': { en: 'Federated Learning Visual Simulation', mr: 'फेडरेटेड लर्निंग व्हिज्युअल सिम्युलेशन', hi: 'फ़ेडरेटेड लर्निंग विज़ुअल सिमुलेशन' },
  'arch.simulateRound': { en: 'Simulate Federated Round', mr: 'फेडरेटेड राउंड सिम्युलेट करा', hi: 'फ़ेडरेटेड राउंड सिमुलेट करें' },
  'arch.aggregating': { en: 'Aggregating Round...', mr: 'राउंड एकत्रित करत आहे...', hi: 'राउंड एकत्रित हो रहा है...' },
  'arch.demoSimulation': { en: 'Demo / Simulation', mr: 'डेमो / सिम्युलेशन', hi: 'डेमो / सिमुलेशन' },

  // ---------- Alerts ----------
  'alert.communityWarning': { en: 'Community Early Warning', mr: 'समुदाय पूर्व चेतावणी', hi: 'सामुदायिक प्रारंभिक चेतावनी' },
  'alert.cases': { en: 'Cases', mr: 'प्रकरणे', hi: 'मामले' },
  'alert.area': { en: 'Area', mr: 'क्षेत्र', hi: 'क्षेत्र' },
  'alert.period': { en: 'Period', mr: 'कालावधी', hi: 'अवधि' },
  'alert.rules': { en: 'Alert Generation Rules', mr: 'सूचना निर्मिती नियम', hi: 'अलर्ट निर्माण नियम' },
  'alert.detection': { en: 'Detection', mr: 'शोध', hi: 'पहचान' },
  'alert.timeWindow': { en: 'Time Window', mr: 'कालावधी', hi: 'समय सीमा' },
  'alert.riskThreshold': { en: 'Risk Threshold', mr: 'जोखीम उंबरठा', hi: 'जोखिम सीमा' },
  'alert.notification': { en: 'Notification', mr: 'सूचना', hi: 'अधिसूचना' },
  'alert.activeAlerts': { en: 'active community alerts', mr: 'सक्रिय समुदाय सूचना', hi: 'सक्रिय सामुदायिक अलर्ट' },

  // ---------- Progress ----------
  'progress.title': { en: 'Disease Progress Monitoring', mr: 'रोग प्रगती निरीक्षण', hi: 'रोग प्रगति निगरानी' },
  'progress.currentRisk': { en: 'Current Risk', mr: 'सध्याचा धोका', hi: 'वर्तमान जोखिम' },
  'progress.previousRisk': { en: 'Previous Risk', mr: 'मागील धोका', hi: 'पिछला जोखिम' },
  'progress.trend': { en: 'Trend', mr: 'प्रवृत्ती', hi: 'रुझान' },
  'progress.increasing': { en: 'Increasing', mr: 'वाढत आहे', hi: 'बढ़ रहा है' },
  'progress.stable': { en: 'Stable', mr: 'स्थिर', hi: 'स्थिर' },
  'progress.improving': { en: 'Improving', mr: 'सुधारत आहे', hi: 'सुधार हो रहा है' },
  'progress.monitor': { en: 'Disease Progression Monitor', mr: 'रोग प्रगती निरीक्षक', hi: 'रोग प्रगति निगरानीकर्ता' },
  'progress.selectPlot': { en: 'Select Crop Field / Plot:', mr: 'पीक क्षेत्र / प्लॉट निवडा:', hi: 'फसल क्षेत्र / प्लॉट चुनें:' },
  'progress.timeline': { en: '10-Day Leaf Scan Timeline', mr: '10-दिवसीय पान स्कॅन टाइमलाइन', hi: '10-दिवसीय पत्ती स्कैन टाइमलाइन' },
  'progress.trajectoryStatus': { en: 'Disease Trajectory Status', mr: 'रोग मार्ग स्थिती', hi: 'रोग प्रक्षेपवक्र स्थिति' },
  'progress.actionRecommendation': { en: 'Action Recommendation', mr: 'कृती शिफारस', hi: 'कार्रवाई सिफ़ारिश' },
  'progress.riskEvolution': { en: 'Risk Score Evolution Curve', mr: 'जोखीम गुण उत्क्रांती वक्र', hi: 'जोखिम स्कोर विकास वक्र' },

  // ---------- Map ----------
  'map.title': { en: 'Hyperlocal Disease Hotspot Map', mr: 'स्थानिक रोग हॉटस्पॉट नकाशा', hi: 'स्थानीय रोग हॉटस्पॉट मानचित्र' },
  'map.hotspot': { en: 'Hotspot', mr: 'हॉटस्पॉट', hi: 'हॉटस्पॉट' },
  'map.hotspotSummary': { en: 'Hotspot Summary', mr: 'हॉटस्पॉट सारांश', hi: 'हॉटस्पॉट सारांश' },
  'map.detected': { en: 'hotspots detected across Maharashtra', mr: 'महाराष्ट्रात हॉटस्पॉट आढळले', hi: 'महाराष्ट्र में हॉटस्पॉट पाए गए' },
  'map.allDiseases': { en: 'All Diseases', mr: 'सर्व रोग', hi: 'सभी रोग' },
  'map.allCrops': { en: 'All Crops', mr: 'सर्व पिके', hi: 'सभी फसलें' },
  'map.allDistricts': { en: 'All Districts', mr: 'सर्व जिल्हे', hi: 'सभी जिले' },

  // ---------- History ----------
  'history.pageTitle': { en: 'Crop Inspection History', mr: 'पीक तपासणी इतिहास', hi: 'फसल जांच इतिहास' },
  'history.pageSubtitle': { en: 'Comprehensive health logs and AI diagnoses across all farm crops', mr: 'तुमच्या शेतातील सर्व पिकांचे आरोग्य नोंदी आणि AI निदान इतिहास', hi: 'आपके खेत की सभी फसलों के स्वास्थ्य रिकॉर्ड और AI निदान इतिहास' },
  'history.allCropsTag': { en: 'Overall Farm Crops', mr: 'शेतातील सर्व पिके', hi: 'खेत की सभी फसलें' },
  'history.registeredCrops': { en: 'Registered Crops: Tomato, Potato, Maize, Cotton, Soybean', mr: 'नोंदणीकृत पिके: टोमॅटो, बटाटा, मका, कापूस, सोयाबीन', hi: 'पंजीकृत फसलें: टमाटर, आलू, मक्का, कपास, सोयाबीन' },
  'history.allCrops': { en: 'All Crops', mr: 'सर्व पिके', hi: 'सभी फसलें' },
  'history.allDiseases': { en: 'All Diseases', mr: 'सर्व रोग', hi: 'सभी रोग' },
  'history.allRisk': { en: 'All Risk', mr: 'सर्व जोखीम', hi: 'सभी जोखिम' },
  'history.weather': { en: 'Weather', mr: 'हवामान', hi: 'मौसम' },
  'history.location': { en: 'Location', mr: 'स्थान', hi: 'स्थान' },
  'history.aiExplanation': { en: 'AI Explanation', mr: 'AI स्पष्टीकरण', hi: 'AI व्याख्या' },
  'history.recommendations': { en: 'Recommendations', mr: 'शिफारसी', hi: 'सिफ़ारिशें' },

  // ---------- Chatbot ----------
  'chatbot.title': { en: 'AgriNexAi Multi-Agent Assistant', mr: 'AgriNexAi बहु-एजंट LLM सहाय्यक', hi: 'AgriNexAi बहु-एजेंट LLM सहायक' },
  'chatbot.subtitle': { en: 'Interactive AI farmer advisory driven by 6 collaborative agents', mr: '६ सहयोगी एजंट्सद्वारे चालविलेला संवादात्मक AI शेतकरी सल्लागार', hi: '6 सहयोगी एजेंटों द्वारा संचालित संवादात्मक AI किसान सलाहकार' },
  'chatbot.inputPlaceholder': { en: 'Ask anything in English, मराठी, or हिन्दी (e.g. Early blight symptoms, spray dosage, weather risk)...', mr: 'मराठी, हिंदी किंवा इंग्रजीत काहीही विचारा (उदा. करपा लक्षणे, फवारणीचे प्रमाण, हवामान जोखीम)...', hi: 'हिन्दी, मराठी या अंग्रेजी में कुछ भी पूछें (उदा. अगेती झुलसा, छिड़काव खुराक, मौसम जोखिम)...' },
  'chatbot.send': { en: 'Send', mr: 'पाठवा', hi: 'भेजें' },
  'chatbot.quickPrompts': { en: 'Suggested Inquiries', mr: 'सुचवलेले प्रश्न', hi: 'सुझाए गए प्रश्न' },
  'chatbot.agentReasoning': { en: 'Multi-Agent Collective Intelligence', mr: 'बहु-एजंट सामूहिक बुद्धिमत्ता', hi: 'बहु-एजेंट सामूहिक बुद्धिमत्ता' },
  'chatbot.speak': { en: 'Read Aloud', mr: 'ऐका', hi: 'सुनें' },
  'chatbot.stopSpeak': { en: 'Stop Audio', mr: 'ऑडिओ थांबवा', hi: 'ऑडियो रोकें' },
  'chatbot.clearChat': { en: 'Clear Chat', mr: 'चॅट साफ करा', hi: 'चैट साफ़ करें' },

  // ---------- Landing ----------
  'landing.getStarted': { en: 'Get Started', mr: 'सुरू करा', hi: 'शुरू करें' },
  'landing.viewDemo': { en: 'View Demo', mr: 'डेमो पहा', hi: 'डेमो देखें' },
  'landing.features': { en: 'Features', mr: 'वैशिष्ट्ये', hi: 'विशेषताएँ' },

  // ---------- Auth ----------
  'auth.login': { en: 'Login', mr: 'लॉगिन', hi: 'लॉगिन' },
  'auth.logout': { en: 'Logout', mr: 'लॉगआउट', hi: 'लॉगआउट' },
  'auth.email': { en: 'Email', mr: 'ईमेल', hi: 'ईमेल' },
  'auth.password': { en: 'Password', mr: 'पासवर्ड', hi: 'पासवर्ड' },
  'auth.invalidCredentials': { en: 'Invalid email or password', mr: 'अवैध ईमेल किंवा पासवर्ड', hi: 'अमान्य ईमेल या पासवर्ड' },
  'auth.quickLogin': { en: 'Quick Demo Login', mr: 'जलद डेमो लॉगिन', hi: 'त्वरित डेमो लॉगिन' },
  'auth.loginAsFarmer': { en: 'Login as Farmer', mr: 'शेतकरी म्हणून लॉगिन', hi: 'किसान के रूप में लॉगिन' },
  'auth.loginAsOfficer': { en: 'Login as Agriculture Officer', mr: 'कृषी अधिकारी म्हणून लॉगिन', hi: 'कृषि अधिकारी के रूप में लॉगिन' },
  'auth.demoCredentials': { en: 'Demo Accounts Available', mr: 'डेमो खाती उपलब्ध', hi: 'डेमो खाते उपलब्ध' },
  'auth.continueSession': { en: 'Continue to Dashboard', mr: 'डॅशबोर्डवर सुरू ठेवा', hi: 'डैशबोर्ड पर जारी रखें' },
  'auth.currentlySignedIn': { en: 'Currently signed in as', mr: 'सध्या लॉगिन केलेले:', hi: 'वर्तमान में लॉगिन:' },

  // ---------- Demo Controls ----------
  'demo.controls': { en: 'Demo Controls', mr: 'डेमो नियंत्रणे', hi: 'डेमो नियंत्रण' },
  'demo.resetData': { en: 'Reset Demo Data', mr: 'डेमो डेटा रीसेट करा', hi: 'डेमो डेटा रीसेट करें' },
  'demo.earlyBlight': { en: 'Early Blight: 94%, High Risk', mr: 'लवकर करपा: ९४%, उच्च जोखीम', hi: 'अगेती अंगमारी: 94%, उच्च जोखिम' },
  'demo.lowConfidence': { en: 'Low Confidence: 62%, Expert Validation', mr: 'कमी आत्मविश्वास: ६२%, तज्ञ प्रमाणीकरण', hi: 'कम विश्वास: 62%, विशेषज्ञ सत्यापन' },
  'demo.healthy': { en: 'Healthy Crop: 97%, Low Risk', mr: 'निरोगी पीक: ९७%, कमी जोखीम', hi: 'स्वस्थ फसल: 97%, कम जोखिम' },
  'demo.hotspot': { en: 'Community Hotspot: 7 cases', mr: 'समुदाय हॉटस्पॉट: ७ प्रकरणे', hi: 'सामुदायिक हॉटस्पॉट: 7 मामले' },
  'demo.progress': { en: 'Disease Progress: Day 1–10', mr: 'रोग प्रगती: दिवस १–१०', hi: 'रोग प्रगति: दिन 1–10' },
  'demo.architecture': { en: 'Multi-Agent & FL Architecture', mr: 'बहु-एजंट आणि FL आर्किटेक्चर', hi: 'बहु-एजेंट और FL आर्किटेक्चर' },
  'demo.yellowTrap': { en: '🟡 Yellow Sticky Trap: 18 Whitefly, 4 Aphids', mr: '🟡 पिवळा चिकट सापळा: १८ पांढरी माशी, ४ मावा', hi: '🟡 पीला चिपचिपा ट्रैप: 18 सफेद मक्खी, 4 माहू' },
  'demo.caterpillarLeaf': { en: '🐛 Caterpillar on Diseased Leaf: 2 Visible', mr: '🐛 रोगट पानावर सुरवंट/अळी: २ दिसणारे', hi: '🐛 रोगग्रस्त पत्ती पर इल्ली: 2 दृश्यमान' },
  'demo.healthyCaterpillar': { en: '🐛 Healthy Leaf with Caterpillar: 1 Visible', mr: '🐛 निरोगी पानावर सुरवंट: १ दिसणारा', hi: '🐛 स्वस्थ पत्ती पर इल्ली: 1 दृश्यमान' },
  'demo.leafDamageNoPest': { en: '🍃 Leaf Damage: No Visible Pest', mr: '🍃 पानांचे नुकसान: कोणतीही कीड नाही', hi: '🍃 पत्ती क्षति: कोई कीट नहीं' },

  // ---------- Pest & Trap Intelligence ----------
  'pest.cardTitle': { en: 'Pest & Trap Intelligence', mr: 'कीड व सापळा बुद्धिमत्ता', hi: 'कीट एवं ट्रैप बुद्धिमत्ता' },
  'pest.activityCardTitle': { en: 'Pest Activity', mr: 'कीड प्रादुर्भाव स्थिती', hi: 'कीट गतिविधि स्थिति' },
  'pest.statusMonitoring': { en: 'Monitoring Required', mr: 'निरीक्षण आवश्यक', hi: 'निगरानी आवश्यक' },
  'pest.noPestData': { en: 'No pest analysis available yet.', mr: 'अद्याप कोणतेही कीड विश्लेषण उपलब्ध नाही.', hi: 'अभी तक कोई कीट विश्लेषण उपलब्ध नहीं है।' },
  'pest.trapType': { en: 'Trap Type', mr: 'सापळ्याचा प्रकार', hi: 'ट्रैप का प्रकार' },
  'pest.insectsDetected': { en: 'Insects Detected', mr: 'आढळलेले कीटक', hi: 'पाए गए कीट' },
  'pest.activityLevel': { en: 'Activity Level', mr: 'प्रादुर्भाव पातळी', hi: 'गतिविधि स्तर' },
  'pest.viewDetails': { en: 'View Pest Details', mr: 'कीड तपशील पहा', hi: 'कीट विवरण देखें' },
};

export function t(key: string, lang: string = 'en'): string {
  const entry = translations[key];
  if (!entry) return key;
  return entry[lang] || entry['en'] || key;
}

export default translations;
