import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "./components/Layout/Layout";
import CalendarPage from "./containers/CalendarPage";
import PatientDetailsPage from "./containers/PatientDetailsPage";
import MuiProvider from "./mui/MaterialDesign";
import { Spin } from "antd";
import StaffManagement from "./components/admin/StaffsManagement";
import InventoryManagement from './components/admin/InventoryManagement';

// Lazy load pages
const HomePage = lazy(() => import("./containers/HomePage"));
const LoginPage = lazy(() => import("./components/Auth/LoginPage"));
const RegisterForm = lazy(() => import("./components/Forms/RegisterForm"));
const Dashboard = lazy(() => import("./containers/Dashboard"));
const DoctorsPage = lazy(() => import("./containers/DoctorsPage"));
const PatientsPage = lazy(() => import("./containers/PatientsPageFinal"));
const AppointmentsPage = lazy(() => import("./containers/AppointmentsPage"));
const PrescriptionsPage = lazy(() => import("./containers/PrescriptionsPage"));
const BillingPage = lazy(() => import("./containers/BillingPage"));
const PaymentPage = lazy(() => import("./containers/PaymentPage"));
const SettingsPage = lazy(() => import("./containers/SettingsPage"));

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is specified and user role is not in the list, redirect to home
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/appointments" replace />;
  }

  return children;
};

const AppWrapper = () => {
  return (
    <MuiProvider>
      <Suspense fallback={<div style={{ textAlign: "center", padding: "80px" }}><Spin size="large" /></div>}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterForm />} />

          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['admin', 'doctor', 'nurse', 'pharmacist', 'receptionist']}>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/home" element={
            <ProtectedRoute>
              <Layout>
                <HomePage />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/doctors" element={
            <ProtectedRoute>
              <Layout>
                <DoctorsPage />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/calendar" element={
            <ProtectedRoute>
              <Layout>
                <CalendarPage />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/patients" element={
            <ProtectedRoute>
              <Layout>
                <PatientsPage />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/patients/:id" element={
            <ProtectedRoute>
              <Layout>
                <PatientDetailsPage />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/appointments" element={
            <ProtectedRoute>
              <Layout>
                <AppointmentsPage />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/prescriptions" element={
            <ProtectedRoute>
              <Layout>
                <PrescriptionsPage />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/billing" element={
            <ProtectedRoute>
              <Layout>
                <BillingPage />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/payment" element={
            <ProtectedRoute>
              <Layout>
                <PaymentPage />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/settings" element={
            <ProtectedRoute>
              <Layout>
                <SettingsPage />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/staff" element={
            <ProtectedRoute>
              <Layout>
                <StaffManagement />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/inventory" element={
            <ProtectedRoute>
              <Layout>
                <InventoryManagement />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </MuiProvider>
  );
};

export default AppWrapper;
