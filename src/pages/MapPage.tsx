// ============================================================
// AgriFedX — Regional Disease Hotspot Map Page
// ============================================================

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import storageService from '../services/storageService';
import { CROPS, DISEASES } from '../config/demoConfig';
import { MapContainer, TileLayer, CircleMarker, Popup, Circle, useMap } from 'react-leaflet';
import {
  Filter,
  ShieldAlert,
  MapPin,
  Calendar,
  X,
  Compass,
  Layers,
  Thermometer,
  CloudRain,
  Activity,
  AlertTriangle,
} from 'lucide-react';
import type { Hotspot, Diagnosis } from '../types';
import 'leaflet/dist/leaflet.css';

const RISK_COLORS: Record<string, string> = {
  HIGH: '#ef4444',
  MEDIUM: '#f97316',
  LOW: '#22c55e',
};

// Region metadata with coordinate centers and regional intelligence
interface RegionDetail {
  name: string;
  marathiName: string;
  hindiName: string;
  center: [number, number];
  zoom: number;
  crops: string[];
  keyDiseases: string[];
  climateNote: string;
}

const REGION_DATA: Record<string, RegionDetail> = {
  Nashik: {
    name: 'Nashik Region',
    marathiName: 'नाशिक विभाग',
    hindiName: 'नासिक क्षेत्र',
    center: [19.9975, 73.7898],
    zoom: 10,
    crops: ['Tomato', 'Potato', 'Onion', 'Grapes'],
    keyDiseases: ['Early Blight', 'Downy Mildew'],
    climateNote: 'High relative humidity (82%) with intermittent rain; favorable for Early Blight fungal development.',
  },
  Pune: {
    name: 'Pune Region',
    marathiName: 'पुणे विभाग',
    hindiName: 'पुणे क्षेत्र',
    center: [18.5204, 73.8567],
    zoom: 10,
    crops: ['Potato', 'Tomato', 'Sugarcane'],
    keyDiseases: ['Late Blight', 'Leaf Spot'],
    climateNote: 'Cool night temperatures and prolonged morning dew elevating Late Blight infection risks.',
  },
  Ahmednagar: {
    name: 'Ahmednagar Region',
    marathiName: 'अहमदनगर विभाग',
    hindiName: 'अहमदनगर क्षेत्र',
    center: [19.0948, 74.7480],
    zoom: 10,
    crops: ['Cotton', 'Soybean', 'Maize'],
    keyDiseases: ['Powdery Mildew', 'Bacterial Blight'],
    climateNote: 'Moderate wind speeds (12 km/h) causing aerosol pathogen drift across adjacent cotton tracts.',
  },
  Sangli: {
    name: 'Sangli Region',
    marathiName: 'सांगली विभाग',
    hindiName: 'सांगली क्षेत्र',
    center: [16.8524, 74.5815],
    zoom: 10,
    crops: ['Soybean', 'Maize', 'Turmeric'],
    keyDiseases: ['Rust', 'Leaf Spot'],
    climateNote: 'Warm conditions with high fungal spore dispersion across major soybean belts.',
  },
  Satara: {
    name: 'Satara Region',
    marathiName: 'सातारा विभाग',
    hindiName: 'सातारा क्षेत्र',
    center: [17.6805, 74.0183],
    zoom: 10,
    crops: ['Tomato', 'Ginger', 'Strawberry'],
    keyDiseases: ['Early Blight', 'Fruit Rot'],
    climateNote: 'High humidity in foothill zones causing leaf wetness duration over 8 hours.',
  },
  Kolhapur: {
    name: 'Kolhapur Region',
    marathiName: 'कोल्हापूर विभाग',
    hindiName: 'कोल्हापुर क्षेत्र',
    center: [16.7050, 74.2433],
    zoom: 10,
    crops: ['Maize', 'Sugarcane', 'Soybean'],
    keyDiseases: ['Leaf Spot', 'Rust'],
    climateNote: 'Heavy precipitation belt; waterlogged plots require urgent drainage.',
  },
};

const DEFAULT_CENTER: [number, number] = [19.25, 75.5];
const DEFAULT_ZOOM = 7;

// Helper component that dynamically flies the map camera to selected location
function MapViewController({
  targetCenter,
  targetZoom,
}: {
  targetCenter: [number, number];
  targetZoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(targetCenter, targetZoom, {
      duration: 1.2,
      easeLinearity: 0.25,
    });
  }, [targetCenter, targetZoom, map]);

  return null;
}

export default function MapPage() {
  const { language } = useApp();
  const [searchParams] = useSearchParams();

  const [filterDisease, setFilterDisease] = useState('');
  const [filterCrop, setFilterCrop] = useState('');
  const [filterRisk, setFilterRisk] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('');
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);

  // Dynamic Camera coordinates state
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState<number>(DEFAULT_ZOOM);

  const allHotspots: Hotspot[] = storageService.getHotspots();
  const diagnoses: Diagnosis[] = storageService.getDiagnoses();

  // Read scenario param or selected hotspot from URL
  useEffect(() => {
    const selectedId = searchParams.get('selected');
    if (selectedId) {
      const found = allHotspots.find((h) => h.id === selectedId);
      if (found) {
        setSelectedHotspot(found);
        setFilterDistrict(found.district);
        setMapCenter([found.latitude, found.longitude]);
        setMapZoom(11);
      }
    }
  }, [searchParams]);

  // Handle District selection
  const handleSelectDistrict = (districtName: string) => {
    setFilterDistrict(districtName);
    setSelectedHotspot(null);

    if (districtName && REGION_DATA[districtName]) {
      const region = REGION_DATA[districtName];
      setMapCenter(region.center);
      setMapZoom(region.zoom);
    } else {
      setMapCenter(DEFAULT_CENTER);
      setMapZoom(DEFAULT_ZOOM);
    }
  };

  // Handle clicking a specific hotspot
  const handleSelectHotspot = (h: Hotspot) => {
    setSelectedHotspot(h);
    setFilterDistrict(h.district);
    setMapCenter([h.latitude, h.longitude]);
    setMapZoom(11);
  };

  const handleResetView = () => {
    setFilterDistrict('');
    setFilterDisease('');
    setFilterCrop('');
    setFilterRisk('');
    setSelectedHotspot(null);
    setMapCenter(DEFAULT_CENTER);
    setMapZoom(DEFAULT_ZOOM);
  };

  // Filtered hotspots
  let hotspots = allHotspots;
  if (filterDisease) hotspots = hotspots.filter((h) => h.disease === filterDisease);
  if (filterCrop) hotspots = hotspots.filter((h) => h.affectedCrops.includes(filterCrop as any));
  if (filterRisk) hotspots = hotspots.filter((h) => h.level === filterRisk);
  if (filterDistrict) hotspots = hotspots.filter((h) => h.district === filterDistrict);

  // Filtered diagnoses in selected region
  const regionalDiagnoses = filterDistrict
    ? diagnoses.filter((d) => d.location.district === filterDistrict)
    : diagnoses;

  const currentRegionMeta = filterDistrict ? REGION_DATA[filterDistrict] : null;

  return (
    <div className="page map-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>{t('map.title', language)}</h1>
          <p>
            {filterDistrict
              ? `${filterDistrict} Regional Focus: ${hotspots.length} active hotspot(s), ${regionalDiagnoses.length} local farm inspection records`
              : `${hotspots.length} disease hotspots mapped across Maharashtra`}
          </p>
        </div>

        {filterDistrict && (
          <button className="btn btn-secondary btn-sm" onClick={handleResetView}>
            <Compass size={14} /> View Entire Maharashtra
          </button>
        )}
      </div>

      {/* Interactive Regional Focus Quick-Pill Bar */}
      <div className="regional-pills-bar card">
        <span className="regional-pills-label">
          <Compass size={15} /> Specific Regional Focus:
        </span>
        <div className="pills-scroll">
          <button
            className={`reg-pill ${!filterDistrict ? 'active' : ''}`}
            onClick={handleResetView}
          >
            All Maharashtra
          </button>
          {Object.entries(REGION_DATA).map(([distName, reg]) => {
            const count = allHotspots.filter((h) => h.district === distName).length;
            return (
              <button
                key={distName}
                className={`reg-pill ${filterDistrict === distName ? 'active' : ''}`}
                onClick={() => handleSelectDistrict(distName)}
              >
                <span>
                  {language === 'mr'
                    ? reg.marathiName
                    : language === 'hi'
                    ? reg.hindiName
                    : distName}
                </span>
                {count > 0 && <span className="reg-badge">{count}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <Filter size={16} />

        <select
          value={filterDistrict}
          onChange={(e) => handleSelectDistrict(e.target.value)}
          className="filter-select highlight-select"
        >
          <option value="">📍 All Districts (Maharashtra)</option>
          {Object.keys(REGION_DATA).map((d) => (
            <option key={d} value={d}>
              📍 {d} District
            </option>
          ))}
        </select>

        <select
          value={filterCrop}
          onChange={(e) => setFilterCrop(e.target.value)}
          className="filter-select"
        >
          <option value="">All Crops</option>
          {CROPS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Selected Region Detailed Intelligence Card */}
      {currentRegionMeta && (
        <div className="card region-focus-card">
          <div className="region-focus-header">
            <div className="region-title-block">
              <MapPin size={22} className="text-primary" />
              <div>
                <h3>
                  {currentRegionMeta.name}{' '}
                  {language === 'mr'
                    ? `(${currentRegionMeta.marathiName})`
                    : language === 'hi'
                    ? `(${currentRegionMeta.hindiName})`
                    : ''}
                </h3>
                <p className="region-sub">
                  Focused view active • Centered at {currentRegionMeta.center[0]}°N,{' '}
                  {currentRegionMeta.center[1]}°E
                </p>
              </div>
            </div>
            <div className="region-stats-summary">
              <div className="mini-chip">
                <span>Active Hotspots</span>
                <strong>{hotspots.length}</strong>
              </div>
              <div className="mini-chip">
                <span>Local Farm Cases</span>
                <strong>{regionalDiagnoses.length}</strong>
              </div>
              <div className="mini-chip">
                <span>Key Crops</span>
                <strong>{currentRegionMeta.crops.slice(0, 2).join(', ')}</strong>
              </div>
            </div>
          </div>

          <div className="region-intelligence-grid">
            <div className="intel-box">
              <span className="intel-label">
                <CloudRain size={14} /> Microclimate Advisory:
              </span>
              <p>{currentRegionMeta.climateNote}</p>
            </div>
            <div className="intel-box">
              <span className="intel-label">
                <ShieldAlert size={14} /> Pathogens Under Surveillance:
              </span>
              <p>{currentRegionMeta.keyDiseases.join(' • ')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Selected Specific Hotspot Banner */}
      {selectedHotspot && (
        <div
          className={`card active-hotspot-banner hotspot-${selectedHotspot.level.toLowerCase()}`}
        >
          <div className="banner-left">
            <ShieldAlert size={26} className="banner-icon" />
            <div>
              <h3>
                {selectedHotspot.disease} Outbreak Cluster — {selectedHotspot.district}
              </h3>
              <p>
                <strong>{selectedHotspot.cases} verified cases</strong> in {selectedHotspot.dateRange} | Average
                Risk Score: <strong>{selectedHotspot.averageRisk}/100</strong>
              </p>
              <div className="hotspot-tags">
                <span className={`risk-badge risk-${selectedHotspot.level.toLowerCase()}`}>
                  {selectedHotspot.level} RISK HOTSPOT
                </span>
                <span>Crops: {selectedHotspot.affectedCrops.join(', ')}</span>
                <span>Coverage Radius: {selectedHotspot.radius} km</span>
              </div>
            </div>
          </div>
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => setSelectedHotspot(null)}
          >
            <X size={16} /> Close Details
          </button>
        </div>
      )}

      {/* Interactive Leaflet Map Container */}
      <div className="map-container">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          minZoom={6}
          maxZoom={13}
          maxBounds={[
            [15.0, 71.5],
            [22.5, 81.5],
          ]}
          maxBoundsViscosity={1.0}
          style={{ height: '540px', width: '100%', borderRadius: '12px' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Dynamic camera fly controller */}
          <MapViewController targetCenter={mapCenter} targetZoom={mapZoom} />

          {/* Hotspot circles */}
          {hotspots.map((h) => (
            <Circle
              key={`circle-${h.id}`}
              center={[h.latitude, h.longitude]}
              radius={h.radius * 1000}
              pathOptions={{
                color: RISK_COLORS[h.level],
                fillColor: RISK_COLORS[h.level],
                fillOpacity: selectedHotspot?.id === h.id ? 0.35 : 0.18,
                weight: selectedHotspot?.id === h.id ? 3 : 2,
              }}
            />
          ))}

          {/* Hotspot markers */}
          {hotspots.map((h) => (
            <CircleMarker
              key={h.id}
              center={[h.latitude, h.longitude]}
              radius={Math.max(10, h.cases * 2.2)}
              eventHandlers={{
                click: () => handleSelectHotspot(h),
              }}
              pathOptions={{
                color: RISK_COLORS[h.level],
                fillColor: RISK_COLORS[h.level],
                fillOpacity: 0.88,
              }}
            >
              <Popup>
                <div className="map-popup">
                  <h4>
                    {h.disease} — {h.district}
                  </h4>
                  <p>
                    <strong>Cases:</strong> {h.cases}
                  </p>
                  <p>
                    <strong>Average Risk:</strong> {h.averageRisk}/100
                  </p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <span className={`risk-badge risk-${h.level.toLowerCase()}`}>
                      {h.level} HOTSPOT
                    </span>
                  </p>
                  <p>
                    <strong>Affected Crops:</strong> {h.affectedCrops.join(', ')}
                  </p>
                  <p>
                    <strong>Period:</strong> {h.dateRange}
                  </p>
                  <p>
                    <strong>Latest Case:</strong> {new Date(h.latestCase).toLocaleDateString()}
                  </p>
                  <button
                    className="btn btn-xs btn-primary mt-2"
                    onClick={() => handleSelectHotspot(h)}
                  >
                    Focus This Hotspot
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          ))}

          {/* Individual case markers */}
          {regionalDiagnoses.slice(0, 30).map((d) => (
            <CircleMarker
              key={d.id}
              center={[d.location.latitude, d.location.longitude]}
              radius={5}
              pathOptions={{
                color: d.riskLevel === 'HIGH' ? '#ef4444' : d.riskLevel === 'MEDIUM' ? '#f97316' : '#22c55e',
                fillOpacity: 0.7,
              }}
            >
              <Popup>
                <div className="map-popup">
                  <h4>{d.disease}</h4>
                  <p>
                    {d.crop} ({d.cropStage}) • {d.confidence}% AI confidence
                  </p>
                  <p>
                    Risk: <strong>{d.riskScore}/100</strong> ({d.riskLevel})
                  </p>
                  <p>
                    📍 {d.location.village}, {d.location.taluka}, {d.location.district}
                  </p>
                  <p>
                    <strong>Validation:</strong>{' '}
                    <span className={`badge ${d.validationStatus === 'CONFIRMED' ? 'badge-success' : 'badge-warning'}`}>
                      {d.validationStatus}
                    </span>
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* Hotspot Summary Grid */}
      <div className="hotspot-summary">
        <div className="summary-header-row">
          <h3>
            {filterDistrict ? `${filterDistrict} Regional Clusters` : 'Maharashtra Hotspots Overview'}
          </h3>
          <span className="text-muted">Click any card to fly to that specific region</span>
        </div>

        <div className="hotspot-cards">
          {hotspots.map((h) => (
            <div
              key={h.id}
              className={`hotspot-card hotspot-${h.level.toLowerCase()} ${
                selectedHotspot?.id === h.id ? 'selected-card' : ''
              }`}
              onClick={() => handleSelectHotspot(h)}
              style={{ cursor: 'pointer' }}
            >
              <div className="hotspot-header">
                <strong>{h.district}</strong>
                <span className={`risk-badge risk-${h.level.toLowerCase()}`}>{h.level}</span>
              </div>
              <p className="hotspot-disease">{h.disease}</p>
              <div className="hotspot-stats">
                <span>
                  <strong>{h.cases}</strong> verified cases
                </span>
                <span>Avg Risk: {h.averageRisk}/100</span>
              </div>
              <small>
                {h.affectedCrops.join(', ')} • {h.dateRange}
              </small>
            </div>
          ))}

          {hotspots.length === 0 && (
            <div className="card empty-state" style={{ gridColumn: '1 / -1' }}>
              <Compass size={32} />
              <p>No hotspots matching the selected filters in this region.</p>
              <button className="btn btn-secondary btn-sm mt-2" onClick={handleResetView}>
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
