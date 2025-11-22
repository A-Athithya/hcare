import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Card, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";

export default function PatientsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list: patients, loading } = useSelector((s) => s.patients);

  const [filter, setFilter] = useState("");

  useEffect(() => {
    dispatch({ type: "patients/fetchStart" });
  }, [dispatch]);


const filterText = filter.toLowerCase();

const filtered = patients.filter((p) => {
  return (
    p.name?.toLowerCase().includes(filterText) ||
    p.contact?.toLowerCase().includes(filterText) ||
    p.gender?.toLowerCase().includes(filterText) ||
    p.allergies?.toLowerCase().includes(filterText) ||
    p.bloodGroup?.toLowerCase().includes(filterText)
  );
});


const cols = [
  { title: "Name", dataIndex: "name" },
  { title: "Age", dataIndex: "age" },
  { title: "Gender", dataIndex: "gender" },
  { title: "Contact", dataIndex: "contact" },
  { title: "Address", dataIndex: "address" },
  { title: "Allergies", dataIndex: "allergies" },   // ⭐ NEW COLUMN

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
    <div style={{ padding: "0px 24px 10px", background: "#fafbfc", minHeight: "85vh" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <h2 style={{ margin: 0 }}>Patients</h2>

        <div style={{ display: "flex", gap: 10 }}>
          <Input
            placeholder="Search patient…"
            style={{ width: 260 }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />

          <Button type="primary" onClick={() => navigate("/patient/add")}>
            + Add Patient
          </Button>
        </div>
      </div>

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
