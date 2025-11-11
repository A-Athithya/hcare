import React from "react";
import { Form, Input, Button, Card, Tabs } from "antd";
import { useDispatch, useSelector } from "react-redux";

export default function RegisterForm() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.auth);

  const onGeneralRegister = (vals) =>
    dispatch({ type: "auth/registerStart", payload: { ...vals, role: "user" } });

  const onDoctorRegister = (vals) =>
    dispatch({ type: "auth/registerStart", payload: { ...vals, role: "doctor" } });

  return (
    <Card title="Register" style={{ maxWidth: 700, margin: "50px auto" }}>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="General User" key="1">
          <Form layout="vertical" onFinish={onGeneralRegister}>
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
              <Input />
            </Form.Item>
            <Form.Item name="password" label="Password" rules={[{ required: true }]}>
              <Input.Password />
            </Form.Item>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <Button type="primary" htmlType="submit" loading={loading}>
              Register
            </Button>
          </Form>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Doctor Registration" key="2">
          <Form layout="vertical" onFinish={onDoctorRegister}>
            <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
              <Input />
            </Form.Item>
            <Form.Item name="password" label="Password" rules={[{ required: true }]}>
              <Input.Password />
            </Form.Item>
            <Form.Item name="specialization" label="Specialization">
              <Input />
            </Form.Item>
            <Form.Item name="qualification" label="Qualification">
              <Input />
            </Form.Item>
            <Form.Item name="experience" label="Experience (Years)">
              <Input />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Register as Doctor
            </Button>
          </Form>
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
}
