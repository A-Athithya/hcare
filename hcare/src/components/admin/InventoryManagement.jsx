// src/components/admin/InventoryManagement.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInventoryRequest,
  addInventoryRequest,
  updateInventoryRequest,
  deleteInventoryRequest,
} from "../../features/inventory/inventorySlice";
import { Table, Card, Input, Button, message, Tag } from "antd";
import dayjs from "dayjs";

export default function InventoryManagement() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.inventory);

  const [mode, setMode] = useState("list"); // list | add | edit | view
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    medicineName: "",
    category: "",
    price: "",
    stock: "",
    expireDate: "",
    status: "Available",
    manufacturer: "",
    sku: "",
    weight: "",
    genericName: "",
    medicineDetails: "",
  });

  useEffect(() => {
    dispatch(fetchInventoryRequest());
  }, [dispatch]);

  const openAdd = () => {
    setMode("add");
    setSelected(null);
    setFormData({
      medicineName: "",
      category: "",
      price: "",
      stock: "",
      expireDate: "",
      status: "Available",
      manufacturer: "",
      sku: "",
      weight: "",
      genericName: "",
      medicineDetails: "",
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
      dispatch(updateInventoryRequest({ ...selected, ...formData }));
      message.success("Item updated successfully!");
    } else if (mode === "add") {
      dispatch(addInventoryRequest({ ...formData, id: Date.now().toString() }));
      message.success("Item added successfully!");
    }
    dispatch(fetchInventoryRequest());
    backToList();
  };

  const handleDelete = (id) => {
    dispatch(deleteInventoryRequest(id));
    message.success("Item deleted successfully!");
  };

  const filtered = items.filter(
    (i) =>
      !search ||
      i.medicineName?.toLowerCase().includes(search.toLowerCase()) ||
      i.category?.toLowerCase().includes(search.toLowerCase()) ||
      i.status?.toLowerCase().includes(search.toLowerCase()) ||
      String(i.id).includes(search)
  );

  const columns = [
    { title: "Medicine Name", dataIndex: "medicineName", key: "medicineName" },
    { title: "Category", dataIndex: "category", key: "category" },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => `₹${text}`,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      render: (text) => (
        <span
          style={{
            color: text <= 10 ? "red" : text <= 50 ? "orange" : "green",
            fontWeight: "bold",
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Expire Date",
      dataIndex: "expireDate",
      key: "expireDate",
      render: (text) => {
        if (!text) return "-";
        const isExpired = dayjs(text).isBefore(dayjs());
        return <span style={{ color: isExpired ? "red" : "black" }}>{text}</span>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <Tag color={text === "Available" ? "green" : text === "Out of Stock" ? "red" : "orange"}>
          {text}
        </Tag>
      ),
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
            {mode === "view" ? "View Medicine" : mode === "edit" ? "Edit Medicine" : "Add Medicine"}
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            {[
              { label: "Medicine Name", name: "medicineName" },
              { label: "Category", name: "category" },
              { label: "Price", name: "price" },
              { label: "Stock", name: "stock" },
              { label: "Expire Date", name: "expireDate", type: "date" },
              { label: "Status", name: "status" },
              { label: "Manufacturer", name: "manufacturer" },
              { label: "SKU", name: "sku" },
              { label: "Weight", name: "weight" },
              { label: "Generic Name", name: "genericName" },
              { label: "Details", name: "medicineDetails", isTextArea: true },
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
                    rows={3}
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
                    type={item.type || "text"}
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
                <Button type="default" onClick={() => setFormData(selected || { ...formData })}>
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
          <h3>Medicine Preview</h3>
          {selected ? (
            <>
              <p><strong>Medicine Name:</strong> {selected.medicineName || "-"}</p>
              <p><strong>Category:</strong> {selected.category || "-"}</p>
              <p><strong>Price:</strong> ₹{selected.price || "-"}</p>
              <p><strong>Stock:</strong> {selected.stock || "-"}</p>
              <p><strong>Expire Date:</strong> {selected.expireDate || "-"}</p>
              <p><strong>Status:</strong> 
                <Tag color={selected.status === "Available" ? "green" : selected.status === "Out of Stock" ? "red" : "orange"}>
                  {selected.status}
                </Tag>
              </p>
              <p><strong>Manufacturer:</strong> {selected.manufacturer || "-"}</p>
              <p><strong>SKU:</strong> {selected.sku || "-"}</p>
              <p><strong>Weight:</strong> {selected.weight || "-"}</p>
              <p><strong>Generic Name:</strong> {selected.genericName || "-"}</p>
              <p><strong>Details:</strong> {selected.medicineDetails || "-"}</p>
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
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h2>Inventory Management</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <Input.Search
            placeholder="Search medicine"
            allowClear
            onSearch={(v) => setSearch(v)}
            style={{ width: 220 }}
          />
          <Button type="primary" onClick={openAdd}>
            Add Medicine
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
