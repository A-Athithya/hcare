import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  Button,
  Form,
  Input,
  Modal,
  message,
  Avatar,
  Typography,
  Space,
  Divider,
} from "antd";
import { UserOutlined, LockOutlined, LogoutOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function SettingsPage() {
  const dispatch = useDispatch();
  const auth = useSelector((s) => s.auth || {});
  const user = auth.user || { name: "Admin User", email: "admin@hospital.com", role: "admin" };

  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const handleProfileUpdate = (values) => {
    // Simulate profile update
    message.success("Profile updated successfully!");
    setProfileModalVisible(false);
    profileForm.resetFields();
  };

  const handlePasswordChange = (values) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error("New passwords do not match!");
      return;
    }
    // Simulate password change
    message.success("Password changed successfully!");
    setPasswordModalVisible(false);
    passwordForm.resetFields();
  };

  const handleLogout = () => {
    dispatch({ type: "auth/logout" });
    message.success("Logged out successfully!");
  };

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <Title level={2}>Settings</Title>

      <Card style={{ marginBottom: 24 }}>
        <Space align="center" style={{ marginBottom: 16 }}>
          <Avatar size={64} icon={<UserOutlined />} />
          <div>
            <Title level={4} style={{ margin: 0 }}>
              {user.name}
            </Title>
            <Text type="secondary">{user.email}</Text>
            <br />
            <Text type="secondary" style={{ textTransform: "capitalize" }}>
              Role: {user.role}
            </Text>
          </div>
        </Space>
        <Divider />
        <Space direction="vertical" style={{ width: "100%" }}>
          <Button
            type="primary"
            icon={<UserOutlined />}
            onClick={() => setProfileModalVisible(true)}
            block
          >
            Update Profile
          </Button>
          <Button
            icon={<LockOutlined />}
            onClick={() => setPasswordModalVisible(true)}
            block
          >
            Change Password
          </Button>
          <Button
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            block
          >
            Logout
          </Button>
        </Space>
      </Card>

      {/* Profile Update Modal */}
      <Modal
        title="Update Profile"
        open={profileModalVisible}
        onCancel={() => setProfileModalVisible(false)}
        footer={null}
      >
        <Form
          form={profileForm}
          layout="vertical"
          onFinish={handleProfileUpdate}
          initialValues={{
            name: user.name,
            email: user.email,
          }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
              <Button onClick={() => setProfileModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Password Change Modal */}
      <Modal
        title="Change Password"
        open={passwordModalVisible}
        onCancel={() => setPasswordModalVisible(false)}
        footer={null}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordChange}
        >
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[{ required: true, message: "Please enter your current password" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: "Please enter a new password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            rules={[
              { required: true, message: "Please confirm your new password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Change Password
              </Button>
              <Button onClick={() => setPasswordModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
