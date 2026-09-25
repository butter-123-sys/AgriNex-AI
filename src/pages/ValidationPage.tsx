// ============================================================
// AgriFedX — Expert Validation Page (/officer/validation)
// ============================================================

import { useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle, Edit3, XCircle, Filter, Calendar, MapPin, Thermometer, CloudRain, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import storageService from '../services/storageService';
import { Diagnosis, Disease, ValidationStatus } from '../types';
import { DISEASES } from '../config/demoConfig';

export default function ValidationPage() {
  const { language, user } = useApp();
  const [filterStatus, setFilterStatus] = useState<ValidationStatus | 'ALL'>('ALL');
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<Diagnosis | null>(null);
  const [modifying, setModifying] = useState(false);
  const [expertDisease, setExpertDisease] = useState<Disease>('Early Blight');
  const [expertComment, setExpertComment] = useState('');

  const diagnoses = storageService.getDiagnoses();
  const validations = storageService.getValidations();

  // Map diagnosis with validation records
  const validationItems = diagnoses.map((d) => {
    const v = validations.find((val) => val.diagnosisId === d.id);
    return {
      diagnosis: d,
      status: v ? v.decision : d.validationStatus,
      validation: v,
    };
  });

  const filteredItems = validationItems.filter((item) => {
    if (filterStatus === 'ALL') return true;
    return item.status === filterStatus;
  });

  const handleDecision = (diagnosis: Diagnosis, status: ValidationStatus, correctedDisease?: Disease, comment?: string) => {
    const finalDisease = correctedDisease || diagnosis.disease;
    const finalComment = comment || (status === 'CONFIRMED' ? 'AI prediction verified by Agriculture Officer.' : status === 'MODIFIED' ? `AI prediction corrected to ${finalDisease}.` : 'Rejected AI prediction.');

    // Save validation record
    storageService.saveValidation({
      id: `val-${Date.now()}`,
      diagnosisId: diagnosis.id,
      aiDisease: diagnosis.disease,
      aiConfidence: diagnosis.confidence,
      expertDisease: finalDisease,
      decision: status,
      comment: finalComment,
      expertId: user?.id || 'officer-001',
      timestamp: new Date().toISOString(),
    });

    // Update diagnosis in storage so it reflects verified status across the app
    storageService.updateDiagnosis(diagnosis.id, {
      validationStatus: status,
      ...(correctedDisease ? { disease: correctedDisease } : {}),
    });

    // Notify farmer about expert decision
    storageService.saveNotification({
      id: `notif-${Date.now() + 1}`,
      type: 'expert_validation',
      title: `👨‍🔬 Expert Validation: ${status}`,
      message: `Your ${diagnosis.crop} diagnosis (${diagnosis.disease}) has been ${status.toLowerCase()} by an Agriculture Officer${correctedDisease ? ` as ${correctedDisease}` : ''}.`,
      read: false,
      createdAt: new Date().toISOString(),
      relatedId: diagnosis.id,
    });

    setModifying(false);
    setSelectedDiagnosis(null);
    setExpertComment('');
  };

  const getStatusBadge = (status: ValidationStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="badge badge-success"><CheckCircle size={12} /> Confirmed</span>;
      case 'MODIFIED':
        return <span className="badge badge-warning"><Edit3 size={12} /> Modified</span>;
      case 'REJECTED':
        return <span className="badge badge-danger"><XCircle size={12} /> Rejected</span>;
      default:
        return <span className="badge badge-warning"><AlertTriangle size={12} /> Pending Review</span>;
    }
  };

  return (
    <div className="page validation-page">
      <div className="page-header">
        <div>
          <h2><ShieldCheck size={26} className="title-icon" /> {t('officer.expertValidation', language)}</h2>
          <p className="subtitle">Human-in-the-loop validation of AI disease predictions</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="card filter-bar">
        <div className="filter-group">
          <Filter size={16} />
          <span>Filter:</span>
          {(['ALL', 'PENDING', 'CONFIRMED', 'MODIFIED', 'REJECTED'] as const).map((status) => (
            <button
              key={status}
              className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status === 'ALL' ? 'All Records' : status}
            </button>
          ))}
        </div>
        <div className="stats-summary">
          <span>Total: <strong>{validationItems.length}</strong></span>
          <span>Pending: <strong className="text-warning">{validationItems.filter((i) => i.status === 'PENDING').length}</strong></span>
        </div>
      </div>

      {/* Validations Grid */}
      <div className="validations-grid">
        {filteredItems.map(({ diagnosis: d, status }) => (
          <div key={d.id} className={`card validation-card ${d.confidence < 80 ? 'low-confidence-border' : ''}`}>
            {d.confidence < 80 && (
              <div className="low-confidence-banner">
                <AlertTriangle size={14} />
                <span>Expert Validation Required (Low AI Confidence &lt; 80%)</span>
              </div>
            )}

            <div className="validation-card-header">
              <div className="card-image-wrapper">
                <img
                  src={d.imageDataUrl || 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a8d?w=300&auto=format&fit=crop&q=80'}
                  alt={d.disease}
                  className="leaf-img"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a8d?w=300&auto=format&fit=crop&q=80'; }}
                />
              </div>
              <div className="card-main-info">
                <div className="info-top">
                  <span className="crop-badge">{d.crop} ({d.cropStage})</span>
                  {getStatusBadge(status)}
                </div>
                <h3>{d.disease}</h3>
                <div className="confidence-meter-sm">
                  <span>AI Confidence: <strong>{d.confidence}%</strong></span>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${d.confidence}%`, backgroundColor: d.confidence >= 80 ? '#22c55e' : '#f59e0b' }} />
                  </div>
                </div>

                <div className="details-pills">
                  <span><MapPin size={13} /> {d.location.district}, {d.location.taluka}</span>
                  <span><Thermometer size={13} /> {d.weather.temperature}°C</span>
                  <span><CloudRain size={13} /> {d.weather.humidity}% Humidity</span>
                  <span><Calendar size={13} /> {new Date(d.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {status === 'PENDING' ? (
              <div className="validation-actions">
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => handleDecision(d, 'CONFIRMED')}
                >
                  <CheckCircle size={15} /> CONFIRM
                </button>
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => {
                    setSelectedDiagnosis(d);
                    setExpertDisease(d.disease);
                    setModifying(true);
                  }}
                >
                  <Edit3 size={15} /> MODIFY
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDecision(d, 'REJECTED')}
                >
                  <XCircle size={15} /> REJECT
                </button>
              </div>
            ) : (
              <div className="validation-result-note">
                <User size={14} />
                <span>Validated by Agriculture Officer — <strong>{status}</strong></span>
              </div>
            )}
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="card empty-state">
            <ShieldCheck size={40} className="empty-icon" />
            <p>No validation records found for the selected filter.</p>
          </div>
        )}
      </div>

      {/* Modify Modal */}
      {modifying && selectedDiagnosis && (
        <div className="modal-overlay">
          <div className="modal-content card">
            <h3><Edit3 size={20} /> Modify AI Disease Prediction</h3>
            <p className="modal-sub">Correct the diagnosis for Farm ID: {selectedDiagnosis.id}</p>

            <div className="form-group">
              <label>Original AI Prediction</label>
              <input type="text" disabled value={`${selectedDiagnosis.disease} (${selectedDiagnosis.confidence}% confidence)`} />
            </div>

            <div className="form-group">
              <label>Corrected Disease Classification</label>
              <select
                value={expertDisease}
                onChange={(e) => setExpertDisease(e.target.value as Disease)}
              >
                {DISEASES.map((dis) => (
                  <option key={dis} value={dis}>{dis}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Officer Comments / Observations</label>
              <textarea
                rows={3}
                placeholder="Enter expert rationale for modifying this diagnosis..."
                value={expertComment}
                onChange={(e) => setExpertComment(e.target.value)}
              />
            </div>

            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => { setModifying(false); setSelectedDiagnosis(null); }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleDecision(selectedDiagnosis, 'MODIFIED', expertDisease, expertComment)}
              >
                Save Modified Diagnosis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
