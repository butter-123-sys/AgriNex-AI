// ============================================================
// AgriFedX — Core Type Definitions
// ============================================================

// ---------- Enums / Unions ----------

export type Crop = 'Tomato' | 'Potato' | 'Maize' | 'Cotton' | 'Soybean';

export type CropStage = 'Seedling' | 'Vegetative' | 'Flowering' | 'Fruiting' | 'Maturity';

export type Disease =
  | 'Healthy'
  | 'Early Blight'
  | 'Late Blight'
  | 'Leaf Spot'
  | 'Powdery Mildew'
  | 'Rust'
  | (string & {});

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type ValidationStatus = 'PENDING' | 'CONFIRMED' | 'MODIFIED' | 'REJECTED';

export type UserRole = 'farmer' | 'officer';

export type Language = 'en' | 'mr' | 'hi';

export type NotificationType =
  | 'disease_alert'
  | 'high_risk'
  | 'community_warning'
  | 'followup_reminder'
  | 'expert_validation';

export type HotspotLevel = 'LOW' | 'MEDIUM' | 'HIGH';

// ---------- Location ----------

export interface Location {
  latitude: number;
  longitude: number;
  district: string;
  taluka: string;
  village: string;
}

// ---------- Weather ----------

export interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  condition: string;
  forecast: string;
}

// ---------- Disease Detection ----------

export interface DiseaseDetectionResult {
  disease: Disease;
  confidence: number;
  severity: 'Low' | 'Moderate' | 'High';
  affectedRegion: string;
}

// ---------- Risk ----------

export interface RiskResult {
  score: number;
  level: RiskLevel;
  factors: string[];
  breakdown: {
    diseaseProbability: number;
    weatherConditions: number;
    cropStage: number;
    diseaseSeverity: number;
  };
}

// ---------- Recommendation ----------

export interface Recommendation {
  immediateActions: string[];
  preventiveMeasures: string[];
  treatmentGuidance: string[];
  monitoring: string[];
  recheckSuggestion: string;
}

// ---------- Explainability ----------

export interface ExplainabilityResult {
  description: string;
  highlightRegions: { x: number; y: number; width: number; height: number }[];
  gradcamAvailable: boolean;
}

// ---------- Diagnosis ----------

export interface Diagnosis {
  id: string;
  farmerId: string;
  crop: Crop;
  cropStage: CropStage;
  disease: Disease;
  confidence: number;
  severity: 'Low' | 'Moderate' | 'High';
  riskScore: number;
  riskLevel: RiskLevel;
  imageDataUrl: string; // base64 or blob URL stored in localStorage
  location: Location;
  weather: WeatherData;
  recommendation: Recommendation;
  explainability: ExplainabilityResult;
  validationStatus: ValidationStatus;
  createdAt: string; // ISO string
  pestAnalysis?: PestAnalysisResult;
}

// ---------- Pest & Trap Intelligence ----------

export type TrapType =
  | 'Yellow Sticky Trap'
  | 'Blue Sticky Trap'
  | 'Pheromone Trap'
  | 'Light Trap'
  | 'Pitfall Trap'
  | 'Other / Unknown';

export type PestType =
  | 'Caterpillar'
  | 'Whitefly'
  | 'Aphids'
  | 'Thrips'
  | 'Stem Borer'
  | 'Fall Armyworm'
  | 'Leafminer'
  | 'Fruit Borer'
  | 'Unknown Pest';

export type PestActivityLevel = 'Low' | 'Moderate' | 'High' | 'Unspecified';

export interface PestItemDetection {
  pestType: PestType;
  category: 'Chewing insect' | 'Sucking insect' | 'Borer insect' | 'Tunneling insect' | 'Unknown';
  count: number;
  confidence?: number;
}

export interface PestGuidance {
  pestType: PestType;
  category: string;
  symptoms: string;
  whatToCheck: string[];
  immediatePrecautions: string[];
  managementApproach: string[];
  monitoring: string[];
  expertReferral: string;
}

export interface TrapInfo {
  type: TrapType;
  isTrapImage: boolean;
  confidence?: number;
  purpose: string;
  monitoredPests: string[];
  monitoringStatus: string;
  recommendation: string;
  uncertain?: boolean;
}

export interface PestAnalysisResult {
  hasPest: boolean;
  isTrapImage: boolean;
  trapInfo?: TrapInfo;
  detections: PestItemDetection[];
  totalPestCount: number;
  activityLevel: PestActivityLevel;
  countingReliable: boolean;
  lowConfidence: boolean;
  pestGuidanceList: PestGuidance[];
  summaryMessage: string;
  actionPoints: string[];
  isDemoMode?: boolean;
}

// ---------- Validation ----------

export interface Validation {
  id: string;
  diagnosisId: string;
  aiDisease: Disease;
  aiConfidence: number;
  expertDisease?: Disease;
  decision: ValidationStatus;
  comment: string;
  expertId: string;
  timestamp: string;
}

// ---------- Notification ----------

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedId?: string; // diagnosisId or alertId
}

// ---------- Community Alert ----------

export interface CommunityAlert {
  id: string;
  disease: Disease;
  cases: number;
  area: string;
  district: string;
  riskLevel: RiskLevel;
  averageRisk: number;
  period: string;
  recommendation: string;
  createdAt: string;
  active: boolean;
}

// ---------- Hotspot ----------

export interface Hotspot {
  id: string;
  disease: Disease;
  crop: Crop;
  latitude: number;
  longitude: number;
  cases: number;
  averageRisk: number;
  level: HotspotLevel;
  district: string;
  affectedCrops: Crop[];
  latestCase: string;
  dateRange: string;
  radius: number; // in km
}

// ---------- Progress Record ----------

export interface ProgressRecord {
  id: string;
  farmerId: string;
  diagnosisId: string;
  crop: Crop;
  disease: Disease;
  riskScore: number;
  day: number;
  date: string;
}

// ---------- User ----------

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  district?: string;
  phone?: string;
  crop?: Crop;
  crops?: Crop[];
}

// ---------- Farmer ----------

export interface Farmer {
  id: string;
  name: string;
  phone: string;
  district: string;
  taluka: string;
  village: string;
  crops: Crop[];
}

// ---------- Demo Scenario ----------

export type DemoScenario =
  | 'early_blight'
  | 'late_blight'
  | 'healthy'
  | 'low_confidence'
  | 'hotspot'
  | 'progress'
  | 'yellow_trap_whitefly'
  | 'caterpillar_leaf'
  | 'healthy_caterpillar'
  | 'leaf_damage_no_pest'
  | 'blue_trap_thrips';

// ---------- Federated Learning ----------

export interface FederatedStatus {
  participants: number;
  currentRound: number;
  globalModelVersion: string;
  accuracy: number;
  convergenceRate: number;
  privacyBudget: number;
  clients: FederatedClient[];
}

export interface FederatedClient {
  id: string;
  name: string;
  district: string;
  localSamples: number;
  lastUpdate: string;
  status: 'training' | 'idle' | 'syncing';
}

// ---------- Agent ----------

export interface AgentInfo {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'idle' | 'processing';
  task: string;
  icon: string; // lucide icon name
}

// ---------- Pipeline Step ----------

export interface PipelineStep {
  label: string;
  status: 'pending' | 'running' | 'done' | 'error';
}

// ---------- Service Interfaces ----------
// These interfaces define the contract for all services.
// Mock services implement them now; real API services can replace them later.

export interface IDiseaseService {
  detect(imageData: string, crop: Crop, scenario?: DemoScenario): Promise<DiseaseDetectionResult>;
}

export interface IWeatherService {
  getWeather(location: Location): Promise<WeatherData>;
}

export interface IRiskService {
  calculate(
    detection: DiseaseDetectionResult,
    weather: WeatherData,
    crop: Crop,
    cropStage: CropStage
  ): RiskResult;
}

export interface IRecommendationService {
  generate(
    disease: Disease,
    risk: RiskResult,
    crop: Crop,
    cropStage: CropStage,
    weather: WeatherData
  ): Recommendation;
}

export interface IHotspotService {
  getHotspots(filters?: { disease?: Disease; crop?: Crop; district?: string }): Hotspot[];
  checkNearby(location: Location, disease: Disease): Hotspot | null;
}

export interface IAlertService {
  getAlerts(): CommunityAlert[];
  checkAndCreate(location: Location, disease: Disease, risk: number): CommunityAlert | null;
}

export interface IValidationService {
  getPending(): Validation[];
  validate(
    diagnosisId: string,
    decision: ValidationStatus,
    expertDisease?: Disease,
    comment?: string
  ): Validation;
}

export interface IFederatedService {
  getStatus(): FederatedStatus;
  simulateRound(): FederatedStatus;
}
