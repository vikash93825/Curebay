import React, { Suspense } from "react";
import VitalsScreen from "../containers/VitalsScreen";
import SmartAlertScreen from "../containers/SmartAlertScreen";
import Dashboard from "../containers/Dashboard";
import { Routes, Route } from "react-router";
import DashboardLayout from "../components/DashboardLayout";

const AppRoutes = () => (
  <Suspense fallback={null}>
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="/vitals-dashboard" element={<VitalsScreen />} />
        <Route path="/smart-alerts" element={<SmartAlertScreen />} />
      </Route>
    </Routes>
  </Suspense>
);

export default React.memo(AppRoutes);
