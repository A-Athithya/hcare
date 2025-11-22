import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStaffRequest,
  addStaffRequest,
  updateStaffRequest,
  deleteStaffRequest,
} from "../../features/staff/staffSlice";
import { Table, Card, Input, Button, Space, Tag, message } from "antd";

export default function Doctors() {
  const dispatch = useDispatch();
  const { doctors, loading } = useSelector((s) => s.staff);

  const [mode, setMode] = useState("list"); // list | new | edit | view
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    age: "",
    specialization: "",
    department: "",
    qualification: "",
    experience: "",
    contact: "",
    email: "",
    status: "",
    address: "",
    bio: "",
  });

  useEffect(() => {
    dispatch(fetchStaffRequest({ role: "doctors" }));
  }, [dispatch]);

  // Open new / edit / view
  const openNew = () => {
    setSelected(null);
    setFormData({
      name: "",
      gender: "",
      age: "",
      specialization: "",
      department: "",
      qualification: "",
      experience: "",
      contact: "",
      email: "",
      status: "",
      address: "",
      bio: "",
    });
    setMode("new");
  };

  const openEdit = (record) => {
    setSelected(record);
    setFormData({ ...record });
    setMode("edit");
  };

  const openView = (record) => {
    setSelected(record);
    setFormData({ ...record });
    setMode("view");
  };

  const backToList = () => {
    setMode("list");
    setSelected(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (mode === "edit") {
      dispatch(
        updateStaffRequest({ role: "doctors", staff: { ...selected, ...formData } })
      );
      message.success("Doctor updated successfully!");
    } else if (mode === "new") {
      dispatch(
        addStaffRequest({
          role: "doctors",
          staff: { ...formData, id: Date.now().toString() },
        })
      );
      message.success("Doctor added successfully!");
    }
    dispatch(fetchStaffRequest({ role: "doctors" }));
    setMode("list");
  };

  const handleDelete = (id) => {
    dispatch(deleteStaffRequest({ role: "doctors", id }));
    message.success("Doctor deleted successfully!");
  };

  const filtered = doctors.filter(
    (d) =>
      !search ||
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization?.toLowerCase().includes(search.toLowerCase()) ||
      d.department?.toLowerCase().includes(search.toLowerCase()) ||
      d.status?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Specialization", dataIndex: "specialization", key: "specialization" },
    { title: "Department", dataIndex: "department", key: "department" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s) => {
        let color =
          s === "Active" ? "green" : s === "Inactive" ? "red" : "orange";
        return <Tag color={color}>{s}</Tag>;
      },
    },
    { title: "Contact", dataIndex: "contact", key: "contact" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => openView(record)}>
            View
          </Button>
          <Button size="small" type="primary" onClick={() => openEdit(record)}>
            Edit
          </Button>
          <Button size="small" danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  // -----------------------------
  // FULL-WIDTH FORM + PREVIEW
  // -----------------------------
  if (mode !== "list") {
    return (
      <div style={{ padding: 24, display: "flex", gap: 24, height: "100%" }}>
        {/* LEFT PANEL - FORM */}
        <Card style={{ width: "55%", height: "100%", overflowY: "auto", padding: 20 }}>
          <h2 style={{ marginTop: 0 }}>
            {mode === "edit"
              ? "Edit Doctor"
              : mode === "view"
              ? "Doctor Details"
              : "Add Doctor"}
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            {[
              { label: "Name", name: "name" },
              { label: "Gender", name: "gender" },
              { label: "Age", name: "age" },
              { label: "Specialization", name: "specialization" },
              { label: "Department", name: "department" },
              { label: "Qualification", name: "qualification" },
              { label: "Experience", name: "experience" },
              { label: "Contact", name: "contact" },
              { label: "Email", name: "email" },
              { label: "Status", name: "status" },
            ].map((item) => (
              <div key={item.name}>
                <label>{item.label}</label>
                <input
                  name={item.name}
                  value={formData[item.name]}
                  onChange={handleChange}
                  readOnly={mode === "view"}
                  style={{
                    width: "100%",
                    padding: 8,
                    borderRadius: 8,
                    border: "1px solid #ccc",
                  }}
                />
              </div>
            ))}

            <div style={{ gridColumn: "1 / span 2" }}>
              <label>Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                readOnly={mode === "view"}
                rows={2}
                style={{
                  width: "100%",
                  padding: 8,
                  borderRadius: 8,
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <div style={{ gridColumn: "1 / span 2" }}>
              <label>Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                readOnly={mode === "view"}
                rows={2}
                style={{
                  width: "100%",
                  padding: 8,
                  borderRadius: 8,
                  border: "1px solid #ccc",
                }}
              />
            </div>

            {mode !== "view" && (
              <div style={{ gridColumn: "1 / span 2", display: "flex", gap: 8 }}>
                <Button htmlType="submit" type="primary">
                  {mode === "edit" ? "Update Doctor" : "Add Doctor"}
                </Button>
                <Button
                  type="default"
                  onClick={() => setFormData(selected || {})}
                >
                  Reset
                </Button>
              </div>
            )}
          </form>

          <div style={{ marginTop: 12 }}>
            <Button onClick={backToList}>Back to List</Button>
          </div>
        </Card>

        {/* RIGHT PANEL - PREVIEW */}
        <Card
          style={{
            width: "45%",
            height: "100%",
            overflowY: "auto",
            padding: 20,
            background: "#fafafa",
          }}
        >
          {selected ? (
            <>
              <h3>Doctor Preview</h3>
              {Object.entries(selected).map(([key, val]) =>
                key === "status" ? (
                  <p key={key}>
                    <strong>Status:</strong>{" "}
                    <Tag
                      color={
                        val === "Active" ? "green" : val === "Inactive" ? "red" : "orange"
                      }
                    >
                      {val}
                    </Tag>
                  </p>
                ) : (
                  <p key={key}>
                    <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
                    {val || "—"}
                  </p>
                )
              )}
            </>
          ) : (
            <>
              <h3>New Doctor</h3>
              <p>Fill the form to see preview here...</p>
            </>
          )}
        </Card>
      </div>
    );
  }

  // -----------------------------
  // LIST MODE
  // -----------------------------
  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h2 style={{ margin: 0 }}>Doctors</h2>

        <div style={{ display: "flex", gap: 8 }}>
          <Input.Search
            placeholder="Search doctor"
            onSearch={(v) => setSearch(v)}
            allowClear
            style={{ width: 220 }}
          />
          <Button type="primary" onClick={openNew}>
            Add Doctor
          </Button>
        </div>
      </div>

      <Card>
        <Table
          rowKey="id"
          dataSource={filtered}
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 8 }}
        />
      </Card>
    </div>
  );
}
