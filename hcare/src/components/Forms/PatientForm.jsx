import React, { useEffect, forwardRef, useImperativeHandle } from "react";
import {
  Form,
  Input,
  Row,
  Col,
  Select,
  DatePicker,
  InputNumber,
  message,
} from "antd";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { postData, putData } from "../../api/client";

const { TextArea } = Input;

const PatientForm = forwardRef(({ initial = null, onSaved = () => {} }, ref) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // ⭐ Make functions available to parent using ref
  useImperativeHandle(ref, () => ({
    submitForm: () => form.submit(),
    resetForm: () => form.resetFields(),
  }));

  useEffect(() => {
    if (initial) {
      const copy = { ...initial };
      if (copy.registeredDate)
        copy.registeredDate = dayjs(copy.registeredDate);
      form.setFieldsValue(copy);
    } else {
      form.resetFields();
    }
  }, [initial, form]);

  const submit = async (vals) => {
    try {
      const payload = {
        ...vals,
        registeredDate: vals.registeredDate
          ? vals.registeredDate.format("YYYY-MM-DD")
          : "",
      };

      if (initial?.id) {
        await putData(`/patients/${initial.id}`, payload);
        dispatch({
          type: "patients/updateSuccess",
          payload: { ...payload, id: initial.id },
        });
        message.success("Patient updated");
      } else {
        const created = await postData("/patients", payload);
        dispatch({ type: "patients/createSuccess", payload: created });
        message.success("Patient created");
      }

      onSaved();
    } catch (err) {
      message.error("Save failed");
    }
  };

  return (
    <div style={{ maxHeight: "75vh", overflowY: "auto", paddingRight: 10 }}>
      <Form
        layout="vertical"
        form={form}
        onFinish={submit}
        initialValues={{ gender: "Male", status: "Active" }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item name="age" label="Age" rules={[{ required: true }]}>
              <InputNumber style={{ width: "100%" }} min={1} />
            </Form.Item>

            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true }]}
            >
              <Select>
                <Select.Option value="Male">Male</Select.Option>
                <Select.Option value="Female">Female</Select.Option>
                <Select.Option value="Other">Other</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="contact" label="Contact" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item name="email" label="Email">
              <Input />
            </Form.Item>

            <Form.Item name="bloodGroup" label="Blood Group">
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="address" label="Address">
              <Input />
            </Form.Item>

            <Form.Item name="registeredDate" label="Registered Date">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item name="medicalHistory" label="Medical History">
              <TextArea rows={3} />
            </Form.Item>

            <Form.Item name="allergies" label="Allergies">
              <Input />
            </Form.Item>

            <Form.Item name="emergencyContact" label="Emergency Contact">
              <Input />
            </Form.Item>

            <Form.Item name="status" label="Status">
              <Select>
                <Select.Option value="Active">Active</Select.Option>
                <Select.Option value="Inactive">Inactive</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
});

export default PatientForm;
