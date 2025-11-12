// src/containers/PatientManagementPage.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Table, Input, Button, Modal, Space, Tag, Popconfirm, message } from "antd";
import { useNavigate } from "react-router-dom";
import PatientForm from "../components/Forms/PatientForm";


export default function PatientManagementPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list = [], loading } = useSelector((s) => s.patients || {});

  // optional role guard: provider nurse only
  const auth = useSelector((s) => s.auth || {});
  const role = auth.user?.role;

  const [filter, setFilter] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null); // patient object when editing

  useEffect(() => {
    dispatch({ type: "patients/fetchStart" });
  }, [dispatch]);

  const openAdd = () => {
    setEditing(null);
    setModalVisible(true);
  };

  const openEdit = (rec) => {
    setEditing(rec);
    setModalVisible(true);
  };

  const handleDeleteOptimistic = async (id) => {
    // optional: implement delete if desired (json-server supports DELETE)
    try {
      await fetch(`http://localhost:4000/patients/${id}`, { method: "DELETE" });
      message.success("Deleted patient");
      dispatch({ type: "patients/fetchStart" });
    } catch {
      message.error("Delete failed");
    }
  };

  const filtered = list.filter((p) => p.name?.toLowerCase().includes(filter.toLowerCase()));

  const cols = [
    { title: "Name", dataIndex: "name", key: "name", render: (t, r) => <b>{t}</b> },
    { title: "Age", dataIndex: "age", key: "age" },
    { title: "Gender", dataIndex: "gender", key: "gender" },
    { title: "Contact", dataIndex: "contact", key: "contact" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s) => (s === "Active" ? <Tag color="green">Active</Tag> : <Tag>{s}</Tag>),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, rec) => (
        <Space>
          <Button type="link" onClick={() => navigate(`/patients/${rec.id}`)}>View</Button>
          <Button type="link" onClick={() => openEdit(rec)}>Edit</Button>
          <Button type="link" onClick={() => navigate(`/appointments?patientId=${rec.id}`)}>New Appt</Button>
          <Popconfirm title="Delete patient?" onConfirm={() => handleDeleteOptimistic(rec.id)}>
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // If role exists and it is not provider/nurse, block UI (simple guard)
  if (role && !["provider", "nurse", "admin"].includes(role)) {
    return (
      <Card style={{ margin: 24 }}>
        <h3>Access denied</h3>
        <p>Your account does not have permission to access Patient Management.</p>
      </Card>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h2>Patient Management</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <Input.Search placeholder="Search patients" onSearch={(v) => setFilter(v)} style={{ width: 260 }} allowClear />
          <Button type="primary" onClick={openAdd}>+ Add Patient</Button>
        </div>
      </div>

      <Card>
        <Table dataSource={filtered} columns={cols} loading={loading} rowKey="id" />
      </Card>

      <Modal
        title={editing ? "Edit Patient" : "Add Patient"}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        destroyOnClose
        width={720}
      >
        <PatientForm
          initial={editing}
          onSaved={() => {
            setModalVisible(false);
            dispatch({ type: "patients/fetchStart" });
          }}
        />
      </Modal>
    </div>
  );
}
