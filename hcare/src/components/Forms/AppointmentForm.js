import React, { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  TimePicker,
  message,
} from "antd";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { getData, postData, putData } from "../../api/client";

export default function AppointmentForm({ initial = null, onSaved = () => {} }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [patients, setPatients] = React.useState([]);
  const [doctors, setDoctors] = React.useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [p, d] = await Promise.all([getData("/patients"), getData("/doctors")]);
      setPatients(p);
      setDoctors(d);
    };
    fetchData();

    if (initial) {
      const copy = { ...initial };
      copy.date = dayjs(initial.appointmentDate);
      copy.time = dayjs(initial.appointmentTime, "hh:mm A");
      form.setFieldsValue(copy);
    } else {
      form.resetFields();
    }
  }, [initial, form]);

  const onFinish = async (vals) => {
    const payload = {
      patientId: vals.patientId,
      doctorId: vals.doctorId,
      appointmentDate: vals.date.format("YYYY-MM-DD"),
      appointmentTime: vals.time.format("hh:mm A"),
      reason: vals.reason,
      status: initial ? vals.status : "Pending",
      paymentStatus: initial?.paymentStatus || "Pending",
      remarks: vals.remarks || "",
    };

    try {
      if (initial?.id) {
        await putData(`/appointments/${initial.id}`, payload);
        dispatch({ type: "appointments/updateSuccess", payload });
        message.success("Appointment updated");
      } else {
        const created = await postData("/appointments", payload);
        dispatch({ type: "appointments/createSuccess", payload: created });
        message.success("Appointment booked successfully");
      }
      onSaved();
    } catch (err) {
      message.error("Failed to save appointment");
    }
  };

  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Form.Item
        name="patientId"
        label="Select Patient"
        rules={[{ required: true, message: "Please select a patient" }]}
      >
        <Select placeholder="Select Patient">
          {patients.map((p) => (
            <Select.Option key={p.id} value={p.id}>
              {p.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="doctorId"
        label="Select Doctor"
        rules={[{ required: true, message: "Please select a doctor" }]}
      >
        <Select placeholder="Select Doctor">
          {doctors.map((d) => (
            <Select.Option key={d.id} value={d.id}>
              {d.name} ({d.specialization})
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="date" label="Date" rules={[{ required: true }]}>
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item name="time" label="Time" rules={[{ required: true }]}>
        <TimePicker format="hh:mm A" style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item name="reason" label="Reason" rules={[{ required: true }]}>
        <Input placeholder="Reason for appointment" />
      </Form.Item>

      {initial && (
        <Form.Item name="status" label="Status">
          <Select>
            <Select.Option value="Pending">Pending</Select.Option>
            <Select.Option value="Accepted">Accepted</Select.Option>
            <Select.Option value="Completed">Completed</Select.Option>
            <Select.Option value="Cancelled">Cancelled</Select.Option>
          </Select>
        </Form.Item>
      )}

      <Form.Item name="remarks" label="Remarks">
        <Input.TextArea rows={3} />
      </Form.Item>

      <div style={{ textAlign: "right" }}>
        <Button onClick={() => form.resetFields()} style={{ marginRight: 8 }}>
          Reset
        </Button>
        <Button type="primary" htmlType="submit">
          {initial ? "Update Appointment" : "Book Appointment"}
        </Button>
      </div>
    </Form>
  );
}
