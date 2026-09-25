// ============================================================
// AgriFedX — Multi-Agent Multilingual LLM Chatbot Page
// ============================================================

import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import {
  askMultiAgentChatbot,
  ChatMessage,
  AgentContribution,
} from '../services/mock/mockChatbotService';
import {
  Bot,
  Send,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Network,
  Cpu,
  Cloud,
  Zap,
  ShieldCheck,
  Smartphone,
  ChevronDown,
  ChevronUp,
  Globe,
  User,
  CheckCircle2,
} from 'lucide-react';

export default function ChatbotPage() {
  const { language, setLanguage, user } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [expandedReasoning, setExpandedReasoning] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message based on language
  useEffect(() => {
    let initialGreeting = '';
    let initialFollowups: string[] = [];

    if (language === 'mr') {
      initialGreeting = `नमस्कार **${user?.name || 'शेतकरी मित्र'}**! 🙏\n\nमी **AgriNexAi बहु-एजंट कृषी AI सहाय्यक** आहे. ६ स्वायत्त एजंट्सच्या मदतीने मी आपल्या शेतातील पीक रोग, फवारणीचे प्रमाण, हवामान जोखीम आणि शासकीय सल्ल्याबद्दल मराठीमध्ये अचूक माहिती देऊ शकतो.\n\nआपण खालीलपैकी कोणताही प्रश्न निवडू शकता किंवा आपला प्रश्न टाईप करू शकता.`;
      initialFollowups = [
        'टोमॅटोवरील अर्ली ब्लाइट (करपा) कसा थांबवावा?',
        'आजचे हवामान पिकांसाठी किती जोखमीचे आहे?',
        'माझ्या शेताजवळ काही रोग साथीचा इशारा आहे का?',
        'मल्टी-एजंट AI प्रणाली शेतकर्‍यांना कशी मदत करते?',
      ];
    } else if (language === 'hi') {
      initialGreeting = `नमस्ते **${user?.name || 'किसान साथी'}**! 🙏\n\nमैं **AgriNexAi बहु-एजेंट कृषि एआई सहायक** हूँ। हमारे ६ स्वायत्त एजेंट मिलकर आपकी फसल के रोगों, कीटनाशक की सही मात्रा, मौसम जोखिम और सामुदायिक अलर्ट्स के बारे में पूरी जानकारी प्रदान करते हैं।\n\nकृपया नीचे दिए गए सुझावों में से चुनें या अपना प्रश्न पूछें।`;
      initialFollowups = [
        'टमाटर में अगेती झुलसा का उपचार कैसे करें?',
        'मौसम से फसलों में रोग का खतरा कैसे बढ़ता है?',
        'क्या मेरे क्षेत्र में कोई बीमारी फैल रही है?',
        'मल्टी-एजेंट एआई सिस्टम कैसे काम करता है?',
      ];
    } else {
      initialGreeting = `Hello **${user?.name || 'Farmer'}**! 👋\n\nI am your **AgriNexAi Multi-Agent Agricultural AI Assistant**. Operating across 6 collaborative agents (Sensing, Disease, Weather, Risk, Recommendation, Coordinator), I provide instant verified advisories on crop health, spray dosages, weather risks, and community outbreaks.\n\nAsk me anything in English, मराठी, or हिन्दी below!`;
      initialFollowups = [
        'How to treat Early Blight on Tomato?',
        'What is the weather risk for crops today?',
        'Are there active community alerts nearby?',
        'How do the 6 AI agents collaborate?',
      ];
    }

    setMessages([
      {
        id: 'msg-welcome',
        sender: 'assistant',
        text: initialGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowups: initialFollowups,
      },
    ]);
  }, [language, user?.name]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Stop speech when unmounting
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputValue.trim();
    if (!query || loading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputValue('');
    setLoading(true);

    try {
      const response = await askMultiAgentChatbot(query, language, { crop: 'Tomato', district: 'Nashik' });
      const assistantMessage: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agentContributions: response.agentContributions,
        suggestedFollowups: response.followups,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      // Auto-expand reasoning for demonstration of multi-agent collaboration
      setExpandedReasoning((prev) => ({ ...prev, [assistantMessage.id]: true }));
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeech = (msg: ChatMessage) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === msg.id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean text of markdown asterisks and emojis for speech
    const cleanText = msg.text.replace(/[*_#`]/g, '').replace(/[🍅⛅🚨🌾🤖💡⚠️]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Pick language
    if (language === 'mr') utterance.lang = 'mr-IN';
    else if (language === 'hi') utterance.lang = 'hi-IN';
    else utterance.lang = 'en-IN';

    utterance.rate = 0.95;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(msg.id);
    window.speechSynthesis.speak(utterance);
  };

  const getAgentIcon = (name: AgentContribution['agentName']) => {
    switch (name) {
      case 'Coordinator Agent': return <Network size={14} />;
      case 'Sensing Agent': return <Smartphone size={14} />;
      case 'Disease Agent': return <Cpu size={14} />;
      case 'Weather Agent': return <Cloud size={14} />;
      case 'Risk Agent': return <Zap size={14} />;
      case 'Recommendation Agent': return <ShieldCheck size={14} />;
    }
  };

  const quickPrompts = language === 'mr'
    ? [
        '🍅 टोमॅटोवरील अर्ली ब्लाइट (करपा) कसा थांबवावा?',
        '⛅ नाशिक भागात आज हवामान जोखीम किती आहे?',
        '🚨 माझ्या जवळ रोग साथीचा काही इशारा आहे का?',
        '🤖 मल्टिएजंट AI कसे काम करते?',
      ]
    : language === 'hi'
    ? [
        '🍅 टमाटर में अगेती झुलसा का सही इलाज क्या है?',
        '⛅ आज के मौसम में कौन सी सावधानी रखें?',
        '🚨 क्या मेरे जिले में कोई बीमारी का अलर्ट है?',
        '🤖 मल्टी-एजेंट एआई सिस्टम कैसे काम करता है?',
      ]
    : [
        '🍅 How to treat Early Blight on Tomato?',
        '⛅ What is the weather risk for Nashik today?',
        '🚨 Are there active community alerts nearby?',
        '🤖 How do the 6 AI agents collaborate?',
      ];

  return (
    <div className="page chatbot-page">
      {/* Header */}
      <div className="page-header chatbot-header">
        <div>
          <h2>
            <Bot size={28} className="title-icon text-primary" /> {t('chatbot.title', language)}
          </h2>
          <p className="subtitle">{t('chatbot.subtitle', language)}</p>
        </div>

        <div className="chatbot-header-actions">
          {/* Quick Language Switch */}
          <div className="lang-pill-group">
            <button
              className={`lang-pill ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
            >
              English
            </button>
            <button
              className={`lang-pill ${language === 'mr' ? 'active' : ''}`}
              onClick={() => setLanguage('mr')}
            >
              मराठी
            </button>
            <button
              className={`lang-pill ${language === 'hi' ? 'active' : ''}`}
              onClick={() => setLanguage('hi')}
            >
              हिन्दी
            </button>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setMessages([])}
            title="Clear Chat"
          >
            <RotateCcw size={14} /> {t('chatbot.clearChat', language)}
          </button>
        </div>
      </div>

      {/* Multi-Agent Active Status Ribbon */}
      <div className="agent-status-ribbon">
        <span className="ribbon-title"><Sparkles size={14} /> 6 Active Agents:</span>
        <div className="agent-chip"><Smartphone size={12} /> Sensing</div>
        <div className="agent-chip"><Cpu size={12} /> Disease</div>
        <div className="agent-chip"><Cloud size={12} /> Weather</div>
        <div className="agent-chip"><Zap size={12} /> Risk</div>
        <div className="agent-chip"><ShieldCheck size={12} /> Recommendation</div>
        <div className="agent-chip coordinator"><Network size={12} /> Coordinator</div>
      </div>

      {/* Main Chat Container */}
      <div className="chat-container card">
        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-bubble-row ${msg.sender}`}>
              <div className="chat-avatar">
                {msg.sender === 'assistant' ? <Bot size={20} /> : <User size={20} />}
              </div>

              <div className="chat-bubble-content">
                <div className="chat-bubble-header">
                  <span className="chat-sender-name">
                    {msg.sender === 'assistant' ? 'AgriNexAi Agent Collective' : user?.name || 'Farmer'}
                  </span>
                  <span className="chat-time">{msg.timestamp}</span>

                  {msg.sender === 'assistant' && (
                    <button
                      className={`btn-icon-sm ${speakingId === msg.id ? 'active-audio' : ''}`}
                      onClick={() => handleSpeech(msg)}
                      title={speakingId === msg.id ? t('chatbot.stopSpeak', language) : t('chatbot.speak', language)}
                    >
                      {speakingId === msg.id ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    </button>
                  )}
                </div>

                {/* Multi-Agent Collective Reasoning Accordion */}
                {msg.agentContributions && msg.agentContributions.length > 0 && (
                  <div className="agent-reasoning-card">
                    <button
                      className="reasoning-toggle"
                      onClick={() =>
                        setExpandedReasoning((prev) => ({
                          ...prev,
                          [msg.id]: !prev[msg.id],
                        }))
                      }
                    >
                      <div className="reasoning-title">
                        <Network size={14} className="text-primary" />
                        <span>{t('chatbot.agentReasoning', language)} (6 Agents Collaborated)</span>
                      </div>
                      {expandedReasoning[msg.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {expandedReasoning[msg.id] && (
                      <div className="agent-contributions-list">
                        {msg.agentContributions.map((contrib, idx) => (
                          <div key={idx} className="contrib-item">
                            <div className="contrib-header" style={{ color: contrib.color }}>
                              {getAgentIcon(contrib.agentName)}
                              <strong>{contrib.agentName}</strong>
                              <span className="contrib-action">• {contrib.action}</span>
                            </div>
                            <p className="contrib-detail">{contrib.detail}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Message Body */}
                <div className="chat-text" style={{ whiteSpace: 'pre-wrap' }}>
                  {msg.text}
                </div>

                {/* Follow-up Question Chips */}
                {msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                  <div className="followup-chips">
                    <span className="followup-label">💡 Suggested Questions:</span>
                    <div className="chips-wrapper">
                      {msg.suggestedFollowups.map((q, idx) => (
                        <button
                          key={idx}
                          className="chip-btn"
                          onClick={() => handleSend(q)}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="chat-bubble-row assistant">
              <div className="chat-avatar"><Bot size={20} /></div>
              <div className="chat-bubble-content">
                <div className="agent-thinking-pill">
                  <Sparkles size={16} className="spin-icon" />
                  <span>Multi-Agent Collective is reasoning across Weather, Disease &amp; Risk models...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggested Queries Bar */}
        <div className="quick-prompts-bar">
          <span className="quick-label">{t('chatbot.quickPrompts', language)}:</span>
          <div className="quick-buttons">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                className="quick-btn"
                onClick={() => handleSend(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input Bar */}
        <form
          className="chat-input-bar"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            type="text"
            className="chat-input"
            placeholder={t('chatbot.inputPlaceholder', language)}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="btn btn-primary btn-send"
            disabled={!inputValue.trim() || loading}
          >
            <Send size={18} />
            <span>{t('chatbot.send', language)}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
