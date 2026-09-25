// ============================================================
// AgriFedX — Mock Risk Engine
// ============================================================
// INTEGRATION POINT: Replace with POST /risk API call
// ============================================================

import type { DiseaseDetectionResult, WeatherData, Crop, CropStage, RiskResult } from '../../types';

// Crop stage vulnerability (higher = more vulnerable)
const STAGE_WEIGHT: Record<string, number> = {
  Seedling: 60,
  Vegetative: 50,
  Flowering: 85,
  Fruiting: 75,
  Maturity: 40,
};

// Severity numeric mapping
const SEVERITY_SCORE: Record<string, number> = {
  Low: 20,
  Moderate: 55,
  High: 90,
};

export function calculateRisk(
  detection: DiseaseDetectionResult,
  weather: WeatherData,
  _crop: Crop,
  cropStage: CropStage
): RiskResult {
  if (detection.disease === 'Healthy') {
    return {
      score: 12,
      level: 'LOW',
      factors: ['Crop appears healthy', 'Continue regular monitoring'],
      breakdown: {
        diseaseProbability: 5,
        weatherConditions: 15,
        cropStage: 10,
        diseaseSeverity: 5,
      },
    };
  }

  // ---- Component scores (0–100 each) ----

  // Disease probability: based on confidence
  const diseaseProbability = Math.min(100, detection.confidence * 1.05);

  // Weather conditions: humidity + rainfall + (inverse wind drying)
  const humidityScore = Math.min(100, weather.humidity * 1.1);
  const rainfallScore = Math.min(100, weather.rainfall * 4);
  const windPenalty = Math.max(0, 30 - weather.windSpeed); // high wind dries leaves
  const weatherConditions = Math.round((humidityScore * 0.5 + rainfallScore * 0.3 + windPenalty * 0.2));

  // Crop stage vulnerability
  const cropStageScore = STAGE_WEIGHT[cropStage] || 50;

  // Disease severity
  const diseaseSeverity = SEVERITY_SCORE[detection.severity] || 50;

  // ---- Weighted combination ----
  // Disease probability: 40%, Weather: 30%, Crop stage: 15%, Severity: 15%
  const score = Math.round(
    diseaseProbability * 0.40 +
    weatherConditions * 0.30 +
    cropStageScore * 0.15 +
    diseaseSeverity * 0.15
  );

  const clampedScore = Math.max(0, Math.min(100, score));

  const level = clampedScore >= 70 ? 'HIGH' : clampedScore >= 40 ? 'MEDIUM' : 'LOW';

  // ---- Contributing factors ----
  const factors: string[] = [];
  if (weather.humidity >= 75) factors.push('High humidity increases disease spread');
  if (weather.rainfall >= 10) factors.push('Recent rainfall creates favorable disease conditions');
  if (cropStageScore >= 70) factors.push(`Susceptible crop stage: ${cropStage}`);
  if (detection.confidence >= 80) factors.push('High disease detection confidence');
  if (detection.severity === 'High') factors.push('Disease severity is high');
  if (weather.temperature >= 25 && weather.temperature <= 30)
    factors.push('Temperature is in disease-favorable range');
  if (factors.length === 0) factors.push('Moderate overall risk — continue monitoring');

  return {
    score: clampedScore,
    level,
    factors,
    breakdown: {
      diseaseProbability: Math.round(diseaseProbability),
      weatherConditions: Math.round(weatherConditions),
      cropStage: cropStageScore,
      diseaseSeverity,
    },
  };
}

export const mockRiskService = { calculate: calculateRisk };
export default mockRiskService;
