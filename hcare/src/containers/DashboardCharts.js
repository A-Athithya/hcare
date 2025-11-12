import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, CircularProgress } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getData } from "../api/client";
import dayjs from "dayjs";

const COLORS = ["#4CAF50", "#FF9800", "#F44336", "#2196F3"];

const DashboardCharts = ({ role, startDate, endDate }) => {
  const [appointments, setAppointments] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const [appointmentsRes, medicinesRes] = await Promise.all([
          getData("/appointments"),
          getData("/medicines"),
        ]);

        const filteredAppointments = appointmentsRes.filter((a) => {
          const date = new Date(a.appointmentDate);
          return date >= new Date(startDate) && date <= new Date(endDate);
        });

        setAppointments(filteredAppointments);
        setMedicines(medicinesRes);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setLoading(false);
      }
    };

    fetchChartData();
  }, [startDate, endDate]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <CircularProgress />
      </div>
    );

  // ✅ Appointment Status Chart Data
  const appointmentStatusData = [
    {
      name: "Completed",
      value: appointments.filter((a) => a.status === "Completed").length,
    },
    {
      name: "Pending",
      value: appointments.filter((a) => a.status === "Pending").length,
    },
    {
      name: "Cancelled",
      value: appointments.filter((a) => a.status === "Cancelled").length,
    },
  ];

  // ✅ Revenue Chart Data
  const revenueData = appointments
    .filter((a) => a.paymentStatus === "Paid")
    .reduce((acc, cur) => {
      const date = dayjs(cur.appointmentDate).format("MMM D");
      const existing = acc.find((item) => item.date === date);
      if (existing) {
        existing.revenue += cur.fee || 500;
      } else {
        acc.push({ date, revenue: cur.fee || 500 });
      }
      return acc;
    }, []);

  // ✅ Medicine Stock Chart Data
  const medicineStockData = medicines.map((m) => ({
    name: m.name,
    stock: m.stock || 0,
  }));

  // ✅ Alerts
  const lowStock = medicines.filter((m) => m.stock < 5);
  const upcomingAppointments = appointments.filter(
    (a) => new Date(a.appointmentDate) > new Date() && a.status === "Pending"
  );

  return (
    <div style={{ marginTop: "30px" }}>
      <Grid container spacing={3}>
        {/* Appointment Status */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Appointment Status
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={appointmentStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {appointmentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Revenue Chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Revenue Over Time
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#4CAF50" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Medicine Stock */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Medicine Stock Overview
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={medicineStockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="stock" fill="#2196F3" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Alerts Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, backgroundColor: "#FFF8E1" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="error">
                Alerts & Notifications
              </Typography>

              {/* Low Stock Alerts */}
              {lowStock.length > 0 ? (
                lowStock.map((m) => (
                  <Typography key={m.id} variant="body2" color="error">
                    ⚠️ {m.name} stock is low ({m.stock} left)
                  </Typography>
                ))
              ) : (
                <Typography variant="body2">✅ All medicines in stock</Typography>
              )}

              {/* Upcoming Appointments */}
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Upcoming Appointments:
              </Typography>
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.slice(0, 5).map((a) => (
                  <Typography key={a.id} variant="body2">
                    📅 {a.patientName} — {dayjs(a.appointmentDate).format("MMM D, YYYY")}
                  </Typography>
                ))
              ) : (
                <Typography variant="body2">No upcoming appointments</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default DashboardCharts;
