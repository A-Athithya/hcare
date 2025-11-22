// src/containers/PrescriptionsPage.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { List, Card, Descriptions, Tag, Divider } from "antd";
import client from "../api/client";

export default function PrescriptionsPage() {
  const dispatch = useDispatch();
  const { list } = useSelector((s) => s.prescriptions);
  const { user, role } = useSelector((state) => state.auth);

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    dispatch({ type: "prescriptions/fetchStart" });

    client
      .get("/doctors")
      .then((res) => setDoctors(res.data))
      .catch(() => setDoctors([]));

    client
      .get("/patients")
      .then((res) => setPatients(res.data))
      .catch(() => setPatients([]));
  }, [dispatch]);

  useEffect(() => {
    if (list.length === 0) {
      const loadMock = async () => {
        try {
          const response = await fetch("/db.json");

          if (response.ok) {
            const data = await response.json();

            let prescriptions = data.prescriptions || [];

            if (role === "doctor") {
              prescriptions = prescriptions.filter(p => p.doctorId == user.id);
            } else if (role === "patient") {
              prescriptions = prescriptions.filter(p => p.patientId == user.id);
            }

            if (prescriptions.length > 0) {
              dispatch({
                type: "prescriptions/fetchSuccess",
                payload: prescriptions,
              });
            }

            setDoctors(data.doctors || []);
            setPatients(data.patients || []);
          }
        } catch (error) {
          console.error("Mock load error:", error);
        }
      };

      loadMock();
    }
  }, [list.length, dispatch, role, user.id]);

  const getDoctorName = (doctorId) => {
    const doc = doctors.find((d) => d.id == doctorId);
    return doc ? doc.name : "Unknown Doctor";
  };

  const getPatientName = (patientId) => {
    const pat = patients.find((p) => p.id == patientId);
    return pat ? pat.name : "Unknown Patient";
  };

  return (
    <div style={{ padding: "12px 24px" }}> {/* ✅ top padding reduced */}
      <h2 style={{ marginTop: 0, marginBottom: 16 }}>Prescriptions</h2> {/* ✅ top margin removed */}

      <Card>
        <List
          dataSource={list}
          renderItem={(prescription) => (
            <List.Item>
              <Card style={{ width: "100%" }}>
                <Descriptions
                  title={`Prescription #${prescription.id}`}
                  bordered
                  column={2}
                >
                  <Descriptions.Item label="Patient">
                    {getPatientName(prescription.patientId)}
                  </Descriptions.Item>

                  <Descriptions.Item label="Doctor">
                    {getDoctorName(prescription.doctorId)}
                  </Descriptions.Item>

                  <Descriptions.Item label="Prescribed Date">
                    {prescription.prescribedDate}
                  </Descriptions.Item>

                  <Descriptions.Item label="Next Follow-up">
                    {prescription.nextFollowUp}
                  </Descriptions.Item>

                  <Descriptions.Item label="Status">
                    <Tag
                      color={
                        prescription.status === "Active" ? "green" : "red"
                      }
                    >
                      {prescription.status}
                    </Tag>
                  </Descriptions.Item>

                  <Descriptions.Item label="Notes">
                    {prescription.notes}
                  </Descriptions.Item>
                </Descriptions>

                <Divider />

                <h4>Prescribed Medicines</h4>

                <List
                  dataSource={prescription.medicines}
                  renderItem={(med) => (
                    <List.Item>
                      <div>
                        <strong>{med.medicineName}</strong> - {med.dosage},{" "}
                        {med.frequency}, Duration: {med.duration}
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
