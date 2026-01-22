import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ui/ScrollToTop";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import NotFound from "./pages/NotFound";
import RealTimeMonitorHub from './pages/real-time-monitor-hub';
import LoginAuthentication from './pages/login-authentication';
import VitalSignsAnalytics from './pages/vital-signs-analytics';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<LoginAuthentication />} />
        <Route path="/real-time-monitor-hub" element={<RealTimeMonitorHub />} />
        <Route path="/login-authentication" element={<LoginAuthentication />} />
        <Route path="/vital-signs-analytics" element={<VitalSignsAnalytics />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
