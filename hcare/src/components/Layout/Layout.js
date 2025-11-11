import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "./layout.css";

export default function Layout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
}
