import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Row, Col, Spin, Button, message } from "antd";
import PatientForm from "../components/Forms/PatientForm";
import { getData } from "../api/client";

export default function PatientFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const formRef = useRef();

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      setLoading(true);
      try {
        const data = await getData(`/patients/${id}`);
        setInitial(data);
      } catch (err) {
        message.error("Failed to load patient");
      }
      setLoading(false);
    };

    load();
  }, [id]);

  const handleSaved = () => {
    message.success("Saved!");
    navigate("/patients");
  };

  return (
    <div style={{ padding: 20 }}>
      <Card
        title={id ? "Edit Patient" : "Add New Patient"}
        bodyStyle={{ padding: 20 }}
        style={{ width: "100%" }}
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: 60 }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            <Row>
              <Col span={24}>
                <PatientForm initial={initial} onSaved={handleSaved} ref={formRef} />
              </Col>
            </Row>

            {/* ⭐ These buttons are OUTSIDE the form now */}
            <div
              style={{
                marginTop: 25,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button onClick={() => navigate("/patients")}>Back to List</Button>

              <div style={{ display: "flex", gap: 10 }}>
                <Button onClick={() => formRef.current?.resetForm()}>Reset</Button>

                <Button
                  type="primary"
                  onClick={() => formRef.current?.submitForm()}
                >
                  {id ? "Update Patient" : "Create Patient"}
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
