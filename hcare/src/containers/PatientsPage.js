import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Card } from "antd";

export default function PatientsPage() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.patients);

  useEffect(() => {
    dispatch({ type: "patients/fetchStart" });
  }, [dispatch]);

  const cols = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Age", dataIndex: "age", key: "age" },
    { title: "Contact", dataIndex: "contact", key: "contact" }
  ];

  return (
    <div>
      <h2>Patients</h2>
      <Card>
        <Table dataSource={list} columns={cols} loading={loading} rowKey="id" />
      </Card>
    </div>
  );
}
