import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { decrypt } from "./utils/cryptoHelper";
import Layout from "./components/Layout/Layout";
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

// Protected route
const ProtectedRoute = ({ children }) => {
  const { user, token } = useSelector((s) => s.auth || {});
  const location = useLocation();
  if (!user || !token) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
};

const AppWrapper = () => {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const stored = localStorage.getItem("auth_data");
    if (stored && !user) {
      try {
        const dec = decrypt(stored);
        if (dec && dec.user) dispatch({ type: "auth/loginSuccess", payload: dec });
      } catch {
        localStorage.removeItem("auth_data");
      }
    }
  }, [dispatch, user]);

  return (
    <MuiProvider>
      <Layout>
        <Suspense fallback={<div style={{ textAlign: "center", padding: "80px" }}><Spin size="large" /></div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />

            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/doctors" element={<ProtectedRoute><DoctorsPage /></ProtectedRoute>} />
            <Route path="/patients" element={<ProtectedRoute><PatientsPage /></ProtectedRoute>} />
            <Route path="/appointments" element={<ProtectedRoute><AppointmentsPage /></ProtectedRoute>} />
            <Route path="/prescriptions" element={<ProtectedRoute><PrescriptionsPage /></ProtectedRoute>} />
            <Route path="/billing" element={<ProtectedRoute><BillingPage /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </MuiProvider>
  );
};

export default AppWrapper;
