// src/containers/PaymentPage.js
import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, Select, message, Typography } from "antd";
import {
  CreditCardOutlined,
  BankOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [form] = Form.useForm();

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const invoice = location.state?.invoice;

  useEffect(() => {
    if (invoice) {
      form.setFieldsValue({
        amount: invoice.balance ?? invoice.amount ?? "",
        method: "credit",
      });
    }
  }, [invoice, form]);

  // ✅ FINAL PAYMENT SUBMIT LOGIC (Saga Based)
  const onFinish = (values) => {
    setLoading(true);

    const payload = {
      patientId: invoice?.patientId,
      doctorId: invoice?.doctorId,
      amount: Number(values.amount),
      method: values.method,
      status: "Paid",
      date: dayjs().format("YYYY-MM-DD"),
    };

    dispatch({
      type: "payment/createStart",
      payload,
    });

    message.success("Payment Success ✅");
    navigate("/billing");
    setLoading(false);
  };

  const renderPaymentFields = () => {
    if (paymentMethod === "upi") {
      return (
        <>
          <Form.Item
            label="UPI ID"
            name="upiId"
            rules={[
              { required: true, message: "UPI ID podu bro" },
              { pattern: /^[\w.-]+@[\w.-]+$/, message: "Invalid UPI ID" },
            ]}
          >
            <Input placeholder="user@upi" />
          </Form.Item>

          <div style={{ textAlign: "center", margin: 20 }}>
            <QrcodeOutlined style={{ fontSize: 40, color: "#1890ff" }} />
            <p>Scan QR to Pay</p>
          </div>
        </>
      );
    }

    return (
      <>
        <Form.Item
          label="Card Number"
          name="cardNumber"
          rules={[
            { required: true, message: "Card number podu" },
            { pattern: /^\d{16}$/, message: "16 digits venum" },
          ]}
        >
          <Input maxLength={16} placeholder="1234567890123456" />
        </Form.Item>

        <Form.Item
          label="Expiry Date"
          name="expiry"
          rules={[{ required: true, message: "MM/YY podu" }]}
        >
          <Input placeholder="MM/YY" maxLength={5} />
        </Form.Item>

        <Form.Item
          label="CVV"
          name="cvv"
          rules={[{ required: true, message: "CVV podu" }]}
        >
          <Input maxLength={4} />
        </Form.Item>

        <Form.Item
          label="Cardholder Name"
          name="name"
          rules={[{ required: true, message: "Name podu" }]}
        >
          <Input />
        </Form.Item>

        <div style={{ textAlign: "center", margin: 20 }}>
          {paymentMethod === "debit" ? (
            <BankOutlined style={{ fontSize: 40, color: "#52c41a" }} />
          ) : (
            <CreditCardOutlined style={{ fontSize: 40, color: "#1890ff" }} />
          )}
          <p>
            {paymentMethod === "debit"
              ? "Debit Card Payment"
              : "Credit Card Payment"}
          </p>
        </div>
      </>
    );
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <Title level={2} style={{ textAlign: "center" }}>
        Payment Gateway
      </Title>

      <Card>
        <Form layout="vertical" onFinish={onFinish} form={form}>
          {renderPaymentFields()}

          <Form.Item
            label="Amount"
            name="amount"
            rules={[{ required: true, message: "Amount podu" }]}
          >
            <Input prefix="₹" />
          </Form.Item>

          <Form.Item
            label="Payment Method"
            name="method"
            rules={[{ required: true, message: "Method select pannu" }]}
          >
            <Select onChange={(v) => setPaymentMethod(v)}>
              <Option value="credit">Credit Card</Option>
              <Option value="debit">Debit Card</Option>
              <Option value="upi">UPI</Option>
            </Select>
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading} block>
            Pay Now
          </Button>
        </Form>
      </Card>
    </div>
  );
}
