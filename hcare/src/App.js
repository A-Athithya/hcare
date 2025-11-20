// src/App.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import MuiProvider from "./mui/MaterialDesign";
import Layout from "./components/Layout/Layout";
import IdleTimer from "./components/IdleTimer";
import { Spin } from "antd";
import { checkAuthStatus } from "./features/auth/authSlice";

// Direct imports
import CalendarPage from "./containers/CalendarPage";
import PatientDetailsPage from "./containers/PatientDetailsPage";
import PatientFormPage from "./containers/PatientFormPage";

// Auth Pages (NEW)
const LoginPage = lazy(() => import("./components/Auth/LoginPage"));
const RegisterPage = lazy(() => import("./components/Auth/RegisterPage")); // ✅ FIXED

// Lazy pages
const Dashboard = lazy(() => import("./containers/Dashboard"));
const DoctorsPage = lazy(() => import("./containers/DoctorsPage"));
const PatientsPage = lazy(() => import("./containers/PatientsPage"));
const AppointmentsPage = lazy(() => import("./containers/AppointmentsPage"));
const PrescriptionsPage = lazy(() => import("./containers/PrescriptionsPage"));
const BillingPage = lazy(() => import("./containers/BillingPage"));
const PaymentPage = lazy(() => import("./containers/PaymentPage"));
const SettingsPage = lazy(() => import("./containers/SettingsPage"));
const StaffManagement = lazy(() =>
  import("./components/admin/StaffsManagement")
);
const InventoryManagement = lazy(() =>
  import("./components/admin/InventoryManagement")
);
const CommunicationPage = lazy(()=> import("./components/communication/CommunicationPage"));
const AllCommunicationsPage = lazy(()=> import("./components/communication/AllCommunicationsPage"));
const DoctorCommunications = lazy(()=> import("./components/communication/DoctorCommunications"));

// -------------------------------------------
// PROTECTED ROUTE
// -------------------------------------------
const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((s) => s.auth);

  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// -------------------------------------------
// MAIN APP
// -------------------------------------------
export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check authentication status on app load
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
    <MuiProvider>
      <IdleTimer />
      <Suspense
        fallback={
          <div style={{ textAlign: "center", padding: "80px" }}>
            <Spin size="large" />
          </div>
        }
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} /> {/* ✅ FIXED */}

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Doctors */}
          <Route
            path="/doctors"
            element={
              <ProtectedRoute>
                <Layout>
                  <DoctorsPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Patients List */}
          <Route
            path="/patients"
            element={
              <ProtectedRoute>
                <Layout>
                  <PatientsPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Patient Details */}
          <Route
            path="/patients/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <PatientDetailsPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Add / Edit Patients */}
          <Route
            path="/patient/add"
            element={
              <ProtectedRoute>
                <Layout>
                  <PatientFormPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/patient/edit/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <PatientFormPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Appointments */}
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <Layout>
                  <AppointmentsPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Calendar */}
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <Layout>
                  <CalendarPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Prescriptions */}
          <Route
            path="/prescriptions"
            element={
              <ProtectedRoute>
                <Layout>
                  <PrescriptionsPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Billing */}
          <Route
            path="/billing"
            element={
              <ProtectedRoute>
                <Layout>
                  <BillingPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Payment */}
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Layout>
                  <PaymentPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Settings */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout>
                  <SettingsPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Staff */}
          <Route
            path="/staff"
            element={
              <ProtectedRoute>
                <Layout>
                  <StaffManagement />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Inventory */}
          <Route
            path="/inventory"
            element={
              <ProtectedRoute>
                <Layout>
                  <InventoryManagement />
                </Layout>
              </ProtectedRoute>
            }
          />

           {/* Communication */}
          <Route
            path="/communicationpage"
            element={
              <ProtectedRoute>
                <Layout>
                  <CommunicationPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/all-communications"
            element={
              <ProtectedRoute>
                <Layout>
                  <AllCommunicationsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor-communications"
            element={
              <ProtectedRoute>
                <Layout>
                  <DoctorCommunications />
                </Layout>
              </ProtectedRoute>
            }
          />
          

          {/* Default fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </MuiProvider>
  );
}
