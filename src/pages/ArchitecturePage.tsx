// ============================================================
// AgriFedX — System Architecture, Multi-Agent & Federated Learning (/architecture)
// ============================================================

import { useState } from 'react';
import { Network, Cpu, ShieldCheck, Database, Smartphone, Cloud, Layers, Play, CheckCircle, RefreshCw, Zap, Users, Lock, Server } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import mockFederatedService from '../services/mock/mockFederatedService';
import { FederatedStatus } from '../types';

export default function ArchitecturePage() {
  const { language } = useApp();
  const [fedStatus, setFedStatus] = useState<FederatedStatus>(mockFederatedService.getStatus());
  const [simulating, setSimulating] = useState(false);

  const handleSimulateFedRound = () => {
    setSimulating(true);
    setTimeout(() => {
      const updated = mockFederatedService.simulateRound();
      setFedStatus({ ...updated });
      setSimulating(false);
    }, 1200);
  };

  const agents = [
    {
      name: 'Sensing Agent',
      icon: Smartphone,
      status: 'Active',
      task: 'Captures leaf imagery, GPS coordinates & metadata',
      desc: 'Validates image resolution, checks blur/lighting quality and handles location spatial resolution.',
      color: '#3b82f6',
    },
    {
      name: 'Disease Agent',
      icon: Cpu,
      status: 'Active',
      task: 'Runs edge/cloud CNN classification & Grad-CAM',
      desc: 'Determines crop disease type, confidence score, severity and computes visual attention overlays.',
      color: '#10b981',
    },
    {
      name: 'Weather Agent',
      icon: Cloud,
      status: 'Active',
      task: 'Fetches hyperlocal micro-climate metrics',
      desc: 'Ingests temperature, humidity, rainfall and wind velocity to model fungal/pathogen micro-climates.',
      color: '#f59e0b',
    },
    {
      name: 'Risk Agent',
      icon: Zap,
      status: 'Active',
      task: '0–100 Weighted Risk Scoring Engine',
      desc: 'Integrates disease probability (40%), weather (30%), crop stage (15%) & severity (15%).',
      color: '#ef4444',
    },
    {
      name: 'Recommendation Agent',
      icon: ShieldCheck,
      status: 'Active',
      task: 'Context-Aware Agricultural Advisory',
      desc: 'Generates non-chemical immediate actions, preventive measures, treatment & monitoring guidelines.',
      color: '#8b5cf6',
    },
    {
      name: 'Coordinator Agent',
      icon: Network,
      status: 'Active',
      task: 'Orchestrates multi-agent pipelines & alerts',
      desc: 'Manages workflow state, triggers hotspot detection, community early warnings & expert validation.',
      color: '#06b6d4',
    },
  ];

  return (
    <div className="page architecture-page">
      <div className="page-header">
        <div>
          <h2><Network size={26} className="title-icon" /> {t('nav.architecture', language)} &amp; AI Engine</h2>
          <p className="subtitle">Interactive Multi-Agent Architecture, System Pipeline &amp; Federated Learning Simulation</p>
        </div>
      </div>

      {/* System Overview Diagram */}
      <div className="card arch-card">
        <h3><Layers size={20} /> End-to-End System Pipeline Diagram</h3>
        <p className="arch-sub">Data flow from farmer device through multi-agent services to officer validation &amp; community alerts</p>

        <div className="arch-flow-diagram">
          <div className="arch-node input-node">
            <Smartphone size={22} />
            <strong>1. Farmer Inputs</strong>
            <span>Leaf Image + Crop + GPS</span>
          </div>
          <div className="arch-arrow">➔</div>

          <div className="arch-node service-node">
            <Cpu size={22} />
            <strong>2. Multi-Agent Engine</strong>
            <span>Sensing • Disease • Weather • Risk</span>
          </div>
          <div className="arch-arrow">➔</div>

          <div className="arch-node store-node">
            <Database size={22} />
            <strong>3. Storage &amp; Hotspots</strong>
            <span>Local DB • Hotspot Clustering</span>
          </div>
          <div className="arch-arrow">➔</div>

          <div className="arch-node output-node">
            <Server size={22} />
            <strong>4. Farmer &amp; Officer UI</strong>
            <span>Diagnosis • Alerts • Validation</span>
          </div>
        </div>
      </div>

      {/* Multi-Agent Architecture Section */}
      <div className="card arch-card">
        <div className="section-header">
          <h3><Cpu size={20} /> Multi-Agent Cooperative Architecture</h3>
          <span className="badge badge-success">6 Autonomous Agents Active</span>
        </div>
        <p className="arch-sub">Each agent specializes in a distinct intelligence task and communicates asynchronously</p>

        <div className="agents-grid">
          {agents.map((agent) => (
            <div key={agent.name} className="agent-card" style={{ borderTop: `4px solid ${agent.color}` }}>
              <div className="agent-header">
                <agent.icon size={22} style={{ color: agent.color }} />
                <h4>{agent.name}</h4>
                <span className="agent-status-tag"><CheckCircle size={12} /> {agent.status}</span>
              </div>
              <p className="agent-task"><strong>Task:</strong> {agent.task}</p>
              <p className="agent-desc">{agent.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Federated Learning Visual Simulation */}
      <div className="card arch-card fed-card">
        <div className="section-header">
          <div>
            <h3><Lock size={20} /> Federated Learning Visual Simulation</h3>
            <p className="arch-sub">Privacy-preserving model aggregation — raw farmer images remain safely on local devices</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleSimulateFedRound}
            disabled={simulating}
          >
            {simulating ? <RefreshCw size={16} className="spin-icon" /> : <Play size={16} />}
            {simulating ? 'Aggregating Round...' : 'Simulate Federated Round'}
          </button>
        </div>

        {/* Fed Metrics Grid */}
        <div className="metrics-grid">
          <div className="card metric-card">
            <span className="metric-label">Participating Clients</span>
            <div className="metric-value"><Users size={20} /> {fedStatus.participants}</div>
            <span className="metric-sub">Local Farm Nodes</span>
          </div>
          <div className="card metric-card">
            <span className="metric-label">Federated Round</span>
            <div className="metric-value text-primary">Round #{fedStatus.currentRound}</div>
            <span className="metric-sub">Active Epoch</span>
          </div>
          <div className="card metric-card">
            <span className="metric-label">Global Model Version</span>
            <div className="metric-value text-success">{fedStatus.globalModelVersion}</div>
            <span className="metric-sub">Aggregated Weights</span>
          </div>
          <div className="card metric-card">
            <span className="metric-label">Model Accuracy</span>
            <div className="metric-value">{fedStatus.accuracy}%</div>
            <span className="metric-sub">Global Validation</span>
          </div>
        </div>

        {/* Federated Flow Diagram */}
        <div className="fed-diagram">
          <div className="fed-clients-col">
            {fedStatus.clients.slice(0, 4).map((client) => (
              <div key={client.id} className="fed-client-box">
                <Smartphone size={16} />
                <div>
                  <strong>{client.name}</strong>
                  <small>{client.district} • {client.localSamples} samples</small>
                </div>
                <span className="fed-status-badge">{client.status}</span>
              </div>
            ))}
          </div>

          <div className="fed-lines">
            <div className="fed-arrow">➔ Local Gradients ➔</div>
            <div className="fed-arrow">➔ Local Gradients ➔</div>
          </div>

          <div className="fed-aggregator-box">
            <Server size={32} className="text-primary" />
            <h4>Federated Aggregator</h4>
            <p>FedAvg Weight Combination</p>
            <span className="badge badge-warning">Zero Image Transfer</span>
          </div>

          <div className="fed-lines">
            <div className="fed-arrow">➔ Updated Weights ➔</div>
            <div className="fed-arrow">➔ Updated Weights ➔</div>
          </div>

          <div className="fed-global-box">
            <Cpu size={32} className="text-success" />
            <h4>Global Model</h4>
            <p>Version {fedStatus.globalModelVersion}</p>
            <span className="badge badge-success">{fedStatus.accuracy}% Accuracy</span>
          </div>
        </div>
      </div>
    </div>
  );
}
