import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Row, Col, Input, Button, message } from "antd";
import { getData, putData } from "../../api/client";

const { TextArea } = Input;

export default function DoctorCommunicationsPage() {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [communications, setCommunications] = useState([]);
  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [msgs, pats, pres] = await Promise.all([
          getData(`/communications?doctorId=${doctorId}&_sort=timestamp&_order=desc`),
          getData("/patients"),
          getData(`/prescriptions?doctorId=${doctorId}`),
        ]);

        // Only pending communications
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

      // Remove from pending communications list
      setCommunications((prev) => prev.filter((m) => m.id !== msgId));

      message.success("Reply sent successfully");
    } catch (err) {
      message.error("Failed to send reply");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Button type="default" style={{ marginBottom: 20 }} onClick={() => navigate(-1)}>
        Back
      </Button>

      <h2>Doctor Communications</h2>

      {communications.length === 0 ? (
        <p>No pending communications.</p>
      ) : (
        <Row gutter={[16, 16]}>
          {communications.map((msg) => (
            <Col xs={24} sm={24} md={12} lg={8} key={msg.id}>
              <Card>
                <p><b>Patient:</b> {getPatientName(msg.patientId)}</p>

                {/* Prescription */}
                <div style={{ background: "#fafafa", padding: 10, marginBottom: 10, borderRadius: 6 }}>
                  <b>Prescription from this Doctor:</b>
                  {getPrescriptionByPatient(msg.patientId).length === 0 ? (
                    <p style={{ marginTop: 6 }}>No prescription found.</p>
                  ) : (
                    getPrescriptionByPatient(msg.patientId).map((pres) => (
                      <div key={pres.id} style={{ marginTop: 10 }}>
                        <p><b>Prescribed Date:</b> {pres.prescribedDate}</p>
                        <p><b>Next Follow Up:</b> {pres.nextFollowUp}</p>
                        <p><b>Notes:</b> {pres.notes}</p>

                        <b>Medicines:</b>
                        <ul style={{ paddingLeft: 18 }}>
                          {pres.medicines.map((m) => (
                            <li key={m.medicineId}>
                              {m.medicineName} — {m.dosage}, {m.frequency} ({m.duration})
                            </li>
                          ))}
                        </ul>
                        <hr />
                      </div>
                    ))
                  )}
                </div>

                <p><b>Query:</b> {msg.query}</p>

                {/* Reply box */}
                <TextArea
                  id={`reply-box-${msg.id}`}
                  placeholder="Type your reply..."
                  rows={2}
                />
                <Button
                  type="primary"
                  size="small"
                  style={{ marginTop: 8 }}
                  onClick={() => {
                    const replyText = document.querySelector(`#reply-box-${msg.id}`).value;
                    handleReply(msg.id, replyText);
                  }}
                >
                  Send
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
