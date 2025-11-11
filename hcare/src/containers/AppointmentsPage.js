import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Card, Button } from "antd";
import client from "../api/client";

export default function AppointmentsPage() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.appointments);

  useEffect(() => {
    dispatch({ type: "appointments/startPolling" }); // starts polling saga
    // also fetch doctors/patients for mapping if needed
    dispatch({ type: "doctors/fetchStart" });
    dispatch({ type: "patients/fetchStart" });
    // cleanup: optionally cancel polling by dispatching a STOP action (not implemented here)
  }, [dispatch]);

  const accept = async (appt) => {
    // update via json-server
    try {
      const updated = { ...appt, status: "Accepted" };
      await client.put(`/appointments/${appt.id}`, updated);
      dispatch({ type: "appointments/updateStatus", payload: { id: appt.id, status: "Accepted" } });
    } catch (e) {
      // show error
    }
  };

  const reject = async (appt) => {
    try {
      const updated = { ...appt, status: "Rejected" };
      await client.put(`/appointments/${appt.id}`, updated);
      dispatch({ type: "appointments/updateStatus", payload: { id: appt.id, status: "Rejected" } });
    } catch (e) {}
  };

  const cols = [
    { title: "Patient ID", dataIndex: "patientId", key: "patientId" },
    { title: "Doctor ID", dataIndex: "doctorId", key: "doctorId" },
    { title: "Date", dataIndex: "appointmentDate", key: "date" },
    { title: "Time", dataIndex: "appointmentTime", key: "time" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Actions",
      key: "actions",
      render: (_, rec) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button size="small" onClick={() => accept(rec)} disabled={rec.status === "Accepted"}>
            Accept
          </Button>
          <Button size="small" danger onClick={() => reject(rec)} disabled={rec.status === "Rejected"}>
            Reject
          </Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <h2>Appointments</h2>
      <Card>
        <Table dataSource={list} columns={cols} loading={loading} rowKey="id" />
      </Card>
    </div>
  );
}
