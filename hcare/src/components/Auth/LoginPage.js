import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Avatar,
  Grid,
  Paper,
} from "@mui/material";
import {
  LocalHospital as HospitalIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import { loginStart } from "../../features/auth/authSlice";

const LoginPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    role: "admin",
  });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginStart(loginForm));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // For now, just show a message - registration logic can be implemented later
    alert("Registration functionality will be implemented soon!");
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const roles = [
    { value: "admin", label: "Admin", icon: "🏥" },
    { value: "doctor", label: "Doctor", icon: "👨‍⚕️" },
    { value: "nurse", label: "Nurse", icon: "👩‍⚕️" },
    { value: "pharmacist", label: "Pharmacist", icon: "💊" },
    { value: "receptionist", label: "Receptionist", icon: "📋" },
    { value: "patient", label: "Patient", icon: "👤" },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, var(--primary-blue) 0%, var(--secondary-blue) 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Grid container spacing={0} sx={{ maxWidth: 1200, width: "100%" }}>
        {/* Left Side - Welcome Section */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              p: 4,
              color: "white",
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "rgba(255, 255, 255, 0.2)",
                mb: 3,
              }}
            >
              <HospitalIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
              Healthcare Management System
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, textAlign: "center", mb: 4 }}>
              Streamlining healthcare operations with modern technology
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
              {roles.map((role) => (
                <Paper
                  key={role.value}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    minWidth: 120,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h4" sx={{ mb: 1 }}>
                    {role.icon}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {role.label}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Box>
        </Grid>

        {/* Right Side - Login Form */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: { xs: "auto", md: "100%" },
            }}
          >
            <Card
              className="healthcare-card"
              sx={{
                maxWidth: 450,
                width: "100%",
                mx: 2,
                boxShadow: "var(--shadow-heavy)",
                border: "1px solid var(--gray-200)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ textAlign: "center", mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 60,
                      height: 60,
                      bgcolor: "var(--primary-blue)",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    <LockIcon sx={{ fontSize: 30 }} />
                  </Avatar>
                  <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                    Welcome Back
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sign in to access your healthcare dashboard
                  </Typography>
                </Box>

                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  sx={{
                    mb: 3,
                    "& .MuiTabs-indicator": {
                      backgroundColor: "var(--primary-blue)",
                    },
                    "& .MuiTab-root": {
                      color: "var(--gray-600)",
                      "&.Mui-selected": {
                        color: "var(--primary-blue)",
                        fontWeight: "bold",
                      },
                    },
                  }}
                >
                  <Tab label="Login" />
                  <Tab label="Register" />
                </Tabs>

                {tabValue === 0 && (
                  <Box component="form" onSubmit={handleLogin}>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel sx={{ color: "var(--gray-600)" }}>Select Role</InputLabel>
                      <Select
                        value={loginForm.role}
                        label="Select Role"
                        onChange={(e) =>
                          setLoginForm({ ...loginForm, role: e.target.value })
                        }
                        sx={{
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "var(--gray-300)",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "var(--primary-blue)",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "var(--primary-blue)",
                          },
                        }}
                      >
                        {roles.map((role) => (
                          <MenuItem key={role.value} value={role.value}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <span>{role.icon}</span>
                              <span>{role.label}</span>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={loginForm.email}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, email: e.target.value })
                      }
                      sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "var(--gray-300)",
                          },
                          "&:hover fieldset": {
                            borderColor: "var(--primary-blue)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "var(--primary-blue)",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "var(--gray-600)",
                          "&.Mui-focused": {
                            color: "var(--primary-blue)",
                          },
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <EmailIcon sx={{ color: "var(--gray-400)", mr: 1 }} />
                        ),
                      }}
                      required
                    />

                    <TextField
                      fullWidth
                      label="Password"
                      type="password"
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, password: e.target.value })
                      }
                      sx={{
                        mb: 3,
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "var(--gray-300)",
                          },
                          "&:hover fieldset": {
                            borderColor: "var(--primary-blue)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "var(--primary-blue)",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "var(--gray-600)",
                          "&.Mui-focused": {
                            color: "var(--primary-blue)",
                          },
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <LockIcon sx={{ color: "var(--gray-400)", mr: 1 }} />
                        ),
                      }}
                      required
                    />

                    {error && (
                      <Alert
                        severity="error"
                        sx={{
                          mb: 3,
                          borderRadius: "var(--border-radius)",
                          border: "1px solid var(--error-red)",
                        }}
                      >
                        {error}
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading}
                      sx={{
                        mb: 3,
                        py: 1.5,
                        borderRadius: "var(--border-radius)",
                        background: "linear-gradient(135deg, var(--primary-blue), var(--secondary-blue))",
                        boxShadow: "var(--shadow-medium)",
                        "&:hover": {
                          background: "linear-gradient(135deg, var(--secondary-blue), var(--primary-blue))",
                          boxShadow: "var(--shadow-heavy)",
                          transform: "translateY(-1px)",
                        },
                        "&:disabled": {
                          background: "var(--gray-400)",
                        },
                      }}
                    >
                      {loading ? "Signing In..." : "Sign In"}
                    </Button>

                    <Paper
                      sx={{
                        p: 2,
                        bgcolor: "var(--gray-50)",
                        border: "1px solid var(--gray-200)",
                        borderRadius: "var(--border-radius)",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary" align="center" fontWeight="bold" sx={{ mb: 1 }}>
                        Demo Credentials
                      </Typography>
                      <Typography variant="caption" color="text.secondary" align="center" component="div">
                        <strong>Admin:</strong> admin@hospital.com / admin123<br />
                        <strong>Doctor:</strong> asha.r@gmail.com / Asha@2024<br />
                        <strong>Nurse:</strong> priya.raj@gmail.com / nurse123<br />
                        <strong>Pharmacist:</strong> sameer.pharma@example.com / pharma123<br />
                        <strong>Receptionist:</strong> riya.sharma@example.com / recep123<br />
                        <strong>Patient:</strong> aarav.kumar@gmail.com / Aarav@2024
                      </Typography>
                    </Paper>
                  </Box>
                )}

                {tabValue === 1 && (
                  <Box component="form" onSubmit={handleRegister}>
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                      Create New Account
                    </Typography>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel sx={{ color: "var(--gray-600)" }}>Select Role</InputLabel>
                      <Select
                        value={registerForm.role}
                        label="Select Role"
                        onChange={(e) =>
                          setRegisterForm({ ...registerForm, role: e.target.value })
                        }
                        sx={{
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "var(--gray-300)",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "var(--primary-blue)",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "var(--primary-blue)",
                          },
                        }}
                      >
                        {roles.map((role) => (
                          <MenuItem key={role.value} value={role.value}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <span>{role.icon}</span>
                              <span>{role.label}</span>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      fullWidth
                      label="Full Name"
                      value={registerForm.name}
                      onChange={(e) =>
                        setRegisterForm({ ...registerForm, name: e.target.value })
                      }
                      sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "var(--gray-300)",
                          },
                          "&:hover fieldset": {
                            borderColor: "var(--primary-blue)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "var(--primary-blue)",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "var(--gray-600)",
                          "&.Mui-focused": {
                            color: "var(--primary-blue)",
                          },
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <PersonIcon sx={{ color: "var(--gray-400)", mr: 1 }} />
                        ),
                      }}
                      required
                    />

                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={registerForm.email}
                      onChange={(e) =>
                        setRegisterForm({ ...registerForm, email: e.target.value })
                      }
                      sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "var(--gray-300)",
                          },
                          "&:hover fieldset": {
                            borderColor: "var(--primary-blue)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "var(--primary-blue)",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "var(--gray-600)",
                          "&.Mui-focused": {
                            color: "var(--primary-blue)",
                          },
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <EmailIcon sx={{ color: "var(--gray-400)", mr: 1 }} />
                        ),
                      }}
                      required
                    />

                    <TextField
                      fullWidth
                      label="Password"
                      type="password"
                      value={registerForm.password}
                      onChange={(e) =>
                        setRegisterForm({ ...registerForm, password: e.target.value })
                      }
                      sx={{
                        mb: 3,
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "var(--gray-300)",
                          },
                          "&:hover fieldset": {
                            borderColor: "var(--primary-blue)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "var(--primary-blue)",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "var(--gray-600)",
                          "&.Mui-focused": {
                            color: "var(--primary-blue)",
                          },
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <LockIcon sx={{ color: "var(--gray-400)", mr: 1 }} />
                        ),
                      }}
                      required
                    />

                    <Alert
                      severity="info"
                      sx={{
                        mb: 3,
                        borderRadius: "var(--border-radius)",
                        border: "1px solid var(--warning-yellow)",
                      }}
                    >
                      Registration functionality is coming soon. For now, use the demo accounts to login.
                    </Alert>

                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled
                      sx={{
                        py: 1.5,
                        borderRadius: "var(--border-radius)",
                        background: "var(--gray-400)",
                        "&:hover": {
                          background: "var(--gray-500)",
                        },
                      }}
                    >
                      Register (Coming Soon)
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoginPage;
