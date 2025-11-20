import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Input, Button, message, Tag } from "antd";
import { useSelector } from "react-redux";
import { getData, putData, postData } from "../../api/client";

const { TextArea } = Input;

export default function DoctorCommunications() {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth || {});
  const doctorId = auth.user?.id;

  const [communications, setCommunications] = useState([]);
  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    if (!doctorId) return;

    const fetchData = async () => {
      try {
        const [msgs, pats, pres] = await Promise.all([
          getData(`/communications?doctorId=${doctorId}&_sort=timestamp&_order=desc`),
          getData("/patients"),
          getData(`/prescriptions?doctorId=${doctorId}`)
        ]);

        setCommunications(msgs.filter((m) => m.status === "pending"));
        setPatients(pats);
        setPrescriptions(pres);
      } catch (err) {
        message.error("Failed to load data");
      }
    };

    fetchData();
  }, [doctorId]);

  const getPatientName = (id) =>
    patients.find((p) => Number(p.id) === Number(id))?.name || "Unknown";

  const getPrescriptionByPatient = (patientId) => {
    return prescriptions.filter(
      (p) =>
        Number(p.patientId) === Number(patientId) &&
        Number(p.doctorId) === Number(doctorId)
    );
  };

  const handleReply = async (msgId, replyText) => {
    if (!replyText.trim()) {
      message.warning("Reply cannot be empty");
      return;
    }

    const msg = communications.find((m) => m.id === msgId);
    if (!msg) return;

    const updated = {
      ...msg,
      reply: replyText,
      status: "replied",
      timestamp: new Date().toISOString(),
    };

    try {
      await putData(`/communications/${msgId}`, updated);
      setCommunications((prev) => prev.filter((m) => m.id !== msgId));

      // Notification to nurse
      const notifPayload = {
        roles: ["nurse"],
        userId: msg.nurseId,
        message: `Doctor replied to your query for patient ${getPatientName(msg.patientId)}.`,
        redirect: "/all-communications",
        timestamp: new Date().toISOString(),
        readBy: [],
      };
      await postData("/notifications", notifPayload);

      message.success("Reply sent successfully");
    } catch (err) {
      message.error("Failed to send reply");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 20, display: "flex", alignItems: "center" }}>
        <Button type="default" onClick={() => navigate(-1)}>Back</Button>
        <h2 style={{ marginLeft: 20, marginBottom: 0 }}>Doctor Communications</h2>
      </div>

      {communications.length === 0 ? (
        <Card
          style={{
            padding: 30,
            textAlign: "center",
            fontSize: 16,
            background: "#fafafa",
            borderRadius: 12,
          }}
        >
          No pending communications.
        </Card>
      ) : (
        <Row gutter={[20, 20]}>
          {communications.map((msg) => (
            <Col xs={24} sm={24} md={12} lg={8} key={msg.id}>
              <Card
                style={{
                  borderRadius: 12,
                  boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                  paddingBottom: 10,
                }}
                title={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>Patient: {getPatientName(msg.patientId)}</span>
                    <Tag color="red">Pending</Tag>
                  </div>
                }
              >
                {/* Prescription History */}
                <div
                  style={{
                    background: "#f7f9fc",
                    padding: 12,
                    marginBottom: 12,
                    borderRadius: 8,
                    border: "1px solid #e6e6e6",
                  }}
                >
                  <b style={{ fontSize: 14 }}>Prescription History</b>
                  {getPrescriptionByPatient(msg.patientId).length === 0 ? (
                    <p style={{ marginTop: 6 }}>No prescriptions found.</p>
                  ) : (
                    getPrescriptionByPatient(msg.patientId).map((pres) => (
                      <div
                        key={pres.id}
                        style={{
                          marginTop: 10,
                          background: "#fff",
                          padding: 10,
                          borderRadius: 6,
                          border: "1px solid #eee",
                        }}
                      >
                        <p><b>Date:</b> {pres.prescribedDate}</p>
                        <p><b>Next Follow-up:</b> {pres.nextFollowUp}</p>
                        <p><b>Notes:</b> {pres.notes}</p>
                        <b>Medicines:</b>
                        <ul style={{ paddingLeft: 18, marginTop: 5 }}>
                          {pres.medicines.map((m) => (
                            <li key={m.medicineId}>
                              {m.medicineName} — {m.dosage}, {m.frequency} ({m.duration})
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))
                  )}
                </div>

                {/* Query */}
                <p style={{ marginBottom: 5 }}><b>Query:</b></p>
                <p
                  style={{
                    background: "#fafafa",
                    padding: 10,
                    borderRadius: 6,
                    border: "1px solid #eee",
                    marginBottom: 12,
                  }}
                >
                  {msg.query}
                </p>

                {/* Reply */}
                <TextArea
                  id={`reply-box-${msg.id}`}
                  placeholder="Type your reply..."
                  rows={2}
                  style={{ borderRadius: 8, marginBottom: 10 }}
                />
                <Button
                  type="primary"
                  block
                  onClick={() => {
                    const replyText = document.querySelector(`#reply-box-${msg.id}`).value;
                    handleReply(msg.id, replyText);
                  }}
                >
                  Send Reply
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
