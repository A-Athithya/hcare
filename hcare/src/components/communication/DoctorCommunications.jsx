// src/components/Doctor/DoctorCommunications.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCommunicationsRequest,
  updateCommunicationRequest,
  fetchPatientsRequest,
  fetchPrescriptionsRequest,
  fetchDoctorsRequest,
} from "../../features/communication/communicationSlice";

import { Table, Button, Input, Spin, Divider, Modal, Card, Tag, message } from "antd";

const { TextArea } = Input;

export default function DoctorCommunications() {
  const dispatch = useDispatch();
  const authDoctor = useSelector((s) => s.auth.user || {});
  const commState = useSelector((s) => s.communication || {});
  const { patients = [], items = [], prescriptions = [], doctors = [], loading } = commState;

  const [selectedMsg, setSelectedMsg] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const doctorObj = doctors.find((d) => d.email === authDoctor.email);
  const doctorId = doctorObj?.id ?? authDoctor?.id ?? authDoctor?._id;

  /** Initial Fetch */
  useEffect(() => {
    dispatch(fetchDoctorsRequest());
    dispatch(fetchPatientsRequest());
    dispatch(fetchPrescriptionsRequest());
  }, [dispatch]);

  /** Fetch communications */
  useEffect(() => {
    if (doctorId) {
      dispatch(
        fetchCommunicationsRequest({
          query: `?doctorId=${doctorId}&_sort=timestamp&_order=desc`,
        })
      );
    }
  }, [doctorId, dispatch]);

  /** Messages only for this doctor */
  const doctorMessages = useMemo(
    () => items.filter((c) => String(c.doctorId) === String(doctorId)),
    [items, doctorId]
  );

  /** Helpers */
  const getPatientName = (id) => patients.find((p) => String(p.id) === String(id))?.name || `#${id}`;
  const getPatientPrescriptions = (pid) =>
    prescriptions.filter(
      (p) =>
        String(p.patientId) === String(pid) &&
        String(p.doctorId) === String(doctorId)
    );

  /** Reply Handler */
  const sendReply = () => {
    if (!replyText.trim()) return message.warning("Reply cannot be empty");

    const updated = {
      ...selectedMsg,
      reply: replyText,
      status: "replied",
      timestamp: new Date().toISOString(),
    };

    dispatch(updateCommunicationRequest({ id: selectedMsg.id, payload: updated }));

    /** 🔔 Nurse Notification Trigger */
    if (selectedMsg.nurseId) {
      const notification = {
        roles: ["nurse"],
        userId: selectedMsg.nurseId,
        message: `Doctor ${authDoctor.name} replied to your query for patient ${getPatientName(
          selectedMsg.patientId
        )}`,
        redirect: "/all-communications",
        timestamp: new Date().toISOString(),
        readBy: [],
      };

      dispatch({
        type: "notification/createNotificationRequest",
        payload: notification,
      });
    }

    setReplyText("");
    setIsModalVisible(false);

    dispatch(
      fetchCommunicationsRequest({
        query: `?doctorId=${doctorId}&_sort=timestamp&_order=desc`,
      })
    );
  };

  /** Table Columns */
  const columns = [
    {
      title: "Patient",
      dataIndex: "patientId",
      render: (v) => getPatientName(v),
    },
    {
      title: "Query",
      dataIndex: "query",
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (v) =>
        v === "replied" ? (
          <Tag color="green">Replied</Tag>
        ) : (
          <Tag color="orange">Pending</Tag>
        ),
    },
    {
      title: "Time",
      dataIndex: "timestamp",
      render: (v) => (v ? new Date(v).toLocaleString() : "-"),
    },
    {
      title: "Action",
      render: (_, msg) => (
        <Button
          type="primary"
          size="small"
          onClick={() => {
            setSelectedMsg(msg);
            setReplyText(msg.reply || "");
            setIsModalVisible(true);
          }}
        >
          View
        </Button>
      ),
    },
  ];

  if (!doctorId)
    return (
      <div style={{ padding: 20 }}>
        <Spin /> Loading doctor…
      </div>
    );

  return (
    <div style={{ padding: 24 }}>
      <h2>Doctor Communications</h2>

      <Table
        columns={columns}
        dataSource={doctorMessages}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 7 }}
      />

      {/* MODAL - Clean View (NO TIMESTAMP, NO STATUS) */}
      {selectedMsg && (
        <Modal
          open={isModalVisible}
          title={`Patient: ${getPatientName(selectedMsg.patientId)}`}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={650}
        >
          {/* Compact Prescription */}
          <Divider style={{ margin: "6px 0" }}>Prescription</Divider>
          {getPatientPrescriptions(selectedMsg.patientId).length === 0 ? (
            <p style={{ fontSize: 13, color: "#777" }}>No prescriptions</p>
          ) : (
            getPatientPrescriptions(selectedMsg.patientId).map((p) => (
              <Card key={p.id} size="small" style={{ marginBottom: 5, padding: 6 }}>
                <p style={{ margin: 0, fontSize: 13 }}>
                  <b>Date:</b> {p.prescribedDate}
                </p>
                <p style={{ margin: 0, fontSize: 13 }}>
                  <b>Notes:</b> {p.notes}
                </p>
                <p style={{ margin: 0, fontSize: 13 }}>
                  <b>Medicines:</b> {p.medicines?.map((m) => m.medicineName).join(", ")}
                </p>
              </Card>
            ))
          )}

          {/* Query */}
          <Divider style={{ margin: "6px 0" }}>Query</Divider>
          <p>{selectedMsg.query}</p>

          {/* Reply Section */}
          <Divider style={{ margin: "6px 0" }}>Reply</Divider>

          {selectedMsg.status === "pending" ? (
            <>
              <TextArea
                rows={3}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <Button type="primary" block style={{ marginTop: 10 }} onClick={sendReply}>
                Send Reply
              </Button>
            </>
          ) : (
            <p style={{ background: "#f5f5f5", padding: 8, borderRadius: 6 }}>
              {selectedMsg.reply}
            </p>
          )}
        </Modal>
      )}
    </div>
  );
}
