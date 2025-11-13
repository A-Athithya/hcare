import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  Collapse,
} from "@mui/material";
import {
  Card,
  Button,
  Form,
  Input,
  Modal,
  message,
  Space,
  DatePicker,
} from "antd";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PeopleIcon from "@mui/icons-material/People";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PaymentIcon from "@mui/icons-material/Payment";
import UserOutlined from "@ant-design/icons/UserOutlined";
import LockOutlined from "@ant-design/icons/LockOutlined";
import LogoutOutlined from "@ant-design/icons/LogoutOutlined";

import SettingsIcon from "@mui/icons-material/Settings";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

export default function Sidebar() {
  const collapsed = useSelector((s) => s.ui?.sidebarCollapsed);
  const auth = useSelector((s) => s.auth || {});
  const user = auth.user || { name: "Admin User", email: "admin@hospital.com", role: "admin" };
  const dispatch = useDispatch();
  const toggleSidebar = () => dispatch({ type: "ui/toggleSidebar" });

  const [settingsExpanded, setSettingsExpanded] = useState(false);
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

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, link: "/dashboard" },
    { text: "Calendar", icon: <CalendarMonthIcon />, link: "/calendar" },
    { text: "Patients", icon: <PeopleIcon />, link: "/patients" },
    { text: "Appointments", icon: <EventAvailableIcon />, link: "/appointments" },
    { text: "Doctors", icon: <LocalHospitalIcon />, link: "/doctors" },
    { text: "Prescriptions", icon: <ReceiptLongIcon />, link: "/prescriptions" },
    { text: "Billing", icon: <PaymentIcon />, link: "/billing" },
    { text: "Payment Gateway", icon: <PaymentIcon />, link: "/payment" },
  ];

  return (
    <>
    <Drawer
      variant="persistent"
      open={!collapsed}
      anchor="left"
      sx={{
        width: collapsed ? 0 : 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          top: "70px", // 🔽 slightly below navbar (with gutter)
          backgroundColor: "#f7f9fc",
          borderRight: "1px solid #ddd",
          transition: "all 0.3s ease-in-out",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          py: 1.5,
          background: "#1976d2",
          color: "white",
        }}
      >
        <Box sx={{ fontWeight: 600 }}>Menu</Box>
        <Box
          sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
          onClick={toggleSidebar}
        >
          {collapsed ? <MenuIcon /> : <MenuOpenIcon />}
        </Box>
      </Box>

      <Divider />

      <List sx={{ mt: 1, maxHeight: 'calc(100vh - 140px)', overflowY: 'auto' }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.link}
              style={({ isActive }) => ({
                backgroundColor: isActive ? "#e3f2fd" : "transparent",
                borderLeft: isActive ? "4px solid #1976d2" : "4px solid transparent",
              })}
            >
              <ListItemIcon sx={{ color: "#1976d2", minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: 14,
                  color: "text.primary",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}

        {/* Settings expandable */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => setSettingsExpanded(!settingsExpanded)}>
            <ListItemIcon sx={{ color: "#1976d2", minWidth: 40 }}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText
              primary="Settings"
              primaryTypographyProps={{
                fontWeight: 500,
                fontSize: 14,
                color: "text.primary",
              }}
            />
            {settingsExpanded ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={settingsExpanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 6 }} onClick={() => setProfileModalVisible(true)}>
              <ListItemIcon sx={{ color: "#1976d2", minWidth: 30 }}>
                <UserOutlined />
              </ListItemIcon>
              <ListItemText
                primary="Update Profile"
                primaryTypographyProps={{
                  fontSize: 13,
                }}
              />
            </ListItemButton>
            <ListItemButton sx={{ pl: 6 }} onClick={() => setPasswordModalVisible(true)}>
              <ListItemIcon sx={{ color: "#1976d2", minWidth: 30 }}>
                <LockOutlined />
              </ListItemIcon>
              <ListItemText
                primary="Change Password"
                primaryTypographyProps={{
                  fontSize: 13,
                }}
              />
            </ListItemButton>
            <ListItemButton sx={{ pl: 6 }} onClick={handleLogout}>
              <ListItemIcon sx={{ color: "#1976d2", minWidth: 30 }}>
                <LogoutOutlined />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  fontSize: 13,
                }}
              />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </Drawer>

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
          phone: user.phone || "",
          address: user.address || "",
          dateOfBirth: user.dateOfBirth || null,
          gender: user.gender || "",
          department: user.department || "",
          specialization: user.specialization || "",
          experience: user.experience || "",
          qualification: user.qualification || "",
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
        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[{ required: true, message: "Please enter your phone number" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="address"
          label="Address"
          rules={[{ required: true, message: "Please enter your address" }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="dateOfBirth"
          label="Date of Birth"
          rules={[{ required: true, message: "Please select your date of birth" }]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          name="gender"
          label="Gender"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="department"
          label="Department"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="specialization"
          label="Specialization"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="experience"
          label="Experience"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="qualification"
          label="Qualification"
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
    </>
  );
}
