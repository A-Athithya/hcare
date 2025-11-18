import React, { useEffect, useState } from "react";
import { Table, Card, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";

export default function PatientsPage() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/db.json");
        if (res.ok) {
          const data = await res.json();
          setPatients(data.patients || []);
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    load();
  }, []);

  const filtered = patients.filter((p) =>
    p.name?.toLowerCase().includes(filter.toLowerCase())
  );

  const cols = [
    { title: "Name", dataIndex: "name" },
    { title: "Age", dataIndex: "age" },
    { title: "Gender", dataIndex: "gender" },
    { title: "Contact", dataIndex: "contact" },
    { title: "Address", dataIndex: "address" },

    {
      title: "Action",
      render: (_, rec) => (
        <Button type="link" onClick={() => navigate(`/patients/${rec.id}`)}>
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <h2 style={{ margin: 0 }}>Patients</h2>

        <Button type="primary" onClick={() => navigate("/patient/add")}>
          + Add Patient
        </Button>
      </div>

      <Input
        placeholder="Search patient…"
        style={{ width: 260, marginBottom: 12 }}
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <Card>
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
