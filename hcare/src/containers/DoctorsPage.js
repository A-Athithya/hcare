// src/containers/DoctorsPage.js
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Avatar,
  Typography,
  Button,
  Rating,
  Collapse,
  Paper,
  Box,
  Divider,
} from "@mui/material";
import { getData, postData, putData } from "../api/client";
import {
  Drawer,
  Form,
  Select,
  DatePicker,
  TimePicker,
  Input,
  List,
  message,
  Spin,
} from "antd";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import "./doctors.css";

const { TextArea } = Input;

export default function DoctorsPage() {
  const dispatch = useDispatch();
  const { list: doctors, loading } = useSelector((state) => state.doctors);

  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [form] = Form.useForm();

  const [submitting, setSubmitting] = useState(false);
  const [expandedDoctor, setExpandedDoctor] = useState(null);

  useEffect(() => {
    dispatch({ type: "doctors/fetchStart" });
    loadData();
  }, [dispatch]);

  // ⭐ Load additional data for appointments/patients
  const loadData = async () => {
    try {
      const [appts, pats] = await Promise.all([
        getData("/appointments"),
        getData("/patients"),
      ]);

      setAppointments(appts);
      setPatients(pats);
    } catch (err) {
      message.error("Failed to load data");
    }
  };

  // ⭐ Mock fallback if Redux fails
  useEffect(() => {
    if (!loading && doctors.length === 0) {
      const loadMock = async () => {
        try {
          const response = await fetch("/db.json");

          if (response.ok) {
            const data = await response.json();

            if (data.doctors) {
              dispatch({
                type: "doctors/fetchSuccess",
                payload: data.doctors,
              });
            }
          }
        } catch (error) {
          console.error("Error loading mock doctors:", error);
        }
      };

      loadMock();
    }
  }, [loading, doctors.length, dispatch]);

  // ⭐ Select a doctor → open drawer
  const openBookingDrawer = (doctor) => {
    setSelectedDoctor(doctor);
    setDrawerOpen(true);
    form.resetFields();
  };

  // ⭐ Submit new appointment request
  const handleBookingSubmit = async (vals) => {
    try {
      setSubmitting(true);

      const payload = {
        patientId: vals.patientId,
        doctorId: selectedDoctor.id,
        appointmentDate: vals.date.format("YYYY-MM-DD"),
        appointmentTime: vals.time.format("hh:mm A"),
        reason: vals.reason || "Consultation",
        status: "Pending",
        paymentStatus: "Pending",
      };

      const res = await postData("/appointments", payload);

      setAppointments((prev) => [res, ...prev]);
      message.success("Appointment request sent successfully");
      setDrawerOpen(false);
    } catch (err) {
      message.error("Failed to send request");
    } finally {
      setSubmitting(false);
    }
  };

  // ⭐ Accept / Reject requests
  const updateAppointmentStatus = async (appt, status) => {
    try {
      const updated = { ...appt, status };

      await putData(`/appointments/${appt.id}`, updated);

      setAppointments((prev) =>
        prev.map((a) => (a.id === appt.id ? updated : a))
      );

      message.success(`Appointment ${status}`);
    } catch {
      message.error("Failed to update appointment");
    }
  };

  const getPatientName = (id) =>
    patients.find((p) => p.id === id)?.name || "Unknown";

  const pendingRequests = (doctorId) =>
    appointments.filter(
      (a) => a.doctorId === doctorId && a.status === "Pending"
    );

  if (loading)
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <Spin size="large" tip="Loading Doctors..." />
      </div>
    );

  return (
    <Box sx={{ padding: 4, background: "#fafbfc", minHeight: "90vh" }}>
      <Typography
        variant="h5"
        gutterBottom
        fontWeight={400}
        sx={{ color: "#202124", marginBottom: 3 }}
      >
        Doctors Directory
      </Typography>

      <Grid container spacing={3} sx={{ display: "flex", alignItems: "stretch" }}>
        {doctors.map((doc) => (
          <Grid item xs={12} sm={6} md={4} key={doc.id} display="flex">
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 400,
              }}
            >
              <Box>
                <CardHeader
                  avatar={
                    <Avatar
                      sx={{ width: 60, height: 60 }}
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        doc.name
                      )}`}
                    />
                  }
                  title={<Typography variant="h6">{doc.name}</Typography>}
                  subheader={doc.specialization}
                />

                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <LocalHospitalIcon color="secondary" />
                    <Typography>{doc.experience}</Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <AccessTimeIcon color="action" />
                    <Typography fontSize={14}>
                      {doc.availableDays?.join(", ") || "N/A"} (
                      {doc.availableTime || "N/A"})
                    </Typography>
                  </Box>

                  <Rating
                    value={doc.rating || 0}
                    precision={0.1}
                    readOnly
                    sx={{ marginBottom: 1 }}
                  />

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      minHeight: 60,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {doc.bio || "No bio available"}
                  </Typography>
                </CardContent>
              </Box>

              {/* Actions */}
              <Box>
                <Divider />
                <CardActions
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                  }}
                >
                  <Button variant="contained" onClick={() => openBookingDrawer(doc)}>
                    Book
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={() =>
                      setExpandedDoctor(
                        expandedDoctor === doc.id ? null : doc.id
                      )
                    }
                  >
                    {expandedDoctor === doc.id
                      ? "Hide Requests"
                      : "View Requests"}
                  </Button>
                </CardActions>

                {/* Pending Requests */}
                <Collapse in={expandedDoctor === doc.id}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: "#fafafa" }}>
                    {pendingRequests(doc.id).length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        No pending requests
                      </Typography>
                    ) : (
                      <List
                        dataSource={pendingRequests(doc.id)}
                        renderItem={(appt) => (
                          <List.Item
                            actions={[
                              <Button
                                size="small"
                                onClick={() => updateAppointmentStatus(appt, "Accepted")}
                              >
                                Accept
                              </Button>,
                              <Button
                                size="small"
                                danger
                                onClick={() => updateAppointmentStatus(appt, "Rejected")}
                              >
                                Reject
                              </Button>,
                            ]}
                          >
                            <List.Item.Meta
                              title={getPatientName(appt.patientId)}
                              description={`${appt.appointmentDate} • ${appt.appointmentTime}`}
                            />
                          </List.Item>
                        )}
                      />
                    )}
                  </Paper>
                </Collapse>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Drawer for Booking */}
      <Drawer
        title={`Book Appointment - ${selectedDoctor?.name || ""}`}
        open={drawerOpen}
        width={400}
        onClose={() => setDrawerOpen(false)}
        destroyOnClose
      >
        <Form layout="vertical" form={form} onFinish={handleBookingSubmit}>
          <Form.Item
            name="patientId"
            label="Patient"
            rules={[{ required: true, message: "Select patient" }]}
          >
            <Select placeholder="Select a patient">
              {patients.map((p) => (
                <Select.Option key={p.id} value={p.id}>
                  {p.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="date" label="Appointment Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="time" label="Time" rules={[{ required: true }]}>
            <TimePicker use12Hours format="hh:mm A" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="reason" label="Reason for Visit">
            <TextArea rows={3} />
          </Form.Item>

          <div style={{ textAlign: "right" }}>
            <Button variant="contained" onClick={() => form.submit()} disabled={submitting}>
              {submitting ? "Submitting..." : "Book Now"}
            </Button>
          </div>
        </Form>
      </Drawer>
    </Box>
  );
}
