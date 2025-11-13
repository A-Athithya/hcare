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

export default function DoctorsPage() {
  const dispatch = useDispatch();
  const { doctors, loading } = useSelector((s) => s.staff);

  const [filter, setFilter] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add / edit / view
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchStaffRequest({ role: "doctors" }));
  }, [dispatch]);

  // Filter search
  useEffect(() => {
    const q = filter.toLowerCase();
    setFiltered(
      doctors.filter(
        (d) =>
          d.name?.toLowerCase().includes(q) ||
          d.specialization?.toLowerCase().includes(q) ||
          d.department?.toLowerCase().includes(q) ||
          d.status?.toLowerCase().includes(q)
      )
    );
  }, [filter, doctors]);

  // Modal controls
  const openModal = (mode, record = null) => {
    setModalMode(mode);
    setSelectedDoctor(record);
    setModalVisible(true);
    if (record) form.setFieldsValue(record);
    else form.resetFields();
  };

  const closeModal = () => {
    setModalVisible(false);
    form.resetFields();
  };

  // Save doctor
  const handleSave = () => {
    form.validateFields().then((values) => {
      if (modalMode === "edit") {
        dispatch(
          updateStaffRequest({
            role: "doctors",
            staff: { ...selectedDoctor, ...values },
          })
        );
        message.success("Doctor updated successfully!");
      } else if (modalMode === "add") {
        dispatch(
          addStaffRequest({
            role: "doctors",
            staff: { ...values, id: Date.now().toString() },
          })
        );
        message.success("Doctor added successfully!");
      }
      closeModal();
    });
  };

  // Delete doctor
  const handleDelete = (id) => {
    dispatch(deleteStaffRequest({ role: "doctors", id }));
    message.success("Doctor deleted successfully!");
  };

  // Table columns
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Specialization", dataIndex: "specialization", key: "specialization" },
    { title: "Department", dataIndex: "department", key: "department" },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "Contact", dataIndex: "contact", key: "contact" },
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
      <h2 style={{ marginBottom: 10 }}>Doctors</h2>

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
          placeholder="Search doctor..."
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
          Add Doctor
        </Button>
      </div>

      <Card style={{ borderRadius: 8 }}>
        {!loading && doctors.length === 0 && (
          <p style={{ textAlign: "center", color: "gray", margin: 0 }}>
            No doctors found.
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

      {/* Compact Add / Edit / View Modal */}
      <Modal
        title={
          modalMode === "view"
            ? "View Doctor"
            : modalMode === "edit"
            ? "Edit Doctor"
            : "Add Doctor"
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
              style={{ backgroundColor: "#87d068", marginBottom: 6 }}
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
                { label: "Name", value: selectedDoctor?.name },
                { label: "Gender", value: selectedDoctor?.gender },
                { label: "Age", value: selectedDoctor?.age },
                { label: "Specialization", value: selectedDoctor?.specialization },
                { label: "Department", value: selectedDoctor?.department },
                { label: "Qualification", value: selectedDoctor?.qualification },
                { label: "Experience", value: selectedDoctor?.experience },
                { label: "Contact", value: selectedDoctor?.contact },
                { label: "Email", value: selectedDoctor?.email },
                { label: "Status", value: selectedDoctor?.status },
              ].map((item, index) => (
                <div key={index}>
                  <strong style={{ color: "#444" }}>{item.label}:</strong>
                  <div style={{ color: "#222", marginTop: 1 }}>
                    {item.value || "-"}
                  </div>
                </div>
              ))}
              <div style={{ gridColumn: "1 / span 2" }}>
                <strong style={{ color: "#444" }}>Address:</strong>
                <div style={{ color: "#222", marginTop: 1 }}>
                  {selectedDoctor?.address || "-"}
                </div>
              </div>
              <div style={{ gridColumn: "1 / span 2" }}>
                <strong style={{ color: "#444" }}>Bio:</strong>
                <div style={{ color: "#222", marginTop: 1 }}>
                  {selectedDoctor?.bio || "-"}
                </div>
              </div>
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
            <Form.Item name="gender" label="Gender">
              <Input />
            </Form.Item>
            <Form.Item name="age" label="Age">
              <Input />
            </Form.Item>
            <Form.Item name="specialization" label="Specialization">
              <Input />
            </Form.Item>
            <Form.Item name="department" label="Department">
              <Input />
            </Form.Item>
            <Form.Item name="qualification" label="Qualification">
              <Input />
            </Form.Item>
            <Form.Item name="experience" label="Experience">
              <Input />
            </Form.Item>
            <Form.Item name="contact" label="Contact">
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Email">
              <Input />
            </Form.Item>
            <Form.Item name="status" label="Status">
              <Input />
            </Form.Item>
            <Form.Item name="address" label="Address" style={{ gridColumn: "1 / span 2" }}>
              <Input.TextArea rows={2} style={{ resize: "none" }} />
            </Form.Item>
            <Form.Item name="bio" label="Bio" style={{ gridColumn: "1 / span 2" }}>
              <Input.TextArea rows={2} style={{ resize: "none" }} />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
}
