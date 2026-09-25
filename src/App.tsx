// ============================================================
// AgriFedX — Main App with Routing
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import FarmerDashboard from './pages/FarmerDashboard';
import DiagnosisPage from './pages/DiagnosisPage';
import HistoryPage from './pages/HistoryPage';
import ProgressPage from './pages/ProgressPage';
import MapPage from './pages/MapPage';
import AlertsPage from './pages/AlertsPage';
import OfficerDashboard from './pages/OfficerDashboard';
import ValidationPage from './pages/ValidationPage';
import ChatbotPage from './pages/ChatbotPage';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'officer' ? '/officer/dashboard' : '/dashboard'} replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useApp();

  return (
    <Routes>
      {/* Public routes — Application starts with Login */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/landing" element={<LandingPage />} />

      {/* Protected routes inside Layout */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        {/* Farmer routes */}
        <Route path="/dashboard" element={<FarmerDashboard />} />
        <Route path="/diagnosis" element={<DiagnosisPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/alerts" element={<AlertsPage />} />

        {/* Officer routes */}
        <Route path="/officer/dashboard" element={<ProtectedRoute allowedRoles={['officer']}><OfficerDashboard /></ProtectedRoute>} />
        <Route path="/officer/validation" element={<ProtectedRoute allowedRoles={['officer']}><ValidationPage /></ProtectedRoute>} />
        <Route path="/officer/analytics" element={<ProtectedRoute allowedRoles={['officer']}><OfficerDashboard /></ProtectedRoute>} />

        {/* Shared routes */}
        <Route path="/chatbot" element={<ChatbotPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
