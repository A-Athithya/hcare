// src/containers/PatientDetailsPage.js
// src/containers/PatientDetailsPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Row, Col, Descriptions, Table, Button, Spin, message } from "antd";
import dayjs from "dayjs";
import { getData } from "../api/client";

export default function PatientDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      // ❗ SINGLE ID VENDAM – FULL LIST + FIND
      const [allPatients, apptsAll] = await Promise.all([
        getData("/patients"),
        getData("/appointments"),
      ]);

      const pObj = Array.isArray(allPatients)
        ? allPatients.find((p) => String(p.id) === String(id))
        : null;

      const appts = Array.isArray(apptsAll)
        ? apptsAll.filter((a) => String(a.patientId) === String(id))
        : [];

      setPatient(pObj || null);
      setAppointments(appts);
    } catch (err) {
      console.error("Failed loading patient details", err);
      message.error("Failed to load patient details");
      setPatient(null);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: 60 }}>
        <Spin />
      </div>
    );

  if (!patient)
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        Patient not found or access denied.
      </div>
    );

  const appointmentsColumns = [
    {
      title: "Date",
      dataIndex: "appointmentDate",
      key: "appointmentDate",
      render: (d) => dayjs(d).format("DD MMM YYYY"),
    },
    { title: "Time", dataIndex: "appointmentTime", key: "appointmentTime" },
    { title: "Doctor ID", dataIndex: "doctorId", key: "doctorId" },
    { title: "Reason", dataIndex: "reason", key: "reason" },
    { title: "Status", dataIndex: "status", key: "status" },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Row gutter={16}>
        <Col xs={24}>
          <Card
            title={`${patient.name || "Unnamed"} — Details`}
            extra={
              <div style={{ display: "flex", gap: 8 }}>
                <Button onClick={() => navigate(`/patient/edit/${id}`)}>
                  Edit
                </Button>
                <Button
                  type="primary"
                  onClick={() =>
                    navigate(`/appointments?patientId=${id}`)
                  }
                >
                  Book Appointment
                </Button>
                <Button onClick={() => navigate("/patients")}>Back</Button>
              </div>
            }
          >
            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item label="Name">
                {patient.name || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Age">
                {patient.age ?? "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Gender">
                {patient.gender || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Contact">
                {patient.contact || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {patient.email || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Address">
                {patient.address || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Blood Group">
                {patient.bloodGroup || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Registered Date">
                {patient.registeredDate
                  ? dayjs(patient.registeredDate).format("DD MMM YYYY")
                  : "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Medical History">
                {patient.medicalHistory || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Allergies">
                {patient.allergies || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Emergency Contact">
                {patient.emergencyContact || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {patient.status || "—"}
              </Descriptions.Item>
              {Object.keys(patient).map((k) => {
                if (
                  [
                    "id",
                    "name",
                    "age",
                    "gender",
                    "contact",
                    "email",
                    "address",
                    "bloodGroup",
                    "registeredDate",
                    "medicalHistory",
                    "allergies",
                    "emergencyContact",
                    "status",
                  ].includes(k)
                )
                  return null;
                return (
                  <Descriptions.Item key={k} label={k}>
                    {typeof patient[k] === "object"
                      ? JSON.stringify(patient[k])
                      : String(patient[k])}
                  </Descriptions.Item>
                );
              })}
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} style={{ marginTop: 16 }}>
          <Card title="Appointment History">
            <Table
              dataSource={appointments}
              columns={appointmentsColumns}
              rowKey="id"
              pagination={{ pageSize: 6 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
