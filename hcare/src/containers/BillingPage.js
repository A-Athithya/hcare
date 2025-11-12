import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Card, Tag, Typography, Button, Modal, Descriptions } from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

export default function BillingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { invoices } = useSelector((s) => s.billing);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    dispatch({ type: "billing/fetchStart" });
  }, [dispatch]);

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

  const calculateDoctorFees = (services) => {
    const consultation = services.find(s => s.service === "Consultation");
    return consultation ? consultation.amount : 0;
  };

  const calculateMedicinesCost = (services, total) => {
    const doctorFees = calculateDoctorFees(services);
    return total - doctorFees;
  };

  const cols = [
    { title: "Invoice ID", dataIndex: "id", key: "id" },
    { title: "Patient", dataIndex: "patientName", key: "patientName" },
    { title: "Doctor", dataIndex: "doctorName", key: "doctorName" },
    { title: "Status", dataIndex: "status", key: "status", render: (status) => {
      let color = "green";
      if (status === "Unpaid") color = "red";
      else if (status === "Partial") color = "orange";
      return <Tag color={color}>{status}</Tag>;
    }},
    { title: "Payment Method", dataIndex: "paymentMethod", key: "paymentMethod" },
    { title: "Due Date", dataIndex: "dueDate", key: "dueDate" },
    { title: "Action", key: "action", render: (_, record) => (
      <Button type="primary" onClick={() => handleViewDetails(record)}>
        View Details
      </Button>
    )}
  ];

  return (
    <div>
      <Title level={2}>Billing</Title>
      <Card>
        <Table dataSource={invoices} columns={cols} rowKey="id" />
      </Card>
      <Modal
        title="Invoice Details"
        visible={isModalVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button key="close" onClick={handleModalCancel}>
            Close
          </Button>,
          selectedInvoice && selectedInvoice.balance > 0 && (
            <Button key="pay" type="primary" onClick={() => handlePay(selectedInvoice)}>
              Pay
            </Button>
          )
        ]}
      >
        {selectedInvoice && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Patient Name">{selectedInvoice.patientName}</Descriptions.Item>
            <Descriptions.Item label="Doctor Fees">₹{calculateDoctorFees(selectedInvoice.services)}</Descriptions.Item>
            <Descriptions.Item label="Medicines Cost">₹{calculateMedicinesCost(selectedInvoice.services, selectedInvoice.totalAmount)}</Descriptions.Item>
            <Descriptions.Item label="Total Amount">₹{selectedInvoice.totalAmount}</Descriptions.Item>
            <Descriptions.Item label="Amount Paid">₹{selectedInvoice.paidAmount}</Descriptions.Item>
            <Descriptions.Item label="Remaining Amount">₹{selectedInvoice.balance}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
