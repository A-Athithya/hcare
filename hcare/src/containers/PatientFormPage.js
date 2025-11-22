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
        // ❗ Direct single id call vendam - full list fetch panrom
        const list = await getData("/patients");

        // ✅ Id match aagura patient-ah find panrom
        const patient = list.find(p => String(p.id) === String(id));

        setInitial(patient || {});
      } catch (err) {
        message.error("Patient details load aagala");
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
    <div style={{ padding: "10px 10px" }}>
      <Card
        title={id ? "Edit Patient" : "Add New Patient"}
        bodyStyle={{ padding: 30 }}
        style={{
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          marginTop: 10,
          maxHeight: "98vh",
          overflowY: "auto",
          overflowX: "hidden",
          paddingBottom: 10,
          borderRadius: 10
        }}
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: 60 }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            <Row>
              <Col span={24}>
                <PatientForm
                  initial={initial}
                  onSaved={handleSaved}
                  ref={formRef}
                />
              </Col>
            </Row>

            <div
              style={{
                marginTop: 25,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button onClick={() => navigate("/patients")}>Back to List</Button>

              <div style={{ display: "flex", gap: 10 }}>
                <Button onClick={() => formRef.current?.resetForm()}>
                  Reset
                </Button>

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
