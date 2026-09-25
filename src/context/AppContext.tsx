// ============================================================
// AgriFedX — App Context (Auth + Language + Notifications)
// ============================================================

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User, Language } from '../types';
import { DEMO_USERS } from '../config/demoConfig';
import storageService from '../services/storageService';
import { seedDemoData } from '../data/seedData';

interface AppContextType {
  user: User | null;
  language: Language;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  setLanguage: (lang: Language) => void;
  unreadCount: number;
  refreshNotifications: () => void;
  resetDemo: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(storageService.getCurrentUser());
  const [language, setLang] = useState<Language>((storageService.getLanguage() as Language) || 'en');
  const [unreadCount, setUnreadCount] = useState(0);

  // Seed data on first load
  useEffect(() => {
    seedDemoData();
    refreshNotifications();
  }, []);

  const refreshNotifications = useCallback(() => {
    const notifs = storageService.getNotifications();
    setUnreadCount(notifs.filter((n) => !n.read).length);
  }, []);

  const login = useCallback((email: string, password: string): boolean => {
    const farmer = DEMO_USERS.farmer;
    const officer = DEMO_USERS.officer;

    let matched: User | null = null;
    if ((email === farmer.email || email === 'farmer@agrinexai.demo' || email === 'farmer@agrifedx.demo' || email.toLowerCase().includes('farmer')) && password === farmer.password) {
      matched = { id: farmer.id, name: farmer.name, email: farmer.email, role: farmer.role, district: farmer.district, phone: farmer.phone, crop: farmer.crop, crops: farmer.crops };
    } else if ((email === officer.email || email === 'officer@agrinexai.demo' || email === 'officer@agrifedx.demo' || email.toLowerCase().includes('officer')) && password === officer.password) {
      matched = { id: officer.id, name: officer.name, email: officer.email, role: officer.role, district: officer.district, phone: officer.phone };
    }

    if (matched) {
      storageService.setCurrentUser(matched);
      setUser(matched);
      refreshNotifications();
      return true;
    }
    return false;
  }, [refreshNotifications]);

  const logout = useCallback(() => {
    storageService.setCurrentUser(null);
    setUser(null);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    storageService.setLanguage(lang);
    setLang(lang);
  }, []);

  const resetDemo = useCallback(() => {
    storageService.resetAllData();
    seedDemoData();
    refreshNotifications();
  }, [refreshNotifications]);

  return (
    <AppContext.Provider value={{ user, language, login, logout, setLanguage, unreadCount, refreshNotifications, resetDemo }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
