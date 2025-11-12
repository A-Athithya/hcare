import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

export default function Sidebar() {
  const collapsed = useSelector((s) => s.ui?.sidebarCollapsed);
  const dispatch = useDispatch();

  // State to show/hide admin links
  const [showAdminLinks, setShowAdminLinks] = useState(false);

  return (
    <aside
      className={collapsed ? "sidebar-collapsed bg-light sidebar" : "sidebar-expanded bg-white sidebar"}
      style={{ padding: 16, minHeight: "100vh" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h5 style={{ margin: 0 }}>Menu</h5>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => dispatch({ type: "ui/toggleSidebar" })}
        >
          Toggle
        </button>
      </div>

      <nav style={{ marginTop: 16 }}>
        <ul className="list-unstyled" style={{ paddingLeft: 0 }}>
          {/* Main Menu */}
          <li className="mb-2">
            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "fw-bold" : "")}>
              Dashboard
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink to="/patients" className={({ isActive }) => (isActive ? "fw-bold" : "")}>
              Patients
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink to="/appointments" className={({ isActive }) => (isActive ? "fw-bold" : "")}>
              Appointments
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink to="/doctors" className={({ isActive }) => (isActive ? "fw-bold" : "")}>
              Doctors
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink to="/prescriptions" className={({ isActive }) => (isActive ? "fw-bold" : "")}>
              Prescriptions
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink to="/billing" className={({ isActive }) => (isActive ? "fw-bold" : "")}>
              Billing & Payments
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink to="/payment" className={({ isActive }) => (isActive ? "fw-bold" : "")}>
              Payment Gateway
            </NavLink>
          </li>

          {/* Profile */}
          <li className="mt-3">
            <NavLink to="/profile" className={({ isActive }) => (isActive ? "fw-bold" : "")}>
              Profile & Settings
            </NavLink>
          </li>

          {/* Admin toggle button */}
          <li className="mt-3">
            <button
              className="btn btn-link p-0 text-start w-100"
              style={{ textDecoration: "none", color: "#000", fontWeight: "normal" }}
              onClick={() => setShowAdminLinks(!showAdminLinks)}
            >
              Admin 
            </button>
          </li>

          {/* Admin child links */}
          {showAdminLinks && (
            <>
              <li>
                <NavLink
                  to="/staff"
                  className={({ isActive }) => (isActive ? "fw-bold" : "")}
                  style={{ paddingLeft: 16, display: "block" }}
                >
                  Staff Management
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/inventory"
                  className={({ isActive }) => (isActive ? "fw-bold" : "")}
                  style={{ paddingLeft: 16, display: "block" }}
                >
                  Inventory Management
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </aside>
  );
}
