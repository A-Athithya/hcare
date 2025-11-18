import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Select,
  DatePicker,
  TimePicker,
  Tag,
  message,
  Popconfirm,
  Space,
  notification,
  Segmented,
  Badge,
  Input,
} from "antd";
import dayjs from "dayjs";
import { getData, postData, putData } from "../api/client";

export default function AppointmentsPage() {
  const { user, role } = useSelector((state) => state.auth);

  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form] = Form.useForm();
  const [patientForm] = Form.useForm();

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [filter, setFilter] = useState("Upcoming");
  const [patientModalOpen, setPatientModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      let apptData, doctorData, patientData;

      // Fetch data based on user role
      if (role === 'doctor') {
        // Doctors see only their appointments
        [apptData, patientData] = await Promise.all([
          getData("/appointments"),
          getData("/patients"),
        ]);
        doctorData = [user]; // Only current doctor

        // Filter appointments for this doctor
        apptData = apptData.filter(apt => apt.doctorId === user.id);
        // Filter patients who have appointments with this doctor
        const doctorPatientIds = [...new Set(apptData.map(apt => apt.patientId))];
        patientData = patientData.filter(p => doctorPatientIds.includes(p.id));

      } else if (role === 'patient') {
        // Patients see only their appointments
        [apptData, doctorData] = await Promise.all([
          getData("/appointments"),
          getData("/doctors"),
        ]);
        patientData = [user]; // Only current patient

        // Filter appointments for this patient
        apptData = apptData.filter(apt => apt.patientId == user.id);

      } else {
        // Admin sees all data
        [apptData, doctorData, patientData] = await Promise.all([
          getData("/appointments"),
          getData("/doctors"),
          getData("/patients"),
        ]);
      }

      setAppointments(apptData);
      setDoctors(doctorData);
      setPatients(patientData);
    } catch (err) {
      message.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Fallback to mock db.json with role-based filtering
  useEffect(() => {
    if (appointments.length === 0 && patients.length === 0 && doctors.length === 0) {
      const loadMock = async () => {
        try {
          const res = await fetch("/db.json");
          if (res.ok) {
            const data = await res.json();

            let apptData = data.appointments || [];
            let patientData = data.patients || [];
            let doctorData = data.doctors || [];

            // Apply same role-based filtering as in loadData
            if (role === 'doctor') {
              // Doctors see only their appointments
              doctorData = [user]; // Only current doctor

              // Filter appointments for this doctor
              apptData = apptData.filter(apt => apt.doctorId === user.id);
              // Filter patients who have appointments with this doctor
              const doctorPatientIds = [...new Set(apptData.map(apt => apt.patientId))];
              patientData = patientData.filter(p => doctorPatientIds.includes(p.id));

            } else if (role === 'patient') {
              // Patients see only their appointments
              patientData = [user]; // Only current patient

              // Filter appointments for this patient
              apptData = apptData.filter(apt => apt.patientId == user.id);

            } else {
              // Admin sees all data - no filtering needed
            }

            setAppointments(apptData);
            setPatients(patientData);
            setDoctors(doctorData);
          }
        } catch {
          console.error("Mock load error");
        }
      };
      loadMock();
    }
  }, [appointments.length, patients.length, doctors.length, role, user.id]);

  const getDoctorName = (id) =>
    doctors.find((d) => d.id == id)?.name || "—";

  const getPatientName = (id) =>
    patients.find((p) => p.id == id)?.name || "—";

  // CREATE / EDIT appointment
  const handleSubmit = async (vals) => {
    try {
      const payload = {
        patientId: vals.patientId,
        doctorId: vals.doctorId,
        appointmentDate: vals.date.format("YYYY-MM-DD"),
        appointmentTime: vals.time.format("hh:mm A"),
        reason: vals.reason,
        status: "Pending",
        paymentStatus: "Pending",
      };

      if (editMode === "edit" && selectedAppointment) {
        await putData(`/appointments/${selectedAppointment.id}`, payload);

        setAppointments((prev) =>
          prev.map((a) =>
            a.id === selectedAppointment.id ? { ...a, ...payload } : a
          )
        );

        notification.success({
          message: "Appointment Rescheduled",
        });
      } else {
        const newAppt = await postData("/appointments", payload);
        setAppointments((prev) => [newAppt, ...prev]);

        notification.success({
          message: "Appointment Scheduled",
        });
      }

      setModalOpen(false);
      form.resetFields();
    } catch {
      message.error("Failed to save appointment");
    }
  };

  // CANCEL appointment
  const cancelAppointment = async (appt) => {
    try {
      const updated = { ...appt, status: "Cancelled" };
      await putData(`/appointments/${appt.id}`, updated);

      setAppointments((prev) =>
        prev.map((a) => (a.id === appt.id ? updated : a))
      );

      notification.warning({
        message: "Appointment Cancelled",
      });
    } catch {
      message.error("Failed to cancel appointment");
    }
  };

  // RESCHEDULE modal
  const openReschedule = (appt) => {
    setEditMode("edit");
    setSelectedAppointment(appt);
    setModalOpen(true);

    form.setFieldsValue({
      patientId: appt.patientId,
      doctorId: appt.doctorId,
      date: dayjs(appt.appointmentDate),
      time: dayjs(appt.appointmentTime, "hh:mm A"),
      reason: appt.reason,
    });
  };

  const openNewModal = () => {
    // Only allow scheduling if user has permission
    if (role === 'patient') {
      message.warning("Patients cannot schedule appointments directly. Please contact reception.");
      return;
    }
    setEditMode("new");
    setModalOpen(true);
    form.resetFields();
  };

  // FILTER logic
  const filteredAppointments = appointments.filter((appt) => {
    const today = dayjs().startOf("day");
    const apptDate = dayjs(appt.appointmentDate);

    if (filter === "Upcoming") return apptDate.isAfter(today);
    if (filter === "Today") return apptDate.isSame(today, "day");
    if (filter === "Past") return apptDate.isBefore(today);

    return true;
  });

  const upcomingCount = appointments.filter((a) =>
    dayjs(a.appointmentDate).isAfter(dayjs(), "day")
  ).length;

  // ADD NEW PATIENT
  const handleAddPatient = async (vals) => {
    try {
      const payload = {
        ...vals,
        registeredDate: dayjs().format("YYYY-MM-DD"),
        status: "Active",
      };

      const newPatient = await postData("/patients", payload);

      setPatients((prev) => [...prev, newPatient]);
      setPatientModalOpen(false);

      form.setFieldValue("patientId", newPatient.id);
      message.success("Patient added successfully");
    } catch {
      message.error("Failed to add patient");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", width: 60 },
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
      render: (status) => {
        const color =
          status === "Accepted"
            ? "green"
            : status === "Pending"
            ? "orange"
            : status === "Cancelled"
            ? "red"
            : "blue";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Actions",
      render: (_, rec) => (
        <Space>
          <Button
            size="small"
            onClick={() => openReschedule(rec)}
            disabled={rec.status === "Cancelled"}
          >
            Reschedule
          </Button>

          <Popconfirm
            title="Cancel this appointment?"
            onConfirm={() => cancelAppointment(rec)}
          >
            <Button
              size="small"
              danger
              disabled={rec.status === "Cancelled"}
            >
              Cancel
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 32, background: "#fafbfc", minHeight: "90vh" }}>
      <h2 style={{ color: "#202124", fontWeight: 400, marginBottom: 24 }}>
        Appointments & Scheduling{" "}
        <Badge count={upcomingCount} offset={[10, 0]}>
          <Tag color="blue">Upcoming</Tag>
        </Badge>
      </h2>

      <Card
        title={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Select value={filter} onChange={setFilter} style={{ width: 120 }}>
              <Select.Option value="Upcoming">Upcoming</Select.Option>
              <Select.Option value="Today">Today</Select.Option>
              <Select.Option value="Past">Past</Select.Option>
            </Select>
            <Button type="primary" onClick={openNewModal}>
              Schedule Appointment
            </Button>
          </div>
        }
      >
        <Table
          dataSource={filteredAppointments}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 6 }}
        />
      </Card>

      {/* APPOINTMENT MODAL */}
      <Modal
        title={editMode === "edit" ? "Reschedule Appointment" : "Schedule Appointment"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="patientId" label="Patient" rules={[{ required: true }]}>
            <Select
              placeholder="Select Patient"
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <Button
                    type="link"
                    onClick={() => setPatientModalOpen(true)}
                    style={{ width: "100%", textAlign: "left" }}
                  >
                    + Add New Patient
                  </Button>
                </>
              )}
            >
              {patients.map((p) => (
                <Select.Option key={p.id} value={p.id}>
                  {p.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="doctorId" label="Doctor" rules={[{ required: true }]}>
            <Select placeholder="Select Doctor">
              {doctors.map((d) => (
                <Select.Option key={d.id} value={d.id}>
                  {d.name} - {d.specialization}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="date" label="Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="time" label="Time" rules={[{ required: true }]}>
            <TimePicker use12Hours format="hh:mm A" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="reason" label="Reason">
            <Input.TextArea rows={2} />
          </Form.Item>

          <div style={{ textAlign: "right" }}>
            <Button htmlType="submit" type="primary">
              {editMode === "edit" ? "Save Changes" : "Schedule"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* ADD NEW PATIENT MODAL */}
      <Modal
        title="Add New Patient"
        open={patientModalOpen}
        onCancel={() => setPatientModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form layout="vertical" form={patientForm} onFinish={handleAddPatient}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="age" label="Age" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>

          <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Male">Male</Select.Option>
              <Select.Option value="Female">Female</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="contact" label="Contact">
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>

          <Form.Item name="address" label="Address">
            <Input.TextArea rows={2} />
          </Form.Item>

          <div style={{ textAlign: "right" }}>
            <Button type="primary" htmlType="submit">
              Save Patient
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
