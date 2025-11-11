import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, Select, message, Typography } from "antd";
import { CreditCardOutlined, BankOutlined, QrcodeOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Option } = Select;

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const invoice = location.state?.invoice;
  const [paymentMethod, setPaymentMethod] = useState("credit");

  useEffect(() => {
    if (invoice) {
      form.setFieldsValue({
        amount: invoice.balance.toString(),
      });
    }
  }, [invoice, form]);

  const onFinish = (values) => {
    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      message.success("Payment processed successfully!");
      setLoading(false);
      navigate("/billing");
    }, 2000);
  };

  const handleMethodChange = (value) => {
    setPaymentMethod(value);
  };

  const renderPaymentFields = () => {
    if (paymentMethod === "upi") {
      return (
        <>
          <Form.Item
            label="UPI ID"
            name="upiId"
            rules={[
              { required: true, message: "Please enter your UPI ID!" },
              { pattern: /^[\w.-]+@[\w.-]+$/, message: "Enter a valid UPI ID!" },
            ]}
          >
            <Input placeholder="user@paytm" />
          </Form.Item>
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <QrcodeOutlined style={{ fontSize: "48px", color: "#1890ff" }} />
            <p>Scan QR Code to Pay</p>
          </div>
        </>
      );
    } else if (paymentMethod === "debit") {
      return (
        <>
          <Form.Item
            label="Debit Card Number"
            name="cardNumber"
            rules={[
              { required: true, message: "Please enter your debit card number!" },
              { pattern: /^\d{16}$/, message: "Card number must be 16 digits!" },
            ]}
          >
            <Input placeholder="1234 5678 9012 3456" maxLength={16} />
          </Form.Item>

          <Form.Item
            label="Expiry Date"
            name="expiry"
            rules={[
              { required: true, message: "Please enter expiry date!" },
              { pattern: /^(0[1-9]|1[0-2])\/\d{2}$/, message: "Format: MM/YY" },
            ]}
          >
            <Input placeholder="MM/YY" maxLength={5} />
          </Form.Item>

          <Form.Item
            label="CVV"
            name="cvv"
            rules={[
              { required: true, message: "Please enter CVV!" },
              { pattern: /^\d{3,4}$/, message: "CVV must be 3 or 4 digits!" },
            ]}
          >
            <Input placeholder="123" maxLength={4} />
          </Form.Item>

          <Form.Item
            label="Cardholder Name"
            name="name"
            rules={[{ required: true, message: "Please enter cardholder name!" }]}
          >
            <Input placeholder="John Doe" />
          </Form.Item>
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <BankOutlined style={{ fontSize: "48px", color: "#52c41a" }} />
            <p>Debit Card Payment</p>
          </div>
        </>
      );
    } else {
      return (
        <>
          <Form.Item
            label="Credit Card Number"
            name="cardNumber"
            rules={[
              { required: true, message: "Please enter your credit card number!" },
              { pattern: /^\d{16}$/, message: "Card number must be 16 digits!" },
            ]}
          >
            <Input placeholder="1234 5678 9012 3456" maxLength={16} />
          </Form.Item>

          <Form.Item
            label="Expiry Date"
            name="expiry"
            rules={[
              { required: true, message: "Please enter expiry date!" },
              { pattern: /^(0[1-9]|1[0-2])\/\d{2}$/, message: "Format: MM/YY" },
            ]}
          >
            <Input placeholder="MM/YY" maxLength={5} />
          </Form.Item>

          <Form.Item
            label="CVV"
            name="cvv"
            rules={[
              { required: true, message: "Please enter CVV!" },
              { pattern: /^\d{3,4}$/, message: "CVV must be 3 or 4 digits!" },
            ]}
          >
            <Input placeholder="123" maxLength={4} />
          </Form.Item>

          <Form.Item
            label="Cardholder Name"
            name="name"
            rules={[{ required: true, message: "Please enter cardholder name!" }]}
          >
            <Input placeholder="John Doe" />
          </Form.Item>
        </>
      );
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px" }}>
      <Title level={2} style={{ textAlign: "center" }}>
        {paymentMethod === "upi" ? <QrcodeOutlined /> : <CreditCardOutlined />} Payment Gateway
      </Title>
      <Card>
        <Form layout="vertical" onFinish={onFinish}>
          {renderPaymentFields()}

          <Form.Item
            label="Amount"
            name="amount"
            rules={[
              { required: true, message: "Please enter amount!" },
              { pattern: /^\d+(\.\d{1,2})?$/, message: "Enter a valid amount!" },
            ]}
          >
            <Input placeholder="100.00" prefix="₹" />
          </Form.Item>

          <Form.Item
            label="Payment Method"
            name="method"
            rules={[{ required: true, message: "Please select payment method!" }]}
          >
            <Select placeholder="Select method" onChange={handleMethodChange}>
              <Option value="credit">Credit Card</Option>
              <Option value="debit">Debit Card</Option>
              <Option value="upi">UPI</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Pay Now
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
