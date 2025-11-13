import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { List, Card, Descriptions, Tag, Divider } from "antd";
import client from "../api/client";

export default function PrescriptionsPage() {
  const dispatch = useDispatch();
  const { list } = useSelector((s) => s.prescriptions);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    dispatch({ type: "prescriptions/fetchStart" });
    // Fetch doctors and patients for details
    client.get("/doctors").then((res) => setDoctors(res.data)).catch(() => setDoctors([]));
    client.get("/patients").then((res) => setPatients(res.data)).catch(() => setPatients([]));
  }, [dispatch]);

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find((d) => d.id == doctorId);
    return doctor ? doctor.name : "Unknown Doctor";
  };

  const getPatientName = (patientId) => {
    const patient = patients.find((p) => p.id == patientId);
    return patient ? patient.name : "Unknown Patient";
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Prescriptions</h2>
      <Card>
        <List
          dataSource={list}
          renderItem={(prescription) => (
            <List.Item>
              <Card style={{ width: "100%" }}>
                <Descriptions title={`Prescription #${prescription.id}`} bordered column={2}>
                  <Descriptions.Item label="Patient">{getPatientName(prescription.patientId)}</Descriptions.Item>
                  <Descriptions.Item label="Doctor">{getDoctorName(prescription.doctorId)}</Descriptions.Item>
                  <Descriptions.Item label="Prescribed Date">{prescription.prescribedDate}</Descriptions.Item>
                  <Descriptions.Item label="Next Follow-up">{prescription.nextFollowUp}</Descriptions.Item>
                  <Descriptions.Item label="Status">
                    <Tag color={prescription.status === "Active" ? "green" : "red"}>{prescription.status}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Notes">{prescription.notes}</Descriptions.Item>
                </Descriptions>
                <Divider />
                <h4>Prescribed Medicines</h4>
                <List
                  dataSource={prescription.medicines}
                  renderItem={(med) => (
                    <List.Item>
                      <div>
                        <strong>{med.medicineName}</strong> - {med.dosage}, {med.frequency}, Duration: {med.duration}
                      </div>
                    </List.Item>
                  )}
                  size="small"
                />
              </Card>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
