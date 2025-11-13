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
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
} from "@ant-design/icons";

export default function PharmacistsPage() {
  const dispatch = useDispatch();
  const { pharmacists, loading } = useSelector((s) => s.staff);

  const [filter, setFilter] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add / edit / view
  const [selectedPharmacist, setSelectedPharmacist] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchStaffRequest({ role: "pharmacists" }));
  }, [dispatch]);

  // Filter search
  useEffect(() => {
    const q = filter.toLowerCase();
    setFiltered(
      pharmacists.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.licenseNo?.toLowerCase().includes(q) ||
          p.email?.toLowerCase().includes(q) ||
          p.contact?.toLowerCase().includes(q) ||
          p.experience?.toLowerCase().includes(q)
      )
    );
  }, [filter, pharmacists]);

  // Modal controls
  const openModal = (mode, record = null) => {
    setModalMode(mode);
    setSelectedPharmacist(record);
    setModalVisible(true);
    if (record) form.setFieldsValue(record);
    else form.resetFields();
  };

  const closeModal = () => {
    setModalVisible(false);
    form.resetFields();
  };

  // Save pharmacist
  const handleSave = () => {
    form.validateFields().then((values) => {
      if (modalMode === "edit") {
        dispatch(
          updateStaffRequest({
            role: "pharmacists",
            staff: { ...selectedPharmacist, ...values },
          })
        );
        message.success("Pharmacist updated successfully!");
      } else if (modalMode === "add") {
        dispatch(
          addStaffRequest({
            role: "pharmacists",
            staff: { ...values, id: Date.now().toString() },
          })
        );
        message.success("Pharmacist added successfully!");
      }
      closeModal();
    });
  };

  // Delete pharmacist
  const handleDelete = (id) => {
    dispatch(deleteStaffRequest({ role: "pharmacists", id }));
    message.success("Pharmacist deleted successfully!");
  };

  // Table columns
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "License No", dataIndex: "licenseNo", key: "licenseNo" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Contact", dataIndex: "contact", key: "contact" },
    { title: "Experience", dataIndex: "experience", key: "experience" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 6 }}>
          <Button
            type="link"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => openModal("view", record)}
          />
          <Button
            type="link"
            icon={<EditOutlined />}
            size="small"
            onClick={() => openModal("edit", record)}
          />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDelete(record.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "16px 20px" }}>
      <h2 style={{ marginBottom: 10 }}>Pharmacists</h2>

      {/* Top Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 10,
          flexWrap: "wrap",
          gap: 6,
        }}
      >
        <Input
          placeholder="Search pharmacist..."
          style={{ width: 240, height: 32 }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="small"
          onClick={() => openModal("add")}
        >
          Add Pharmacist
        </Button>
      </div>

      {/* Table Section */}
      <Card style={{ borderRadius: 8 }}>
        {!loading && pharmacists.length === 0 && (
          <p style={{ textAlign: "center", color: "gray", margin: 0 }}>
            No pharmacists found.
          </p>
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

      {/* Add / Edit / View Modal */}
      <Modal
        title={
          modalMode === "view"
            ? "View Pharmacist"
            : modalMode === "edit"
            ? "Edit Pharmacist"
            : "Add Pharmacist"
        }
        open={modalVisible}
        onCancel={closeModal}
        onOk={modalMode === "view" ? closeModal : handleSave}
        okText={modalMode === "view" ? "Close" : "Save"}
        cancelButtonProps={{
          style: { display: modalMode === "view" ? "none" : "inline-block" },
        }}
        width={520}
        bodyStyle={{
          maxHeight: "65vh",
          overflowY: "auto",
          padding: "10px 16px 6px",
        }}
      >
        {modalMode === "view" ? (
          <div style={{ textAlign: "center", paddingTop: 4 }}>
            <Avatar
              size={64}
              icon={<UserOutlined />}
              style={{ backgroundColor: "#1890ff", marginBottom: 6 }}
            />
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
                { label: "Name", value: selectedPharmacist?.name },
                { label: "License No", value: selectedPharmacist?.licenseNo },
                { label: "Email", value: selectedPharmacist?.email },
                { label: "Contact", value: selectedPharmacist?.contact },
                { label: "Experience", value: selectedPharmacist?.experience },
              ].map((item, index) => (
                <div key={index}>
                  <strong style={{ color: "#444" }}>{item.label}:</strong>
                  <div style={{ color: "#222", marginTop: 1 }}>
                    {item.value || "-"}
                  </div>
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
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="licenseNo" label="License No">
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Email">
              <Input />
            </Form.Item>
            <Form.Item name="contact" label="Contact">
              <Input />
            </Form.Item>
            <Form.Item name="experience" label="Experience">
              <Input />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
}
