// src/components/Layout/Sidebar.js
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

import DashboardIcon from "@mui/icons-material/Dashboard";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PeopleIcon from "@mui/icons-material/People";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PaymentIcon from "@mui/icons-material/Payment";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Managestaff from "@mui/icons-material/ManageAccounts";
import Inventory from "@mui/icons-material/Inventory2";
import LogoutOutlined from "@ant-design/icons/LogoutOutlined";
import UserOutlined from "@ant-design/icons/UserOutlined";

export default function Sidebar() {
  const collapsed = useSelector((s) => s.ui?.sidebarCollapsed);
  const auth = useSelector((s) => s.auth || {});
  const user = auth.user || { role: "admin" };
  const dispatch = useDispatch();
  const [settingsExpanded, setSettingsExpanded] = useState(false);

  const toggleSidebar = () => dispatch({ type: "ui/toggleSidebar" });
  const handleLogout = () => dispatch({ type: "auth/logout" });

  const baseItems = [{ text: "Dashboard", icon: <DashboardIcon />, link: "/dashboard" }];

  const menuByRole = {
    admin: [
      ...baseItems,
      { text: "Calendar", icon: <CalendarMonthIcon />, link: "/calendar" },
      { text: "Patients", icon: <PeopleIcon />, link: "/patients" },
      { text: "Appointments", icon: <EventAvailableIcon />, link: "/appointments" },
      { text: "Doctors", icon: <LocalHospitalIcon />, link: "/doctors" },
      { text: "Prescriptions", icon: <ReceiptLongIcon />, link: "/prescriptions" },
      { text: "Billing", icon: <PaymentIcon />, link: "/billing" },
      { text: "Payment Gateway", icon: <PaymentIcon />, link: "/payment" },
      { text: "Manage Staffs", icon: <Managestaff />, link: "/staff" },
      { text: "Inventory", icon: <Inventory />, link: "/inventory" },
    ],
    doctor: [
      ...baseItems,
      { text: "My Appointments", icon: <EventAvailableIcon />, link: "/appointments" },
      { text: "My Patients", icon: <PeopleIcon />, link: "/patients" },
      { text: "Prescriptions", icon: <ReceiptLongIcon />, link: "/prescriptions" },
      { text: "Billing", icon: <PaymentIcon />, link: "/billing" },
      { text: "Inventory", icon: <Inventory />, link: "/inventory" },
    ],
    patient: [
      { text: "My Appointments", icon: <EventAvailableIcon />, link: "/appointments" },
      { text: "My Prescriptions", icon: <ReceiptLongIcon />, link: "/prescriptions" },
      { text: "My Bills", icon: <PaymentIcon />, link: "/billing" },
    ],
    nurse: [
      ...baseItems,
      { text: "Patients", icon: <PeopleIcon />, link: "/patients" },
      { text: "Appointments", icon: <EventAvailableIcon />, link: "/appointments" },
      { text: "Prescriptions", icon: <ReceiptLongIcon />, link: "/prescriptions" },
      { text: "Inventory", icon: <Inventory />, link: "/inventory" },
    ],
  };

  const menuItems = menuByRole[user.role] || baseItems;

  return (
    <Drawer
      variant="persistent"
      open={!collapsed}
      anchor="left"
      sx={{
        width: collapsed ? 0 : 240,
        "& .MuiDrawer-paper": {
          width: 240,
          top: "64px",
          background: "#f7f9fc",
          borderRight: "1px solid #ddd",
          transition: "all 0.3s ease",
          overflowY: "auto",
          maxHeight: "calc(100vh - 70px)",
        },
      }}
    >
      {/* Top Title */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          py: 1.5,
          background: "#1976d2",
          color: "white",
          fontWeight: 600,
        }}
      >
        Menu
        <Box sx={{ cursor: "pointer" }} onClick={toggleSidebar}>
          {collapsed ? <MenuIcon /> : <MenuOpenIcon />}
        </Box>
      </Box>

      <Divider />

      <List sx={{ mt: 1 }}>
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
              <ListItemIcon sx={{ color: "#1976d2" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}

        {/* Settings Section */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => setSettingsExpanded(!settingsExpanded)}>
            <ListItemIcon sx={{ color: "#1976d2" }}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
            {settingsExpanded ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>

        {/* Settings dropdown */}
        <Collapse in={settingsExpanded} timeout="auto" unmountOnExit>
          <List sx={{ pl: 4 }}>
            <ListItemButton component={NavLink} to="/settings">
              <ListItemIcon sx={{ color: "#1976d2" }}>
                <UserOutlined />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon sx={{ color: "#d32f2f" }}>
                <LogoutOutlined />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </Drawer>
  );
}
