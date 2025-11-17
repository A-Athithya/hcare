import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, message, Tag, Divider, Dropdown, Menu, Modal } from "antd";
import { getData, deleteData } from "../../api/client"; // make sure you have deleteData API
import { useNavigate } from "react-router-dom";
import { EllipsisOutlined } from "@ant-design/icons";

export default function AllCommunicationsPage() {
  const navigate = useNavigate();
  const [communications, setCommunications] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComm, setSelectedComm] = useState(null);

  // Helper functions
  const getPatientName = (id) => patients.find((p) => p.id === id)?.name || id;
  const getDoctorName = (id) => doctors.find((d) => d.id === id)?.name || id;

  const fetchData = () => {
    getData("/communications?_sort=timestamp&_order=desc")
      .then((res) => setCommunications(res))
      .catch(() => message.error("Failed to fetch communications"));

    getData("/patients")
      .then((res) => setPatients(res))
      .catch(() => message.error("Failed to fetch patients"));

    getData("/doctors")
      .then((res) => setDoctors(res))
      .catch(() => message.error("Failed to fetch doctors"));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Edit action
  const handleEdit = (comm) => {
    navigate(`/edit-communication/${comm.id}`);
  };

  // Delete action
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
    <div style={{ padding: 24 }}>
      <Button type="default" style={{ marginBottom: 20 }} onClick={() => navigate(-1)}>
        Back
      </Button>

      <h2 style={{ marginBottom: 20 }}>All Communications</h2>

      {communications.length === 0 ? (
        <p>No communications found.</p>
      ) : (
        <Row gutter={[16, 16]}>
          {communications.map((msg) => {
            const menu = (
              <Menu>
                <Menu.Item key="edit" onClick={() => handleEdit(msg)}>
                  Edit
                </Menu.Item>
                <Menu.Item key="delete" onClick={() => handleDelete(msg)}>
                  Delete
                </Menu.Item>
              </Menu>
            );

            return (
              <Col xs={24} sm={24} md={12} lg={8} key={msg.id}>
                <Card
                  hoverable
                  style={{ borderRadius: 10, background: "#fafafa", position: "relative" }}
                  extra={
                    <Dropdown overlay={menu} trigger={["click"]}>
                      <EllipsisOutlined style={{ fontSize: 20, cursor: "pointer" }} />
                    </Dropdown>
                  }
                >
                  <p>
                    <b>Patient:</b> {getPatientName(msg.patientId)}
                  </p>
                  <p>
                    <b>Doctor:</b> {getDoctorName(msg.doctorId)}
                  </p>

                  <Divider style={{ margin: "8px 0" }} />

                  <p>
                    <b>Query:</b>
                    <br />
                    <span style={{ color: "#555" }}>{msg.query}</span>
                  </p>

                  <p>
                    <b>Reply:</b>
                    <br />
                    <span style={{ color: msg.reply ? "#333" : "gray" }}>
                      {msg.reply || "Pending"}
                    </span>
                  </p>

                  <p>
                    <b>Status:</b>{" "}
                    {msg.status === "replied" ? <Tag color="green">Replied</Tag> : <Tag color="orange">Pending</Tag>}
                  </p>

                  <p>
                    <b>Time:</b> {msg.timestamp ? new Date(msg.timestamp).toLocaleString() : "-"}
                  </p>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      <Modal
        title="Confirm Delete"
        open={isModalOpen}
        onOk={confirmDelete}
        onCancel={() => setIsModalOpen(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this communication?</p>
      </Modal>
    </div>
  );
}