// ============================================================
// AgriFedX — localStorage Service
// ============================================================
import { STORAGE_KEYS } from '../config/demoConfig';
import type {
  Diagnosis,
  Farmer,
  CommunityAlert,
  AppNotification,
  Validation,
  ProgressRecord,
  Hotspot,
  User,
} from '../types';

// ---- Generic helpers ----

function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// ---- User ----

export function getCurrentUser(): User | null {
  return getItem<User | null>(STORAGE_KEYS.currentUser, null);
}

export function setCurrentUser(user: User | null): void {
  if (user) {
    setItem(STORAGE_KEYS.currentUser, user);
  } else {
    localStorage.removeItem(STORAGE_KEYS.currentUser);
  }
}

// ---- Farmers ----

export function getFarmers(): Farmer[] {
  return getItem<Farmer[]>(STORAGE_KEYS.farmers, []);
}

export function saveFarmers(farmers: Farmer[]): void {
  setItem(STORAGE_KEYS.farmers, farmers);
}

// ---- Diagnoses ----

export function getDiagnoses(): Diagnosis[] {
  return getItem<Diagnosis[]>(STORAGE_KEYS.diagnoses, []);
}

export function saveDiagnosis(diagnosis: Diagnosis): void {
  const list = getDiagnoses();
  list.unshift(diagnosis);
  setItem(STORAGE_KEYS.diagnoses, list);
}

export function updateDiagnosis(id: string, updates: Partial<Diagnosis>): void {
  const list = getDiagnoses();
  const idx = list.findIndex((d) => d.id === id);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...updates };
    setItem(STORAGE_KEYS.diagnoses, list);
  }
}

// ---- Alerts ----

export function getAlerts(): CommunityAlert[] {
  return getItem<CommunityAlert[]>(STORAGE_KEYS.alerts, []);
}

export function saveAlert(alert: CommunityAlert): void {
  const list = getAlerts();
  list.unshift(alert);
  setItem(STORAGE_KEYS.alerts, list);
}

// ---- Notifications ----

export function getNotifications(): AppNotification[] {
  return getItem<AppNotification[]>(STORAGE_KEYS.notifications, []);
}

export function saveNotification(n: AppNotification): void {
  const list = getNotifications();
  list.unshift(n);
  setItem(STORAGE_KEYS.notifications, list);
}

export function markNotificationRead(id: string): void {
  const list = getNotifications();
  const idx = list.findIndex((n) => n.id === id);
  if (idx >= 0) {
    list[idx].read = true;
    setItem(STORAGE_KEYS.notifications, list);
  }
}

export function markAllNotificationsRead(): void {
  const list = getNotifications().map((n) => ({ ...n, read: true }));
  setItem(STORAGE_KEYS.notifications, list);
}

// ---- Validations ----

export function getValidations(): Validation[] {
  return getItem<Validation[]>(STORAGE_KEYS.validations, []);
}

export function saveValidation(v: Validation): void {
  const list = getValidations();
  const idx = list.findIndex((x) => x.diagnosisId === v.diagnosisId);
  if (idx >= 0) {
    list[idx] = v;
  } else {
    list.unshift(v);
  }
  setItem(STORAGE_KEYS.validations, list);
}

// ---- Progress ----

export function getProgress(): ProgressRecord[] {
  return getItem<ProgressRecord[]>(STORAGE_KEYS.progress, []);
}

export function saveProgress(records: ProgressRecord[]): void {
  setItem(STORAGE_KEYS.progress, records);
}

// ---- Hotspots ----

export function getHotspots(): Hotspot[] {
  return getItem<Hotspot[]>(STORAGE_KEYS.hotspots, []);
}

export function saveHotspots(hotspots: Hotspot[]): void {
  setItem(STORAGE_KEYS.hotspots, hotspots);
}

// ---- Language ----

export function getLanguage(): string {
  return localStorage.getItem(STORAGE_KEYS.language) || 'en';
}

export function setLanguage(lang: string): void {
  localStorage.setItem(STORAGE_KEYS.language, lang);
}

// ---- Seeded ----

export function isSeeded(): boolean {
  return localStorage.getItem(STORAGE_KEYS.seeded) === 'true';
}

export function markSeeded(): void {
  localStorage.setItem(STORAGE_KEYS.seeded, 'true');
}

// ---- Reset ----

export function resetAllData(): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}

// ---- Export all as namespace ----

const storageService = {
  getCurrentUser,
  setCurrentUser,
  getFarmers,
  saveFarmers,
  getDiagnoses,
  saveDiagnosis,
  updateDiagnosis,
  getAlerts,
  saveAlert,
  getNotifications,
  saveNotification,
  markNotificationRead,
  markAllNotificationsRead,
  getValidations,
  saveValidation,
  getProgress,
  saveProgress,
  getHotspots,
  saveHotspots,
  getLanguage,
  setLanguage,
  isSeeded,
  markSeeded,
  resetAllData,
};

export default storageService;
