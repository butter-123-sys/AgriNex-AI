// ============================================================
// AgriFedX — Mock Recommendation Engine
// ============================================================
// INTEGRATION POINT: Replace with POST /recommendation API call
// ============================================================

import type { Disease, RiskResult, Crop, CropStage, WeatherData, Recommendation } from '../../types';

const DISEASE_RECOMMENDATIONS: Record<string, Partial<Recommendation>> = {
  'Early Blight': {
    immediateActions: [
      'Inspect nearby plants for similar symptoms',
      'Remove severely affected leaves and dispose safely',
      'Ensure adequate plant spacing for air circulation',
      'Monitor disease progression over next 3–5 days',
    ],
    preventiveMeasures: [
      'Improve field ventilation and drainage',
      'Avoid prolonged leaf wetness — irrigate at base',
      'Practice crop rotation with non-solanaceous crops',
      'Use disease-resistant varieties in next season',
    ],
    treatmentGuidance: [
      'Consult local agriculture officer for approved fungicide options',
      'Apply recommended biological control agents',
      'Follow integrated pest management (IPM) practices',
    ],
    monitoring: [
      'Photograph affected leaves every 2 days',
      'Track weather conditions — high humidity increases risk',
      'Report new symptoms to community network',
    ],
  },
  'Late Blight': {
    immediateActions: [
      'Immediately isolate affected plants if possible',
      'Remove and safely destroy infected plant material',
      'Alert neighboring farmers — Late Blight spreads rapidly',
      'Do not compost infected material',
    ],
    preventiveMeasures: [
      'Improve drainage to reduce moisture',
      'Avoid overhead irrigation',
      'Scout field borders and downwind areas',
      'Consider protective fungicide application (consult officer)',
    ],
    treatmentGuidance: [
      'Late Blight requires urgent attention — contact agriculture officer',
      'Systemic fungicides may be needed (expert guidance required)',
      'Follow recommended spray schedule strictly',
    ],
    monitoring: [
      'Daily inspection during humid/rainy periods',
      'Check lower leaves and stems first',
      'Monitor weather forecast for rain and high humidity',
    ],
  },
  'Leaf Spot': {
    immediateActions: [
      'Remove heavily spotted leaves',
      'Avoid working in wet field to prevent spread',
      'Ensure proper plant nutrition',
    ],
    preventiveMeasures: [
      'Maintain adequate plant spacing',
      'Mulch to prevent soil splash onto leaves',
      'Rotate crops annually',
    ],
    treatmentGuidance: [
      'Apply copper-based fungicides if approved by officer',
      'Use neem-based organic treatments as first line',
    ],
    monitoring: [
      'Weekly leaf inspection',
      'Track spotted leaf percentage',
    ],
  },
  'Powdery Mildew': {
    immediateActions: [
      'Prune affected leaves to improve air circulation',
      'Remove plant debris around base',
    ],
    preventiveMeasures: [
      'Avoid excessive nitrogen fertilization',
      'Ensure good air circulation between rows',
      'Water at soil level, not overhead',
    ],
    treatmentGuidance: [
      'Sulfur-based fungicides may help — consult officer',
      'Baking soda spray can be used as home remedy (limited)',
    ],
    monitoring: [
      'Check upper leaf surfaces weekly',
      'Monitor in dry, warm conditions',
    ],
  },
  Rust: {
    immediateActions: [
      'Remove heavily rusted leaves immediately',
      'Do not leave infected debris in field',
      'Inspect all plants in affected area',
    ],
    preventiveMeasures: [
      'Use rust-resistant crop varieties',
      'Avoid dense planting',
      'Ensure balanced fertilization',
    ],
    treatmentGuidance: [
      'Apply approved fungicide — consult agriculture officer',
      'Timely application is critical for rust control',
    ],
    monitoring: [
      'Inspect underside of leaves for pustules',
      'Monitor after warm, humid periods',
    ],
  },
  Healthy: {
    immediateActions: [
      'Continue current agricultural practices',
      'Maintain regular crop monitoring schedule',
    ],
    preventiveMeasures: [
      'Practice crop rotation',
      'Maintain field hygiene',
      'Monitor weather forecasts for disease-favorable conditions',
    ],
    treatmentGuidance: [
      'No treatment needed — crop appears healthy',
    ],
    monitoring: [
      'Weekly visual inspection',
      'Track weather for disease risk changes',
    ],
  },
};

export function generateRecommendation(
  disease: Disease,
  risk: RiskResult,
  _crop: Crop,
  cropStage: CropStage,
  weather: WeatherData
): Recommendation {
  const base = DISEASE_RECOMMENDATIONS[disease] || DISEASE_RECOMMENDATIONS['Healthy'];

  // Dynamic additions based on risk and conditions
  const extra: string[] = [];
  if (risk.level === 'HIGH') {
    extra.push('⚠️ HIGH RISK — Prioritize immediate intervention');
  }
  if (weather.rainfall >= 15) {
    extra.push('Heavy rainfall expected — prepare field drainage');
  }
  if (cropStage === 'Flowering' || cropStage === 'Fruiting') {
    extra.push(`Crop is in ${cropStage} stage — yield protection is critical`);
  }

  const recheckDays = risk.level === 'HIGH' ? 2 : risk.level === 'MEDIUM' ? 5 : 7;

  return {
    immediateActions: [...(extra.length > 0 ? extra : []), ...(base.immediateActions || [])],
    preventiveMeasures: base.preventiveMeasures || [],
    treatmentGuidance: base.treatmentGuidance || [],
    monitoring: base.monitoring || [],
    recheckSuggestion: `Re-check in ${recheckDays} days to monitor progress. Upload a new leaf image for comparison.`,
  };
}

export const mockRecommendationService = { generate: generateRecommendation };
export default mockRecommendationService;
