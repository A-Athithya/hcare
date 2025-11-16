import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import { getData } from "../api/client"; // ✅ use your helper
import DashboardCharts from "./DashboardCharts";
import dayjs from "dayjs";

const Dashboard = () => {
  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    appointments: 0,
    medicines: 0,
  });
  const [recentPatients, setRecentPatients] = useState([]);
  const [role, setRole] = useState("admin");
  const [startDate, setStartDate] = useState(dayjs().subtract(7, "day").format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // ✅ use helper to get data
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
        setRecentPatients(sortedPatients.slice(0, 5));

        const filtered = appointments.filter((a) => {
          const date = new Date(a.appointmentDate);
          return date >= new Date(startDate) && date <= new Date(endDate);
        });
        setFilteredAppointments(filtered);
        setLoading(false);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        // Fallback to mock data if API fails
        try {
          const mockResponse = await fetch('/db.json');
          if (mockResponse.ok) {
            const mockData = await mockResponse.json();
            const patients = mockData.patients || [];
            const doctors = mockData.doctors || [];
            const appointments = mockData.appointments || [];
            const medicines = mockData.medicines || [];

            setStats({
              patients: patients.length,
              doctors: doctors.length,
              appointments: appointments.length,
              medicines: medicines.length,
            });

            const sortedPatients = patients.sort(
              (a, b) => new Date(b.registeredDate) - new Date(a.registeredDate)
            );
            setRecentPatients(sortedPatients.slice(0, 5));

            const filtered = appointments.filter((a) => {
              const date = new Date(a.appointmentDate);
              return date >= new Date(startDate) && date <= new Date(endDate);
            });
            setFilteredAppointments(filtered);
          }
        } catch (mockError) {
          console.error("Error loading mock data:", mockError);
        }
        setLoading(false);
      }
    };

    fetchStats();
  }, [startDate, endDate]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <CircularProgress />
      </div>
    );

  const cards = [
    { title: "Total Patients", value: stats.patients, color: "#4CAF50" },
    { title: "Total Doctors", value: stats.doctors, color: "#2196F3" },
    { title: "Appointments", value: stats.appointments, color: "#FF9800" },
    { title: "Medicines", value: stats.medicines, color: "#9C27B0" },
  ];

  const totalRevenue = filteredAppointments.reduce(
    (sum, a) => (a.paymentStatus === "Paid" ? sum + 500 : sum),
    0
  );

  return (
    <div style={{ padding: "32px", background: "#fafbfc", minHeight: "90vh" }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 400, color: "#202124", marginBottom: "24px" }}>
        Dashboard & Reports
      </Typography>

      {/* Filters */}
      <Card sx={{ p: 2, mb: 3, borderRadius: 3, boxShadow: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              select
              label="Select Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              fullWidth
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="provider">Provider</MenuItem>
              <MenuItem value="nurse">Nurse</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="End Date"
              type="date"
              fullWidth
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="contained"
              fullWidth
              sx={{ backgroundColor: "#1976d2", borderRadius: 2 }}
              onClick={() => {
                setStartDate(dayjs().subtract(7, "day").format("YYYY-MM-DD"));
                setEndDate(dayjs().format("YYYY-MM-DD"));
              }}
            >
              Reset Filter
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Stat Cards */}
      <Grid container spacing={3}>
        {cards.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.title}>
            <Card sx={{ borderRadius: 3, boxShadow: 3, backgroundColor: item.color, color: "#fff" }}>
              <CardContent>
                <Typography variant="h6">{item.title}</Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold", mt: 1 }}>
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {role === "admin" && (
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: 3, backgroundColor: "#1E88E5", color: "#fff" }}>
              <CardContent>
                <Typography variant="h6">Total Revenue</Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold", mt: 1 }}>
                  ₹{totalRevenue}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Charts */}
      <DashboardCharts role={role} startDate={startDate} endDate={endDate} />

      {/* Recent Patients */}
      {role !== "nurse" && (
        <Card sx={{ mt: 4, borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Patient Registrations
            </Typography>
            {recentPatients.map((p) => (
              <div
                key={p.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                <Typography>{p.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {p.registeredDate}
                </Typography>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
