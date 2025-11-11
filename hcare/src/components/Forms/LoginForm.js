import React from "react";
import { Form, Input, Button, Card } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((s) => s.auth);

  const onFinish = (vals) => dispatch({ type: "auth/loginStart", payload: vals });
  if (user) navigate("/dashboard");

  return (
    <Card title="Login" style={{ maxWidth: 420, margin: "50px auto" }}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <Button type="primary" htmlType="submit" loading={loading} block>
          Login
        </Button>
      </Form>
      <div className="mt-3 text-center">
        <a href="/register">New user? Register here</a>
      </div>
    </Card>
  );
}
