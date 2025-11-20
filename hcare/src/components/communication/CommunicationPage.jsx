import React, { useEffect, useState } from "react";
import {
  Card,
  Input,
  List,
  Avatar,
  Button,
  Divider,
  Select,
  Typography,
  message,
} from "antd";
import { ProfileOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getData, postData } from "../../api/client";

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

export default function CommunicationPage() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [allPrescriptions, setAllPrescriptions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [nurses, setNurses] = useState([]);

  const [searchPatient, setSearchPatient] = useState("");
  const [selectedNurse, setSelectedNurse] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [prescriptions, setPrescriptions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Load data
  useEffect(() => {
    getData("/patients").then((res) => setPatients(res || []));
    getData("/prescriptions").then((res) => setAllPrescriptions(res || []));
    getData("/doctors").then((res) => setDoctors(res || []));
    getData("/nurses").then((res) => setNurses(res || []));
  }, []);

  // Filter patients who have prescriptions
  const patientsWithPrescriptions = patients.filter((p) =>
    allPrescriptions.some((pr) => Number(pr.patientId) === Number(p.id))
  );

  const selectPatient = async (patient) => {
    if (!patient?.id) return;
    setSelectedPatient(patient);
    try {
      const pres = await getData(`/prescriptions?patientId=${patient.id}`);
      setPrescriptions(pres || []);
      const msgs = await getData(
        `/communications?patientId=${patient.id}&_sort=timestamp&_order=asc`
      );
      setMessages(msgs || []);
    } catch {
      message.error("Failed to fetch patient data");
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedPatient?.id || !selectedDoctor || !selectedNurse)
      return;

    const nurse = nurses.find((n) => n.id === selectedNurse);
    const payload = {
      patientId: selectedPatient.id,
      doctorId: selectedDoctor,
      nurseId: selectedNurse,
      query: newMessage,
      reply: "",
      status: "pending",
      timestamp: new Date().toISOString(),
    };

    try {
      const saved = await postData("/communications", payload);
      if (saved?.id) setMessages((prev) => [...prev, saved]);

      await postData("/notifications", {
        roles: ["doctor"],
        userId: selectedDoctor,
        message: `New query from Nurse ${nurse?.name} for patient ${selectedPatient.name}`,
        redirect: "/doctor-communications",
        timestamp: new Date().toISOString(),
        readBy: [],
      });

      setNewMessage("");
      message.success("Query sent successfully");
    } catch {
      message.error("Failed to send query");
    }
  };

  // Filter patients by nurse assignment & search
  const filteredPatients = patientsWithPrescriptions
    .filter((p) =>
      selectedNurse
        ? nurses.find((n) => n.id === selectedNurse)?.assignedPatients?.includes(p.id)
        : true
    )
    .filter((p) => p.name.toLowerCase().includes(searchPatient.toLowerCase()));

  return (
    <div
      style={{
        display: "flex",
        gap: 24,
        padding: 24,
        minHeight: "100vh",
        fontFamily: "Inter, sans-serif",
        fontSize: 14,
      }}
    >
      {/* LEFT PANEL - Patients */}
      <Card
        title={<b>Patients</b>}
        style={{
          width: 280,
          height: "82vh",
          borderRadius: 8,
          boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
          overflowY: "auto",
        }}
      >
        <Select
          placeholder="Select Nurse"
          style={{ width: "100%", marginBottom: 12 }}
          value={selectedNurse}
          onChange={setSelectedNurse}
          allowClear
        >
          {nurses.map((n) => (
            <Option key={n.id} value={n.id}>
              {n.name}
            </Option>
          ))}
        </Select>

        <Input
          placeholder="Search patient..."
          value={searchPatient}
          onChange={(e) => setSearchPatient(e.target.value)}
          style={{ marginBottom: 12, borderRadius: 8 }}
        />

        <List
          dataSource={filteredPatients}
          renderItem={(p) => (
            <List.Item
              key={p.id}
              style={{
                borderRadius: 6,
                padding: 10,
                cursor: "pointer",
                transition: "0.2s",
              }}
              onClick={() => selectPatient(p)}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f5ff")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
            >
              <List.Item.Meta
                avatar={<Avatar style={{ background: "#1677ff" }}>{p.name.charAt(0)}</Avatar>}
                title={<b>{p.name}</b>}
                description={`${p.age} yrs • ${p.gender}`}
              />
            </List.Item>
          )}
        />
      </Card>

      {/* MIDDLE PANEL - Communication */}
      <Card
        style={{
          flex: 1,
          height: "82vh",
          borderRadius: 8,
          boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          padding: 16,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0 }}>
            Communication
          </Title>
          <Button
            type="default"
            shape="circle"
            icon={<ProfileOutlined />}
            onClick={() => navigate("/all-communications")}
          />
        </div>

        {selectedPatient ? (
          <>
            <Select
              placeholder="Select Doctor"
              style={{ width: 250, marginBottom: 12 }}
              value={selectedDoctor}
              onChange={setSelectedDoctor}
            >
              {doctors.map((d) => (
                <Option key={d.id} value={d.id}>
                  {d.name}
                </Option>
              ))}
            </Select>

            <TextArea
              rows={4}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              style={{ marginBottom: 12, borderRadius: 6 }}
            />
            <Button type="primary" onClick={handleSendMessage} style={{ alignSelf: "flex-end" }}>
              Send
            </Button>

            <Divider />

            <Text type="secondary" style={{ textAlign: "center" }}>
              Communications will appear on the All Communications page.
            </Text>
          </>
        ) : (
          <Text type="secondary" style={{ textAlign: "center", marginTop: 40 }}>
            Select a patient to start communication
          </Text>
        )}
      </Card>

      {/* RIGHT PANEL - Patient Info & Prescriptions */}
      {selectedPatient && (
        <Card
          style={{
            width: 320,
            height: "82vh",
            borderRadius: 8,
            boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
            overflowY: "auto",
            padding: 16,
          }}
        >
          <Title level={4}>Patient Info</Title>
          <p>
            <b>Name:</b> {selectedPatient.name}
          </p>
          <p>
            <b>Age:</b> {selectedPatient.age}
          </p>
          <p>
            <b>Gender:</b> {selectedPatient.gender}
          </p>
          <p>
            <b>Contact:</b> {selectedPatient.contact}
          </p>
          <p>
            <b>Blood Group:</b> {selectedPatient.bloodGroup}
          </p>
          <p>
            <b>Allergies:</b> {selectedPatient.allergies || "—"}
          </p>

          <Divider />

          <Title level={5}>Prescriptions</Title>
          <List
            dataSource={prescriptions}
            renderItem={(pres) => (
              <List.Item style={{ padding: 10, borderBottom: "1px solid #f0f0f0" }}>
                <div>
                  <b>Date:</b> {pres.prescribedDate} <br />
                  <b>Doctor:</b>{" "}
                  {doctors.find((d) => d.id === pres.doctorId)?.name || pres.doctorId} <br />
                  <b>Status:</b> {pres.status} <br />
                  <b>Notes:</b> {pres.notes || "—"} <br />
                  {pres.medicines?.length > 0 && (
                    <>
                      <b>Medicines:</b>
                      <ul style={{ marginTop: 5 }}>
                        {pres.medicines.map((med, idx) => (
                          <li key={idx}>
                            {med.medicineName} – {med.dosage} ({med.frequency}), {med.duration}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </List.Item>
            )}
          />
        </Card>
      )}
    </div>
  );
}
