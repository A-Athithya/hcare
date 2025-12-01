// src/containers/CommunicationModule.js
import React, { useEffect, useState } from "react";
import { Input, List, Card, Avatar, Button, Divider, message, Select, Tooltip } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ProfileOutlined } from "@ant-design/icons";
import {
  fetchCommunicationsRequest,
  fetchPatientsRequest,
  fetchPrescriptionsRequest,
  createCommunicationRequest,
  fetchDoctorsRequest,
} from "../../features/communication/communicationSlice";

const { TextArea } = Input;
const { Option } = Select;

export default function CommunicationPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((s) => s.auth || {});
  const currentUser = auth.user || {};

  const commState = useSelector((s) => s.communication || {});
  const {
    items: communications = [],
    patients = [],
    doctors = [],
    prescriptions = [],
  } = commState;

  const [searchPatient, setSearchPatient] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prescriptionsForPatient, setPrescriptionsForPatient] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    dispatch(fetchPatientsRequest());
    dispatch(fetchDoctorsRequest());
    dispatch(fetchPrescriptionsRequest());
    dispatch(fetchCommunicationsRequest());
  }, [dispatch]);

  // ------------------- FILTER PATIENTS WITH PRESCRIPTIONS -------------------
  const filteredPatients = (patients || []).filter((p) => {
    const hasPrescription = (prescriptions || []).some(
      (pres) => String(pres.patientId) === String(p.id)
    );
    return hasPrescription && (p?.name || "").toLowerCase().includes(searchPatient.toLowerCase());
  });

  const selectPatient = (patient) => {
    setSelectedPatient(patient);
    const pres = (prescriptions || []).filter(
      (p) => String(p.patientId) === String(patient.id)
    );
    setPrescriptionsForPatient(pres);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedPatient?.id || !selectedDoctor) {
      message.warning("Select patient, doctor and type message");
      return;
    }

    const communication = {
      patientId: selectedPatient.id,
      nurseId: currentUser.id,
      doctorId: selectedDoctor,
      query: newMessage.trim(),
      reply: "",
      status: "pending",
      timestamp: new Date().toISOString(),
    };

    dispatch(createCommunicationRequest(communication));

    // 🚨 Doctor-specific notification
    const notification = {
      roles: ["doctor"],
      userId: selectedDoctor, // this ensures notification goes to selected doctor only
      message: `New query from Nurse ${currentUser.name} for patient ${selectedPatient.name}`,
      redirect: "/doctor-communications",
      timestamp: new Date().toISOString(),
      readBy: [],
    };

    dispatch({ type: "notification/createNotificationRequest", payload: notification });

    setNewMessage("");
    setSelectedDoctor(null);
    message.success("Query sent successfully!");
  };

  return (
    <div style={{ display: "flex", gap: 16, padding: 24, backgroundColor: "#f0f2f5" }}>
      {/* Patients List */}
      <Card style={{ width: 280, height: "80vh", overflowY: "auto", borderRadius: 12 }} title="Patients">
        <Input
          placeholder="Search patient..."
          value={searchPatient}
          onChange={(e) => setSearchPatient(e.target.value)}
          style={{ marginBottom: 12, borderRadius: 8 }}
        />
        <List
          dataSource={filteredPatients}
          renderItem={(p) =>
            p ? (
              <List.Item
                key={p.id}
                style={{ cursor: "pointer", padding: 8, marginBottom: 4 }}
                onClick={() => selectPatient(p)}
              >
                <List.Item.Meta
                  avatar={<Avatar style={{ backgroundColor: "#1890ff" }}>{(p.name || "").charAt(0)}</Avatar>}
                  title={<b>{p.name}</b>}
                  description={`${p.age || "-"} yrs, ${p.gender || "-"}`}
                />
              </List.Item>
            ) : null
          }
        />
      </Card>

      {/* Communication Panel */}
      <Card style={{ flex: 1, display: "flex", flexDirection: "column", height: "80vh", borderRadius: 12, padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <h3>Send Query</h3>
          <Tooltip title="View All Communications">
            <Button type="default" icon={<ProfileOutlined />} onClick={() => navigate("/all-communications")} />
          </Tooltip>
        </div>

        {selectedPatient ? (
          <>
            <Select
              placeholder="Select doctor"
              style={{ width: 220, marginBottom: 12 }}
              value={selectedDoctor}
              onChange={(value) => setSelectedDoctor(value)}
            >
              {(doctors || []).map((doc) =>
                doc ? <Option key={doc.id} value={doc.id}>{doc.name}</Option> : null
              )}
            </Select>

            <TextArea
              rows={4}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              style={{ marginBottom: 12 }}
            />

            <Button type="primary" style={{ alignSelf: "flex-end" }} onClick={handleSendMessage}>
              Send
            </Button>
          </>
        ) : (
          <p style={{ textAlign: "center", color: "#888", marginTop: 40 }}>Select a patient to send a message</p>
        )}
      </Card>

      {/* Patient Info & Prescriptions */}
      {selectedPatient && (
        <Card style={{ width: 320, height: "80vh", overflowY: "auto", borderRadius: 12, padding: 16 }}>
          <h3>Patient Info</h3>
          <p><b>Name:</b> {selectedPatient.name}</p>
          <p><b>Age:</b> {selectedPatient.age}</p>
          <p><b>Gender:</b> {selectedPatient.gender}</p>
          <p><b>Contact:</b> {selectedPatient.contact}</p>

          <Divider />
          <h4>Prescriptions</h4>
          <List
            dataSource={prescriptionsForPatient}
            renderItem={(pres) =>
              pres ? (
                <List.Item key={pres.id} style={{ borderBottom: "1px solid #f0f0f0", padding: 12 }}>
                  <div>
                    <b>Date:</b> {pres.prescribedDate}
                    <br />
                    <b>Doctor:</b> {doctors.find((d) => String(d.id) === String(pres.doctorId))?.name || pres.doctorId}
                    <br />
                    <b>Status:</b> {pres.status}
                    <br />
                    <b>Notes:</b> {pres.notes || "—"}
                    <br />
                    {pres.medicines?.length > 0 && (
                      <>
                        <b>Medicines:</b>
                        <ul style={{ margin: 4, paddingLeft: 18 }}>
                          {pres.medicines.map((m, idx) => (
                            <li key={idx}>{m.medicineName} - {m.dosage}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </List.Item>
              ) : null
            }
          />
        </Card>
      )}
    </div>
  );
}
