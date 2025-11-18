import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Tag,
  Space,
  Button,
  Select,
  Input,
  message,
} from "antd";
import dayjs from "dayjs";
import { getData, putData } from "../api/client";
import AppointmentForm from "../components/Forms/AppointmentForm";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Full-width layout mode
  const [mode, setMode] = useState("list"); // list | new | edit | view
  const [selected, setSelected] = useState(null);

  const [filter, setFilter] = useState("Upcoming");
  const [search, setSearch] = useState("");

  // Load main data
  const loadData = async () => {
    setLoading(true);
    try {
      const [a, p, d] = await Promise.all([
        getData("/appointments"),
        getData("/patients"),
        getData("/doctors"),
      ]);

      setAppointments(a || []);
      setPatients(p || []);
      setDoctors(d || []);
    } catch {
      message.error("Failed to load");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openNew = () => {
    setSelected(null);
    setMode("new");
  };

  const openEdit = (r) => {
    setSelected(r);
    setMode("edit");
  };

  const openView = (r) => {
    setSelected(r);
    setMode("view");
  };

  const backToList = () => {
    setMode("list");
    setSelected(null);
  };

  const onSaved = async () => {
    await loadData();
    setMode("list");
  };

  const cancelAppointment = async (rec) => {
    try {
      await putData(`/appointments/${rec.id}`, {
        ...rec,
        status: "Cancelled",
      });
      message.success("Cancelled");
      loadData();
    } catch {
      message.error("Failed");
    }
  };

  const getPatientName = (id) =>
    patients.find((p) => p.id == id)?.name || "—";

  const getDoctorName = (id) =>
    doctors.find((d) => d.id == id)?.name || "—";

  const columns = [
    { title: "ID", dataIndex: "id", width: 70 },
    {
      title: "Patient",
      dataIndex: "patientId",
      render: (id) => getPatientName(id),
    },
    {
      title: "Doctor",
      dataIndex: "doctorId",
      render: (id) => getDoctorName(id),
    },
    {
      title: "Date",
      dataIndex: "appointmentDate",
      render: (d) => dayjs(d).format("DD MMM YYYY"),
    },
    { title: "Time", dataIndex: "appointmentTime" },
    {
      title: "Status",
      dataIndex: "status",
      render: (s) => {
        const color =
          s === "Completed"
            ? "green"
            : s === "Pending"
            ? "orange"
            : "red";
        return <Tag color={color}>{s}</Tag>;
      },
    },
    {
      title: "Actions",
      render: (_, r) => (
        <Space>
          <Button size="small" onClick={() => openView(r)}>
            View
          </Button>
          <Button
            size="small"
            type="primary"
            onClick={() => openEdit(r)}
            disabled={r.status === "Cancelled"}
          >
            Edit
          </Button>
          <Button
            size="small"
            danger
            onClick={() => cancelAppointment(r)}
            disabled={r.status === "Cancelled"}
          >
            Cancel
          </Button>
        </Space>
      ),
    },
  ];

  const filtered = appointments.filter((a) => {
    const today = dayjs();
    const ad = dayjs(a.appointmentDate);

    if (filter === "Upcoming" && !ad.isAfter(today, "day")) return false;
    if (filter === "Today" && !ad.isSame(today, "day")) return false;
    if (filter === "Past" && !ad.isBefore(today, "day")) return false;

    if (
      search &&
      !getPatientName(a.patientId).toLowerCase().includes(search.toLowerCase())
    )
      return false;

    return true;
  });

  // -----------------------------
  // FULL-WIDTH FORM VIEW
  // -----------------------------
  if (mode !== "list") {
    return (
      <div style={{ padding: 24, display: "flex", gap: 24, height: "100%" }}>
        {/* LEFT PANEL - FORM */}
        <Card
          style={{
            width: "55%",
            height: "100%",
            overflowY: "auto",
            padding: 20,
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            {mode === "edit"
              ? "Edit Appointment"
              : mode === "view"
              ? "Appointment Details"
              : "Schedule Appointment"}
          </h2>

          <AppointmentForm
            initial={mode !== "new" ? selected : null}
            onSaved={onSaved}
            autoFocusPatientId={
              mode === "edit" ? selected?.patientId : undefined
            }
            readOnly={mode === "view"}
          />

          <Button onClick={backToList} style={{ marginTop: 16 }}>
            Back to List
          </Button>
        </Card>

        {/* RIGHT PANEL - PREVIEW */}
        <Card
          style={{
            width: "45%",
            height: "100%",
            overflowY: "auto",
            padding: 20,
            background: "#fafafa",
          }}
        >
          {selected ? (
            <>
              <h3>Appointment Preview</h3>
              <p>
                <strong>Patient:</strong> {getPatientName(selected.patientId)}
              </p>
              <p>
                <strong>Doctor:</strong> {getDoctorName(selected.doctorId)}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {dayjs(selected.appointmentDate).format("DD MMM YYYY")}
              </p>
              <p>
                <strong>Time:</strong> {selected.appointmentTime}
              </p>
              <p>
                <strong>Reason:</strong> {selected.reason || "—"}
              </p>
              <p>
                <strong>Status:</strong> {selected.status}
              </p>

              <h4 style={{ marginTop: 24 }}>Patient History</h4>
              {appointments
                .filter(
                  (a) =>
                    a.patientId === selected.patientId &&
                    a.id !== selected.id
                )
                .slice(0, 5)
                .map((h) => (
                  <div
                    key={h.id}
                    style={{
                      padding: 8,
                      borderBottom: "1px solid #ddd",
                      marginBottom: 6,
                    }}
                  >
                    <strong>
                      {dayjs(h.appointmentDate).format("DD MMM YYYY")}
                    </strong>{" "}
                    – {h.appointmentTime}
                    <div style={{ fontSize: 13, color: "#666" }}>
                      {h.reason}
                    </div>
                  </div>
                ))}
            </>
          ) : (
            <>
              <h3>New Appointment</h3>
              <p>Select patient & doctor to see preview...</p>
            </>
          )}
        </Card>
      </div>
    );
  }

  // -----------------------------
  // LIST MODE (MAIN TABLE)
  // -----------------------------
  return (
    <div style={{ padding: 24 }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h2 style={{ margin: 0 }}>Appointments</h2>

        <div style={{ display: "flex", gap: 8 }}>
          <Input.Search
            placeholder="Search patient"
            onSearch={(v) => setSearch(v)}
            allowClear
            style={{ width: 220 }}
          />
          <Select
            value={filter}
            onChange={(v) => setFilter(v)}
            style={{ width: 140 }}
          >
            <Select.Option value="Upcoming">Upcoming</Select.Option>
            <Select.Option value="Today">Today</Select.Option>
            <Select.Option value="Past">Past</Select.Option>
            <Select.Option value="All">All</Select.Option>
          </Select>
          <Button type="primary" onClick={openNew}>
            Schedule Appointment
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <Card>
        <Table
          rowKey="id"
          dataSource={filtered}
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 8 }}
        />
      </Card>
    </div>
  );
}
