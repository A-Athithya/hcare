import React, { useState, useEffect } from "react";
import { Calendar, Card, Select, Button, Typography, Space, Badge, Divider } from "antd";
import { getData } from "../api/client";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;

const CalendarPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [filterDoctor, setFilterDoctor] = useState("all");
  const [doctors, setDoctors] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointmentsRes, doctorsRes] = await Promise.all([
          getData("/appointments"),
          getData("/doctors"),
        ]);

        setAppointments(appointmentsRes);
        setDoctors(doctorsRes);
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
          <li key={item.id} style={{ marginBottom: 4 }}>
            <Badge
              status={
                item.status === "Completed"
                  ? "success"
                  : item.status === "Pending"
                  ? "warning"
                  : "error"
              }
              text={
                <span style={{ fontSize: 12, color: "#666" }}>
                  {item.patientName}
                </span>
              }
            />
          </li>
        ))}
      </ul>
    );
  };

  const onSelect = (value) => {
    setSelectedDate(value);
  };

  const onPanelChange = (value, mode) => {
    console.log(value.format("YYYY-MM-DD"), mode);
  };

  const handleAddAppointment = () => {
    // Placeholder for add appointment functionality
    console.log("Add appointment clicked");
  };

  return (
    <div style={{ padding: 24, background: "#fafbfc", minHeight: "90vh" }}>
      {/* Page Header */}
      <Title level={2} style={{ marginBottom: 24, color: "#202124" }}>
        Appointment Calendar
      </Title>

      {/* Filter and Add Section */}
      <Card
        style={{
          marginBottom: 24,
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        <Space wrap style={{ justifyContent: "space-between", width: "100%" }}>
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
          <Button
            type="primary"
            onClick={handleAddAppointment}
            style={{ borderRadius: 8 }}
          >
            + Add Appointment
          </Button>
        </Space>
      </Card>

      <Divider style={{ margin: "24px 0" }} />

      {/* Calendar */}
      <Card
        style={{
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        <Calendar
          dateCellRender={dateCellRender}
          onSelect={onSelect}
          onPanelChange={onPanelChange}
          style={{ borderRadius: 12 }}
        />
      </Card>

      {/* Selected Date Details */}
      {selectedDate && (
        <Card
          style={{
            marginTop: 24,
            borderRadius: 12,
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          <Title level={4} style={{ marginBottom: 16 }}>
            Appointments on {selectedDate.format("MMMM DD, YYYY")}
          </Title>
          {getListData(selectedDate).length === 0 ? (
            <p style={{ color: "#666" }}>No appointments scheduled for this date.</p>
          ) : (
            <Space direction="vertical" style={{ width: "100%" }}>
              {getListData(selectedDate).map((appointment) => (
                <Card
                  key={appointment.id}
                  size="small"
                  style={{
                    borderRadius: 8,
                    border: "1px solid #e8eaed",
                  }}
                >
                  <Space>
                    <Badge
                      status={
                        appointment.status === "Completed"
                          ? "success"
                          : appointment.status === "Pending"
                          ? "warning"
                          : "error"
                      }
                    />
                    <div>
                      <div style={{ fontWeight: 500 }}>{appointment.patientName}</div>
                      <div style={{ fontSize: 12, color: "#666" }}>
                        {appointment.appointmentTime} • {appointment.reason}
                      </div>
                    </div>
                  </Space>
                </Card>
              ))}
            </Space>
          )}
        </Card>
      )}
    </div>
  );
};

export default CalendarPage;
