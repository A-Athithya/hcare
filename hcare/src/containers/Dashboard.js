/* ----------------------------------------------------------
   Dashboard.js – Clean, Professional, Warning-Free Version
----------------------------------------------------------- */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Grid,
  Card,
  Typography,
  Box,
  Avatar,
  Chip,
  LinearProgress,
  CircularProgress,
  TextField,
  Button,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import { getData } from "../api/client";
import DashboardCharts from "./DashboardCharts";
import dayjs from "dayjs";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, role } = useSelector((state) => state.auth);

  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    appointments: 0,
    medicines: 0,
  });

  const [recentPatients, setRecentPatients] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);

  const [startDate, setStartDate] = useState(dayjs().subtract(7, "day"));
  const [endDate, setEndDate] = useState(dayjs());
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);

  const [loading, setLoading] = useState(true);

  // LOAD DATA
  useEffect(() => {
    let mounted = true;

    const loadStats = async () => {
      setLoading(true);
      try {
        let patients, doctors, appointments, medicines, invoices;

        // Try API first, fallback to db.json
        try {
          // Fetch data based on user role
          if (role === 'doctor') {
            // For doctors, only fetch their related data
            [patients, appointments, medicines, invoices] = await Promise.all([
              getData("/patients"),
              getData("/appointments"),
              getData("/medicines"),
              getData("/invoices"),
            ]);
            doctors = [user]; // Only current doctor

            // Filter appointments for this doctor
            appointments = appointments.filter(apt => apt.doctorId == user.id);
            // Filter invoices for this doctor's patients
            invoices = invoices.filter(inv => inv.doctorId == user.id);
            // Filter patients who have appointments with this doctor
            const doctorPatientIds = [...new Set(appointments.map(apt => apt.patientId))];
            patients = patients.filter(p => doctorPatientIds.includes(p.id));

          } else if (role === 'patient') {
            // For patients, only fetch their own data
            [appointments, medicines, invoices] = await Promise.all([
              getData("/appointments"),
              getData("/medicines"),
              getData("/invoices"),
            ]);
            patients = [user]; // Only current patient
            doctors = await getData("/doctors"); // All doctors for reference

            // Filter appointments for this patient
            appointments = appointments.filter(apt => apt.patientId == user.id);
            // Filter invoices for this patient
            invoices = invoices.filter(inv => inv.patientId == user.id);

          } else {
            // Admin gets all data
            [patients, doctors, appointments, medicines, invoices] = await Promise.all([
              getData("/patients"),
              getData("/doctors"),
              getData("/appointments"),
              getData("/medicines"),
              getData("/invoices"),
            ]);
          }
        } catch (apiError) {
          // Fallback to db.json
          console.log("API failed, using db.json fallback:", apiError);
          const response = await fetch('/db.json');
          if (response.ok) {
            const data = await response.json();

            patients = data.patients || [];
            doctors = data.doctors || [];
            appointments = data.appointments || [];
            medicines = data.medicines || [];
            invoices = data.invoices || [];

            // Apply role-based filtering
            if (role === 'doctor') {
              appointments = appointments.filter(apt => apt.doctorId == user.id);
              invoices = invoices.filter(inv => inv.doctorId == user.id);
              const doctorPatientIds = [...new Set(appointments.map(apt => apt.patientId))];
              patients = patients.filter(p => doctorPatientIds.includes(p.id));
              doctors = [user];
            } else if (role === 'patient') {
              appointments = appointments.filter(apt => apt.patientId == user.id);
              invoices = invoices.filter(inv => inv.patientId == user.id);
              patients = [user];
            }
            // Admin sees all
          }
        }

        if (!mounted) return;

        setStats({
          patients: patients.length,
          doctors: doctors.length,
          appointments: appointments.length,
          medicines: medicines.length,
        });

        setRecentPatients(
          patients
            .sort((a, b) => new Date(b.registeredDate) - new Date(a.registeredDate))
            .slice(0, 3)
        );

        setRecentAppointments(
          appointments
            .sort(
              (a, b) =>
                new Date(b.appointmentDate || b.registeredDate) -
                new Date(a.appointmentDate || a.registeredDate)
            )
            .slice(0, 3)
        );

        setFilteredAppointments(
          appointments.filter((a) => {
            const d = dayjs(a.appointmentDate || a.registeredDate);
            return d.isAfter(startDate) && d.isBefore(endDate.add(1, "day"));
          })
        );

        setFilteredInvoices(
          invoices.filter((invoice) => {
            const d = dayjs(invoice.invoiceDate);
            return d.isAfter(startDate) && d.isBefore(endDate.add(1, "day"));
          })
        );
      } catch (err) {
        console.log("Dashboard load error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadStats();
    return () => (mounted = false);
  }, [startDate, endDate, role, user]);

  // LOADER
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  const totalRevenue = filteredInvoices.reduce(
    (sum, invoice) => sum + (invoice.paidAmount || 0),
    0
  );

  // Dynamic stat cards based on role
  const getStatCards = () => {
    if (role === 'doctor') {
      return [
        { title: "My Patients", value: stats.patients, route: "/patients" },
        { title: "My Appointments", value: stats.appointments, route: "/appointments" },
        { title: "Medicines in Stock", value: stats.medicines, route: "/inventory" },
        { title: "My Revenue", value: `₹${totalRevenue}`, route: "/billing" },
      ];
    } else if (role === 'patient') {
      return [
        { title: "My Appointments", value: stats.appointments, route: "/appointments" },
        { title: "Medicines in Stock", value: stats.medicines, route: "/inventory" },
        { title: "My Bills", value: `₹${totalRevenue}`, route: "/billing" },
      ];
    } else if (role === 'nurse') {
      return [
        { title: "Total Patients", value: stats.patients, route: "/patients" },
        { title: "Active Doctors", value: stats.doctors, route: "/doctors" },
        { title: "Today's Appointments", value: stats.appointments, route: "/appointments" },
        { title: "Medicines in Stock", value: stats.medicines, route: "/inventory" },
      ];
    } else if (role === 'pharmacist') {
      return [
        { title: "Total Patients", value: stats.patients, route: "/patients" },
        { title: "Active Doctors", value: stats.doctors, route: "/doctors" },
        { title: "Today's Appointments", value: stats.appointments, route: "/appointments" },
        { title: "Medicines in Stock", value: stats.medicines, route: "/inventory" },
      ];
    } else {
      // Admin
      return [
        { title: "Total Patients", value: stats.patients, route: "/patients" },
        { title: "Active Doctors", value: stats.doctors, route: "/doctors" },
        { title: "Today's Appointments", value: stats.appointments, route: "/appointments" },
        { title: "Medicines in Stock", value: stats.medicines, route: "/inventory" },
        { title: "Total Revenue", value: `₹${totalRevenue}`, route: "/billing" },
      ];
    }
  };

  const statCards = getStatCards();

  const DefaultIcon = () => (
    <Avatar
      sx={{
        bgcolor: "#1976d2",
        width: 55,
        height: 55,
        margin: "0 auto",
        boxShadow: "0 4px 10px rgba(25,118,210,0.4)",
      }}
    >
      <PersonIcon sx={{ fontSize: 30, color: "white" }} />
    </Avatar>
  );

  return (
    <Box sx={{ minHeight: "100vh", background: "#f3f6fb", p: { xs: 3, md: 5 }, maxWidth: 1400, mx: "auto" }}>
      
      {/* FILTER SECTION (NO BOX) */}
      <Box sx={{ display: "flex", gap: 3, justifyContent: "flex-end", mb: 3 }}>
        <TextField
          type="date"
          label="Start Date"
          InputLabelProps={{ shrink: true }}
          value={startDate.format("YYYY-MM-DD")}
          onChange={(e) => setStartDate(dayjs(e.target.value))}
        />

        <TextField
          type="date"
          label="End Date"
          InputLabelProps={{ shrink: true }}
          value={endDate.format("YYYY-MM-DD")}
          onChange={(e) => setEndDate(dayjs(e.target.value))}
        />

        <Button
          variant="contained"
          onClick={() => {
            setStartDate(dayjs().subtract(7, "day"));
            setEndDate(dayjs());
          }}
        >
          Reset
        </Button>
      </Box>

      {/* STAT CARDS */}
      <Grid container spacing={3} justifyContent="center">
        {statCards.map((card, i) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={i}>
            <Card
              sx={{
                borderRadius: 4,
                minHeight: 230,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "white",
                boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
                cursor: "pointer",
                transition: "0.25s",
                "&:hover": { transform: "translateY(-5px)", boxShadow: "0 12px 25px rgba(0,0,0,0.15)" },
              }}
              onClick={() => navigate(card.route)}
            >
              <DefaultIcon />
              <Typography variant="h5" sx={{ mt: 2, fontWeight: 700, color: "#1e2a4a" }}>{card.value}</Typography>
              <Typography sx={{ opacity: 0.7, fontSize: 14 }}>{card.title}</Typography>
              <LinearProgress
                variant="determinate"
                value={70}
                sx={{
                  mt: 2,
                  width: "85%",
                  height: 6,
                  borderRadius: 3,
                  "& .MuiLinearProgress-bar": { bgcolor: "#1976d2" },
                }}
              />
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* RECENT ACTIVITY + NEW PATIENTS */}
      <Grid container spacing={4} sx={{ mt: 4 }}>
        
        {/* RECENT ACTIVITY */}
        <Grid item xs={12} lg={7}>
          <Card sx={{ borderRadius: 4, p: 3, background: "white", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              Recent Activity
            </Typography>

            {recentAppointments.length === 0 ? (
              <Typography sx={{ color: "gray" }}>No recent appointments</Typography>
            ) : (
              recentAppointments.map((a, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    mb: 2,
                    borderRadius: 3,
                    background: "#f7f9fc",
                    border: "1px solid #e8ecf3",
                  }}
                >
                  <Avatar sx={{ bgcolor: "#1976d2", width: 45, height: 45, mr: 2 }}>
                    <PersonIcon sx={{ color: "white" }} />
                  </Avatar>

                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 600 }}>{a.patientName || "Unknown Patient"}</Typography>
                    <Typography sx={{ fontSize: 13, opacity: 0.7 }}>
                      {a.appointmentDate} • {a.appointmentTime}
                    </Typography>
                  </Box>

                  <Chip
                    label={a.status || "Pending"}
                    size="small"
                    sx={{
                      bgcolor:
                        a.status === "Completed"
                          ? "#4caf50"
                          : a.status === "Cancelled"
                          ? "#d32f2f"
                          : "#ed6c02",
                      color: "white",
                      fontWeight: 600,
                    }}
                  />
                </Box>
              ))
            )}
          </Card>
        </Grid>

        {/* NEW PATIENTS */}
        <Grid item xs={12} lg={5}>
          <Card sx={{ borderRadius: 4, p: 3, background: "white", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              {role === 'doctor' ? 'My Patients' : role === 'patient' ? 'My Profile' : 'New Patients'}
            </Typography>

            {recentPatients.length === 0 ? (
              <Typography sx={{ color: "gray" }}>
                {role === 'doctor' ? 'No patients assigned' : role === 'patient' ? 'Profile information' : 'No recent patients'}
              </Typography>
            ) : (
              recentPatients.map((p, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    mb: 2,
                    borderRadius: 3,
                    background: "#f7f9fc",
                    border: "1px solid #e8ecf3",
                  }}
                >
                  <Avatar sx={{ bgcolor: "#1976d2", width: 45, height: 45, mr: 2 }}>
                    <PersonIcon sx={{ color: "white" }} />
                  </Avatar>

                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 600 }}>{p.name || "Unnamed"}</Typography>
                    <Typography sx={{ opacity: 0.7 }}>
                      {role === 'patient' ? `ID: ${p.id}` : p.registeredDate}
                    </Typography>
                  </Box>
                </Box>
              ))
            )}
          </Card>
        </Grid>
      </Grid>

      {/* CHARTS */}
      <Box sx={{ mt: 6 }}>
        <DashboardCharts
          role={role}
          startDate={dayjs(startDate).format("YYYY-MM-DD")}
          endDate={dayjs(endDate).format("YYYY-MM-DD")}
        />
      </Box>
    </Box>
  );
};

export default Dashboard;
