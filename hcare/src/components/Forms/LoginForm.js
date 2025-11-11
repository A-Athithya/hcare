import React, { useEffect } from "react";
import { Card } from "antd";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard since login is not required
    navigate("/dashboard");
  }, [navigate]);

  return (
    <Card title="Login Disabled" style={{ maxWidth: 420, margin: "50px auto" }}>
      <p>Login functionality has been removed. You can access all features directly.</p>
      <p>Redirecting to dashboard...</p>
    </Card>
  );
}
