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
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { getData } from "../../api/client";
import { logout } from "../../features/auth/authSlice";

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);


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

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleNotificationClick = () => navigate("/appointments");

  const toggleSidebar = () => dispatch({ type: "ui/toggleSidebar" });

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: "linear-gradient(90deg, #3949ab 0%, #1e88e5 100%)",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          paddingBottom: "6px", // 🔽 Added gutter bottom
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            minHeight: "70px", // 🔽 Slightly taller for breathing room
            px: 2,
          }}
        >
          {/* Left Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton color="inherit" edge="start" onClick={toggleSidebar}>
              <MenuIcon />
            </IconButton>

            <img
              src="/logo192.png"
              alt="logo"
              width="38"
              height="38"
              style={{ borderRadius: "50%" }}
            />
            <Link
              to="/"
              style={{
                color: "white",
                textDecoration: "none",
                fontWeight: "bold",
                fontSize: 18,
                letterSpacing: 0.5,
              }}
            >
              HealthTool
            </Link>
          </Box>
          {/* Right Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton color="inherit" onClick={handleNotificationClick}>
              <Badge badgeContent={pendingCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {user ? (
              <div className="dropdown">
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<AccountCircle />}
                  data-bs-toggle="dropdown"
                  sx={{
                    textTransform: "none",
                    borderRadius: 3,
                    background: "#fff",
                    color: "#1976d2",
                    "&:hover": { background: "#e6e6e6" },
                  }}
                >
                  {user.name}
                </Button>

                <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/appointments">
                      Appointments
                    </Link>
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Button
                  color="inherit"
                  onClick={() => navigate("/login")}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    border: "1px solid white",
                    "&:hover": { background: "rgba(255,255,255,0.1)" },
                  }}
                >
                  Login
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate("/register")}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    background: "white",
                    color: "#1976d2",
                    "&:hover": { background: "#f2f2f2" },
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* ✅ Adds space below Navbar to prevent overlap */}
      <Box sx={{ mt: "70px" }} />
    </>
  );
}
