// src/components/Auth/LoginPage.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import { Lock as LockIcon, Email as EmailIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { loginStart } from "../../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((s) => s.auth || {});

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    role: "admin",
  });

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const roles = [
    { value: "admin", label: "Admin" },
    { value: "doctor", label: "Doctor" },
    { value: "nurse", label: "Nurse"},
    { value: "pharmacist", label: "Pharmacist"},
    { value: "receptionist", label: "Receptionist" },
    { value: "patient", label: "Patient"},
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginStart(loginForm));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#F6FAFF,#EEF2FF)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Grid
        container
        spacing={3}
        sx={{
          width: "70%",
          maxWidth: 900,
          alignItems: "stretch",
        }}
      >
        {/* LEFT SECTION - DEMO INFO */}
        <Grid
          item
          xs={12}
          md={5}
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Paper
            elevation={1}
            sx={{
              p: 4,
              width: "100%",
              borderRadius: 3,
              bgcolor: "white",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: "#1976d2",
                  mx: "auto",
                  mb: 2,
                }}
              >
                <LockIcon sx={{ fontSize: 40 }} />
              </Avatar>

              <Typography variant="h5" fontWeight={300} sx={{ mb: 1 }}>
                Welcome to HealthTool
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "#F9FBFF",
                  border: "1px solid rgba(25,118,210,0.15)",
                  textAlign: "left",
                }}
              >
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                  Demo Credentials
                </Typography>

                <Typography variant="body2"><strong>Admin:</strong> admin@hospital.com / admin123</Typography>
                <Typography variant="body2"><strong>Doctor:</strong> asha.r@gmail.com / Asha@2024</Typography>
                <Typography variant="body2"><strong>Nurse:</strong> priya.raj@gmail.com / nurse123</Typography>
                <Typography variant="body2"><strong>Pharmacist:</strong> sameer.pharma@example.com / pharma123</Typography>
                <Typography variant="body2"><strong>Receptionist:</strong> riya.sharma@example.com / recep123</Typography>
                <Typography variant="body2"><strong>Patient:</strong> aarav.kumar@gmail.com / Aarav@2024</Typography>
              </Paper>
            </Box>
          </Paper>
        </Grid> 

        {/* RIGHT SECTION - LOGIN FORM */}
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: "#1976d2",
                    mx: "auto",
                    mb: 1,
                  }}
                >
                  <LockIcon />
                </Avatar>

                <Typography variant="h5" fontWeight={700}>
                  Sign In
                </Typography>

                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Enter your role & credentials
                </Typography>
              </Box>

              <Box
                component="form"
                onSubmit={handleLogin}
                sx={{ display: "grid", gap: 2 }}
              >
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={loginForm.role}
                    label="Role"
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, role: e.target.value })
                    }
                  >
                    {roles.map((r) => (
                      <MenuItem key={r.value} value={r.value}>
                        {r.icon} &nbsp; {r.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Email"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                  InputProps={{
                    startAdornment: (
                      <EmailIcon
                        sx={{ mr: 1, color: "rgba(0,0,0,0.45)" }}
                      />
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                />

                {error && <Alert severity="error">{error}</Alert>}

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    py: 1.3,
                    mt: 1,
                    fontWeight: 600,
                    borderRadius: 2,
                    background: "linear-gradient(90deg,#1976d2,#1e88e5)",
                  }}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "flex-start",  // LEFT SIDE
                    alignItems: "center",
                    gap: 0,                      // small space between them
                  }}
                >
                  <Typography variant="body2">New user?</Typography>

                  <Link to="/register" style={{ textDecoration: "none" }}>
                    <Button size="small">Create Account</Button>
                  </Link>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
