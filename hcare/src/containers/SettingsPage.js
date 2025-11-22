import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProfileStart } from "../features/profile/profileSlice";
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
import {
  UserOutlined,
  LockOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import moment from "moment";

const { Title, Text } = Typography;
const { Option } = Select;

export default function SettingsPage() {
  const dispatch = useDispatch();
  const auth = useSelector((s) => s.auth || {});
  const profile = useSelector((s) => s.profile || {});
  const user = profile.data || auth.user;

  const [currentView, setCurrentView] = useState("profile");
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  const [updateProfileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  useEffect(() => {
    if (auth.user?.id && auth.user?.role && auth.user?.email) {
      dispatch(fetchProfileStart({ id: auth.user.id, role: auth.user.role, email: auth.user.email }));
    }
  }, [auth.user, dispatch]);

  if (!user) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <Title level={2}>Please log in to view your profile</Title>
      </div>
    );
  }

  const handleProfileUpdate = (values) => {
    message.success("Profile updated successfully!");
    setCurrentView("profile");
  };

  const handlePasswordChange = (values) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error("New passwords do not match!");
      return;
    }

    message.success("Password changed successfully!");
    setPasswordModalVisible(false);
    passwordForm.resetFields();
  };

  if (currentView === "updateProfile") {
    return (
      <div style={{ padding: 24 }}>
        <Title level={2}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => setCurrentView("profile")}
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
              phone: user.phone || user.contact,
              address: user.address,
              dateOfBirth: user.dateOfBirth ? moment(user.dateOfBirth) : null,
              gender: user.gender,
              department: user.department,
              specialization: user.specialization,
              experience: user.experience,
              qualification: user.qualification,
              bloodGroup: user.bloodGroup,
              medicalHistory: user.medicalHistory,
              allergies: user.allergies,
              emergencyContact: user.emergencyContact,
              licenseNo: user.licenseNo,
              shift: user.shift,
              registeredDate: user.registeredDate ? moment(user.registeredDate) : null,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true },
                  { type: "email", message: "Invalid email" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                <Input />
              </Form.Item>

              <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true }]}
              >
                <Input.TextArea rows={2} />
              </Form.Item>

              {user.role === "patient" && (
                <>
                  <Form.Item
                    name="bloodGroup"
                    label="Blood Group"
                    rules={[{ required: true }]}
                  >
                    <Select>
                      <Option value="A+">A+</Option>
                      <Option value="A-">A-</Option>
                      <Option value="B+">B+</Option>
                      <Option value="B-">B-</Option>
                      <Option value="AB+">AB+</Option>
                      <Option value="AB-">AB-</Option>
                      <Option value="O+">O+</Option>
                      <Option value="O-">O-</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item name="medicalHistory" label="Medical History">
                    <Input.TextArea rows={2} />
                  </Form.Item>

                  <Form.Item name="allergies" label="Allergies">
                    <Input.TextArea rows={2} />
                  </Form.Item>

                  <Form.Item
                    name="emergencyContact"
                    label="Emergency Contact"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </>
              )}

              {(user.role === "nurse" ||
                user.role === "pharmacist" ||
                user.role === "receptionist") && (
                <>
                  <Form.Item
                    name="licenseNo"
                    label="License Number"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="experience"
                    label="Experience"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="shift"
                    label="Shift"
                    rules={[{ required: true }]}
                  >
                    <Select>
                      <Option value="Morning">Morning</Option>
                      <Option value="Evening">Evening</Option>
                      <Option value="Night">Night</Option>
                    </Select>
                  </Form.Item>
                </>
              )}

              <Form.Item
                name="dateOfBirth"
                label="Date of Birth"
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                name="gender"
                label="Gender"
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="Male">Male</Option>
                  <Option value="Female">Female</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="department"
                label="Department"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="specialization"
                label="Specialization"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="experience"
                label="Experience"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="qualification"
                label="Qualification"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </div>

            <Form.Item style={{ textAlign: "right", marginTop: 24 }}>
              <Space>
                <Button onClick={() => setCurrentView("profile")}>Cancel</Button>
                <Button type="primary" htmlType="submit">Update Profile</Button>
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

        <Title level={5}>Profile Details</Title>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <Text strong>Phone: </Text> {user.phone || user.contact}
          </div>
          <div>
            <Text strong>Address: </Text> {user.address}
          </div>
          <div>
            <Text strong>Date of Birth: </Text> {user.dateOfBirth ? moment(user.dateOfBirth).format("YYYY-MM-DD") : ""}
          </div>
          <div>
            <Text strong>Gender: </Text> {user.gender}
          </div>

          {user.role === "doctor" && (
            <>
              <div><Text strong>Department: </Text> {user.department}</div>
              <div><Text strong>Specialization: </Text> {user.specialization}</div>
              <div><Text strong>Experience: </Text> {user.experience}</div>
              <div><Text strong>Qualification: </Text> {user.qualification}</div>
              <div><Text strong>License Number: </Text> {user.licenseNo}</div>
              <div><Text strong>Consultation Fee: </Text> ₹{user.consultationFee}</div>
            </>
          )}

          {user.role === "patient" && (
            <>
              <div><Text strong>Blood Group: </Text> {user.bloodGroup}</div>
              <div><Text strong>Medical History: </Text> {user.medicalHistory}</div>
              <div><Text strong>Allergies: </Text> {user.allergies}</div>
              <div><Text strong>Emergency Contact: </Text> {user.emergencyContact}</div>
              <div><Text strong>Registered Date: </Text> {user.registeredDate ? moment(user.registeredDate).format("YYYY-MM-DD") : ""}</div>
            </>
          )}

          {(user.role === "nurse" || user.role === "pharmacist" || user.role === "receptionist") && (
            <>
              <div><Text strong>License Number: </Text> {user.licenseNo}</div>
              <div><Text strong>Experience: </Text> {user.experience}</div>
              <div><Text strong>Shift: </Text> {user.shift}</div>
            </>
          )}
        </div>

        <Divider />

        <div style={{ textAlign: "right" }}>
          <Space>
            <Button icon={<LockOutlined />} onClick={() => setPasswordModalVisible(true)}>
              Change Password
            </Button>

            <Button type="primary" icon={<UserOutlined />} onClick={() => setCurrentView("updateProfile")}>
              Update Profile
            </Button>
          </Space>
        </div>
      </Card>

      <Modal
        title="Change Password"
        open={passwordModalVisible}
        onCancel={() => setPasswordModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" form={passwordForm} onFinish={handlePasswordChange}>
          <Form.Item name="currentPassword" label="Current Password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item name="newPassword" label="New Password" rules={[{ required: true }, { min: 6 }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={["newPassword"]}
            rules={[
              { required: true },
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
              <Button onClick={() => setPasswordModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
