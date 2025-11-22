// src/containers/DashboardCharts.js
import React, { useEffect, useMemo, useState } from "react";
import { Card, Typography, Box, CircularProgress, Grid } from "@mui/material";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import dayjs from "dayjs";
import { getData } from "../api/client";

// Tooltip UI
const RichTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <Box
      sx={{
        background: "#fff",
        p: 1.5,
        borderRadius: 2,
        boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
      }}
    >
      <Typography sx={{ fontWeight: 700, mb: 1 }}>{label}</Typography>
      {payload.map((p, i) => (
        <Typography key={i} sx={{ color: p.color, fontSize: 13 }}>
          {p.name}: {p.value}
        </Typography>
      ))}
    </Box>
  );
}

export default DashboardCharts;

const COLORS = [
  "#4982c9ff",  // Pending
  "#4caf82",  // Completed
  "#f2a65a",  // Cancelled
  "#e36464",  // Other
  "#9aa5b1"
];


function DashboardCharts({ startDate, endDate }) {
  const [appointments, setAppointments] = useState(null);
  const [medicines, setMedicines] = useState(null);
  const [loading, setLoading] = useState(true);

  const start = dayjs(startDate);
  const end = dayjs(endDate);

  // Load data
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [a, m] = await Promise.all([
          getData("/appointments"),
          getData("/medicines"),
        ]);

        setAppointments(a || []);
        setMedicines(m || []);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    load();
  }, []);

  // Revenue Line Data
  const revenueData = useMemo(() => {
    if (!appointments) return [];

    const map = new Map();
    let d = start.clone();

    while (d.isBefore(end) || d.isSame(end)) {
      map.set(d.format("YYYY-MM-DD"), 0);
      d = d.add(1, "day");
    }

    appointments.forEach((a) => {
      const dt = dayjs(a.appointmentDate).format("YYYY-MM-DD");
      if (!map.has(dt)) return;

      const amt = Number(a.paymentAmount || 0);
      map.set(dt, map.get(dt) + amt);
    });

    return Array.from(map.entries()).map(([date, revenue]) => ({
      date,
      revenue,
    }));
  }, [appointments, start, end]);

  // Appointment Status
  const apptStatus = useMemo(() => {
    if (!appointments) return [];
    return appointments.reduce(
      (s, a) => {
        const st = (a.status || "").toLowerCase();
        if (st.includes("pending")) s.Pending++;
        else if (st.includes("completed")) s.Completed++;
        else if (st.includes("cancel")) s.Cancelled++;
        else s.Other++;
        return s;
      },
      { Pending: 0, Completed: 0, Cancelled: 0, Other: 0 }
    );
  }, [appointments]);

  const apptStatusData = Object.keys(apptStatus).map((k) => ({
    name: k,
    value: apptStatus[k],
  }));

  // Stock Summary (names hidden)
  const stockData = medicines?.map((m) => ({
    name: m.medicineName,
    stock: Number(m.stock || 0),
  }));

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );

  const emptyBlock = (t) => (
    <Typography sx={{ textAlign: "center", py: 4, opacity: 0.6 }}>{t}</Typography>
  );

  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {/* Revenue Line Chart */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 2,
              borderRadius: 3,
              boxShadow: "0 6px 20px rgba(0,0,0,0.10)",
              transition: "0.3s",
              "&:hover": { boxShadow: "0 10px 30px rgba(0,0,0,0.18)", transform: "translateY(-4px)" },
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
              Revenue Trend
            </Typography>

            {!revenueData.length ? (
              emptyBlock("No revenue data available")
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip content={<RichTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3f72af"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#3f72af" }}
                    animationDuration={800}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Grid>

        {/* Appointment Status Pie */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 2,
              borderRadius: 3,
              boxShadow: "0 6px 20px rgba(0,0,0,0.10)",
              transition: "0.3s",
              "&:hover": { boxShadow: "0 10px 30px rgba(0,0,0,0.18)", transform: "translateY(-4px)" },
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
              Appointment Status
            </Typography>

            {!apptStatusData.length ? (
              emptyBlock("No appointment data available")
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={apptStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {apptStatusData.map((e, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<RichTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Grid>

        {/* Medical Stock (names hidden) */}
        <Grid item xs={12}>
        {/* ======== MEDICAL STOCK OVERVIEW (CLEAN HOVER ONLY) ======== */}
        <Card sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            Medical Stock Overview
          </Typography>

          {!stockData || stockData.length === 0 ? (
            <Box sx={{ py: 6, textAlign: "center", color: "gray" }}>No inventory data found.</Box>
          ) : (
            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={stockData} margin={{ left: 0, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f6fb" />

        {/* HIDE X-AXIS LABELS COMPLETELY */}
        <XAxis dataKey="medicineName" tick={false} axisLine={false} />

        <YAxis />

        {/* CLEAN HOVER: ONLY medicineName + units */}
        <Tooltip
            formatter={(value, name, props) => {
              const medName = props.payload.name || "Unknown";
              return [`${value} units`, medName];
            }}
            labelFormatter={() => ""} 
            contentStyle={{
              borderRadius: "10px",
              boxShadow: "0 0 12px rgba(0,0,0,0.1)",
            }}
        />


        {/* Bars */}
        <Bar
          dataKey="stock"
          fill="#4f86c6"
          radius={[8, 8, 0, 0]}
          animationDuration={700}
        />

        </BarChart>
        </ResponsiveContainer>
          )}
        </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
