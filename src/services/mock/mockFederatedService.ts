// ============================================================
// AgriFedX — Mock Federated Learning Service
// ============================================================
// SIMULATION ONLY — No real distributed training
// INTEGRATION POINT: Replace with Flower FL framework
// ============================================================

import type { FederatedStatus, FederatedClient } from '../../types';

const CLIENTS: FederatedClient[] = [
  { id: 'fc-1', name: 'Nashik Farm Cluster', district: 'Nashik', localSamples: 342, lastUpdate: new Date(Date.now() - 3600000).toISOString(), status: 'idle' },
  { id: 'fc-2', name: 'Pune Agri Network', district: 'Pune', localSamples: 287, lastUpdate: new Date(Date.now() - 7200000).toISOString(), status: 'idle' },
  { id: 'fc-3', name: 'Ahmednagar Co-op', district: 'Ahmednagar', localSamples: 198, lastUpdate: new Date(Date.now() - 5400000).toISOString(), status: 'idle' },
  { id: 'fc-4', name: 'Sangli Farmers Union', district: 'Sangli', localSamples: 156, lastUpdate: new Date(Date.now() - 9000000).toISOString(), status: 'idle' },
  { id: 'fc-5', name: 'Satara Krishi Mandal', district: 'Satara', localSamples: 134, lastUpdate: new Date(Date.now() - 10800000).toISOString(), status: 'idle' },
  { id: 'fc-6', name: 'Kolhapur Farm Hub', district: 'Kolhapur', localSamples: 223, lastUpdate: new Date(Date.now() - 4500000).toISOString(), status: 'idle' },
];

let currentRound = 8;
let modelVersion = 1.8;

export function getStatus(): FederatedStatus {
  return {
    participants: 12,
    currentRound,
    globalModelVersion: `v${modelVersion.toFixed(1)}`,
    accuracy: 91.3 + currentRound * 0.2,
    convergenceRate: 0.94,
    privacyBudget: 2.5,
    clients: CLIENTS.map((c) => ({ ...c })),
  };
}

export function simulateRound(): FederatedStatus {
  // Simulate training round progression
  currentRound++;
  modelVersion = parseFloat((modelVersion + 0.1).toFixed(1));

  // Animate client statuses
  CLIENTS.forEach((c, i) => {
    c.status = i % 3 === 0 ? 'training' : i % 3 === 1 ? 'syncing' : 'idle';
    c.lastUpdate = new Date().toISOString();
    c.localSamples += Math.floor(Math.random() * 20) + 5;
  });

  return getStatus();
}

export const mockFederatedService = { getStatus, simulateRound };
export default mockFederatedService;
