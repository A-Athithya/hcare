import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Card,
  Tag,
  Typography,
  Button,
  Modal,
  Descriptions,
} from "antd";
import { useNavigate } from "react-router-dom";
import client from "../api/client";

const { Title } = Typography;

export default function BillingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { invoices } = useSelector((s) => s.billing);
  const { user, role } = useSelector((state) => state.auth);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    dispatch({ type: "billing/fetchStart" });

    client
      .get("/doctors")
      .then((res) => setDoctors(res.data))
      .catch(() => setDoctors([]));

    client
      .get("/patients")
      .then((res) => setPatients(res.data))
      .catch(() => setPatients([]));
  }, [dispatch]);

  // Fallback to db.json if no invoices loaded
  useEffect(() => {
    if (invoices.length === 0) {
      const loadMock = async () => {
        try {
          const response = await fetch("/db.json");
          if (response.ok) {
            const data = await response.json();

            let invoicesData = data.invoices || [];

            // Apply role-based filtering
            if (role === 'doctor') {
              invoicesData = invoicesData.filter(invoice => invoice.doctorId == user.id);
            } else if (role === 'patient') {
              invoicesData = invoicesData.filter(invoice => invoice.patientId == user.id);
            }
            // Admin sees all invoices

            if (invoicesData.length > 0) {
              dispatch({
                type: "billing/fetchSuccess",
                payload: invoicesData,
              });
            }

            setDoctors(data.doctors || []);
            setPatients(data.patients || []);
          }
        } catch (error) {
          console.error("Mock load error:", error);
        }
      };

      loadMock();
    }
  }, [invoices.length, dispatch, role, user.id]);

  const handleViewDetails = (invoice) => {
    setSelectedInvoice(invoice);
    setIsModalVisible(true);
  };

  const handlePay = (invoice) => {
    setIsModalVisible(false);
    navigate("/payment", { state: { invoice } });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedInvoice(null);
  };

  const getDoctorName = (doctorId) => {
    const doc = doctors.find((d) => d.id === doctorId);
    return doc ? doc.name : "Unknown Doctor";
  };

  const getPatientName = (patientId) => {
    const pat = patients.find((p) => p.id === patientId);
    return pat ? pat.name : "Unknown Patient";
  };

  const calculateDoctorFees = (services) => {
    const consultation = services.find((s) => s.service === "Consultation");
    return consultation ? consultation.amount : 0;
  };

  const calculateMedicinesCost = (services, total) => {
    const doctorFees = calculateDoctorFees(services);
    return total - doctorFees;
  };

  const columns = [
    { title: "Invoice ID", dataIndex: "id", key: "id" },

    {
      title: "Patient",
      key: "patientName",
      render: (_, rec) => getPatientName(rec.patientId),
    },

    {
      title: "Doctor",
      key: "doctorName",
      render: (_, rec) => getDoctorName(rec.doctorId),
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color =
          status === "Unpaid"
            ? "red"
            : status === "Partial"
            ? "orange"
            : "green";
        return <Tag color={color}>{status}</Tag>;
      },
    },

    { title: "Payment Method", dataIndex: "paymentMethod", key: "paymentMethod" },

    { title: "Due Date", dataIndex: "dueDate", key: "dueDate" },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="primary" onClick={() => handleViewDetails(record)}>
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Billing</Title>

      <Card>
        <Table dataSource={invoices} columns={columns} rowKey="id" />
      </Card>

      <Modal
        title="Invoice Details"
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button key="close" onClick={handleModalCancel}>
            Close
          </Button>,

          selectedInvoice &&
            selectedInvoice.balance > 0 && (
              <Button
                key="pay"
                type="primary"
                onClick={() => handlePay(selectedInvoice)}
              >
                Pay
              </Button>
            ),
        ]}
      >
        {selectedInvoice && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Patient Name">
              {getPatientName(selectedInvoice.patientId)}
            </Descriptions.Item>

            <Descriptions.Item label="Doctor Fees">
              ₹{calculateDoctorFees(selectedInvoice.services)}
            </Descriptions.Item>

            <Descriptions.Item label="Medicines Cost">
              ₹{calculateMedicinesCost(
                selectedInvoice.services,
                selectedInvoice.totalAmount
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Total Amount">
              ₹{selectedInvoice.totalAmount}
            </Descriptions.Item>

            <Descriptions.Item label="Amount Paid">
              ₹{selectedInvoice.paidAmount}
            </Descriptions.Item>

            <Descriptions.Item label="Remaining Amount">
              ₹{selectedInvoice.balance}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
