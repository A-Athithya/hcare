// src/containers/PatientDetailsPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Table, Button, Row, Col, Tag } from "antd";
import { getData } from "../api/client";
import Modal from "antd/lib/modal/Modal";
import PatientForm from "../components/Forms/PatientForm";


export default function PatientDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [editVisible, setEditVisible] = useState(false);

  const load = async () => {
    const p = await getData(`/patients/${id}`);
    const appts = await getData(`/appointments?patientId=${id}&_sort=appointmentDate&_order=desc`);
    setPatient(p);
    setAppointments(appts);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [id]);

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
