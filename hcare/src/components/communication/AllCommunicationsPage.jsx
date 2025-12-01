// src/components/communication/AllCommunicationsPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Table, Button, Tag, Divider, Spin, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCommunicationsRequest,
  deleteCommunicationRequest,
  fetchPatientsRequest,
  fetchDoctorsRequest,
} from "../../features/communication/communicationSlice";

export default function AllCommunicationsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const commState = useSelector((s) => s.communication || {});
  const { items = [], patients = [], doctors = [], loading } = commState;

  const [filter, setFilter] = useState("all");
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchCommunicationsRequest());
    dispatch(fetchPatientsRequest());
    dispatch(fetchDoctorsRequest());
  }, [dispatch]);

  const getPatientName = (id) => patients.find((p) => String(p.id) === String(id))?.name || `#${id}`;
  const getDoctorName = (id) => doctors.find((d) => String(d.id) === String(id))?.name || `#${id}`;

  const applyFilter = useMemo(() => {
    if (filter === "replied") return items.filter((c) => c.status === "replied");
    if (filter === "pending") return items.filter((c) => c.status !== "replied");
    return items;
  }, [items, filter]);

  const handleDelete = (commId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this communication?",
      okText: "Yes",
      cancelText: "No",
      okButtonProps: { danger: true },
      onOk: () => dispatch(deleteCommunicationRequest(commId)),
    });
  };

  const columns = [
    {
      title: "Patient",
      dataIndex: "patientId",
      render: (v) => getPatientName(v),
    },
    {
      title: "Doctor",
      dataIndex: "doctorId",
      render: (v) => getDoctorName(v),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (v) => (v === "replied" ? <Tag color="green">Replied</Tag> : <Tag color="orange">Pending</Tag>),
    },
    {
      title: "Time",
      dataIndex: "timestamp",
      render: (v) => (v ? new Date(v).toLocaleString() : "-"),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 6 }}>
          <Button type="link" onClick={() => { setSelectedMsg(record); setIsModalVisible(true); }}>View</Button>
          <Button danger type="text" onClick={() => handleDelete(record.id)}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: "#f5f6fa", minHeight: "100vh" }}>
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center" }}>
        <Button type="default" onClick={() => navigate(-1)}>Back</Button>
        <h2 style={{ marginLeft: 20, fontWeight: 600 }}>All Communications</h2>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <Button type={filter === "all" ? "primary" : "default"} onClick={() => setFilter("all")}>All</Button>
          <Button type={filter === "pending" ? "primary" : "default"} onClick={() => setFilter("pending")}>Pending</Button>
          <Button type={filter === "replied" ? "primary" : "default"} onClick={() => setFilter("replied")}>Replied</Button>
        </div>
      </div>

      {loading ? (
        <Spin tip="Loading..." size="large" />
      ) : (
        <Table
          columns={columns}
          dataSource={applyFilter.slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      )}

      {/* Modal for View */}
      {selectedMsg && (
        <Modal
          open={isModalVisible}
          title={`Patient: ${getPatientName(selectedMsg.patientId)} | Doctor: ${getDoctorName(selectedMsg.doctorId)}`}
          footer={<Button type="primary" onClick={() => setIsModalVisible(false)}>Close</Button>}
          onCancel={() => setIsModalVisible(false)}
          width={700}
        >
          <p><b>Query:</b></p>
          <p>{selectedMsg.query}</p>

          <Divider />

          <p><b>Reply:</b></p>
          {selectedMsg.status === "replied" ? (
            <p>{selectedMsg.reply}</p>
          ) : (
            <p style={{ color: "#888" }}>Pending</p>
          )}

          <Divider />

          <p><b>Status:</b> {selectedMsg.status === "replied" ? <Tag color="green">Replied</Tag> : <Tag color="orange">Pending</Tag>}</p>
          <p><b>Time:</b> {selectedMsg.timestamp ? new Date(selectedMsg.timestamp).toLocaleString() : "-"}</p>
        </Modal>
      )}
    </div>
  );
}
