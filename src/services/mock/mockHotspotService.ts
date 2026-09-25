// ============================================================
// AgriFedX — Mock Hotspot Service
// ============================================================
// INTEGRATION POINT: Replace with GET /hotspots API call
// ============================================================

import type { Hotspot, Disease, Crop } from '../../types';
import { getHotspots as getStoredHotspots } from '../storageService';

export function getHotspots(filters?: {
  disease?: Disease;
  crop?: Crop;
  district?: string;
}): Hotspot[] {
  let hotspots = getStoredHotspots();
  if (filters?.disease) {
    hotspots = hotspots.filter((h) => h.disease === filters.disease);
  }
  if (filters?.crop) {
    hotspots = hotspots.filter((h) => h.affectedCrops.includes(filters.crop!));
  }
  if (filters?.district) {
    hotspots = hotspots.filter((h) => h.district === filters.district);
  }
  return hotspots;
}

export function checkNearby(
  lat: number,
  lon: number,
  disease: Disease
): Hotspot | null {
  const hotspots = getStoredHotspots();
  // Find hotspot within ~30km with same disease
  for (const h of hotspots) {
    if (h.disease === disease) {
      const dist = haversine(lat, lon, h.latitude, h.longitude);
      if (dist <= 30) return h;
    }
  }
  return null;
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export const mockHotspotService = { getHotspots, checkNearby };
export default mockHotspotService;
