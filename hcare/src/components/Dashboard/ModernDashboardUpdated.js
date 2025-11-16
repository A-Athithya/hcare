import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  LinearProgress,
} from "@mui/material";
import {
  People as PeopleIcon,
  LocalHospital as DoctorIcon,
  EventAvailable as AppointmentIcon,
  Inventory as MedicineIcon,
  TrendingUp as RevenueIcon,
} from "@mui/icons-material";
import { DatePicker, Button } from "antd";
import { getData } from "../../api/client";
import DashboardCharts from "../../containers/DashboardCharts";
import dayjs from "dayjs";

const ModernDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    appointments: 0,
    medicines: 0,
  });
  const [recentPatients, setRecentPatients] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [role, setRole] = useState("admin");
  const [startDate, setStartDate] = useState(dayjs().subtract(7, "day").format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [patients, doctors, appointments, medicines] = await Promise.all([
          getData("/patients"),
          getData("/doctors"),
          getData("/appointments"),
          getData("/medicines"),
        ]);

        setStats({
          patients: patients.length,
          doctors: doctors.length,
          appointments: appointments.length,
          medicines: medicines.length,
        });

        const sortedPatients = patients.sort(
          (a, b) => new Date(b.registeredDate) - new Date(a.registeredDate)
        );
        setRecentPatients(sortedPatients.slice(0, 3));

        const sortedAppointments = appointments
          .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))
          .slice(0, 3);
        setRecentAppointments(sortedAppointments);

        const filtered = appointments.filter((a) => {
          const date = new Date(a.appointmentDate);
          return date >= new Date(startDate) && date <= new Date(endDate);
        });
        setFilteredAppointments(filtered);
        setLoading(false);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setLoading(false);
      }
    };

    fetchStats();
  }, [startDate, endDate]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div className="loading-spinner"></div>
      </Box>
    );
  }

  const totalRevenue = filteredAppointments.reduce((sum, a) => sum + (a.paymentAmount || 0), 0);

  const statCards = [
    {
      title: "Total Patients",
      value: stats.patients,
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      background: "#ffffff",
      change: "+12%",
      changeType: "positive",
      progress: 75,
      route: "/patients",
    },
    {
      title: "Active Doctors",
      value: stats.doctors,
      icon: <DoctorIcon sx={{ fontSize: 40 }} />,
      background: "#ffffff",
      change: "+2",
      changeType: "positive",
      progress: 85,
      route: "/doctors",
    },
    {
      title: "Today's Appointments",
      value: stats.appointments,
      icon: <AppointmentIcon sx={{ fontSize: 40 }} />,
      background: "#ffffff",
      change: "+8",
      changeType: "positive",
      progress: 60,
      route: "/appointments",
    },
    {
      title: "Medicines in Stock",
      value: stats.medicines,
      icon: <MedicineIcon sx={{ fontSize: 40 }} />,
      background: "#ffffff",
      change: "+15",
      changeType: "positive",
      progress: 90,
      route: "/inventory",
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: <RevenueIcon sx={{ fontSize: 40 }} />,
      background: "#ffffff",
      change: "+20%",
      changeType: "positive",
      progress: 70,
      route: "/billing",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        p: { xs: 3, md: 5 },
        maxWidth: 1400,
        mx: "auto",
      }}
      className="fade-in"
    >
      {/* Header */}
      <Box sx={{ mb: 6, textAlign: "center" }}>
        <Typography
          variant="h3"
          sx={{
            color: "var(--gray-800)",
            fontWeight: 700,
            mb: 2,
            textShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          Healthcare Dashboard
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "var(--gray-600)",
            fontWeight: 400,
          }}
        >
          Welcome back! Here's what's happening with your healthcare system today.
        </Typography>
      </Box>

      {/* Date Filter Section */}
      <Card className="healthcare-card" sx={{ mb: 6, maxWidth: 800, mx: "auto" }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, color: "var(--gray-700)", textAlign: "center" }}>
            Filter Dashboard Data
          </Typography>
          <Box sx={{ display: "flex", gap: 3, alignItems: "end", flexWrap: "wrap", justifyContent: "center" }}>
            <div>
              <Typography variant="body2" sx={{ mb: 1, color: "var(--gray-600)" }}>
                Start Date
              </Typography>
              <DatePicker
                value={dayjs(startDate)}
                onChange={(date) => setStartDate(date.format("YYYY-MM-DD"))}
                style={{ width: 200 }}
                className="healthcare-form"
              />
            </div>
            <div>
              <Typography variant="body2" sx={{ mb: 1, color: "var(--gray-600)" }}>
                End Date
              </Typography>
              <DatePicker
                value={dayjs(endDate)}
                onChange={(date) => setEndDate(date.format("YYYY-MM-DD"))}
                style={{ width: 200 }}
                className="healthcare-form"
              />
            </div>
            <Button
              type="primary"
              onClick={() => {
                setStartDate(dayjs().subtract(7, "day").format("YYYY-MM-DD"));
                setEndDate(dayjs().format("YYYY-MM-DD"));
              }}
              style={{ height: 32 }}
            >
              Reset Filter
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <Grid container spacing={4} sx={{ mb: 6, justifyContent: "center" }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={card.title}>
            <Card
              className="healthcare-card"
              sx={{
                background: card.background,
                color: "black",
                border: "none",
                animation: `fadeIn 0.6s ease-in-out ${index * 0.1}s both`,
                cursor: "pointer",
                minHeight: 200,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                "&:hover": {
                  boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                  transform: "translateY(-2px)",
                },
              }}
              onClick={() => navigate(card.route)}
            >
              <CardContent sx={{ p: 3, flexGrow: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                  <Box
                    className="healthcare-icon"
                    sx={{
                      background: "rgba(255,255,255,0.2)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Chip
                    label={card.change}
                    size="small"
                    sx={{
                      background: "rgba(255,255,255,0.2)",
                      color: "white",
                      fontWeight: 600,
                    }}
                  />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {card.value}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
                  {card.title}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={card.progress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "rgba(255,255,255,0.3)",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#1976d2",
                      borderRadius: 4,
                    },
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={4} sx={{ justifyContent: "center" }}>
        {/* Recent Activity */}
        <Grid item xs={12} lg={7}>
          <Card className="healthcare-card" sx={{ mb: 3 }}>
            <Box className="healthcare-card-header">
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Recent Activity
              </Typography>
            </Box>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, color: "var(--gray-700)" }}>
                Latest Appointments
              </Typography>
              {recentAppointments.map((appointment, index) => (
                <Box
                  key={appointment.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    background: "var(--gray-50)",
                    border: "1px solid var(--gray-200)",
                    animation: `slideUp 0.5s ease-out ${index * 0.1}s both`,
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "var(--primary-blue)",
                      mr: 2,
                      width: 40,
                      height: 40,
                    }}
                  >
                    {appointment.patientName?.charAt(0) || "P"}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {appointment.patientName || "Unknown Patient"}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "var(--gray-600)" }}>
                      {appointment.appointmentDate} • {appointment.appointmentTime}
                    </Typography>
                  </Box>
                  <Chip
                    label={appointment.status}
                    size="small"
                    sx={{
                      background:
                        appointment.status === "Completed"
                          ? "var(--success-green)"
                          : appointment.status === "Pending"
                          ? "var(--warning-yellow)"
                          : "var(--error-red)",
                      color: "white",
                      fontWeight: 600,
                    }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Patients */}
        <Grid item xs={12} lg={4}>
          <Card className="healthcare-card">
            <Box className="healthcare-card-header">
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                New Patients
              </Typography>
            </Box>
            <CardContent>
              {recentPatients.map((patient, index) => (
                <Box
                  key={patient.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    background: "var(--gray-50)",
                    border: "1px solid var(--gray-200)",
                    animation: `slideUp 0.5s ease-out ${index * 0.1}s both`,
                  }}
                >
                  <Avatar
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}`}
                    sx={{ mr: 2, width: 40, height: 40 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {patient.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "var(--gray-600)" }}>
                      {patient.registeredDate}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Box sx={{ mt: 6 }}>
        <DashboardCharts role={role} startDate={startDate} endDate={endDate} />
      </Box>
    </Box>
  );
};

export default ModernDashboard;
