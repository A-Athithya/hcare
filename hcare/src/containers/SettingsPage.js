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
  DatePicker,
  Select,
} from "antd";
import { UserOutlined, LockOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import moment from "moment";

const { Title, Text } = Typography;
const { Option } = Select;

export default function SettingsPage() {
  const dispatch = useDispatch();
  const auth = useSelector((s) => s.auth || {});
  const user = auth.user || {
    name: "Admin User",
    email: "admin@hospital.com",
    role: "admin",
    phone: "+91 9876543210",
    address: "123 Hospital Street, Trichy, Tamil Nadu",
    dateOfBirth: "1985-05-15",
    gender: "Male",
    department: "Administration",
    specialization: "Healthcare Management",
    experience: "15 years",
    qualification: "MBA in Healthcare"
  };

  const [currentView, setCurrentView] = useState('profile');
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [updateProfileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const handleProfileUpdate = (values) => {
    // Simulate profile update
    message.success("Profile updated successfully!");
    setCurrentView('profile');
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

  if (currentView === 'updateProfile') {
    return (
      <div style={{ padding: 24 }}>
        <Title level={2}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => setCurrentView('profile')}
            style={{ marginRight: 8 }}
          />
          Update Profile
        </Title>
        <Card>
          <Form
            form={updateProfileForm}
            layout="vertical"
            onFinish={handleProfileUpdate}
            initialValues={{
              name: user.name,
              email: user.email,
              phone: user.phone,
              address: user.address,
              dateOfBirth: user.dateOfBirth ? moment(user.dateOfBirth) : null,
              gender: user.gender,
              department: user.department,
              specialization: user.specialization,
              experience: user.experience,
              qualification: user.qualification,
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
              <Form.Item
                name="phone"
                label="Phone"
                rules={[{ required: true, message: "Please enter your phone number" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true, message: "Please enter your address" }]}
              >
                <Input.TextArea rows={2} />
              </Form.Item>
              <Form.Item
                name="dateOfBirth"
                label="Date of Birth"
                rules={[{ required: true, message: "Please select your date of birth" }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                name="gender"
                label="Gender"
                rules={[{ required: true, message: "Please select your gender" }]}
              >
                <Select placeholder="Select gender">
                  <Option value="Male">Male</Option>
                  <Option value="Female">Female</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="department"
                label="Department"
                rules={[{ required: true, message: "Please enter your department" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="specialization"
                label="Specialization"
                rules={[{ required: true, message: "Please enter your specialization" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="experience"
                label="Experience"
                rules={[{ required: true, message: "Please enter your experience" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="qualification"
                label="Qualification"
                rules={[{ required: true, message: "Please enter your qualification" }]}
              >
                <Input />
              </Form.Item>
            </div>
            <Form.Item style={{ textAlign: 'right', marginTop: 24 }}>
              <Space>
                <Button onClick={() => setCurrentView('profile')}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  Update Profile
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <Title level={2}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => window.history.back()}
          style={{ marginRight: 8 }}
        />
        Profile
      </Title>

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
        <div style={{ marginBottom: 16 }}>
          <Title level={5}>Profile Details</Title>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <Text strong>Phone:</Text> {user.phone || 'Not provided'}
            </div>
            <div>
              <Text strong>Address:</Text> {user.address || 'Not provided'}
            </div>
            <div>
              <Text strong>Date of Birth:</Text> {user.dateOfBirth || 'Not provided'}
            </div>
            <div>
              <Text strong>Gender:</Text> {user.gender || 'Not provided'}
            </div>
            <div>
              <Text strong>Department:</Text> {user.department || 'Not provided'}
            </div>
            <div>
              <Text strong>Specialization:</Text> {user.specialization || 'Not provided'}
            </div>
            <div>
              <Text strong>Experience:</Text> {user.experience || 'Not provided'}
            </div>
            <div>
              <Text strong>Qualification:</Text> {user.qualification || 'Not provided'}
            </div>
          </div>
        </div>
        <Divider />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <Button
            icon={<LockOutlined />}
            onClick={() => setPasswordModalVisible(true)}
          >
            Change Password
          </Button>
          <Button
            type="primary"
            icon={<UserOutlined />}
            onClick={() => setCurrentView('updateProfile')}
          >
            Update Profile
          </Button>
        </div>
      </Card>

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
