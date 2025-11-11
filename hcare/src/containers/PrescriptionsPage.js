import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { List, Card } from "antd";

export default function PrescriptionsPage() {
  const dispatch = useDispatch();
  const { list } = useSelector((s) => s.prescriptions);

  useEffect(() => {
    dispatch({ type: "prescriptions/fetchStart" });
  }, [dispatch]);

  return (
    <div>
      <h2>Prescriptions</h2>
      <Card>
        <List
          dataSource={list}
          renderItem={(it) => (
            <List.Item>
              <div>
                <strong>{it.patientName || it.patient}</strong>
                <div>{(it.meds || []).join(", ")}</div>
              </div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
