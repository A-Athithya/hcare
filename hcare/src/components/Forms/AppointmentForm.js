import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
  Row,
  Col,
  message,
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

  // ⭐ SAME UI AS PATIENT FORM
  const inputStyle = {
    height: 38,
    fontSize: 15,
  };
  const textAreaStyle = {
    minHeight: 38,
    fontSize: 15,
    resize: "vertical",
  };

  // Load patients + doctors
  useEffect(() => {
    async function load() {
      try {
        const [p, d] = await Promise.all([
          getData("/patients"),
          getData("/doctors"),
        ]);
        setPatients(p || []);
        setDoctors(d || []);
      } catch {}
    }
    load();
  }, []);

  // Prefill editing
  useEffect(() => {
    if (initial) {
      form.setFieldsValue({
        patientId: initial.patientId,
        doctorId: initial.doctorId,
        date: dayjs(initial.appointmentDate),
        time: initial.appointmentTime
          ? dayjs(initial.appointmentTime, "hh:mm A")
          : undefined,
        reason: initial.reason || "",
        remarks: initial.remarks || "",
        status: initial.status || "Pending",
      });
    } else {
      form.resetFields();
      if (autoFocusPatientId)
        form.setFieldsValue({ patientId: autoFocusPatientId });
    }
  }, [initial]);

  // submit
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
      style={{ paddingRight: 8, marginTop: "-10px" }}
    >
      <Row gutter={[12, 4]}>
        
        {/* PATIENT */}
        <Col span={8}>
          <Form.Item
            name="patientId"
            label="Patient"
            rules={[{ required: true }]}
            style={{ marginBottom: 8 }}
          >
            <Select placeholder="Select patient" style={inputStyle}>
              {patients.map((p) => (
                <Select.Option key={p.id} value={p.id}>
                  {p.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        {/* DOCTOR */}
        <Col span={8}>
          <Form.Item
            name="doctorId"
            label="Doctor"
            rules={[{ required: true }]}
            style={{ marginBottom: 8 }}
          >
            <Select placeholder="Select doctor" style={inputStyle}>
              {doctors.map((d) => (
                <Select.Option key={d.id} value={d.id}>
                  {d.name} {d.specialization ? `• ${d.specialization}` : ""}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        {/* DATE */}
        <Col span={8}>
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true }]}
            style={{ marginBottom: 8 }}
          >
            <DatePicker style={{ width: "100%", ...inputStyle }} />
          </Form.Item>
        </Col>

        {/* TIME */}
        <Col span={8}>
          <Form.Item
            name="time"
            label="Time"
            rules={[{ required: true }]}
            style={{ marginBottom: 8 }}
          >
            <TimePicker
              style={{ width: "100%", ...inputStyle }}
              format="hh:mm A"
              use12Hours
            />
          </Form.Item>
        </Col>

        {/* STATUS */}
        <Col span={8}>
          <Form.Item
            name="status"
            label="Status"
            style={{ marginBottom: 8 }}
          >
            <Select style={inputStyle}>
              <Select.Option value="Pending">Pending</Select.Option>
              <Select.Option value="Completed">Completed</Select.Option>
              <Select.Option value="Cancelled">Cancelled</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        {/* REASON */}
        <Col span={24}>
          <Form.Item
            name="reason"
            label="Reason"
            rules={[{ required: true }]}
            style={{ marginBottom: 8 }}
          >
            <Input style={inputStyle} placeholder="Appointment reason" />
          </Form.Item>
        </Col>

        {/* REMARKS */}
        <Col span={24}>
          <Form.Item name="remarks" label="Remarks" style={{ marginBottom: 8 }}>
            <Input.TextArea style={textAreaStyle} placeholder="Notes" />
          </Form.Item>
        </Col>

      </Row>
    </Form>
  );
}
