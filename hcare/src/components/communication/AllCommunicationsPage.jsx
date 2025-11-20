import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  message,
  Tag,
  Divider,
  Dropdown,
  Menu,
  Modal,
} from "antd";
import { getData, deleteData } from "../../api/client";
import { useNavigate } from "react-router-dom";
import { EllipsisOutlined } from "@ant-design/icons";

export default function AllCommunicationsPage() {
  const navigate = useNavigate();
  const [communications, setCommunications] = useState([]);
  const [filteredComms, setFilteredComms] = useState([]);
  const [filter, setFilter] = useState("all");
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComm, setSelectedComm] = useState(null);

  const getPatientName = (id) => patients.find((p) => p.id === id)?.name || id;
  const getDoctorName = (id) => doctors.find((d) => d.id === id)?.name || id;

  const fetchData = () => {
    getData("/communications?_sort=timestamp&_order=desc")
      .then((res) => {
        setCommunications(res);
        applyFilter(res, filter);
      })
      .catch(() => message.error("Failed to fetch communications"));

    getData("/patients").then(setPatients);
    getData("/doctors").then(setDoctors);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const applyFilter = (data, selected) => {
    if (selected === "replied") {
      setFilteredComms(data.filter((c) => c.status === "replied"));
    } else if (selected === "pending") {
      setFilteredComms(data.filter((c) => c.status !== "replied"));
    } else {
      setFilteredComms(data);
    }
  };

  const changeFilter = (value) => {
    setFilter(value);
    applyFilter(communications, value);
  };

  const handleEdit = (comm) => navigate(`/edit-communication/${comm.id}`);

  const handleDelete = (comm) => {
    setSelectedComm(comm);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    deleteData(`/communications/${selectedComm.id}`)
      .then(() => {
        message.success("Communication deleted successfully");
        fetchData();
        setIsModalOpen(false);
      })
      .catch(() => message.error("Failed to delete communication"));
  };

  return (
    <div style={{ padding: "24px", background: "#f5f6fa", minHeight: "100vh" }}>
      {/* HEADER */}
      <div style={{ marginBottom: 24, display: "flex", alignItems: "center" }}>
        <Button type="default" onClick={() => navigate(-1)}>
          Back
        </Button>
        <h2
          style={{
            marginLeft: 20,
            fontWeight: 600,
            color: "#1a1a1a",
            fontSize: 24,
          }}
        >
          All Communications
        </h2>
      </div>

      {/* FILTER BUTTONS */}
      <div style={{ marginBottom: 24 }}>
        <Button
          type={filter === "all" ? "primary" : "default"}
          onClick={() => changeFilter("all")}
          style={{ marginRight: 10 }}
        >
          All
        </Button>

        <Button
          type={filter === "replied" ? "primary" : "default"}
          onClick={() => changeFilter("replied")}
          style={{ marginRight: 10 }}
        >
          Replied
        </Button>

        <Button
          type={filter === "pending" ? "primary" : "default"}
          onClick={() => changeFilter("pending")}
        >
          Pending
        </Button>
      </div>

      {/* LIST */}
      {filteredComms.length === 0 ? (
        <Card
          style={{
            textAlign: "center",
            padding: 30,
            fontSize: 16,
            borderRadius: 12,
          }}
        >
          No communications found.
        </Card>
      ) : (
        <Row gutter={[20, 20]}>
          {filteredComms.map((msg) => {
            const menu = (
              <Menu>
                <Menu.Item key="edit" onClick={() => handleEdit(msg)}>
                  ✏️ Edit
                </Menu.Item>
                <Menu.Item key="delete" onClick={() => handleDelete(msg)}>
                  ❌ Delete
                </Menu.Item>
              </Menu>
            );

            return (
              <Col xs={24} sm={24} md={12} lg={8} key={msg.id}>
                <Card
                  hoverable
                  style={{
                    borderRadius: 14,
                    background: "#fff",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                  }}
                  bodyStyle={{ padding: "20px" }}
                  extra={
                    <Dropdown overlay={menu} trigger={["click"]}>
                      <EllipsisOutlined
                        style={{
                          fontSize: 22,
                          cursor: "pointer",
                          padding: 6,
                          borderRadius: "50%",
                        }}
                      />
                    </Dropdown>
                  }
                >
                  <p style={{ marginBottom: 6 }}>
                    <b>Patient:</b> {getPatientName(msg.patientId)}
                  </p>

                  <p style={{ marginBottom: 6 }}>
                    <b>Doctor:</b> {getDoctorName(msg.doctorId)}
                  </p>

                  <Divider style={{ margin: "12px 0" }} />

                  <div
                    style={{
                      background: "#f8f9fb",
                      padding: 12,
                      borderRadius: 8,
                      border: "1px solid #eee",
                      marginBottom: 12,
                    }}
                  >
                    <b>Query:</b>
                    <p style={{ marginTop: 6 }}>{msg.query}</p>
                  </div>

                  <div
                    style={{
                      background: "#fdfdfd",
                      padding: 12,
                      borderRadius: 8,
                      border: "1px solid #eee",
                      marginBottom: 12,
                    }}
                  >
                    <b>Reply:</b>
                    <p style={{ marginTop: 6 }}>
                      {msg.reply || (
                        <span style={{ color: "#888" }}>Pending</span>
                      )}
                    </p>
                  </div>

                  <p style={{ marginBottom: 10 }}>
                    <b>Status:</b>{" "}
                    {msg.status === "replied" ? (
                      <Tag color="green">Replied</Tag>
                    ) : (
                      <Tag color="orange">Pending</Tag>
                    )}
                  </p>

                  <p style={{ fontSize: 13, color: "#777" }}>
                    <b>Time:</b>{" "}
                    {msg.timestamp
                      ? new Date(msg.timestamp).toLocaleString()
                      : "-"}
                  </p>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {/* DELETE CONFIRMATION */}
      <Modal
        title="Confirm Delete"
        open={isModalOpen}
        onOk={confirmDelete}
        onCancel={() => setIsModalOpen(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p style={{ fontSize: 15 }}>
          Are you sure you want to delete this communication?
        </p>
      </Modal>
    </div>
  );
}
