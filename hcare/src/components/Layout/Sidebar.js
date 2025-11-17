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
import UserOutlined from "@ant-design/icons/UserOutlined";
import LogoutOutlined from "@ant-design/icons/LogoutOutlined";
import Managestaff from "@mui/icons-material/ManageAccounts";
import Inventory from "@mui/icons-material/Inventory2";

export default function Sidebar() {
  const collapsed = useSelector((s) => s.ui?.sidebarCollapsed);
  const auth = useSelector((s) => s.auth || {});
  const user = auth.user || { name: "Admin User", email: "admin@hospital.com", role: "admin" };
  const dispatch = useDispatch();

  const toggleSidebar = () => dispatch({ type: "ui/toggleSidebar" });

  const [settingsExpanded, setSettingsExpanded] = useState(false);

  const handleLogout = () => {
    dispatch({ type: "auth/logout" });
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
    { text: "Manage Staffs", icon: <Managestaff />, link: "/staff" },
    { text: "Inventory", icon: <Inventory />, link: "/inventory" },
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
            top: "70px",
            backgroundColor: "#f7f9fc",
            borderRight: "1px solid #ddd",
            transition: "all 0.3s ease-in-out",
            overflowY: "auto",
            maxHeight: "calc(100vh - 70px)",
          },
        }}
      >
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
                  borderLeft: isActive
                    ? "4px solid #1976d2"
                    : "4px solid transparent",
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
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}

          {/* Settings Section */}
          <ListItem disablePadding>
            <ListItemButton onClick={() => setSettingsExpanded(!settingsExpanded)}>
              <ListItemIcon sx={{ color: "#1976d2", minWidth: 40 }}>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText
                primary="Settings"
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: 14.5,
                }}
              />
              {settingsExpanded ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>

          <Collapse in={settingsExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }} component={NavLink} to="/settings">
                <ListItemIcon sx={{ color: "#1976d2", minWidth: 40 }}>
                  <UserOutlined />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItemButton>

              <ListItemButton sx={{ pl: 4 }} onClick={handleLogout}>
                <ListItemIcon sx={{ color: "#1976d2", minWidth: 40 }}>
                  <LogoutOutlined />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
      </Drawer>
    </>
  );
}
