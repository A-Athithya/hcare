// src/components/admin/NursesPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStaffRequest,
  addStaffRequest,
  updateStaffRequest,
  deleteStaffRequest,
} from "../../features/staff/staffSlice";
import {
  Table,
  Card,
  Input,
  Button,
  Modal,
  Form,
  message,
  Avatar,
} from "antd";
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";

export default function NursesPage() {
  const dispatch = useDispatch();
  const { nurses, loading } = useSelector((s) => s.staff);

  const [filter, setFilter] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add / edit / view
  const [selectedNurse, setSelectedNurse] = useState(null);
  const [form] = Form.useForm();

  // Fetch data
  useEffect(() => {
    dispatch(fetchStaffRequest({ role: "nurses" }));
  }, [dispatch]);

  // Filter
  useEffect(() => {
    const q = filter.toLowerCase();
    setFiltered(
      nurses.filter(
        (n) =>
          n.name?.toLowerCase().includes(q) ||
          n.department?.toLowerCase().includes(q) ||
          n.shift?.toLowerCase().includes(q) ||
          n.email?.toLowerCase().includes(q) ||
          n.phone?.toLowerCase().includes(q)
      )
    );
  }, [filter, nurses]);

  // Modal Handlers
  const openModal = (mode, record = null) => {
    setModalMode(mode);
    setSelectedNurse(record);
    setModalVisible(true);
    if (record) form.setFieldsValue(record);
    else form.resetFields();
  };

  const closeModal = () => {
    setModalVisible(false);
    form.resetFields();
  };

  // Save Nurse
  const handleSave = () => {
    form.validateFields().then((values) => {
      if (modalMode === "edit") {
        dispatch(
          updateStaffRequest({ role: "nurses", staff: { ...selectedNurse, ...values } })
        );
        message.success("Nurse updated successfully!");
      } else if (modalMode === "add") {
        dispatch(
          addStaffRequest({ role: "nurses", staff: { ...values, id: Date.now().toString() } })
        );
        message.success("Nurse added successfully!");
      }
      closeModal();
    });
  };

  // Delete Nurse
  const handleDelete = (id) => {
    dispatch(deleteStaffRequest({ role: "nurses", id }));
    message.success("Nurse deleted successfully!");
  };

  // Columns
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Department", dataIndex: "department", key: "department" },
    { title: "Shift", dataIndex: "shift", key: "shift" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 6 }}>
          <Button type="link" icon={<EyeOutlined />} size="small" onClick={() => openModal("view", record)} />
          <Button type="link" icon={<EditOutlined />} size="small" onClick={() => openModal("edit", record)} />
          <Button type="link" danger icon={<DeleteOutlined />} size="small" onClick={() => handleDelete(record.id)} />
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 12 }}>Nurses</h2>

      {/* Top Controls */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 6 }}>
        <Input
          placeholder="Search nurse..."
          style={{ width: 240, height: 32 }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <Button type="primary" icon={<PlusOutlined />} size="small" onClick={() => openModal("add")}>
          Add Nurse
        </Button>
      </div>

      {/* Table */}
      <Card style={{ borderRadius: 8 }}>
        {!loading && nurses.length === 0 && (
          <p style={{ textAlign: "center", color: "gray", margin: 0 }}>No nurses found.</p>
        )}
        <Table
          dataSource={filtered}
          columns={columns}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 7 }}
          size="small"
        />
      </Card>

      {/* Modal */}
      <Modal
        title={modalMode === "view" ? "View Nurse" : modalMode === "edit" ? "Edit Nurse" : "Add Nurse"}
        open={modalVisible}
        onCancel={closeModal}
        onOk={modalMode === "view" ? closeModal : handleSave}
        okText={modalMode === "view" ? "Close" : "Save"}
        cancelButtonProps={{ style: { display: modalMode === "view" ? "none" : "inline-block" } }}
        width={520}
        bodyStyle={{ maxHeight: "65vh", overflowY: "auto", padding: "10px 16px 6px" }}
      >
        {modalMode === "view" ? (
          <div style={{ textAlign: "center", paddingTop: 4 }}>
            <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: "#87d068", marginBottom: 6 }} />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "6px 12px",
                textAlign: "left",
                marginTop: "6px",
                fontSize: 13.5,
              }}
            >
              {[
                { label: "Name", value: selectedNurse?.name },
                { label: "Department", value: selectedNurse?.department },
                { label: "Shift", value: selectedNurse?.shift },
                { label: "Email", value: selectedNurse?.email },
                { label: "Phone", value: selectedNurse?.phone },
              ].map((item, i) => (
                <div key={i}>
                  <strong style={{ color: "#444" }}>{item.label}:</strong>
                  <div style={{ color: "#222", marginTop: 1 }}>{item.value || "-"}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px 14px",
              marginTop: 6,
            }}
            size="small"
          >
            <Form.Item name="name" label="Name" rules={[{ required: true, message: "Enter nurse name" }]}>
              <Input />
            </Form.Item>
            <Form.Item name="department" label="Department">
              <Input />
            </Form.Item>
            <Form.Item name="shift" label="Shift">
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Email">
              <Input />
            </Form.Item>
            <Form.Item name="phone" label="Phone">
              <Input />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
}
