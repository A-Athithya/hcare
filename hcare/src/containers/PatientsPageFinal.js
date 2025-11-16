import React, { useEffect, useState } from "react";
import { Table, Card, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";

export default function PatientsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load data directly from db.json
    const loadPatients = async () => {
      try {
        const response = await fetch('/db.json');
        if (response.ok) {
          const data = await response.json();
          console.log("Loaded patients from db.json:", data.patients);
          setPatients(data.patients || []);
        } else {
          console.error("Failed to load db.json");
          setPatients([]);
        }
      } catch (error) {
        console.error("Error loading patients:", error);
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, []);

  const filtered = patients.filter((p) =>
    p.name && p.name.toLowerCase().includes(filter.toLowerCase())
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
        {!loading && patients.length === 0 && (
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
