import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStaffRequest,
  addStaffRequest,
  updateStaffRequest,
  deleteStaffRequest,
} from "../../features/staff/staffSlice";
import { Table, Card, Input, Button, message, Tag } from "antd";

export default function Receptionists() {
  const dispatch = useDispatch();
  const { receptionists, loading } = useSelector((s) => s.staff);

  const [mode, setMode] = useState("list"); // list | add | edit | view
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    shift: "",
    email: "",
    contact: "",
    status: "Active",
    address: "",
  });

  useEffect(() => {
    dispatch(fetchStaffRequest({ role: "receptionists" }));
  }, [dispatch]);

  const openAdd = () => {
    setMode("add");
    setSelected(null);
    setFormData({
      name: "",
      shift: "",
      email: "",
      contact: "",
      status: "Active",
      address: "",
    });
  };

  const openEdit = (record) => {
    setMode("edit");
    setSelected(record);
    setFormData({ ...record });
  };

  const openView = (record) => {
    setMode("view");
    setSelected(record);
    setFormData({ ...record });
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
        updateStaffRequest({ role: "receptionists", staff: { ...selected, ...formData } })
      );
      message.success("Receptionist updated successfully!");
    } else if (mode === "add") {
      dispatch(
        addStaffRequest({ role: "receptionists", staff: { ...formData, id: Date.now().toString() } })
      );
      message.success("Receptionist added successfully!");
    }
    dispatch(fetchStaffRequest({ role: "receptionists" }));
    backToList();
  };

  const handleDelete = (id) => {
    dispatch(deleteStaffRequest({ role: "receptionists", id }));
    message.success("Receptionist deleted successfully!");
  };

  const filtered = receptionists.filter(
    (r) =>
      !search ||
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.shift?.toLowerCase().includes(search.toLowerCase()) ||
      r.email?.toLowerCase().includes(search.toLowerCase()) ||
      r.contact?.toLowerCase().includes(search.toLowerCase()) ||
      r.status?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Shift", dataIndex: "shift", key: "shift" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Contact", dataIndex: "contact", key: "contact" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s) => <Tag color={s === "Active" ? "green" : "red"}>{s}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 6 }}>
          <Button size="small" onClick={() => openView(record)}>
            View
          </Button>
          <Button size="small" type="primary" onClick={() => openEdit(record)}>
            Edit
          </Button>
          <Button size="small" danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (mode !== "list") {
    return (
      <div style={{ display: "flex", gap: 24, padding: 24 }}>
        {/* Form Panel */}
        <Card style={{ flex: 1, padding: 20 }}>
          <h2 style={{ marginTop: 0 }}>
            {mode === "view"
              ? "View Receptionist"
              : mode === "edit"
              ? "Edit Receptionist"
              : "Add Receptionist"}
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {[
              { label: "Name", name: "name" },
              { label: "Shift", name: "shift" },
              { label: "Email", name: "email" },
              { label: "Contact", name: "contact" },
              { label: "Status", name: "status" },
              { label: "Address", name: "address", isTextArea: true },
            ].map((item) => (
              <div
                key={item.name}
                style={{ gridColumn: item.isTextArea ? "1 / span 2" : undefined }}
              >
                <label>{item.label}</label>
                {item.isTextArea ? (
                  <textarea
                    name={item.name}
                    value={formData[item.name]}
                    onChange={handleChange}
                    readOnly={mode === "view"}
                    rows={2}
                    style={{
                      width: "100%",
                      padding: 8,
                      borderRadius: 8,
                      border: "1px solid #ccc",
                      resize: "none",
                    }}
                  />
                ) : (
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
                )}
              </div>
            ))}

            {mode !== "view" && (
              <div style={{ gridColumn: "1 / span 2", display: "flex", gap: 8 }}>
                <Button htmlType="submit" type="primary">
                  {mode === "edit" ? "Update" : "Add"}
                </Button>
                <Button
                  type="default"
                  onClick={() => setFormData(selected || { ...formData })}
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

        {/* Preview Panel */}
        <Card style={{ flex: 1, background: "#fafafa", padding: 20 }}>
          <h3>Receptionist Preview</h3>
          {selected ? (
            <>
              <p>
                <strong>Name:</strong> {selected.name || "-"}
              </p>
              <p>
                <strong>Shift:</strong> {selected.shift || "-"}
              </p>
              <p>
                <strong>Email:</strong> {selected.email || "-"}
              </p>
              <p>
                <strong>Contact:</strong> {selected.contact || "-"}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <Tag color={selected.status === "Active" ? "green" : "red"}>
                  {selected.status}
                </Tag>
              </p>
              <p>
                <strong>Address:</strong> {selected.address || "-"}
              </p>
            </>
          ) : (
            <p>Fill the form to see preview here...</p>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h2>Receptionists</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <Input.Search
            placeholder="Search receptionist"
            allowClear
            onSearch={(v) => setSearch(v)}
            style={{ width: 220 }}
          />
          <Button type="primary" onClick={openAdd}>
            Add Receptionist
          </Button>
        </div>
      </div>

      <Card>
        <Table
          rowKey="id"
          dataSource={filtered}
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 7 }}
        />
      </Card>
    </div>
  );
}
