import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  MenuItem,
  Button,
  Divider,
  Fade,
} from "@mui/material";
import { getData } from "../api/client";

const CalendarPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [filterDoctor, setFilterDoctor] = useState("all");
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointmentsRes, doctorsRes] = await Promise.all([
          getData("/appointments"),
          getData("/doctors"),
        ]);

        setAppointments(
          appointmentsRes.map((a) => ({
            id: a.id,
            title: `${a.patientName} (${a.status})`,
            start: a.appointmentDate,
            backgroundColor:
              a.status === "Completed"
                ? "#43a047"
                : a.status === "Pending"
                ? "#ffb300"
                : "#e53935",
            borderColor: "transparent",
          }))
        );
        setDoctors(doctorsRes);
      } catch (error) {
        console.error("Error loading appointments:", error);
      }
    };

    fetchData();
  }, []);

  const filteredEvents =
    filterDoctor === "all"
      ? appointments
      : appointments.filter((a) => a.doctorId === parseInt(filterDoctor));

  const handleDateClick = (info) => {
    alert(`📅 Selected Date: ${info.dateStr}`);
  };

  return (
    <Fade in timeout={600}>
      <Box
        sx={{
          p: 3,
          minHeight: "90vh",
          background: "linear-gradient(180deg, #f7f9fc 0%, #e9eef5 100%)",
        }}
      >
        {/* Page Header */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 3,
            textShadow: "0 1px 3px rgba(0,0,0,0.1)",
            color: "#1a237e",
          }}
        >
          Appointment Calendar
        </Typography>

        {/* Filter + Add Section */}
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            mb: 3,
            backdropFilter: "blur(6px)",
            background: "rgba(255,255,255,0.9)",
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
              }}
            >
              <TextField
                select
                label="Filter by Doctor"
                value={filterDoctor}
                onChange={(e) => setFilterDoctor(e.target.value)}
                sx={{ minWidth: 220 }}
                size="small"
              >
                <MenuItem value="all">All Doctors</MenuItem>
                {doctors.map((d) => (
                  <MenuItem key={d.id} value={d.id}>
                    {d.name}
                  </MenuItem>
                ))}
              </TextField>

              <Button
                variant="contained"
                sx={{
                  borderRadius: 2,
                  background:
                    "linear-gradient(90deg, #3949ab 0%, #1e88e5 100%)",
                  boxShadow: "0 4px 12px rgba(33,150,243,0.3)",
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #303f9f 0%, #1976d2 100%)",
                  },
                }}
                onClick={() => alert("🩺 Add Appointment (Coming soon)")}
              >
                + Add Appointment
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Divider sx={{ mb: 3, opacity: 0.6 }} />

        {/* Main Calendar */}
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
            background: "#fff",
            p: 2,
            overflow: "hidden",
            transition: "0.3s ease",
            "&:hover": { boxShadow: "0 10px 30px rgba(0,0,0,0.15)" },
          }}
        >
          <CardContent>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              height="75vh"
              events={filteredEvents}
              dateClick={handleDateClick}
              headerToolbar={{
                start: "prev,next today",
                center: "title",
                end: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              nowIndicator
              dayMaxEventRows={3}
              eventTextColor="#fff"
              eventBorderColor="transparent"
              selectable
              eventDisplay="block"
              eventContent={(info) => (
                <Box
                  sx={{
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: 13,
                    fontWeight: 600,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    backgroundColor: info.event.backgroundColor,
                    color: "#fff",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  {info.event.title}
                </Box>
              )}
              eventMouseEnter={(info) => {
                const el = info.el;
                el.style.transform = "scale(1.05)";
                el.style.transition = "0.2s ease";
              }}
              eventMouseLeave={(info) => {
                const el = info.el;
                el.style.transform = "scale(1)";
              }}
              dayHeaderClassNames="calendar-header"
              dayCellClassNames="calendar-day"
            />
          </CardContent>
        </Card>
      </Box>
    </Fade>
  );
};

export default CalendarPage;
