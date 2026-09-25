// ============================================================
// AgriFedX — Demo Configuration
// ============================================================

import type { Crop } from '../types';

export const DEMO_MODE = true;

export const APP_NAME = 'AgriNex AI';

export const APP_TAGLINE =
  'The Next Generation Crop Health Intelligence';

export const DEMO_USERS = {
  farmer: {
    email: 'farmer@agrinexai.demo',
    password: 'demo123',
    id: 'farmer-001',
    name: 'Rajesh Patil',
    role: 'farmer' as const,
    district: 'Nashik',
    phone: '+91 98765 43210',
    crop: 'Tomato' as Crop,
    crops: ['Tomato', 'Potato', 'Maize', 'Cotton', 'Soybean'] as Crop[],
  },
  officer: {
    email: 'officer@agrinexai.demo',
    password: 'demo123',
    id: 'officer-001',
    name: 'Agri Officer #AG-402 (Nashik)',
    role: 'officer' as const,
    district: 'Nashik',
    phone: '+91 98765 43211',
  },
};

export const DEMO_LOCATIONS = [
  { district: 'Nashik', taluka: 'Nashik', village: 'Deolali', latitude: 19.9975, longitude: 73.7898 },
  { district: 'Pune', taluka: 'Haveli', village: 'Khed', latitude: 18.5204, longitude: 73.8567 },
  { district: 'Ahmednagar', taluka: 'Rahuri', village: 'Loni', latitude: 19.0948, longitude: 74.7480 },
  { district: 'Sangli', taluka: 'Miraj', village: 'Vita', latitude: 16.8524, longitude: 74.5815 },
  { district: 'Satara', taluka: 'Karad', village: 'Umbraj', latitude: 17.6805, longitude: 74.0183 },
  { district: 'Kolhapur', taluka: 'Karveer', village: 'Panhala', latitude: 16.7050, longitude: 74.2433 },
];

export const STORAGE_KEYS = {
  currentUser: 'agrifedx_user',
  diagnoses: 'agrifedx_diagnoses',
  farmers: 'agrifedx_farmers',
  alerts: 'agrifedx_alerts',
  notifications: 'agrifedx_notifications',
  validations: 'agrifedx_validations',
  progress: 'agrifedx_progress',
  hotspots: 'agrifedx_hotspots',
  language: 'agrifedx_language',
  seeded: 'agrifedx_seeded',
};

export const CROPS = ['Tomato', 'Potato', 'Maize', 'Cotton', 'Soybean'] as const;

export const CROP_STAGES = ['Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Maturity'] as const;

export const DISEASES = [
  'Healthy',
  'Early Blight',
  'Late Blight',
  'Leaf Spot',
  'Powdery Mildew',
  'Rust',
] as const;
