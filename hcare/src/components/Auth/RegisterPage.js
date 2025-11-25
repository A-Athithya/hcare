// src/components/Auth/RegisterPage.jsx
import React, { useState, useRef } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { getData, postData } from "../../api/client";
import dayjs from "dayjs";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [role, setRole] = useState("patient");
  const [submitting, setSubmitting] = useState(false);
  const submitLock = useRef(false); // 🔒 double-submit lock

  const [form, setForm] = useState({
    name: "",
    gender: "Male",
    age: "",
    contact: "",
    email: "",
    password: "",
    address: "",
    bloodGroup: "",
    registeredDate: dayjs().format("YYYY-MM-DD"),
    medicalHistory: "",
    allergies: "",
    emergencyContact: "",
    specialization: "",
    qualification: "",
    experience: "",
    department: "",
    licenseNumber: "",
    rating: 0,
    consultationFee: 0,
    bio: "",
    availableDays: [],
    availableTime: "",
    phone: "",
    shift: "",
    licenseNo: "",
    status: "",
  });

  const handleField = (k) => (e) =>
    setForm((s) => ({ ...s, [k]: e.target.value }));

  const toggleAvailableDay = (d) => {
    setForm((s) => {
      const arr = s.availableDays || [];
      return {
        ...s,
        availableDays: arr.includes(d)
          ? arr.filter((x) => x !== d)
          : [...arr, d],
      };
    });
  };

  const sectionForRole = (r) => {
    if (r === "doctor") return "doctors";
    if (r === "nurse") return "nurses";
    if (r === "pharmacist") return "pharmacists";
    if (r === "receptionist") return "receptionists";
    if (r === "admin") return "users";
    return "patients";
  };

  const validateBasic = () => {
    if (!form.name) return message.warning("Name required");
    if (!form.email) return message.warning("Email required");
    if (!form.password) return message.warning("Password required");
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // 🔒 HARD LOCK – prevents double execution (React StrictMode)
    if (submitLock.current) return;
    submitLock.current = true;

    if (!validateBasic()) {
      submitLock.current = false;
      return;
    }

    setSubmitting(true);

    try {
      const section = sectionForRole(role);
      let rolePayload = { ...form, role };

      if (role === "doctor") {
        rolePayload = {
          name: form.name,
          gender: form.gender,
          age: Number(form.age) || "",
          specialization: form.specialization,
          qualification: form.qualification,
          experience: form.experience,
          contact: form.contact,
          email: form.email,
          password: form.password,
          role: "doctor",
          address: form.address,
          availableDays: form.availableDays,
          availableTime: form.availableTime,
          status: "Active",
          department: form.department,
          licenseNumber: form.licenseNumber,
          rating: Number(form.rating) || 0,
          consultationFee: Number(form.consultationFee) || 0,
          bio: form.bio,
        };
      }

      if (role === "patient") {
        rolePayload = {
          name: form.name,
          age: Number(form.age) || "",
          gender: form.gender,
          contact: form.contact,
          email: form.email,
          password: form.password,
          role: "patient",
          address: form.address,
          bloodGroup: form.bloodGroup,
          registeredDate: form.registeredDate,
          medicalHistory: form.medicalHistory,
          allergies: form.allergies,
          emergencyContact: form.emergencyContact,
          status: "Active",
        };
      }

      if (role === "nurse") {
        rolePayload = {
          name: form.name,
          age: Number(form.age) || "",
          gender: form.gender,
          email: form.email,
          password: form.password,
          role: "nurse",
          phone: form.phone || form.contact,
          department: form.department,
          shift: form.shift,
          experience: form.experience,
          status: "Active",
          dateJoined: dayjs().format("YYYY-MM-DD"),
        };
      }

      if (role === "pharmacist") {
        rolePayload = {
          name: form.name,
          licenseNo: form.licenseNo,
          email: form.email,
          password: form.password,
          role: "pharmacist",
          contact: form.contact,
          experience: form.experience,
        };
      }

      if (role === "receptionist") {
        rolePayload = {
          name: form.name,
          shift: form.shift,
          email: form.email,
          password: form.password,
          role: "receptionist",
          contact: form.contact,
          status: "Active",
        };
      }

      if (role === "admin") {
        rolePayload = {
          name: form.name,
          email: form.email,
          password: form.password,
          role: "admin",
        };
      }

      // Save to role section
      const created = await postData(`/${section}`, rolePayload);

      // ⬇️ IMPORT THE TOP IF NOT PRESENT
      // import { getData } from "../../api/client";

      // ✅ Check existing users before saving (prevent duplicate)
      const existingUsers = await getData("/users");

      const alreadyExists = Array.isArray(existingUsers) && existingUsers.some(
        (u) => u.email?.toLowerCase() === created.email?.toLowerCase()
      );

      if (!alreadyExists) {
        await postData("/users", {
          name: created.name,
          email: created.email,
          password: created.password,
          role: created.role,
        });
      }

      message.success("Registered successfully! Please login.");
      navigate("/login");

    } catch (err) {
      console.error(err);
      message.error("Registration failed!");
    } finally {
      setSubmitting(false);
      submitLock.current = false; // 🔓 unlock after complete
    };
  };

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <Box sx={{ minHeight: "100vh", p: 3, background: "#f3f6ff" }}>
      <Card sx={{ maxWidth: 1050, mx: "auto", borderRadius: 3, boxShadow: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <IconButton onClick={() => navigate("/login")}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h5" sx={{ ml: 1, fontWeight: 700 }}>
              Create Account
            </Typography>
          </Box>

          {/* FORM */}
          <Box component="form" onSubmit={onSubmit}>
            <Grid container spacing={2}>
              {/* ROLE FIRST */}
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={role}
                    label="Role"
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <MenuItem value="patient">Patient</MenuItem>
                    <MenuItem value="doctor">Doctor</MenuItem>
                    <MenuItem value="nurse">Nurse</MenuItem>
                    <MenuItem value="pharmacist">Pharmacist</MenuItem>
                    <MenuItem value="receptionist">Receptionist</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* BASIC */}
              {[
                ["Full Name", "name"],
                ["Email", "email"],
                ["Password", "password", "password"],
                ["Contact", "contact"],
                ["Address", "address"],
                ["Age", "age", "number"],
              ].map(([label, key, type]) => (
                <Grid item xs={12} sm={6} md={4} key={key}>
                  <TextField
                    label={label}
                    type={type || "text"}
                    fullWidth
                    required={["name", "email", "password"].includes(key)}
                    value={form[key]}
                    onChange={handleField(key)}
                  />
                </Grid>
              ))}

              {/* GENDER */}
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    value={form.gender}
                    label="Gender"
                    onChange={handleField("gender")}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* PATIENT */}
              {role === "patient" && (
                <>
                  {[
                    ["Blood Group", "bloodGroup"],
                    ["Registered Date", "registeredDate"],
                    ["Medical History", "medicalHistory"],
                    ["Allergies", "allergies"],
                    ["Emergency Contact", "emergencyContact"],
                  ].map(([label, key]) => (
                    <Grid item xs={12} sm={6} md={4} key={key}>
                      <TextField
                        label={label}
                        fullWidth
                        value={form[key]}
                        onChange={handleField(key)}
                      />
                    </Grid>
                  ))}
                </>
              )}

              {/* DOCTOR */}
              {role === "doctor" && (
                <>
                  {[
                    ["Specialization", "specialization"],
                    ["Qualification", "qualification"],
                    ["Experience", "experience"],
                    ["Department", "department"],
                    ["License Number", "licenseNumber"],
                    ["Consultation Fee", "consultationFee", "number"],
                  ].map(([label, key, type]) => (
                    <Grid item xs={12} sm={6} md={4} key={key}>
                      <TextField
                        label={label}
                        type={type || "text"}
                        fullWidth
                        value={form[key]}
                        onChange={handleField(key)}
                      />
                    </Grid>
                  ))}

                  {/* Available Days */}
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {weekDays.map((d) => (
                        <Chip
                          key={d}
                          label={d}
                          clickable
                          color={
                            form.availableDays.includes(d)
                              ? "primary"
                              : "default"
                          }
                          onClick={() => toggleAvailableDay(d)}
                        />
                      ))}
                    </Box>
                  </Grid>

                  {/* Available Time */}
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="Available Time"
                      fullWidth
                      value={form.availableTime}
                      onChange={handleField("availableTime")}
                    />
                  </Grid>
                </>
              )}

              {/* NURSE */}
              {role === "nurse" && (
                <>
                  {[
                    ["Department", "department"],
                    ["Shift", "shift"],
                    ["Phone", "phone"],
                  ].map(([label, key]) => (
                    <Grid item xs={12} sm={6} md={4} key={key}>
                      <TextField
                        label={label}
                        fullWidth
                        value={form[key]}
                        onChange={handleField(key)}
                      />
                    </Grid>
                  ))}
                </>
              )}

              {/* PHARMACIST */}
              {role === "pharmacist" && (
                <>
                  {[
                    ["License No", "licenseNo"],
                    ["Experience", "experience"],
                  ].map(([label, key]) => (
                    <Grid item xs={12} sm={6} md={4} key={key}>
                      <TextField
                        label={label}
                        fullWidth
                        value={form[key]}
                        onChange={handleField(key)}
                      />
                    </Grid>
                  ))}
                </>
              )}

              {/* RECEPTIONIST */}
              {role === "receptionist" && (
                <>
                  {[
                    ["Shift", "shift"],
                    ["Status", "status"],
                  ].map(([label, key]) => (
                    <Grid item xs={12} sm={6} md={4} key={key}>
                      <TextField
                        label={label}
                        fullWidth
                        value={form[key]}
                        onChange={handleField(key)}
                      />
                    </Grid>
                  ))}
                </>
              )}

              {/* BUTTONS */}
              <Grid item xs={12}>
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/login")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" disabled={submitting}>
                    {submitting ? "Registering..." : "Register"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
