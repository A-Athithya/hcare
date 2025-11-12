import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Card, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";

export default function PatientsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading } = useSelector((s) => s.patients);
  const [filter, setFilter] = useState("");

  useEffect(() => {
  dispatch({ type: "patients/fetchStart" });
  }, [dispatch]);

  const filtered = list.filter((p) =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

  const cols = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Age", dataIndex: "age", key: "age" },
    { title: "Gender", dataIndex: "gender", key: "gender" },
    { title: "Contact", dataIndex: "contact", key: "contact" },
    { title: "Address", dataIndex: "address", key: "address" },
    {
      title: "Action",
      render: (_, rec) => (
        <Button
          type="link"
          onClick={() => navigate(`/patients/${rec.id}`)}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Patients</h2>
      <Input
        placeholder="Search patient..."
        style={{ width: 260, marginBottom: 12 }}
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <Card>
        {!loading && list.length === 0 && (
       <p style={{ textAlign: "center", color: "gray" }}>No patients found.</p>
       )}

        <Table
          dataSource={filtered}
          columns={cols}
          loading={loading}
          rowKey="id"
        />
      </Card>
    </div>
  );
}
