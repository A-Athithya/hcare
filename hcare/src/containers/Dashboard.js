/* src/containers/Dashboard.js
   Updated: resolve patient names in recent activity + auto-refresh
*/

import React, { useEffect, useState, useRef } from "react";
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
  const { user } = useSelector((state) => state.auth || {});
  const role = user?.role;

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

  // polling ref so we can clean up
  const pollRef = useRef(null);

  // central loader (fetches patients, doctors, appointments, medicines, invoices)
  const loadStats = async () => {
    setLoading(true);
    try {
      let patients = [];
      let doctors = [];
      let appointments = [];
      let medicines = [];
      let invoices = [];

      // Try API first; on failure fallback to db.json (like previous logic)
      try {
        if (role === "doctor") {
          [patients, appointments, medicines, invoices] = await Promise.all([
            getData("/patients"),
            getData("/appointments"),
            getData("/medicines"),
            getData("/invoices"),
          ]);
          doctors = [user];
          // filter for this doctor
          appointments = (appointments || []).filter(
            (a) => a.doctorId == user?.id
          );
          invoices = (invoices || []).filter((inv) => inv.doctorId == user?.id);
          const doctorPatientIds = [
            ...new Set((appointments || []).map((apt) => apt.patientId)),
          ];
          patients = (patients || []).filter((p) =>
            doctorPatientIds.includes(p.id)
          );
        } else if (role === "patient") {
          [appointments, medicines, invoices] = await Promise.all([
            getData("/appointments"),
            getData("/medicines"),
            getData("/invoices"),
          ]);
          patients = [user];
          doctors = await getData("/doctors");
          appointments = (appointments || []).filter(
            (a) => a.patientId == user?.id
          );
          invoices = (invoices || []).filter((inv) => inv.patientId == user?.id);
        } else {
          // admin/others
          [patients, doctors, appointments, medicines, invoices] =
            await Promise.all([
              getData("/patients"),
              getData("/doctors"),
              getData("/appointments"),
              getData("/medicines"),
              getData("/invoices"),
            ]);
        }
      } catch (apiErr) {
        // fallback to db.json
        console.warn("API failed in dashboard load, falling back to db.json", apiErr);
        const resp = await fetch("/db.json");
        if (resp.ok) {
          const data = await resp.json();
          patients = data.patients || [];
          doctors = data.doctors || [];
          appointments = data.appointments || [];
          medicines = data.medicines || [];
          invoices = data.invoices || [];

          // apply same role-based filters as above
          if (role === "doctor") {
            appointments = appointments.filter((apt) => apt.doctorId == user?.id);
            invoices = invoices.filter((inv) => inv.doctorId == user?.id);
            const doctorPatientIds = [
              ...new Set((appointments || []).map((apt) => apt.patientId)),
            ];
            patients = patients.filter((p) => doctorPatientIds.includes(p.id));
            doctors = [user];
          } else if (role === "patient") {
            appointments = appointments.filter((apt) => apt.patientId == user?.id);
            invoices = invoices.filter((inv) => inv.patientId == user?.id);
            patients = [user];
          }
        } else {
          // can't load fallback - keep things empty
          patients = [];
          doctors = [];
          appointments = [];
          medicines = [];
          invoices = [];
        }
      }

      // ensure arrays
      patients = patients || [];
      doctors = doctors || [];
      appointments = appointments || [];
      medicines = medicines || [];
      invoices = invoices || [];

      // Build stats
      setStats({
        patients: patients.length,
        doctors: doctors.length,
        appointments: appointments.length,
        medicines: medicines.length,
      });

      // RECENT PATIENTS (latest registeredDate)
      const recentP = [...patients]
        .sort(
          (a, b) =>
            new Date(b.registeredDate || b.createdAt || 0) -
            new Date(a.registeredDate || a.createdAt || 0)
        )
        .slice(0, 3);
      setRecentPatients(recentP);

      // Map appointments and resolve patientName (handles patientId type mismatch)
      const mappedAppts = (appointments || []).map((a) => {
        const patient =
          patients.find((p) => String(p.id) === String(a.patientId)) || null;
        return {
          ...a,
          patientName: patient?.name || patient?.fullName || null,
        };
      });

      // Sort by appointmentDate (newest first), fallback to created or registeredDate
      const sortedAppts = mappedAppts.sort((a, b) => {
        const da = a.appointmentDate || a.registeredDate || a.createdAt || "";
        const db = b.appointmentDate || b.registeredDate || b.createdAt || "";
        return new Date(db) - new Date(da);
      });

      setRecentAppointments(sortedAppts.slice(0, 3));

      // Filtered lists for charts and other cards
      setFilteredAppointments(
        (appointments || []).filter((a) => {
          const d = dayjs(a.appointmentDate || a.registeredDate);
          return d.isAfter(startDate) && d.isBefore(endDate.add(1, "day"));
        })
      );

      setFilteredInvoices(
        (invoices || []).filter((invoice) => {
          const d = dayjs(invoice.invoiceDate);
          return d.isAfter(startDate) && d.isBefore(endDate.add(1, "day"));
        })
      );
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  // load on mount + auto-refresh every 20s so Recent Activity shows new data
  useEffect(() => {
    loadStats();

    // start polling
    pollRef.current = setInterval(() => {
      loadStats();
    }, 50000); // 20s - change as needed

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, user]);

  // also reload whenever date filters change
  useEffect(() => {
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const totalRevenue = filteredInvoices.reduce(
    (sum, invoice) => sum + (invoice.paidAmount || 0),
    0
  );

  // stat cards by role (same as before)
  const getStatCards = () => {
    if (role === "doctor") {
      return [
        { title: "My Patients", value: stats.patients, route: "/patients" },
        { title: "My Appointments", value: stats.appointments, route: "/appointments" },
        { title: "Medicines in Stock", value: stats.medicines, route: "/inventory" },
        { title: "My Revenue", value: `₹${totalRevenue}`, route: "/billing" },
      ];
    } else if (role === "patient") {
      return [
        { title: "My Appointments", value: stats.appointments, route: "/appointments" },
        { title: "Medicines in Stock", value: stats.medicines, route: "/inventory" },
        { title: "My Bills", value: `₹${totalRevenue}`, route: "/billing" },
      ];
    } else if (role === "nurse" || role === "pharmacist") {
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
    <Box sx={{ minHeight: "50vh", background: "#f3f6fb", p: { xs: 3, md: 5 }, maxWidth: 1400, mx: "auto" }}>
      {/* FILTER SECTION */}
      <Box sx={{ display: "flex", gap: 3, justifyContent: "flex-end", mb: 3 }}>
        <TextField
          type="date"
          size="small"
          label="Start Date"
          InputLabelProps={{ shrink: true }}
          value={startDate.format("YYYY-MM-DD")}
          onChange={(e) => setStartDate(dayjs(e.target.value))}
        />

        <TextField
          type="date"
          size="small"
          label="End Date"
          InputLabelProps={{ shrink: true }}
          value={endDate.format("YYYY-MM-DD")}
          onChange={(e) => setEndDate(dayjs(e.target.value))}
        />

        <Button
          variant="contained"
          size="small"
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
                    {/* patientName resolved earlier; fallback to Unknown Patient */}
                    <Typography sx={{ fontWeight: 600 }}>{a.patientName || "Unknown Patient"}</Typography>
                    <Typography sx={{ fontSize: 13, opacity: 0.7 }}>
                      {a.appointmentDate || "-"} • {a.appointmentTime || "-"}
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
                      {role === 'patient' ? `ID: ${p.id}` : p.registeredDate || "-"}
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
          startDate={dayjs(startDate).format("YYYY-MM-DD")}
          endDate={dayjs(endDate).format("YYYY-MM-DD")}
        />
      </Box>
    </Box>
  );
};

export default Dashboard;
