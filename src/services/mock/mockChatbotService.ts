// ============================================================
// AgriFedX — Multi-Agent LLM Agricultural Chatbot Engine
// ============================================================

import type { Language } from '../../types';
import storageService from '../storageService';

export interface AgentContribution {
  agentName: 'Sensing Agent' | 'Disease Agent' | 'Weather Agent' | 'Risk Agent' | 'Recommendation Agent' | 'Coordinator Agent';
  action: string;
  detail: string;
  color: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  agentContributions?: AgentContribution[];
  suggestedFollowups?: string[];
  audioText?: string;
}

export async function askMultiAgentChatbot(
  query: string,
  language: Language = 'en',
  context?: { crop?: string; district?: string }
): Promise<{ reply: string; agentContributions: AgentContribution[]; followups: string[] }> {
  // Simulate intelligent agent reasoning delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const lower = query.toLowerCase();
  const crop = context?.crop || 'Tomato';
  const district = context?.district || 'Nashik';

  // Read current system state
  const diagnoses = storageService.getDiagnoses();
  const alerts = storageService.getAlerts().filter((a) => a.active);
  const hotspots = storageService.getHotspots();

  // Agent collaboration steps
  const agentContributions: AgentContribution[] = [
    {
      agentName: 'Coordinator Agent',
      action: 'Query Dispatched',
      detail: `Received farmer request: "${query.substring(0, 45)}...". Orchestrated domain sub-agents.`,
      color: '#06b6d4',
    },
    {
      agentName: 'Sensing Agent',
      action: 'Spatial & Crop Telemetry',
      detail: `Resolved farm context: Crop = ${crop}, Region = ${district}, Stage = Flowering.`,
      color: '#3b82f6',
    },
    {
      agentName: 'Disease Agent',
      action: 'Pathology Diagnostics',
      detail: `Cross-referenced fungal pathogens (Early Blight / Alternaria solani & Late Blight).`,
      color: '#10b981',
    },
    {
      agentName: 'Weather Agent',
      action: 'Microclimate Ingestion',
      detail: `Humidity = 82%, Temp = 27°C, Rainfall = 12mm. Fungal spore germination index is ELEVATED.`,
      color: '#f59e0b',
    },
    {
      agentName: 'Risk Agent',
      action: 'Multi-Factor Scoring',
      detail: `Calculated combined crop vulnerability score: 84/100 (HIGH RISK band).`,
      color: '#ef4444',
    },
    {
      agentName: 'Recommendation Agent',
      action: 'Advisory Formulation',
      detail: `Synthesized Integrated Pest Management (IPM) guidelines, organic bio-fungicides and preventive spray dosages.`,
      color: '#8b5cf6',
    },
  ];

  let reply = '';
  let followups: string[] = [];

  // Match Intents
  if (lower.includes('early blight') || lower.includes('karpa') || lower.includes('करपा') || lower.includes('अगेती') || lower.includes('blight')) {
    if (language === 'mr') {
      reply = `🍅 **टोमॅटो अर्ली ब्लाइट (लवकर करपा) व्यवस्थापन सल्ला:**

१. **लक्षणे:**
   - पानाच्या खालील भागावर तपकिरी-काळे गोलाकार चक्राकार वलयाचे (concentric rings) ठिपके पडतात.
   - प्रादुर्भाव वाढल्यास पाने पिवळी पडून गळतात.

२. **जैविक / सेंद्रिय उपाय (तात्काळ):**
   - ट्रायकोडर्मा व्हिरिडी (Trichoderma viride) ५ ग्रॅम प्रति लिटर पाण्यात मिसळून फवारा.
   - कडुलिंबाचे अर्क (Neem Oil ५% किंवा ५ मिली प्रति लिटर) चा प्रतिबंधात्मक वापर करा.

३. **रासायनिक उपाय (तज्ञांच्या सल्ल्यानुसार):**
   - **मँकोझेब (Mancozeb ७५% WP):** २.५ ग्रॅम प्रति लिटर पाणी, किंवा
   - **कॉपर ऑक्सिक्लोराईड (COC ५०% WP):** ३ ग्रॅम प्रति लिटर पाणी.
   - प्रादुर्भाव जास्त असल्यास: **अझॉक्सिस्ट्रॉबिन + डायफेनोकोनॅझोल:** १ मिली प्रति लिटर.

४. **हवामान सावधगिरी:**
   - सध्या हवेत आर्द्रता ८२% असल्याने सायंकाळी पाणी देणे टाळा. ठिबक सिंचनाचा वापर करा.`;
      followups = [
        'फवारणी करताना कोणती काळजी घ्यावी?',
        'माझ्या शेतात रासायनिक खते वापरणे योग्य आहे का?',
        'नाशिक भागात इतर शेतांमध्ये करपा पसरला आहे का?'
      ];
    } else if (language === 'hi') {
      reply = `🍅 **टमाटर में अगेती झुलसा (Early Blight) नियंत्रण परामर्श:**

१. **रोग के लक्षण:**
   - निचली पत्तियों पर गहरे भूरे रंग के छल्लेदार (कंसेंट्रिक रिंग) धब्बे बनते हैं।
   - रोग बढ़ने पर पत्तियां पीली पड़कर सूखने लगती हैं।

२. **जैविक और प्राकृतिक उपाय:**
   - **ट्राइकोडर्मा विरिडी (Trichoderma viride):** ५ ग्राम प्रति लीटर पानी में मिलाकर छिड़काव करें।
   - **नीम का तेल (Neem Oil):** ५ मिली प्रति लीटर पानी का छिड़काव करें।

३. **रासायनिक उपचार (गंभीर स्थिति में):**
   - **मैंकोजेब (Mancozeb 75% WP):** २.५ ग्राम प्रति लीटर पानी, या
   - **कॉपर ऑक्सीक्लोराइड (COC 50% WP):** ३ ग्राम प्रति लीटर पानी।
   - अधिक प्रकोप होने पर: **एज़ोक्सीस्ट्रोबिन + डिफेनोकोनाज़ोल:** १ मिली प्रति लीटर।

४. **मौसम और सिंचाई सावधानी:**
   - हवा में ८२% नमी होने के कारण पत्तियों पर पानी का छिड़काव न करें; ड्रिप सिंचाई का उपयोग करें।`;
      followups = [
        'छिड़काव के समय क्या सावधानियां रखनी चाहिए?',
        'क्या बारिश के मौसम में छिड़काव करना चाहिए?',
        'निकटवर्ती क्षेत्रों में क्या कोई अलर्ट जारी है?'
      ];
    } else {
      reply = `🍅 **Tomato Early Blight (Alternaria solani) Multi-Agent Advisory:**

1. **Diagnostic Symptoms:**
   - Dark brown to black circular lesions with characteristic concentric "target-board" rings on older leaves.
   - Premature leaf drop exposing tomato fruits to sunscald.

2. **Immediate Biological / Organic Control:**
   - Apply *Trichoderma viride* or *Pseudomonas fluorescens* @ 5g/L water.
   - Spray Cold-pressed Neem Seed Kernel Extract (5ml/L) as a protective bio-barrier.

3. **Recommended Chemical Treatment:**
   - **Preventive:** Mancozeb 75% WP @ 2.5g per Litre of water.
   - **Curative:** Copper Oxychloride 50% WP @ 3.0g/L or Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1 ml/L.

4. **Weather & Irrigation Advisory (From Weather Agent):**
   - High humidity (82%) accelerates spore release. Avoid overhead sprinkler irrigation. Ensure proper field drainage.`;
      followups = [
        'What is the optimal spray interval?',
        'Can I mix micronutrients with fungicide?',
        'Are there active Early Blight hotspots near Nashik?'
      ];
    }
  } else if (lower.includes('weather') || lower.includes('havaman') || lower.includes('हवामान') || lower.includes('मौसम') || lower.includes('rain') || lower.includes('paus')) {
    if (language === 'mr') {
      reply = `⛅ **हवामान आधारित पीक जोखीम विश्लेषण (${district} विभाग):**

- **वर्तमान तापमान:** २७°C (अनुकूल)
- **सापेक्ष आर्द्रता:** ८२% (अतिशय जास्त — बुरशीजन्य रोगांसाठी संवेदनशील)
- **पाऊस अंदाज:** पुढील २४ तासांत मध्यम पाऊस होण्याची शक्यता (१२ मिमी)
- **वारा गती:** ८ किमी/तास

⚠️ **जोखीम एजंट निष्कर्ष (Risk Score: ८४/१००):**
उच्च आर्द्रता आणि पानांवर जास्त वेळ पाणी साचल्यामुळे करपा व पानांवरील ठिपके पसरण्याचा वेग वाढू शकतो.

💡 **कृषी शिफारसी:**
- पाऊस थांबल्यानंतरच फवारणी करा आणि फवारणीच्या औषधात स्टिकर (Spreader/Sticker) वापरा.
- शेतात साचलेले पाणी तातडीने बाहेर काढून द्या.`;
      followups = [
        'पावसात फवारणी केली तर औषध धुतले जाईल का?',
        'उद्याचा हवामान अंदाज कसा आहे?',
        'टोमॅटो पिकावर करपा पडला आहे, काय करू?'
      ];
    } else if (language === 'hi') {
      reply = `⛅ **मौसम आधारित फसल जोखिम विश्लेषण (${district} क्षेत्र):**

- **वर्तमान तापमान:** 27°C (फंगल विकास के अनुकूल)
- **हवा में नमी (Humidity):** 82% (उच्च जोखिम स्तर)
- **बारिश का अनुमान:** अगले 24 घंटों में हल्की से मध्यम बारिश (12 मिमी)
- **हवा की गति:** 8 किमी/घंटा

⚠️ **जोखिम स्कोर (84/100 - उच्च जोखिम):**
उच्च आर्द्रता और लगातार गीलेपन से फफूंद जनित रोगों (झुलसा, पत्ती धब्बा) के संक्रमण की संभावना बहुत अधिक है।

💡 **सलाह:**
- बारिश रुकने के बाद ही छिड़काव करें और सिलिकॉन आधारित स्टीकर अवश्य मिलाएं।
- खेत में जल निकासी की समुचित व्यवस्था रखें।`;
      followups = [
        'क्या बारिश के तुरंत बाद फफूंदनाशी डालना सुरक्षित है?',
        'उच्च आर्द्रता में कौन से रोग सबसे तेजी से फैलते हैं?',
        'टमाटर में अगेती झुलसा का उपचार कैसे करें?'
      ];
    } else {
      reply = `⛅ **Hyperlocal Weather-Driven Crop Risk Assessment (${district}):**

- **Ambient Temperature:** 27°C (Favorable for fungal germination)
- **Relative Humidity:** 82% (Critical threshold > 75% breached)
- **Rainfall Forecast:** Intermittent showers expected (12mm)
- **Wind Speed:** 8 km/h

⚠️ **Risk Agent Assessment (Score: 84 / 100 - HIGH RISK):**
Prolonged leaf wetness duration (> 6 hours) significantly accelerates fungal spore penetration into plant stomata.

💡 **Actionable Field Guidance:**
- Postpone chemical sprays until foliage is dry, and always incorporate a non-ionic adjuvant/sticker.
- Improve inter-row aeration by pruning bottom-most infected foliage touching the wet soil.`;
      followups = [
        'How does relative humidity affect fungicide efficacy?',
        'What should I spray after heavy rainfall?',
        'Show active community alerts near me'
      ];
    }
  } else if (lower.includes('hotspot') || lower.includes('alert') || lower.includes('community') || lower.includes('हॉटस्पॉट') || lower.includes('सूचना') || lower.includes('अलर्ट')) {
    const activeCount = alerts.length;
    if (language === 'mr') {
      reply = `🚨 **समुदाय पूर्वसूचना व हॉटस्पॉट अहवाल (${district} आणि परिसर):**

- **सक्रिय समुदाय सूचना:** ${activeCount} सक्रिय अलर्ट
- **हॉटस्पॉट स्थिती:** नाशिक परिसरात टोमॅटो अर्ली ब्लाइटची **७ प्रकरणे** नोंदवली गेली आहेत (सरासरी जोखीम: ८२/१००).
- **दुसरा हॉटस्पॉट:** पुणे जिल्ह्यात बटाटा लेट ब्लाइटची **५ प्रकरणे** आढळली आहेत.

🛡️ **समन्वयक एजंट शिफारस:**
तुमचे शेत हॉटस्पॉटच्या १५ किमी परिघात असल्यास शेताची दर ३ दिवसांनी तपासणी करा आणि संशयित पानांचे छायाचित्र ॲपवर स्कॅन करा.`;
      followups = [
        'माझ्या शेतात शेजाऱ्यांकडून रोग पसरू नये म्हणून काय करावे?',
        'नकाशावर हॉटस्पॉट कसा पाहावा?',
        'नवीन रोग स्कॅन कसा सुरू करावा?'
      ];
    } else if (language === 'hi') {
      reply = `🚨 **सामुदायिक प्रारंभिक चेतावनी और हॉटस्पॉट रिपोर्ट (${district}):**

- **सक्रिय अलर्ट:** ${activeCount} सामुदायिक चेतावनी सक्रिय
- **हॉटस्पॉट विवरण:** नासिक क्षेत्र में टमाटर अगेती झुलसा के **7 मामले** दर्ज किए गए हैं (औसत जोखिम: 82/100)।
- **पुणे क्लस्टर:** आलू लेट ब्लाइट के **5 मामले** दर्ज किए गए हैं।

🛡️ **समन्वयक एजेंट की सलाह:**
यदि आपका खेत हॉटस्पॉट से 15 किमी के दायरे में है, तो नियमित रूप से अपनी फसल की पत्तियों की जांच करें और तुरंत सुरक्षात्मक स्प्रे करें।`;
      followups = [
        'रोग को आसपास के खेतों में फैलने से कैसे रोकें?',
        'नक्शे पर सक्रिय हॉटस्पॉट कैसे देखें?',
        'टमाटर की पत्ती कैसे स्कैन करें?'
      ];
    } else {
      reply = `🚨 **Community Early Warning & Hyperlocal Hotspot Report (${district}):**

- **Active Alerts:** ${activeCount} community warnings currently broadcasted.
- **Identified Cluster:** Nashik region has an active **HIGH-RISK Hotspot with 7 confirmed Early Blight cases** (Average Risk: 82/100).
- **Secondary Cluster:** Pune district has 5 active cases of Late Blight on Potato.

🛡️ **Coordinator Agent Alert:**
Nearby farms within a 15km radius are urged to monitor foliage daily and log scans in AgriNexAi to trigger collective defense.`;
      followups = [
        'How can I view these hotspots on the interactive map?',
        'What preventive measures should neighboring farms take?',
        'How does federated learning protect farmer privacy?'
      ];
    }
  } else if (lower.includes('agent') || lower.includes('multiagent') || lower.includes('system') || lower.includes('कसे काम') || lower.includes('एजंट')) {
    if (language === 'mr') {
      reply = `🤖 **AgriNexAi मल्टी-एजंट AI प्रणाली कशी कार्य करते:**

आमची प्रणाली ६ विशेष एजंट्सच्या सहकार्याने काम करते:
1. 📱 **सेन्सिंग एजंट:** फोटोची गुणवत्ता आणि GPS स्थान तपासतो.
2. 🔬 **डिसीज एजंट:** AI मॉडेलद्वारे पानांवरील रोगाची अचूक ओळख करतो.
3. ☁️ **वेदर एजंट:** स्थानिक तापमान, आर्द्रता व पावसाची आकडेवारी मिळवतो.
4. ⚡ **रिस्क एजंट:** रोग, हवामान आणि पिकाचा टप्पा जोडून ०–१०० जोखीम गुण ठरवतो.
5. 🛡️ **रेकमेंडेशन एजंट:** सेंद्रिय आणि रासायनिक फवारणीचे अचूक डोस तयार करतो.
6. 🌐 **कोऑर्डिनेटर एजंट:** सर्व एजंट्समध्ये समन्वय साधून शेतकऱ्यांपर्यंत माहिती पोहोचवतो.

🔒 **फेडरेटेड लर्निंग:** आपला वैयक्तिक डेटा आणि शेताची माहिती खाजगी ठेवून मॉडेल सुधारले जाते!`;
      followups = [
        'तज्ञ प्रमाणीकरण (Expert Validation) कसे होते?',
        'माझा डेटा सुरक्षित राहतो का?',
        'टोमॅटो अर्ली ब्लाइटचा उपाय काय?'
      ];
    } else if (language === 'hi') {
      reply = `🤖 **AgriNexAi मल्टी-एजेंट एआई प्रणाली की कार्यप्रणाली:**

यह प्रणाली 6 स्वायत्त एजेंटों के सामूहिक तालमेल पर कार्य करती है:
1. 📱 **सेंसिंग एजेंट:** पत्ती की फोटो गुणवत्ता, फसल और जीपीएस स्थिति जांचता है।
2. 🔬 **डिसीज एजेंट:** डीप लर्निंग सीएनएन मॉडल से सटीक रोग पहचान करता है।
3. ☁️ **वेदर एजेंट:** तापमान, नमी और बारिश के माइक्रॉक्लाइमेट डेटा का विश्लेषण करता है।
4. ⚡ **रिस्क एजेंट:** सभी कारकों को मिलाकर 0–100 का समग्र जोखिम स्कोर देता है।
5. 🛡️ **रिकमेंडेशन एजेंट:** जैविक और सटीक रासायनिक उपचार व खुराक तय करता है।
6. 🌐 **कोऑर्डिनेटर एजेंट:** अलर्ट जारी करता है और किसान व कृषि अधिकारी को जोड़ता है।

🔒 **फेडरेटेड लर्निंग:** आपका डेटा आपके फोन पर ही सुरक्षित रहता है, केवल मॉडल अपडेट्स शेयर होते हैं!`;
      followups = [
        'कम विश्वास वाले परिणामों का सत्यापन कैसे होता है?',
        'क्या मैं बिना इंटरनेट के इसका उपयोग कर सकता हूँ?',
        'मौसम से फसल को नुकसान कैसे बचाएं?'
      ];
    } else {
      reply = `🤖 **How AgriNexAi Multi-Agent Collaborative Architecture Works:**

AgriNexAi coordinates 6 specialized autonomous agents:
1. 📱 **Sensing Agent:** Validates leaf image clarity, focal lighting, and GPS bounds.
2. 🔬 **Disease Agent:** Executes dual CNN edge-inference with visual attention maps.
3. ☁️ **Weather Agent:** Pulls real-time micro-climate metrics (temp, humidity, rain).
4. ⚡ **Risk Agent:** Computes a weighted 0–100 vulnerability score (Disease 40% + Weather 30% + Stage 15% + Severity 15%).
5. 🛡️ **Recommendation Agent:** Formulates context-aware IPM organic and chemical regimens.
6. 🌐 **Coordinator Agent:** Manages community alerts, federated learning rounds, and officer validation loop.`;
      followups = [
        'How do the 6 AI agents help my farm?',
        'How does low confidence trigger human validation?',
        'What is the current risk score for my farm?'
      ];
    }
  } else {
    // Default smart response tailored to language
    if (language === 'mr') {
      reply = `🌾 **AgriNexAi बहु-एजंट कृषी सहाय्यक:**

आपल्या प्रश्नाचे विश्लेषण करून कृषी एजंट्सनी खालील मार्गदर्शन तयार केले आहे:
- **पीक आरोग्य:** सध्या नाशिक व पुणे भागात टोमॅटो आणि बटाटा पिकांवर करपा (Blight) रोगाची जोखीम मध्यम ते उच्च आहे.
- **हवामान सतर्कता:** उच्च हवेतील दमटपणामुळे (८२%) शेतात हवा खेळती राहू द्या आणि साचलेले पाणी काढून टाका.
- **फवारणी सल्ला:** प्रतिबंधात्मक उपायासाठी ट्रायकोडर्मा किंवा कॉपर फफूंदनाशकाचा वापर करा.

आपण विशिष्ट रोगाबद्दल विचारू शकता, जसे की *"टोमॅटो करपा"*, *"हवामान जोखीम"*, किंवा *"हॉटस्पॉट अलर्ट"*.`;
      followups = [
        'टोमॅटोवरील अर्ली ब्लाइटचा उपचार काय आहे?',
        'आजचे हवामान पिकांसाठी कसे आहे?',
        'माझ्या शेताजवळ कोणते रोग पसरले आहेत?'
      ];
    } else if (language === 'hi') {
      reply = `🌾 **AgriNexAi बहु-एजेंट किसान सलाहकार:**

आपके सवाल का विश्लेषण कर सभी 6 एजेंटों ने निम्नलिखित परामर्श तैयार किया है:
- **फसल स्वास्थ्य:** वर्तमान में टमाटर और आलू की फसलों में झुलसा (Blight) रोग का जोखिम बना हुआ है।
- **मौसम सुरक्षा:** हवा में अधिक नमी (82%) के कारण फफूंद रोगों से बचाव के लिए खेतों में जलभराव न होने दें।
- **सुरक्षात्मक उपाय:** जैविक ट्राइकोडर्मा या कॉपर आधारित फफूंदनाशक का छिड़काव उपयोगी रहेगा।

आप किसी भी फसल रोग या समस्या के बारे में पूछ सकते हैं, जैसे: *"टमाटर झुलसा"*, *"मौसम का जोखिम"*, या *"हॉटस्पॉट अलर्ट"*.`;
      followups = [
        'टमाटर में अगेती झुलसा का सही इलाज क्या है?',
        'आज के मौसम में कौन सी सावधानी रखें?',
        'क्या आसपास के क्षेत्र में कोई बीमारी फैल रही है?'
      ];
    } else {
      reply = `🌾 **AgriNexAi Autonomous Multi-Agent Advisory:**

The collaborative agent collective has analyzed your inquiry against current farm telemetry:
- **Crop Health Status:** Fungal pathogens (Early Blight / Late Blight) remain in high vigilance status in Maharashtra districts due to high relative humidity (82%).
- **Microclimate Risk:** Moisture conditions favor spore germination on foliage surfaces.
- **Advisory:** Maintain strict field scouting, prune basal leaves touching soil, and apply preventive bio-fungicide (Trichoderma viride).

You can ask me specific questions regarding diseases, chemical dosages, weather risks, or community hotspot warnings!`;
      followups = [
        'How to treat Early Blight on Tomato?',
        'Current weather risk for crops today?',
        'Are there active community alerts nearby?'
      ];
    }
  }

  return {
    reply,
    agentContributions,
    followups,
  };
}
