// src/components/PatientForm.jsx
import React, { useEffect } from "react";
import { Form, Input, Button, Row, Col, Select, DatePicker, InputNumber, message } from "antd";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { postData, putData } from "../../api/client";


const { TextArea } = Input;

export default function PatientForm({ initial = null, onSaved = () => {} }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    if (initial) {
      // set fields from initial patient
      const copy = { ...initial };
      if (copy.registeredDate) copy.registeredDate = dayjs(copy.registeredDate);
      form.setFieldsValue(copy);
    } else {
      form.resetFields();
    }
  }, [initial, form]);

  const submit = async (vals) => {
    try {
      const payload = {
        ...vals,
        registeredDate: vals.registeredDate ? vals.registeredDate.format("YYYY-MM-DD") : undefined,
      };

      if (initial && initial.id) {
        // update
        await putData(`/patients/${initial.id}`, { ...initial, ...payload });
        dispatch({ type: "patients/updateSuccess", payload: { ...initial, ...payload, id: initial.id } }); // optimistic update
        message.success("Patient updated");
      } else {
        // create
        const created = await postData("/patients", payload);
        dispatch({ type: "patients/createSuccess", payload: created });
        message.success("Patient created");
      }
      onSaved();
    } catch (err) {
      console.error(err);
      message.error("Save failed");
    }
  };

  return (
    <Form layout="vertical" form={form} onFinish={submit} initialValues={{ gender: "Male", status: "Active" }}>
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>

        <Col span={6}>
          <Form.Item name="age" label="Age" rules={[{ required: true }]}>
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
        </Col>

        <Col span={6}>
          <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Male">Male</Select.Option>
              <Select.Option value="Female">Female</Select.Option>
              <Select.Option value="Other">Other</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={12}>
        <Col span={12}>
          <Form.Item name="contact" label="Contact" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="address" label="Address">
        <Input />
      </Form.Item>

      <Row gutter={12}>
        <Col span={12}>
          <Form.Item name="bloodGroup" label="Blood Group">
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="registeredDate" label="Registered Date">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="medicalHistory" label="Medical History">
        <TextArea rows={3} />
      </Form.Item>

      <Form.Item name="allergies" label="Allergies">
        <Input />
      </Form.Item>

      <Form.Item name="emergencyContact" label="Emergency Contact">
        <Input />
      </Form.Item>

      <Form.Item name="status" label="Status" rules={[{ required: true }]}>
        <Select>
          <Select.Option value="Active">Active</Select.Option>
          <Select.Option value="Inactive">Inactive</Select.Option>
        </Select>
      </Form.Item>

      <div style={{ textAlign: "right" }}>
        <Button onClick={() => form.resetFields()} style={{ marginRight: 8 }}>
          Reset
        </Button>
        <Button type="primary" htmlType="submit">
          {initial ? "Update Patient" : "Create Patient"}
        </Button>
      </div>
    </Form>
  );
}
