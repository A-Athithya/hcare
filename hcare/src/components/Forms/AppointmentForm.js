import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  TimePicker,
  Divider,
  message,
  Collapse,
  Row,
  Col,
} from "antd";
import dayjs from "dayjs";
import { getData, postData, putData } from "../../api/client";

export default function AppointmentForm({
  initial = null,
  onSaved = () => {},
  autoFocusPatientId = null,
}) {
  const [form] = Form.useForm();
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  /** ------- Load Patients + Doctors ------- **/
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [p, d] = await Promise.all([
          getData("/patients"),
          getData("/doctors"),
        ]);
        if (!mounted) return;
        setPatients(p || []);
        setDoctors(d || []);
      } catch (err) {
        console.error("Load error", err);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  /** ------- Prefill when editing ------- **/
  useEffect(() => {
    if (initial) {
      const values = {
        patientId: initial.patientId,
        doctorId: initial.doctorId,
        date: dayjs(initial.appointmentDate),
        time: initial.appointmentTime
          ? dayjs(initial.appointmentTime, "hh:mm A")
          : undefined,
        reason: initial.reason || "",
        remarks: initial.remarks || "",
        status: initial.status || "Pending",
      };
      form.setFieldsValue(values);
    } else {
      form.resetFields();
      if (autoFocusPatientId)
        form.setFieldsValue({ patientId: autoFocusPatientId });
    }
  }, [initial, autoFocusPatientId, form]);

  /** ------- Submit Handler ------- **/
  const onFinish = async (vals) => {
    try {
      const payload = {
        patientId: vals.patientId,
        doctorId: vals.doctorId,
        appointmentDate: vals.date.format("YYYY-MM-DD"),
        appointmentTime: vals.time.format("hh:mm A"),
        reason: vals.reason,
        remarks: vals.remarks || "",
        status: vals.status || initial?.status || "Pending",
        paymentStatus: initial?.paymentStatus || "Pending",
      };

      if (initial?.id) {
        await putData(`/appointments/${initial.id}`, {
          ...initial,
          ...payload,
        });
        message.success("Appointment updated");
      } else {
        await postData("/appointments", payload);
        message.success("Appointment scheduled");
      }

      onSaved();
    } catch (err) {
      console.error(err);
      message.error("Failed to save appointment");
    }
  };

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={onFinish}
      style={{ paddingRight: 6 }}
    >
      <Collapse defaultActiveKey={["1", "2", "3"]} style={{ marginBottom: 12 }}>
        
        {/* SECTION 1 - PATIENT & DOCTOR */}
        <Collapse.Panel header="Patient & Doctor" key="1">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="patientId"
                label="Patient"
                rules={[{ required: true, message: "Select patient" }]}
              >
                <Select placeholder="Select patient" showSearch optionFilterProp="children">
                  {patients.map((p) => (
                    <Select.Option key={p.id} value={p.id}>
                      {p.name} {p.age ? `• ${p.age}` : ""}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="doctorId"
                label="Doctor"
                rules={[{ required: true, message: "Select doctor" }]}
              >
                <Select placeholder="Select doctor">
                  {doctors.map((d) => (
                    <Select.Option key={d.id} value={d.id}>
                      {d.name} {d.specialization ? `• ${d.specialization}` : ""}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Collapse.Panel>

        {/* SECTION 2 - SCHEDULE */}
        <Collapse.Panel header="Schedule" key="2">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="date"
                label="Date"
                rules={[{ required: true, message: "Select date" }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="time"
                label="Time"
                rules={[{ required: true, message: "Select time" }]}
              >
                <TimePicker
                  style={{ width: "100%" }}
                  use12Hours
                  format="hh:mm A"
                />
              </Form.Item>
            </Col>
          </Row>
        </Collapse.Panel>

        {/* SECTION 3 - REASON & NOTES */}
        <Collapse.Panel header="Reason & Notes" key="3">
          <Form.Item
            name="reason"
            label="Reason"
            rules={[{ required: true, message: "Enter reason" }]}
          >
            <Input placeholder="Reason for appointment" />
          </Form.Item>

          <Form.Item name="remarks" label="Remarks">
            <Input.TextArea rows={3} placeholder="Optional notes" />
          </Form.Item>
        </Collapse.Panel>
      </Collapse>
    </Form>
  );
}
