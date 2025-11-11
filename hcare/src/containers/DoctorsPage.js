import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Card } from "antd";

export default function DoctorsPage() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.doctors);

  useEffect(() => {
    dispatch({ type: "doctors/fetchStart" });
  }, [dispatch]);

  const cols = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Specialization", dataIndex: "specialization", key: "spec" },
    { title: "Contact", dataIndex: "contact", key: "contact" }
  ];

  return (
    <div>
      <h2>Doctors</h2>
      <Card>
        <Table dataSource={list} columns={cols} loading={loading} rowKey="id" />
      </Card>
    </div>
  );
}
