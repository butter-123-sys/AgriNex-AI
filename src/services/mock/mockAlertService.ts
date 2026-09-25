// ============================================================
// AgriFedX — Mock Alert Service
// ============================================================
// INTEGRATION POINT: Replace with GET /alerts, POST /alerts API calls
// ============================================================

import type { CommunityAlert, Disease } from '../../types';
import { getAlerts as getStoredAlerts } from '../storageService';

export function getAlerts(): CommunityAlert[] {
  return getStoredAlerts();
}

export function getActiveAlerts(): CommunityAlert[] {
  return getStoredAlerts().filter((a) => a.active);
}

export function checkAndCreateAlert(
  district: string,
  disease: Disease,
  averageRisk: number,
  caseCount: number
): CommunityAlert | null {
  // Rule: 3+ nearby cases, within 7 days, average risk >= 40 (MEDIUM)
  if (caseCount >= 3 && averageRisk >= 40) {
    const riskLevel = averageRisk >= 70 ? 'HIGH' : averageRisk >= 40 ? 'MEDIUM' : 'LOW';
    const alert: CommunityAlert = {
      id: `alert-${Date.now()}`,
      disease,
      cases: caseCount,
      area: district,
      district,
      riskLevel: riskLevel as CommunityAlert['riskLevel'],
      averageRisk,
      period: 'Last 7 days',
      recommendation: `${disease} detected near your area. Inspect your crops and monitor for symptoms. Contact your agriculture officer if symptoms appear.`,
      createdAt: new Date().toISOString(),
      active: true,
    };
    return alert;
  }
  return null;
}

export const mockAlertService = { getAlerts, getActiveAlerts, checkAndCreateAlert };
export default mockAlertService;
