// src/containers/PatientDetailsPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Table, Button, Row, Col, Tag } from "antd";
import { useSelector } from "react-redux";
import { getData } from "../api/client";
import Modal from "antd/lib/modal/Modal";
import PatientForm from "../components/Forms/PatientForm";


export default function PatientDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, role } = useSelector((state) => state.auth);
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [editVisible, setEditVisible] = useState(false);

  const load = async () => {
    try {
      // Try API first
      const p = await getData(`/patients/${id}`);
      const appts = await getData(`/appointments?patientId=${id}&_sort=appointmentDate&_order=desc`);
      setPatient(p);
      setAppointments(appts);
    } catch (error) {
      // Fallback to db.json with role-based filtering
      try {
        const response = await fetch('/db.json');
        if (response.ok) {
          const data = await response.json();

          // Find the specific patient
          let patientData = data.patients?.find(p => p.id == id);

          if (!patientData) {
            setPatient(null);
            return;
          }

          // Check if user has permission to view this patient
          if (role === 'patient' && user.id != id) {
            // Patients can only view their own details
            setPatient(null);
            return;
          } else if (role === 'doctor') {
            // Doctors can only view patients they have appointments with
            const doctorAppointments = data.appointments?.filter(apt => apt.doctorId === user.id) || [];
            const doctorPatientIds = [...new Set(doctorAppointments.map(apt => apt.patientId))];
            if (!doctorPatientIds.includes(parseInt(id))) {
              setPatient(null);
              return;
            }
          }
          // Admins can view all patients

          // Filter appointments for this patient
          let apptData = data.appointments?.filter(apt => apt.patientId == id) || [];

          // Apply role-based filtering to appointments
          if (role === 'doctor') {
            apptData = apptData.filter(apt => apt.doctorId === user.id);
          } else if (role === 'patient') {
            // Patients can see all their appointments
          }
          // Admins see all

          setPatient(patientData);
          setAppointments(apptData);
        }
      } catch (fallbackError) {
        console.error("Error loading patient details:", fallbackError);
        setPatient(null);
        setAppointments([]);
      }
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [id, role, user.id]);

  const cols = [
    { title: "Doctor", dataIndex: "doctorId", key: "doctorId", render: (d) => `Dr. ${d}` },
    { title: "Date", dataIndex: "appointmentDate" },
    { title: "Time", dataIndex: "appointmentTime" },
    { title: "Reason", dataIndex: "reason" },
    {
      title: "Status",
      dataIndex: "status",
      render: (s) => (s === "Accepted" ? <Tag color="green">Accepted</Tag> : s === "Pending" ? <Tag color="gold">Pending</Tag> : <Tag color="red">{s}</Tag>),
    },
  ];

  if (patient === null) return <div style={{ padding: 24, textAlign: "center" }}>Patient not found or access denied.</div>;
  if (!patient) return <div style={{ padding: 24 }}>Loading patient...</div>;

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={12}>
        <Col span={16}>
          <Card title={`Patient: ${patient.name}`} style={{ marginBottom: 16 }}>
            <p><b>Age:</b> {patient.age}</p>
            <p><b>Gender:</b> {patient.gender}</p>
            <p><b>Contact:</b> {patient.contact}</p>
            <p><b>Email:</b> {patient.email}</p>
            <p><b>Address:</b> {patient.address}</p>
            <p><b>Blood Group:</b> {patient.bloodGroup}</p>
            <p><b>Medical History:</b> {patient.medicalHistory || "—"}</p>
            <p><b>Allergies:</b> {patient.allergies || "—"}</p>
            <div style={{ marginTop: 12 }}>
              <Button onClick={() => setEditVisible(true)} style={{ marginRight: 8 }}>Edit Patient</Button>
              <Button type="primary" onClick={() => navigate(`/appointments?patientId=${patient.id}`)}>Book Appointment</Button>
            </div>
          </Card>

          <Card title="Appointment History">
            <Table dataSource={appointments} columns={cols} rowKey="id" />
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Quick Info">
            <p><b>Status:</b> {patient.status}</p>
            <p><b>Emergency Contact:</b> {patient.emergencyContact}</p>
            <p><b>Registered:</b> {patient.registeredDate}</p>
          </Card>
        </Col>
      </Row>

      <Modal visible={editVisible} onCancel={() => setEditVisible(false)} footer={null} width={720}>
        <PatientForm initial={patient} onSaved={() => { setEditVisible(false); load(); }} />
      </Modal>
    </div>
  );
}
