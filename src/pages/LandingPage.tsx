// ============================================================
// AgriFedX — Landing Page
// ============================================================

import { useNavigate } from 'react-router-dom';
import {
  FlaskConical, Scan, CloudSun, Brain, Map, Shield, Bell,
  Network, Languages, ArrowRight, ChevronDown, Leaf
} from 'lucide-react';

const FEATURES = [
  { icon: Scan, title: 'AI Disease Detection', desc: 'Upload leaf images for instant disease identification with explainable AI insights.' },
  { icon: CloudSun, title: 'Weather Risk Prediction', desc: 'Weather-based risk scoring engine combining disease data with local climate.' },
  { icon: Brain, title: 'Explainable AI', desc: 'Transparent AI predictions with visual attention mapping and confidence scores.' },
  { icon: Map, title: 'Disease Hotspot Map', desc: 'Hyperlocal disease monitoring with interactive maps and hotspot detection.' },
  { icon: Shield, title: 'Expert Validation', desc: 'Human-in-the-loop validation by agriculture officers for verified diagnoses.' },
  { icon: Bell, title: 'Community Early Warning', desc: 'Automated alerts when disease outbreaks are detected in your area.' },
  { icon: Network, title: 'Federated Learning', desc: 'Privacy-preserving model training — farmer data never leaves local devices.' },
  { icon: Languages, title: 'Marathi Support', desc: 'Full multilingual interface supporting English and Marathi.' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      {/* Hero */}
      <header className="landing-header">
        <nav className="landing-nav">
          <div className="landing-brand">
            <FlaskConical size={28} style={{ color: '#22c55e' }} />
            <span style={{ color: '#22c55e', fontWeight: 700, fontSize: '1.3rem' }}>AgriFedX</span>
          </div>
          <button className="btn btn-outline" onClick={() => navigate('/login')}>
            Login
          </button>
        </nav>

        <div className="hero">
          <div className="hero-badge">
            <Leaf size={14} />
            Smart India Hackathon 2024
          </div>
          <h1>
            AI-Powered Crop Disease Detection
            <br />
            <span className="hero-accent">& Smart Agricultural Decision Support</span>
          </h1>
          <p className="hero-desc">
            Combining explainable AI, weather intelligence, hyperlocal disease monitoring,
            expert validation and privacy-aware federated learning to protect Indian agriculture.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>
              Get Started <ArrowRight size={18} />
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate('/login')}>
              View Demo
            </button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <strong>6+</strong><span>AI Models</span>
            </div>
            <div className="hero-stat">
              <strong>6</strong><span>Agents</span>
            </div>
            <div className="hero-stat">
              <strong>12</strong><span>FL Participants</span>
            </div>
            <div className="hero-stat">
              <strong>6</strong><span>Districts</span>
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <ChevronDown size={24} />
        </div>
      </header>

      {/* Features */}
      <section className="landing-features">
        <h2>Platform Features</h2>
        <p className="section-desc">End-to-end agricultural intelligence pipeline</p>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">
                <f.icon size={24} />
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture Preview */}
      <section className="landing-arch">
        <h2>System Architecture</h2>
        <p className="section-desc">Multi-Agent + Federated Learning Architecture</p>
        <div className="arch-flow">
          <div className="arch-node">📱 Farmer</div>
          <div className="arch-arrow">→</div>
          <div className="arch-node">📸 Image Upload</div>
          <div className="arch-arrow">→</div>
          <div className="arch-node">🤖 AI Detection</div>
          <div className="arch-arrow">→</div>
          <div className="arch-node">🌤️ Weather</div>
          <div className="arch-arrow">→</div>
          <div className="arch-node">📊 Risk Engine</div>
          <div className="arch-arrow">→</div>
          <div className="arch-node">💡 Recommendations</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-brand">
          <FlaskConical size={20} />
          <span>AgriNexAi</span>
        </div>
        <p>Smart India Hackathon — AI for Agriculture</p>
        <p className="footer-note">Demo Application — All data is simulated for demonstration purposes</p>
      </footer>
    </div>
  );
}
