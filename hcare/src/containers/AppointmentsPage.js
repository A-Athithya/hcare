// src/containers/AppointmentsPage.js
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
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

export default function AppointmentsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // list | new | edit | view
  const [mode, setMode] = useState("list");
  const [selected, setSelected] = useState(null);

  const [filter, setFilter] = useState("Upcoming");
  const [search, setSearch] = useState("");

  // ================= LOAD DATA =================
  const loadData = async () => {
    setLoading(true);
    try {
      const [a, p, d] = await Promise.all([
        getData("/appointments"),
        getData("/patients"),
        getData("/doctors"),
      ]);

      setAppointments(Array.isArray(a) ? a : []);
      setPatients(Array.isArray(p) ? p : []);
      setDoctors(Array.isArray(d) ? d : []);
    } catch {
      message.error("Failed to load data");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // URL ?create=true na direct form open
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("create") === "true") {
      setMode("new");
    }
  }, [location]);

  // ================= HELPERS =================
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

  // ✅ COMPLETE → BILLING saga flow
  const markAsCompleted = (rec) => {
    // Saga-ku trigger: idhu than base
    dispatch({
      type: "appointments/updateStatus",
      payload: {
        appointment: rec,
        status: "Completed",
      },
    });

    message.success("Appointment Completed ✅ Billing create aagum");
    // optional – list refresh
    setTimeout(() => {
      loadData();
      navigate("/billing");
    }, 600);
  };

  const getPatientName = (id) =>
    patients.find((p) => String(p.id) === String(id))?.name || "—";

  const getDoctorName = (id) =>
    doctors.find((d) => String(d.id) === String(id))?.name || "—";

  // ================= TABLE COLUMNS =================
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
      render: (d) => (d ? dayjs(d).format("DD MMM YYYY") : "—"),
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

          {r.status !== "Completed" && r.status !== "Cancelled" && (
            <Button
              size="small"
              style={{ background: "#52c41a", color: "#fff" }}
              onClick={() => markAsCompleted(r)}
            >
              Complete
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // ================= FILTERED LIST =================
  const filtered = appointments.filter((a) => {
    const today = dayjs();
    const ad = dayjs(a.appointmentDate);

    if (filter === "Upcoming" && !ad.isAfter(today, "day")) return false;
    if (filter === "Today" && !ad.isSame(today, "day")) return false;
    if (filter === "Past" && !ad.isBefore(today, "day")) return false;
    // "All" na above conditions none satisfy, so all pass

    if (
      search &&
      !getPatientName(a.patientId)
        .toLowerCase()
        .includes(search.toLowerCase())
    )
      return false;

    return true;
  });

  // ================= FORM MODE VIEW =================
  if (mode !== "list") {
    return (
      <div style={{ padding: 24 }}>
        <Card
          style={{
            width: "100%",
            maxWidth: 1100,
            margin: "0 auto",
            padding: 20,
            maxHeight: "98vh",
            overflowY: "auto",
          }}
          bodyStyle={{ padding: 10 }}
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

          <div
            style={{
              marginTop: 20,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button onClick={backToList}>Back to List</Button>

            {mode !== "view" && (
              <div style={{ display: "flex", gap: 10 }}>
                <Button
                  onClick={() =>
                    document.querySelector("form")?.reset()
                  }
                >
                  Reset
                </Button>

                <Button
                  type="primary"
                  onClick={() =>
                    document
                      .querySelector("form")
                      ?.dispatchEvent(
                        new Event("submit", {
                          bubbles: true,
                          cancelable: true,
                        })
                      )
                  }
                >
                  {mode === "edit"
                    ? "Update Appointment"
                    : "Schedule Appointment"}
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  }

  // ================= LIST MODE VIEW =================
  return (
    <div style={{ padding: 24 }}>
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
            style={{ width: 220 }}
            allowClear
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

      <Card>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filtered}
          loading={loading}
          pagination={{ pageSize: 8 }}
        />
      </Card>
    </div>
  );
}
