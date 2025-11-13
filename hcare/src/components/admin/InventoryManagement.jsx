// src/components/admin/InventoryManagement.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInventoryRequest,
  addInventoryRequest,
  updateInventoryRequest,
  deleteInventoryRequest,
} from "../../features/inventory/inventorySlice";
import {
  Table,
  Card,
  Input,
  Button,
  Modal,
  Form,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "bootstrap/dist/css/bootstrap.min.css";

export default function InventoryManagement() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.inventory);

  const [filter, setFilter] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add / edit / view
  const [selectedItem, setSelectedItem] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchInventoryRequest());
  }, [dispatch]);

  // Search filter
  useEffect(() => {
    const q = filter.toLowerCase();
    setFiltered(
      items.filter(
        (i) =>
          i.medicineName?.toLowerCase().includes(q) ||
          i.category?.toLowerCase().includes(q) ||
          i.status?.toLowerCase().includes(q) ||
          String(i.id).includes(q)
      )
    );
  }, [filter, items]);

  // Modal controls
  const openModal = (mode, record = null) => {
    setModalMode(mode);
    setSelectedItem(record);
    setModalVisible(true);
    if (record) form.setFieldsValue(record);
    else form.resetFields();
  };

  const closeModal = () => {
    setModalVisible(false);
    form.resetFields();
  };

  // Save Item
  const handleSave = () => {
    form.validateFields().then((values) => {
      if (modalMode === "edit") {
        dispatch(
          updateInventoryRequest({ ...selectedItem, ...values })
        );
        message.success("Item updated successfully!");
      } else if (modalMode === "add") {
        dispatch(
          addInventoryRequest({ ...values, id: Date.now().toString() })
        );
        message.success("Item added successfully!");
      }
      closeModal();
    });
  };

  // Delete item
  const handleDelete = (id) => {
    dispatch(deleteInventoryRequest(id));
    message.success("Item deleted successfully!");
  };

  // Columns for table
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
            color:
              text <= 10 ? "red" : text <= 50 ? "orange" : "green",
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
        return (
          <span style={{ color: isExpired ? "red" : "black" }}>
            {text}
          </span>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <span
          style={{
            color:
              text === "Available"
                ? "green"
                : text === "Out of Stock"
                ? "red"
                : "orange",
            fontWeight: "bold",
          }}
        >
          {text}
        </span>
      ),
    },
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
      <h2 style={{ marginBottom: 10 }}>Inventory Management</h2>

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
          placeholder="Search medicine..."
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
          Add Medicine
        </Button>
      </div>

      {/* Table */}
      <Card style={{ borderRadius: 8 }}>
        {!loading && items.length === 0 && (
          <p style={{ textAlign: "center", color: "gray", margin: 0 }}>
            No inventory items found.
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

      {/* Modal (View / Add / Edit) */}
      <Modal
        title={
          modalMode === "view"
            ? "View Medicine"
            : modalMode === "edit"
            ? "Edit Medicine"
            : "Add Medicine"
        }
        open={modalVisible}
        onCancel={closeModal}
        onOk={modalMode === "view" ? closeModal : handleSave}
        okText={modalMode === "view" ? "Close" : "Save"}
        cancelButtonProps={{
          style: { display: modalMode === "view" ? "none" : "inline-block" },
        }}
        width={580}
        bodyStyle={{
          maxHeight: "65vh",
          overflowY: "auto",
          padding: "10px 16px 6px",
        }}
      >
        {modalMode === "view" ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px 16px",
              fontSize: 13.5,
            }}
          >
            {[
              { label: "Medicine Name", value: selectedItem?.medicineName },
              { label: "Category", value: selectedItem?.category },
              { label: "Price", value: `₹${selectedItem?.price}` },
              { label: "Stock", value: selectedItem?.stock },
              { label: "Expire Date", value: selectedItem?.expireDate },
              { label: "Status", value: selectedItem?.status },
              { label: "Manufacturer", value: selectedItem?.manufacturer },
              { label: "SKU", value: selectedItem?.sku },
              { label: "Weight", value: selectedItem?.weight },
              { label: "Generic Name", value: selectedItem?.genericName },
            ].map((item, i) => (
              <div key={i}>
                <strong style={{ color: "#444" }}>{item.label}:</strong>
                <div style={{ color: "#222" }}>{item.value || "-"}</div>
              </div>
            ))}
            <div style={{ gridColumn: "1 / span 2" }}>
              <strong style={{ color: "#444" }}>Details:</strong>
              <div style={{ color: "#222", marginTop: 4 }}>
                {selectedItem?.medicineDetails || "-"}
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
              gap: "8px 16px",
            }}
            size="small"
          >
            <Form.Item
              name="medicineName"
              label="Medicine Name"
              rules={[{ required: true, message: "Enter medicine name" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="category" label="Category">
              <Input />
            </Form.Item>
            <Form.Item name="price" label="Price">
              <Input />
            </Form.Item>
            <Form.Item name="stock" label="Stock">
              <Input />
            </Form.Item>
            <Form.Item name="expireDate" label="Expire Date">
              <Input type="date" />
            </Form.Item>
            <Form.Item name="status" label="Status">
              <Input />
            </Form.Item>
            <Form.Item name="manufacturer" label="Manufacturer">
              <Input />
            </Form.Item>
            <Form.Item name="sku" label="SKU">
              <Input />
            </Form.Item>
            <Form.Item name="weight" label="Weight">
              <Input />
            </Form.Item>
            <Form.Item name="genericName" label="Generic Name">
              <Input />
            </Form.Item>
            <Form.Item
              name="medicineDetails"
              label="Details"
              style={{ gridColumn: "1 / span 2" }}
            >
              <Input.TextArea rows={3} />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
}
