import { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { ChallengesProvider } from './contexts/ChallengesContext';
import { SkeletonLoader } from './components/ui/SkeletonLoader';
import { ErrorBoundary } from './components/layout/ErrorBoundary';

// Lazy load pages for code splitting
import { PublicLayout } from './components/layout/PublicLayout';

import React from 'react';

const LandingHome = React.lazy(() => import('./pages/LandingHome'));
const LandingFeatures = React.lazy(() => import('./pages/LandingFeatures'));
const LandingAbout = React.lazy(() => import('./pages/LandingAbout'));
const LandingContact = React.lazy(() => import('./pages/LandingContact'));
const AuthPage = React.lazy(() => import('./pages/AuthPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const FootprintPage = React.lazy(() => import('./pages/FootprintPage'));
const TrackPage = React.lazy(() => import('./pages/TrackPage'));
const InsightsPage = React.lazy(() => import('./pages/InsightsPage'));
const ReducePage = React.lazy(() => import('./pages/ReducePage'));
const GoalsPage = React.lazy(() => import('./pages/GoalsPage'));
const HistoryPage = React.lazy(() => import('./pages/HistoryPage'));
// A fallback component for loading states
const PageLoader = () => (
  <div className="p-8 space-y-6">
    <SkeletonLoader variant="text" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SkeletonLoader variant="card" />
      <SkeletonLoader variant="card" />
      <SkeletonLoader variant="card" />
    </div>
    <SkeletonLoader variant="card" className="h-64" />
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChallengesProvider>
          <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingHome />} />
              <Route path="/features" element={<LandingFeatures />} />
              <Route path="/about" element={<LandingAbout />} />
              <Route path="/contact" element={<LandingContact />} />
            </Route>
            <Route path="/auth" element={<AuthPage />} />

            {/* Protected Routes wrapped in Layout */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <DashboardLayout />
                </ErrorBoundary>
              </ProtectedRoute>
            }>
              <Route index element={<DashboardPage />} />
              <Route path="footprint" element={<FootprintPage />} />
              <Route path="track" element={<TrackPage />} />
              <Route path="insights" element={<InsightsPage />} />
              <Route path="reduce" element={<ReducePage />} />
              <Route path="goals" element={<GoalsPage />} />
              <Route path="history" element={<HistoryPage />} />
              {/* Catch-all redirect to dashboard */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
            
            {/* Catch-all redirect to landing page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        </ChallengesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
