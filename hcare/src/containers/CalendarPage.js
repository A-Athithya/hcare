import React, { useState, useEffect } from "react";
import {
  Calendar,
  Card,
  Select,
  Button,
  Typography,
  Badge,
  Divider,
  Tooltip,
} from "antd";
import { getData } from "../api/client";

import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Option } = Select;

const CalendarPage = () => {
  const navigate = useNavigate(); // ✅ added

  const [appointments, setAppointments] = useState([]);
  const [filterDoctor, setFilterDoctor] = useState("all");
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointmentsRes, doctorsRes, patientsRes] = await Promise.all([
          getData("/appointments"),
          getData("/doctors"),
          getData("/patients"),
        ]);

        setAppointments(appointmentsRes);
        setDoctors(doctorsRes);
        setPatients(patientsRes);
      } catch (error) {
        console.error("Error loading appointments:", error);
      }
    };

    fetchData();
  }, []);

  const filteredAppointments =
    filterDoctor === "all"
      ? appointments
      : appointments.filter((a) => a.doctorId === parseInt(filterDoctor));

  const getListData = (value) => {
    const dateStr = value.format("YYYY-MM-DD");
    return filteredAppointments.filter((a) => a.appointmentDate === dateStr);
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);

    return (
      <ul className="events" style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {listData.map((item) => (
          <Tooltip
            key={item.id}
            title={
              <div>
                <strong>{item.patientName}</strong> <br />
                Time: {item.appointmentTime} <br />
                Doctor: {doctors.find(d => d.id === item.doctorId)?.name || 'Unknown'} <br />
                Reason: {item.reason} <br />
                Status: {item.status}
              </div>
            }
          >
            <li
              style={{
                marginBottom: 4,
                padding: "2px 4px",
                background: "#f7f7f7",
                borderRadius: 6,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Badge
                status={
                  item.status === "Completed"
                    ? "success"
                    : item.status === "Pending"
                    ? "warning"
                    : "error"
                }
              />
              <span style={{ fontSize: 12, marginLeft: 6, color: "#444" }}>
                {patients.find(p => p.id === item.patientId)?.name || item.patientName || 'Unknown'} — {item.appointmentTime}
              </span>
            </li>
          </Tooltip>
        ))}
      </ul>
    );
  };

  // ✅ UPDATED FUNCTION (redirect)
  const handleAddAppointment = () => {
    navigate("/appointments?create=true");
  };

  return (
    <div style={{ padding: "10px 24px", background: "#fafbfc", minHeight: "90vh" }}>
      {/* Page Header */}
      <Title level={2} style={{ marginTop: 0, marginBottom: 24, color: "#202124" }}>
        Appointment Calendar
      </Title>

        {/* Filter and Add Section - SIMPLE (NO CARD) */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12
          }}
        >
          <div>
            <span style={{ marginRight: 8, fontWeight: 500 }}>Filter by Doctor:</span>
            <Select
              value={filterDoctor}
              onChange={setFilterDoctor}
              style={{ width: 200 }}
            >
              <Option value="all">All Doctors</Option>
              {doctors.map((d) => (
                <Option key={d.id} value={d.id}>
                  {d.name}
                </Option>
              ))}
            </Select>
          </div>

          <Button type="primary" onClick={handleAddAppointment}>
            + Add Appointment
          </Button>
        </div>

      <Divider style={{ margin: "24px 0" }} />

      {/* Calendar */}
      <Card
        style={{
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        <Calendar dateCellRender={dateCellRender} style={{ borderRadius: 12 }} />
      </Card>
    </div>
  );
};

export default CalendarPage;
