// src/components/admin/NursesPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStaffRequest,
  addStaffRequest,
  updateStaffRequest,
  deleteStaffRequest,
} from "../../features/staff/staffSlice";
import { Table, Card, Input, Button, Space, Tag, message } from "antd";

export default function Nurses() {
  const dispatch = useDispatch();
  const { nurses, loading } = useSelector((s) => s.staff);

  const [mode, setMode] = useState("list"); // list | new | edit | view
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    shift: "",
    email: "",
    phone: "",
    status: "Active",
  });

  useEffect(() => {
    dispatch(fetchStaffRequest({ role: "nurses" }));
  }, [dispatch]);

  const openNew = () => {
    setSelected(null);
    setFormData({
      name: "",
      department: "",
      shift: "",
      email: "",
      phone: "",
      status: "Active",
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
        updateStaffRequest({ role: "nurses", staff: { ...selected, ...formData } })
      );
      message.success("Nurse updated successfully!");
    } else if (mode === "new") {
      dispatch(
        addStaffRequest({ role: "nurses", staff: { ...formData, id: Date.now().toString() } })
      );
      message.success("Nurse added successfully!");
    }
    dispatch(fetchStaffRequest({ role: "nurses" }));
    setMode("list");
  };

  const handleDelete = (id) => {
    dispatch(deleteStaffRequest({ role: "nurses", id }));
    message.success("Nurse deleted successfully!");
  };

  const filtered = nurses.filter(
    (n) =>
      !search ||
      n.name?.toLowerCase().includes(search.toLowerCase()) ||
      n.department?.toLowerCase().includes(search.toLowerCase()) ||
      n.shift?.toLowerCase().includes(search.toLowerCase()) ||
      n.email?.toLowerCase().includes(search.toLowerCase()) ||
      n.phone?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Department", dataIndex: "department", key: "department" },
    { title: "Shift", dataIndex: "shift", key: "shift" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s) => (
        <Tag color={s === "Active" ? "green" : "red"}>{s}</Tag>
      ),
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
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
            {mode === "edit" ? "Edit Nurse" : mode === "view" ? "Nurse Details" : "Add Nurse"}
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
              { label: "Department", name: "department" },
              { label: "Shift", name: "shift" },
              { label: "Email", name: "email" },
              { label: "Phone", name: "phone" },
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

            {mode !== "view" && (
              <div style={{ gridColumn: "1 / span 2", display: "flex", gap: 8 }}>
                <Button htmlType="submit" type="primary">
                  {mode === "edit" ? "Update Nurse" : "Add Nurse"}
                </Button>
                <Button type="default" onClick={() => setFormData(selected || {})}>
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
              <h3>Nurse Preview</h3>
              <p>
                <strong>Name:</strong> {selected.name || "—"}
              </p>
              <p>
                <strong>Department:</strong> {selected.department || "—"}
              </p>
              <p>
                <strong>Shift:</strong> {selected.shift || "—"}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <Tag color={selected.status === "Active" ? "green" : "red"}>
                  {selected.status}
                </Tag>
              </p>
              <p>
                <strong>Email:</strong> {selected.email || "—"}
              </p>
              <p>
                <strong>Phone:</strong> {selected.phone || "—"}
              </p>
            </>
          ) : (
            <>
              <h3>New Nurse</h3>
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
        <h2 style={{ margin: 0 }}>Nurses</h2>

        <div style={{ display: "flex", gap: 8 }}>
          <Input.Search
            placeholder="Search nurse"
            onSearch={(v) => setSearch(v)}
            allowClear
            style={{ width: 220 }}
          />
          <Button type="primary" onClick={openNew}>
            Add Nurse
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
