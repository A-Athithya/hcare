// src/containers/CommunicationModule.js
import React, { useEffect, useState } from "react";
import { Input, List, Card, Avatar, Button, Divider, message, Select, Tooltip } from "antd";
import { getData, postData } from "../../api/client";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ProfileOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

export default function CommunicationPage() {
  const navigate = useNavigate();
  const auth = useSelector((s) => s.auth || {});
  const currentUser = auth.user || {}; // logged-in nurse

  const [patients, setPatients] = useState([]);
  const [allPrescriptions, setAllPrescriptions] = useState([]);
  const [searchPatient, setSearchPatient] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    getData("/patients")
      .then(res => setPatients(res.filter(p => p?.id)))
      .catch(() => message.error("Failed to load patients"));

    getData("/prescriptions")
      .then(res => setAllPrescriptions(res.filter(p => p?.id)))
      .catch(() => message.error("Failed to load prescriptions"));

    getData("/doctors")
      .then(res => setDoctors(res.filter(d => d?.id)))
      .catch(() => message.error("Failed to load doctors list"));
  }, []);

  const patientsWithPrescriptions = patients.filter(
    p => p?.id && allPrescriptions.some(pr => Number(pr.patientId) === Number(p.id))
  );

  const selectPatient = async (patient) => {
    if (!patient?.id) return;
    setSelectedPatient(patient);
    try {
      const pres = await getData(`/prescriptions?patientId=${patient.id}`);
      setPrescriptions(pres.filter(p => p?.id));
      const msgs = await getData(`/communications?patientId=${patient.id}&_sort=timestamp&_order=asc`);
      setMessages(msgs.filter(m => m?.id));
    } catch (err) {
      message.error("Failed to fetch prescriptions/messages");
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedPatient?.id || !selectedDoctor) return;

    const payload = {
      patientId: selectedPatient.id,
      nurseId: currentUser.id, // nurse ID
      doctorId: selectedDoctor,
      query: newMessage,
      reply: "",
      status: "pending",
      timestamp: new Date().toISOString(),
    };

    try {
      const saved = await postData("/communications", payload);
      if (saved?.id) setMessages(prev => [...prev, saved]);

      // send notification to the doctor
      await postData("/notifications", {
        roles: ["doctor"],
        userId: selectedDoctor,
        message: `New query from Nurse ${currentUser.name} for patient ${selectedPatient.name}`,
        redirect: "/doctor-communications",
        timestamp: new Date().toISOString(),
        readBy: [],
      });

      setNewMessage("");
      message.success("Query sent successfully");
    } catch (err) {
      message.error("Failed to send query");
    }
  };

  const filteredPatients = patientsWithPrescriptions
    .filter(p => p?.name)
    .filter(p => p.name.toLowerCase().includes(searchPatient.toLowerCase()));

  return (
    <div style={{ display: "flex", gap: 16, padding: 24, backgroundColor: "#f0f2f5" }}>
      {/* LEFT PANEL */}
      <Card style={{ width: 280, height: "80vh", overflowY: "auto", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} title="Patients">
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
                style={{ cursor: "pointer", borderRadius: 8, padding: 8, transition: "0.2s", marginBottom: 4 }}
                onClick={() => selectPatient(p)}
                onMouseEnter={e => e.currentTarget.style.background = "#e6f7ff"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <List.Item.Meta
                  avatar={<Avatar style={{ backgroundColor: "#1890ff" }}>{p.name?.charAt(0)}</Avatar>}
                  title={<b>{p.name}</b>}
                  description={`${p.age} yrs, ${p.gender}`}
                />
              </List.Item>
            ) : null
          }
        />
      </Card>

      {/* MIDDLE PANEL */}
      <Card style={{ flex: 1, display: "flex", flexDirection: "column", height: "80vh", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3>Messages</h3>
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
              {doctors.map(doc =>
                doc ? (
                  <Option key={doc.id} value={doc.id}>
                    {doc.name}
                  </Option>
                ) : null
              )}
            </Select>

            <TextArea
              rows={4}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              style={{ marginBottom: 12, borderRadius: 8 }}
            />
            <Button type="primary" style={{ alignSelf: "flex-end" }} onClick={handleSendMessage}>
              Send
            </Button>

            <Divider style={{ margin: "24px 0" }} />
            <p style={{ textAlign: "center", color: "#888", marginTop: 40 }}>
              All communications will be visible on the All Communications page.
            </p>
          </>
        ) : (
          <p style={{ textAlign: "center", marginTop: 40, color: "#888" }}>Select a patient to start conversation</p>
        )}
      </Card>

      {/* RIGHT PANEL */}
      {selectedPatient && (
        <Card style={{ width: 320, height: "80vh", overflowY: "auto", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: 16 }}>
          <h3>Patient Info</h3>
          <p><b>Name:</b> {selectedPatient.name}</p>
          <p><b>Age:</b> {selectedPatient.age}</p>
          <p><b>Gender:</b> {selectedPatient.gender}</p>
          <p><b>Contact:</b> {selectedPatient.contact}</p>
          <p><b>Blood Group:</b> {selectedPatient.bloodGroup}</p>
          <p><b>Allergies:</b> {selectedPatient.allergies || "—"}</p>

          <Divider />
          <h4>Prescriptions</h4>
          <List
            dataSource={prescriptions}
            renderItem={pres =>
              pres ? (
                <List.Item style={{ borderBottom: "1px solid #f0f0f0", padding: 12 }}>
                  <div>
                    <b>Date:</b> {pres.prescribedDate} <br />
                    <b>Doctor:</b> {doctors.find(d => d.id === pres.doctorId)?.name || pres.doctorId} <br />
                    <b>Status:</b> {pres.status} <br />
                    <b>Notes:</b> {pres.notes || "—"} <br />
                    {pres.medicines?.length > 0 && (
                      <>
                        <b>Medicines:</b>
                        <ul style={{ margin: 4, paddingLeft: 18 }}>
                          {pres.medicines.map((med, idx) => (
                            <li key={idx}>
                              {med.medicineName} - {med.dosage}, {med.frequency}, Duration: {med.duration}
                            </li>
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
