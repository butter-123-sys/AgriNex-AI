// ============================================================
// AgriFedX — Mock Disease Detection Service
// ============================================================
// INTEGRATION POINT: Replace with POST /predict API call to real ML model
// ============================================================

import type { DiseaseDetectionResult, Crop, DemoScenario } from '../../types';

const SCENARIOS: Record<string, DiseaseDetectionResult> = {
  early_blight: {
    disease: 'Early Blight',
    confidence: 94,
    severity: 'High',
    affectedRegion: 'Leaf edges and central region — concentric ring patterns observed',
  },
  late_blight: {
    disease: 'Late Blight',
    confidence: 91,
    severity: 'High',
    affectedRegion: 'Irregular water-soaked lesions on leaf surface',
  },
  healthy: {
    disease: 'Healthy',
    confidence: 97,
    severity: 'Low',
    affectedRegion: 'No diseased region detected',
  },
  low_confidence: {
    disease: 'Late Blight',
    confidence: 62,
    severity: 'Moderate',
    affectedRegion: 'Ambiguous lesion pattern — expert validation recommended',
  },
  leaf_spot: {
    disease: 'Leaf Spot',
    confidence: 88,
    severity: 'Moderate',
    affectedRegion: 'Small dark brown spots scattered across leaf blade',
  },
  powdery_mildew: {
    disease: 'Powdery Mildew',
    confidence: 90,
    severity: 'Moderate',
    affectedRegion: 'White powdery coating on upper leaf surface',
  },
  rust: {
    disease: 'Rust',
    confidence: 86,
    severity: 'High',
    affectedRegion: 'Orange-brown pustules on underside of leaves',
  },
};

// Deterministic selection based on image hash when no scenario is explicitly chosen
function hashString(s: string): number {
  let hash = 0;
  for (let i = 0; i < Math.min(s.length, 200); i++) {
    hash = (hash * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

const CROP_DISEASE_MAP: Record<string, string[]> = {
  Tomato: ['early_blight', 'late_blight', 'leaf_spot'],
  Potato: ['late_blight', 'early_blight'],
  Maize: ['rust', 'leaf_spot'],
  Cotton: ['leaf_spot', 'powdery_mildew'],
  Soybean: ['rust', 'powdery_mildew'],
};

export async function detectDisease(
  imageData: string,
  crop: Crop,
  scenario?: DemoScenario
): Promise<DiseaseDetectionResult> {
  // Simulate processing delay
  await new Promise((r) => setTimeout(r, 300));

  if (scenario && SCENARIOS[scenario]) {
    return { ...SCENARIOS[scenario] };
  }

  // Deterministic pick based on image data + crop
  const possibleScenarios = CROP_DISEASE_MAP[crop] || ['early_blight'];
  const idx = hashString(imageData) % possibleScenarios.length;
  const key = possibleScenarios[idx];
  return { ...(SCENARIOS[key] || SCENARIOS['early_blight']) };
}

export const mockDiseaseService = { detect: detectDisease };
export default mockDiseaseService;
