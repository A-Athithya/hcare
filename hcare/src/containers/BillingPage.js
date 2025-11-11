import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Card } from "antd";

export default function BillingPage() {
  const dispatch = useDispatch();
  const { invoices } = useSelector((s) => s.billing);

  useEffect(() => {
    dispatch({ type: "billing/fetchStart" });
  }, [dispatch]);

  const cols = [
    { title: "Invoice ID", dataIndex: "id", key: "id" },
    { title: "Patient", dataIndex: "patient", key: "patient" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    { title: "Status", dataIndex: "status", key: "status" }
  ];

  return (
    <div>
      <h2>Billing & Payments</h2>
      <Card>
        <Table dataSource={invoices} columns={cols} rowKey="id" />
      </Card>
    </div>
  );
}
