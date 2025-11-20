// src/components/Layout/Navbar.js
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Button,
  Box,
  Typography,
  Divider,
  Paper,
  Popper,
  ClickAwayListener,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import { getData, putData } from "../../api/client";
import { logout } from "../../features/auth/authSlice";

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [pendingCount, setPendingCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);

  // Fetch pending appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getData("/appointments");
        const pending = data.filter((a) => a.status === "Pending").length;
        setPendingCount(pending);
      } catch (err) {
        console.error("Error fetching appointments", err);
      }
    };
    fetchAppointments();
    const interval = setInterval(fetchAppointments, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch unread notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      try {
        const data = await getData("/notifications");
        const unread = data
          .filter(
            (n) =>
              (n.roles.includes(user.role) || n.userIds?.includes(user.id)) &&
              !n.readBy?.includes(user.id)
          )
          .reverse();
        setNotifications(unread);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();
    const timer = setInterval(fetchNotifications, 5000);
    return () => clearInterval(timer);
  }, [user]);

  const handleNotificationClick = (notif) => async () => {
    try {
      await putData(`/notifications/${notif.id}`, {
        ...notif,
        readBy: [...(notif.readBy || []), user.id],
      });
      setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
      navigate(notif.redirect);
    } catch (err) {
      console.error(err);
    }
    setNotifAnchorEl(null);
  };

  const handleNotifOpen = (event) => setNotifAnchorEl(event.currentTarget);
  const handleNotifClose = () => setNotifAnchorEl(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const toggleSidebar = () => dispatch({ type: "ui/toggleSidebar" });

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: "linear-gradient(90deg,#1e88e5,#3949ab)",
          zIndex: (t) => t.zIndex.drawer + 1,
          boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", minHeight: "72px", px: 2 }}>
          {/* LEFT */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton color="inherit" onClick={toggleSidebar}>
              <MenuIcon />
            </IconButton>

            <img src="/logo192.png" alt="logo" width="38" height="38" style={{ borderRadius: "50%" }} />

            <Link to="/dashboard" style={{ color: "white", textDecoration: "none", fontWeight: 700, fontSize: 18 }}>
              HealthTool
            </Link>
          </Box>

          {/* CENTER */}
          <Box sx={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
            <Button
              variant="contained"
              startIcon={<CalendarMonthIcon />}
              onClick={() => navigate("/appointments?create=true")}
              sx={{
                textTransform: "none",
                fontSize: 15,
                px: 3,
                py: 1.2,
                borderRadius: 5,
                background: "linear-gradient(90deg,#42a5f5,#1e88e5)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                "&:hover": { background: "linear-gradient(90deg,#64b5f6,#2196f3)", boxShadow: "0 6px 20px rgba(0,0,0,0.3)" },
              }}
            >
              Book Appointment
            </Button>
          </Box>

          {/* RIGHT */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton color="inherit" onClick={() => navigate("/patient/add")} sx={{ borderRadius: 2, "&:hover": { bgcolor: "rgba(255,255,255,0.25)" } }}>
              <PersonAddAlt1Icon />
            </IconButton>

            {/* Notification Bell */}
            <IconButton color="inherit" onClick={handleNotifOpen} sx={{ borderRadius: 2, "&:hover": { bgcolor: "rgba(255,255,255,0.25)" } }}>
              <Badge badgeContent={notifications.length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {/* Popper Notifications */}
            <Popper open={Boolean(notifAnchorEl)} anchorEl={notifAnchorEl} placement="bottom-end" sx={{ zIndex: 1301 }}>
              <ClickAwayListener onClickAway={handleNotifClose}>
                <Paper sx={{ width: 360, maxHeight: 400, overflowY: "auto", borderRadius: 2, boxShadow: 3 }}>
                  <Typography sx={{ px: 2, py: 1, fontWeight: "bold" }}>Notifications</Typography>
                  <Divider />
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <Box key={n.id} sx={{ p: 1.5, borderBottom: "1px solid #eee", cursor: "pointer" }} onClick={handleNotificationClick(n)}>
                        <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{n.message}</Typography>
                        <Typography sx={{ fontSize: 12, color: "gray" }}>{new Date(n.timestamp).toLocaleString()}</Typography>
                      </Box>
                    ))
                  ) : (
                    <Box sx={{ p: 2, textAlign: "center", color: "gray" }}>No notifications</Box>
                  )}
                </Paper>
              </ClickAwayListener>
            </Popper>

            {/* USER DROPDOWN */}
            {user && (
              <div className="dropdown">
                <Button
                  variant="contained"
                  startIcon={<AccountCircle />}
                  data-bs-toggle="dropdown"
                  sx={{ textTransform: "none", borderRadius: 3, bgcolor: "#fff", color: "#1976d2", "&:hover": { bgcolor: "#f0f0f0" } }}
                >
                  {user.name}
                </Button>
                <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                  <li><Link className="dropdown-item" to="/profile">My Profile</Link></li>
                  <li><Link className="dropdown-item" to="/appointments">Appointments</Link></li>
                  <li><button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button></li>
                </ul>
              </div>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ mt: "75px" }} />
    </>
  );
}
