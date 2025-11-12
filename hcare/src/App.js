import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import CalendarPage from "./containers/CalendarPage";
import PatientDetailsPage from "./containers/PatientDetailsPage";
import PatientManagementPage from "./containers/PatientManagementPage";
import MuiProvider from "./mui/MaterialDesign";
import { Spin } from "antd";

// Lazy load pages
const HomePage = lazy(() => import("./containers/HomePage"));
const LoginForm = lazy(() => import("./components/Forms/LoginForm"));
const RegisterForm = lazy(() => import("./components/Forms/RegisterForm"));
const Dashboard = lazy(() => import("./containers/Dashboard"));
const DoctorsPage = lazy(() => import("./containers/DoctorsPage"));
const PatientsPage = lazy(() => import("./containers/PatientsPage"));
const AppointmentsPage = lazy(() => import("./containers/AppointmentsPage"));
const PrescriptionsPage = lazy(() => import("./containers/PrescriptionsPage"));
const BillingPage = lazy(() => import("./containers/BillingPage"));
const PaymentPage = lazy(() => import("./containers/PaymentPage"));

// Removed ProtectedRoute - all routes are now public

const AppWrapper = () => {
  // Removed auth persistence logic - no login required

  return (
    <MuiProvider>
      <Layout>
        <Suspense fallback={<div style={{ textAlign: "center", padding: "80px" }}><Spin size="large" /></div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/patients/:id" element={<PatientDetailsPage />} />
             <Route path="/patients" element={<PatientManagementPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/prescriptions" element={<PrescriptionsPage />} />
            <Route path="/billing" element={<BillingPage />} />
            <Route path="/payment" element={<PaymentPage />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </MuiProvider>
  );
};

export default AppWrapper;
