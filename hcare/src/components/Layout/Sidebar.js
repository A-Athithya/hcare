import React from "react";
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
import Managestaff from "@mui/icons-material/ManageAccounts"; // Staff Management
import Inventory from "@mui/icons-material/Inventory2"; 


export default function Sidebar() {
  const collapsed = useSelector((s) => s.ui?.sidebarCollapsed);
  const dispatch = useDispatch();
  const toggleSidebar = () => dispatch({ type: "ui/toggleSidebar" });

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, link: "/dashboard" },
    { text: "Calendar", icon: <CalendarMonthIcon />, link: "/calendar" },
    { text: "Patients", icon: <PeopleIcon />, link: "/patients" },
    { text: "Appointments", icon: <EventAvailableIcon />, link: "/appointments" },
    { text: "Doctors", icon: <LocalHospitalIcon />, link: "/doctors" },
    { text: "Prescriptions", icon: <ReceiptLongIcon />, link: "/prescriptions" },
    { text: "Billing", icon: <PaymentIcon />, link: "/billing" },
    { text: "Payment Gateway", icon: <PaymentIcon />, link: "/payment" },
    { text: "Settings", icon: <SettingsIcon />, link: "/settings" },
    { text: "Manage Staffs", icon: <Managestaff/>, link: "/staff" },
    { text: "Inventory", icon: <Inventory/>, link: "/inventory" },
  ];

  const settingsItem = { text: "Settings", icon: <SettingsIcon />, link: "/settings" };

  return (
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
              <ListItemIcon sx={{ color: "#1976d2", minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: 14.5,
                  color: "text.primary",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Settings button at bottom */}
      <Box sx={{ mt: "auto", mb: 2 }}>
        <Divider sx={{ mb: 1 }} />
        <ListItem disablePadding>
          <ListItemButton
            component={NavLink}
            to={settingsItem.link}
            style={({ isActive }) => ({
              backgroundColor: isActive ? "#e3f2fd" : "transparent",
              borderLeft: isActive ? "4px solid #1976d2" : "4px solid transparent",
            })}
          >
            <ListItemIcon sx={{ color: "#1976d2", minWidth: 40 }}>
              {settingsItem.icon}
            </ListItemIcon>
            <ListItemText
              primary={settingsItem.text}
              primaryTypographyProps={{
                fontWeight: 500,
                fontSize: 14.5,
                color: "text.primary",
              }}
            />
          </ListItemButton>
        </ListItem>
      </Box>
    </Drawer>
  );
}
