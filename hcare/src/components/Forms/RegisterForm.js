import React, { useEffect } from "react";
import { Card } from "antd";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard since registration is not required
    navigate("/dashboard");
  }, [navigate]);

  return (
    <Card title="Registration Disabled" style={{ maxWidth: 700, margin: "50px auto" }}>
      <p>Registration functionality has been removed. You can access all features directly.</p>
      <p>Redirecting to dashboard...</p>
    </Card>
  );
}
