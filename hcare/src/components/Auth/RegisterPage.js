import React, { useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
} from "@mui/material";
import {
  ArrowBack,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { postData } from "../../api/client";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [form, setForm] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleField = (k) => (e) =>
    setForm((s) => ({ ...s, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!role) return message.warning("Choose a role");

    try {
      setSubmitting(true);

      const section =
        role === "doctor"
          ? "doctors"
          : role === "nurse"
          ? "nurses"
          : role === "pharmacist"
          ? "pharmacists"
          : role === "receptionist"
          ? "receptionists"
          : "patients";

      await postData(`/${section}`, { ...form, role });
      message.success("Registered Successfully!");
      navigate("/login");
    } catch (err) {
      message.error("Registration Failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg,#f3f6ff,#ffffff)",
        p: 2,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 1100,
          borderRadius: 3,
          boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
          height: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          {/* BACK BUTTON */}
          <IconButton onClick={() => navigate("/login")}>
            <ArrowBack />
          </IconButton>

          <Grid container sx={{ flexGrow: 1 }}>

            {/* LEFT SECTION FIXED */}
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                borderRight: { md: "1px solid #eee" },
                p: 3,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Avatar
                  sx={{
                    bgcolor: "#1976d2",
                    width: 70,
                    height: 70,
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <PersonIcon />
                </Avatar>

                <Typography variant="h5" fontWeight={700}>
                  Create Account
                </Typography>

                <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
                  Choose a role & enter details.
                </Typography>
              </Box>

              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={role}
                  label="Role"
                  onChange={(e) => setRole(e.target.value)}
                >
                  <MenuItem value="patient">Patient</MenuItem>
                  <MenuItem value="doctor">Provider (Doctor)</MenuItem>
                  <MenuItem value="nurse">Nurse</MenuItem>
                  <MenuItem value="pharmacist">Pharmacist</MenuItem>
                  <MenuItem value="receptionist">Receptionist</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>

              <Paper
                elevation={0}
                sx={{
                  mt: 4,
                  p: 2,
                  background: "#f7f9ff",
                  borderRadius: 2,
                }}
              >
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Quick Tip
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Use the demo accounts on Login page to test instantly.
                </Typography>
              </Paper>
            </Grid>

            {/* RIGHT FORM AREA (STATIC HEIGHT) */}
            <Grid
              item
              xs={12}
              md={8}
              sx={{
                p: 3,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Box
                component="form"
                onSubmit={onSubmit}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 2,
                }}
              >
                {/* COMMON FIELDS */}
                <TextField
                  label="Full Name"
                  onChange={handleField("name")}
                  required
                />
                <TextField
                  label="Email"
                  onChange={handleField("email")}
                  required
                />

                <TextField
                  label="Password"
                  type="password"
                  onChange={handleField("password")}
                  required
                />
                <TextField label="Contact" onChange={handleField("contact")} />

                {/* DOCTOR */}
                {role === "doctor" && (
                  <>
                    <TextField label="Specialization" onChange={handleField("specialization")} />
                    <TextField label="License Number" onChange={handleField("licenseNumber")} />
                  </>
                )}

                {/* PATIENT */}
                {role === "patient" && (
                  <>
                    <TextField label="Age" onChange={handleField("age")} />
                    <TextField label="Blood Group" onChange={handleField("bloodGroup")} />
                  </>
                )}

                {/* NURSE */}
                {role === "nurse" && (
                  <>
                    <TextField label="Department" onChange={handleField("department")} />
                    <TextField label="Shift" onChange={handleField("shift")} />
                  </>
                )}

                {/* PHARMACIST */}
                {role === "pharmacist" && (
                  <>
                    <TextField label="License No" onChange={handleField("licenseNo")} />
                    <TextField label="Experience (Years)" onChange={handleField("experience")} />
                  </>
                )}

                {/* RECEPTIONIST */}
                {role === "receptionist" && (
                  <TextField label="Shift" onChange={handleField("shift")} />
                )}
              </Box>

              {/* BUTTON ROW */}
              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => navigate("/login")}
                  startIcon={<ArrowBack />}
                />

                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting}
                  sx={{ minWidth: 160 }}
                >
                  {submitting ? "Registering…" : "Register"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
